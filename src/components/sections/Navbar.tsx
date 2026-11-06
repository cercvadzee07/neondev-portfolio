"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import LogoMark from "@/components/ui/LogoMark";
import { nav } from "@/content/site";
import { useUI } from "@/store/ui";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openPalette = useUI((s) => s.openPalette);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-cyan-neon/10 bg-ink-950/70 backdrop-blur-xl" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="flex items-center gap-3" aria-label="NEONDEV home">
          <LogoMark size={34} />
          <span className="text-sm font-extrabold tracking-[0.35em] text-fg-strong">
            NEON<span className="text-neon">DEV</span>
          </span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <li key={n.href}>
              <a href={`/${n.href}`} className="text-sm text-fg-muted transition-colors hover:text-fg-strong">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className="hidden items-center gap-2 rounded-lg border border-cyan-neon/15 bg-ink-850/60 px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg-strong lg:flex"
            aria-label="Open command palette"
          >
            <span>Search</span>
            <kbd className="rounded border border-cyan-neon/20 px-1">Ctrl K</kbd>
          </button>
          <a href="/#contact" className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
            Start a project
          </a>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-neon/15 md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Toggle menu"
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-fg-strong transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-fg-strong transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-cyan-neon/10 bg-ink-950/95 px-4 pb-6 pt-2 backdrop-blur-xl md:hidden">
          {nav.map((n) => (
            <a key={n.href} href={`/${n.href}`} onClick={() => setOpen(false)} className="block py-3 text-lg text-fg-strong">
              {n.label}
            </a>
          ))}
          <a href="/#contact" onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
            Start a project
          </a>
        </div>
      )}
    </header>
  );
}
