import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { getDict, type Lang } from "@/content/i18n";

/** Client reviews. Renders nothing until reviews are added to the content file (src/content/ka.ts → testimonials.items). */
export default function Testimonials({ lang }: { lang: Lang }) {
  const t = getDict(lang).testimonials;
  if (t.items.length === 0) return null;
  return (
    <section id="reviews" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">{t.eyebrow}</p>
        <DecryptText as="h2" text={t.title} className="h2" />
      </Reveal>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {t.items.map((r, i) => (
          <Reveal key={r.name + r.business} delay={i * 100}>
            <figure className="card3d spotlight flex h-full flex-col p-6">
              <span className="font-mono text-2xl text-cyan-neon" aria-hidden>“</span>
              <blockquote className="mt-2 flex-1 text-sm leading-relaxed text-fg">{r.text}</blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold text-fg-strong">{r.name}</p>
                <p className="font-mono text-[11px] text-fg-subtle">{r.business}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
