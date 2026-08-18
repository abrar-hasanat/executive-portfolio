"use client";

import Link from "next/link";
import { ChangeEvent, DragEvent, FormEvent, ReactNode, useMemo, useState } from "react";
import Papa from "papaparse";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Download, FileSpreadsheet, Loader2, Search, ShieldCheck, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, ComposedChart, Legend, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type FinancialYear = { year: string; revenue: number; ebit: number; operatingCashFlow: number; capex: number; totalDebt: number; cash: number; sharesOutstanding: number; netIncome: number; equity: number; ebitda: number; interestExpense: number; investedCapital: number; marketPrice: number };
type Company = { ticker: string; name: string; currency: string; marketPrice: number; financials: FinancialYear[]; catalysts: string[]; sentiment: string[] };
type Projection = { year: string; revenue: number; ebit: number; fcff: number; discountFactor: number; pvFcff: number };
type Health = "STRONG" | "MODERATE" | "WATCHLIST";

type CsvRow = Partial<Record<"year" | "revenue" | "ebit" | "operating_cash_flow" | "capex" | "total_debt" | "cash" | "shares_outstanding" | "net_income" | "equity" | "ebitda" | "interest_expense" | "invested_capital" | "market_price", string | number>>;
type TickerApiResponse = { success: true; ticker: string; name: string; currentPrice: number; financials: FinancialYear[] } | { success: false; error: string };
const quickTickers = ["MSFT", "NVDA", "AAPL", "TSLA", "AMZN"];

const presets: Record<string, Company> = {
  MSFT: { ticker: "MSFT", name: "Microsoft Corporation", currency: "USD", marketPrice: 426, catalysts: ["Azure AI workloads expanding enterprise wallet share", "Copilot monetization lifts Office ARPU", "Durable balance sheet supports buybacks and M&A"], sentiment: ["Mega-cap software quality premium remains intact", "AI capex intensity is the core investor debate", "Commercial cloud bookings point to resilient demand"], financials: [
    { year: "2020", revenue: 143015, ebit: 52959, operatingCashFlow: 60675, capex: 15441, totalDebt: 70998, cash: 136527, sharesOutstanding: 7610, netIncome: 44281, equity: 118304, ebitda: 65755, interestExpense: 2591, investedCapital: 189302, marketPrice: 222 },
    { year: "2021", revenue: 168088, ebit: 69916, operatingCashFlow: 76740, capex: 20622, totalDebt: 67775, cash: 130256, sharesOutstanding: 7519, netIncome: 61271, equity: 141988, ebitda: 85134, interestExpense: 2346, investedCapital: 209763, marketPrice: 286 },
    { year: "2022", revenue: 198270, ebit: 83383, operatingCashFlow: 89035, capex: 23886, totalDebt: 61270, cash: 104757, sharesOutstanding: 7464, netIncome: 72738, equity: 166542, ebitda: 100239, interestExpense: 2063, investedCapital: 227812, marketPrice: 256 },
    { year: "2023", revenue: 211915, ebit: 88523, operatingCashFlow: 87582, capex: 28107, totalDebt: 59965, cash: 111262, sharesOutstanding: 7432, netIncome: 72361, equity: 206223, ebitda: 105140, interestExpense: 1968, investedCapital: 266188, marketPrice: 340 },
    { year: "2024", revenue: 245122, ebit: 109433, operatingCashFlow: 118548, capex: 44477, totalDebt: 67127, cash: 75531, sharesOutstanding: 7431, netIncome: 88136, equity: 268477, ebitda: 133558, interestExpense: 1648, investedCapital: 335604, marketPrice: 426 },
  ] },
  NVDA: { ticker: "NVDA", name: "NVIDIA Corporation", currency: "USD", marketPrice: 124, catalysts: ["Data center accelerator backlog remains supply constrained", "Networking and software attach increase platform durability", "Sovereign AI demand broadens customer concentration"], sentiment: ["AI infrastructure leader with premium growth expectations", "Gross margin normalization is the principal sensitivity", "Ecosystem lock-in supports elevated return on capital"], financials: [
    { year: "2020", revenue: 10918, ebit: 2846, operatingCashFlow: 4761, capex: 489, totalDebt: 1991, cash: 10897, sharesOutstanding: 2470, netIncome: 2796, equity: 9342, ebitda: 3810, interestExpense: 52, investedCapital: 11333, marketPrice: 13 },
    { year: "2021", revenue: 16675, ebit: 4532, operatingCashFlow: 5822, capex: 1128, totalDebt: 5964, cash: 11561, sharesOutstanding: 2510, netIncome: 4332, equity: 16893, ebitda: 5691, interestExpense: 184, investedCapital: 22857, marketPrice: 29 },
    { year: "2022", revenue: 26914, ebit: 10041, operatingCashFlow: 9108, capex: 976, totalDebt: 10946, cash: 21208, sharesOutstanding: 2506, netIncome: 9752, equity: 26612, ebitda: 11415, interestExpense: 236, investedCapital: 37558, marketPrice: 24 },
    { year: "2023", revenue: 26974, ebit: 4224, operatingCashFlow: 5641, capex: 1833, totalDebt: 12031, cash: 13296, sharesOutstanding: 2473, netIncome: 4368, equity: 22101, ebitda: 5736, interestExpense: 262, investedCapital: 34132, marketPrice: 49 },
    { year: "2024", revenue: 60922, ebit: 32972, operatingCashFlow: 28090, capex: 1069, totalDebt: 11056, cash: 25984, sharesOutstanding: 2469, netIncome: 29760, equity: 42978, ebitda: 35583, interestExpense: 257, investedCapital: 54034, marketPrice: 124 },
  ] },
  AAPL: { ticker: "AAPL", name: "Apple Inc.", currency: "USD", marketPrice: 216, catalysts: ["Services mix expansion supports margin resilience", "Installed base monetization remains best-in-class", "On-device AI cycle may extend replacement demand"], sentiment: ["Quality compounder with slower hardware growth", "Regulatory pressure on app economics remains visible", "Capital returns provide downside support"], financials: [
    { year: "2020", revenue: 274515, ebit: 66288, operatingCashFlow: 80674, capex: 7309, totalDebt: 112436, cash: 90943, sharesOutstanding: 16977, netIncome: 57411, equity: 65339, ebitda: 77344, interestExpense: 2873, investedCapital: 177775, marketPrice: 129 },
    { year: "2021", revenue: 365817, ebit: 108949, operatingCashFlow: 104038, capex: 11085, totalDebt: 124719, cash: 62639, sharesOutstanding: 16427, netIncome: 94680, equity: 63090, ebitda: 120233, interestExpense: 2645, investedCapital: 187809, marketPrice: 177 },
    { year: "2022", revenue: 394328, ebit: 119437, operatingCashFlow: 122151, capex: 10708, totalDebt: 120069, cash: 48304, sharesOutstanding: 15943, netIncome: 99803, equity: 50672, ebitda: 130541, interestExpense: 2931, investedCapital: 170741, marketPrice: 130 },
    { year: "2023", revenue: 383285, ebit: 114301, operatingCashFlow: 110543, capex: 10959, totalDebt: 111088, cash: 61555, sharesOutstanding: 15550, netIncome: 96995, equity: 62146, ebitda: 125820, interestExpense: 3933, investedCapital: 173234, marketPrice: 171 },
    { year: "2024", revenue: 391035, ebit: 123216, operatingCashFlow: 118254, capex: 9447, totalDebt: 106629, cash: 65171, sharesOutstanding: 15344, netIncome: 93736, equity: 56950, ebitda: 134661, interestExpense: 0.1, investedCapital: 163579, marketPrice: 216 },
  ] },
};

const money = (value: number) => `$${value.toLocaleString(undefined, { maximumFractionDigits: value > 999 ? 0 : 2 })}`;
const pct = (value: number) => `${(value * 100).toFixed(1)}%`;
const cagr = (start: number, end: number, years: number) => Math.pow(end / Math.max(start, 1), 1 / years) - 1;

export default function ValuationEnginePage() {
  const [company, setCompany] = useState<Company>(presets.MSFT);
  const [tickerInput, setTickerInput] = useState("MSFT");
  const [wacc, setWacc] = useState(0.09);
  const [growth, setGrowth] = useState(0.025);
  const [taxRate, setTaxRate] = useState(0.21);
  const [uploadMessage, setUploadMessage] = useState("Drop a CSV to replace preset financials.");
  const [lookupError, setLookupError] = useState<string | null>(null);
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const model = useMemo(() => {
    const f = company.financials;
    const latest = f[f.length - 1];
    const revenueCagr = cagr(f[0].revenue, latest.revenue, f.length - 1);
    const ebitMargin = f.reduce((sum, y) => sum + y.ebit / y.revenue, 0) / f.length;
    const reinvestmentRate = Math.max(0.06, Math.min(0.32, (latest.capex / latest.revenue) * 0.75));
    const projections: Projection[] = Array.from({ length: 5 }, (_, index) => {
      const year = String(Number(latest.year) + index + 1);
      const revenue = latest.revenue * Math.pow(1 + Math.min(revenueCagr, 0.32), index + 1);
      const ebit = revenue * ebitMargin;
      const fcff = ebit * (1 - taxRate) - revenue * reinvestmentRate * 0.22;
      const discountFactor = 1 / Math.pow(1 + wacc, index + 1);
      return { year, revenue, ebit, fcff, discountFactor, pvFcff: fcff * discountFactor };
    });
    const terminalFcff = projections[4].fcff * (1 + growth);
    const terminalValue = terminalFcff / Math.max(0.01, wacc - growth);
    const pvTerminal = terminalValue / Math.pow(1 + wacc, 5);
    const enterpriseValue = projections.reduce((sum, p) => sum + p.pvFcff, 0) + pvTerminal;
    const netDebt = latest.totalDebt - latest.cash;
    const equityValue = enterpriseValue - netDebt;
    const targetPrice = equityValue / latest.sharesOutstanding;
    const upside = targetPrice / company.marketPrice - 1;
    const ratios = f.map((y) => ({ year: y.year, operatingMargin: y.ebit / y.revenue, netMargin: y.netIncome / y.revenue, roe: y.netIncome / y.equity, roic: y.ebit * (1 - taxRate) / y.investedCapital, netDebtEbitda: (y.totalDebt - y.cash) / y.ebitda, interestCoverage: y.ebit / Math.max(y.interestExpense, 1) }));
    const latestRatio = ratios[ratios.length - 1];
    const score = (latestRatio.operatingMargin > 0.28 ? 2 : 1) + (latestRatio.roic > 0.18 ? 2 : 1) + (latestRatio.netDebtEbitda < 1 ? 2 : 0) + (latestRatio.interestCoverage > 10 ? 2 : 1);
    const health: Health = score >= 7 ? "STRONG" : score >= 5 ? "MODERATE" : "WATCHLIST";
    const rating = upside > 0.15 ? "BUY" : upside < -0.1 ? "OVERVALUED" : "HOLD";
    const sensitivity = [-0.01, -0.005, 0, 0.005, 0.01].map((w) => [-0.005, -0.0025, 0, 0.0025, 0.005].map((g) => ({ wacc: wacc + w, growth: growth + g, price: ((projections.reduce((sum, p, i) => sum + (p.fcff / Math.pow(1 + wacc + w, i + 1)), 0) + (projections[4].fcff * (1 + growth + g)) / Math.max(0.01, wacc + w - (growth + g)) / Math.pow(1 + wacc + w, 5)) - netDebt) / latest.sharesOutstanding })));
    return { latest, revenueCagr, projections, terminalValue, enterpriseValue, netDebt, equityValue, targetPrice, upside, ratios, health, rating, sensitivity };
  }, [company, growth, taxRate, wacc]);

  const fetchTicker = async (ticker: string) => {
    const key = ticker.trim().toUpperCase();
    if (!key) return;
    setTickerInput(key);
    setLookupError(null);

    if (presets[key]) {
      setCompany(presets[key]);
      setUploadMessage("Preset company loaded with institutional historical financials.");
      return;
    }

    setIsLookupLoading(true);
    try {
      const response = await fetch(`/api/ticker?symbol=${encodeURIComponent(key)}`);
      const payload = (await response.json()) as TickerApiResponse;
      if (!response.ok || !payload.success) {
        throw new Error(payload.success ? `Unable to load ${key}.` : payload.error);
      }
      setCompany({
        ticker: payload.ticker,
        name: payload.name,
        currency: "USD",
        marketPrice: payload.currentPrice,
        financials: payload.financials,
        catalysts: [
          `${payload.ticker} fundamentals normalized from Yahoo Finance server-side data`,
          "DCF engine recalculated with live quote and statement metrics",
          "Sensitivity grid and PDF memo are now tied to the active ticker",
        ],
        sentiment: [
          "Server-side lookup avoids browser CORS restrictions",
          "Fallback history protects the model when reported statements are incomplete",
          "Investment readout should be validated against primary filings before capital allocation",
        ],
      });
      setUploadMessage(`Live fundamentals loaded for ${payload.ticker}.`);
    } catch (error) {
      setLookupError(error instanceof Error ? error.message : `Unable to load ${key}.`);
    } finally {
      setIsLookupLoading(false);
    }
  };

  const handleTickerSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetchTicker(tickerInput);
  };

  const loadTicker = (ticker: string) => { void fetchTicker(ticker); };
  const parseCsv = (file: File) => Papa.parse<CsvRow>(file, { header: true, dynamicTyping: true, skipEmptyLines: true, complete: ({ data }) => {
    const rows = data.filter((r) => r.revenue && r.ebit).map((r, i) => ({ year: String(r.year ?? 2020 + i), revenue: Number(r.revenue), ebit: Number(r.ebit), operatingCashFlow: Number(r.operating_cash_flow ?? Number(r.ebit) * 1.05), capex: Number(r.capex ?? Number(r.revenue) * 0.06), totalDebt: Number(r.total_debt ?? 0), cash: Number(r.cash ?? 0), sharesOutstanding: Number(r.shares_outstanding ?? 1000), netIncome: Number(r.net_income ?? Number(r.ebit) * 0.78), equity: Number(r.equity ?? Number(r.revenue) * 0.45), ebitda: Number(r.ebitda ?? Number(r.ebit) * 1.15), interestExpense: Number(r.interest_expense ?? Math.max(Number(r.ebit) * 0.025, 1)), investedCapital: Number(r.invested_capital ?? Number(r.revenue) * 0.55), marketPrice: Number(r.market_price ?? 100) }));
    if (rows.length) { setCompany({ ticker: "CUSTOM", name: file.name.replace(/\.csv$/i, ""), currency: "USD", marketPrice: rows[rows.length - 1].marketPrice, financials: rows, catalysts: ["Custom management case imported from CSV", "Valuation flexes dynamically with capital assumptions", "Operational leverage and reinvestment intensity drive upside"], sentiment: ["Client-supplied statements normalized in-browser", "No server upload required for sensitive data", "Scenario outputs should be diligence-tested before investment use"] }); setTickerInput("CUSTOM"); setUploadMessage(`${rows.length} historical periods imported from ${file.name}.`); }
  }});
  const onFile = (event: ChangeEvent<HTMLInputElement>) => event.target.files?.[0] && parseCsv(event.target.files[0]);
  const onDrop = (event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); event.dataTransfer.files?.[0] && parseCsv(event.dataTransfer.files[0]); };

  const downloadPdf = () => {
    const doc = new jsPDF({ unit: "pt", format: "letter" });
    const navy = [10, 25, 47] as [number, number, number], blue = [59, 130, 246] as [number, number, number];
    const reportDate = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    doc.setFillColor(...navy); doc.rect(0, 0, 612, 92, "F"); doc.setTextColor(248, 250, 252); doc.setFontSize(18); doc.text("EQUITY RESEARCH & VALUATION MEMO", 40, 38); doc.setFontSize(11); doc.text(`${company.name} (${company.ticker}) | ${reportDate} | Lead Analyst: Abrar Hasanat`, 40, 62);
    doc.setTextColor(15, 23, 42); doc.setFontSize(16); doc.text("Investment Summary", 40, 126); doc.setFontSize(11); doc.text(`Target Price: ${money(model.targetPrice)}  |  Upside/Downside: ${(model.upside * 100).toFixed(1)}%  |  Rating: ${model.rating}`, 40, 150); company.catalysts.forEach((c, i) => doc.text(`• ${c}`, 54, 176 + i * 16));
    autoTable(doc, { startY: 236, head: [["Year", "Revenue", "EBIT", "Op. Margin", "Net Margin", "ROIC", "ND/EBITDA", "Int. Cov."]], body: model.ratios.map((r, i) => [r.year, money(company.financials[i].revenue), money(company.financials[i].ebit), pct(r.operatingMargin), pct(r.netMargin), pct(r.roic), `${r.netDebtEbitda.toFixed(1)}x`, `${r.interestCoverage.toFixed(1)}x`]), headStyles: { fillColor: blue }, styles: { fontSize: 8 } });
    autoTable(doc, { startY: (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 24, head: [["Year", "Revenue", "EBIT", "FCFF", "Discount Factor", "PV FCFF"]], body: model.projections.map((p) => [p.year, money(p.revenue), money(p.ebit), money(p.fcff), p.discountFactor.toFixed(3), money(p.pvFcff)]), headStyles: { fillColor: [17, 34, 64] }, styles: { fontSize: 8 } });
    doc.addPage(); doc.setFillColor(...navy); doc.rect(0, 0, 612, 70, "F"); doc.setTextColor(248, 250, 252); doc.setFontSize(16); doc.text("Sensitivity, Risk Diagnostics & Catalysts", 40, 42);
    autoTable(doc, { startY: 100, head: [["WACC \\ g", ...model.sensitivity[0].map((c) => pct(c.growth))]], body: model.sensitivity.map((row) => [pct(row[0].wacc), ...row.map((c) => money(c.price))]), headStyles: { fillColor: blue }, styles: { halign: "center", fontSize: 9 }, columnStyles: { 3: { fillColor: [219, 234, 254] } } });
    autoTable(doc, { startY: 260, head: [["Diagnostic", "Current Readout", "Health Flag"]], body: [["Enterprise Value", money(model.enterpriseValue), model.health], ["Net Debt", money(model.netDebt), model.netDebt < 0 ? "Net cash advantage" : "Leverage watch"], ["Revenue CAGR", pct(model.revenueCagr), model.revenueCagr > 0.08 ? "Growth compounder" : "Mature growth"], ["Terminal Value", money(model.terminalValue), "DCF long-duration exposure"]], headStyles: { fillColor: [17, 34, 64] } });
    doc.setFontSize(13); doc.setTextColor(15, 23, 42); doc.text("Market Sentiment, Key Catalysts & Macro Considerations", 40, 430); [...company.sentiment, ...company.catalysts].forEach((item, i) => doc.text(`• ${item}`, 54, 456 + i * 16));
    doc.setFontSize(9); doc.setTextColor(100); doc.text("Confidential Equity Research | Generated via StratOS Intelligence Engine | abrarhasanat.com", 40, 760);
    doc.save(`${company.ticker}-valuation-memo.pdf`);
  };

  const kpis = [{ label: "Intrinsic Target Price", value: money(model.targetPrice), tone: "text-[#F8FAFC]" }, { label: "Implied Upside / Downside", value: `${(model.upside * 100).toFixed(1)}%`, tone: model.upside >= 0 ? "text-[#10B981]" : "text-[#EF4444]" }, { label: "Enterprise Value", value: money(model.enterpriseValue), tone: "text-[#F8FAFC]" }, { label: "Financial Health", value: model.health, tone: model.health === "STRONG" ? "text-[#10B981]" : model.health === "MODERATE" ? "text-[#3B82F6]" : "text-[#EF4444]" }];

  return <main className="min-h-screen bg-gradient-to-br from-[#020C1B] via-[#0A192F] to-[#020C1B] px-4 py-6 text-[#F8FAFC] sm:px-6 lg:px-10"><section className="mx-auto max-w-7xl space-y-6">
    <header className="rounded-3xl border border-[#1E293B] bg-[#112240]/95 p-6 shadow-2xl shadow-black/30"><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><Link href="/" className="text-sm font-semibold text-[#94A3B8] hover:text-[#3B82F6]">← abrarhasanat.com / dashboards / valuation-engine</Link><p className="mt-5 text-xs font-bold uppercase tracking-[0.35em] text-[#3B82F6]">Interactive Enterprise Valuation Engine</p><h1 className="mt-3 text-3xl font-black tracking-tight md:text-5xl">{company.name} <span className="text-[#3B82F6]">({company.ticker})</span></h1><p className="mt-3 text-[#94A3B8]">Live DCF target price {money(model.targetPrice)} versus market reference {money(company.marketPrice)}.</p></div><button onClick={downloadPdf} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3B82F6] px-5 py-3 font-bold text-white shadow-lg shadow-blue-950/50 transition hover:bg-blue-500"><Download size={18} /> Download Research Report (PDF)</button></div></header>
    <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]"><article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5"><h2 className="flex items-center gap-2 text-xl font-bold"><Search size={20}/> Input Layer</h2><form onSubmit={handleTickerSubmit} className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={tickerInput} onChange={(e) => setTickerInput(e.target.value.toUpperCase())} placeholder="Search any ticker, e.g. TSLA" className="min-w-0 flex-1 rounded-2xl border border-[#1E293B] bg-[#0F172A] px-4 py-3 text-white outline-none focus:border-[#3B82F6]"/><button type="submit" disabled={isLookupLoading} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-[#3B82F6] px-5 py-3 font-bold text-[#93C5FD] disabled:cursor-not-allowed disabled:opacity-60">{isLookupLoading ? <Loader2 className="animate-spin" size={18} /> : null} Load</button></form>{lookupError ? <div className="mt-3 rounded-2xl border border-[#EF4444]/40 bg-[#EF4444]/10 px-4 py-3 text-sm text-red-200">{lookupError}</div> : null}<div className="mt-3 flex flex-wrap gap-2">{quickTickers.map((t) => <button key={t} onClick={() => loadTicker(t)} className="rounded-full bg-[#0F172A] px-4 py-2 text-sm font-bold text-[#94A3B8] hover:text-white">{t}</button>)}</div><label onDragOver={(e) => e.preventDefault()} onDrop={onDrop} className="mt-5 flex cursor-pointer flex-col items-center rounded-3xl border border-dashed border-[#3B82F6]/60 bg-[#0F172A] p-6 text-center"><FileSpreadsheet className="text-[#3B82F6]"/><span className="mt-2 font-bold">Drag-and-drop custom financial statement CSV</span><span className="mt-1 text-sm text-[#94A3B8]">{uploadMessage}</span><input type="file" accept=".csv" onChange={onFile} className="hidden"/></label><div className="mt-5 grid gap-4"><Slider label="WACC" value={wacc} min={0.06} max={0.15} step={0.001} onChange={setWacc}/><Slider label="Perpetual Growth Rate" value={growth} min={0.01} max={0.04} step={0.001} onChange={setGrowth}/><Slider label="Tax Rate" value={taxRate} min={0.15} max={0.30} step={0.001} onChange={setTaxRate}/></div></article>
    <section className="grid gap-4 sm:grid-cols-2">{kpis.map((k) => <article key={k.label} className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5"><p className="text-sm text-[#94A3B8]">{k.label}</p><p className={`mt-3 text-3xl font-black ${k.tone}`}>{k.value}</p><p className="mt-2 text-sm text-[#3B82F6]">{company.currency} millions except per-share data</p></article>)}</section></section>
    <section className="grid gap-6 xl:grid-cols-2"><Card title="5-Year Forward FCFF & EBIT Growth Projection"><ResponsiveContainer width="100%" height={330}><ComposedChart data={model.projections}><CartesianGrid stroke="#1E293B"/><XAxis dataKey="year" stroke="#94A3B8"/><YAxis stroke="#94A3B8"/><Tooltip contentStyle={{ background: "#0F172A", border: "1px solid #1E293B", color: "#F8FAFC" }}/><Legend/><Bar dataKey="fcff" name="FCFF" fill="#3B82F6" radius={[8,8,0,0]}/><Line dataKey="ebit" name="EBIT" stroke="#10B981" strokeWidth={3}/></ComposedChart></ResponsiveContainer></Card><Card title="Profitability Margin Trajectory"><ResponsiveContainer width="100%" height={330}><BarChart data={model.ratios}><CartesianGrid stroke="#1E293B"/><XAxis dataKey="year" stroke="#94A3B8"/><YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} stroke="#94A3B8"/><Tooltip formatter={(v) => pct(Number(v))} contentStyle={{ background: "#0F172A", border: "1px solid #1E293B" }}/><Legend/><Bar dataKey="operatingMargin" name="Operating Margin"><Cell fill="#3B82F6"/></Bar><Bar dataKey="netMargin" name="Net Margin" fill="#10B981"/></BarChart></ResponsiveContainer></Card></section>
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"><Card title="5x5 WACC vs. Perpetual Growth Sensitivity Matrix"><div className="overflow-x-auto"><table className="w-full min-w-[620px] text-sm"><tbody>{model.sensitivity.map((row, i) => <tr key={i}>{i === 0 && <th className="p-3 text-left text-[#94A3B8]">WACC / g</th>}{i > 0 && <th className="p-3 text-left text-[#94A3B8]">{pct(row[0].wacc)}</th>}{row.map((cell, j) => i === 0 ? <th key={j} className="p-3 text-[#94A3B8]">{pct(cell.growth)}</th> : <td key={j} className={`border border-[#1E293B] p-3 text-center font-bold ${i === 2 && j === 2 ? "bg-[#3B82F6] text-white" : "bg-[#0F172A]"}`}>{money(cell.price)}</td>)}</tr>)}</tbody></table></div></Card><Card title="Financial Health & Ratio Diagnostics"><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="text-left text-[#94A3B8]"><th className="p-3">Year</th><th>ROE</th><th>ROIC</th><th>ND/EBITDA</th><th>Interest Coverage</th></tr></thead><tbody>{model.ratios.map((r) => <tr key={r.year} className="border-t border-[#1E293B]"><td className="p-3 font-bold">{r.year}</td><td>{pct(r.roe)}</td><td>{pct(r.roic)}</td><td>{r.netDebtEbitda.toFixed(1)}x</td><td>{r.interestCoverage.toFixed(1)}x</td></tr>)}</tbody></table></div><div className="mt-5 rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4"><p className="flex items-center gap-2 font-bold"><ShieldCheck className="text-[#10B981]"/> Diagnostic Scorecard: <span className={model.health === "STRONG" ? "text-[#10B981]" : "text-[#EF4444]"}>{model.health}</span></p><p className="mt-2 text-sm text-[#94A3B8]">Automated flag: {model.upside >= 0 ? "upside opportunity" : "downside risk"} of {Math.abs(model.upside * 100).toFixed(1)}%.</p></div></Card></section>
    <Card title="Market Sentiment & Key Catalysts Feed"><div className="grid gap-4 md:grid-cols-2">{[...company.sentiment, ...company.catalysts].map((item) => <div key={item} className="rounded-2xl border border-[#1E293B] bg-[#0F172A] p-4 text-sm text-[#CBD5E1]"><TrendingUp className="mb-3 text-[#3B82F6]" size={18}/>{item}</div>)}</div></Card>
  </section></main>;
}

function Slider({ label, value, min, max, step, onChange }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void }) { return <label className="block"><span className="flex justify-between text-sm font-bold text-[#94A3B8]"><span>{label}</span><span>{pct(value)}</span></span><input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full accent-[#3B82F6]"/></label>; }
function Card({ title, children }: { title: string; children: ReactNode }) { return <article className="rounded-3xl border border-[#1E293B] bg-[#112240] p-5 shadow-xl shadow-black/20"><h2 className="mb-5 text-xl font-black">{title}</h2>{children}</article>; }
