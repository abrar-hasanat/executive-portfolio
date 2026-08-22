"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { caseStudies } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function CaseStudies() {
  return (
    <section id="case-studies" className="bg-navy py-24 sm:py-32">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHeading title="Work and projects" />

        <div className="flex flex-col gap-8">
          {caseStudies.map((study, idx) => (
            <motion.article
              key={study.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: idx * 0.05 }}
              className="overflow-hidden rounded-lg border border-border bg-navy-surface"
            >
              <div className="p-8 lg:p-10">
                <div>
                  <div className="flex flex-wrap gap-3">
                    {study.company ? (
                      <span className="rounded-full border border-border bg-navy px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-ink-secondary">
                        {study.company}
                      </span>
                    ) : null}
                    {study.role ? (
                      <span className="rounded-full border border-border bg-navy px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-ink-secondary">
                        {study.role}
                      </span>
                    ) : null}
                    {study.period ? (
                      <span className="rounded-full border border-border bg-navy px-3 py-1 text-[11px] uppercase tracking-[0.24em] text-ink-secondary">
                        {study.period}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-ink-primary">
                    {study.title}
                  </h3>

                  {study.summary ? (
                    <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                      {study.summary}
                    </p>
                  ) : study.client ? (
                    <p className="mt-4 text-sm leading-relaxed text-ink-secondary">
                      {study.client}
                    </p>
                  ) : null}

                  <div className="mt-8 space-y-6">
                    {(study.problemStatement || study.problem) && (
                      <div>
                        <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                          Challenge
                        </dt>
                        <p className="text-sm leading-relaxed text-ink-secondary">
                          {study.problemStatement ?? study.problem}
                        </p>
                      </div>
                    )}

                    {(study.strategicSolution || study.methodology) && (
                      <div>
                        <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                          Approach
                        </dt>
                        <p className="text-sm leading-relaxed text-ink-secondary">
                          {study.strategicSolution ?? study.methodology}
                        </p>
                      </div>
                    )}

                    {study.impactMetrics?.length ? (
                      <div>
                        <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                          Impact Metrics
                        </dt>
                        <div className="mt-3 grid gap-3 sm:grid-cols-3">
                          {study.impactMetrics.map((metric) => (
                            <div
                              key={metric.label}
                              className="rounded-md border border-border bg-navy px-3.5 py-3"
                            >
                              <div className="font-mono text-base font-semibold text-ink-primary">
                                {metric.value}
                              </div>
                              <div className="mt-1 text-[11px] text-ink-secondary">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : study.metrics?.length ? (
                      <div>
                        <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                          Impact Metrics
                        </dt>
                        <div className="mt-3 flex flex-wrap gap-3">
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
                    ) : null}

                    {study.methodologies?.length || study.techStack?.length ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {study.methodologies?.length ? (
                          <div>
                            <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                              Methodologies
                            </dt>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {study.methodologies.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-border bg-navy px-3 py-1 text-[11px] text-ink-secondary"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                        {study.techStack?.length ? (
                          <div>
                            <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                              Tech Stack
                            </dt>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {study.techStack.map((item) => (
                                <span
                                  key={item}
                                  className="rounded-full border border-border bg-navy px-3 py-1 text-[11px] text-ink-secondary"
                                >
                                  {item}
                                </span>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    {study.outcomes?.length ? (
                      <div>
                        <dt className="mb-1.5 font-mono text-[11px] uppercase tracking-widest text-ink-secondary/70">
                          Outcomes
                        </dt>
                        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-secondary">
                          {study.outcomes.map((outcome) => (
                            <li key={outcome} className="list-disc pl-4">
                              {outcome}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  {(study.liveDashboardUrl || study.dashboardUrl) && (
                    <a
                      href={study.liveDashboardUrl ?? study.dashboardUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
                    >
                      <ExternalLink size={15} />
                      {study.liveDashboardUrl ? "Launch Dashboard" : "View Project"}
                    </a>
                  )}
                  {(study.githubRepoUrl || study.repoUrl) && (
                    <a
                      href={study.githubRepoUrl ?? study.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 text-sm font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
                    >
                      <Github size={15} />
                      View Code on GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
