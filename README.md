# Marginalia
### AI-Powered Research Novelty & Reproducibility Analyzer — Agentic AI Capstone

A full-stack web app that acts as an autonomous research-review assistant.
A **Planning Agent** orchestrates **8 specialist agents** — Document Parsing,
Section Extraction, Novelty Analysis, Paper Improvement, Future Scope,
Reproducibility, Publication Readiness, and Report Generation — to screen an
uploaded manuscript the way a thorough reviewer would, without ever
rewriting the author's original text.

```
research-analyzer/
  backend/     FastAPI + Python agent pipeline   (see backend/README.md)
  frontend/    Next.js + TypeScript + Tailwind UI (see frontend/README.md)
```

## Quick start

**Terminal 1 — backend**
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

**Terminal 2 — frontend**
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Then open `http://localhost:3000`, upload a PDF/DOCX/TXT paper, and watch
the agent pipeline run live on the dashboard before landing on the full
interactive report.

## Why this counts as "agentic," not a chatbot

- A single **Planning Agent** (`backend/agents/pipeline.py`) decomposes the
  task into an explicit sequence of specialist agents and tracks each one's
  status independently — visible live on `/dashboard/[id]`.
- Each specialist agent (`backend/agents/*.py`) has one clearly scoped
  responsibility and a typed input/output contract (`backend/models.py`),
  so agents can be reordered, parallelised, or swapped for LLM-backed
  versions independently.
- The pipeline runs fully offline today (deterministic heuristics, no API
  key), with a documented single swap-point per agent to plug in the Claude
  API — see "Upgrading to a real LLM" in `backend/README.md`. This was a
  deliberate choice so the project demos reliably without network access or
  API costs, while the architecture is genuinely agentic either way.

## What's implemented vs. the original spec

This build focuses on a working, demoable core rather than every item in
the original master prompt (which also asked for auth, a Postgres/vector DB,
LangGraph, and a Vercel/Railway deployment). Specifically:

**Implemented:** upload (PDF/DOCX/TXT), real document parsing, section
detection, all 5 AI analysis modules (novelty, improvement, future scope,
reproducibility, publication review), live agent dashboard, interactive
report with charts, Markdown export, light/dark theme, responsive design,
Home/About/Upload/Dashboard/Analysis pages.

**Not implemented (natural next steps):** authentication, persistent
database (jobs are in-memory — restart the backend and they're gone),
vector DB / RAG over a literature corpus, LangGraph-based orchestration
(the Planning Agent is currently a plain async function — swapping in
LangGraph is a drop-in change to `pipeline.py`), DOCX/PDF report export
(Markdown + browser print-to-PDF are implemented), and deployment configs
for Vercel/Railway.

Happy to build out any of these next — e.g. wire in the real Claude API for
the analysis agents, add a Postgres-backed job store, or produce the SRS
and other documentation deliverables from the original prompt.
