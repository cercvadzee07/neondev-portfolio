import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { services } from "@/content/offer";

/** Tiny animated visuals for each bento card. */
function Visual({ i }: { i: number }) {
  if (i === 0)
    return (
      <div className="mt-6 space-y-2 font-mono text-xs text-fg-subtle">
        <div><span className="text-ok">✓</span> auth · database · api</div>
        <div><span className="text-ok">✓</span> responsive ui</div>
        <div><span className="text-cyan-neon">→</span> deployed to production<span className="ml-1 inline-block h-3 w-1.5 animate-blink bg-ok align-middle" /></div>
      </div>
    );
  if (i === 1)
    return (
      <div className="mt-6 flex items-end gap-1.5">
        {[40, 65, 50, 85, 70, 100].map((h, k) => (
          <span key={k} className="w-full rounded-sm bg-neon opacity-70" style={{ height: h * 0.5 }} />
        ))}
      </div>
    );
  if (i === 2)
    return (
      <svg viewBox="0 0 200 50" className="mt-6 h-12 w-full" aria-hidden>
        <polyline
          points="0,40 20,32 40,36 60,20 80,26 100,12 120,18 140,8 160,16 180,6 200,10"
          fill="none"
          stroke="url(#sv)"
          strokeWidth="2.5"
          strokeLinecap="round"
          className="[stroke-dasharray:400] motion-safe:animate-[dash_3s_ease-in-out_infinite]"
        />
        <defs>
          <linearGradient id="sv" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0" stopColor="#7dcfff" />
            <stop offset="1" stopColor="#bb9af7" />
          </linearGradient>
        </defs>
      </svg>
    );
  return (
    <div className="mt-6 flex items-center gap-3">
      {[0, 1, 2, 3, 4].map((k) => (
        <span
          key={k}
          className="h-3 w-3 rounded-full bg-violet-neon/80 motion-safe:animate-[bob_1.6s_ease-in-out_infinite]"
          style={{ animationDelay: `${k * 0.15}s` }}
        />
      ))}
    </div>
  );
}

function CardBody({ s, i }: { s: (typeof services)[number]; i: number }) {
  return (
    <div className="flex h-full flex-col p-7">
      <span className="font-mono text-[11px] text-cyan-neon/80">{"// " + s.tag}</span>
      <h3 className="mt-3 text-xl font-bold text-fg-strong">{s.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.text}</p>
      <div className="mt-auto">
        <Visual i={i} />
      </div>
    </div>
  );
}

export default function Services() {
  return (
    <section id="services" className="section scroll-mt-16">
      <Reveal>
        <p className="eyebrow">02 // Services</p>
        <DecryptText as="h2" text="What I can build for you" className="h2" />
      </Reveal>
      <div className="mt-14 grid gap-5 md:grid-cols-3">
        {services.map((s, i) => (
          <Reveal key={s.title} delay={i * 100} className={s.size === "lg" ? "md:col-span-2" : ""}>
            {/* The dashboards card only zooms (no 3D tilt): its animated SVG line flickers inside a 3D-tilted card. */}
            {i === 2 ? (
              <div className="card3d h-full transition-transform duration-[250ms] ease-[cubic-bezier(.2,.8,.2,1)] motion-safe:hover:scale-[1.02]">
                <CardBody s={s} i={i} />
              </div>
            ) : (
              <TiltCard max={6} className="card3d h-full">
                <CardBody s={s} i={i} />
              </TiltCard>
            )}
          </Reveal>
        ))}
      </div>
      <style>{`
        @keyframes dash { 0% { stroke-dashoffset: 400; } 60%, 100% { stroke-dashoffset: 0; } }
        @keyframes bob { 50% { transform: translateY(-8px); opacity: .5; } }
      `}</style>
    </section>
  );
}
