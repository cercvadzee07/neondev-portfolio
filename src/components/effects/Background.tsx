"use client";
import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useMotion";

type Dot = { x: number; y: number; vx: number; vy: number; r: number; violet: boolean };

/** Fixed neon scene: drifting grid, floating glows and a canvas particle network. */
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, raf = 0, last = 0;
    let dots: Dot[] = [];
    const mouse = { x: -1e4, y: -1e4 };
    const FPS = 40;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: Math.random() * 1.6 + 0.5,
        violet: Math.random() < 0.5,
      }));
    };

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (document.hidden || t - last < 1000 / FPS) return;
      last = t;
      const link = Math.min(140, h * 0.14);
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < dots.length; i++) {
        const p = dots[i];
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0) p.x = w; else if (p.x > w) p.x = 0;
          if (p.y < 0) p.y = h; else if (p.y > h) p.y = 0;
          const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
          if (d > 0 && d < 120) { p.x += (dx / d) * 0.8; p.y += (dy / d) * 0.8; }
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.violet ? "rgba(187,154,247,.7)" : "rgba(125,207,255,.7)";
        ctx.fill();
        for (let j = i + 1; j < dots.length; j++) {
          const q = dots[j];
          const ex = p.x - q.x, ey = p.y - q.y, e = ex * ex + ey * ey;
          if (e < link * link) {
            ctx.strokeStyle = `rgba(122,162,247,${0.18 * (1 - Math.sqrt(e) / link)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
    };

    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-ink-950">
      <div
        className="absolute -inset-[10%] opacity-100 motion-safe:animate-[drift_40s_linear_infinite]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(122,162,247,.07) 1px, transparent 1px), linear-gradient(90deg, rgba(122,162,247,.07) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute -left-[20%] -top-[30%] h-[110vh] w-[110vh] rounded-full bg-[radial-gradient(closest-side,rgba(125,207,255,.16),transparent)] motion-safe:animate-[float1_18s_ease-in-out_infinite]" />
      <div className="absolute -bottom-[30%] -right-[20%] h-[120vh] w-[120vh] rounded-full bg-[radial-gradient(closest-side,rgba(187,154,247,.18),transparent)] motion-safe:animate-[float2_22s_ease-in-out_infinite]" />
      <canvas ref={ref} className="absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,#080a12_85%)]" />
      <style>{`
        @keyframes drift { to { transform: translate(48px, 48px); } }
        @keyframes float1 { 50% { transform: translate(8vh, 6vh); } }
        @keyframes float2 { 50% { transform: translate(-8vh, -5vh); } }
      `}</style>
    </div>
  );
}
