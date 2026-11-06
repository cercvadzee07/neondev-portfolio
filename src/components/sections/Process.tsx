import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { processSteps } from "@/content/offer";

export default function Process() {
  return (
    <section id="process" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">04 // Process</p>
        <DecryptText as="h2" text="From idea to launch" className="h2" />
      </Reveal>
      <div className="relative mt-14 grid gap-6 md:grid-cols-4">
        <div aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-linear-to-r from-cyan-neon/0 via-cyan-neon/40 to-violet-neon/0 md:block" />
        {processSteps.map((s, i) => (
          <Reveal key={s.step} delay={i * 120}>
            <div className="relative">
              <span className="neon-border relative z-10 flex h-12 w-12 items-center justify-center rounded-xl font-mono text-sm font-bold text-cyan-neon">
                {s.step}
              </span>
              <h3 className="mt-5 text-lg font-bold text-fg-strong">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
