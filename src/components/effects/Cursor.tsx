"use client";
import { useEffect, useRef } from "react";
import { useRichMotion } from "@/hooks/useMotion";

/** Neon ring cursor with a dot; grows over links and buttons. Mouse/trackpad only. The loop sleeps when the mouse is still. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  useEffect(() => {
    if (!rich) return;
    document.body.classList.add("has-cursor");
    let raf = 0, running = false, x = -100, y = -100, rx = -100, ry = -100, hover = false, lastHover = false;

    const tick = () => {
      rx += (x - rx) * 0.22;
      ry += (y - ry) * 0.22;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${hover ? 1.8 : 1})`;
      if (Math.abs(x - rx) < 0.3 && Math.abs(y - ry) < 0.3) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${x - 3}px, ${y - 3}px, 0)`;
      const t = e.target as HTMLElement | null;
      hover = !!t?.closest("a,button,[role=button],input,textarea,select,summary");
      if (hover !== lastHover && ring.current) {
        ring.current.style.borderColor = hover ? "rgba(187,154,247,.9)" : "rgba(125,207,255,.7)";
        lastHover = hover;
      }
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };
    window.addEventListener("pointermove", move, { passive: true });
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
        className="pointer-events-none fixed left-0 top-0 z-[100] h-9 w-9 rounded-full border-2 will-change-transform"
        style={{ borderColor: "rgba(125,207,255,.7)", transition: "border-color .2s" }}
      />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-ok will-change-transform" />
    </>
  );
}
