import type { Metadata } from "next";
import BangladeshRmgDashboard from "@/components/BangladeshRmgDashboard";

export const metadata: Metadata = {
  title: "Bangladesh Apparel Sourcing Dashboard | Abrar Hasanat",
  description: "Explore validated US apparel import data for 2010-2019, with supplier comparisons, chapter composition and clear limits on causal interpretation.",
};

export default function BangladeshRmgPage() {
  return <BangladeshRmgDashboard />;
}
