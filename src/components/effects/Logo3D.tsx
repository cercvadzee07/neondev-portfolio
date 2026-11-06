"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion, useRichMotion } from "@/hooks/useMotion";

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
  // unique per instance: the hero renders a mobile and a desktop copy, and a duplicate id would make
  // Firefox resolve the gradient inside the hidden copy and paint the letter transparent
  const gid = `nd-logo3d-g-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  const reduced = useReducedMotion();
  // iOS only: motion access needs a one-time tap + permission prompt
  const [needsTap, setNeedsTap] = useState(false);
  const enableRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = ref.current;
    const box = wrap.current;
    if (!el || !box) return;
    const rest = { x: -18, y: 10 };
    el.style.transform = `rotateX(${rest.y}deg) rotateY(${rest.x}deg)`;
    if (reduced) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!rich && !coarse) return;

    let raf = 0, running = false, visible = true;
    let tx = rest.x, ty = rest.y, cx = rest.x, cy = rest.y;
    const clamp = (v: number, m: number) => Math.max(-m, Math.min(m, v));

    const tick = () => {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      el.style.transform = `rotateX(${cy}deg) rotateY(${cx}deg)`;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) { running = false; return; }
      raf = requestAnimationFrame(tick);
    };
    const kick = () => { if (!running) { running = true; raf = requestAnimationFrame(tick); } };

    // desktop: follow the pointer
    const onMove = (e: PointerEvent) => {
      if (!visible || e.pointerType === "touch") return;
      tx = (e.clientX / window.innerWidth - 0.5) * 50;
      ty = -(e.clientY / window.innerHeight - 0.5) * 34;
      kick();
    };

    // phone: follow the device tilt (gyroscope), relative to how the phone was held at first
    let base: { b: number; g: number } | null = null;
    const onTilt = (e: DeviceOrientationEvent) => {
      if (!visible || e.beta == null || e.gamma == null) return;
      if (!base) base = { b: e.beta, g: e.gamma };
      tx = rest.x + clamp((e.gamma - base.g) * 1.1, 28);
      ty = rest.y - clamp((e.beta - base.b) * 0.9, 22);
      kick();
    };
    const startTilt = () => window.addEventListener("deviceorientation", onTilt);

    const cleanups: Array<() => void> = [];
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(box);
    if (rich) window.addEventListener("pointermove", onMove, { passive: true });

    if (coarse && typeof window.DeviceOrientationEvent !== "undefined") {
      // Listen right away: Android sends tilt events without asking.
      startTilt();
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<"granted" | "denied"> };
      if (typeof DOE.requestPermission === "function") {
        // iOS Safari only sends events after a permission prompt, which must come from a tap.
        // Show the hint until we either get a first event or the user grants access.
        let gotEvent = false;
        const firstEvent = (e: DeviceOrientationEvent) => { if (e.beta == null) return; gotEvent = true; setNeedsTap(false); window.removeEventListener("deviceorientation", firstEvent); };
        window.addEventListener("deviceorientation", firstEvent);
        const t = setTimeout(() => { if (!gotEvent) setNeedsTap(true); }, 600);
        enableRef.current = () => {
          DOE.requestPermission!()
            .then((state) => { if (state === "granted") setNeedsTap(false); })
            .catch(() => {});
        };
        cleanups.push(() => { clearTimeout(t); window.removeEventListener("deviceorientation", firstEvent); });
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onTilt);
      enableRef.current = null;
      cleanups.forEach((f) => f());
    };
  }, [rich, reduced]);

  return (
    <div
      ref={wrap}
      className="relative"
      style={{ width: size, height: size, perspective: 1400 }}
      onClick={() => enableRef.current?.()}
      aria-hidden
    >
      {needsTap && (
        <span className="pointer-events-none absolute left-[115%] top-1/2 w-max -translate-y-1/2 font-mono text-[11px] tracking-[0.2em] text-fg-muted">
          ← TAP TO TILT
        </span>
      )}
      {/* static soft glow + an opacity-only pulse layer */}
      <div className="absolute -inset-[30%] rounded-full bg-[radial-gradient(closest-side,rgba(150,170,255,.28),transparent)]" />
      <div className="absolute -inset-[12%] animate-breathe rounded-full bg-[radial-gradient(closest-side,rgba(125,207,255,.25),rgba(187,154,247,.12)_60%,transparent)]" />
      <div ref={ref} className="absolute inset-0 will-change-transform" style={{ transformStyle: "preserve-3d" }}>
        {EDGE.map((bg, i) => (
          <div key={i} className="absolute inset-0 rounded-[24%]" style={{ transform: `translateZ(${-(i + 1) * 3}px)`, background: bg }} />
        ))}
        {/*
          Front face as ONE flat layer: border, gloss, letter and dot are ordinary 2D children.
          Firefox can mis-sort sibling layers inside preserve-3d and hide the letter behind the face,
          so only the extrusion layers above use translateZ.
        */}
        <div className="absolute inset-0" style={{ transform: "translateZ(1px)" }}>
          <div className="neon-border absolute inset-0 rounded-[24%]" style={{ borderWidth: size * 0.03 }} />
          <div className="absolute inset-0 rounded-[24%] bg-[linear-gradient(160deg,rgba(255,255,255,.16),transparent_40%)]" />
          <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full" aria-hidden>
            <defs>
              <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#7dcfff" />
                <stop offset="50%" stopColor="#a9b1ff" />
                <stop offset="100%" stopColor="#bb9af7" />
              </linearGradient>
            </defs>
            <path d="M20 46V18h5.2l13.4 19.2V18H44v28h-5.2L25.4 26.8V46z" fill={`url(#${gid})`} />
          </svg>
          <span
            className="absolute rounded-full bg-ok animate-blink"
            style={{ right: "13%", top: "13%", width: "7%", height: "7%", boxShadow: "0 0 18px #9ece6a" }}
          />
        </div>
      </div>
    </div>
  );
}
