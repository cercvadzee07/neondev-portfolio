import Image from "next/image";
import Link from "next/link";
import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { projects, type Project } from "@/content/projects";
import { getDict, type Lang } from "@/content/i18n";
import type { DemoCard } from "@/content/types";

const accentRing = {
  cyan: "from-cyan-neon/40",
  violet: "from-violet-neon/40",
  indigo: "from-indigo-neon/40",
} as const;

type CardText = { subtitle: string; summary: string; live: string; caseStudy: string; showTags: boolean };

function ProjectCard({ p, text }: { p: Project; text: CardText }) {
  return (
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
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-fg-subtle">{text.subtitle}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-fg-strong">{p.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{text.summary}</p>
          {text.showTags && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {p.tags.slice(0, 4).map((t) => (
                <span key={t} className="chip text-[10px]">{t}</span>
              ))}
            </div>
          )}
          <div className="mt-auto flex gap-3 pt-6">
            <a href={p.live} target="_blank" rel="noopener noreferrer" aria-label={`Live demo of ${p.title} (opens in a new tab)`} className="btn-primary flex-1 px-4 py-2 text-sm">
              {text.live}
            </a>
            <Link href={`/en/projects/${p.slug}`} aria-label={`${p.title} case study`} className="btn-ghost flex-1 px-4 py-2 text-sm">
              {text.caseStudy}
            </Link>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

/** Placeholder card for a demo site that isn't built yet. */
function DemoProjectCard({ d, i, soon, cta }: { d: DemoCard; i: number; soon: string; cta: string }) {
  return (
    <TiltCard className="card3d group h-full">
      <div className="flex h-full flex-col p-4" style={{ transformStyle: "preserve-3d" }}>
        <div
          className={`relative aspect-[16/10] overflow-hidden rounded-xl bg-linear-to-br ${i % 2 ? "from-violet-neon/40" : "from-cyan-neon/40"} to-transparent p-px`}
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[11px] bg-ink-900 p-4">
            {/* faint grid + glow so the placeholder still looks like part of the site */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(125,207,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(125,207,255,.08)_1px,transparent_1px)] [background-size:22px_22px]"
            />
            <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-violet-neon/20 blur-3xl" />
            <span className="relative font-mono text-[10px] tracking-[0.3em] text-cyan-neon">{d.hud}</span>
            <div className="relative space-y-2" aria-hidden>
              <span className="block h-2.5 w-2/3 rounded-full bg-neon opacity-70" />
              <span className="block h-2 w-1/2 rounded-full bg-fg-subtle/30" />
              <span className="block h-2 w-1/3 rounded-full bg-fg-subtle/20" />
            </div>
            <span className="relative flex items-center gap-2 font-mono text-[10px] tracking-[0.25em] text-fg-subtle">
              <span className="h-1.5 w-1.5 animate-blink rounded-full bg-ok" aria-hidden />
              {soon}
            </span>
          </div>
        </div>
        <div className="flex flex-1 flex-col px-2 pb-2 pt-5" style={{ transform: "translateZ(25px)" }}>
          <p className="font-mono text-[11px] tracking-[0.3em] text-fg-subtle">{d.subtitle}</p>
          <h3 className="mt-2 text-2xl font-extrabold text-fg-strong">{d.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted">{d.summary}</p>
          <div className="mt-auto flex gap-3 pt-6">
            <a href="#contact" className="btn-primary flex-1 px-4 py-2 text-sm">{cta}</a>
            <span aria-disabled="true" className="btn-ghost flex-1 cursor-default px-4 py-2 text-sm opacity-60">{soon}</span>
          </div>
        </div>
      </div>
    </TiltCard>
  );
}

export default function Work({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const w = t.work;
  const k = t.showcase;

  const header = (
    <Reveal>
      <p className="eyebrow">{w.eyebrow}</p>
      <DecryptText as="h2" text={w.title} className="h2" />
      <p className="mt-4 max-w-2xl text-fg-muted">{w.intro}</p>
    </Reveal>
  );

  // demo sites + the online store first, the complex projects lower
  const featured = projects.find((p) => p.slug === k.featuredSlug);
  const advanced = projects.filter((p) => p.slug !== k.featuredSlug);
  const textFor = (p: Project): CardText => ({
    subtitle: k.projectText[p.slug]?.subtitle ?? p.subtitle,
    summary: k.projectText[p.slug]?.summary ?? p.summary,
    live: w.live,
    caseStudy: w.caseStudy,
    showTags: false,
  });

  return (
    <section id="work" className="section scroll-mt-16">
      {header}
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {k.demos.map((d, i) => (
          <Reveal key={d.title} delay={i * 120}>
            <DemoProjectCard d={d} i={i} soon={k.demoSoon} cta={k.demoCta} />
          </Reveal>
        ))}
        {featured && (
          <Reveal delay={k.demos.length * 120}>
            <ProjectCard p={featured} text={textFor(featured)} />
          </Reveal>
        )}
      </div>

      <Reveal className="mt-20">
        <h3 className="text-2xl font-extrabold text-fg-strong">{k.advancedTitle}</h3>
        <p className="mt-2 max-w-2xl text-sm text-fg-muted">{k.advancedIntro}</p>
      </Reveal>
      <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {advanced.map((p, i) => (
          <Reveal key={p.slug} delay={i * 120}>
            <ProjectCard p={p} text={textFor(p)} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
