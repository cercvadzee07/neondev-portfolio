import Logo3D from "@/components/effects/Logo3D";
import Magnetic from "@/components/effects/Magnetic";
import DecryptText from "@/components/effects/DecryptText";
import { LiveClock, Marquee } from "@/components/effects/Misc";
import { site } from "@/content/site";

export default function Hero() {
  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="eyebrow flex items-center gap-2">
            <span className="h-2 w-2 animate-blink rounded-full bg-ok shadow-[0_0_10px_#9ece6a]" />
            Available for new projects
          </p>
          <h1 className="mt-6 text-5xl font-black leading-[1.02] tracking-tight text-fg-strong sm:text-6xl lg:text-[4.25rem]">
            Building Production‑Ready{" "}
            <DecryptText text="Web Apps & MVPs" className="text-neon animate-shift" />
          </h1>
          <p className="mt-6 max-w-xl text-lg text-fg-muted">{site.description}</p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Magnetic>
              <a href="#contact" className="btn-primary">Start a project →</a>
            </Magnetic>
            <Magnetic>
              <a href="#work" className="btn-ghost">View my work</a>
            </Magnetic>
          </div>
          <div className="mt-8 flex flex-wrap gap-2">
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
        <div className="relative h-px w-full bg-linear-to-r from-transparent via-cyan-neon/40 to-transparent">
          <span className="absolute -top-px left-0 h-[3px] w-40 animate-[beam_6s_cubic-bezier(.6,0,.4,1)_infinite] bg-linear-to-r from-transparent via-white to-transparent motion-reduce:hidden" />
        </div>
        <div className="mt-3 flex justify-between font-mono text-[11px] tracking-[0.25em] text-fg-subtle">
          <span>NEONDEV // SYS.ONLINE</span>
          <LiveClock className="hidden sm:inline" />
        </div>
      </div>

      <Marquee items={site.stack} />
      <style>{`@keyframes beam { 0% { transform: translateX(-10rem); } 70%, 100% { transform: translateX(min(72rem, 100vw)); } }`}</style>
    </section>
  );
}
