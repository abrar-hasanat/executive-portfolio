"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Sector = "All Sectors" | "Commercial Construction" | "Government Procurement" | "Infrastructure";

type Kpi = {
  label: string;
  value: string;
  helper: string;
};

type SectorDashboardData = {
  kpis: Kpi[];
  stages: {
    name: string;
    value: string;
    tenders: number;
    progress: number;
  }[];
  baselineTurnaround: string;
  optimizedTurnaround: string;
  efficiencyGain: string;
};

const sectors: Sector[] = [
  "All Sectors",
  "Commercial Construction",
  "Government Procurement",
  "Infrastructure",
];

const dashboardData: Record<Sector, SectorDashboardData> = {
  "All Sectors": {
    kpis: [
      { label: "Total Pipeline Value", value: "$15.4M", helper: "60 Enterprise Tenders" },
      { label: "Risk-Adjusted Revenue", value: "$9.8M", helper: "Monte Carlo Simulated Expected Value" },
      { label: "Proposal Turnaround Gain", value: "-20.4%", helper: "DMAIC Cycle Time Optimization" },
      { label: "Target Accounts Won", value: "15 Deals", helper: "High-Margin Procurement Secured" },
    ],
    stages: [
      { name: "Lead Staging", value: "$3.2M", tenders: 12, progress: 78 },
      { name: "Technical Evaluation", value: "$4.1M", tenders: 15, progress: 100 },
      { name: "Commercial Proposal", value: "$3.8M", tenders: 18, progress: 93 },
      { name: "Final Negotiation", value: "$2.8M", tenders: 8, progress: 68 },
      { name: "Won", value: "$1.5M", tenders: 7, progress: 37 },
    ],
    baselineTurnaround: "28.4 Days",
    optimizedTurnaround: "22.6 Days",
    efficiencyGain: "20.4% Workflow Efficiency Gain",
  },
  "Commercial Construction": {
    kpis: [
      { label: "Total Pipeline Value", value: "$6.4M", helper: "24 Enterprise Tenders" },
      { label: "Risk-Adjusted Revenue", value: "$4.0M", helper: "Monte Carlo Simulated Expected Value" },
      { label: "Proposal Turnaround Gain", value: "-18.8%", helper: "DMAIC Cycle Time Optimization" },
      { label: "Target Accounts Won", value: "6 Deals", helper: "High-Margin Procurement Secured" },
    ],
    stages: [
      { name: "Lead Staging", value: "$1.4M", tenders: 5, progress: 82 },
      { name: "Technical Evaluation", value: "$1.7M", tenders: 6, progress: 100 },
      { name: "Commercial Proposal", value: "$1.5M", tenders: 7, progress: 88 },
      { name: "Final Negotiation", value: "$1.1M", tenders: 3, progress: 65 },
      { name: "Won", value: "$0.7M", tenders: 3, progress: 41 },
    ],
    baselineTurnaround: "27.7 Days",
    optimizedTurnaround: "22.5 Days",
    efficiencyGain: "18.8% Workflow Efficiency Gain",
  },
  "Government Procurement": {
    kpis: [
      { label: "Total Pipeline Value", value: "$5.7M", helper: "22 Enterprise Tenders" },
      { label: "Risk-Adjusted Revenue", value: "$3.8M", helper: "Monte Carlo Simulated Expected Value" },
      { label: "Proposal Turnaround Gain", value: "-21.6%", helper: "DMAIC Cycle Time Optimization" },
      { label: "Target Accounts Won", value: "5 Deals", helper: "High-Margin Procurement Secured" },
    ],
    stages: [
      { name: "Lead Staging", value: "$1.0M", tenders: 4, progress: 63 },
      { name: "Technical Evaluation", value: "$1.5M", tenders: 6, progress: 94 },
      { name: "Commercial Proposal", value: "$1.6M", tenders: 7, progress: 100 },
      { name: "Final Negotiation", value: "$1.0M", tenders: 3, progress: 63 },
      { name: "Won", value: "$0.6M", tenders: 2, progress: 38 },
    ],
    baselineTurnaround: "29.1 Days",
    optimizedTurnaround: "22.8 Days",
    efficiencyGain: "21.6% Workflow Efficiency Gain",
  },
  Infrastructure: {
    kpis: [
      { label: "Total Pipeline Value", value: "$3.3M", helper: "14 Enterprise Tenders" },
      { label: "Risk-Adjusted Revenue", value: "$2.0M", helper: "Monte Carlo Simulated Expected Value" },
      { label: "Proposal Turnaround Gain", value: "-20.9%", helper: "DMAIC Cycle Time Optimization" },
      { label: "Target Accounts Won", value: "4 Deals", helper: "High-Margin Procurement Secured" },
    ],
    stages: [
      { name: "Lead Staging", value: "$0.8M", tenders: 3, progress: 73 },
      { name: "Technical Evaluation", value: "$0.9M", tenders: 3, progress: 82 },
      { name: "Commercial Proposal", value: "$0.7M", tenders: 4, progress: 64 },
      { name: "Final Negotiation", value: "$0.7M", tenders: 2, progress: 64 },
      { name: "Won", value: "$0.2M", tenders: 2, progress: 18 },
    ],
    baselineTurnaround: "28.2 Days",
    optimizedTurnaround: "22.3 Days",
    efficiencyGain: "20.9% Workflow Efficiency Gain",
  },
};

export default function TenderPipelineDashboardPage() {
  const [selectedSector, setSelectedSector] = useState<Sector>("All Sectors");
  const currentData = useMemo(() => dashboardData[selectedSector], [selectedSector]);

  return (
    <main className="min-h-screen bg-[#0A192F] px-6 py-8 text-[#F8FAFC] sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link
              href="/"
              className="inline-flex w-fit items-center rounded-full border border-[#1E293B] px-4 py-2 text-sm font-semibold text-[#94A3B8] transition hover:border-[#3B82F6] hover:text-[#F8FAFC]"
            >
              ← Back to Portfolio
            </Link>
            <span className="w-fit rounded-full bg-[#3B82F6]/10 px-4 py-2 text-sm font-semibold text-[#3B82F6]">
              Executive Live Dashboard
            </span>
          </div>
          <div className="max-w-4xl">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">
              Bay Oceania C&amp;T Ltd.
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[#F8FAFC] md:text-5xl">
              Bay Oceania C&amp;T Ltd. — Executive Tender Pipeline Analytics
            </h1>
            <p className="mt-5 text-lg leading-8 text-[#94A3B8]">
              Real-time GTM tracking, Monte Carlo risk forecasting, and Lean Six Sigma (DMAIC)
              turnaround optimization.
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Sector Filter</p>
              <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">Interactive Pipeline View</h2>
            </div>
            <p className="text-sm text-[#94A3B8]">Selected: {selectedSector}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {sectors.map((sector) => {
              const isActive = selectedSector === sector;
              return (
                <button
                  key={sector}
                  type="button"
                  onClick={() => setSelectedSector(sector)}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "border-[#3B82F6] bg-[#3B82F6] text-[#F8FAFC]"
                      : "border-[#1E293B] bg-[#0A192F] text-[#94A3B8] hover:border-[#3B82F6] hover:text-[#F8FAFC]"
                  }`}
                >
                  {sector}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {currentData.kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">{kpi.label}</p>
              <p className="mt-5 text-4xl font-bold text-[#F8FAFC]">{kpi.value}</p>
              <p className="mt-3 text-sm text-[#3B82F6]">{kpi.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
          <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
            <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Pipeline Stage Breakdown</p>
                <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">Tender Value by Stage</h2>
              </div>
              <p className="text-sm text-[#94A3B8]">Progress bars normalized to the largest stage value.</p>
            </div>
            <div className="space-y-5">
              {currentData.stages.map((stage) => (
                <div key={stage.name}>
                  <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#F8FAFC]">{stage.name}</p>
                      <p className="text-sm text-[#94A3B8]">{stage.tenders} Tenders</p>
                    </div>
                    <p className="text-lg font-bold text-[#3B82F6]">{stage.value}</p>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-[#0A192F]">
                    <div
                      className="h-full rounded-full bg-[#3B82F6] transition-all duration-500"
                      style={{ width: `${stage.progress}%` }}
                      aria-label={`${stage.name} progress ${stage.progress}%`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <aside className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">DMAIC Turnaround</p>
            <h2 className="mt-2 text-2xl font-bold text-[#F8FAFC]">Cycle Time Optimization</h2>
            <div className="mt-8 space-y-4">
              <div className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
                <p className="text-sm text-[#94A3B8]">Baseline Turnaround</p>
                <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">{currentData.baselineTurnaround}</p>
              </div>
              <div className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
                <p className="text-sm text-[#94A3B8]">DMAIC Optimized Turnaround</p>
                <p className="mt-2 text-3xl font-bold text-[#F8FAFC]">{currentData.optimizedTurnaround}</p>
              </div>
              <div className="rounded-2xl border border-[#3B82F6]/40 bg-[#3B82F6]/10 p-5 text-center">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Validated Gain</p>
                <p className="mt-2 text-2xl font-bold text-[#3B82F6]">{currentData.efficiencyGain}</p>
              </div>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
