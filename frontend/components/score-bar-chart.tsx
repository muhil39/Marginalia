"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

interface DataPoint {
  name: string;
  score: number;
}

const BAR_COLORS = ["#B3401D", "#1D3B53", "#3F6E52", "#D45C34"];

export function ScoreBarChart({ data }: { data: DataPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 8, right: 16, left: -16, bottom: 8 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink/10 dark:text-parchment/10" vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          stroke="currentColor"
          className="text-ink/50 dark:text-parchment/50"
          tickLine={false}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: 11, fontFamily: "var(--font-mono)" }}
          stroke="currentColor"
          className="text-ink/50 dark:text-parchment/50"
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          contentStyle={{
            background: "#F6F1E6",
            border: "1px solid rgba(27,30,28,0.15)",
            borderRadius: 2,
            fontFamily: "var(--font-body)",
            fontSize: 13,
          }}
        />
        <Bar dataKey="score" radius={[3, 3, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
