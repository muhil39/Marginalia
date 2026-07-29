"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, XCircle } from "lucide-react";
import type { SectionSuggestion } from "@/lib/types";

export function SectionPanel({ section }: { section: SectionSuggestion }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-ink/10 last:border-b-0 dark:border-parchment/10">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          {section.present ? (
            <CheckCircle2 size={17} className="shrink-0 text-sage dark:text-sage-light" />
          ) : (
            <XCircle size={17} className="shrink-0 text-rust dark:text-rust-light" />
          )}
          <span className="font-display text-base text-ink dark:text-parchment">
            {section.section}
          </span>
        </div>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink/40 transition-transform dark:text-parchment/40 ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <ul className="space-y-2 px-6 pb-5 pl-11">
          {section.suggestions.map((s, i) => (
            <li key={i} className="font-body text-sm leading-relaxed text-ink/65 dark:text-parchment/65">
              — {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
