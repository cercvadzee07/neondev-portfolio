import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import Terminal from "@/components/effects/Terminal";
import { getDict, type Lang } from "@/content/i18n";

export default function About({ lang }: { lang: Lang }) {
  const t = getDict(lang).about;
  return (
    <section id="about" className="section scroll-mt-16">
      <div className="grid items-start gap-12 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DecryptText as="h2" text={t.title} className="h2" />
          <div className="mt-6 space-y-4 text-fg-muted">
            {t.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="mt-8 grid grid-cols-1 gap-3 min-[380px]:grid-cols-2 sm:gap-4">
            {t.facts.map((f) => (
              <div key={f.k} className="card3d spotlight p-4">
                <dt className="font-mono text-[11px] uppercase tracking-[0.25em] text-fg-subtle">{f.k}</dt>
                <dd className="mt-1 text-sm font-semibold text-fg-strong">{f.v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 flex items-center gap-2 text-sm font-semibold text-fg-strong">
            <span className="h-2 w-2 rounded-full bg-ok shadow-[0_0_10px_#9ece6a]" aria-hidden />
            {t.trust}
          </p>
          <p className="mt-2 font-mono text-xs text-fg-subtle">{t.signature}</p>
        </Reveal>
        <Reveal delay={150}>
          <p className="eyebrow mb-4">{t.terminalLabel}</p>
          <Terminal />
        </Reveal>
      </div>
    </section>
  );
}
