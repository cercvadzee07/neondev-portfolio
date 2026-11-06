"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { useReducedMotion, useRichMotion } from "@/hooks/useMotion";
import { isCoarsePointer, requestTiltPermission, subscribeTilt } from "@/lib/tilt";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt in degrees
  glare?: boolean;
  style?: CSSProperties;
};

/**
 * 3D tilt card: rotates toward the pointer, lifts on hover and shows a moving glare.
 * Children can use `style={{ transform: "translateZ(40px)" }}` to pop out in depth.
 * Also drives the `.spotlight` border glow through --mx / --my.
 * On phones the same tilt follows the gyroscope instead of the pointer (only while the card is on screen).
 */
export default function TiltCard({ children, className = "", max = 12, glare = true, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();
  const reduced = useReducedMotion();

  // phone: tilt with the device
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !isCoarsePointer()) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) {
        el.style.transform = "";
        if (glareRef.current) glareRef.current.style.opacity = "0";
      }
    });
    io.observe(el);
    const unsub = subscribeTilt(({ x, y }) => {
      if (!visible) return;
      const k = 0.8; // a little calmer than the mouse version
      el.style.transform = `perspective(1000px) rotateX(${-y * max * k}deg) rotateY(${x * max * k}deg)`;
      const gx = 50 + x * 40, gy = 50 + y * 40;
      el.style.setProperty("--mx", `${gx}%`);
      el.style.setProperty("--my", `${gy}%`);
      if (glareRef.current) {
        glareRef.current.style.opacity = String(Math.min(1, 0.35 + Math.hypot(x, y)));
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,.14), transparent 55%)`;
      }
    });
    return () => { io.disconnect(); unsub(); };
  }, [max, reduced]);

  // iOS: the first tap on any card can grant motion access (no-op elsewhere)
  const onTap = () => { if (isCoarsePointer()) void requestTiltPermission(); };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    if (!rich) return;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) scale3d(1.02,1.02,1.02)`;
    if (glareRef.current) {
      glareRef.current.style.opacity = "1";
      glareRef.current.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,.16), transparent 55%)`;
    }
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    if (glareRef.current) glareRef.current.style.opacity = "0";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onTap}
      className={`spotlight relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", transition: "transform .25s cubic-bezier(.2,.8,.2,1)", ...style }}
    >
      {children}
      {glare && (
        <div
          ref={glareRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
          style={{ transform: "translateZ(60px)" }}
        />
      )}
    </div>
  );
}
