"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import LogoMark from "@/components/ui/LogoMark";
import { useUI } from "@/store/ui";
import { getDict, langs, switchPath, type Lang } from "@/content/i18n";

/** KA / EN switch — keeps you on the same page in the other language. */
function LangSwitch({ lang }: { lang: Lang }) {
  const pathname = usePathname() ?? `/${lang}`;
  return (
    <div className="flex items-center rounded-lg border border-cyan-neon/15 bg-ink-850/60 p-0.5 font-mono text-xs" role="group" aria-label="Language">
      {langs.map((l) => (
        <Link
          key={l}
          href={switchPath(pathname, l)}
          hrefLang={l}
          lang={l}
          aria-current={l === lang ? "true" : undefined}
          className={`rounded-md px-2 py-1 tracking-wider transition-colors ${
            l === lang ? "bg-cyan-neon/15 text-fg-strong" : "text-fg-muted hover:text-fg-strong"
          }`}
        >
          {l.toUpperCase()}
        </Link>
      ))}
    </div>
  );
}

export default function Navbar({ lang }: { lang: Lang }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const openPalette = useUI((s) => s.openPalette);
  const t = getDict(lang);
  const ka = lang === "ka";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Georgian labels are wider, so the KA navbar switches to the full menu one breakpoint later.
  const listCls = ka ? "hidden items-center gap-5 lg:flex" : "hidden items-center gap-7 md:flex";
  const burgerCls = ka ? "lg:hidden" : "md:hidden";
  const searchCls = ka ? "xl:flex" : "lg:flex";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "border-b border-cyan-neon/10 bg-ink-950/92" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href={`/${lang}`} className="flex items-center gap-3" aria-label="NEONDEV home">
          <LogoMark size={34} />
          <span className="text-sm font-extrabold tracking-[0.35em] text-fg-strong">
            NEON<span className="text-neon">DEV</span>
          </span>
        </Link>

        <ul className={listCls}>
          {t.nav.map((n) => (
            <li key={n.href}>
              <a href={`/${lang}${n.href}`} className="text-sm text-fg-muted transition-colors hover:text-fg-strong">
                {n.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={openPalette}
            className={`hidden items-center gap-2 rounded-lg border border-cyan-neon/15 bg-ink-850/60 px-3 py-1.5 font-mono text-xs text-fg-muted transition-colors hover:text-fg-strong ${searchCls}`}
            aria-label="Open command palette"
          >
            <span>{t.navSearch}</span>
            <kbd className="rounded border border-cyan-neon/20 px-1">Ctrl K</kbd>
          </button>
          <LangSwitch lang={lang} />
          <a href={`/${lang}#contact`} className="btn-primary hidden px-4 py-2 text-sm sm:inline-flex">
            {t.navCta}
          </a>
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-lg border border-cyan-neon/15 ${burgerCls}`}
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={t.menuLabel}
          >
            <span className="relative block h-3 w-5">
              <span className={`absolute left-0 top-0 h-0.5 w-5 bg-fg-strong transition-transform ${open ? "translate-y-[5px] rotate-45" : ""}`} />
              <span className={`absolute bottom-0 left-0 h-0.5 w-5 bg-fg-strong transition-transform ${open ? "-translate-y-[5px] -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </nav>

      {open && (
        <div id="mobile-menu" className={`border-t border-cyan-neon/10 bg-ink-950/98 px-4 pb-6 pt-2 ${burgerCls}`}>
          {t.nav.map((n) => (
            <a key={n.href} href={`/${lang}${n.href}`} onClick={() => setOpen(false)} className="block py-3 text-lg text-fg-strong">
              {n.label}
            </a>
          ))}
          <a href={`/${lang}#contact`} onClick={() => setOpen(false)} className="btn-primary mt-4 w-full">
            {t.navCta}
          </a>
        </div>
      )}
    </header>
  );
}
