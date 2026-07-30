"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type Department = "All Departments" | "Registrar" | "Advising" | "Finance";

const departments: Department[] = ["All Departments", "Registrar", "Advising", "Finance"];

const departmentData: Record<Department, { throughput: number; backlog: string; passRate: string }> = {
  "All Departments": { throughput: 820, backlog: "-20.0%", passRate: "98.0%" },
  Registrar: { throughput: 246, backlog: "-21.4%", passRate: "98.6%" },
  Advising: { throughput: 214, backlog: "-19.8%", passRate: "97.9%" },
  Finance: { throughput: 188, backlog: "-20.6%", passRate: "98.2%" },
};

const kpis = [
  { label: "Backlog Reduction", value: "-20.0%", helper: "Peak Volume Cycle Time" },
  { label: "UAT Script Pass Rate", value: "98.0%", helper: "150+ Test Scripts Verified" },
  { label: "System Integrity Rate", value: "100%", helper: "Zero Data Loss Post-Cutover" },
  { label: "Team Growth Support", value: "3x Scaling", helper: "Capacity Allocation Model" },
];

const dmaicSteps = ["Define", "Measure", "Analyze", "Improve", "Control"];

export default function OperationsCapacityDashboardPage() {
  const [selectedDepartment, setSelectedDepartment] = useState<Department>("All Departments");
  const [scaleFactor, setScaleFactor] = useState(1);
  const currentData = useMemo(() => departmentData[selectedDepartment], [selectedDepartment]);
  const predictedThroughput = Math.round(currentData.throughput * scaleFactor);

  return (
    <main className="min-h-screen bg-[#0A192F] px-6 py-8 text-[#F8FAFC] sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/20 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="inline-flex w-fit items-center rounded-full border border-[#1E293B] px-4 py-2 text-sm font-semibold text-[#94A3B8] transition hover:border-[#3B82F6] hover:text-[#F8FAFC]">
              ← Back to Portfolio
            </Link>
            <span className="w-fit rounded-full bg-[#3B82F6]/10 px-4 py-2 text-sm font-semibold text-[#3B82F6]">
              Workday ERP Cutover Dashboard
            </span>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">Carleton College / TAA Services</p>
          <h1 className="max-w-5xl text-3xl font-bold tracking-tight md:text-5xl">Enterprise ERP System Migration &amp; Capacity Optimization</h1>
          <p className="mt-5 max-w-4xl text-lg leading-8 text-[#94A3B8]">
            Workday ERP cutover, UAT script execution, and Lean Six Sigma (DMAIC) operational scaling.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">{kpi.label}</p>
              <p className="mt-5 text-4xl font-bold">{kpi.value}</p>
              <p className="mt-3 text-sm text-[#3B82F6]">{kpi.helper}</p>
            </article>
          ))}
        </section>

        <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20">
          <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Department Filter</p>
              <h2 className="mt-2 text-2xl font-bold">Operational Readiness View</h2>
            </div>
            <p className="text-sm text-[#94A3B8]">Selected: {selectedDepartment}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {departments.map((department) => {
              const isActive = selectedDepartment === department;
              return (
                <button key={department} type="button" onClick={() => setSelectedDepartment(department)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${isActive ? "border-[#3B82F6] bg-[#3B82F6] text-[#F8FAFC]" : "border-[#1E293B] bg-[#0A192F] text-[#94A3B8] hover:border-[#3B82F6] hover:text-[#F8FAFC]"}`}>
                  {department}
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
          <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">DMAIC Control System</p>
            <h2 className="mt-2 text-2xl font-bold">Define → Measure → Analyze → Improve → Control</h2>
            <div className="mt-8 grid gap-3 md:grid-cols-5">
              {dmaicSteps.map((step, index) => (
                <div key={step} className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-4 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#94A3B8]">Step {index + 1}</p>
                  <p className="mt-3 text-lg font-bold text-[#3B82F6]">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
                <p className="text-sm text-[#94A3B8]">Filtered Backlog Reduction</p>
                <p className="mt-2 text-3xl font-bold">{currentData.backlog}</p>
              </div>
              <div className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
                <p className="text-sm text-[#94A3B8]">Filtered UAT Pass Rate</p>
                <p className="mt-2 text-3xl font-bold">{currentData.passRate}</p>
              </div>
            </div>
          </article>

          <aside className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Capacity Simulator</p>
            <h2 className="mt-2 text-2xl font-bold">Interactive FTE Scaling</h2>
            <p className="mt-4 text-sm leading-6 text-[#94A3B8]">Move the slider from 1x to 3x to estimate weekly throughput while preserving baseline SLA coverage.</p>
            <div className="mt-8 rounded-2xl border border-[#1E293B] bg-[#0A192F] p-5">
              <div className="flex items-center justify-between text-sm text-[#94A3B8]"><span>1x</span><span>{scaleFactor.toFixed(1)}x</span><span>3x</span></div>
              <input aria-label="FTE team scaling factor" type="range" min="1" max="3" step="0.1" value={scaleFactor} onChange={(event) => setScaleFactor(Number(event.target.value))} className="mt-4 w-full accent-[#3B82F6]" />
              <p className="mt-8 text-sm text-[#94A3B8]">Predicted Weekly Throughput</p>
              <p className="mt-2 text-5xl font-bold text-[#F8FAFC]">{predictedThroughput.toLocaleString()}</p>
              <p className="mt-3 text-sm text-[#3B82F6]">requests / week at {scaleFactor.toFixed(1)}x team scale</p>
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
