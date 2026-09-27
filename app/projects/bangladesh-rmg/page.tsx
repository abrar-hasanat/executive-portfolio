import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Github } from "lucide-react";
import evidence from "@/public/data/bangladesh-rmg/dashboard.json";

export const metadata: Metadata = {
  title: "Bangladesh Apparel Trade and Worker Protection | Abrar Hasanat",
  description: "Independent research on US apparel sourcing after Rana Plaza, historical GSP exposure and evidence on worker protection.",
};
const code = "https://github.com/abrar-hasanat/executive-portfolio/tree/main/research/bangladesh-rmg";
const events = [
  { date: "24 April 2013", title: "Rana Plaza collapses", text: "A workplace disaster and a shock to public attention. It is distinct from subsequent trade and safety decisions.", source: "European Parliament", url: "https://www.europarl.europa.eu/doceo/document/TA-7-2013-0230_EN.pdf" },
  { date: "May 2013", title: "Accord agreed", text: "The text dated 13 May, signed on 15 May, combines inspections, remediation, worker representation and supplier incentives.", source: "Original Accord", url: "https://internationalaccord.org/wp-content/uploads/2024/12/2013-Accord.pdf" },
  { date: "27 June 2013", title: "US GSP suspension announced", text: "The decision concerns eligible products. Most apparel was already outside GSP. The proclamation was published on 2 July.", source: "USTR", url: "https://ustr.gov/about-us/policy-offices/press-office/press-releases/2013/june/michael-froman-gsp-bangladesh" },
  { date: "July 2013", title: "Further governance responses", text: "The EU, Bangladesh and ILO launch the Sustainability Compact; the Alliance adds a separate buyer initiative. Several mechanisms overlap.", source: "ILO", url: "https://www.ilo.org/resource/news/ilo-eu-bangladesh-government-adopt-new-compact-garment-factory-safety" },
  { date: "31 July 2013", title: "GSP expires across the program", text: "The common lapse complicates any eligible-product comparison between Bangladesh and other beneficiaries.", source: "USTR", url: "https://ustr.gov/about-us/policy-offices/press-office/fact-sheets/2014/november/gsp-expiration-frequently-asked" },
  { date: "3 September 2013", title: "CBP operational suspension date", text: "CBP's corrected notice gives this date. An HTS change record instead lists 31 August; the discrepancy is retained in the policy notes.", source: "CBP correction", url: "https://content.govdelivery.com/accounts/USDHSCBP/bulletins/82fe9c" },
  { date: "29 July 2015", title: "GSP renewed", text: "Retroactive duty refunds cover eligible entries during the lapse, with Bangladesh excluded. Restoration of the program is distinct from country reinstatement.", source: "Federal Register", url: "https://www.govinfo.gov/content/pkg/FR-2015-07-28/pdf/2015-18459.pdf" },
];

export default function BangladeshResearchProject() {
  const first = evidence.annual.find(r => r.country === "Bangladesh" && r.year === 2012)!;
  const last = evidence.annual.find(r => r.country === "Bangladesh" && r.year === 2018)!;
  const contrast = evidence.contrasts[0];
  return <main className="min-h-screen bg-[#020C1B] px-5 py-10 text-slate-50 sm:px-8">
    <article className="mx-auto max-w-5xl">
      <Link href="/#case-studies" className="text-sm text-slate-300 hover:text-teal-200">← Back to portfolio</Link>
      <header className="mt-10 border-b border-slate-700 pb-10">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200">Independent research · May 2026 - Present</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">Bangladesh apparel trade and worker protection</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">How did Bangladesh&apos;s position in US apparel sourcing change after Rana Plaza, and what can trade evidence tell us about protecting workers?</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/dashboards/bangladesh-rmg" className="inline-flex items-center gap-3 rounded-xl bg-teal-200 px-5 py-3 font-semibold text-slate-950 hover:bg-teal-100">Explore the evidence <ArrowRight size={18} /></Link>
          <a href={code} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 rounded-xl border border-slate-500 px-5 py-3 font-semibold hover:border-teal-200"><Github size={18} /> Code and documentation</a>
        </div>
      </header>
      <section className="py-10" aria-labelledby="question">
        <h2 id="question" className="text-2xl font-bold">Start with the policy mechanism</h2>
        <p className="mt-4 leading-8 text-slate-300">The 2013 US suspension of Bangladesh&apos;s Generalized System of Preferences benefits is often grouped with the response to Rana Plaza. Yet most apparel was already excluded from that preference program. Treating every garment export as newly tariffed would give a regression the wrong treatment.</p>
        <p className="mt-4 leading-8 text-slate-300">This project audits that exposure and describes sourcing changes using 120 official UN Comtrade records. Bangladesh&apos;s competitors provide context for market reallocation. They are not assumed to be unaffected control countries. Published labour research supplies separate evidence about workers.</p>
        <p className="mt-4 text-sm text-slate-400">Institutional sources: <a className="text-teal-200 underline" href="https://www.ustr.gov/sites/default/files/GSP%20Guidebook%20July%202013.pdf">USTR&apos;s July 2013 guide</a> and historical <a className="text-teal-200 underline" href={`${code}/docs/policy_timeline.md`}>tariff and policy records</a>.</p>
      </section>
      <section className="rounded-3xl border border-slate-700 bg-[#112240] p-6 sm:p-9" aria-labelledby="findings">
        <h2 id="findings" className="text-2xl font-bold">Continued sourcing with uneven gains</h2>
        <div className="mt-7 grid gap-8 sm:grid-cols-2">
          <div><p className="text-4xl font-bold text-teal-200">{first.share_pct.toFixed(2)}% → {last.share_pct.toFixed(2)}%</p><p className="mt-3 leading-7 text-slate-300">Bangladesh&apos;s share of US apparel import value, 2012 to 2018. Nominal imports grew {contrast.bd_growth_pct.toFixed(1)}%, from ${(first.value_usd / 1e9).toFixed(2)}bn to ${(last.value_usd / 1e9).toFixed(2)}bn.</p></div>
          <div><p className="text-4xl font-bold text-teal-200">+{contrast.within_chapter_pp.toFixed(3)} pp</p><p className="mt-3 leading-7 text-slate-300">Contribution from gains within knit and non-knit apparel. Changing US market composition offset {Math.abs(contrast.composition_pp).toFixed(3)} points, leaving a {contrast.share_change_pp.toFixed(3)}-point total gain.</p></div>
        </div>
        <p className="mt-7 border-t border-slate-600 pt-6 text-sm leading-7 text-slate-300">Starting in 2013 gives a smaller {evidence.contrasts[2].share_change_pp.toFixed(3)}-point gain through 2018. This sensitivity matters. Continued imports do not establish that reforms caused growth, prevented a larger decline, or improved every worker&apos;s circumstances.</p>
      </section>
      <section className="py-12" aria-labelledby="timeline">
        <h2 id="timeline" className="text-2xl font-bold">One year contained several different shocks</h2>
        <ol className="mt-7 grid gap-5 sm:grid-cols-2">
          {events.map(e => <li key={e.title} className="rounded-2xl border border-slate-700 p-5"><p className="text-xs font-semibold uppercase tracking-wide text-teal-200">{e.date}</p><h3 className="mt-2 text-lg font-semibold">{e.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{e.text}</p><a href={e.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-xs text-teal-200 underline">{e.source}</a></li>)}
        </ol>
      </section>
      <section className="grid gap-9 border-t border-slate-700 py-10 md:grid-cols-2">
        <div><h2 className="text-2xl font-bold">Approach and limits</h2><p className="mt-4 leading-8 text-slate-300">The panel covers US-reported imports in HS 61 and 62, 2010-2019, from Bangladesh, China, Vietnam, Cambodia, India and the world. An exact symmetric decomposition separates changes within chapters from changes in the US market&apos;s chapter mix.</p><p className="mt-4 leading-8 text-slate-300">Values are current dollars in Comtrade&apos;s CIF-type field. They are not export volume or domestic value added. HS revisions change during the period. The analysis uses broad chapters and does not claim a tariff-line concordance. Wages, injuries and firm exits are outside this dataset.</p></div>
        <div><h2 className="text-2xl font-bold">Policy interpretation</h2><p className="mt-4 leading-8 text-slate-300">Maintaining orders can give buyers an incentive to finance remediation and enforce standards. The original Accord included both supplier obligations and provisions for financially feasible improvements. This is a reason to assess purchasing practices alongside audits.</p><p className="mt-4 leading-8 text-slate-300">Experimental evidence on safety committees supports specific improvements in covered factories, with limits on duration and generalization. Aggregate trade resilience cannot reveal what happened to workers in factories that lost orders. Policy evaluation should follow them too.</p><p className="mt-4 text-sm text-slate-400">Read the <a className="text-teal-200 underline" href={`${code}/docs/literature_matrix.md`}>literature and version notes</a>, including Boudreau (2024), Bossavie, Cho and Heath (2023), and Heath and Mobarak (2015).</p></div>
      </section>
      <footer className="border-t border-slate-700 py-8 text-sm leading-7 text-slate-400">Abrar Mohammad Hasanat. Analysis v{evidence.analysis_version}; frozen UN Comtrade snapshot retrieved {evidence.retrieved_at.slice(0, 10)}. <a className="text-teal-200 underline" href={`${code}/docs/reproducibility.md`}>Validation and reproduction record</a>.</footer>
    </article>
  </main>;
}
