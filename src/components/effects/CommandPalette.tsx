"use client";
import { useEffect, useMemo, useRef, useState, type KeyboardEvent as RKeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useUI } from "@/store/ui";
import { nav, site } from "@/content/site";
import { projects } from "@/content/projects";

type Cmd = { id: string; label: string; hint: string; run: () => void };

/** Ctrl/⌘+K command palette for keyboard navigation. */
export default function CommandPalette() {
  const { paletteOpen, closePalette, togglePalette } = useUI();
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const go = (hash: string) => {
    closePalette();
    if (window.location.pathname !== "/") router.push("/" + hash);
    else document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
  };

  const cmds: Cmd[] = useMemo(
    () => [
      ...nav.map((n) => ({ id: n.href, label: `Go to ${n.label}`, hint: "section", run: () => go(n.href) })),
      ...projects.map((p) => ({
        id: p.slug,
        label: `Open ${p.title} case study`,
        hint: "project",
        run: () => { closePalette(); router.push(`/projects/${p.slug}`); },
      })),
      { id: "upwork", label: "Hire me on Upwork", hint: "link", run: () => window.open(site.links.upwork, "_blank", "noopener") },
      { id: "github", label: "Open GitHub", hint: "link", run: () => window.open(site.links.github, "_blank", "noopener") },
      { id: "email", label: "Copy email address", hint: "action", run: () => { navigator.clipboard?.writeText(site.links.email); closePalette(); } },
      { id: "top", label: "Back to top", hint: "action", run: () => { closePalette(); window.scrollTo({ top: 0, behavior: "smooth" }); } },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const list = cmds.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // e.code is the physical key, so this works on any keyboard layout (e.g. Georgian, where e.key is "კ")
      if ((e.ctrlKey || e.metaKey) && (e.code === "KeyK" || e.key.toLowerCase() === "k")) {
        e.preventDefault();
        togglePalette();
      } else if (e.key === "Escape") closePalette();
    };
    // capture phase so the page sees it before the browser's own shortcut handling
    window.addEventListener("keydown", onKey, { capture: true });
    return () => window.removeEventListener("keydown", onKey, { capture: true });
  }, [togglePalette, closePalette]);

  useEffect(() => {
    if (paletteOpen) {
      setQ("");
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [paletteOpen]);

  if (!paletteOpen) return null;

  const onKeyDown = (e: RKeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, list.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter" && list[active]) { e.preventDefault(); list[active].run(); }
  };

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink-950/85 px-4 pt-[15vh]" onClick={closePalette}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        className="panel w-full max-w-lg overflow-hidden shadow-glow-lg"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-3 border-b border-cyan-neon/10 px-4">
          <span className="font-mono text-cyan-neon">›</span>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => { setQ(e.target.value); setActive(0); }}
            placeholder="Type a command or search…"
            aria-label="Search commands"
            className="h-14 min-w-0 flex-1 bg-transparent text-base text-fg-strong no-ring outline-none focus-visible:outline-none placeholder:text-fg-subtle"
          />
          <kbd className="rounded border border-cyan-neon/20 px-1.5 py-0.5 font-mono text-[10px] text-fg-muted">ESC</kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2" role="listbox">
          {list.length === 0 && <li className="px-3 py-6 text-center text-sm text-fg-muted">No results</li>}
          {list.map((c, i) => (
            <li
              key={c.id}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={c.run}
              className={`flex cursor-pointer items-center justify-between rounded-lg px-3 py-2.5 text-sm ${
                i === active ? "bg-cyan-neon/10 text-fg-strong" : "text-fg"
              }`}
            >
              {c.label}
              <span className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">{c.hint}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
