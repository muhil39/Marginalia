"use client";

const COLORS: Record<string, string> = {
  rust: "#B3401D",
  navy: "#1D3B53",
  sage: "#3F6E52",
};

export function ScoreRing({
  score,
  label,
  color = "navy",
  size = 108,
}: {
  score: number;
  label: string;
  color?: "rust" | "navy" | "sage";
  size?: number;
}) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-ink/10 dark:text-parchment/10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={COLORS[color]}
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.16,1,0.3,1)" }}
        />
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          transform={`rotate(90 ${size / 2} ${size / 2})`}
          className="fill-ink font-mono text-xl font-medium dark:fill-parchment"
        >
          {score}
        </text>
      </svg>
      <span className="text-center font-mono text-[11px] uppercase tracking-wider text-ink/55 dark:text-parchment/55">
        {label}
      </span>
    </div>
  );
}
