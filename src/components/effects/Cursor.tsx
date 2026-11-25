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
    // Everything eases by TIME, not per frame, so it feels the same on 60 Hz and 144 Hz screens.
    // tau = how long the motion takes (roughly 3×tau to fully settle). Bigger = slower, softer.
    let scale = 1, last = 0;
    const HOVER_SCALE = 1.6;
    const MOVE_TAU = 0.07; // ring following the mouse (~0.2 s)
    const GROW_TAU = 0.14; // ring growing over a link/button (~0.4 s)
    const SHRINK_TAU = 0.11; // ring shrinking back (~0.33 s)
    const ease = (dt: number, tau: number) => 1 - Math.exp(-dt / tau);

    const tick = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60; // seconds; capped so a lag spike can't make it jump
      last = now;
      const m = ease(dt, MOVE_TAU);
      rx += (x - rx) * m;
      ry += (y - ry) * m;
      const target = hover ? HOVER_SCALE : 1;
      scale += (target - scale) * ease(dt, target > scale ? GROW_TAU : SHRINK_TAU);
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0) scale(${scale})`;
      // sleep only when both the position and the size have settled
      if (Math.abs(x - rx) < 0.3 && Math.abs(y - ry) < 0.3 && Math.abs(target - scale) < 0.002) {
        scale = target;
        running = false;
        last = 0;
        return;
      }
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
        ring.current.style.backgroundColor = hover ? "rgba(187,154,247,.08)" : "transparent";
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
        style={{ borderColor: "rgba(125,207,255,.7)", transition: "border-color .4s ease, background-color .4s ease" }}
      />
      <div ref={dot} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-ok will-change-transform" />
    </>
  );
}
