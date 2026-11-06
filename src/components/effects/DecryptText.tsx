"use client";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMotion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFNXZ";

type Props = { text: string; className?: string; speed?: number; as?: "span" | "h1" | "h2" | "h3" };

/** Text that "decrypts" from random glyphs when it scrolls into view. */
export default function DecryptText({ text, className, speed = 28, as: Tag = "span" }: Props) {
  const [out, setOut] = useState(text);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setOut(text); return; }
    const el = ref.current;
    if (!el) return;
    let frame = 0, timer: ReturnType<typeof setInterval> | undefined, done = false;
    const run = () => {
      if (done) return;
      done = true;
      timer = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame / 2);
        setOut(
          text
            .split("")
            .map((ch, i) => (ch === " " || i < reveal ? ch : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
            .join("")
        );
        if (reveal >= text.length && timer) clearInterval(timer);
      }, speed);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && run()), { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  }, [text, speed, reduced]);

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden>{out}</span>
    </Tag>
  );
}
