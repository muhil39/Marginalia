import Link from "next/link";
import {
  ArrowRight, ScanSearch, Sparkles, GitBranch, ShieldCheck, FileCheck2, Compass,
} from "lucide-react";
import { MarginaliaHero } from "@/components/marginalia-hero";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Novelty screening",
    body: "Surfaces how clearly a paper frames its contribution against prior literature, and scores innovation and confidence.",
  },
  {
    icon: FileCheck2,
    title: "Section-by-section review",
    body: "Checks every IMRaD section for completeness, missing information, and writing quality — without touching your prose.",
  },
  {
    icon: Compass,
    title: "Future scope generation",
    body: "Suggests short, medium, and long-term extensions, plus patent, startup, PhD, and grant angles.",
  },
  {
    icon: ShieldCheck,
    title: "Reproducibility audit",
    body: "Checks for dataset, code, hyperparameters, hardware, seeds, and statistical reporting against a nine-point checklist.",
  },
  {
    icon: GitBranch,
    title: "Publication triage",
    body: "Synthesises every agent's findings into an Accept / Minor / Major / Reject first-pass recommendation.",
  },
  {
    icon: ScanSearch,
    title: "Agentic, not a chatbot",
    body: "A Planning Agent decomposes the task and dispatches eight specialist agents in sequence — watch it happen live.",
  },
];

const WORKFLOW = [
  { step: "Document Parsing Agent", detail: "Extracts clean raw text from PDF, DOCX, or plain text." },
  { step: "Section Extraction Agent", detail: "Detects Abstract, Introduction, Methodology, Results, and more." },
  { step: "Planning Agent", detail: "Decomposes the analysis into tasks for each specialist agent." },
  { step: "Specialist agents", detail: "Novelty, Improvement, Future Scope, and Reproducibility run in sequence." },
  { step: "Publication Readiness Agent", detail: "Synthesises every finding into one triage recommendation." },
  { step: "Report Generation Agent", detail: "Compiles everything into an interactive, exportable report." },
];

export default function HomePage() {
  return (
    <div className="pb-24">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 md:pt-24">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-rust dark:text-rust-light">
            Agentic AI · Research Assistant
          </p>
          <h1 className="font-display text-4xl leading-[1.1] tracking-tight text-ink dark:text-parchment sm:text-5xl">
            Every paper gets a reviewer who never sleeps.
          </h1>
          <p className="mt-5 font-body text-base leading-relaxed text-ink/65 dark:text-parchment/65">
            Marginalia is a multi-agent system that reads your manuscript the way
            a thorough reviewer would — scoring novelty, auditing reproducibility,
            and suggesting improvements in the margins, without rewriting a word
            of your work.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/upload"
              className="group inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 font-body text-sm text-parchment transition-colors hover:bg-navy-light dark:bg-rust dark:hover:bg-rust-light"
            >
              Analyze a paper
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/about"
              className="font-body text-sm text-ink/70 underline decoration-ink/30 underline-offset-4 hover:text-ink dark:text-parchment/70 dark:hover:text-parchment"
            >
              How the agents work
            </Link>
          </div>
        </div>

        <MarginaliaHero />
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-navy dark:text-navy-light">
            What it does
          </p>
          <h2 className="font-display text-3xl text-ink dark:text-parchment">
            Five specialist agents, one planning brain.
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="paper-card p-6">
              <f.icon size={20} className="mb-4 text-rust dark:text-rust-light" strokeWidth={1.75} />
              <h3 className="mb-2 font-display text-lg text-ink dark:text-parchment">{f.title}</h3>
              <p className="font-body text-sm leading-relaxed text-ink/60 dark:text-parchment/60">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-12 max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.25em] text-navy dark:text-navy-light">
            The pipeline
          </p>
          <h2 className="font-display text-3xl text-ink dark:text-parchment">
            Watch the review happen, agent by agent.
          </h2>
        </div>
        <ol className="space-y-0">
          {WORKFLOW.map((w, i) => (
            <li key={w.step} className="flex gap-6 border-t border-ink/10 py-5 first:border-t-0 dark:border-parchment/10">
              <span className="w-10 shrink-0 font-mono text-sm text-ink/35 dark:text-parchment/35">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display text-base text-ink dark:text-parchment">{w.step}</h3>
                <p className="mt-1 font-body text-sm text-ink/60 dark:text-parchment/60">{w.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="paper-card flex flex-col items-start gap-6 p-10 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl text-ink dark:text-parchment">
              Upload a manuscript and watch the margins fill in.
            </h2>
            <p className="mt-2 font-body text-sm text-ink/60 dark:text-parchment/60">
              PDF, DOCX, or plain text. Nothing leaves your machine except the
              extracted text sent to the analysis pipeline.
            </p>
          </div>
          <Link
            href="/upload"
            className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-navy px-6 py-3 font-body text-sm text-parchment transition-colors hover:bg-navy-light dark:bg-rust dark:hover:bg-rust-light"
          >
            Get started <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
}
