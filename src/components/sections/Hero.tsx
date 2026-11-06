import Logo3D from "@/components/effects/Logo3D";
import Magnetic from "@/components/effects/Magnetic";
import DecryptText from "@/components/effects/DecryptText";
import { LiveClock, Marquee } from "@/components/effects/Misc";
import { site } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-20 sm:pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div className="min-w-0">
          <div className="mb-8 sm:hidden">
            <Logo3D size={96} />
          </div>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-2 w-2 animate-blink rounded-full bg-ok shadow-[0_0_10px_#9ece6a]" />
            Available for new projects
          </p>
          <h1 className="mt-5 text-[clamp(2.1rem,9.5vw,4.25rem)] font-black leading-[1.04] tracking-tight text-fg-strong sm:mt-6">
            Building <span className="sm:whitespace-nowrap">Production-Ready</span>{" "}
            <DecryptText text="Web Apps & MVPs" className="text-neon" />
          </h1>
          <p className="mt-5 max-w-xl text-base text-fg-muted sm:mt-6 sm:text-lg">{site.description}</p>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[420px]:flex min-[420px]:flex-wrap min-[420px]:items-center sm:mt-9 sm:gap-4">
            <Magnetic>
              <a href="#contact" className="btn-primary w-full min-[420px]:w-auto">Start a project →</a>
            </Magnetic>
            <Magnetic>
              <a href="#work" className="btn-ghost w-full min-[420px]:w-auto">View my work</a>
            </Magnetic>
          </div>
          <div className="mt-7 flex flex-wrap gap-2 sm:mt-8">
            {site.stack.slice(0, 5).map((s) => (
              <span key={s} className="chip">{s}</span>
            ))}
          </div>
        </div>

        <div className="relative mx-auto hidden aspect-square w-full max-w-[420px] items-center justify-center sm:flex">
          <Logo3D size={260} />
        </div>
      </div>

      <div className="mx-auto mt-16 w-full max-w-6xl px-4 sm:px-6">
        {/* horizon line with a soft light that glides across and fades at both ends (clipped, so it never widens the page) */}
        <div className="relative h-[3px] w-full overflow-hidden" aria-hidden>
          <div className="absolute inset-x-0 top-px h-px bg-linear-to-r from-transparent via-cyan-neon/40 to-transparent" />
          <span className="absolute inset-y-0 left-0 w-1/4 bg-linear-to-r from-transparent via-white/80 to-transparent opacity-0 motion-safe:animate-[beam_9s_ease-in-out_infinite]" />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[11px] tracking-[0.25em] text-fg-subtle">
          <span>NEONDEV // SYS.ONLINE</span>
          <LiveClock className="hidden sm:inline" />
        </div>
      </div>

      <Marquee items={site.stack} />
      <style>{`@keyframes beam { 0% { transform: translateX(-100%); opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } 100% { transform: translateX(400%); opacity: 0; } }`}</style>
    </section>
  );
}
