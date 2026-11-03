-- Billing Lab 06: dashboard READ access only. File 05 is NOT required.
-- Run the COMPLETE file in Supabase SQL Editor.
-- Default viewer: hasanata@carleton.edu. Change the email below if needed.
-- Create the matching Supabase Auth user separately; no passwords go in SQL.
begin;
create table if not exists public.billing_dashboard_viewers (
  email text primary key check(email = lower(btrim(email))),
  active boolean not null default true
);
alter table public.billing_dashboard_viewers enable row level security;
revoke all on public.billing_dashboard_viewers from public, anon, authenticated;
insert into public.billing_dashboard_viewers(email)
values ('hasanata@carleton.edu') on conflict(email) do nothing;

create or replace function public.billing_dashboard_data()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_customers jsonb;
  v_events jsonb;
  v_activity jsonb;
begin
  if auth.uid() is null or not exists (
    select 1 from auth.users u
    join public.billing_dashboard_viewers v on v.email = lower(u.email) and v.active
    where u.id = auth.uid()
  ) then
    raise exception 'This account is not approved for the billing dashboard.' using errcode='42501';
  end if;

  select coalesce(jsonb_agg(x.payload order by x.code),'[]'::jsonb)
  into v_customers from (
    select c.customer_code as code, jsonb_build_object(
      'customer_code', c.customer_code, 'customer_name', c.customer_name,
      'active', c.active, 'metronome_customer_id', c.metronome_customer_id,
      'metronome_contract_id', c.metronome_contract_id,
      'invoice', case when s.id is null then null else jsonb_build_object(
        'id', s.metronome_invoice_id, 'status', s.invoice_status,
        'total_usd', s.total_usd, 'currency', s.currency,
        'period_start', s.period_start, 'period_end', s.period_end,
        'captured_at', s.captured_at, 'source', s.source,
        'issued_at', s.evidence#>>'{invoice,issued_at}',
        'quantity_gb_hours', coalesce((select sum((li->>'quantity')::numeric)
          from jsonb_array_elements(coalesce(s.evidence#>'{invoice,line_items}','[]'::jsonb)) li
          where li->>'product_id'='2059b669-0fe2-48ad-b68e-6417de8ad27b'
            and jsonb_typeof(li->'quantity')='number'),0)
      ) end,
      'baseline', case when b.id is null then null else jsonb_build_object(
        'total_usd', b.total_usd, 'quantity_gb_hours', b.evidence->>'quantity_gb_hours',
        'source', b.source, 'period_start', b.period_start, 'period_end', b.period_end
      ) end,
      'ledger', jsonb_build_object(
        'accepted_events', (select count(*) from public.billing_usage_events e
          where e.customer_code=c.customer_code and e.status='accepted'),
        'accepted_gb_hours', (select coalesce(sum(e.gb_hours),0) from public.billing_usage_events e
          where e.customer_code=c.customer_code and e.status='accepted'
            and e.occurred_at>=s.period_start and e.occurred_at<s.period_end),
        'pending_events', (select count(*) from public.billing_usage_events e
          where e.customer_code=c.customer_code and e.status in ('received','processing')),
        'open_exceptions', (select count(*) from public.billing_usage_events e
          where e.customer_code=c.customer_code and e.status in ('blocked','invalid','failed')),
        'delivery_attempts', (select count(*) from public.billing_delivery_attempts a
          join public.billing_usage_events e on e.id=a.usage_event_id where e.customer_code=c.customer_code)
      )
    ) as payload
    from public.billing_customers c
    left join lateral (
      select sn.* from public.billing_invoice_snapshots sn
      where sn.customer_id=c.id and sn.source='metronome_api'
        and sn.evidence#>>'{invoice,contract_id}'=c.metronome_contract_id::text
      order by sn.captured_at desc, sn.id desc limit 1
    ) s on true
    left join lateral (
      select sn.* from public.billing_invoice_snapshots sn
      where sn.customer_id=c.id and sn.snapshot_key='northstar-calibration-baseline-2026-11-03'
        and sn.period_start=s.period_start and sn.period_end=s.period_end
      limit 1
    ) b on true
  ) x;

  select coalesce(jsonb_agg(x.payload order by x.created_at desc),'[]'::jsonb)
  into v_events from (
    select e.created_at, jsonb_build_object(
      'transaction_id',e.transaction_id, 'customer_code',e.customer_code,
      'status',e.status, 'status_reason',e.status_reason,
      'gb_hours',e.gb_hours, 'region',e.region,
      'occurred_at',e.occurred_at, 'created_at',e.created_at,
      'attempts',coalesce((select jsonb_agg(jsonb_build_object(
        'attempt_number',a.attempt_number,'outcome',a.outcome,'http_status',a.http_status,
        'error_message',left(a.error_message,1500),'started_at',a.started_at,'finished_at',a.finished_at
      ) order by a.attempt_number) from public.billing_delivery_attempts a
      where a.usage_event_id=e.id),'[]'::jsonb)
    ) as payload
    from public.billing_usage_events e order by e.created_at desc,e.id desc limit 200
  ) x;

  select coalesce(jsonb_agg(x.payload order by x.created_at desc),'[]'::jsonb)
  into v_activity from (
    select a.created_at,jsonb_build_object('action',a.action,'created_at',a.created_at,
      'transaction_id',e.transaction_id) as payload
    from public.billing_activity a left join public.billing_usage_events e on e.id=a.usage_event_id
    order by a.created_at desc,a.id desc limit 100
  ) x;
  return jsonb_build_object('schema_version',1,'generated_at',statement_timestamp(),
    'customers',v_customers,'events',v_events,'activity',v_activity);
end;
$$;
revoke all on function public.billing_dashboard_data() from public,anon,authenticated;
grant execute on function public.billing_dashboard_data() to authenticated;
-- No table access or write functions are granted to browser users.
notify pgrst,'reload schema';
commit;
select 'Read-only dashboard access ready' as result;
