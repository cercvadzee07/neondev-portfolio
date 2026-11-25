import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { getDict, type Lang } from "@/content/i18n";

export default function Pricing({ lang }: { lang: Lang }) {
  const t = getDict(lang).pricing;
  return (
    <section id="pricing" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <DecryptText as="h2" text={t.title} className="h2" />
        <p className="mt-4 max-w-2xl text-fg-muted">{t.intro}</p>
      </Reveal>

      <div className="mt-14 grid items-stretch gap-6 md:grid-cols-3">
        {t.packages.map((p, i) => (
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
                      {t.popular}
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-fg-muted">{p.blurb}</p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className={`text-5xl font-black ${p.popular ? "text-cyan-neon" : "text-fg-strong"}`}>{t.currency}{p.price.toLocaleString("en-US")}</span>
                  <span className="text-sm text-fg-subtle">{t.fixed}</span>
                </div>
                <p className="mt-2 font-mono text-xs text-fg-subtle">
                  {t.meta(p)}
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
                    {t.choose(p.name)}
                  </a>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-8">
        <div className="card3d spotlight flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-mono text-[11px] tracking-[0.2em] text-fg-subtle">+ {t.addon.label}</p>
            <h3 className="mt-1 text-lg font-bold text-fg-strong">{t.addon.title}</h3>
            <p className="mt-1 text-sm text-fg-muted">{t.addon.text}</p>
          </div>
          <p className="shrink-0 text-2xl font-black text-fg-strong">{t.addon.price}</p>
        </div>
      </Reveal>
      <p className="mt-8 text-center text-sm text-fg-muted">
        {t.footPrefix}{" "}
        <a href="#contact" className="text-cyan-neon underline-offset-4 hover:underline">{t.footLink}</a>
      </p>
    </section>
  );
}
