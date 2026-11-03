import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Usage Billing & Recovery | Abrar Hasanat",
  description:
    "A storage-usage billing integration with a PostgreSQL event ledger, Workato delivery recovery, and Metronome invoice readback.",
  alternates: { canonical: "/dashboards/usage-billing" },
};

export default function UsageBillingPage() {
  return (
    <main className="h-dvh w-full overflow-hidden bg-[#f6f7f8]">
      <iframe
        src="/demos/northstar-billing/index.html"
        title="Northstar usage billing dashboard"
        className="block h-full w-full border-0"
        allow="clipboard-write"
      />
      <noscript>
        <p>
          JavaScript is required for the interactive dashboard. You can inspect
          its source and setup guide in the portfolio repository.
        </p>
      </noscript>
    </main>
  );
}
