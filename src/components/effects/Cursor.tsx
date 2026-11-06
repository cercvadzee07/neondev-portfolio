"use client";
import { useEffect, useRef } from "react";
import { useRichMotion } from "@/hooks/useMotion";

/** Neon ring cursor with a trailing dot; grows over links and buttons. Mouse/trackpad only. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  useEffect(() => {
    if (!rich) return;
    document.body.classList.add("has-cursor");
    let raf = 0, x = -100, y = -100, rx = -100, ry = -100, hover = false;
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest("a,button,[role=button],input,textarea,select,summary");
    };
    const tick = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      if (ring.current) {
        const s = hover ? 1.8 : 1;
        ring.current.style.transform = `translate(${rx - 18}px, ${ry - 18}px) scale(${s})`;
        ring.current.style.borderColor = hover ? "rgba(187,154,247,.9)" : "rgba(125,207,255,.7)";
      }
      if (dot.current) dot.current.style.transform = `translate(${x - 3}px, ${y - 3}px)`;
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", move, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      document.body.classList.remove("has-cursor");
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", move);
    };
  }, [rich]);

  if (!rich) return null;
  return (
    <>
      <div
        ref={ring}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border-2 mix-blend-screen"
        style={{ transition: "border-color .2s, width .2s, height .2s", boxShadow: "0 0 18px rgba(125,207,255,.35)" }}
      />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-ok" />
    </>
  );
}
