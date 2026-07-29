"use client";

import { motion } from "framer-motion";
import { Check, Loader2, CircleDashed, X } from "lucide-react";
import type { AgentStep } from "@/lib/types";

function StatusIcon({ status }: { status: AgentStep["status"] }) {
  switch (status) {
    case "done":
      return (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-sage text-parchment">
          <Check size={13} strokeWidth={2.5} />
        </span>
      );
    case "running":
      return (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy text-parchment dark:bg-navy-light">
          <Loader2 size={13} className="animate-spin" strokeWidth={2.5} />
        </span>
      );
    case "failed":
      return (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-rust text-parchment">
          <X size={13} strokeWidth={2.5} />
        </span>
      );
    default:
      return (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-ink/25 text-ink/40 dark:border-parchment/25 dark:text-parchment/40">
          <CircleDashed size={13} />
        </span>
      );
  }
}

export function AgentTimeline({ steps }: { steps: AgentStep[] }) {
  return (
    <ol className="space-y-0">
      {steps.map((step, i) => (
        <li key={step.name} className="flex gap-4 border-t border-ink/10 py-4 first:border-t-0 dark:border-parchment/10">
          <StatusIcon status={step.status} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="font-display text-sm text-ink dark:text-parchment">
                {step.name}
              </h3>
              <span className="font-mono text-[10px] uppercase tracking-wider text-ink/40 dark:text-parchment/40">
                {step.status}
              </span>
            </div>
            {step.detail && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-1 font-body text-xs leading-relaxed text-ink/55 dark:text-parchment/55"
              >
                {step.detail}
              </motion.p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}
