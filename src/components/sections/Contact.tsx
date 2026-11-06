"use client";
import { useState, type FormEvent } from "react";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import Magnetic from "@/components/effects/Magnetic";
import { LiveClock } from "@/components/effects/Misc";
import { site } from "@/content/site";

type Status = "idle" | "sending" | "sent" | "error";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const field =
  "w-full rounded-xl border border-cyan-neon/15 bg-ink-850/80 px-4 py-3 text-fg-strong outline-none transition-colors placeholder:text-fg-subtle focus:border-cyan-neon/60 caret-ok";

export default function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || message.length < 10) {
      setError("Please add your name, a valid email and a short message (10+ characters).");
      setStatus("error");
      return;
    }
    setError("");

    // Without a Formspree ID, fall back to the visitor's email app.
    if (!FORMSPREE_ID) {
      const body = `Name: ${name}\nEmail: ${email}\nProject: ${data.get("type")}\nBudget: ${data.get("budget")}\n\n${message}`;
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent("New project inquiry — " + name)}&body=${encodeURIComponent(body)}`;
      setStatus("sent");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("sent");
    } catch {
      setError("Something went wrong. Please email me directly.");
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section scroll-mt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">07 // Contact</p>
          <DecryptText as="h2" text="Let's build something." className="h2" />
          <p className="mt-5 text-fg-muted">
            Tell me what you need and I&apos;ll get back to you with a clear plan, timeline and price.
          </p>
          <div className="mt-8 space-y-3">
            {[
              { label: "Hire me on Upwork", href: site.links.upwork },
              { label: "GitHub", href: site.links.github },
              { label: "LinkedIn", href: site.links.linkedin },
              { label: site.links.email, href: `mailto:${site.links.email}` },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="card3d spotlight flex items-center justify-between px-5 py-4 text-sm font-semibold text-fg-strong transition-colors hover:text-cyan-neon"
              >
                {l.label}
                <span className="text-cyan-neon">↗</span>
              </a>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-fg-subtle">
            <LiveClock />
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={onSubmit} noValidate className="panel space-y-4 p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">Name</span>
                <input name="name" autoComplete="name" className={field} placeholder="Your name" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">Email</span>
                <input name="email" type="email" autoComplete="email" className={field} placeholder="you@company.com" />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">Project type</span>
                <select name="type" className={field} defaultValue="Landing page">
                  <option>Landing page</option>
                  <option>MVP / web app</option>
                  <option>Dashboard</option>
                  <option>Something else</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">Budget</span>
                <select name="budget" className={field} defaultValue="$100 – $300">
                  <option>Under $100</option>
                  <option>$100 – $300</option>
                  <option>$300 – $1,000</option>
                  <option>$1,000+</option>
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-fg-muted">Message</span>
              <textarea name="message" rows={5} className={field} placeholder="What are you building? Any links or deadlines?" />
            </label>
            {status === "error" && <p role="alert" className="text-sm text-bad">{error}</p>}
            {status === "sent" && (
              <p role="status" className="text-sm text-ok">✓ Thanks! Your message is on its way. I&apos;ll get back to you soon.</p>
            )}
            <Magnetic strength={0.2}>
              <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
                {status === "sending" ? "Sending…" : "Send message →"}
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
