"use client";

/**
 * Shared phone-tilt (gyroscope) source.
 * One `deviceorientation` listener for the whole page; subscribers get a normalized tilt
 * { x, y } in -1..1, relative to how the phone was held when the first reading arrived.
 * Updates are coalesced to one per animation frame.
 */
export type Tilt = { x: number; y: number };
type Sub = (t: Tilt) => void;

const subs = new Set<Sub>();
let attached = false;
let base: { b: number; g: number } | null = null;
let current: Tilt = { x: 0, y: 0 };
let raf = 0;

const clamp = (v: number) => Math.max(-1, Math.min(1, v));

function onOrientation(e: DeviceOrientationEvent) {
  if (e.beta == null || e.gamma == null) return;
  if (!base) base = { b: e.beta, g: e.gamma };
  current = { x: clamp((e.gamma - base.g) / 25), y: clamp((e.beta - base.b) / 25) };
  if (!raf) {
    raf = requestAnimationFrame(() => {
      raf = 0;
      subs.forEach((f) => f(current));
    });
  }
}

export function subscribeTilt(fn: Sub): () => void {
  subs.add(fn);
  if (!attached && typeof window !== "undefined") {
    window.addEventListener("deviceorientation", onOrientation);
    attached = true;
  }
  return () => {
    subs.delete(fn);
    if (!subs.size && attached) {
      window.removeEventListener("deviceorientation", onOrientation);
      attached = false;
    }
  };
}

/** iOS needs a permission prompt triggered by a tap; other platforms resolve immediately. */
export async function requestTiltPermission(): Promise<boolean> {
  const DOE = (typeof window !== "undefined" ? window.DeviceOrientationEvent : undefined) as unknown as
    | { requestPermission?: () => Promise<"granted" | "denied"> }
    | undefined;
  if (!DOE || typeof DOE.requestPermission !== "function") return true;
  try {
    return (await DOE.requestPermission()) === "granted";
  } catch {
    return false;
  }
}

/** True on touch-first devices where tilt should replace hover effects. */
export const isCoarsePointer = () =>
  typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
