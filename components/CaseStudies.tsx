"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github, Monitor } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-navy py-24 sm:py-32">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHeading
          eyebrow="Featured Case Studies"
          title="Selected engagements"
          description="Each project below moves from the operating problem, to the method used to solve it, to the measurable result — the same structure a case team would use in a client debrief."
        />

        <div className="flex flex-col gap-8">
          {caseStudies.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.05 }}
              className="grid gap-0 overflow-hidden rounded-lg border border-border bg-navy-surface lg:grid-cols-5"
            >
              {/*
                MOCKUP PLACEHOLDER — swap this block for a Shots.so MacBook
                mockup image (e.g. <Image src="/mockups/bay-oceania.png" .../>)
                sized to fill this frame at aspect-[16/11].
              */}
              <div className="relative flex items-center justify-center border-b border-border bg-[#0D1F3A] p-8 lg:col-span-2 lg:border-b-0 lg:border-r">
                <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
                <div className="relative flex aspect-[16/11] w-full max-w-sm flex-col items-center justify-center gap-3 rounded-md border border-dashed border-border-light text-center">
                  <Monitor size={28} className="text-ink-secondary/50" />
                  <span className="px-6 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/60">
                    Dashboard mockup — {study.client}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col justify-between p-8 lg:col-span-3 lg:p-10">
                <div>
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
                    {study.eyebrow}
                  </span>
                  <h3 className="mt-3 text-2xl font-semibold tracking-tight text-ink-primary">
                    {study.title}
                  </h3>
                  <p className="mt-1 text-sm text-ink-secondary">
                    {study.client}
                  </p>

                  <dl className="mt-6 space-y-5">
                    <div>
                      <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                        Problem
                      </dt>
                      <dd className="text-sm leading-relaxed text-ink-secondary">
                        {study.problem}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                        Methodology
                      </dt>
                      <dd className="text-sm leading-relaxed text-ink-secondary">
                        {study.methodology}
                      </dd>
                    </div>
                    <div>
                      <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                        Strategic Impact
                      </dt>
                      <dd className="text-sm leading-relaxed text-ink-secondary">
                        {study.impact}
                      </dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-wrap gap-3">
                    {study.metrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-md border border-border bg-navy px-3.5 py-2"
                      >
                        <div className="font-mono text-base font-semibold text-ink-primary">
                          {metric.value}
                        </div>
                        <div className="text-[11px] text-ink-secondary">
                          {metric.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href={study.dashboardUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
                  >
                    <ExternalLink size={15} />
                    Interact with Live Dashboard
                  </a>
                  <a
                    href={study.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
                  >
                    <Github size={15} />
                    View Raw Code on GitHub
                  </a>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
