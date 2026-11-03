# Scheduled runs and email alerts

The duplicate and invalid recipes call SQL checks that were already implemented. Most of their logic is in the database. This alert recipe puts the loop and notification steps in Workato so the mapping is visible there.

Scheduling the existing flow

The delivery and invoice recipes already have scheduler triggers. Starting them enables those schedules. While setting up and deliberately breaking requests, keeping them inactive made it easier to control when a request was sent.

For normal demo use, set `01 - Process usage events` and `02 - Sync invoice totals` to every five minutes and click Start recipe. Keep the test recipes 03 and 04 inactive. A new event first waits for delivery. The invoice then needs to reflect it and be imported on a later sync run. Refresh still reads Supabase; it does not start those jobs.

The minimum Scheduler by Workato interval is five minutes. The scheduled time is approximate, so it is not an immediate-update promise. Starting a stopped schedule may run it immediately.

05 - Email open exceptions

This recipe is ready to configure. Its Workato job and email delivery have not been verified yet. The query found the existing negative-usage test event in Supabase. No alert has been marked as sent by the setup work.

1. Add Scheduler by Workato, New recurring event, every five minutes.
2. Add PostgreSQL, Run custom SQL (Batch), with the existing Billing Lab connection. Paste [failure_alert_query.sql](../database/billing/failure_alert_query.sql) in Text mode. Test the action to get its output fields.
3. Add Repeat for each item in Rows from step 2. Clear step outputs between iterations. With no returned rows, the loop does nothing.
4. Inside Repeat, add Email by Workato, Send email. Send to `hasanata@carleton.edu`, using Text email type. Map the transaction ID into a subject such as `Northstar sandbox alert: [transaction_id]`. The message can show transaction ID, status, reason, and GB-hours. Use pills from the current Repeat item, not the full Rows list.
5. After the email action, still inside Repeat, add PostgreSQL, Insert row. Select `public.billing_activity`. Map `usage_event_id` to the Repeat item's event_id. Set `action` to `failure_alert_sent`. Map `details` to the Repeat item's alert_details. Leave the generated id and created_at fields unset so their database defaults apply.
6. Save and Test. Confirm the email arrived and the insert succeeded. Test once more; the query should return no rows for that same failure version. Then Start recipe to enable its schedule.

What the SQL means

It looks for an open exception and checks whether the activity log already has a matching notification marker. The version is the event's last-change timestamp in a fixed UTC format. `alert_details` builds the small JSON value used for the marker; Workato just maps it into the insert action.

The email action comes before the marker. If sending fails, the marker is not written, so a later run can try again. Marking an alert does not resolve the underlying event. The intentional invalid test stays invalid until handled separately, even after its alert is sent.

This is a small sequential demo. If email succeeds but saving its marker fails, a retry can send another email. Concurrent jobs can also race, so this is not an exactly-once email guarantee. Keep recipe concurrency at one while learning. A stronger notification queue would be later work.

The query covers open event exceptions. It does not detect every Workato job error, connection outage, or stopped recipe. Those need recipe-error monitoring separately.

Useful references

- [Starting and stopping recipes](https://docs.workato.com/en/recipes/start-and-stop)
- [Scheduler trigger](https://docs.workato.com/en/features/scheduler/triggers/new-recurring-event.html)
- [Email by Workato](https://docs.workato.com/en/connectors/email-by-workato)
- [PostgreSQL insert row](https://docs.workato.com/en/connectors/postgresql/insert)
