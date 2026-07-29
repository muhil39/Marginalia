const OBJECTIVES = [
  "Demonstrate genuine agentic AI orchestration rather than a single monolithic prompt.",
  "Give researchers a fast, private, first-pass screening tool before human peer review.",
  "Never rewrite or alter the author's original work — only annotate and suggest.",
  "Run entirely offline for a classroom demo, with a clear swap point for a real LLM.",
];

const AGENTS = [
  ["Document Parsing Agent", "Extracts raw text from PDF, DOCX, or TXT files."],
  ["Section Extraction Agent", "Detects canonical IMRaD sections via heading heuristics."],
  ["Planning Agent", "Decomposes the manuscript into tasks and sequences every specialist agent."],
  ["Novelty Analysis Agent", "Scores novelty, innovation, and confidence; lists strengths and weaknesses."],
  ["Paper Improvement Agent", "Reviews each section for completeness and writing quality."],
  ["Future Scope Agent", "Generates short/medium/long-term extensions and translational opportunities."],
  ["Reproducibility Agent", "Runs a nine-point checklist against dataset, code, and evaluation reporting."],
  ["Publication Readiness Agent", "Synthesises every finding into an Accept/Revise/Reject triage call."],
  ["Report Generation Agent", "Compiles everything into an interactive dashboard and exportable report."],
];

const STACK = [
  ["Frontend", "Next.js, React, TypeScript, Tailwind CSS, Framer Motion"],
  ["Backend", "Python, FastAPI, async background task pipeline"],
  ["Document processing", "PyMuPDF (PDF), python-docx (DOCX)"],
  ["Agent orchestration", "Custom Planning Agent — swappable for LangGraph/LangChain"],
  ["Analysis engine", "Deterministic text heuristics today; drop-in slot for Claude/OpenAI"],
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-rust dark:text-rust-light">
        About the project
      </p>
      <h1 className="font-display text-4xl leading-tight text-ink dark:text-parchment">
        A capstone in agentic AI, built like a real product.
      </h1>
      <p className="mt-6 font-body text-base leading-relaxed text-ink/70 dark:text-parchment/70">
        Marginalia is an AI-Powered Research Novelty &amp; Reproducibility Analyzer built as
        a college Agentic AI project. It orchestrates nine specialised agents — coordinated
        by a single Planning Agent — to screen a research manuscript for novelty,
        completeness, reproducibility, and publication readiness, then generates
        forward-looking research directions. It never rewrites the author's work; it
        annotates it, the way a thorough reviewer would in the margins of a printed page.
      </p>

      <h2 className="mt-14 mb-5 font-display text-2xl text-ink dark:text-parchment">Objectives</h2>
      <ul className="space-y-3">
        {OBJECTIVES.map((o) => (
          <li key={o} className="flex gap-3 font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-rust dark:bg-rust-light" />
            {o}
          </li>
        ))}
      </ul>

      <h2 className="mt-14 mb-5 font-display text-2xl text-ink dark:text-parchment">Agentic architecture</h2>
      <div className="paper-card divide-y divide-ink/10 dark:divide-parchment/10">
        {AGENTS.map(([name, desc]) => (
          <div key={name} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-56 shrink-0 font-mono text-xs uppercase tracking-wide text-navy dark:text-navy-light">
              {name}
            </span>
            <span className="font-body text-sm text-ink/70 dark:text-parchment/70">{desc}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-14 mb-5 font-display text-2xl text-ink dark:text-parchment">Technology stack</h2>
      <div className="paper-card divide-y divide-ink/10 dark:divide-parchment/10">
        {STACK.map(([label, desc]) => (
          <div key={label} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:gap-6">
            <span className="w-44 shrink-0 font-mono text-xs uppercase tracking-wide text-rust dark:text-rust-light">
              {label}
            </span>
            <span className="font-body text-sm text-ink/70 dark:text-parchment/70">{desc}</span>
          </div>
        ))}
      </div>

      <h2 className="mt-14 mb-5 font-display text-2xl text-ink dark:text-parchment">Team</h2>
      <p className="font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">
        Built as a solo/team capstone submission — edit this section with your name(s),
        roll number(s), and course details before submission.
      </p>
    </div>
  );
}
