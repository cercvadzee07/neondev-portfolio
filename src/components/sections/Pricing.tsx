import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { packages } from "@/content/offer";

export default function Pricing() {
  return (
    <section id="pricing" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">03 // Landing page packages</p>
        <DecryptText as="h2" text="Clear scope. Fixed price." className="h2" />
        <p className="mt-4 max-w-2xl text-fg-muted">
          Every package includes a live deployment on Vercel and the full source code. You own everything.
        </p>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
        {packages.map((p, i) => (
          <Reveal key={p.name} delay={i * 120}>
            <TiltCard
              max={8}
              className={`h-full rounded-2xl ${p.popular ? "neon-border shadow-glow" : "card3d"}`}
            >
              <div className="flex h-full flex-col p-7">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-fg-strong">{p.name}</h3>
                  {p.popular && (
                    <span className="rounded-full bg-neon px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink-950">
                      Most popular
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-fg-muted">{p.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${p.popular ? "text-cyan-neon" : "text-fg-strong"}`}>${p.price}</span>
                  <span className="text-sm text-fg-subtle">fixed</span>
                </div>
                <p className="mt-2 font-mono text-xs text-fg-subtle">
                  {p.days}-day delivery · {p.revisions} revision{p.revisions > 1 ? "s" : ""}
                </p>
                <ul className="mt-6 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2.5">
                      <span className="text-ok">✓</span>
                      <span className="text-fg">{f}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <a href="#contact" className={`${p.popular ? "btn-primary" : "btn-ghost"} w-full`}>
                    Choose {p.name}
                  </a>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-fg-muted">
        Need a full web app or MVP?{" "}
        <a href="#contact" className="text-cyan-neon underline-offset-4 hover:underline">Let&apos;s talk about a custom quote.</a>
      </p>
    </section>
  );
}
