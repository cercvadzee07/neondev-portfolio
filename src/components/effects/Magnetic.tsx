"use client";
import { useRef, type ReactNode, type PointerEvent as RPointerEvent } from "react";
import { useRichMotion } from "@/hooks/useMotion";

/** Wraps an element so it is gently pulled toward the pointer. */
export default function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const rich = useRichMotion();

  const onMove = (e: RPointerEvent<HTMLSpanElement>) => {
    if (!rich || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * strength;
    const y = (e.clientY - (r.top + r.height / 2)) * strength;
    ref.current.style.transform = `translate(${x}px, ${y}px)`;
  };
  const reset = () => { if (ref.current) ref.current.style.transform = "translate(0,0)"; };

  return (
    <span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="inline-block"
      style={{ transition: "transform .3s cubic-bezier(.2,.8,.2,1)" }}
    >
      {children}
    </span>
  );
}
