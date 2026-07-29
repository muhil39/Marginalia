from __future__ import annotations

import re

from models import ImprovementResult, SectionSuggestion
from .heuristics import WEAK_WRITING_MARKERS, avg_sentence_length, clamp, word_count
from .sections import CANONICAL_SECTIONS, sections_missing, sections_present

_MIN_WORDS = {
    "Abstract": 100,
    "Introduction": 250,
    "Literature Review": 200,
    "Methodology": 250,
    "Experiments": 150,
    "Results": 150,
    "Discussion": 100,
    "Conclusion": 80,
}


def review_paper(full_text: str, sections: dict[str, str]) -> ImprovementResult:
    present = sections_present(sections)
    missing = sections_missing(sections)

    feedback: list[SectionSuggestion] = []
    for name in CANONICAL_SECTIONS:
        if name == "References":
            continue
        body = sections.get(name, "")
        is_present = name in present
        suggestions: list[str] = []

        if not is_present:
            suggestions.append(f"Add a clearly labelled '{name}' section — reviewers expect it in a standard IMRaD structure.")
        else:
            wc = word_count(body)
            min_words = _MIN_WORDS.get(name, 100)
            if wc < min_words:
                suggestions.append(
                    f"'{name}' looks thin (~{wc} words). Consider expanding to at least "
                    f"~{min_words} words with more supporting detail."
                )
            weak_hits = sum(len(re.findall(p, body, flags=re.IGNORECASE)) for p in WEAK_WRITING_MARKERS)
            if weak_hits > 2:
                suggestions.append(
                    "Tighten the language — several filler/imprecise phrases "
                    "('very', 'obviously', 'etc.') were detected in this section."
                )
            asl = avg_sentence_length(body) if body else 0
            if asl > 35:
                suggestions.append(
                    f"Average sentence length is high (~{asl} words/sentence); "
                    "consider breaking long sentences up for readability."
                )
            if not suggestions:
                suggestions.append("No major issues detected — this section reads as reasonably complete.")

        feedback.append(SectionSuggestion(section=name, present=is_present, suggestions=suggestions))

    missing_info = []
    if "Abstract" in missing:
        missing_info.append("A structured Abstract summarising problem, method, and results.")
    if "Results" in missing and "Experiments" in missing:
        missing_info.append("Quantitative results or an experiments section to support claims.")
    if "Literature Review" in missing:
        missing_info.append("Positioning against related work / prior literature.")
    if not missing_info:
        missing_info.append("No critical structural sections appear to be missing.")

    writing_suggestions = [
        "Keep terminology consistent — introduce an acronym once, then reuse it.",
        "Ensure every figure/table referenced in text is captioned and numbered.",
        "State contributions as an explicit bulleted list at the end of the Introduction.",
    ]

    completeness_ratio = len(present) / max(1, len(CANONICAL_SECTIONS) - 1)  # exclude References
    overall_quality = clamp(int(40 + completeness_ratio * 45))

    return ImprovementResult(
        overall_quality_score=overall_quality,
        section_feedback=feedback,
        missing_information=missing_info,
        writing_suggestions=writing_suggestions,
    )
