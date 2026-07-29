"""
Planning Agent
---------------
The orchestrator. Owns the in-memory job store, sequences every specialist
agent, and exposes progress so the frontend Dashboard can poll live status —
this is what makes the system "agentic" rather than a single monolithic call.

Swap point for real LLMs: each specialist module (novelty.py, improvement.py,
etc.) currently uses deterministic heuristics. To use Claude/OpenAI instead,
replace the body of those functions with a prompt + API call that returns
JSON matching the same Pydantic schema — nothing else in this file changes.
"""
from __future__ import annotations

import asyncio
import uuid
from datetime import datetime, timezone

from models import (
    AgentName, AgentStatus, AgentStep, AnalysisReport, PipelineStatus,
)

from . import future_scope, improvement, novelty, publication, reproducibility, report
from .parser import parse_document
from .sections import extract_sections, sections_present

# In-memory job store. Fine for a demo / single-process college project;
# swap for Redis/Postgres for a multi-instance deployment.
_JOBS: dict[str, PipelineStatus] = {}
_RAW_TEXT: dict[str, str] = {}
_FILENAMES: dict[str, str] = {}

_PIPELINE_ORDER = [
    AgentName.DOCUMENT_PARSER,
    AgentName.SECTION_EXTRACTOR,
    AgentName.PLANNING,
    AgentName.NOVELTY,
    AgentName.IMPROVEMENT,
    AgentName.FUTURE_SCOPE,
    AgentName.REPRODUCIBILITY,
    AgentName.PUBLICATION,
    AgentName.REPORT,
]

# Small artificial delay per agent so the dashboard's live progress feels
# real for a demo. Set to 0 for instant results.
_STEP_DELAY_SECONDS = 0.6


def _new_status(paper_id: str) -> PipelineStatus:
    steps = [AgentStep(name=name) for name in _PIPELINE_ORDER]
    return PipelineStatus(paper_id=paper_id, steps=steps, complete=False, report=None)


def create_job(filename: str, data: bytes) -> str:
    paper_id = str(uuid.uuid4())
    text = parse_document(filename, data)
    _RAW_TEXT[paper_id] = text
    _FILENAMES[paper_id] = filename
    _JOBS[paper_id] = _new_status(paper_id)
    return paper_id


def get_status(paper_id: str) -> PipelineStatus | None:
    return _JOBS.get(paper_id)


def get_upload_meta(paper_id: str) -> tuple[str, dict[str, str]] | None:
    text = _RAW_TEXT.get(paper_id)
    if text is None:
        return None
    sections = extract_sections(text)
    return text, sections


def _mark(status: PipelineStatus, name: AgentName, state: AgentStatus, detail: str = "") -> None:
    for step in status.steps:
        if step.name == name:
            step.status = state
            step.detail = detail
            if state == AgentStatus.RUNNING:
                step.started_at = datetime.now(timezone.utc)
            if state in (AgentStatus.DONE, AgentStatus.FAILED):
                step.finished_at = datetime.now(timezone.utc)
            break


async def run_pipeline(paper_id: str) -> None:
    """The Planning Agent's execution loop — runs every specialist agent in
    dependency order, updating live status as it goes."""
    status = _JOBS[paper_id]
    text = _RAW_TEXT[paper_id]
    filename = _FILENAMES[paper_id]

    try:
        _mark(status, AgentName.DOCUMENT_PARSER, AgentStatus.RUNNING, "Extracting raw text from file...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        _mark(status, AgentName.DOCUMENT_PARSER, AgentStatus.DONE, f"Extracted {len(text.split())} words.")

        _mark(status, AgentName.SECTION_EXTRACTOR, AgentStatus.RUNNING, "Detecting IMRaD sections...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        sections = extract_sections(text)
        present = sections_present(sections)
        _mark(status, AgentName.SECTION_EXTRACTOR, AgentStatus.DONE, f"Found sections: {', '.join(present) or 'none'}")

        _mark(status, AgentName.PLANNING, AgentStatus.RUNNING, "Decomposing analysis into specialist tasks...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        _mark(status, AgentName.PLANNING, AgentStatus.DONE, "Task graph dispatched to specialist agents.")

        _mark(status, AgentName.NOVELTY, AgentStatus.RUNNING, "Scoring novelty and innovation...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        novelty_result = novelty.analyze_novelty(text, sections)
        _mark(status, AgentName.NOVELTY, AgentStatus.DONE, f"Novelty score: {novelty_result.novelty_score}/100")

        _mark(status, AgentName.IMPROVEMENT, AgentStatus.RUNNING, "Reviewing sections for quality issues...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        improvement_result = improvement.review_paper(text, sections)
        _mark(status, AgentName.IMPROVEMENT, AgentStatus.DONE, f"Quality score: {improvement_result.overall_quality_score}/100")

        _mark(status, AgentName.FUTURE_SCOPE, AgentStatus.RUNNING, "Generating future research directions...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        future_result = future_scope.generate_future_scope(text)
        _mark(status, AgentName.FUTURE_SCOPE, AgentStatus.DONE, "Future scope recommendations generated.")

        _mark(status, AgentName.REPRODUCIBILITY, AgentStatus.RUNNING, "Checking reproducibility signals...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        repro_result = reproducibility.analyze_reproducibility(text)
        _mark(status, AgentName.REPRODUCIBILITY, AgentStatus.DONE, f"Reproducibility score: {repro_result.reproducibility_score}/100")

        _mark(status, AgentName.PUBLICATION, AgentStatus.RUNNING, "Synthesising publication recommendation...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        pub_result = publication.review_for_publication(novelty_result, improvement_result, repro_result)
        _mark(status, AgentName.PUBLICATION, AgentStatus.DONE, f"Recommendation: {pub_result.recommendation.value}")

        _mark(status, AgentName.REPORT, AgentStatus.RUNNING, "Compiling final report...")
        await asyncio.sleep(_STEP_DELAY_SECONDS)
        final_report = AnalysisReport(
            paper_id=paper_id,
            filename=filename,
            generated_at=datetime.now(timezone.utc),
            novelty=novelty_result,
            improvement=improvement_result,
            future_scope=future_result,
            reproducibility=repro_result,
            publication=pub_result,
        )
        status.report = final_report
        _mark(status, AgentName.REPORT, AgentStatus.DONE, "Report ready.")
        status.complete = True

    except Exception as exc:  # pragma: no cover - defensive guard for demo robustness
        for step in status.steps:
            if step.status == AgentStatus.RUNNING:
                _mark(status, step.name, AgentStatus.FAILED, str(exc))
                break
        raise


def render_report_markdown(paper_id: str) -> str | None:
    status = _JOBS.get(paper_id)
    if not status or not status.report:
        return None
    return report.render_markdown(status.report)
