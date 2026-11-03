# Portfolio notes

This is my portfolio site. It uses Next.js and React, with the page content mostly in `lib/data.ts`. GitHub holds the source and Vercel builds the site when changes reach the main branch.

To run it locally:

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`. `npm run build` checks the production build. `npm run lint` runs ESLint.

Where things are

- `app/` has the pages and API routes.
- `components/` has the shared page sections.
- `lib/data.ts` has the portfolio copy and project links.
- `public/` has the static files, including the billing demo.
- `database/billing/` has the SQL used for the billing lab.

Billing lab

The demo is at `/dashboards/usage-billing`. Basically, usage goes into Supabase, Workato sends it to Metronome, and a separate Workato recipe brings the invoice back. The dashboard reads the stored results. Approved operators can also submit usage or request a retry.

It opens with saved sandbox results. A live connection needs an approved Supabase Auth user. The customer and usage are synthetic, and the Workato recipes are currently tested manually.

[Billing notes](docs/usage-billing.md) cover the setup and current limits. [Walkthrough notes](docs/billing-walkthrough.md) explain the flow in plain language. Existing databases use the access and action scripts separately; the older setup files also contain test data, so they are not a reset button.

Valuation data

The ticker route uses a market-price response alongside preset demo financials through 2024. Some preset figures are estimates. If the price request fails, the response labels the fallback price. A CSV upload can supply verified financials instead.

The browser DCF and the separate Python valuation repository are different implementations. The browser inputs and scenario memo show its assumptions.
