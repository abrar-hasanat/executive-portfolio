"use client";

import { useEffect, useState } from "react";
import { socials } from "@/lib/data";

const links = [
  { href: "#credentials", label: "Credentials" },
  { href: "#case-studies", label: "Case Studies" },
  { href: "/dashboards", label: "Dashboards" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-border bg-navy/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 sm:px-8">
        <a
          href="#top"
          className="font-mono text-sm tracking-widest text-ink-primary"
        >
          AH<span className="text-accent">.</span>
        </a>
        <div className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-secondary transition-colors hover:text-ink-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
        <a
          href={`mailto:${socials.email}`}
          className="rounded-md border border-border px-4 py-2 text-sm text-ink-primary transition-colors hover:border-accent hover:text-accent"
        >
          Get in Touch
        </a>
      </nav>
    </header>
  );
}
