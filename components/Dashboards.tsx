"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, RadioTower } from "lucide-react";
import { interactiveDashboards } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function Dashboards() {
  return (
    <section id="dashboards" className="border-y border-[#1E293B] bg-[#0A192F] py-24 sm:py-32">
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHeading
          eyebrow="Live Interactive Systems"
          title="Executive Dashboards & Decision Engines"
          description="Fully interactive simulators, quantitative models, and operational toolkits deployed live on domain."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          {interactiveDashboards.map((dashboard, index) => (
            <motion.article
              key={dashboard.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: index * 0.08 }}
              className="group flex h-full flex-col rounded-2xl border border-[#1E293B] bg-[#112240] p-6 shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-[#3B82F6]/60 hover:shadow-[#3B82F6]/10"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full border border-[#3B82F6]/30 bg-[#3B82F6]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#93C5FD]">
                  {dashboard.tag}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-[#10B981]/30 bg-[#10B981]/10 px-3 py-1 text-xs font-semibold text-[#A7F3D0]">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-[#10B981]" />
                  Live Production
                </span>
              </div>

              <div className="mt-7 flex grow flex-col">
                <RadioTower className="mb-5 text-[#3B82F6]" size={28} />
                <h3 className="text-2xl font-bold tracking-tight text-[#F8FAFC]">
                  {dashboard.title}
                </h3>
                <p className="mt-4 grow text-sm leading-7 text-[#94A3B8]">
                  {dashboard.subtitle}
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  {dashboard.features.map((feature) => (
                    <span key={feature} className="rounded-full border border-[#1E293B] bg-[#0A192F] px-3 py-1.5 text-xs font-medium text-[#CBD5E1]">
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <a href={dashboard.href} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#3B82F6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                    Launch Live Dashboard <ArrowRight size={16} />
                  </a>
                  <a href={dashboard.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#1E293B] px-5 py-3 text-sm font-semibold text-[#F8FAFC] transition hover:border-[#3B82F6] hover:text-[#93C5FD]">
                    <Github size={16} /> View Code
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
