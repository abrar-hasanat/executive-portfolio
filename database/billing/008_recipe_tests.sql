-- Small checks for the two Workato test recipes. No HTTP requests here.
-- The duplicate check reuses an accepted event without creating another one.
-- The invalid check leaves one named negative-usage example in the ledger.
begin;

create or replace function public.billing_test_duplicate()
returns jsonb language plpgsql volatile security invoker set search_path='' as $$
declare
  v_before public.billing_usage_events%rowtype;
  v_after public.billing_usage_events%rowtype;
  v_duplicate jsonb;
  v_conflict jsonb;
  v_attempts bigint;
  v_attempts_after bigint;
  v_rows bigint;
  v_total numeric;
  v_result jsonb;
begin
  select e.* into v_before from public.billing_usage_events e
  where e.transaction_id='lab-northstar-ledger-001' and e.customer_code='northstar'
    and e.status='accepted' for update;
  if not found then raise exception 'The original accepted Northstar event is needed for this check.'; end if;
  select count(*) into v_attempts from public.billing_delivery_attempts where usage_event_id=v_before.id;
  v_duplicate := public.billing_submit_usage_event(v_before.raw_payload);
  v_conflict := public.billing_submit_usage_event(jsonb_set(v_before.raw_payload,
    '{properties,gb_hours}',to_jsonb((v_before.gb_hours+1)::text)));
  select e.* into strict v_after from public.billing_usage_events e where e.id=v_before.id;
  select count(*) into v_rows from public.billing_usage_events where transaction_id=v_before.transaction_id;
  select count(*) into v_attempts_after from public.billing_delivery_attempts where usage_event_id=v_before.id;
  if v_duplicate->>'outcome' is distinct from 'duplicate_ignored'
    or v_conflict->>'outcome' is distinct from 'conflict'
    or v_rows<>1 or v_attempts_after<>v_attempts
    or v_before.raw_payload is distinct from v_after.raw_payload
    or v_before.gb_hours is distinct from v_after.gb_hours
    or v_before.occurred_at is distinct from v_after.occurred_at
    or v_after.status<>'accepted' then
    raise exception 'Duplicate protection check failed. The test transaction was rolled back.';
  end if;
  select s.total_usd into v_total from public.billing_invoice_snapshots s
  join public.billing_customers c on c.id=s.customer_id
  where c.customer_code='northstar' and s.source='metronome_api'
  order by s.captured_at desc,s.id desc limit 1;
  v_result := jsonb_build_object('test','duplicate_intake','passed',true,
    'transaction_id',v_before.transaction_id,'duplicate_outcome',v_duplicate->>'outcome',
    'changed_payload_outcome',v_conflict->>'outcome','event_rows',v_rows,
    'original_event_unchanged',true,'new_delivery_attempts',0,'stored_invoice_usd',v_total);
  insert into public.billing_activity(usage_event_id,action,details)
  values(v_before.id,'test_duplicate_passed',v_result);
  return v_result;
end;
$$;
revoke all on function public.billing_test_duplicate() from public,anon,authenticated;

create or replace function public.billing_test_invalid_usage()
returns jsonb language plpgsql volatile security invoker set search_path='' as $$
declare
  v_transaction constant text := 'lab-northstar-invalid-negative-001';
  v_event public.billing_usage_events%rowtype;
  v_payload jsonb;
  v_submission jsonb;
  v_claim record;
  v_attempts bigint;
  v_total numeric;
  v_result jsonb;
begin
  -- Keep another submission from entering the queue during this short check.
  lock table public.billing_usage_events in share row exclusive mode nowait;
  if exists (select 1 from public.billing_usage_events e
    where e.status in ('received','processing') and e.transaction_id<>v_transaction) then
    raise exception 'Other usage is pending. Finish delivery first, then run this check.';
  end if;
  select e.* into v_event from public.billing_usage_events e where e.transaction_id=v_transaction;
  if found then
    if v_event.customer_code<>'northstar' or v_event.event_type<>'storage_usage_v1'
      or v_event.gb_hours is distinct from (-100)::numeric or v_event.region is distinct from 'us-west-2'
      or v_event.status not in ('received','invalid') then
      raise exception 'The invalid-test ID already has unexpected data. Inspect it first.';
    end if;
    v_payload := v_event.raw_payload;
  else
    v_payload := jsonb_build_object('transaction_id',v_transaction,'customer_code','northstar',
      'event_type','storage_usage_v1',
      'timestamp',to_char((clock_timestamp()-interval '1 minute') at time zone 'UTC',
        'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'),
      'properties',jsonb_build_object('gb_hours','-100','region','us-west-2'));
  end if;
  v_submission := public.billing_submit_usage_event(v_payload);
  select * into v_claim from public.billing_claim_next_event();
  select e.* into strict v_event from public.billing_usage_events e where e.transaction_id=v_transaction;
  select count(*) into v_attempts from public.billing_delivery_attempts where usage_event_id=v_event.id;
  if coalesce(v_claim.has_work,true) or v_event.status<>'invalid' or v_attempts<>0
    or v_event.status_reason is distinct from 'GB-hours must be positive and no greater than 1000000000000.' then
    raise exception 'Negative-usage check failed. The test transaction was rolled back.';
  end if;
  select s.total_usd into v_total from public.billing_invoice_snapshots s
  join public.billing_customers c on c.id=s.customer_id
  where c.customer_code='northstar' and s.source='metronome_api'
  order by s.captured_at desc,s.id desc limit 1;
  v_result := jsonb_build_object('test','invalid_negative_usage','passed',true,
    'transaction_id',v_transaction,'gb_hours',v_event.gb_hours,'event_status',v_event.status,
    'reason',v_event.status_reason,'delivery_attempts',v_attempts,'sent_to_metronome',false,
    'stored_invoice_usd',v_total);
  insert into public.billing_activity(usage_event_id,action,details)
  values(v_event.id,'test_invalid_passed',v_result);
  return v_result;
end;
$$;
revoke all on function public.billing_test_invalid_usage() from public,anon,authenticated;
commit;
