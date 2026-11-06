import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { faq } from "@/content/offer";

export default function FAQ() {
  return (
    <section id="faq" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">06 // FAQ</p>
        <DecryptText as="h2" text="Good questions" className="h2" />
      </Reveal>
      <div className="mt-12 space-y-3">
        {faq.map((f, i) => (
          <Reveal key={f.q} delay={i * 60}>
            <details className="card3d group p-0 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-fg-strong">
                {f.q}
                <span className="font-mono text-xl text-cyan-neon transition-transform duration-300 group-open:rotate-45">+</span>
              </summary>
              <p className="px-6 pb-6 text-sm leading-relaxed text-fg-muted">{f.a}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
