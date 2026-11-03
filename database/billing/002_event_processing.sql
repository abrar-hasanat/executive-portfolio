-- Billing lab 02: processing and retry functions, after file 001.
-- Apply once. This also queues the original 500 GB-hour test event.
-- Workato sends it later; queuing it does not change the invoice.
-- Keep the HTTP timeout shorter than the 15-minute claim lease.
-- The functions currently use the database owner's Workato connection.

begin;

create table public.billing_activity (
  id uuid primary key default gen_random_uuid(),
  usage_event_id uuid references public.billing_usage_events(id),
  action text not null check (length(btrim(action)) > 0),
  details jsonb not null default '{}'::jsonb check (jsonb_typeof(details) = 'object'),
  created_at timestamptz not null default now()
);
create index billing_activity_event_idx
  on public.billing_activity (usage_event_id, created_at);
alter table public.billing_activity enable row level security;
revoke all on table public.billing_activity from public, anon, authenticated;

create function public.billing_recover_expired_attempts()
returns integer language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_event public.billing_usage_events%rowtype;
  v_count integer := 0;
begin
  for v_event in
    select e.* from public.billing_usage_events e
    where e.status = 'processing' and e.locked_until <= clock_timestamp()
    order by e.locked_until, e.id limit 100 for update skip locked
  loop
    update public.billing_delivery_attempts a
    set outcome = 'uncertain', finished_at = clock_timestamp(),
        error_message = 'Worker lease expired before a result was recorded.'
    where a.usage_event_id = v_event.id and a.outcome = 'started';
    update public.billing_usage_events e
    set status = 'failed', locked_until = null,
        status_reason = 'Delivery result unknown after worker lease expired. Retry with the same transaction ID.'
    where e.id = v_event.id;
    insert into public.billing_activity (usage_event_id, action, details)
    values (v_event.id, 'delivery_uncertain', '{"reason":"lease_expired"}');
    v_count := v_count + 1;
  end loop;
  return v_count;
end;
$$;

create function public.billing_claim_next_event()
returns table (
  has_work boolean,
  attempt_id text,
  event_id text,
  transaction_id text,
  request_body text
)
language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_event public.billing_usage_events%rowtype;
  v_customer public.billing_customers%rowtype;
  v_attempt_id uuid;
  v_attempt_number integer;
  v_payload jsonb;
  v_reason text;
  v_scan integer;
begin
  perform public.billing_recover_expired_attempts();

  for v_scan in 1..100 loop
    select e.* into v_event from public.billing_usage_events e
    where e.status = 'received'
    order by e.created_at, e.id limit 1 for update skip locked;

    if not found then
      return query select false, null::text, null::text, null::text, null::text;
      return;
    end if;

    v_reason := null;
    if v_event.event_type <> 'storage_usage_v1' then
      v_reason := 'Unsupported event type.';
    elsif v_event.occurred_at is null or not isfinite(v_event.occurred_at) then
      v_reason := 'A valid usage timestamp is required.';
    elsif v_event.occurred_at > clock_timestamp() then
      v_reason := 'Usage timestamp cannot be in the future.';
    elsif v_event.occurred_at < clock_timestamp() - interval '34 days' then
      v_reason := 'Usage is outside the 34-day ingestion window.';
    elsif v_event.gb_hours is null or not
      (v_event.gb_hours > 0 and v_event.gb_hours <= 1000000000000) then
      v_reason := 'GB-hours must be positive and no greater than 1000000000000.';
    elsif v_event.region is null or length(v_event.region) > 100
      or v_event.region !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
      v_reason := 'A region without whitespace or control characters is required.';
    end if;

    if v_reason is not null then
      update public.billing_usage_events e
      set status = 'invalid', status_reason = v_reason, locked_until = null
      where e.id = v_event.id;
      insert into public.billing_activity (usage_event_id, action, details)
      values (v_event.id, 'validation_failed', jsonb_build_object('reason', v_reason));
      continue;
    end if;

    select c.* into v_customer from public.billing_customers c
    where c.customer_code = v_event.customer_code for share;
    if not found then
      v_reason := 'No customer mapping exists for this customer code.';
    elsif not v_customer.active then
      v_reason := 'Customer is inactive.';
    elsif v_customer.metronome_customer_id is null or v_customer.metronome_contract_id is null then
      v_reason := 'Customer or contract mapping is incomplete.';
    elsif exists (
      select 1 from public.billing_delivery_attempts a
      where a.usage_event_id = v_event.id and a.outcome in ('uncertain', 'accepted')
        and a.metronome_customer_id <> v_customer.metronome_customer_id
    ) then
      -- A different customer after an unclear delivery could create a second charge.
      v_reason := 'Mapping changed after a possible delivery. Reconcile vendor usage before retrying.';
    end if;

    if v_reason is not null then
      update public.billing_usage_events e
      set status = 'blocked', status_reason = v_reason, locked_until = null
      where e.id = v_event.id;
      insert into public.billing_activity (usage_event_id, action, details)
      values (v_event.id, 'mapping_blocked', jsonb_build_object('reason', v_reason));
      continue;
    end if;

    v_payload := jsonb_build_array(jsonb_build_object(
      'transaction_id', v_event.transaction_id,
      'customer_id', v_customer.metronome_customer_id::text,
      'event_type', v_event.event_type,
      'timestamp', to_char(v_event.occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
      'properties', jsonb_build_object('gb_hours', v_event.gb_hours::text, 'region', v_event.region)
    ));
    select coalesce(max(a.attempt_number), 0) + 1 into v_attempt_number
    from public.billing_delivery_attempts a where a.usage_event_id = v_event.id;

    insert into public.billing_delivery_attempts (
      usage_event_id, attempt_number, metronome_customer_id, request_payload
    ) values (v_event.id, v_attempt_number, v_customer.metronome_customer_id, v_payload)
    returning id into v_attempt_id;

    update public.billing_usage_events e
    set status = 'processing', status_reason = null,
        locked_until = clock_timestamp() + interval '15 minutes'
    where e.id = v_event.id;
    insert into public.billing_activity (usage_event_id, action, details)
    values (v_event.id, 'delivery_started', jsonb_build_object(
      'attempt_id', v_attempt_id, 'attempt_number', v_attempt_number,
      'metronome_customer_id', v_customer.metronome_customer_id));

    return query select true, v_attempt_id::text, v_event.id::text,
      v_event.transaction_id, v_payload::text;
    return;
  end loop;
  return query select false, null::text, null::text, null::text, null::text;
end;
$$;

create function public.billing_finish_attempt(
  p_attempt_id uuid,
  p_http_status integer,
  p_response_body text default null,
  p_error_message text default null
)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_event_id uuid;
  v_event public.billing_usage_events%rowtype;
  v_attempt public.billing_delivery_attempts%rowtype;
  v_outcome text;
  v_reason text;
  v_http integer := nullif(p_http_status, 0);
begin
  if v_http is not null and (v_http < 100 or v_http > 599) then
    raise exception 'Invalid HTTP status.' using errcode = '22023';
  end if;
  select a.usage_event_id into v_event_id
  from public.billing_delivery_attempts a where a.id = p_attempt_id;
  if not found then
    raise exception 'Delivery attempt does not exist.' using errcode = '22023';
  end if;
  -- All processing helpers lock the event before its attempts.
  select e.* into strict v_event from public.billing_usage_events e
  where e.id = v_event_id for update;
  select a.* into strict v_attempt from public.billing_delivery_attempts a
  where a.id = p_attempt_id for update;

  if v_attempt.outcome <> 'started' or v_event.status <> 'processing' then
    if v_attempt.http_status is distinct from v_http
      or v_attempt.response_body is distinct from p_response_body
      or v_attempt.error_message is distinct from nullif(p_error_message, '') then
      insert into public.billing_activity (usage_event_id, action, details)
      values (v_event.id, 'late_delivery_result', jsonb_build_object(
        'attempt_id', p_attempt_id, 'http_status', v_http,
        'response_body', p_response_body, 'error_message', p_error_message));
    end if;
    return jsonb_build_object('recorded', false, 'already_finished', true,
      'outcome', v_attempt.outcome, 'event_status', v_event.status);
  end if;

  if v_http = 200 and coalesce(p_error_message, '') = ''
    and coalesce(btrim(p_response_body), '') in ('', 'null') then
    -- Current /v1/ingest success response is empty or JSON null.
    v_outcome := 'accepted';
    v_reason := null;
  elsif v_http between 400 and 499 and v_http <> 408 then
    v_outcome := 'failed';
    v_reason := 'Metronome rejected the request (HTTP ' || v_http::text || ').';
  else
    v_outcome := 'uncertain';
    v_reason := 'Delivery result needs review. Retry the same transaction ID after checking the response.';
  end if;

  update public.billing_delivery_attempts a
  set outcome = v_outcome, http_status = v_http, response_body = p_response_body,
      error_message = coalesce(nullif(p_error_message, ''), v_reason),
      finished_at = clock_timestamp()
  where a.id = p_attempt_id;
  update public.billing_usage_events e
  set status = case when v_outcome = 'accepted' then 'accepted' else 'failed' end,
      status_reason = v_reason, locked_until = null
  where e.id = v_event.id;
  insert into public.billing_activity (usage_event_id, action, details)
  values (v_event.id, 'delivery_' || v_outcome,
    jsonb_build_object('attempt_id', p_attempt_id, 'http_status', v_http, 'reason', v_reason));
  return jsonb_build_object('recorded', true, 'already_finished', false,
    'outcome', v_outcome,
    'event_status', case when v_outcome = 'accepted' then 'accepted' else 'failed' end);
end;
$$;

create function public.billing_retry_event(p_event_id uuid)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_event public.billing_usage_events%rowtype;
begin
  select e.* into v_event from public.billing_usage_events e
  where e.id = p_event_id for update;
  if not found then
    raise exception 'Usage event does not exist.' using errcode = '22023';
  end if;
  if v_event.status not in ('blocked', 'failed') then
    return jsonb_build_object('queued', false, 'status', v_event.status,
      'reason', 'Only blocked or failed events can be retried. Invalid input requires a corrected new event.');
  end if;
  update public.billing_usage_events e
  set status = 'received', status_reason = null, locked_until = null
  where e.id = p_event_id;
  insert into public.billing_activity (usage_event_id, action, details)
  values (p_event_id, 'retry_requested', jsonb_build_object('previous_status', v_event.status));
  return jsonb_build_object('queued', true, 'status', 'received',
    'transaction_id', v_event.transaction_id);
end;
$$;

revoke all on function public.billing_recover_expired_attempts() from public, anon, authenticated;
revoke all on function public.billing_claim_next_event() from public, anon, authenticated;
revoke all on function public.billing_finish_attempt(uuid, integer, text, text) from public, anon, authenticated;
revoke all on function public.billing_retry_event(uuid) from public, anon, authenticated;

with fixture as (
  select date_trunc('second', clock_timestamp() - interval '1 minute') as occurred_at
), inserted as (
  insert into public.billing_usage_events (
    transaction_id, customer_code, event_type, occurred_at, gb_hours, region, raw_payload
  )
  select 'lab-northstar-ledger-001', 'northstar', 'storage_usage_v1',
    f.occurred_at, 500, 'us-west-2', jsonb_build_object(
      'transaction_id', 'lab-northstar-ledger-001',
      'customer_code', 'northstar', 'event_type', 'storage_usage_v1',
      'timestamp', to_char(f.occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'properties', jsonb_build_object('gb_hours', '500', 'region', 'us-west-2')
    )
  from fixture f returning id
)
insert into public.billing_activity (usage_event_id, action, details)
select id, 'usage_received', '{"source":"migration_02_calibration"}' from inserted;

commit;

-- Expected: lab-northstar-ledger-001, received, 500, 0 delivery attempts.
select e.transaction_id, e.status, e.gb_hours,
  (select count(*) from public.billing_delivery_attempts a where a.usage_event_id = e.id)
    as delivery_attempts
from public.billing_usage_events e
where e.transaction_id = 'lab-northstar-ledger-001';
