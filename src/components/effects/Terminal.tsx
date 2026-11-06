"use client";
import { useEffect, useRef, useState, type FormEvent, type ReactNode, type KeyboardEvent as RKeyboardEvent } from "react";
import { projects } from "@/content/projects";
import { services } from "@/content/offer";
import { site } from "@/content/site";
import LogoMark from "@/components/ui/LogoMark";

type Line = { id: number; node: ReactNode };

const PROMPT = (
  <>
    <span className="text-violet-neon">guest@neondev</span>
    <span className="text-fg-subtle">:~$ </span>
  </>
);

const k = (s: string) => <span className="inline-block w-[5.5rem] text-cyan-neon">{s.trim()}</span>;

const neofetch = (
  <div className="flex gap-5 py-1">
    <LogoMark size={72} className="hidden shrink-0 sm:block" />
    <div className="leading-6">
      <div><span className="text-violet-neon">guest</span>@<span className="text-cyan-neon">neondev</span></div>
      <div className="text-fg-subtle">──────────────────────────</div>
      <div>{k("role     ")}{site.role}</div>
      <div>{k("stack    ")}Next.js · React · TypeScript</div>
      <div>{k("styling  ")}Tailwind CSS · Zustand</div>
      <div>{k("backend  ")}Node.js · Express · PostgreSQL</div>
      <div>{k("deploy   ")}Vercel · GitHub</div>
      <div>{k("status   ")}<span className="text-ok">● online</span></div>
    </div>
  </div>
);

function run(cmd: string): ReactNode | "clear" {
  const c = cmd.trim().toLowerCase();
  switch (c) {
    case "":
      return null;
    case "help":
      return (
        <div className="grid grid-cols-[110px_1fr] gap-x-4">
          {[
            ["about", "who I am"],
            ["projects", "featured work"],
            ["skills", "tech stack"],
            ["services", "what I can build for you"],
            ["contact", "how to reach me"],
            ["neofetch", "system info"],
            ["clear", "clear the screen"],
          ].map(([a, b]) => (
            <div key={a} className="contents">
              <span className="text-cyan-neon">{a}</span>
              <span className="text-fg-muted">{b}</span>
            </div>
          ))}
        </div>
      );
    case "about":
      return `${site.person} — ${site.role} from ${site.location}. I build fast, production-ready web apps and MVPs.`;
    case "projects":
      return (
        <div>
          {projects.map((p) => (
            <div key={p.slug}>
              <span className="inline-block w-32 text-cyan-neon">{p.title}</span>
              <span className="text-fg-muted">{p.subtitle}</span>
            </div>
          ))}
          <div className="mt-1 text-fg-subtle">→ scroll to #work or press Ctrl+K</div>
        </div>
      );
    case "skills":
      return site.stack.join(" · ");
    case "services":
      return services.map((s) => `• ${s.title}`).join("\n");
    case "contact":
      return (
        <div>
          <div>{k("email   ")}{site.links.email}</div>
          <div>{k("upwork  ")}Beqa T.</div>
          <div>{k("github  ")}cercvadzee07</div>
        </div>
      );
    case "neofetch":
      return neofetch;
    case "clear":
      return "clear";
    case "sudo rm -rf /":
      return <span className="text-bad">Nice try. 🙂</span>;
    default:
      return <span className="text-bad">command not found: {c}. Type <span className="text-cyan-neon">help</span>.</span>;
  }
}

/** Interactive terminal window. */
export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { id: 0, node: <span className="text-fg-muted">Welcome to NEONDEV. Type <span className="text-cyan-neon">help</span> to get started.</span> },
    { id: 1, node: neofetch },
  ]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const idRef = useRef(2);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const out = run(value);
    if (out === "clear") {
      setLines([]);
    } else {
      const next: Line[] = [{ id: idRef.current++, node: <>{PROMPT}{value}</> }];
      if (out !== null) next.push({ id: idRef.current++, node: <div className="whitespace-pre-wrap">{out}</div> });
      setLines((l) => [...l, ...next]);
    }
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30));
    setHIdx(-1);
    setValue("");
  };

  const onKey = (e: RKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp" && history.length) {
      e.preventDefault();
      const i = Math.min(hIdx + 1, history.length - 1);
      setHIdx(i);
      setValue(history[i]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const i = hIdx - 1;
      setHIdx(Math.max(i, -1));
      setValue(i >= 0 ? history[i] : "");
    }
  };

  return (
    <div className="panel overflow-hidden shadow-glow" onClick={() => inputRef.current?.focus()}>
      <div className="flex items-center gap-2 border-b border-cyan-neon/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-bad" />
        <span className="h-3 w-3 rounded-full bg-warn" />
        <span className="h-3 w-3 rounded-full bg-ok" />
        <span className="flex-1 pr-12 text-center font-mono text-xs text-cyan-neon">guest@neondev:~</span>
      </div>
      <div ref={bodyRef} className="h-[300px] overflow-y-auto px-4 py-4 sm:h-[360px] sm:px-5 font-mono text-[13px] leading-6 text-fg sm:text-sm">
        {lines.map((l) => (
          <div key={l.id}>{l.node}</div>
        ))}
        <form onSubmit={submit} className="flex">
          {PROMPT}
          <label htmlFor="term-input" className="sr-only">Terminal command</label>
          <input
            id="term-input"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKey}
            autoComplete="off"
            spellCheck={false}
            className="ml-1 flex-1 bg-transparent text-fg-strong caret-ok outline-none focus-visible:outline-none"
            placeholder="type help…"
          />
        </form>
      </div>
    </div>
  );
}
