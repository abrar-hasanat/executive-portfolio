# Billing lab notes

Basically, this is a small storage-usage billing demo. Supabase keeps the usage records and delivery history. Workato sends usage to Metronome, then a separate recipe reads the draft invoice back. The website shows what was stored.

I built it to get hands-on Workato practice before the externship. It uses synthetic data. Metronome is the billing sandbox for this project; this setup is not a description of Qumulo's internal systems.

[Dashboard](https://www.abrarhasanat.com/dashboards/usage-billing) · [Plain-language walkthrough](billing-walkthrough.md)

What opens by default

The public page starts with a saved view of an earlier test: $1.75 for 1,750 GB-hours. That includes the original 1,000 GB-hour calibration test, which happened before the ledger existed. The ledger then recorded a 500 GB-hour event and a separate 250 GB-hour recovery test.

The calibration charge has its own baseline record. There are no invented delivery attempts for it. The snapshot also leaves out event timestamps and activity records that were not captured for that view.

After signing in, the page reads the current Supabase records. Now the numbers can differ from that saved view. Refresh reads the database; it does not run Workato or ask Metronome to recalculate an invoice.

Connecting it

The existing database already has its setup. For a fresh dashboard connection, [006_dashboard_access.sql](../database/billing/006_dashboard_access.sql) adds the approved viewer and the read function. The default email is `hasanata@carleton.edu`. A matching confirmed user also needs to exist in Supabase Authentication. That user's password is separate from the Supabase account login.

The connection panel takes the project's publishable key and the Auth user's login. The badge changes to `Live · Supabase` after a successful read. Passwords and session tokens stay in memory, so a page reload needs another sign-in. The public project key can stay in local storage.

Database passwords and service-role keys do not belong in this form. The browser rejects secret/service-role keys. Metronome's token stays in the Workato connection.

Submitting usage

[007_dashboard_actions.sql](../database/billing/007_dashboard_actions.sql) adds the operator actions after file 006. It lets the active default viewer submit or retry usage. Other approved viewers stay read-only. File 005 is not needed, and file 007 does not queue test events.

The form is limited to Northstar in `us-west-2`, with positive usage up to 1,000,000 GB-hours. The server assigns the timestamp. The browser gives the event a transaction ID and saves a pending submission until the database confirms it. If a response is lost, the same submission can be sent again with that ID. Its original usage values stay attached to it.

A submission starts as `received`, which means queued. Workato still has to deliver it. A failed or blocked event has a retry button in its details. That queues the original event again; an accepted event cannot be requeued through that button.

The two Workato recipes

`01 - Process usage events` calls `billing_claim_next_event()`. The database checks a queued event and creates a delivery attempt. Workato posts the returned array to `/v1/ingest`, then records the outcome with `billing_finish_attempt()`. The error branch records the failure and stops the job for review.

`02 - Sync invoice totals` reads the customer's draft invoice from Metronome. It passes the response to `billing_store_invoice_page()`. That checks the customer and contract before saving the result. Metronome returns USD cents here, so 175 becomes $1.75.

The recipes have scheduler steps, but they are currently tested manually. The website does not start either recipe. For a walkthrough, submit once, test delivery, then test invoice sync after Metronome reflects the usage. Refresh the dashboard afterward.

The small numeric check

At the fixed rate of $0.001 per GB-hour, another 100 GB-hours adds $0.10. Starting from the saved $1.75 test, that would make $1.85. Repeating invoice sync should read the same total, not add another charge. Use the connected view for the current result.

What has worked so far

Usage delivery worked in the sandbox. The 250 GB-hour recovery event failed first, then succeeded with the same transaction ID and added $0.25 once. Its original error remains in the attempt history. The invoice API returned the actual invoice ID and $1.75 total for that test. Dashboard submission has also been exercised after the operator setup.

One early issue was a hidden tab before `gb_hours` in the original metric. The event had the normal key, so the metric did not match it. A corrected metric replaced it on the product. A separate HTTP error happened when the ingest request sent an object where an array was expected.

Access notes

The read function checks the signed-in user against the viewer list. Submission and retry also require an operator flag. Browser users do not get direct table access or the worker functions. RLS is enabled on the billing tables. Workato currently uses the existing PostgreSQL owner connection; narrowing that worker's permissions is still work to do.

What is still limited

This is one customer with one region and a fixed USD rate. Usage is entered as synthetic data, rather than measured from a storage system. The invoice reader expects exactly one matching invoice and a complete response with no next page. It needs more work for larger invoice histories.

The page reads stored results on refresh. There is no push update or button that starts Workato. The read function returns the latest 200 events and 100 activity records. The overview compares the stored invoice with the calibration baseline plus accepted usage at the demo rate. It is not a general pricing engine.

The duplicate-intake and negative-usage checks now pass in Supabase. [The recipe notes](billing-recipe-tests.md) have the two SQL calls for Workato. The invalid check leaves one named exception in the ledger with no delivery attempt. A duplicate request sent all the way to Metronome still needs a separate test. Local checks also covered access restrictions and retry behavior, including keeping a submission ID after a lost response. That does not replace testing the whole system under load. There are no failure alerts yet, and the draft invoice is not a payment collection flow.

Scheduled runs and failure alerts are the next ideas. The current priority is understanding this version well enough to explain it and debug it.

Files I need to remember

- [001_foundation.sql](../database/billing/001_foundation.sql) creates the tables and customer mapping. It also saves the old $1 calibration baseline.
- [002_event_processing.sql](../database/billing/002_event_processing.sql) adds processing and retry functions. It queues the original 500 GB-hour test event.
- [003_recovery_fixture.sql](../database/billing/003_recovery_fixture.sql) queues the 250 GB-hour recovery test.
- [004_invoice_readback.sql](../database/billing/004_invoice_readback.sql) saves and checks the API invoice response.
- [006_dashboard_access.sql](../database/billing/006_dashboard_access.sql) adds authenticated dashboard reads.
- [007_dashboard_actions.sql](../database/billing/007_dashboard_actions.sql) adds approved submission and retry actions without the deferred fixtures.
- [008_recipe_tests.sql](../database/billing/008_recipe_tests.sql) adds the duplicate-intake and negative-usage test functions. Both passed in the connected database; Workato jobs use the calls in the recipe notes.

Those scripts describe the configured sandbox. SQL changes are applied separately in Supabase. A website deployment does not run them or send usage.

The frontend is plain HTML/CSS/JavaScript under `public/demos/northstar-billing/`. A Next.js page shows it in a same-origin iframe so its styles stay separate from the rest of the portfolio. It uses the existing GitHub-to-Vercel deployment. Website builds do not need billing secrets.
