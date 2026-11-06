"use client";
import { useEffect, useRef, type ReactNode, type CSSProperties, type PointerEvent as RPointerEvent } from "react";
import { useReducedMotion, useRichMotion } from "@/hooks/useMotion";
import { isCoarsePointer, requestTiltPermission, subscribeTilt } from "@/lib/tilt";

type Props = {
  children: ReactNode;
  className?: string;
  max?: number; // max tilt in degrees
  style?: CSSProperties;
};

/**
 * 3D tilt card: rotates toward the pointer and lifts on hover (no moving light / glare).
 * Children can use `style={{ transform: "translateZ(40px)" }}` to pop out in depth.
 * On phones the same tilt follows the gyroscope instead of the pointer (only while the card is on screen).
 */
export default function TiltCard({ children, className = "", max = 12, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const rich = useRichMotion();
  const reduced = useReducedMotion();

  // phone: tilt with the device
  useEffect(() => {
    const el = ref.current;
    if (!el || reduced || !isCoarsePointer()) return;
    let visible = false;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (!visible) el.style.transform = "";
    });
    io.observe(el);
    const unsub = subscribeTilt(({ x, y }) => {
      if (!visible) return;
      const k = 0.8; // a little calmer than the mouse version
      el.style.transform = `perspective(1000px) rotateX(${-y * max * k}deg) rotateY(${x * max * k}deg)`;
    });
    return () => { io.disconnect(); unsub(); };
  }, [max, reduced]);

  // iOS: the first tap on any card can grant motion access (no-op elsewhere)
  const onTap = () => { if (isCoarsePointer()) void requestTiltPermission(); };

  const onMove = (e: RPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el || !rich) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.transform = `perspective(1000px) rotateX(${(0.5 - py) * max}deg) rotateY(${(px - 0.5) * max}deg) scale3d(1.02,1.02,1.02)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onClick={onTap}
      className={`relative will-change-transform ${className}`}
      style={{ transformStyle: "preserve-3d", transition: "transform .25s cubic-bezier(.2,.8,.2,1)", ...style }}
    >
      {children}
    </div>
  );
}
