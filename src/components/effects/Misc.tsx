"use client";
import { useEffect, useState } from "react";
import { site } from "@/content/site";

/** Live local time in Tbilisi, e.g. "18:40:12". */
export function LiveClock({ className }: { className?: string }) {
  const [now, setNow] = useState<string>("--:--:--");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", { timeZone: site.timezone, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
    const tick = () => setNow(fmt.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <span className={className} suppressHydrationWarning>
      LOC: TBILISI // GE · {now}
    </span>
  );
}

/** Thin gradient bar at the top showing scroll progress. */
export function ScrollProgress() {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setP(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-neon" style={{ transform: `scaleX(${p})` }} />
  );
}

/** Infinite tech-stack ticker. */
export function Marquee({ items }: { items: readonly string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative overflow-hidden py-6 [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
        {row.map((s, i) => (
          <span key={i} className="flex items-center gap-10 font-mono text-sm uppercase tracking-[0.3em] text-fg-muted">
            {s}
            <span className="text-cyan-neon/50">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
