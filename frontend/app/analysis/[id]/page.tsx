"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Download, FileWarning, Printer, ArrowLeft } from "lucide-react";
import { getStatus, reportMarkdownUrl } from "@/lib/api";
import type { AnalysisReport, PublicationRecommendation } from "@/lib/types";
import { ScoreRing } from "@/components/score-ring";
import { ScoreBarChart } from "@/components/score-bar-chart";
import { SectionPanel } from "@/components/section-panel";

const REC_STYLES: Record<PublicationRecommendation, string> = {
  "Accept": "bg-sage text-parchment",
  "Minor Revision": "bg-navy text-parchment dark:bg-navy-light",
  "Major Revision": "bg-rust-light text-parchment",
  "Reject": "bg-rust text-parchment",
};

const FUTURE_LABELS: [keyof AnalysisReport["future_scope"], string][] = [
  ["short_term", "Short-term extensions"],
  ["medium_term", "Medium-term research"],
  ["long_term", "Long-term research"],
  ["industrial_applications", "Industrial applications"],
  ["startup_opportunities", "Startup opportunities"],
  ["patent_ideas", "Patent ideas"],
  ["phd_extensions", "PhD extensions"],
  ["grant_opportunities", "Grant opportunities"],
];

export default function AnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getStatus(id)
      .then((s) => {
        if (s.report) setReport(s.report);
        else setError("Analysis is not complete yet.");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load report."));
  }, [id]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <FileWarning size={28} className="mx-auto mb-4 text-rust dark:text-rust-light" />
        <h1 className="font-display text-2xl text-ink dark:text-parchment">Report not available</h1>
        <p className="mt-3 font-body text-sm text-ink/60 dark:text-parchment/60">{error}</p>
        <Link href={`/dashboard/${id}`} className="mt-6 inline-flex items-center gap-2 font-body text-sm text-navy underline dark:text-navy-light">
          <ArrowLeft size={14} /> Back to dashboard
        </Link>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center font-body text-sm text-ink/50 dark:text-parchment/50">
        Loading report…
      </div>
    );
  }

  const chartData = [
    { name: "Novelty", score: report.novelty.novelty_score },
    { name: "Quality", score: report.improvement.overall_quality_score },
    { name: "Repro.", score: report.reproducibility.reproducibility_score },
    { name: "Innovation", score: report.novelty.innovation_score },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-16 print:py-4">
      {/* Header */}
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-2 font-mono text-xs uppercase tracking-[0.25em] text-rust dark:text-rust-light">
            Analysis report
          </p>
          <h1 className="font-display text-3xl text-ink dark:text-parchment">{report.filename}</h1>
          <p className="mt-1 font-mono text-xs text-ink/40 dark:text-parchment/40">
            Generated {new Date(report.generated_at).toLocaleString()}
          </p>
        </div>
        <div className="flex shrink-0 gap-3 print:hidden">
          <a
            href={reportMarkdownUrl(id)}
            download={`${report.filename}-report.md`}
            className="inline-flex items-center gap-2 rounded-sm border border-ink/20 px-4 py-2 font-body text-sm text-ink/80 transition-colors hover:bg-ink/5 dark:border-parchment/20 dark:text-parchment/80 dark:hover:bg-parchment/10"
          >
            <Download size={14} /> Markdown
          </a>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-sm bg-navy px-4 py-2 font-body text-sm text-parchment transition-colors hover:bg-navy-light dark:bg-rust dark:hover:bg-rust-light"
          >
            <Printer size={14} /> Save as PDF
          </button>
        </div>
      </div>

      {/* Recommendation banner */}
      <div className={`mb-10 flex items-center justify-between rounded-sm px-6 py-4 ${REC_STYLES[report.publication.recommendation]}`}>
        <span className="font-display text-lg">Publication recommendation</span>
        <span className="font-mono text-lg uppercase tracking-wide">{report.publication.recommendation}</span>
      </div>

      {/* Score overview */}
      <section className="paper-card mb-10 grid grid-cols-2 gap-6 p-8 sm:grid-cols-4">
        <ScoreRing score={report.novelty.novelty_score} label="Novelty" color="rust" />
        <ScoreRing score={report.improvement.overall_quality_score} label="Quality" color="navy" />
        <ScoreRing score={report.reproducibility.reproducibility_score} label="Reproducibility" color="sage" />
        <ScoreRing score={report.novelty.confidence_score} label="Confidence" color="navy" />
      </section>

      <section className="paper-card mb-10 p-8">
        <h2 className="mb-4 font-display text-xl text-ink dark:text-parchment">Score comparison</h2>
        <ScoreBarChart data={chartData} />
      </section>

      {/* Novelty */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl text-ink dark:text-parchment">1. Novelty Analysis</h2>
        <div className="paper-card grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-sage dark:text-sage-light">Strengths</h3>
            <ul className="space-y-2">
              {report.novelty.strengths.map((s, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">— {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-rust dark:text-rust-light">Weaknesses</h3>
            <ul className="space-y-2">
              {report.novelty.weaknesses.map((s, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">— {s}</li>
              ))}
            </ul>
          </div>
          <p className="md:col-span-2 border-t border-ink/10 pt-4 font-body text-sm leading-relaxed text-ink/60 dark:border-parchment/10 dark:text-parchment/60">
            {report.novelty.research_gap_notes}
          </p>
        </div>
      </section>

      {/* Improvement */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl text-ink dark:text-parchment">2. Paper Improvement</h2>
        <div className="paper-card overflow-hidden">
          {report.improvement.section_feedback.map((sf) => (
            <SectionPanel key={sf.section} section={sf} />
          ))}
        </div>
      </section>

      {/* Future scope */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl text-ink dark:text-parchment">3. Future Scope</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {FUTURE_LABELS.map(([key, label]) => (
            <div key={key} className="paper-card p-6">
              <h3 className="mb-3 font-display text-base text-ink dark:text-parchment">{label}</h3>
              <ul className="space-y-2">
                {(report.future_scope[key] as string[]).map((item, i) => (
                  <li key={i} className="font-body text-sm leading-relaxed text-ink/65 dark:text-parchment/65">— {item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Reproducibility */}
      <section className="mb-10">
        <h2 className="mb-4 font-display text-2xl text-ink dark:text-parchment">4. Reproducibility</h2>
        <div className="paper-card p-8">
          <p className="mb-6 font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">
            {report.reproducibility.summary}
          </p>
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/15 dark:border-parchment/15">
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-ink/50 dark:text-parchment/50">Checklist item</th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-ink/50 dark:text-parchment/50">Found</th>
                <th className="pb-2 font-mono text-xs uppercase tracking-wider text-ink/50 dark:text-parchment/50">Note</th>
              </tr>
            </thead>
            <tbody>
              {report.reproducibility.checklist.map((c) => (
                <tr key={c.item} className="border-b border-ink/10 last:border-b-0 dark:border-parchment/10">
                  <td className="py-3 pr-4 font-body text-sm text-ink/80 dark:text-parchment/80">{c.item}</td>
                  <td className="py-3 pr-4 font-body text-sm">
                    <span className={c.found ? "text-sage dark:text-sage-light" : "text-rust dark:text-rust-light"}>
                      {c.found ? "Found" : "Missing"}
                    </span>
                  </td>
                  <td className="py-3 font-body text-sm text-ink/55 dark:text-parchment/55">{c.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Publication review */}
      <section className="mb-4">
        <h2 className="mb-4 font-display text-2xl text-ink dark:text-parchment">5. Publication Review</h2>
        <div className="paper-card grid grid-cols-1 gap-6 p-8 md:grid-cols-2">
          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-sage dark:text-sage-light">Major strengths</h3>
            <ul className="space-y-2">
              {report.publication.major_strengths.map((s, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">— {s}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-rust dark:text-rust-light">Major weaknesses</h3>
            <ul className="space-y-2">
              {report.publication.major_weaknesses.map((s, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-ink/70 dark:text-parchment/70">— {s}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 border-t border-ink/10 pt-4 dark:border-parchment/10">
            <h3 className="mb-2 font-mono text-xs uppercase tracking-wider text-navy dark:text-navy-light">Reviewer comments</h3>
            <ul className="space-y-2">
              {report.publication.reviewer_comments.map((s, i) => (
                <li key={i} className="font-body text-sm leading-relaxed text-ink/65 dark:text-parchment/65">— {s}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
