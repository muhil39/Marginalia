"""
Shared Pydantic schemas for the AI-Powered Research Novelty & Reproducibility
Analyzer backend. Kept in a single module so every agent and the API layer
speak the same contract.
"""
from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class AgentName(str, Enum):
    DOCUMENT_PARSER = "Document Parsing Agent"
    SECTION_EXTRACTOR = "Section Extraction Agent"
    PLANNING = "Planning Agent"
    NOVELTY = "Novelty Analysis Agent"
    IMPROVEMENT = "Paper Improvement Agent"
    FUTURE_SCOPE = "Future Scope Agent"
    REPRODUCIBILITY = "Reproducibility Agent"
    PUBLICATION = "Publication Readiness Agent"
    REPORT = "Report Generation Agent"


class AgentStatus(str, Enum):
    PENDING = "pending"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"


class AgentStep(BaseModel):
    name: AgentName
    status: AgentStatus = AgentStatus.PENDING
    detail: str = ""
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None


class UploadResponse(BaseModel):
    paper_id: str
    filename: str
    word_count: int
    sections_detected: list[str]


class NoveltyResult(BaseModel):
    novelty_score: int = Field(ge=0, le=100)
    innovation_score: int = Field(ge=0, le=100)
    confidence_score: int = Field(ge=0, le=100)
    strengths: list[str]
    weaknesses: list[str]
    research_gap_notes: str


class SectionSuggestion(BaseModel):
    section: str
    present: bool
    suggestions: list[str]


class ImprovementResult(BaseModel):
    overall_quality_score: int = Field(ge=0, le=100)
    section_feedback: list[SectionSuggestion]
    missing_information: list[str]
    writing_suggestions: list[str]


class FutureScopeResult(BaseModel):
    short_term: list[str]
    medium_term: list[str]
    long_term: list[str]
    industrial_applications: list[str]
    startup_opportunities: list[str]
    patent_ideas: list[str]
    phd_extensions: list[str]
    grant_opportunities: list[str]


class ReproducibilityChecklistItem(BaseModel):
    item: str
    found: bool
    note: str


class ReproducibilityResult(BaseModel):
    reproducibility_score: int = Field(ge=0, le=100)
    checklist: list[ReproducibilityChecklistItem]
    summary: str


class PublicationRecommendation(str, Enum):
    ACCEPT = "Accept"
    MINOR_REVISION = "Minor Revision"
    MAJOR_REVISION = "Major Revision"
    REJECT = "Reject"


class PublicationResult(BaseModel):
    recommendation: PublicationRecommendation
    major_strengths: list[str]
    major_weaknesses: list[str]
    reviewer_comments: list[str]


class AnalysisReport(BaseModel):
    paper_id: str
    filename: str
    generated_at: datetime
    novelty: NoveltyResult
    improvement: ImprovementResult
    future_scope: FutureScopeResult
    reproducibility: ReproducibilityResult
    publication: PublicationResult


class PipelineStatus(BaseModel):
    paper_id: str
    steps: list[AgentStep]
    complete: bool
    report: Optional[AnalysisReport] = None
