import Link from "next/link";
import { Inter, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";
import "./globals.css";
import LogoMark from "@/components/ui/LogoMark";

const inter = Inter({ subsets: ["latin"], weight: ["400", "700", "900"], variable: "--font-inter-var", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-jb-var", display: "swap" });
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], variable: "--font-geo-var", display: "swap" });

/** Global 404 for URLs outside /en and /ka (Georgian, the main language). The root layout is a pass-through, so this page renders its own <html>. */
export default function GlobalNotFound() {
  return (
    <html lang="ka" className={`${inter.variable} ${mono.variable} ${georgian.variable}`}>
      <body>
        <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
          <LogoMark size={64} />
          <p className="mt-8 font-mono text-sm text-bad">შეცდომა 404 — გვერდი ვერ მოიძებნა</p>
          <h1 className="mt-3 text-4xl font-black text-fg-strong sm:text-6xl">
            ეს გვერდი <span className="text-neon">ქსელში</span> დაიკარგა.
          </h1>
          <Link href="/ka" className="btn-primary mt-10">მთავარზე დაბრუნება</Link>
        </section>
      </body>
    </html>
  );
}
