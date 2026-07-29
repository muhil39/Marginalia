"use client";

import { motion } from "framer-motion";

const ANNOTATIONS = [
  { agent: "Novelty Agent", color: "bg-rust", text: "Framing vs. prior work is implicit — make the gap explicit.", top: "8%" },
  { agent: "Reproducibility Agent", color: "bg-sage", text: "No random seed reported. Add it for exact replication.", top: "34%" },
  { agent: "Improvement Agent", color: "bg-navy dark:bg-navy-light", text: "Methodology section reads well — minor tightening only.", top: "60%" },
  { agent: "Publication Agent", color: "bg-rust", text: "Recommendation: Minor Revision.", top: "84%" },
];

const PARAGRAPH_LINES = [
  "In this work, we propose a lightweight attention mechanism that",
  "reduces inference cost by 34% while preserving accuracy on the",
  "benchmark suite. Unlike prior approaches, our method requires no",
  "additional supervision and generalises across three model families.",
  "We evaluate on four public datasets using standard splits, and we",
  "release code, trained weights, and configuration files for full",
  "reproducibility. Our results suggest the technique is broadly",
  "applicable beyond the vision tasks studied here.",
];

export function MarginaliaHero() {
  return (
    <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-[1.3fr_1fr] md:gap-10">
      {/* Manuscript page */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="paper-card relative px-8 py-10 md:px-10"
      >
        <p className="mb-6 font-mono text-[10px] uppercase tracking-[0.2em] text-ink/40 dark:text-parchment/40">
          Manuscript · p. 2 of 11
        </p>
        <div className="space-y-3 font-display text-[15px] leading-relaxed text-ink/85 dark:text-parchment/85">
          {PARAGRAPH_LINES.map((line, i) => (
            <p key={i}>{line}</p>
          ))}
        </div>
        <span className="absolute bottom-4 right-6 font-mono text-xs text-ink/30 dark:text-parchment/30">
          2
        </span>
      </motion.div>

      {/* Live marginalia */}
      <div className="relative flex flex-col justify-center gap-4 py-4">
        {ANNOTATIONS.map((note, i) => (
          <motion.div
            key={note.agent}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + i * 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="paper-card border-l-4 px-4 py-3"
            style={{ borderLeftColor: "transparent" }}
          >
            <div className={`mb-1.5 inline-flex items-center gap-1.5 rounded-sm px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-parchment ${note.color}`}>
              {note.agent}
            </div>
            <p className="font-body text-sm leading-snug text-ink/80 dark:text-parchment/80">
              {note.text}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
