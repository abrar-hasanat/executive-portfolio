# Two quick recipe checks

The database helpers are installed and both passed directly in Supabase. The Workato jobs still need to be wired up and tested there. The stored draft invoice stayed at $7.85 when these checks ran.

03 - Check duplicate protection

Use one PostgreSQL `Run custom SQL` action with the existing Billing Lab connection. Keep the SQL field in Text mode and paste:

```sql
SELECT public.billing_test_duplicate() AS result;
```

This resubmits the original accepted event, then tries changing its amount under the same ID. The output should include `passed: true`. It reports `duplicate_ignored` for the repeat and `conflict` for the changed amount. The original event stays accepted and unchanged. There is still one event row and no extra delivery attempt.

This checks our database intake protection. It does not send a duplicate request to Metronome or test the vendor's deduplication window.

04 - Check invalid usage

Use the same PostgreSQL action and connection, with this Text-mode SQL:

```sql
SELECT public.billing_test_invalid_usage() AS result;
```

This submits -100 GB-hours under `lab-northstar-invalid-negative-001` and runs the existing worker validation. Expected output: `passed: true`, `event_status: invalid`, `delivery_attempts: 0`, `sent_to_metronome: false`.

The named invalid record stays in the ledger as test evidence. So the overview can show one open exception after this test. That is expected. Re-running the check uses the same record. If other usage is pending, finish its delivery first; this test refuses to claim unrelated work.

Quick Workato setup for each recipe

1. Create a recipe from scratch with the name above.
2. Add Scheduler by Workato as the trigger, using the same interval as the existing lab recipes. Leave the recipe inactive.
3. Add PostgreSQL, choose Run custom SQL (Batch), and use the existing connection. Paste the matching SQL in Text mode. There are no datapills or HTTP steps to map.
4. Save and Test. Open the PostgreSQL output and check the JSON in Rows → result. A failed assertion raises an error instead of returning a pass.

These are manual test recipes. They do not deliver usage or import invoices. The test functions use the existing database-owner connection and are not available to anonymous or authenticated browser roles.

The deployed helper SQL is in [008_recipe_tests.sql](../database/billing/008_recipe_tests.sql). It is already installed; no SQL Editor setup is needed for the current project.
