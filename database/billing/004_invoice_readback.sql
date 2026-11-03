-- Run this complete file once in Supabase SQL Editor.
-- Defines the recorder only. Workato supplies the actual API response later.
-- This first version requires one invoice and a complete, unpaginated response.
begin;

create or replace function public.billing_store_invoice_page(
  p_customer_code text, p_response_body text
) returns jsonb language plpgsql volatile security invoker set search_path = '' as $$
declare
  v_customer public.billing_customers%rowtype;
  v_page jsonb;
  v_invoice jsonb;
  v_id uuid;
  v_start timestamptz;
  v_end timestamptz;
  v_total numeric;
  v_snapshot_id uuid;
begin
  select c.* into v_customer from public.billing_customers c
  where c.customer_code = p_customer_code for share;
  if not found or not v_customer.active or v_customer.metronome_customer_id is null
     or v_customer.metronome_contract_id is null then
    raise exception 'Active customer mapping with both vendor IDs is required.';
  end if;
  v_page := p_response_body::jsonb;
  if jsonb_typeof(v_page) is distinct from 'object'
     or jsonb_typeof(v_page->'data') is distinct from 'array' then
    raise exception 'Expected an invoice response object with a data array.';
  end if;
  if not (v_page ? 'next_page') or v_page->'next_page' is distinct from 'null'::jsonb then
    raise exception 'Response is incomplete. Pagination must be handled before recording.';
  end if;
  if jsonb_array_length(v_page->'data') <> 1 then
    raise exception 'Expected exactly one invoice for this demo contract.';
  end if;
  v_invoice := v_page->'data'->0;
  if jsonb_typeof(v_invoice) is distinct from 'object' then
    raise exception 'Expected an invoice object.';
  end if;
  if (v_invoice->>'customer_id')::uuid is distinct from v_customer.metronome_customer_id
     or (v_invoice->>'contract_id')::uuid is distinct from v_customer.metronome_contract_id then
    raise exception 'Invoice customer or contract does not match the current mapping.';
  end if;
  if v_invoice->>'type' is distinct from 'USAGE'
     or coalesce(v_invoice->>'status', '') not in ('DRAFT', 'FINALIZED') then
    raise exception 'Expected a draft or finalized usage invoice.';
  end if;
  if v_invoice#>>'{credit_type,id}' is distinct from '2714e483-4ff1-48e4-9e25-ac732e8f24f2'
     or v_invoice#>>'{credit_type,name}' is distinct from 'USD (cents)' then
    raise exception 'Unsupported credit type. Refusing to guess amount units.';
  end if;
  v_id := (v_invoice->>'id')::uuid;
  v_start := (v_invoice->>'start_timestamp')::timestamptz;
  v_end := (v_invoice->>'end_timestamp')::timestamptz;
  if v_id is null or v_start is null or v_end is null
     or not isfinite(v_start) or not isfinite(v_end) or v_end <= v_start then
    raise exception 'Invoice ID and finite, ordered billing period are required.';
  end if;
  if jsonb_typeof(v_invoice->'total') is distinct from 'number' then
    raise exception 'Invoice total must be a JSON number in USD cents.';
  end if;
  v_total := (v_invoice->>'total')::numeric / 100;
  if v_total is null or not (v_total >= 0 and v_total < 1000000000000) then
    raise exception 'Invoice total is outside the supported range.';
  end if;

  -- Repeated identical responses refresh this version's observation time.
  -- Changed invoice content creates a separate version; manual evidence remains.
  insert into public.billing_invoice_snapshots (
    snapshot_key, customer_id, metronome_invoice_id, period_start, period_end,
    invoice_status, currency, total_usd, source, evidence, captured_at
  ) values (
    'metronome:' || v_id::text || ':' || md5(v_invoice::text),
    v_customer.id, v_id, v_start, v_end, v_invoice->>'status', 'USD', v_total,
    'metronome_api', jsonb_build_object('invoice', v_invoice,
      'amount_unit', 'USD cents', 'usd_divisor', 100), clock_timestamp()
  ) on conflict (snapshot_key) do update set captured_at = excluded.captured_at
  returning id into v_snapshot_id;

  return jsonb_build_object('recorded', true, 'snapshot_id', v_snapshot_id,
    'invoice_id', v_id, 'invoice_status', v_invoice->>'status',
    'total_usd', v_total, 'source', 'metronome_api');
end;
$$;

revoke all on function public.billing_store_invoice_page(text, text)
  from public, anon, authenticated;
commit;

select 'Invoice recorder ready' as result;
