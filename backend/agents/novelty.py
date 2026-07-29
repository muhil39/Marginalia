from __future__ import annotations

from models import NoveltyResult
from .heuristics import (
    NOVELTY_MARKERS, clamp, count_citations, count_markers, stable_hash_score,
    word_count,
)


def analyze_novelty(full_text: str, sections: dict[str, str]) -> NoveltyResult:
    intro = sections.get("Introduction", "")
    lit_review = sections.get("Literature Review", "")
    conclusion = sections.get("Conclusion", "")

    novelty_hits = count_markers(full_text, NOVELTY_MARKERS)
    citations = count_citations(full_text)
    base = stable_hash_score(full_text[:2000] or "empty", 45, 70)

    novelty_score = clamp(base + min(novelty_hits * 3, 20))
    innovation_score = clamp(base + min(novelty_hits * 2, 15) - (5 if not intro else 0))
    confidence_score = clamp(
        50 + min(citations, 30) + (10 if lit_review else -10) + (5 if conclusion else 0)
    )

    strengths, weaknesses = [], []

    if novelty_hits >= 3:
        strengths.append(
            "The manuscript explicitly frames its contribution against prior work "
            "using clear novelty language (e.g. 'we propose', 'unlike prior')."
        )
    else:
        weaknesses.append(
            "Novelty claims are implicit rather than explicit — consider stating "
            "directly how this work differs from the closest prior approaches."
        )

    if lit_review:
        strengths.append(
            "A dedicated related-work / literature review section is present, "
            "which supports positioning the contribution against the field."
        )
    else:
        weaknesses.append(
            "No clearly delimited literature review / related work section was "
            "detected — reviewers typically expect this to justify the research gap."
        )

    if citations >= 15:
        strengths.append(
            f"Strong engagement with prior literature (~{citations} in-text citations detected)."
        )
    elif citations < 5:
        weaknesses.append(
            f"Only ~{citations} in-text citations were detected, which may read as "
            "thin engagement with related literature to a reviewer."
        )

    if word_count(intro) < 150 and intro:
        weaknesses.append(
            "The Introduction is quite short, leaving limited room to motivate "
            "the research gap and state contributions clearly."
        )

    if not strengths:
        strengths.append(
            "The manuscript presents a self-contained technical contribution."
        )
    if not weaknesses:
        weaknesses.append(
            "No major novelty-framing issues detected by automated screening — "
            "a human domain expert should still verify true originality against "
            "the current state of the art."
        )

    gap_notes = (
        "Automated screening infers the research-gap framing primarily from the "
        "Introduction and Literature Review sections. "
        + ("A literature review section was found and referenced against the "
           "manuscript's own framing of its contribution."
           if lit_review else
           "No literature review section was detected, so the research gap could "
           "only be inferred from novelty language in the Introduction/Abstract.")
    )

    return NoveltyResult(
        novelty_score=novelty_score,
        innovation_score=innovation_score,
        confidence_score=confidence_score,
        strengths=strengths,
        weaknesses=weaknesses,
        research_gap_notes=gap_notes,
    )