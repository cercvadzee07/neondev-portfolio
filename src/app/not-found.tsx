import Link from "next/link";
import LogoMark from "@/components/ui/LogoMark";

export default function NotFound() {
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <LogoMark size={64} />
      <p className="mt-8 font-mono text-sm text-bad">error 404 — route not found</p>
      <h1 className="mt-3 text-4xl font-black text-fg-strong sm:text-6xl">
        Lost in the <span className="text-neon">grid</span>.
      </h1>
      <Link href="/" className="btn-primary mt-10">Back to home</Link>
    </section>
  );
}
