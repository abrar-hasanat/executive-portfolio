"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, BarChart3, Github, Layers3 } from "lucide-react";
import { interactiveDashboards, type InteractiveDashboard } from "@/lib/data";

type Filter = "All" | InteractiveDashboard["category"];

const filters: Filter[] = ["All", "Finance", "Operations"];

export default function DashboardsHubPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>("All");
  const dashboards = useMemo(
    () => interactiveDashboards.filter((dashboard) => activeFilter === "All" || dashboard.category === activeFilter),
    [activeFilter],
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#020C1B] via-[#0A192F] to-[#020C1B] px-4 py-8 text-[#F8FAFC] sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl">
        <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/25 md:p-8">
          <Link href="/" className="inline-flex text-sm font-semibold text-[#94A3B8] transition hover:text-[#3B82F6]">
            ← Back to Executive Portfolio
          </Link>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_0.75fr] lg:items-end">
            <div>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-tight md:text-6xl">
                Executive Dashboards & Decision Engines
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-8 text-[#94A3B8]">
                Interactive finance and operations tools.
              </p>
            </div>
            <div className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
              <div className="flex items-center gap-3 text-[#10B981]"><Layers3 size={22} /><span className="text-3xl font-black">4</span></div>
              <p className="mt-2 text-sm text-[#94A3B8]">Dashboard and source-code access.</p>
            </div>
          </div>
        </header>

        <div className="my-8 flex flex-wrap gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${activeFilter === filter ? "border-[#3B82F6] bg-[#3B82F6] text-white" : "border-[#1E293B] bg-[#112240] text-[#94A3B8] hover:border-[#3B82F6] hover:text-white"}`}
            >
              {filter}
            </button>
          ))}
        </div>

        <section className="grid gap-6 md:grid-cols-2">
          {dashboards.map((dashboard) => (
            <article key={dashboard.id} className="flex min-h-[360px] flex-col rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#3B82F6]/60">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#93C5FD]">{dashboard.tag}</span>
                <span className="inline-flex items-center gap-2 rounded-full bg-[#10B981]/10 px-3 py-1 text-xs font-bold text-[#A7F3D0]"><span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" /> Available</span>
              </div>
              <BarChart3 className="mt-8 text-[#3B82F6]" size={34} />
              <h2 className="mt-5 text-2xl font-black tracking-tight">{dashboard.title}</h2>
              <p className="mt-4 grow text-sm leading-7 text-[#94A3B8]">{dashboard.subtitle}</p>
              <div className="mt-6 flex flex-wrap gap-2">
                {dashboard.features.map((feature) => <span key={feature} className="rounded-full border border-[#1E293B] bg-[#0A192F] px-3 py-1.5 text-xs text-[#CBD5E1]">{feature}</span>)}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={dashboard.href} className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#3B82F6] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-500">Launch Dashboard <ArrowRight size={16} /></Link>
                <a href={dashboard.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] px-5 py-3 text-sm font-bold text-white transition hover:border-[#3B82F6] hover:text-[#93C5FD]"><Github size={16} /> View Code on GitHub</a>
              </div>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
