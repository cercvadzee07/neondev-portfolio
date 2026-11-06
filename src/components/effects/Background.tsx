"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMotion";

/**
 * Fixed neon scene: static grid, soft glows and a lightweight canvas particle network.
 * Performance notes:
 *  - capped particle count and DPR, 30 FPS, paused when the tab is hidden
 *  - all connecting lines are batched into a few paths (one stroke per opacity bucket)
 *  - the grid and glows are static layers (no per-frame repaint)
 */
type Dot = { x: number; y: number; vx: number; vy: number; violet: boolean };

const BUCKETS = 4;

export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, last = 0;
    let dots: Dot[] = [];
    const mouse = { x: -1e4, y: -1e4 };
    const FPS = 30;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(w < 768 ? 28 : 55, (w * h) / 22000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        violet: Math.random() < 0.5,
      }));
    };

    const frame = () => {
      const link = Math.min(130, h * 0.13);
      const link2 = link * link;
      ctx.clearRect(0, 0, w, h);

      // move
      if (!reduced) {
        for (const p of dots) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
          if (d2 > 0 && d2 < 14400) { const d = Math.sqrt(d2); p.x += (dx / d) * 0.7; p.y += (dy / d) * 0.7; }
        }
      }

      // lines, batched by opacity bucket
      const paths: Path2D[] = Array.from({ length: BUCKETS }, () => new Path2D());
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        for (let j = i + 1; j < dots.length; j++) {
          const q = dots[j];
          const ex = p.x - q.x, ey = p.y - q.y, e = ex * ex + ey * ey;
          if (e < link2) {
            const b = Math.min(BUCKETS - 1, Math.floor((e / link2) * BUCKETS));
            paths[b].moveTo(p.x, p.y);
            paths[b].lineTo(q.x, q.y);
          }
        }
      }
      ctx.lineWidth = 1;
      for (let b = 0; b < BUCKETS; b++) {
        ctx.strokeStyle = `rgba(122,162,247,${0.2 * (1 - b / BUCKETS)})`;
        ctx.stroke(paths[b]);
      }

      // dots, two colors = two fills
      for (const violet of [false, true]) {
        ctx.fillStyle = violet ? "rgba(187,154,247,.75)" : "rgba(125,207,255,.75)";
        ctx.beginPath();
        for (const p of dots) if (p.violet === violet) { ctx.moveTo(p.x + 1.4, p.y); ctx.arc(p.x, p.y, 1.4, 0, Math.PI * 2); }
        ctx.fill();
      }
    };

    const loop = (t: number) => {
      raf = requestAnimationFrame(loop);
      if (document.hidden || t - last < 1000 / FPS) return;
      last = t;
      frame();
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    let resizeTimer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 150); };

    resize();
    if (reduced) frame(); else raf = requestAnimationFrame(loop);
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(resizeTimer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(122,162,247,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(122,162,247,.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -left-[20%] -top-[30%] h-[110vh] w-[110vh] rounded-full bg-[radial-gradient(closest-side,rgba(125,207,255,.16),transparent)]" />
      <div className="absolute -bottom-[30%] -right-[20%] h-[120vh] w-[120vh] rounded-full bg-[radial-gradient(closest-side,rgba(187,154,247,.18),transparent)]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,#080a12_85%)]" />
    </div>
  );
}
