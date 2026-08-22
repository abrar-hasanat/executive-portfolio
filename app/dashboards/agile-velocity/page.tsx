"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Check, Clipboard, Download, FileText, SlidersHorizontal } from "lucide-react";

type Quadrant = "Quick Win" | "Strategic Bet" | "Resource Trap" | "Fill-in";
type Filter = "All" | "Quick Win" | "Strategic Bet" | "Resource Trap";

type BacklogItem = {
  feature: string;
  reach: number;
  impact: number;
  confidence: number;
  effort: number;
  quadrant: Quadrant;
};

const backlog: BacklogItem[] = [
  { feature: "SSO + SCIM provisioning", reach: 92, impact: 3, confidence: 0.9, effort: 5, quadrant: "Quick Win" },
  { feature: "Portfolio delivery cockpit", reach: 88, impact: 3, confidence: 0.85, effort: 8, quadrant: "Strategic Bet" },
  { feature: "AI release-risk assistant", reach: 76, impact: 3, confidence: 0.7, effort: 13, quadrant: "Strategic Bet" },
  { feature: "Bulk workflow approvals", reach: 81, impact: 2, confidence: 0.9, effort: 3, quadrant: "Quick Win" },
  { feature: "Regional data residency", reach: 54, impact: 3, confidence: 0.75, effort: 13, quadrant: "Resource Trap" },
  { feature: "Legacy report builder", reach: 38, impact: 1, confidence: 0.65, effort: 8, quadrant: "Resource Trap" },
  { feature: "Slack incident digest", reach: 66, impact: 2, confidence: 0.8, effort: 3, quadrant: "Quick Win" },
  { feature: "Dark-mode preference", reach: 32, impact: 1, confidence: 0.95, effort: 2, quadrant: "Fill-in" },
];

const historical = [
  [42, 38], [46, 43], [44, 41], [51, 47], [48, 46], [54, 49],
  [50, 45], [56, 53], [58, 52], [55, 51], [60, 56], [57, 54],
].map(([committed, completed], index, values) => ({
  sprint: `S${index + 1}`,
  committed,
  completed,
  rolling: Math.round(values.slice(Math.max(0, index - 2), index + 1).reduce((sum, row) => sum + row[1], 0) / Math.min(3, index + 1)),
}));

const forecastStart = new Date("2026-08-24T00:00:00Z");

const auditItems = [
  { anomaly: "Scope Creep", signal: "+18% unplanned story points in the last three sprints", phase: "Define", severity: "High", color: "#EF4444" },
  { anomaly: "Quality Regression", signal: "Escaped defects rose above the 2.0 / sprint control limit", phase: "Analyze", severity: "High", color: "#EF4444" },
  { anomaly: "Cycle Time Variance", signal: "P85 cycle time is 1.6× the team baseline", phase: "Measure", severity: "Medium", color: "#F59E0B" },
];

function quantile(values: number[], percentile: number) {
  return values[Math.min(values.length - 1, Math.ceil(values.length * percentile) - 1)];
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

export default function AgileVelocityDashboardPage() {
  const [scope, setScope] = useState(260);
  const [teamSize, setTeamSize] = useState(8);
  const [focus, setFocus] = useState(0.72);
  const [sprintDays, setSprintDays] = useState(10);
  const [targetSprints, setTargetSprints] = useState(6);
  const [filter, setFilter] = useState<Filter>("All");
  const [copied, setCopied] = useState(false);

  const simulation = useMemo(() => {
    const random = seededRandom(scope * 31 + teamSize * 997 + Math.round(focus * 1000) * 7 + sprintDays * 71);
    const baselineVelocity = teamSize * sprintDays * focus * 0.92;
    const completions = Array.from({ length: 10000 }, () => {
      let remaining = scope;
      let sprints = 0;
      while (remaining > 0 && sprints < 30) {
        const variation = 0.68 + random() * 0.62;
        remaining -= baselineVelocity * variation;
        sprints += 1;
      }
      return sprints;
    }).sort((a, b) => a - b);
    const maxSprint = Math.max(targetSprints + 4, completions[completions.length - 1]);
    const curve = Array.from({ length: maxSprint }, (_, index) => {
      const sprint = index + 1;
      const completed = completions.filter((value) => value <= sprint).length;
      return { sprint, probability: Number(((completed / completions.length) * 100).toFixed(1)) };
    });
    return { baselineVelocity, completions, curve, p50: quantile(completions, 0.5), p80: quantile(completions, 0.8), p90: quantile(completions, 0.9) };
  }, [focus, scope, sprintDays, targetSprints, teamSize]);

  const dateForSprint = (sprints: number) => formatDate(new Date(forecastStart.getTime() + sprints * sprintDays * 86400000));
  const filteredBacklog = filter === "All" ? backlog : backlog.filter((item) => item.quadrant === filter);
  const reliability = (historical.reduce((sum, item) => sum + item.completed / item.committed, 0) / historical.length) * 100;
  const targetProbability = simulation.curve.find((point) => point.sprint === targetSprints)?.probability ?? 100;

  const prd = `# Delivery PRD: Agile Velocity & Capacity Forecast\n\n## Decision summary\n- **Backlog scope:** ${scope} story points\n- **Delivery team:** ${teamSize} engineers at ${(focus * 100).toFixed(0)}% focus factor\n- **Sprint cadence:** ${sprintDays} business days\n- **Target milestone:** Sprint ${targetSprints} (${dateForSprint(targetSprints)})\n\n## Forecast\n- **Expected sustainable velocity:** ${simulation.baselineVelocity.toFixed(1)} story points / sprint\n- **Monte Carlo trials:** 10,000\n- **P50 completion:** Sprint ${simulation.p50} (${dateForSprint(simulation.p50)})\n- **P80 completion:** Sprint ${simulation.p80} (${dateForSprint(simulation.p80)})\n- **P90 completion:** Sprint ${simulation.p90} (${dateForSprint(simulation.p90)})\n- **Probability of target:** ${targetProbability}%\n\n## Prioritized delivery bets\n${backlog.filter((item) => item.quadrant === "Quick Win" || item.quadrant === "Strategic Bet").map((item) => `- **${item.feature}**: ${item.quadrant}; RICE ${(item.reach * item.impact * item.confidence / item.effort).toFixed(1)}`).join("\n")}\n\n## DMAIC delivery risk register\n${auditItems.map((item) => `- **${item.anomaly} (${item.severity})**: ${item.signal}. Control owner: Delivery Lead; DMAIC phase: ${item.phase}.`).join("\n")}\n\n## Planning note\nApprove the P80 planning commitment (Sprint ${simulation.p80}) and protect focus capacity through weekly scope-control review.`;

  function downloadPrd() {
    const url = URL.createObjectURL(new Blob([prd], { type: "text/markdown" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "executive-agile-delivery-prd.md";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  async function copyPrd() {
    await navigator.clipboard.writeText(prd);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#020C1B] px-4 py-6 text-[#F8FAFC] sm:px-6 lg:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <header className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/30 md:p-8">
          <Link href="/" className="inline-flex text-sm font-semibold text-[#94A3B8] transition hover:text-[#3B82F6]">← Back to Executive Portfolio</Link>
          <div className="mt-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div><p className="text-xs font-bold uppercase tracking-[0.35em] text-[#3B82F6]">10,000 trial model</p><h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">Agile Velocity &amp; Capacity Forecaster</h1><p className="mt-4 max-w-3xl text-base leading-7 text-[#94A3B8]">Set capacity assumptions and export a planning memo.</p></div>
            <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 px-5 py-4"><p className="text-xs font-bold uppercase tracking-wider text-[#A7F3D0]">Target confidence</p><p className="mt-1 text-3xl font-black text-[#10B981]">{targetProbability}%</p><p className="text-xs text-[#A7F3D0]">by Sprint {targetSprints}</p></div>
          </div>
        </header>

        <section className="grid gap-5 xl:grid-cols-[0.85fr_2.15fr]">
          <aside className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20"><div className="flex items-center gap-2 text-[#3B82F6]"><SlidersHorizontal size={18}/><p className="text-xs font-bold uppercase tracking-[0.25em]">Scenario controls</p></div><h2 className="mt-3 text-xl font-bold">Live planning inputs</h2><div className="mt-6 space-y-5">
            <Range label="Backlog scope" value={`${scope} pts`} min={50} max={500} step={10} state={scope} onChange={setScope}/>
            <Range label="Team engineers" value={`${teamSize} devs`} min={3} max={15} step={1} state={teamSize} onChange={setTeamSize}/>
            <Range label="Focus factor" value={focus.toFixed(2)} min={0.4} max={0.9} step={0.01} state={focus} onChange={setFocus}/>
            <Range label="Sprint length" value={`${sprintDays} days`} min={5} max={15} step={1} state={sprintDays} onChange={setSprintDays}/>
            <Range label="Target milestone" value={`${targetSprints} sprints`} min={2} max={12} step={1} state={targetSprints} onChange={setTargetSprints}/>
          </div></aside>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Metric label="Sustainable velocity" value={`${simulation.baselineVelocity.toFixed(0)} pts`} detail="per sprint" color="#3B82F6"/>
            <Metric label="P50 completion" value={`S${simulation.p50}`} detail={dateForSprint(simulation.p50)} color="#10B981"/>
            <Metric label="P80 commitment" value={`S${simulation.p80}`} detail={dateForSprint(simulation.p80)} color="#F59E0B"/>
            <Metric label="P90 risk case" value={`S${simulation.p90}`} detail={dateForSprint(simulation.p90)} color="#EF4444"/>
            <article className="col-span-full rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">Monte Carlo completion curve</p><h2 className="mt-2 text-xl font-bold">Cumulative probability of full backlog delivery</h2></div><p className="text-sm text-[#94A3B8]">10,000 randomized velocity passes</p></div><div className="mt-4 h-[275px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={simulation.curve}><CartesianGrid stroke="#1E293B" vertical={false}/><XAxis dataKey="sprint" stroke="#94A3B8" tickLine={false}/><YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} stroke="#94A3B8" tickLine={false}/><Tooltip formatter={(value) => [`${value}%`, "Completion probability"]} contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12 }}/><ReferenceLine x={simulation.p50} stroke="#10B981" label={{ value: "P50", fill: "#10B981", position: "top" }}/><ReferenceLine x={simulation.p80} stroke="#F59E0B" label={{ value: "P80", fill: "#F59E0B", position: "top" }}/><ReferenceLine x={simulation.p90} stroke="#EF4444" label={{ value: "P90", fill: "#EF4444", position: "top" }}/><Line type="monotone" dataKey="probability" stroke="#3B82F6" strokeWidth={3} dot={false}/></LineChart></ResponsiveContainer></div></article>
          </section>
        </section>

        <section className="grid gap-6 xl:grid-cols-2"><Panel eyebrow="Velocity reliability" title="12-sprint delivery trend"><div className="mb-3 flex gap-4 text-xs text-[#94A3B8]"><span>Reliability: <b className="text-[#10B981]">{reliability.toFixed(0)}%</b></span><span>Rolling average = 3 sprints</span></div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><LineChart data={historical}><CartesianGrid stroke="#1E293B" vertical={false}/><XAxis dataKey="sprint" stroke="#94A3B8"/><YAxis stroke="#94A3B8"/><Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12 }}/><Legend/><Line dataKey="committed" name="Committed" stroke="#64748B" strokeWidth={2}/><Line dataKey="completed" name="Completed" stroke="#10B981" strokeWidth={3}/><Line dataKey="rolling" name="Rolling velocity" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5"/></LineChart></ResponsiveContainer></div></Panel>
          <Panel eyebrow="Value vs. effort" title="RICE backlog matrix"><div className="mb-3 flex flex-wrap gap-2">{(["All", "Quick Win", "Strategic Bet", "Resource Trap"] as Filter[]).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full border px-3 py-1 text-xs font-bold ${filter === value ? "border-[#3B82F6] bg-[#3B82F6] text-white" : "border-[#1E293B] text-[#94A3B8] hover:border-[#3B82F6]"}`}>{value}</button>)}</div><div className="h-[280px]"><ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid stroke="#1E293B"/><XAxis type="number" dataKey="effort" name="Effort" domain={[0, 15]} stroke="#94A3B8" label={{ value: "Effort", fill: "#94A3B8", position: "insideBottom", offset: -5 }}/><YAxis type="number" dataKey="impact" name="Impact" domain={[0, 4]} stroke="#94A3B8" label={{ value: "Impact", fill: "#94A3B8", angle: -90, position: "insideLeft" }}/><Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", borderRadius: 12 }}/><ReferenceLine x={7.5} stroke="#475569"/><ReferenceLine y={2} stroke="#475569"/><Scatter data={filteredBacklog} fill="#3B82F6"/></ScatterChart></ResponsiveContainer></div></Panel></section>

        <section className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><Panel eyebrow="Prioritization queue" title="Enterprise RICE backlog"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-left text-sm"><thead className="border-b border-[#1E293B] text-xs uppercase tracking-wider text-[#94A3B8]"><tr><th className="pb-3">Feature</th><th className="pb-3">Reach</th><th className="pb-3">Impact</th><th className="pb-3">Effort</th><th className="pb-3">RICE</th><th className="pb-3">Decision</th></tr></thead><tbody>{filteredBacklog.map((item) => { const rice = item.reach * item.impact * item.confidence / item.effort; return <tr key={item.feature} className="border-b border-[#1E293B]/70"><td className="py-3 font-semibold">{item.feature}</td><td>{item.reach}</td><td>{item.impact}</td><td>{item.effort}</td><td className="font-bold text-[#3B82F6]">{rice.toFixed(1)}</td><td><span className="rounded-full bg-[#0A192F] px-2 py-1 text-xs text-[#CBD5E1]">{item.quadrant}</span></td></tr>; })}</tbody></table></div></Panel>
          <Panel eyebrow="DMAIC anomaly audit" title="Delivery risk register"><div className="space-y-3">{auditItems.map((item) => <div key={item.anomaly} className="rounded-2xl border border-[#1E293B] bg-[#0A192F] p-4"><div className="flex items-center justify-between gap-2"><p className="font-bold">{item.anomaly}</p><span style={{ color: item.color }} className="text-xs font-bold uppercase">{item.severity}</span></div><p className="mt-2 text-sm leading-6 text-[#94A3B8]">{item.signal}</p><p className="mt-3 text-xs font-bold uppercase tracking-wider text-[#3B82F6]">{item.phase} phase</p></div>)}</div></Panel></section>

        <section className="rounded-3xl border border-[#1E293B] bg-[#112240] p-6 shadow-xl shadow-black/20"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="flex gap-4"><div className="rounded-2xl bg-[#3B82F6]/10 p-3 text-[#3B82F6]"><FileText/></div><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">Executive memo generator</p><h2 className="mt-1 text-2xl font-bold">Delivery PRD &amp; DMAIC Risk Register</h2><p className="mt-2 text-sm text-[#94A3B8]">Current scenario, commitment bands, prioritization, and controls: formatted as Markdown.</p></div></div><div className="flex flex-wrap gap-3"><button onClick={copyPrd} className="inline-flex items-center gap-2 rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-bold hover:bg-blue-500">{copied ? <Check size={16}/> : <Clipboard size={16}/>} {copied ? "Copied" : "Copy PRD to Clipboard"}</button><button onClick={downloadPrd} className="inline-flex items-center gap-2 rounded-xl border border-[#1E293B] px-4 py-3 text-sm font-bold hover:border-[#3B82F6]"><Download size={16}/> Download Markdown Memo</button></div></div><pre className="mt-6 max-h-64 overflow-auto rounded-2xl border border-[#1E293B] bg-[#020C1B] p-4 whitespace-pre-wrap font-mono text-xs leading-6 text-[#CBD5E1]">{prd}</pre></section>
      </section>
    </main>
  );
}

function Range({ label, value, min, max, step, state, onChange }: { label: string; value: string; min: number; max: number; step: number; state: number; onChange: (value: number) => void }) {
  return <label className="block"><span className="flex justify-between text-sm font-semibold"><span>{label}</span><span className="text-[#3B82F6]">{value}</span></span><input aria-label={label} type="range" min={min} max={max} step={step} value={state} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full accent-[#3B82F6]"/></label>;
}

function Metric({ label, value, detail, color }: { label: string; value: string; detail: string; color: string }) {
  return <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#94A3B8]">{label}</p><p style={{ color }} className="mt-4 text-3xl font-black">{value}</p><p className="mt-1 text-xs text-[#94A3B8]">{detail}</p></article>;
}

function Panel({ eyebrow, title, children }: { eyebrow: string; title: string; children: React.ReactNode }) {
  return <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#3B82F6]">{eyebrow}</p><h2 className="mt-2 text-xl font-bold">{title}</h2><div className="mt-5">{children}</div></article>;
}
