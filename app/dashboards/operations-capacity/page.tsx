"use client";

import Link from "next/link";
import { useState } from "react";

export default function OperationsCapacityDashboardPage() {
  const [scale, setScale] = useState(1);
  return <main className="min-h-screen bg-[#0A192F] px-6 py-8 text-[#F8FAFC] sm:px-10 lg:px-16"><section className="mx-auto flex max-w-5xl flex-col gap-8">
    <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20 md:p-8"><Link href="/" className="text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6]">← Back to portfolio</Link><h1 className="mt-8 text-3xl font-bold tracking-tight md:text-5xl">Workday Migration Support</h1><p className="mt-4 max-w-3xl text-lg leading-8 text-[#94A3B8]">Carleton College Registrar and Provost Office, September 2023 to Present.</p></header>
    <section className="grid gap-5 md:grid-cols-2"><article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6"><p className="text-sm text-[#94A3B8]">Transcript processing backlog reduction</p><p className="mt-3 text-5xl font-bold text-[#3B82F6]">15%</p></article><article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6"><p className="text-sm text-[#94A3B8]">Migration work</p><p className="mt-3 text-xl font-bold">Colleague to Workday ERP</p></article></section>
    <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6"><h2 className="text-2xl font-bold">Work completed</h2><ul className="mt-5 space-y-3 text-[#CBD5E1]"><li>Supported the Colleague to Workday ERP migration.</li><li>Performed UAT and backend data validation.</li><li>Reduced the transcript processing backlog by 15%.</li></ul></section>
    <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6"><h2 className="text-2xl font-bold">Planning control</h2><label className="mt-6 block text-sm text-[#94A3B8]">Scenario scale: {scale.toFixed(1)}x<input aria-label="Scenario scale" className="mt-3 block w-full accent-[#3B82F6]" type="range" min="1" max="3" step="0.1" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label></section>
  </section></main>;
}
