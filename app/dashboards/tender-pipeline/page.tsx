"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type View = "Opportunities" | "Clients" | "Turnaround";
const views: View[] = ["Opportunities", "Clients", "Turnaround"];
const data: Record<View, { value: string; label: string; detail: string; progress: number }> = {
  Opportunities: { value: "15+", label: "Tender opportunities identified", detail: "June 2026 to August 2026", progress: 15 },
  Clients: { value: "50+", label: "Prospective enterprise clients managed", detail: "June 2026 to August 2026", progress: 50 },
  Turnaround: { value: "20%", label: "Turnaround time reduction", detail: "Tender workflow", progress: 20 },
};

export default function TenderPipelinePage() {
  const [view, setView] = useState<View>("Opportunities");
  const current = useMemo(() => data[view], [view]);
  return <main className="min-h-screen bg-[#0A192F] px-6 py-8 text-[#F8FAFC] sm:px-10 lg:px-16"><section className="mx-auto flex max-w-5xl flex-col gap-8">
    <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20 md:p-8"><Link href="/" className="text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6]">← Back to portfolio</Link><h1 className="mt-8 text-3xl font-bold tracking-tight md:text-5xl">Tender Pipeline</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#94A3B8]">Bay Oceania C&amp;T Ltd., June 2026 to August 2026.</p></header>
    <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20"><h2 className="text-2xl font-bold">Pipeline metrics</h2><div className="mt-6 flex flex-wrap gap-3">{views.map((item) => <button key={item} type="button" onClick={() => setView(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold ${view === item ? "border-[#3B82F6] bg-[#3B82F6] text-white" : "border-[#1E293B] text-[#94A3B8] hover:border-[#3B82F6]"}`}>{item}</button>)}</div><div className="mt-8 rounded-2xl bg-[#0A192F] p-6"><p className="text-sm text-[#94A3B8]">{current.label}</p><p className="mt-3 text-5xl font-bold text-[#3B82F6]">{current.value}</p><p className="mt-3 text-sm text-[#94A3B8]">{current.detail}</p><div className="mt-6 h-3 overflow-hidden rounded-full bg-[#1E293B]"><div className="h-full rounded-full bg-[#3B82F6] transition-all" style={{ width: `${current.progress}%` }} aria-label={`${current.label}: ${current.value}`} /></div></div></section>
    <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20"><h2 className="text-2xl font-bold">Work completed</h2><ul className="mt-5 space-y-3 text-[#CBD5E1]"><li>Identified 15+ tender opportunities.</li><li>Managed 50+ prospective enterprise clients.</li><li>Reduced turnaround time by 20%.</li></ul></section>
  </section></main>;
}
