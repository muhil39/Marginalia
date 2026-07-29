"""
Document Parsing Agent
-----------------------
Responsible for turning an uploaded file (PDF, DOCX, or plain text) into
clean raw text that downstream agents can reason over. This is the only
agent that touches the raw file bytes.
"""
from __future__ import annotations

import io
import re

import fitz  # PyMuPDF
from docx import Document as DocxDocument


class UnsupportedFileType(Exception):
    pass


def parse_pdf(data: bytes) -> str:
    text_parts: list[str] = []
    with fitz.open(stream=data, filetype="pdf") as doc:
        for page in doc:
            text_parts.append(page.get_text("text"))
    return "\n".join(text_parts)


def parse_docx(data: bytes) -> str:
    doc = DocxDocument(io.BytesIO(data))
    paragraphs = [p.text for p in doc.paragraphs]
    return "\n".join(paragraphs)


def parse_txt(data: bytes) -> str:
    return data.decode("utf-8", errors="ignore")


def parse_document(filename: str, data: bytes) -> str:
    lower = filename.lower()
    if lower.endswith(".pdf"):
        raw = parse_pdf(data)
    elif lower.endswith(".docx"):
        raw = parse_docx(data)
    elif lower.endswith(".txt"):
        raw = parse_txt(data)
    else:
        raise UnsupportedFileType(
            f"Unsupported file type for '{filename}'. Use PDF, DOCX, or TXT."
        )
    return clean_text(raw)


def clean_text(raw: str) -> str:
    # Collapse excessive whitespace while preserving paragraph breaks.
    text = re.sub(r"[ \t]+", " ", raw)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()
