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
