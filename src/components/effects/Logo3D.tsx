"use client";
import { useEffect, useRef } from "react";
import { useRichMotion } from "@/hooks/useMotion";

const LAYERS = 10;
// precomputed edge colors (no per-layer CSS filters)
const EDGE = Array.from({ length: LAYERS }, (_, i) => {
  const k = 1 - i * 0.05;
  return `linear-gradient(135deg, rgb(${Math.round(90 * k)},${Math.round(167 * k)},${Math.round(214 * k)}), rgb(${Math.round(143 * k)},${Math.round(111 * k)},${Math.round(208 * k)}))`;
});

/** Extruded 3D NEONDEV badge that follows the pointer. The animation loop only runs while it is moving and on screen. */
export default function Logo3D({ size = 260 }: { size?: number }) {
  const wrap = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  useEffect(() => {
    const el = ref.current;
    const box = wrap.current;
    if (!el || !box) return;
    const rest = { x: -18, y: 10 };
    el.style.transform = `rotateX(${rest.y}deg) rotateY(${rest.x}deg)`;
    if (!rich) return;

    let raf = 0, running = false, visible = true;
    let tx = rest.x, ty = rest.y, cx = rest.x, cy = rest.y;

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateX(${cy}deg) rotateY(${cx}deg)`;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      if (!visible) return;
      tx = (e.clientX / window.innerWidth - 0.5) * 50;
      ty = -(e.clientY / window.innerHeight - 0.5) * 34;
      if (!running) { running = true; raf = requestAnimationFrame(tick); }
    };
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(box);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [rich]);

  return (
    <div ref={wrap} className="relative" style={{ width: size, height: size, perspective: 1400 }} aria-hidden>
      {/* static soft glow + an opacity-only pulse layer */}
      <div className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(150,170,255,.28),transparent)]" />
      <div className="absolute -inset-[12%] animate-breathe rounded-full bg-[radial-gradient(closest-side,rgba(125,207,255,.25),rgba(187,154,247,.12)_60%,transparent)]" />
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        {EDGE.map((bg, i) => (
          <div key={i} className="absolute inset-0 rounded-[24%]" style={{ transform: `translateZ(${-(i + 1) * 3}px)`, background: bg }} />
        ))}
        <div className="neon-border absolute inset-0 rounded-[24%]" style={{ borderWidth: size * 0.03 }} />
        <div className="absolute inset-0 rounded-[24%] bg-[linear-gradient(160deg,rgba(255,255,255,.16),transparent_40%)]" />
        <div
          className="text-neon absolute inset-0 flex items-center justify-center font-black leading-none"
          style={{ fontSize: size * 0.64, letterSpacing: -size * 0.02, paddingBottom: size * 0.03, transform: "translateZ(8px)" }}
        >
          N
        </div>
        <span
          className="absolute rounded-full bg-ok animate-blink"
          style={{ right: "13%", top: "13%", width: "7%", height: "7%", boxShadow: "0 0 18px #9ece6a", transform: "translateZ(10px)" }}
        />
      </div>
    </div>
  );
}
