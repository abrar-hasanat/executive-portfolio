"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const kpis = [
  { label: "Model", value: "Scenario", helper: "Demonstration" },
  { label: "Inputs", value: "Policy", helper: "User-controlled" },
  { label: "Output", value: "Multiple", helper: "Scenario estimate" },
  { label: "Output", value: "Risk", helper: "Scenario estimate" },
];

const impacts = [
  { label: "Interest Rates", value: -32, color: "bg-red-400" },
  { label: "Regulatory Stability", value: 28, color: "bg-emerald-400" },
  { label: "Country Risk", value: -24, color: "bg-orange-300" },
  { label: "Sector Baseline", value: 16, color: "bg-[#3B82F6]" },
];

const sectors = ["Enterprise Tech", "Healthcare Analytics", "Clean Energy", "Logistics & Infrastructure"];

export default function EconomicValuationDashboardPage() {
  const [rateBps, setRateBps] = useState(0);
  const [regVolatility, setRegVolatility] = useState(35);
  const [sector, setSector] = useState(sectors[0]);

  const simulation = useMemo(() => {
    const sectorPremium = sector === "Enterprise Tech" ? 0.8 : sector === "Healthcare Analytics" ? 0.45 : sector === "Clean Energy" ? 0.2 : -0.35;
    const predictedMultiple = Math.max(3.5, 12.4 + sectorPremium - rateBps * 0.0064 - (regVolatility - 35) * 0.034);
    const successProbability = Math.max(8, Math.min(94, 73 + sectorPremium * 7 - rateBps * 0.045 - (regVolatility - 35) * 0.42));
    const downsideBuffer = Math.max(0, 100 - Math.abs(rateBps) * 0.12 - regVolatility * 0.45);
    return { predictedMultiple, successProbability, downsideBuffer };
  }, [rateBps, regVolatility, sector]);

  return (
    <main className="min-h-screen bg-[#0A192F] px-6 py-8 text-[#F8FAFC] sm:px-10 lg:px-16">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="overflow-hidden rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/30 md:p-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link href="/" className="inline-flex w-fit items-center rounded-full border border-[#1E293B] px-4 py-2 text-sm font-semibold text-[#94A3B8] transition hover:border-[#3B82F6] hover:text-[#F8FAFC]">
              ← Back to Portfolio
            </Link>
            <div className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-4 py-2 text-sm font-semibold text-[#93C5FD]">
              OLS + Monte Carlo Executive Simulator
            </div>
          </div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-[#3B82F6]">Demonstration</p>
          <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">Economic Valuation Demonstration</h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[#94A3B8]">
            Adjust policy inputs to explore a valuation scenario.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <article key={kpi.label} className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6">
              <p className="text-sm text-[#94A3B8]">{kpi.label}</p>
              <p className="mt-3 text-3xl font-bold text-[#F8FAFC]">{kpi.value}</p>
              <p className="mt-2 text-sm font-semibold text-[#3B82F6]">{kpi.helper}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Policy sensitivity</p>
                <h2 className="mt-3 text-2xl font-bold">Valuation scenario</h2>
              </div>
              <select value={sector} onChange={(event) => setSector(event.target.value)} className="rounded-2xl border border-[#1E293B] bg-[#0A192F] px-4 py-3 text-sm font-semibold text-[#F8FAFC]">
                {sectors.map((item) => <option key={item}>{item}</option>)}
              </select>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <label className="block rounded-2xl border border-[#1E293B] bg-[#0A192F]/60 p-5">
                <span className="flex justify-between text-sm font-semibold text-[#94A3B8]"><span>Interest Rate Adjustment (bps)</span><span>{rateBps > 0 ? "+" : ""}{rateBps}</span></span>
                <input type="range" min="-200" max="200" step="10" value={rateBps} onChange={(event) => setRateBps(Number(event.target.value))} className="mt-5 w-full accent-[#3B82F6]" />
              </label>
              <label className="block rounded-2xl border border-[#1E293B] bg-[#0A192F]/60 p-5">
                <span className="flex justify-between text-sm font-semibold text-[#94A3B8]"><span>Regulatory Volatility Index</span><span>{regVolatility}</span></span>
                <input type="range" min="0" max="100" step="1" value={regVolatility} onChange={(event) => setRegVolatility(Number(event.target.value))} className="mt-5 w-full accent-[#3B82F6]" />
              </label>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-[#0A192F] p-5"><p className="text-sm text-[#94A3B8]">Predicted Valuation Multiple</p><p className="mt-2 text-4xl font-bold">{simulation.predictedMultiple.toFixed(1)}x</p><p className="text-sm text-[#3B82F6]">EBITDA</p></div>
              <div className="rounded-2xl bg-[#0A192F] p-5"><p className="text-sm text-[#94A3B8]">Market Entry Success Probability</p><p className="mt-2 text-4xl font-bold">{simulation.successProbability.toFixed(0)}%</p><p className="text-sm text-[#3B82F6]">3-year ROI hurdle</p></div>
              <div className="rounded-2xl bg-[#0A192F] p-5"><p className="text-sm text-[#94A3B8]">Downside Resilience Buffer</p><p className="mt-2 text-4xl font-bold">{simulation.downsideBuffer.toFixed(0)}%</p><p className="text-sm text-[#3B82F6]">policy stress capacity</p></div>
            </div>
          </article>

          <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 md:p-8">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Econometric Variable Impact Breakdown</p>
            <h2 className="mt-3 text-2xl font-bold">Feature weights and directional elasticity</h2>
            <div className="mt-8 space-y-6">
              {impacts.map((impact) => (
                <div key={impact.label}>
                  <div className="mb-2 flex justify-between text-sm"><span className="text-[#94A3B8]">{impact.label}</span><span className="font-bold">{impact.value > 0 ? "+" : ""}{impact.value}%</span></div>
                  <div className="h-3 rounded-full bg-[#0A192F]"><div className={`h-3 rounded-full ${impact.color}`} style={{ width: `${Math.abs(impact.value) * 2.5}%` }} /></div>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-[#1E293B] bg-[#0A192F]/70 p-5 text-sm leading-7 text-[#94A3B8]">
              Use this demonstration to compare the effect of policy inputs on the scenario.
            </div>
          </article>
        </section>
      </section>
    </main>
  );
}
