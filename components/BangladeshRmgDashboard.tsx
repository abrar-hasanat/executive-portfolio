"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, RotateCcw } from "lucide-react";
import { CartesianGrid, Legend, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import evidence from "@/public/data/bangladesh-rmg/dashboard.json";

type Row = (typeof evidence.annual)[number];
type Metric = "share" | "value" | "index";
type Chapter = "all" | "61" | "62";
const countries = ["Bangladesh", "Vietnam", "India", "Cambodia", "China"];
const colors: Record<string, string> = { Bangladesh: "#5EEAD4", Vietnam: "#FDBA74", India: "#C4B5FD", Cambodia: "#93C5FD", China: "#F9A8D4" };
const dashes: Record<string, string> = { Bangladesh: "", Vietnam: "8 3", India: "3 3", Cambodia: "10 3 2 3", China: "2 5" };
const years = Array.from({ length: 10 }, (_, i) => 2010 + i);
const labels: Record<Metric, string> = { share: "Share of US imports (%)", value: "US import value (current USD billions)", index: "Nominal import value index (2012 = 100)" };
const chapterLabels: Record<Chapter, string> = { all: "All apparel (HS 61 + 62)", "61": "Knit apparel (HS 61)", "62": "Non-knit apparel (HS 62)" };
const focus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal-300";
const codeUrl = "https://github.com/abrar-hasanat/executive-portfolio/tree/main/research/bangladesh-rmg";

function value(row: Row, chapter: Chapter) {
  return chapter === "61" ? row.knit_usd : chapter === "62" ? row.nonknit_usd : row.value_usd;
}

export default function BangladeshRmgDashboard() {
  const [selected, setSelected] = useState(["Bangladesh", "Vietnam", "India", "Cambodia"]);
  const [metric, setMetric] = useState<Metric>("share");
  const [chapter, setChapter] = useState<Chapter>("all");
  const [endYear, setEndYear] = useState(2018);
  const [downloadStatus, setDownloadStatus] = useState("");
  const primary = evidence.contrasts[0];
  const filtered = useMemo(() => evidence.annual.filter(r => selected.includes(r.country) && r.year <= endYear), [selected, endYear]);
  const points = useMemo(() => years.filter(y => y <= endYear).map(year => {
    const point: Record<string, number> = { year };
    const world = evidence.annual.find(r => r.year === year && r.country === "World")!;
    for (const country of selected) {
      const row = evidence.annual.find(r => r.year === year && r.country === country);
      const base = evidence.annual.find(r => r.year === 2012 && r.country === country);
      if (!row || !base) continue;
      point[country] = metric === "share" ? 100 * value(row, chapter) / value(world, chapter) : metric === "value" ? value(row, chapter) / 1e9 : 100 * value(row, chapter) / value(base, chapter);
    }
    return point;
  }), [selected, metric, chapter, endYear]);

  function reset() {
    setSelected(["Bangladesh", "Vietnam", "India", "Cambodia"]);
    setMetric("share"); setChapter("all"); setEndYear(2018); setDownloadStatus("");
  }
  function downloadView() {
    const csv = [
      ["year", "country", "chapter", "metric", "unit", "value", "snapshot_sha256"].join(","),
      ...points.flatMap(point => selected.filter(country => Number.isFinite(point[country])).map(country => [point.year, country, chapter, metric, metric === "share" ? "percent" : metric === "value" ? "current_USD_billions" : "2012_equals_100", point[country], evidence.snapshot_sha256].join(","))),
    ].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = `bangladesh-rmg-${chapter}-${metric}-2010-${endYear}.csv`; anchor.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setDownloadStatus(`Downloaded ${filtered.length} observations for the selected view.`);
  }

  return (
    <main className="min-h-screen bg-[#020C1B] px-4 py-8 text-[#F8FAFC] sm:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="rounded-3xl border border-slate-700 bg-[#112240] p-6 md:p-10">
          <nav aria-label="Research navigation" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
            <Link className={focus} href="/dashboards">← All dashboards</Link>
            <Link className={focus} href="/projects/bangladesh-rmg">Read the project</Link>
          </nav>
          <p className="mt-9 text-xs font-bold uppercase tracking-[0.22em] text-teal-200">Observed trade data · 2010 to 2019</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight sm:text-5xl">Bangladesh in US apparel sourcing</h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300">Explore how sourcing changed around Rana Plaza. These data describe imports; they do not estimate the effects of GSP suspension or measure worker safety.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <MetricCard label="Bangladesh share in 2018" value={`${evidence.annual.find(r => r.country === "Bangladesh" && r.year === 2018)!.share_pct.toFixed(2)}%`} detail="of US apparel import value" />
            <MetricCard label="Share change from 2012 to 2018" value={`+${primary.share_change_pp.toFixed(3)} pp`} detail="percentage points, all apparel" />
            <MetricCard label="Nominal value change" value={`+${primary.bd_growth_pct.toFixed(1)}%`} detail="2012 to 2018, current US dollars" />
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-400">The headline comparison stays fixed at the planned 2012 to 2018 contrast. Chart controls below explore other views.</p>
        </header>

        <section className="rounded-3xl border border-slate-700 bg-[#112240] p-5 sm:p-8" aria-labelledby="explore-heading">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 id="explore-heading" className="text-2xl font-bold">Compare sourcing patterns</h2>
            <button onClick={reset} className={`inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2 text-sm hover:bg-slate-700 ${focus}`}><RotateCcw size={15} /> Reset view</button>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            <label className="block text-sm font-medium">Measure
              <select value={metric} onChange={e => setMetric(e.target.value as Metric)} className={`mt-2 w-full rounded-lg border border-slate-500 bg-[#0A192F] p-3 ${focus}`}>
                <option value="share">Share of US imports (%)</option><option value="value">Nominal value (USD billions)</option><option value="index">Nominal value index (2012 = 100)</option>
              </select>
            </label>
            <label className="block text-sm font-medium">Apparel category
              <select value={chapter} onChange={e => setChapter(e.target.value as Chapter)} className={`mt-2 w-full rounded-lg border border-slate-500 bg-[#0A192F] p-3 ${focus}`}>
                {Object.entries(chapterLabels).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
              </select>
            </label>
            <label className="block text-sm font-medium">Last displayed year
              <select value={endYear} onChange={e => setEndYear(Number(e.target.value))} className={`mt-2 w-full rounded-lg border border-slate-500 bg-[#0A192F] p-3 ${focus}`}>
                {[2018, 2019].map(y => <option key={y}>{y}</option>)}
              </select>
            </label>
          </div>
          <fieldset className="mt-6">
            <legend className="mb-3 text-sm font-medium">Supplier origins</legend>
            <div className="flex flex-wrap gap-3">
              {countries.map(country => <label key={country} className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-600 px-4 py-3 text-sm">
                <input type="checkbox" checked={selected.includes(country)} onChange={e => setSelected(e.target.checked ? [...selected, country] : selected.filter(c => c !== country))} className={`h-4 w-4 accent-teal-300 ${focus}`} />
                <span style={{ color: colors[country] }}>{country}</span>
              </label>)}
            </div>
          </fieldset>
          <p className="mt-5 text-sm text-slate-300" aria-live="polite">{chapterLabels[chapter]} · {labels[metric]} · 2010 to {endYear}</p>
          {selected.length === 0 ? <div className="mt-6 flex min-h-72 items-center justify-center rounded-xl border border-dashed border-slate-500 p-8 text-center text-slate-300" role="status">Select at least one supplier to display a chart and download data.</div> : <div className="mt-5 h-[370px] w-full" role="img" aria-label={`${labels[metric]}, ${chapterLabels[chapter]}, 2010 to ${endYear}. Selected suppliers: ${selected.join(", ")}. Exact values are available in the data table below.`}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <LineChart data={points} margin={{ top: 20, right: 15, left: 0, bottom: 12 }} accessibilityLayer>
                <CartesianGrid stroke="#334155" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" stroke="#CBD5E1" tick={{ fontSize: 12 }} minTickGap={20} />
                <YAxis stroke="#CBD5E1" domain={[0, "auto"]} tick={{ fontSize: 12 }} width={48} />
                <Tooltip contentStyle={{ backgroundColor: "#020C1B", border: "1px solid #64748B", borderRadius: 10, color: "#F8FAFC" }} labelFormatter={label => `Calendar year ${label}`} formatter={(v) => typeof v === "number" ? `${v.toFixed(metric === "index" ? 1 : 2)}${metric === "share" ? "%" : metric === "value" ? " bn USD" : ""}` : "Unavailable"} />
                <Legend wrapperStyle={{ paddingTop: 18, fontSize: 12 }} />
                <ReferenceLine x={2013} stroke="#94A3B8" strokeDasharray="3 3" label={{ value: "2013", position: "insideTopRight", fill: "#CBD5E1", fontSize: 11 }} />
                {selected.map(country => <Line key={country} type="linear" dataKey={country} stroke={colors[country]} strokeDasharray={dashes[country]} strokeWidth={country === "Bangladesh" ? 3 : 2} dot={{ r: 3 }} activeDot={{ r: 5 }} connectNulls={false} isAnimationActive={false} />)}
              </LineChart>
            </ResponsiveContainer>
          </div>}
          <p className="mt-4 max-w-4xl text-xs leading-6 text-slate-300">2013 marks Rana Plaza and several distinct responses. The line is a date reference, not an estimated treatment break. All vertical axes start at zero; their upper bounds adjust to the selected data. Market shares use world imports in the selected chapter. Index values use each supplier&apos;s own 2012 value in that chapter.</p>
          {endYear === 2019 && <p className="mt-3 rounded-lg border border-amber-300/30 bg-amber-300/5 p-3 text-sm text-amber-100">The 2019 extension overlaps US-China trade measures. It cannot isolate Bangladesh&apos;s reforms from changes in global sourcing.</p>}
          <div className="mt-6 flex flex-wrap items-center gap-5">
            <button onClick={downloadView} disabled={selected.length === 0} className={`inline-flex items-center gap-2 rounded-lg bg-teal-200 px-4 py-3 text-sm font-bold text-slate-950 hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-40 ${focus}`}><ArrowDownToLine size={16} /> Download selected data</button>
            <a className={`text-sm text-teal-200 underline underline-offset-4 ${focus}`} href="/data/bangladesh-rmg/us_apparel_panel.csv" download>Download full source panel</a>
          </div>
          <p role="status" className="mt-3 text-sm text-teal-100">{downloadStatus}</p>
          <details className="mt-5 rounded-xl border border-slate-600 p-4">
            <summary className={`cursor-pointer font-semibold ${focus}`}>View exact chart values in a table</summary>
            {selected.length === 0 ? <p className="mt-4 text-slate-300">No suppliers selected.</p> : <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-right text-sm">
                <caption className="pb-4 text-left text-xs text-slate-300">{labels[metric]}. Display rounded to {metric === "index" ? 1 : 3} decimals; CSV retains full precision.</caption>
                <thead><tr className="border-b border-slate-500"><th scope="col" className="p-3 text-left">Year</th>{selected.map(c => <th key={c} scope="col" className="p-3">{c}</th>)}</tr></thead>
                <tbody>{points.map(point => <tr key={point.year} className="border-b border-slate-700"><th scope="row" className="p-3 text-left font-normal">{point.year}</th>{selected.map(c => <td key={c} className="p-3 tabular-nums">{Number.isFinite(point[c]) ? point[c].toFixed(metric === "index" ? 1 : 3) : "Unavailable"}</td>)}</tr>)}</tbody>
              </table>
            </div>}
          </details>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-700 bg-[#112240] p-6 sm:p-8">
            <h2 className="text-xl font-bold">What accounts for the share gain?</h2>
            <p className="mt-3 text-sm leading-7 text-slate-300">Between 2012 and 2018, Bangladesh gained share within both apparel chapters. US demand shifted toward knit apparel, where Bangladesh had a smaller market share, partly offsetting those gains.</p>
            <dl className="mt-6 space-y-4 text-sm">
              <Contribution label="Gains within chapters" value={primary.within_chapter_pp} />
              <Contribution label="Changing US market composition" value={primary.composition_pp} />
              <Contribution label="Observed total share change" value={primary.share_change_pp} />
            </dl>
            <p className="mt-5 text-xs leading-6 text-slate-400">Exact symmetric decomposition in percentage points. This accounting identity does not establish why the chapter shares changed.</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-[#112240] p-6 sm:p-8">
            <h2 className="text-xl font-bold">Read the evidence within its scope</h2>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-sm leading-6 text-slate-300">
              <li>US-reported imports are one destination&apos;s sourcing data, not Bangladesh&apos;s worldwide exports.</li>
              <li>Nominal dollar growth combines prices, quantities and product mix. It is not export volume.</li>
              <li>Comparator suppliers provide context. They are not validated counterfactual controls.</li>
              <li>Factory safety, wages and employment require separate evidence.</li>
            </ul>
            <Link href="/projects/bangladesh-rmg" className={`mt-6 inline-flex items-center gap-2 text-sm font-semibold text-teal-200 ${focus}`}>Question, policy timeline and methods <ArrowUpRight size={16} /></Link>
          </div>
        </section>
        <footer className="rounded-2xl border border-slate-700 p-6 text-xs leading-6 text-slate-300">
          <p>Source: <a className="text-teal-200 underline" href="https://comtradeplus.un.org/" target="_blank" rel="noopener noreferrer">UN Comtrade</a>, US reporter 842, import flow M, HS 61 and 62, calendar years 2010-2019. Values use the source&apos;s CIF-type field and differ from Census customs-value series. Retrieved {evidence.retrieved_at.slice(0, 10)}. Analysis version {evidence.analysis_version}.</p>
          <p className="mt-2 break-all">Data snapshot SHA-256: {evidence.snapshot_sha256}</p>
          <p className="mt-3"><a className="text-teal-200 underline" href={codeUrl} target="_blank" rel="noopener noreferrer">Reproduce the analysis and inspect sources</a>. Independent research with AI assistance. No causal or institutional endorsement claims.</p>
        </footer>
      </div>
    </main>
  );
}

function MetricCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return <div className="rounded-xl border border-slate-600 bg-[#0A192F] p-5"><p className="text-xs leading-5 text-slate-300">{label}</p><p className="mt-2 text-3xl font-bold tabular-nums text-teal-200">{value}</p><p className="mt-2 text-xs leading-5 text-slate-400">{detail}</p></div>;
}
function Contribution({ label, value }: { label: string; value: number }) {
  return <div className="flex items-start justify-between gap-4 border-b border-slate-700 pb-3"><dt className="text-slate-300">{label}</dt><dd className="whitespace-nowrap font-semibold tabular-nums">{value > 0 ? "+" : ""}{value.toFixed(3)} pp</dd></div>;
}
