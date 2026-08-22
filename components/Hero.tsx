"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, LayoutDashboard } from "lucide-react";
import { socials } from "@/lib/data";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden border-b border-border"
    >
      {/* Ambient grid: the analyst's canvas, not decoration */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_60%_at_50%_0%,black,transparent)]" />

      {/* Signature element: a quiet, drawn-in trendline referencing BI work */}
      <svg
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[280px] w-full opacity-[0.35]"
        viewBox="0 0 1200 280"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <motion.path
          d="M0 220 L120 190 L240 205 L360 140 L480 160 L600 90 L720 110 L840 55 L960 75 L1080 20 L1200 40"
          stroke="#3B82F6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        />
      </svg>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative mx-auto flex max-w-content flex-col items-start px-6 pb-28 pt-24 sm:px-8 sm:pb-36 sm:pt-32"
      >
        <motion.span
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-navy-surface px-4 py-1.5 font-mono text-xs uppercase tracking-[0.15em] text-ink-secondary"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Senior @ Carleton College: BA Economics, Minors in Data Science
          &amp; Public Policy
        </motion.span>

        <motion.h1
          variants={item}
          className="text-5xl font-bold uppercase tracking-tight text-ink-primary sm:text-7xl"
        >
          Abrar Hasanat
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-3 font-mono text-sm uppercase tracking-[0.25em] text-accent"
        >
          Strategy, Analytics, Operations
        </motion.p>

        <motion.p
          variants={item}
          className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-secondary sm:text-xl"
        >
          I build analytics tools, financial models, and operational workflows. Seeking full-time consulting and product management roles for 2027.
        </motion.p>

        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <a
            href="#case-studies"
            className="group inline-flex items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
          >
            Explore Case Studies
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
          <a
            href="/dashboards"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
          >
            <LayoutDashboard size={16} />
            Launch Dashboard
          </a>
          <a
            href={socials.github}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-ink-primary transition-colors hover:border-accent hover:text-accent"
          >
            <Github size={16} />
            GitHub
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}
