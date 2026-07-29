"""
AI-Powered Research Novelty & Reproducibility Analyzer — Backend
===================================================================
FastAPI service exposing the Agentic AI pipeline (Planning Agent +
8 specialist agents). Run with:

    uvicorn main:app --reload --port 8000

No API key is required — every specialist agent uses transparent,
deterministic text-analysis heuristics. See agents/pipeline.py for the
single swap point to plug in a real Claude/OpenAI call per agent later.
"""
from __future__ import annotations

import asyncio

from fastapi import BackgroundTasks, FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import PlainTextResponse

from agents import pipeline
from agents.parser import UnsupportedFileType
from models import PipelineStatus, UploadResponse
from agents.sections import sections_present, extract_sections

app = FastAPI(
    title="Research Novelty & Reproducibility Analyzer API",
    description="Agentic AI backend for autonomous research paper analysis.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MAX_FILE_SIZE_MB = 20
ALLOWED_EXTENSIONS = (".pdf", ".docx", ".txt")


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/upload", response_model=UploadResponse)
async def upload_paper(file: UploadFile) -> UploadResponse:
    if not file.filename.lower().endswith(ALLOWED_EXTENSIONS):
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    data = await file.read()
    if len(data) > MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=400, detail=f"File exceeds {MAX_FILE_SIZE_MB}MB limit.")

    try:
        paper_id = pipeline.create_job(file.filename, data)
    except UnsupportedFileType as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=422, detail=f"Could not parse file: {exc}") from exc

    text, sections = pipeline.get_upload_meta(paper_id)
    return UploadResponse(
        paper_id=paper_id,
        filename=file.filename,
        word_count=len(text.split()),
        sections_detected=sections_present(sections),
    )


@app.post("/api/analyze/{paper_id}")
async def start_analysis(paper_id: str, background_tasks: BackgroundTasks) -> dict[str, str]:
    status = pipeline.get_status(paper_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Unknown paper_id. Upload a paper first.")
    if any(step.status.value == "running" for step in status.steps):
        return {"message": "Analysis already running."}

    background_tasks.add_task(_run_and_swallow, paper_id)
    return {"message": "Analysis started.", "paper_id": paper_id}


async def _run_and_swallow(paper_id: str) -> None:
    try:
        await pipeline.run_pipeline(paper_id)
    except Exception:
        # Failure is already recorded on the step; nothing else to do here.
        pass


@app.get("/api/status/{paper_id}", response_model=PipelineStatus)
async def get_status(paper_id: str) -> PipelineStatus:
    status = pipeline.get_status(paper_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Unknown paper_id.")
    return status


@app.get("/api/report/{paper_id}")
async def get_report(paper_id: str) -> dict:
    status = pipeline.get_status(paper_id)
    if status is None:
        raise HTTPException(status_code=404, detail="Unknown paper_id.")
    if not status.report:
        raise HTTPException(status_code=409, detail="Analysis not yet complete.")
    return status.report.model_dump()


@app.get("/api/report/{paper_id}/markdown", response_class=PlainTextResponse)
async def get_report_markdown(paper_id: str) -> str:
    md = pipeline.render_report_markdown(paper_id)
    if md is None:
        raise HTTPException(status_code=409, detail="Analysis not yet complete.")
    return md
