import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import Terminal from "@/components/effects/Terminal";
import { site } from "@/content/site";

const facts = [
  { k: "Focus", v: "Web apps, MVPs & landing pages" },
  { k: "Stack", v: "Next.js · React · TypeScript" },
  { k: "Based in", v: "Tbilisi, Georgia (GMT+4)" },
  { k: "Mindset", v: "Reliability & security first" },
];

export default function About() {
  return (
    <section id="about" className="section scroll-mt-16">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">05 // About</p>
          <DecryptText as="h2" text="Hi, I'm Beqa." className="h2" />
          <div className="mt-6 space-y-4 text-fg-muted">
            <p>
              I&apos;m a full-stack developer who helps startups and founders turn ideas into fast, polished web apps,
              often in days, not weeks.
            </p>
            <p>
              I care about two things equally: clean, reliable code and interfaces that feel great to use. My background
              in network operations and security means I build with reliability and safety in mind from day one.
            </p>
            <p>
              Have a project in mind? Tell me about it and I&apos;ll reply with a clear plan, timeline and price.
            </p>
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4">
            {facts.map((f) => (
              <div key={f.k} className="card3d spotlight p-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">{f.k}</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-strong">{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 font-mono text-xs text-fg-subtle">
            {site.person} · {site.role}
          </p>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow mb-4">Try it — type a command</p>
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}
