-- Run in Supabase SQL Editor with the Workato recipe STOPPED.
-- Queues one synthetic 250 GB-hour event. Makes no external API requests.
-- Re-running preserves the existing event and its original values/status.
-- Use only for the controlled HTTP rejection and recovery test.

begin;

do $$
begin
  if exists (
    select 1 from public.billing_usage_events
    where status in ('received', 'processing')
      and transaction_id <> 'lab-northstar-recovery-001'
  ) then
    raise exception 'Another event is pending. Finish or inspect it before running the controlled failure test.';
  end if;
end;
$$;

with fixture as (
  select date_trunc('second', clock_timestamp() - interval '1 minute') as occurred_at
), inserted as (
  insert into public.billing_usage_events (
    transaction_id, customer_code, event_type, occurred_at, gb_hours, region, raw_payload
  )
  select 'lab-northstar-recovery-001', 'northstar', 'storage_usage_v1',
    f.occurred_at, 250, 'us-west-2', jsonb_build_object(
      'transaction_id', 'lab-northstar-recovery-001',
      'customer_code', 'northstar', 'event_type', 'storage_usage_v1',
      'timestamp', to_char(f.occurred_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'properties', jsonb_build_object('gb_hours', '250', 'region', 'us-west-2')
    )
  from fixture f
  on conflict (transaction_id) do nothing
  returning id
)
insert into public.billing_activity (usage_event_id, action, details)
select id, 'usage_received', '{"source":"controlled_failure_test"}' from inserted;

commit;

-- First-run expected: recovery-001, received, 250, zero attempts.
-- Stop and inspect before testing if an existing row has a different status.
select e.transaction_id, e.status, e.gb_hours,
  (select count(*) from public.billing_delivery_attempts a where a.usage_event_id = e.id)
    as delivery_attempts
from public.billing_usage_events e
where e.transaction_id = 'lab-northstar-recovery-001';
