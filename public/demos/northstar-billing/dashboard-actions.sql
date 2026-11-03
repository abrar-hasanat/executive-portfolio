-- Billing lab 07: dashboard submission and retry, after file 006.
-- The approved active email below gets operator permission.
-- No events are queued by this script. File 005 and its fixtures are not needed.
begin;
alter table public.billing_dashboard_viewers
  add column if not exists can_manage_usage boolean not null default false;
update public.billing_dashboard_viewers set can_manage_usage=true
where email='hasanata@carleton.edu' and active;

create or replace function public.billing_submit_usage_event(p_payload jsonb)
returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_transaction text;
  v_customer text;
  v_type text;
  v_timestamp_text text;
  v_timestamp timestamptz;
  v_quantity numeric;
  v_region text;
  v_event public.billing_usage_events%rowtype;
  v_created boolean;
  v_same boolean;
begin
  if jsonb_typeof(p_payload) is distinct from 'object'
     or octet_length(p_payload::text) > 65536 then
    raise exception 'Submit one JSON object no larger than 64 KiB.' using errcode = '22023';
  end if;
  v_transaction := p_payload->>'transaction_id';
  v_customer := p_payload->>'customer_code';
  if jsonb_typeof(p_payload->'transaction_id') is distinct from 'string'
     or v_transaction is null or length(v_transaction) not between 1 and 200
     or v_transaction <> btrim(v_transaction) or v_transaction ~ '[[:cntrl:]]' then
    raise exception 'A stable transaction ID without surrounding whitespace or control characters is required.'
      using errcode = '22023';
  end if;
  if jsonb_typeof(p_payload->'customer_code') is distinct from 'string'
     or v_customer is null or length(btrim(v_customer)) not between 1 and 200 then
    raise exception 'A customer code is required.' using errcode = '22023';
  end if;

  -- Keep the original payload even if parsing fails. The worker can then
  -- mark the bad values as an exception instead of losing the record.
  v_type := case when jsonb_typeof(p_payload->'event_type') = 'string'
    then p_payload->>'event_type' else '' end;
  v_timestamp_text := p_payload->>'timestamp';
  if jsonb_typeof(p_payload->'timestamp') = 'string'
     and v_timestamp_text ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}([.][0-9]{1,6})?(Z|[+-][0-9]{2}:[0-9]{2})$' then
    begin
      v_timestamp := v_timestamp_text::timestamptz;
    exception when invalid_datetime_format or datetime_field_overflow then
      v_timestamp := null;
    end;
  end if;
  if jsonb_typeof(p_payload->'properties') = 'object' then
    if jsonb_typeof(p_payload#>'{properties,gb_hours}') in ('string', 'number') then
      begin
        v_quantity := (p_payload#>>'{properties,gb_hours}')::numeric;
      exception when invalid_text_representation or numeric_value_out_of_range then
        v_quantity := null;
      end;
    end if;
    if jsonb_typeof(p_payload#>'{properties,region}') = 'string' then
      v_region := p_payload#>>'{properties,region}';
    end if;
  end if;

  insert into public.billing_usage_events (
    transaction_id, customer_code, event_type, occurred_at, gb_hours, region,
    raw_payload, created_at
  ) values (
    v_transaction, v_customer, v_type, v_timestamp, v_quantity, v_region,
    p_payload, clock_timestamp()
  ) on conflict (transaction_id) do nothing returning * into v_event;
  v_created := found;
  if v_created then
    insert into public.billing_activity (usage_event_id, action, details)
    values (v_event.id, 'usage_received', '{"source":"submission_function"}'::jsonb);
    return jsonb_build_object('created', true, 'duplicate', false,
      'outcome', 'queued', 'event_id', v_event.id,
      'transaction_id', v_transaction, 'status', v_event.status);
  end if;

  select e.* into v_event from public.billing_usage_events e
  where e.transaction_id = v_transaction for key share;
  if not found then
    raise exception 'Existing event is no longer available. Submit again with the same transaction ID.';
  end if;
  v_same := v_event.raw_payload = p_payload;
  insert into public.billing_activity (usage_event_id, action, details)
  values (v_event.id, case when v_same then 'duplicate_ignored' else 'duplicate_conflict' end,
    case when v_same then jsonb_build_object('transaction_id', v_transaction)
    else jsonb_build_object('transaction_id', v_transaction,
      'reason', 'The existing transaction ID has different original data.',
      'submitted_payload', p_payload) end);
  return jsonb_build_object('created', false, 'duplicate', true,
    'outcome', case when v_same then 'duplicate_ignored' else 'conflict' end,
    'event_id', v_event.id, 'transaction_id', v_transaction, 'status', v_event.status);
end;
$$;

revoke all on function public.billing_submit_usage_event(jsonb)
  from public, anon, authenticated;

create or replace function public.billing_dashboard_operator()
returns uuid language plpgsql stable security definer set search_path='' as $$
declare v_actor uuid := auth.uid();
begin
  if v_actor is null or not exists (
    select 1 from auth.users u join public.billing_dashboard_viewers v
      on v.email=lower(u.email) and v.active and v.can_manage_usage
    where u.id=v_actor
  ) then
    raise exception 'This account is not approved to submit or retry usage.' using errcode='42501';
  end if;
  return v_actor;
end;
$$;
revoke all on function public.billing_dashboard_operator() from public,anon,authenticated;

create or replace function public.billing_dashboard_submit_usage(
  p_transaction_id text, p_gb_hours numeric, p_region text default 'us-west-2'
) returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare
  v_actor uuid;
  v_event public.billing_usage_events%rowtype;
  v_payload jsonb;
  v_result jsonb;
begin
  v_actor := public.billing_dashboard_operator();
  if p_transaction_id is null
     or p_transaction_id !~ '^web-northstar-[a-zA-Z0-9-]{1,100}$' then
    raise exception 'Use the dashboard-generated transaction ID.' using errcode='22023';
  end if;
  if p_gb_hours is null or not (p_gb_hours>0 and p_gb_hours<=1000000) then
    raise exception 'Usage must be positive and no greater than 1000000 GB-hours.' using errcode='22023';
  end if;
  if p_region is distinct from 'us-west-2' then
    raise exception 'This demo supports the us-west-2 region.' using errcode='22023';
  end if;
  if not exists (select 1 from public.billing_customers c where c.customer_code='northstar'
    and c.active and c.metronome_customer_id is not null and c.metronome_contract_id is not null) then
    raise exception 'Northstar customer mapping is incomplete or inactive.';
  end if;
  -- Serialize repeated browser submissions before assigning their server timestamp.
  perform pg_advisory_xact_lock(hashtextextended('billing_dashboard_submit:'||p_transaction_id,0));
  select e.* into v_event from public.billing_usage_events e where e.transaction_id=p_transaction_id;
  if found then
    if v_event.customer_code='northstar' and v_event.event_type='storage_usage_v1'
      and v_event.gb_hours=p_gb_hours and v_event.region=p_region then
      return public.billing_submit_usage_event(v_event.raw_payload);
    end if;
    return jsonb_build_object('created',false,'duplicate',true,'outcome','conflict',
      'transaction_id',p_transaction_id,'status',v_event.status);
  end if;
  v_payload := jsonb_build_object('transaction_id',p_transaction_id,
    'customer_code','northstar','event_type','storage_usage_v1',
    'timestamp',to_char(clock_timestamp() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
    'properties',jsonb_build_object('gb_hours',p_gb_hours::text,'region',p_region));
  v_result := public.billing_submit_usage_event(v_payload);
  if (v_result->>'created')::boolean then
    insert into public.billing_activity(usage_event_id,action,details)
    values((v_result->>'event_id')::uuid,'dashboard_usage_submitted',jsonb_build_object('actor_id',v_actor));
  end if;
  return v_result;
end;
$$;
revoke all on function public.billing_dashboard_submit_usage(text,numeric,text) from public,anon,authenticated;
grant execute on function public.billing_dashboard_submit_usage(text,numeric,text) to authenticated;

create or replace function public.billing_dashboard_retry_usage(p_transaction_id text)
returns jsonb language plpgsql volatile security definer set search_path='' as $$
declare
  v_actor uuid;
  v_id uuid;
  v_result jsonb;
begin
  v_actor := public.billing_dashboard_operator();
  select e.id into v_id from public.billing_usage_events e
  where e.transaction_id=p_transaction_id and e.customer_code='northstar';
  if not found then raise exception 'Northstar event was not found.' using errcode='22023'; end if;
  v_result := public.billing_retry_event(v_id);
  if coalesce((v_result->>'queued')::boolean,false) then
    insert into public.billing_activity(usage_event_id,action,details)
    values(v_id,'dashboard_retry_requested',jsonb_build_object('actor_id',v_actor));
  end if;
  return v_result;
end;
$$;
revoke all on function public.billing_dashboard_retry_usage(text) from public,anon,authenticated;
grant execute on function public.billing_dashboard_retry_usage(text) to authenticated;
notify pgrst,'reload schema';
commit;
select 'Dashboard submission and retry controls ready' as result;
