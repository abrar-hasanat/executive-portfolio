# Executive Portfolio

A Next.js portfolio that presents work history, credentials, and interactive finance and operations dashboards.

## Architecture

- `app/`: App Router pages and the ticker API route.
- `app/dashboards/`: Client-side dashboard routes for valuation, delivery forecasting, tender tracking, migration support, and an economic valuation demonstration.
- `components/`: Reusable portfolio sections and navigation.
- `lib/data.ts`: Resume-aligned portfolio content.
- `public/`: Static assets.

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
