import TiltCard from "@/components/effects/TiltCard";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import { services } from "@/content/offer";

const LINE_MASK = `url("data:image/svg+xml,${encodeURIComponent(
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 50' preserveAspectRatio='none'>" +
    "<polyline points='2,40 20,32 40,36 60,20 80,26 100,12 120,18 140,8 160,16 180,6 198,10' " +
    "fill='none' stroke='black' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'/></svg>",
)}")`;

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
    // The line is a gradient <div> cut to shape with a CSS mask, revealed with clip-path.
    // (An inline SVG with an animated gradient stroke vanishes in Firefox/Chrome while the card is 3D-tilted.)
    return (
      <div
        aria-hidden
        className="mx-auto mt-6 aspect-[4/1] h-12 motion-safe:animate-[reveal_3s_ease-in-out_infinite]"
        style={{
          background: "linear-gradient(90deg, #7dcfff, #bb9af7)",
          WebkitMaskImage: LINE_MASK,
          maskImage: LINE_MASK,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
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
            <TiltCard max={6} className="card3d h-full">
              <div className="flex h-full flex-col p-7">
                <span className="font-mono text-[11px] text-cyan-neon/80">{"// " + s.tag}</span>
                <h3 className="mt-3 text-xl font-bold text-fg-strong">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-fg-muted">{s.text}</p>
                <div className="mt-auto">
                  <Visual i={i} />
                </div>
              </div>
            </TiltCard>
          </Reveal>
        ))}
      </div>
      <style>{`
        @keyframes reveal { 0% { clip-path: inset(0 100% 0 0); } 60%, 100% { clip-path: inset(0 0 0 0); } }
        @keyframes bob { 50% { transform: translateY(-8px); opacity: .5; } }
      `}</style>
    </section>
  );
}
