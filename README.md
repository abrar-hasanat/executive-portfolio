# Abrar Hasanat — Portfolio

Executive-grade personal portfolio built with Next.js 14 (App Router, TypeScript),
Tailwind CSS, Framer Motion, and Lucide React. Targeted at Management Consulting
and Technical Product Management recruiters.

## Stack

- **Framework:** Next.js 14 (App Router, TypeScript, static export–friendly)
- **Styling:** Tailwind CSS with a custom design-token theme
- **Motion:** Framer Motion (subtle, reduced-motion-aware)
- **Icons:** Lucide React
- **Fonts:** Inter (body/display) + IBM Plex Mono (labels, data, eyebrows) via `next/font/google`
- **Deploy target:** Vercel → `abrarhasanat.com`

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Run the dev server
npm run dev
# → http://localhost:3000

# 3. Production build (also what Vercel runs)
npm run build
npm run start
```

Requires Node.js 18.17+ (Next.js 14 minimum).

## Project structure

```
app/
  layout.tsx        Root layout: fonts, metadata, global background
  page.tsx           Assembles Navbar + Hero + Credentials + CaseStudies + Footer
  globals.css         Tailwind directives, focus rings, reduced-motion, scrollbar
components/
  Navbar.tsx          Sticky header with section anchor links
  Hero.tsx            Name, tagline, sub-headline, dual CTAs, signature trendline motif
  Credentials.tsx      Categorized skills/certifications grid
  CaseStudies.tsx       Problem → Methodology → Impact case study cards
  Footer.tsx            Contact links (email, LinkedIn, GitHub)
  SectionHeading.tsx    Reusable eyebrow + title pattern
lib/
  data.ts             All editable content: credentials, case studies, social links
public/
  mockups/             Drop case-study screenshots/mockups here (see below)
```

## Content you'll want to edit before launch

All copy lives in **`lib/data.ts`** — you shouldn't need to touch component files
to update content:

1. **Case study links** — `dashboardUrl` and `repoUrl` in `lib/data.ts` currently
   point to placeholders (`novypro.com`, your GitHub profile root). Replace with
   the specific NovyPro dashboard link and GitHub repo link for each project.
2. **Mockup images** — each case study card currently renders a dashed-border
   placeholder frame labeled "Dashboard mockup." To swap in real Shots.so
   MacBook mockups:
   - Export your mockups from Shots.so as PNG/WebP
   - Drop them in `public/mockups/`
   - In `components/CaseStudies.tsx`, replace the placeholder `<div>` block
     (marked with a `MOCKUP PLACEHOLDER` comment) with a Next.js `<Image />`
     pointing at `/mockups/your-file.png`
3. **Metrics** — the small stat chips (e.g. "$15M+", "20%") pull from the
   `metrics` array per case study in `lib/data.ts`.

## Design system

Tokens live in `tailwind.config.ts` under `theme.extend.colors`:

| Token | Hex | Use |
|---|---|---|
| `navy` | `#0A192F` | Primary background |
| `navy-surface` | `#112240` | Elevated cards |
| `ink-primary` | `#F8FAFC` | Headers |
| `ink-secondary` | `#94A3B8` | Body copy |
| `accent` | `#3B82F6` | CTAs, links, highlights |
| `border` | `#1E293B` | Hairline borders (slate-800) |

## Deploying to Vercel

```bash
npm i -g vercel
vercel login
vercel          # preview deploy
vercel --prod   # production deploy
```

Then in the Vercel dashboard: **Project → Settings → Domains** → add
`abrarhasanat.com` and follow the DNS instructions (A/CNAME records at your
registrar).

## Accessibility & performance notes baked in

- Visible focus rings on all interactive elements (`globals.css`)
- `prefers-reduced-motion` respected — Framer Motion animations and smooth
  scroll are disabled for users who request it
- Fonts are self-hosted at build time via `next/font` (no runtime layout shift,
  no third-party font requests)
- Fully responsive from mobile up (`sm:` / `lg:` breakpoints throughout)
