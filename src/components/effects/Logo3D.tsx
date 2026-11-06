"use client";
import { useEffect, useRef } from "react";
import { useRichMotion } from "@/hooks/useMotion";

const LAYERS = 18;

/** Extruded 3D NEONDEV badge that follows the pointer. */
export default function Logo3D({ size = 260 }: { size?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0, tx = -18, ty = 10, cx = -18, cy = 10;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 50;
      ty = -(e.clientY / window.innerHeight - 0.5) * 34;
    };
    const tick = () => {
      cx += (tx - cx) * 0.06;
      cy += (ty - cy) * 0.06;
      el.style.transform = `rotateX(${cy}deg) rotateY(${cx}deg)`;
      raf = requestAnimationFrame(tick);
    };
    if (rich) {
      window.addEventListener("pointermove", onMove, { passive: true });
      raf = requestAnimationFrame(tick);
    } else {
      el.style.transform = "rotateX(10deg) rotateY(-18deg)";
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [rich]);

  return (
    <div className="relative" style={{ width: size, height: size, perspective: 1400 }} aria-hidden>
      <div
        className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(150,170,255,.35),transparent)] blur-xl"
      />
      <div ref={ref} className="absolute inset-0" style={{ transformStyle: "preserve-3d", transition: "transform .1s linear" }}>
        {Array.from({ length: LAYERS }, (_, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-[24%]"
            style={{
              transform: `translateZ(${-(i + 1) * 2}px)`,
              background: "linear-gradient(135deg,#5aa7d6,#8f6fd0)",
              filter: `brightness(${1 - i * 0.03})`,
            }}
          />
        ))}
        <div className="neon-border absolute inset-0 rounded-[24%] animate-breathe" style={{ borderWidth: size * 0.03 }} />
        <div className="absolute inset-0 rounded-[24%] bg-[linear-gradient(160deg,rgba(255,255,255,.16),transparent_40%)]" />
        <div
          className="text-neon absolute inset-0 flex items-center justify-center font-black leading-none animate-shift"
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
