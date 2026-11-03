# My billing demo walkthrough

The short version I can say

"I wanted to get comfortable with Workato before the externship, so I built a small storage billing workflow. I can enter some pretend usage on the website. It gets saved in a database, Workato sends it to a billing sandbox, and another recipe brings the invoice back. The useful part is being able to follow a failed delivery and retry the same event while keeping the history."

The problem it is practising

A usage-based bill starts with a record of what a customer used. If that record gets lost, the bill can be too low. If the same record gets counted again during a retry, it can be too high. So basically, I need to keep the original event and know what happened when I tried to send it.

The demo separates the usage record from its delivery attempts. One event can have several attempts without becoming several usage records.

What each tool does and why it is here

Supabase gives this project a hosted PostgreSQL database and user sign-in. PostgreSQL holds the records in tables and runs the SQL functions. I can keep related updates together, such as marking an event as processing while creating its attempt record. It is a practical way to build this lab without running a database server myself. It does not calculate the Metronome invoice.

Workato is the integration tool I wanted to practise. A recipe is a workflow with a trigger and actions. Here it can read from PostgreSQL and make an HTTP request to the billing API. I used it to work through the actual connection setup and error branches, rather than only build a website around sample numbers. I could write a scheduled script for this flow, but that would give me less Workato practice.

Metronome is the billing sandbox. It receives usage events and applies the configured metric and price to the customer's contract. That produces the draft invoice. I used it to practise the billing side of the integration. The externship description mentioned m3ter; this project uses Metronome. I should explain that choice clearly and not imply that the two products are interchangeable or that this is Qumulo's stack.

The dashboard is the window into the workflow. It lets an approved operator submit usage, then shows the stored outcomes. It also has a saved example for visitors who are not signed in. Its small rate calculation is a comparison check; the imported invoice total comes from Metronome.

GitHub stores the source and change history. Vercel builds and hosts the website from that repository. They are a separate concern from usage delivery. Publishing the website does not run Workato or apply the SQL migrations.

Next.js runs the portfolio. The billing frontend is plain HTML/CSS/JavaScript inside it. The iframe keeps the demo's styles separate from the portfolio styles. There is no additional Next.js billing API here: the browser calls the approved Supabase functions directly.

What a GB-hour means

A GB-hour is an amount of storage multiplied by time. For example, 100 GB held for one hour is 100 GB-hours. So is 10 GB held for ten hours.

The demo accepts the GB-hour amount I type in. It does not connect to a Qumulo system or measure anyone's real storage. The price is $0.001 per GB-hour, so 100 GB-hours costs $0.10. This is a practice rate.

How I would show it on the call

1. Open the overview. Point out whether it says `Verified snapshot` or `Live · Supabase`. The first is a saved example; the second is a database read from the connected workspace. Sign in before sharing the screen so credentials stay out of the walkthrough.
2. Open the usage ledger and select the earlier recovery event. Show that its current status is accepted while its first failed attempt remains visible. That is one usage event with a delivery history.
3. Submit one small event, for example 100 GB-hours. Point out the transaction ID. The record is queued first, so the invoice has not changed just because the form succeeded.
4. Switch to Workato and test `01 - Process usage events`. The database claims the queued event. The HTTP step sends the payload to Metronome and the next SQL step records the result.
5. Refresh the ledger and inspect the attempt. An accepted delivery means the ingest request succeeded. It does not by itself prove that the metric matched the event or that the invoice has been imported.
6. Once Metronome reflects the usage, test `02 - Sync invoice totals`. Now refresh the dashboard and show the imported invoice. Compare the change with the expected $0.10 for the extra 100 GB-hours. If it has not caught up yet, inspect Metronome before repeating any submission.

I can demonstrate recovery using the existing history. There is no need to deliberately break the working recipe during the call. Keep both recipes inactive when using manual tests.

What actually happens after Submit

The browser creates a transaction ID, which is a label for this particular usage event. It saves that ID with the amount in a pending draft before sending the request. That way, a lost response does not force it to invent another event.

The browser calls an approved database function. RPC just means calling a function on the other system. This one checks that the signed-in user has operator permission and validates the fields. The database assigns the timestamp and saves a `received` event. Received means queued here.

The timestamp is when the synthetic event is submitted. In a real integration, I would need the time the storage usage happened, with a clear rule for late-arriving data.

What happens inside the delivery recipe

The first SQL action asks for work through `billing_claim_next_event()`. Claiming means reserving an event for this attempt. It checks the usage values and resolves the customer code to the Metronome customer and contract IDs. If everything is usable, it creates an attempt and changes the event to processing.

The database locks the selected row while doing that. Another worker skips a locked row rather than selecting it too. Only one unfinished attempt is allowed for an event. There is also a 15-minute lease so an interrupted job can later be recognised as unfinished work. Expiry is checked when the claim helper runs again; it is not a separate always-running timer.

The function returns the request body. Workato passes that body to Metronome's `/v1/ingest` endpoint using POST. POST sends data. The body is JSON, which is just a structured text format. This endpoint expects an array, even when there is only one event.

The last SQL step calls `billing_finish_attempt()`. It records the response against the attempt. A normal successful response marks the event accepted. A rejection or unclear response leaves it failed and available for review. The Workato error branch records what it can and stops the job.

What happens during invoice sync

The second recipe makes a GET request to the customer's invoice endpoint. GET asks for data. It filters the request to this contract's draft invoice.

The recorder checks that the response belongs to the mapped customer and contract. It also checks the amount units. The API uses USD cents here: 175 is $1.75, not $175. A changed invoice response gets its own stored version. Reading the same response again refreshes its capture time rather than adding another charge.

The dashboard reads that stored invoice on refresh. It can show an older total if delivery finished but invoice sync has not run yet. Now the difference between delivery and invoice readback matters: they are separate steps.

The words I need in Metronome

A billable metric decides which events count and what to add up. Here it matches `storage_usage_v1` and sums `gb_hours`. Region is used for grouping.

The product is the storage-consumption item that appears on the bill. It uses the metric to get usage.

The rate sets the price for that usage. Here the fixed demo rate is $0.001 per GB-hour.

The contract attaches the commercial setup to the customer, including the billing dates. An event can reach the API successfully and still not produce the expected charge if the configured metric does not match its properties.

Why save events and attempts separately?

The event answers "what was used?" The attempt answers "what happened when I sent it?" Keeping them apart lets me retry a delivery while preserving the original usage and its history. Changing the amount requires a corrected new event, rather than quietly editing the old record.

Why is the transaction ID so important?

It stays the same through retries. The local database uses a unique ID to stop the same submission becoming another event. For delivery retries, keeping the same ID lets the billing service recognise a repeated event under its deduplication rules. I should not claim unlimited, exactly-once delivery. The full path still needs checks, especially after a timeout or a change to the customer mapping.

What does uncertain mean?

It means the recorder cannot safely classify the delivery result. A connection can fail after the other system receives a request. The current Workato error path also passes a missing HTTP status when it only has a caught error message. So the earlier explicit 400 error was stored as uncertain even though its message showed a rejection. Capturing structured status codes in that branch would improve the classification.

The safe recovery starts with inspecting the attempt. It retries the same event and ID, not a fresh copy with the same amount.

How does retry work?

The approved retry function changes a failed or blocked event back to received. It keeps its original usage fields. The next claim creates a new attempt number. A blocked event means the customer mapping needs attention; invalid input needs a corrected new event. Accepted events cannot be requeued through this control.

Where are the records?

`billing_customers` maps the local customer code to the vendor IDs. `billing_usage_events` holds the original usage and its current status. `billing_delivery_attempts` holds the separate send attempts. `billing_activity` records actions such as a retry request. `billing_invoice_snapshots` holds invoice evidence. The viewer list separately controls dashboard access.

Why not just calculate amount times price on the website?

I do use that simple calculation to compare the numbers for this fixed-rate demo. But I wanted to practise getting an invoice result from a billing system and bringing it back through an integration. A number calculated only in the browser would not prove that delivery or billing had worked.

What did the two earlier errors teach me?

The first metric had a hidden tab before `gb_hours`. The event had the ordinary key, so they did not match. The corrected metric fixed the mismatch. The lesson was to compare the actual field names in the API response, including invisible whitespace.

A separate ingest error came from sending a JSON object where the endpoint expected an array. Fixing the shape allowed the recovery event to succeed. The first failed attempt stayed in the database, which made it possible to explain the recovery afterward.

Why does the invoice say December 2?

That is the scheduled issue date. The current draft covers usage from November 3 to December 1. A draft can accrue charges before its issue date. The earlier zero total was explained by the metric mismatch; waiting until December was not the fix.

Why does the invoice include more usage than the ledger?

The original 1,000 GB-hour test happened before the ledger existed. It is shown as a separate calibration baseline. That baseline plus later accepted ledger usage explains the demo total. The ledger is not pretending to contain the original test's delivery attempts.

What does live mean here?

It means a fresh read from Supabase when I connect or refresh. Workato still has to deliver usage and import the invoice first. It does not mean a constant stream from Metronome, and scheduled runs are not enabled in the current manual test setup.

Can anyone use the live controls?

No. The public link opens the saved synthetic example. Live reads require an approved Auth user. Submission and retry require an additional operator permission. The functions check that on the server, so hiding a button is not the access control. Browser users cannot directly edit the billing tables. Workato currently has a much broader database connection, which should be narrowed before this became a production system.

What is an API or a connector?

An API is a defined way for software to ask another system for data or send it data. A connector helps configure that interaction in Workato. Here the PostgreSQL connector runs the database actions; the HTTP connection makes the Metronome requests. The API token is kept in the Workato connection, not in the public frontend.

Why base64 in the Workato SQL formulas?

It safely carries response text through those SQL strings, including quotes and line breaks. PostgreSQL decodes the text again before using it. Base64 is not encryption. Parameterised queries would be preferable where the action supports them; the current formulas should not be described as protecting secrets through encoding.

What can I honestly say about Qumulo?

This is preparation for its business-systems work, using synthetic storage usage to make the exercise relevant. I wanted practice tracing data between systems and handling a failure with evidence. I have not connected this project to Qumulo data or established that Qumulo uses Supabase. The implementation is my learning lab, not a proposed replacement for its systems.

What is still work to do?

There is one demo customer and region, with a fixed rate. I am entering usage instead of collecting storage telemetry. The invoice import expects a single invoice response with no remaining pages. The dashboard only loads recent history and updates on refresh.

The duplicate-intake and negative-usage checks now pass in the connected database. [Recipe notes](billing-recipe-tests.md) show how to run them from Workato. The negative test leaves one expected invalid event with no delivery attempt. Vendor-side duplicate handling still needs a separate end-to-end test. Scheduled runs and failure alerts are ideas for the next version. The worker's database permissions need narrowing. There is no payment collection or claim of production readiness.

If he asks about scaling

The current claim takes one event per recipe run. That is enough for the demo, but a larger flow would need throughput and rate-limit testing. Batching or more workers would need careful concurrency checks. Invoice pagination and a less hard-coded customer setup would also need work. A successful small test does not establish production scale.

If he asks what I learned

"The dashboard was the visible part, but the useful learning was figuring out where a record had stopped. I learned to distinguish a saved event from an accepted API request, and then check the invoice separately. Keeping the failed attempt made the retry something I could explain rather than just a button that eventually worked."
