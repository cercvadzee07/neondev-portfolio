import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { getProject, projects } from "@/content/projects";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) return {};
  return {
    title: `${p.title} — ${p.subtitle}`,
    description: p.summary,
    openGraph: { title: `${p.title} — ${p.subtitle}`, description: p.summary, images: [{ url: p.image }] },
  };
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();

  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];

  const blocks = [
    { n: "01", title: "Overview / Challenge", text: p.challenge },
    { n: "02", title: "Solution & Architecture", text: p.solution },
    { n: "04", title: "Result", text: p.result },
  ];

  return (
    <article className="mx-auto max-w-5xl px-4 pb-24 pt-32 sm:px-6">
      <Link href="/#work" className="font-mono text-xs uppercase tracking-[0.3em] text-fg-muted hover:text-cyan-neon">
        ← All projects
      </Link>

      <header className="mt-8">
        <p className="eyebrow">{p.subtitle}</p>
        <DecryptText as="h1" text={p.title} className="mt-3 block text-5xl font-black tracking-tight text-fg-strong sm:text-7xl" />
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">{p.summary}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href={p.live} target="_blank" rel="noopener noreferrer" className="btn-primary">Open live demo ↗</a>
          {p.source && (
            <a href={p.source} target="_blank" rel="noopener noreferrer" className="btn-ghost">Source code</a>
          )}
        </div>
      </header>

      <Reveal className="mt-14">
        <TiltCard max={5} className="card3d p-2">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl" style={{ transform: "translateZ(30px)" }}>
            <Image src={p.image} alt={`${p.title} screenshot`} fill priority sizes="(min-width:1024px) 960px, 100vw" className="object-cover" />
          </div>
        </TiltCard>
      </Reveal>

      <div className="mt-16 grid gap-10 md:grid-cols-[1fr_1.1fr]">
        <div className="space-y-10">
          {blocks.slice(0, 2).map((b) => (
            <Reveal key={b.n}>
              <p className="font-mono text-xs text-cyan-neon">{b.n} //</p>
              <h2 className="mt-2 text-2xl font-bold text-fg-strong">{b.title}</h2>
              <p className="mt-3 leading-relaxed text-fg-muted">{b.text}</p>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120}>
          <div className="panel p-7">
            <p className="font-mono text-xs text-cyan-neon">03 //</p>
            <h2 className="mt-2 text-2xl font-bold text-fg-strong">Key Features</h2>
            <ul className="mt-5 space-y-3">
              {p.features.map((f) => (
                <li key={f} className="flex gap-3 text-fg">
                  <span className="text-ok">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-14">
        <p className="font-mono text-xs text-cyan-neon">{blocks[2].n} //</p>
        <h2 className="mt-2 text-2xl font-bold text-fg-strong">{blocks[2].title}</h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-fg-muted">{blocks[2].text}</p>
      </Reveal>

      <div className="mt-20 flex flex-col items-start justify-between gap-6 border-t border-cyan-neon/10 pt-10 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Next project</p>
          <Link href={`/projects/${next.slug}`} className="mt-2 block text-3xl font-extrabold text-fg-strong hover:text-cyan-neon">
            {next.title} →
          </Link>
        </div>
        <Link href="/#contact" className="btn-primary">Start a similar project</Link>
      </div>
    </article>
  );
}
