"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Strip "#section" from the address bar: on-page links scroll smoothly without adding a hash. */
const clean = () => window.history.replaceState(window.history.state, "", window.location.pathname + window.location.search);

const scrollToId = (id: string, smooth: boolean) => {
  const el = document.getElementById(decodeURIComponent(id));
  if (!el) return false;
  el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
  return true;
};

export default function HashScroll() {
  const pathname = usePathname();

  // arriving with a hash (e.g. "/#work" from a case study page): scroll there, then clean the URL
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // wait a frame so the page has laid out
    const raf = requestAnimationFrame(() => {
      scrollToId(id, false);
      clean();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  // clicking an on-page link ("#work" or "/#work" while on that page): scroll without touching the URL
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target === "_blank") return;
      const url = new URL(a.href, window.location.href);
      if (!url.hash || url.origin !== window.location.origin || url.pathname !== window.location.pathname) return;
      const id = url.hash.slice(1);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!scrollToId(id, !reduced)) return;
      e.preventDefault();
      if (id === "main") document.getElementById("main")?.focus({ preventScroll: true }); // skip link
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
