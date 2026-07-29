import { Github, Linkedin, Mail } from "lucide-react";
import { socials } from "@/lib/data";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="border-t border-border bg-navy">
      <div className="mx-auto max-w-content px-6 py-16 sm:px-8 sm:py-20">
        <div className="flex flex-col items-start justify-between gap-10 sm:flex-row sm:items-end">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-accent">
              Let&rsquo;s connect
            </span>
            <h2 className="mt-3 max-w-md text-2xl font-semibold tracking-tight text-ink-primary sm:text-3xl">
              Open to Consulting &amp; Product Management conversations for
              2027.
            </h2>
            <a
              href={`mailto:${socials.email}`}
              className="mt-4 inline-flex items-center gap-2 text-base text-ink-secondary transition-colors hover:text-accent"
            >
              <Mail size={16} />
              {socials.email}
            </a>
          </div>

          <div className="flex gap-3">
            <a
              href={socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-ink-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <Linkedin size={18} />
            </a>
            <a
              href={socials.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="flex h-11 w-11 items-center justify-center rounded-md border border-border text-ink-secondary transition-colors hover:border-accent hover:text-accent"
            >
              <Github size={18} />
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 text-xs text-ink-secondary/70 sm:flex-row sm:items-center">
          <span>&copy; {year} Abrar Hasanat. All rights reserved.</span>
          <span className="font-mono uppercase tracking-widest">
            Built with Next.js &amp; Tailwind CSS
          </span>
        </div>
      </div>
    </footer>
  );
}
