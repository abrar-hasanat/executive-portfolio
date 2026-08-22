"use client";

import { motion } from "framer-motion";
import { credentialCategories } from "@/lib/data";
import SectionHeading from "./SectionHeading";

export default function Credentials() {
  return (
    <section
      id="credentials"
      className="border-b border-border bg-navy py-24 sm:py-32"
    >
      <div className="mx-auto max-w-content px-6 sm:px-8">
        <SectionHeading title="Credentials" />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {credentialCategories.map((category, idx) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                className="rounded-lg border border-border bg-navy-surface p-6 transition-colors hover:border-accent/40"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-md bg-accent-faint text-accent">
                  <Icon size={18} strokeWidth={2} />
                </div>
                <h3 className="mb-4 text-base font-semibold text-ink-primary">
                  {category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((skill, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-ink-secondary"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent/60" />
                      <div className="flex flex-col gap-1.5 items-start">
                        <span className={skill.name.includes("In Progress") ? "opacity-75" : ""}>
                          {skill.name}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
