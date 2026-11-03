-- Read open Northstar exceptions that have not been emailed for this version.
-- This query does not send email or mark anything as notified.
select
  e.id::text as event_id,
  e.transaction_id,
  e.status,
  e.status_reason,
  e.gb_hours,
  to_char(e.updated_at at time zone 'UTC',
    'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') as failure_version,
  jsonb_build_object('failure_version',
    to_char(e.updated_at at time zone 'UTC',
      'YYYY-MM-DD"T"HH24:MI:SS.US"Z"'))::text as alert_details
from public.billing_usage_events e
where e.customer_code='northstar'
  and e.status in ('failed','blocked','invalid')
  and not exists (
    select 1 from public.billing_activity a
    where a.usage_event_id=e.id
      and a.action='failure_alert_sent'
      and a.details->>'failure_version'=
        to_char(e.updated_at at time zone 'UTC',
          'YYYY-MM-DD"T"HH24:MI:SS.US"Z"')
  )
order by e.updated_at,e.id
limit 20;
