import Image from "next/image";
import Link from "next/link";
import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { projects } from "@/content/projects";

const accentRing = {
  cyan: "from-cyan-neon/40",
  violet: "from-violet-neon/40",
  indigo: "from-indigo-neon/40",
} as const;

export default function Work() {
  return (
    <section id="work" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">01 // Selected work</p>
        <DecryptText as="h2" text="Things I've built" className="h2" />
        <p className="mt-4 max-w-2xl text-fg-muted">
          Real, deployed products. Open the live demo, read the case study, or inspect the code.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 120}>
            <TiltCard className="card3d group h-full">
              <div className="flex h-full flex-col p-4" style={{ transformStyle: "preserve-3d" }}>
                <div
                  className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-linear-to-br ${accentRing[p.accent]} to-transparent p-px`}
                  style={{ transform: "translateZ(40px)" }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[11px]">
                    <Image
                      src={p.image}
                      alt={`${p.title} screenshot`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
                <div className="flex flex-1 flex-col px-2 pb-2 pt-5" style={{ transform: "translateZ(25px)" }}>
                  <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">{p.subtitle}</p>
                  <h3 className="mt-2 text-2xl font-extrabold text-fg-strong">{p.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-fg-muted">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.slice(0, 4).map((t) => (
                      <span key={t} className="chip text-[10px]">{t}</span>
                    ))}
                  </div>
                  <div className="mt-auto flex gap-3 pt-6">
                    <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-primary flex-1 px-4 py-2 text-sm">
                      Live demo ↗
                    </a>
                    <Link href={`/projects/${p.slug}`} className="btn-ghost flex-1 px-4 py-2 text-sm">
                      Case study
                    </Link>
                  </div>
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
