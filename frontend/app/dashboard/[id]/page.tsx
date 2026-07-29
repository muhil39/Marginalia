"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, AlertTriangle } from "lucide-react";
import { getStatus } from "@/lib/api";
import { AgentTimeline } from "@/components/agent-timeline";
import type { PipelineStatus } from "@/lib/types";

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [status, setStatus] = useState<PipelineStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    async function poll() {
      try {
        const s = await getStatus(id);
        if (cancelled) return;
        setStatus(s);
        if (s.complete) {
          timer = setTimeout(() => router.push(`/analysis/${id}`), 900);
        } else {
          timer = setTimeout(poll, 1200);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not reach the backend.");
      }
    }

    poll();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [id, router]);

  const doneCount = status?.steps.filter((s) => s.status === "done").length ?? 0;
  const totalCount = status?.steps.length ?? 9;
  const pct = Math.round((doneCount / totalCount) * 100);

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <p className="mb-3 text-center font-mono text-xs uppercase tracking-[0.25em] text-rust dark:text-rust-light">
        Step 2 of 2
      </p>
      <h1 className="text-center font-display text-4xl text-ink dark:text-parchment">
        The agents are at work
      </h1>
      <p className="mx-auto mt-4 max-w-md text-center font-body text-sm leading-relaxed text-ink/60 dark:text-parchment/60">
        The Planning Agent is dispatching each specialist in sequence. This page
        updates live — no need to refresh.
      </p>

      {error ? (
        <div className="mt-10 flex items-start gap-3 rounded-sm border border-rust/30 bg-rust/5 px-5 py-4 text-sm text-rust dark:border-rust-light/30 dark:bg-rust-light/10 dark:text-rust-light">
          <AlertTriangle size={18} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-medium">Couldn't reach the analysis backend.</p>
            <p className="mt-1 text-ink/60 dark:text-parchment/60">
              {error} — make sure the FastAPI server is running at the configured
              API URL (see backend/README.md).
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="mx-auto mt-10 max-w-md">
            <div className="h-2 overflow-hidden rounded-full bg-ink/10 dark:bg-parchment/10">
              <div
                className="h-full rounded-full bg-navy transition-all duration-500 dark:bg-navy-light"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="mt-2 text-center font-mono text-xs text-ink/45 dark:text-parchment/45">
              {doneCount} / {totalCount} agents complete
            </p>
          </div>

          <div className="paper-card mt-8 px-6 py-2">
            {status ? (
              <AgentTimeline steps={status.steps} />
            ) : (
              <p className="py-6 text-center font-body text-sm text-ink/50 dark:text-parchment/50">
                Connecting to the pipeline…
              </p>
            )}
          </div>

          {status?.complete && (
            <div className="mt-8 flex justify-center">
              <Link
                href={`/analysis/${id}`}
                className="inline-flex items-center gap-2 rounded-sm bg-navy px-6 py-3 font-body text-sm text-parchment transition-colors hover:bg-navy-light dark:bg-rust dark:hover:bg-rust-light"
              >
                View report <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
