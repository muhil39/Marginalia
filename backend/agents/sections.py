"""
Section Extraction Agent
--------------------------
Splits raw manuscript text into the canonical IMRaD-style sections so every
downstream specialist agent can reason about structure, not just a blob of
text. Uses heading heuristics rather than an LLM, so it works fully offline.
"""
from __future__ import annotations

import re

CANONICAL_SECTIONS = [
    "Abstract",
    "Introduction",
    "Literature Review",
    "Methodology",
    "Experiments",
    "Results",
    "Discussion",
    "Conclusion",
    "References",
]

# Map common heading variants -> canonical section name
_HEADING_ALIASES = {
    "abstract": "Abstract",
    "introduction": "Introduction",
    "related work": "Literature Review",
    "literature review": "Literature Review",
    "background": "Literature Review",
    "methodology": "Methodology",
    "method": "Methodology",
    "methods": "Methodology",
    "proposed method": "Methodology",
    "approach": "Methodology",
    "experiments": "Experiments",
    "experimental setup": "Experiments",
    "experimental results": "Results",
    "results": "Results",
    "evaluation": "Results",
    "discussion": "Discussion",
    "conclusion": "Conclusion",
    "conclusions": "Conclusion",
    "conclusion and future work": "Conclusion",
    "future work": "Conclusion",
    "references": "References",
    "bibliography": "References",
}

_HEADING_PATTERN = re.compile(
    r"^\s{0,3}(?:\d{1,2}[\.\)]?\s*)?([A-Za-z][A-Za-z \-]{2,40})\s*$"
)


def extract_sections(text: str) -> dict[str, str]:
    """Return a dict of canonical_section_name -> section_text."""
    lines = text.split("\n")
    found: dict[str, list[str]] = {}
    current = None

    for line in lines:
        stripped = line.strip()
        match = _HEADING_PATTERN.match(stripped)
        alias = _HEADING_ALIASES.get(stripped.lower()) if match else None

        if alias:
            current = alias
            found.setdefault(current, [])
            continue

        if current:
            found[current].append(line)

    return {name: "\n".join(body).strip() for name, body in found.items()}


def sections_present(sections: dict[str, str]) -> list[str]:
    return [s for s in CANONICAL_SECTIONS if s in sections and sections[s].strip()]


def sections_missing(sections: dict[str, str]) -> list[str]:
    return [s for s in CANONICAL_SECTIONS if s not in sections_present(sections)]
