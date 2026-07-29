export function Footer() {
  return (
    <footer className="border-t border-ink/10 dark:border-parchment/10 mt-24">
      <div className="mx-auto max-w-6xl px-6 py-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs text-ink/50 dark:text-parchment/50">
          Marginalia — Agentic AI Research Analyzer · College Capstone Project
        </p>
        <p className="font-mono text-xs text-ink/40 dark:text-parchment/40">
          Heuristic screening only. Not a substitute for expert peer review.
        </p>
      </div>
    </footer>
  );
}
