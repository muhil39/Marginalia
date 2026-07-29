"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";
import clsx from "clsx";

const LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/upload", label: "Upload" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 dark:border-parchment/10 bg-parchment/85 dark:bg-ink/85 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 font-display text-lg tracking-tight">
          <span className="grid h-7 w-7 place-items-center rounded-sm bg-navy text-parchment text-xs font-mono dark:bg-rust">
            §
          </span>
          <span>Marginal<span className="text-rust dark:text-rust-light">ia</span></span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={clsx(
                "font-body text-sm tracking-wide transition-colors relative",
                pathname === link.href
                  ? "text-rust dark:text-rust-light"
                  : "text-ink/70 hover:text-ink dark:text-parchment/70 dark:hover:text-parchment"
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/upload"
            className="hidden rounded-sm bg-navy px-4 py-2 font-body text-sm text-parchment transition-colors hover:bg-navy-light dark:bg-rust dark:hover:bg-rust-light sm:inline-block"
          >
            Analyze a paper
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
