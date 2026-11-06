"use client";
import { Fragment, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useMotion";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#01ABCDEFNXZ";
const NOWRAP = { whiteSpace: "nowrap" } as const;
const GLYPH = { display: "inline-block", width: 0 } as const; // zero-width: the glyph overflows over the hidden letter
const HIDDEN = { visibility: "hidden" } as const;

type Props = { text: string; className?: string; speed?: number; as?: "span" | "h1" | "h2" | "h3" };

/**
 * Text that "decrypts" from random glyphs when it scrolls into view.
 * Layout never changes while it animates: the real letters stay in place (hidden) and each glyph is painted
 * on top of its letter with zero width, so random glyph widths can't re-wrap the line or push content down.
 */
export default function DecryptText({ text, className, speed = 28, as: Tag = "span" }: Props) {
  // null = show the final text
  const [glyphs, setGlyphs] = useState<string[] | null>(null);
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) { setGlyphs(null); return; }
    const el = ref.current;
    if (!el) return;
    let frame = 0, timer: ReturnType<typeof setInterval> | undefined, done = false;
    const run = () => {
      if (done) return;
      done = true;
      timer = setInterval(() => {
        frame++;
        const reveal = Math.floor(frame / 2);
        if (reveal >= text.length) {
          if (timer) clearInterval(timer);
          setGlyphs(null);
          return;
        }
        setGlyphs(text.split("").map((ch, i) => (ch === " " || i < reveal ? "" : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])));
      }, speed);
    };
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && run()), { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); if (timer) clearInterval(timer); };
  }, [text, speed, reduced]);

  let i = 0;
  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span aria-hidden>
        {glyphs === null
          ? text
          : text.split(" ").map((word, w) => {
              const start = i;
              i += word.length + 1;
              return (
                <Fragment key={w}>
                  {w > 0 && " "}
                  {/* keep each word unbreakable so the line wraps exactly like the final text */}
                  <span style={NOWRAP}>
                    {word.split("").map((ch, k) => {
                      const g = glyphs[start + k];
                      return g ? (
                        <Fragment key={k}>
                          <span style={GLYPH}>{g}</span>
                          <span style={HIDDEN}>{ch}</span>
                        </Fragment>
                      ) : (
                        <Fragment key={k}>{ch}</Fragment>
                      );
                    })}
                  </span>
                </Fragment>
              );
            })}
      </span>
    </Tag>
  );
}
