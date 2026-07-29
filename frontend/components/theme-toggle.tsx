"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
      className="grid h-9 w-9 place-items-center rounded-full border border-ink/15 dark:border-parchment/15 text-ink dark:text-parchment hover:bg-ink/5 dark:hover:bg-parchment/10 transition-colors"
    >
      {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  );
}
