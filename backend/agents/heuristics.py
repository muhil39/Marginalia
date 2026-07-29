"""
Shared text-analysis heuristics.

These are deliberately transparent, deterministic, keyword/structure based
signals (no external LLM call) that stand in for what a real language-model
agent would infer. Every specialist agent composes these primitives into a
score + narrative. Swap `call_llm()` in pipeline.py for a real Claude/OpenAI
call later without touching the rest of the architecture.
"""
from __future__ import annotations

import hashlib
import re

NOVELTY_MARKERS = [
    "novel", "we propose", "for the first time", "state-of-the-art",
    "state of the art", "outperforms", "unlike prior", "in contrast to",
    "gap in", "has not been explored", "we introduce",
]

REPRODUCIBILITY_MARKERS = {
    "Code availability": [r"github\.com", r"code (is )?(publicly )?available", r"open[- ]source"],
    "Dataset description": [r"dataset", r"benchmark", r"corpus"],
    "Hyperparameters": [r"learning rate", r"batch size", r"hyperparameter", r"epoch"],
    "Hardware details": [r"gpu", r"tpu", r"nvidia", r"cuda", r"cpu"],
    "Software / framework": [r"pytorch", r"tensorflow", r"scikit", r"keras", r"huggingface"],
    "Random seed reported": [r"random seed", r"seed=?\s*\d+", r"seeded"],
    "Evaluation metrics": [r"accuracy", r"f1[- ]score", r"precision", r"recall", r"bleu", r"rouge", r"auc"],
    "Statistical significance": [r"p\s*<\s*0\.0?5", r"confidence interval", r"standard deviation", r"significance test"],
}

WEAK_WRITING_MARKERS = [
    r"\betc\.?\b", r"\bvery\b", r"\bobviously\b", r"\bkind of\b",
]

CITATION_PATTERN = re.compile(r"\[\d+(?:,\s*\d+)*\]|\([A-Z][a-zA-Z]+(?: et al\.)?,\s*\d{4}\)")


def word_count(text: str) -> int:
    return len(re.findall(r"\b\w+\b", text))


def sentence_count(text: str) -> int:
    return max(1, len(re.findall(r"[.!?]+(?:\s|$)", text)))


def avg_sentence_length(text: str) -> float:
    return round(word_count(text) / sentence_count(text), 1)


def count_markers(text: str, markers: list[str]) -> int:
    lower = text.lower()
    return sum(lower.count(m) for m in markers)


def count_citations(text: str) -> int:
    return len(CITATION_PATTERN.findall(text))


def stable_hash_score(seed_text: str, low: int, high: int) -> int:
    """Deterministic pseudo-random int in [low, high] derived from content,
    so repeated runs on the same paper always produce the same score."""
    digest = hashlib.sha256(seed_text.encode("utf-8")).hexdigest()
    value = int(digest[:8], 16)
    return low + (value % (high - low + 1))


def clamp(value: int, low: int = 0, high: int = 100) -> int:
    return max(low, min(high, value))
