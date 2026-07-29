# Marginalia — Frontend

Next.js (App Router) + TypeScript + Tailwind CSS frontend for the AI-Powered
Research Novelty & Reproducibility Analyzer.

## Setup

```bash
cd frontend
npm install
cp .env.local.example .env.local   # points at the backend, defaults to localhost:8000
```

## Run

```bash
npm run dev
```

Visit `http://localhost:3000`. Make sure the backend (`../backend`) is
running on `http://localhost:8000` first — see `backend/README.md`.

## Pages

| Route | Purpose |
|---|---|
| `/` | Landing page — hero, features, workflow, CTA |
| `/about` | Project, objectives, agent architecture, tech stack |
| `/upload` | Drag-and-drop upload (PDF/DOCX/TXT) |
| `/dashboard/[id]` | Live polling view of the 9-agent pipeline |
| `/analysis/[id]` | Full interactive report: scores, charts, section feedback, future scope, reproducibility checklist, publication recommendation. Exports to Markdown or browser Print-to-PDF. |

## Design system

A parchment/ink "manuscript under live review" aesthetic:

- **Palette:** parchment `#F6F1E6` / ink `#1B1E1C`, with navy `#1D3B53`,
  rust `#B3401D`, and sage `#3F6E52` as agent/status accents.
- **Type:** Source Serif 4 for headings, Inter for body copy, JetBrains Mono
  for scores, statuses, and data.
- **Signature element:** agent output is visually presented as marginalia —
  reviewer-style annotations in the margin of the manuscript — most visible
  in the homepage hero (`components/marginalia-hero.tsx`) and the dashboard
  agent timeline.
- Dark mode via a `class` strategy (`components/theme-provider.tsx`), no
  external state library needed.

## Structure

```
app/
  layout.tsx            — fonts, ThemeProvider, Navbar/Footer shell
  page.tsx                — Home
  about/page.tsx            — About
  upload/page.tsx             — Upload
  dashboard/[id]/page.tsx      — Live pipeline status
  analysis/[id]/page.tsx        — Report viewer
components/               — Navbar, Footer, ThemeToggle, Uploader,
                             AgentTimeline, ScoreRing, ScoreBarChart,
                             SectionPanel, MarginaliaHero
lib/
  api.ts                  — fetch wrappers around the FastAPI backend
  types.ts                  — TypeScript types mirroring the backend schemas
```

## Notes

- No `localStorage`/`sessionStorage` dependency for app state (only the
  theme preference, which is fine outside of the Claude Artifacts sandbox —
  this is a real, deployable app, not an in-chat artifact).
- All API calls go through `lib/api.ts`; the base URL is configurable via
  `NEXT_PUBLIC_API_BASE_URL` for deployment (e.g. Vercel frontend +
  Railway/Render backend).
