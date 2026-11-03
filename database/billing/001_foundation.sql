-- Billing lab 01: tables and the Northstar customer mapping.
-- Apply once as postgres in the consumption-billing-lab SQL Editor.
-- The $1 baseline is from the earlier sandbox test. This file does not send usage.
-- Dashboard access comes later, in file 006.

begin;

create table public.billing_customers (
  id uuid primary key default gen_random_uuid(),
  customer_code text not null unique,
  customer_name text not null,
  metronome_customer_id uuid unique,
  metronome_contract_id uuid unique,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_customers_code_check
    check (customer_code ~ '^[a-z0-9][a-z0-9_-]{0,63}$'),
  constraint billing_customers_name_check
    check (length(btrim(customer_name)) between 1 and 200),
  constraint billing_customers_contract_check
    check (metronome_contract_id is null or metronome_customer_id is not null)
);

create table public.billing_usage_events (
  id uuid primary key default gen_random_uuid(),
  transaction_id text not null unique,
  customer_code text not null,
  event_type text not null,
  occurred_at timestamptz,
  gb_hours numeric,
  region text,
  raw_payload jsonb not null,
  status text not null default 'received',
  status_reason text,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint billing_usage_transaction_id_check
    check (length(transaction_id) between 1 and 200
      and transaction_id = btrim(transaction_id)
      and transaction_id !~ '[[:cntrl:]]'),
  constraint billing_usage_customer_code_check
    check (length(btrim(customer_code)) between 1 and 200),
  constraint billing_usage_raw_payload_check
    check (jsonb_typeof(raw_payload) = 'object'),
  constraint billing_usage_status_check
    check (status in ('received', 'blocked', 'invalid', 'processing', 'accepted', 'failed')),
  constraint billing_usage_processable_check
    check (status not in ('processing', 'accepted') or (
      occurred_at is not null
      and isfinite(occurred_at)
      and gb_hours is not null
      and gb_hours > 0
      and gb_hours <= 1000000000000
      and event_type = 'storage_usage_v1'
      and region is not null
      and length(btrim(region)) between 1 and 100
    )),
  constraint billing_usage_exception_reason_check
    check (status not in ('blocked', 'invalid', 'failed')
      or (status_reason is not null and length(btrim(status_reason)) > 0))
);

-- customer_code deliberately has no foreign key: an unknown customer must be
-- kept for review, then checked against the current mapping on retry.
-- transaction_id must stay stable for all retries of the same logical event.
-- accepted means the ingest API accepted it; it does not mean invoicing is verified.
create index billing_usage_queue_idx
  on public.billing_usage_events (status, created_at);
create index billing_usage_customer_idx
  on public.billing_usage_events (customer_code, occurred_at);

create function public.billing_preserve_usage_event()
returns trigger language plpgsql set search_path = '' as $$
begin
  if row(new.transaction_id, new.customer_code, new.event_type, new.occurred_at,
         new.gb_hours, new.region, new.raw_payload)
     is distinct from
     row(old.transaction_id, old.customer_code, old.event_type, old.occurred_at,
         old.gb_hours, old.region, old.raw_payload) then
    raise exception 'Usage identity and original values are immutable. Retry the same event, or submit a corrected new event.'
      using errcode = '23514';
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger billing_preserve_usage_event
before update on public.billing_usage_events
for each row execute function public.billing_preserve_usage_event();

create function public.billing_touch_customer()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger billing_touch_customer
before update on public.billing_customers
for each row execute function public.billing_touch_customer();

revoke all on function public.billing_preserve_usage_event() from public, anon, authenticated;
revoke all on function public.billing_touch_customer() from public, anon, authenticated;

create table public.billing_delivery_attempts (
  id uuid primary key default gen_random_uuid(),
  usage_event_id uuid not null references public.billing_usage_events(id),
  attempt_number integer not null check (attempt_number > 0),
  metronome_customer_id uuid not null,
  request_payload jsonb not null,
  outcome text not null default 'started',
  http_status integer check (http_status between 100 and 599),
  response_body text,
  error_message text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  unique (usage_event_id, attempt_number),
  constraint billing_attempt_outcome_check
    check (outcome in ('started', 'accepted', 'failed', 'uncertain')),
  constraint billing_attempt_payload_check
    check (case when jsonb_typeof(request_payload) = 'array'
      then jsonb_array_length(request_payload) = 1 else false end),
  constraint billing_attempt_finished_check
    check ((outcome = 'started' and finished_at is null)
      or (outcome <> 'started' and finished_at is not null)),
  constraint billing_attempt_success_check
    check (outcome <> 'accepted'
      or (http_status is not null and http_status between 200 and 299)),
  constraint billing_attempt_time_check
    check (finished_at is null or finished_at >= started_at)
);

-- The processing functions added next will claim events atomically and manage
-- abandoned attempts. This index prevents two open attempts for one event.
create unique index billing_attempt_one_open_idx
  on public.billing_delivery_attempts (usage_event_id)
  where outcome = 'started';

create table public.billing_invoice_snapshots (
  id uuid primary key default gen_random_uuid(),
  snapshot_key text not null unique,
  customer_id uuid not null references public.billing_customers(id),
  metronome_invoice_id uuid,
  period_start timestamptz not null,
  period_end timestamptz not null,
  invoice_status text not null,
  currency text not null default 'USD' check (currency = 'USD'),
  total_usd numeric not null check (total_usd >= 0 and total_usd < 1000000000000),
  source text not null,
  evidence jsonb not null check (jsonb_typeof(evidence) = 'object'),
  captured_at timestamptz not null default now(),
  constraint billing_snapshot_period_check check (period_end > period_start),
  constraint billing_snapshot_source_check
    check (source in ('manual_verification', 'metronome_api')),
  constraint billing_snapshot_api_check
    check (source <> 'metronome_api' or metronome_invoice_id is not null)
);

create index billing_snapshot_customer_idx
  on public.billing_invoice_snapshots (customer_id, captured_at desc);

alter table public.billing_customers enable row level security;
alter table public.billing_usage_events enable row level security;
alter table public.billing_delivery_attempts enable row level security;
alter table public.billing_invoice_snapshots enable row level security;

-- Browser access remains closed until the dashboard authentication step.
-- SQL Editor and the existing postgres Workato connection can still access them.
revoke all on table
  public.billing_customers,
  public.billing_usage_events,
  public.billing_delivery_attempts,
  public.billing_invoice_snapshots
from public, anon, authenticated;

insert into public.billing_customers (
  customer_code, customer_name, metronome_customer_id, metronome_contract_id
) values (
  'northstar',
  'Northstar Analytics (Demo)',
  '19c7e892-e10f-43de-92ab-20d5acdb569c',
  'c14260a0-4b03-47d3-8e03-d11b94515d0e'
);

-- Historical calibration events were sent before the ledger existed.
-- Do not re-send them to populate these tables. Import their actual records later.
insert into public.billing_invoice_snapshots (
  snapshot_key, customer_id, period_start, period_end,
  invoice_status, total_usd, source, evidence
)
select
  'northstar-calibration-baseline-2026-11-03', id,
  '2026-11-03T00:00:00Z'::timestamptz,
  '2026-12-01T00:00:00Z'::timestamptz,
  'draft', 1.00, 'manual_verification',
  '{"basis":"User-provided Metronome sandbox invoice screenshot", "screenshot":"image(20261103-164531).png", "product":"Storage consumption (GB-hours)", "quantity_gb_hours":"1000", "unit_price_usd":"0.001", "region":"us-west-2", "scheduled_issue_at":"2026-12-02T00:00:00Z"}'::jsonb
from public.billing_customers where customer_code = 'northstar';

commit;

-- Expected result: one Northstar row, baseline_total_usd = 1.00,
-- ledger_events = 0 and delivery_attempts = 0. The baseline is observed history,
-- not a fabricated delivery record and not new billable usage.
select
  c.customer_code,
  c.customer_name,
  c.metronome_customer_id,
  c.metronome_contract_id,
  s.total_usd as baseline_total_usd,
  (select count(*) from public.billing_usage_events) as ledger_events,
  (select count(*) from public.billing_delivery_attempts) as delivery_attempts
from public.billing_customers c
join public.billing_invoice_snapshots s on s.customer_id = c.id
where s.snapshot_key = 'northstar-calibration-baseline-2026-11-03';
