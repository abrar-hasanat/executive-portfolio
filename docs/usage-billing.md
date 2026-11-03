# Usage Billing & Recovery

A storage-usage billing demo built around a durable PostgreSQL event ledger. Workato delivers usage to Metronome and records delivery outcomes. A separate recipe reads the resulting invoice back into Supabase.

## Open the dashboard

The portfolio route is `/dashboards/usage-billing`. Its assets live in `public/demos/northstar-billing/`. The Next.js page isolates the dashboard in a same-origin frame, keeping its styles separate from the portfolio. No additional Vercel project or build dependency is needed.

The dashboard is listed on the portfolio home page and dashboard collection. Its overview and invoice view show the most recent dataset; the ledger supports search, status filters, and CSV export. Select an event to inspect its delivery attempts.

## Data sources

**Verified snapshot** is the default. It records observed sandbox results from November 3, 2026: a $1.75 draft invoice for 1,750 GB-hours, two accepted ledger events totaling 750 GB-hours, and a recovered delivery failure. The original 1,000 GB-hour calibration charge predates the ledger and is labeled separately. Event timestamps and audit entries that were not supplied are not invented.

**Live Supabase** is available through the connection panel. It reads stored invoice snapshots and event history through one authenticated RPC. Refreshing the page's data does not execute Workato or call Metronome. Workato must run first to import newer usage or invoice totals. Live access still requires the project setup below.

## Connect an existing billing database

1. Run [006_dashboard_access.sql](../database/billing/006_dashboard_access.sql) in Supabase SQL Editor. It grants read access only. The default approved email is `hasanata@carleton.edu`; change the email in the script before running if desired.
2. In the project's Supabase Authentication Users page, create a confirmed user with that email and a separate password. This is distinct from the Supabase dashboard account.
3. Copy the project's publishable key from Settings → API Keys. Open **Connect live data** in the dashboard and enter the key with the project user's credentials.
4. Confirm that the data badge changes to **Live · Supabase**. The invoice should match the latest successful Workato invoice import.

Never use a service-role key, database password, or Metronome token in the browser. The dashboard rejects secret/service-role keys. Passwords and session tokens remain in memory; only the public project key may be retained in local storage. Reloading requires signing in again.

The dashboard's read function checks the authenticated user against a server-side allowlist. Browser users cannot query the original billing tables or invoke the delivery and retry functions. The public demonstration snapshot contains synthetic customer data; live records remain protected by Supabase authentication.

## Backend source

- [001_foundation.sql](../database/billing/001_foundation.sql): customer mappings, immutable usage events, delivery attempts, and invoice snapshots.
- [002_event_processing.sql](../database/billing/002_event_processing.sql): claim, finish, expiry recovery, and retry functions.
- [003_recovery_fixture.sql](../database/billing/003_recovery_fixture.sql): the controlled rejection and recovery fixture.
- [004_invoice_readback.sql](../database/billing/004_invoice_readback.sql): invoice validation and USD-cent conversion.
- [006_dashboard_access.sql](../database/billing/006_dashboard_access.sql): the authenticated read-only dashboard projection.

These scripts document the configured sandbox. Existing installations should not rerun foundation scripts or test fixtures. A new environment requires its own customer and contract identifiers. SQL changes are run separately in Supabase; deploying the website does not run migrations or send billable usage.

## Verified behavior and current limits

Usage delivery and a failed-then-successful retry were observed in the sandbox. The recovered 250 GB-hour event added $0.25 once. The invoice readback returned the actual invoice ID and $1.75 total. The original failure remains attached to the accepted event.

The browser is currently read-only. Submission and retry controls are deferred, along with the broader duplicate and invalid-input acceptance tests. The read projection returns up to 200 recent events and 100 audit entries. The reconciliation display uses the fixed $0.001/GB-hour demo rate and the separately verified $1 calibration baseline. It is not a general pricing engine.

## Deployment

The dashboard ships with the existing Next.js portfolio through its GitHub-to-Vercel connection. No billing secrets are required for the website build. The browser connection panel supplies the public project key and an approved user's session at runtime.
