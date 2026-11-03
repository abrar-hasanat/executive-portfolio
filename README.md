# Executive Portfolio

A Next.js portfolio that presents work history, credentials, and interactive finance and operations dashboards.

## Architecture

- `app/`: App Router pages and the ticker API route.
- `app/dashboards/`: Client-side dashboard routes for valuation, delivery forecasting, tender tracking, migration support, and an economic valuation demonstration.
- `components/`: Reusable portfolio sections and navigation.
- `lib/data.ts`: Resume-aligned portfolio content.
- `public/`: Static assets, including the isolated usage-billing dashboard.
- `database/billing/`: PostgreSQL billing schema and processing functions.

## Dependencies

The application uses Next.js, React, TypeScript, Tailwind CSS, Recharts, Papa Parse, jsPDF, and Lucide React. The valuation dashboard uses the local `/api/ticker` route for ticker data and supports CSV uploads.

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Checks

```bash
npm run lint
npm run build
```

## Valuation data

Ticker lookup combines a market-price response with preset demonstration financials through 2024. Those presets include estimates and are not verified current statements. If the quote request fails, the response explicitly identifies its static reference price. Unsupported symbols return an error; the route does not invent financial statements. Upload a CSV with verified financials to supply a different scenario.

The browser DCF is a separate implementation from the Python valuation repository. Its assumptions appear beside the inputs and in the scenario memo.

## Usage billing

Open `/dashboards/usage-billing` for the Northstar storage-usage billing demo. The dashboard includes event delivery history and invoice readback. It opens with verified sandbox results and supports authenticated Supabase reads plus approved operator submission and retry controls.

See [the usage-billing guide](docs/usage-billing.md) for architecture, data scope, and connection setup. Existing billing database users apply the read-access and operator-action scripts separately; do not rerun the foundation or event fixtures.
