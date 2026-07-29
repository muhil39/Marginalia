# Marginalia — Backend

FastAPI service exposing the Agentic AI pipeline: a Planning Agent that
orchestrates 8 specialist agents (Document Parsing, Section Extraction,
Novelty Analysis, Paper Improvement, Future Scope, Reproducibility,
Publication Readiness, Report Generation).

**No API key required.** Every specialist agent uses transparent,
deterministic text-analysis heuristics (regex/keyword/structure based) —
see `agents/heuristics.py` for the primitives. This is a genuine, working
analysis pipeline, not a random mock: scores and suggestions are derived
from the actual uploaded paper's text.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`. Interactive docs (Swagger)
are auto-generated at `http://localhost:8000/docs`.

## API endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/health` | Health check |
| POST | `/api/upload` | Multipart upload (PDF/DOCX/TXT, max 20MB). Returns `paper_id`. |
| POST | `/api/analyze/{paper_id}` | Kicks off the agent pipeline as a background task. |
| GET | `/api/status/{paper_id}` | Live status of every agent step; includes the final report once `complete: true`. |
| GET | `/api/report/{paper_id}` | Full JSON report (once complete). |
| GET | `/api/report/{paper_id}/markdown` | Same report rendered as downloadable Markdown. |

## Architecture

```
main.py                — FastAPI routes
models.py               — Pydantic schemas shared across the whole pipeline
agents/
  parser.py             — Document Parsing Agent (PDF/DOCX/TXT -> raw text)
  sections.py            — Section Extraction Agent (raw text -> IMRaD sections)
  heuristics.py           — Shared text-analysis primitives
  novelty.py               — Novelty Analysis Agent
  improvement.py            — Paper Improvement Agent
  future_scope.py            — Future Scope Agent
  reproducibility.py          — Reproducibility Agent
  publication.py               — Publication Readiness Agent
  report.py                     — Report Generation Agent (-> Markdown)
  pipeline.py                    — Planning Agent (orchestrator + job store)
```

Jobs are stored in-memory (`agents/pipeline.py`), which is fine for a
single-process college demo. For a persistent/multi-instance deployment,
swap `_JOBS` / `_RAW_TEXT` for Redis or Postgres.

## Upgrading to a real LLM (Claude API)

Each specialist agent function (e.g. `novelty.analyze_novelty`) currently
returns a Pydantic model built from heuristics. To use Claude instead:

1. Add `anthropic` to `requirements.txt` and set `ANTHROPIC_API_KEY`.
2. Inside e.g. `novelty.py`, replace the heuristic body with a prompt that
   asks Claude to return JSON matching `NoveltyResult`'s fields, call the
   API, and `NoveltyResult.model_validate_json(response_text)`.
3. Nothing else changes — `pipeline.py`, `main.py`, and the entire frontend
   are already decoupled from *how* each agent produces its result.

## Notes for the college submission

- File size limit and allowed extensions are enforced in `main.py`.
- CORS is currently locked to `http://localhost:3000` (the frontend dev
  server) — update `allow_origins` in `main.py` before deploying.
- All scores/checklists are heuristic first-pass screening, and the report
  explicitly says so — this is intentional and should be kept for academic
  honesty when you present the project.
