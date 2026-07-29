from __future__ import annotations

import re

from models import ReproducibilityChecklistItem, ReproducibilityResult
from .heuristics import REPRODUCIBILITY_MARKERS, clamp


def analyze_reproducibility(full_text: str) -> ReproducibilityResult:
    checklist: list[ReproducibilityChecklistItem] = []
    found_count = 0

    for item, patterns in REPRODUCIBILITY_MARKERS.items():
        found = any(re.search(p, full_text, flags=re.IGNORECASE) for p in patterns)
        if found:
            found_count += 1
            note = "Detected relevant mentions in the manuscript text."
        else:
            note = "Not clearly mentioned — consider adding explicit detail."
        checklist.append(ReproducibilityChecklistItem(item=item, found=found, note=note))

    score = clamp(int(found_count / len(REPRODUCIBILITY_MARKERS) * 100))

    if score >= 75:
        summary = (
            "The manuscript reports most of the details needed for independent "
            "reproduction (data, code/framework, and evaluation setup)."
        )
    elif score >= 45:
        summary = (
            "Partial reproducibility information is present, but several key "
            "details (see checklist) are missing or unclear."
        )
    else:
        summary = (
            "Reproducibility information is sparse. A reader would likely struggle "
            "to reproduce these results without contacting the authors directly."
        )

    return ReproducibilityResult(
        reproducibility_score=score,
        checklist=checklist,
        summary=summary,
    )
