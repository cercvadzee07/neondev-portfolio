"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoMark from "@/components/ui/LogoMark";
import { getDict, isLang } from "@/content/i18n";

// not-found pages don't receive params, so the language comes from the URL.
export default function NotFound() {
  const seg = usePathname()?.split("/")[1];
  const lang = isLang(seg) ? seg : "ka";
  const t = getDict(lang).notFound;
  return (
    <section className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <LogoMark size={64} />
      <p className="mt-8 font-mono text-sm text-bad">{t.error}</p>
      <h1 className="mt-3 text-4xl font-black text-fg-strong sm:text-6xl">
        {t.before}<span className="text-neon">{t.word}</span>{t.after}
      </h1>
      <Link href={`/${lang}`} className="btn-primary mt-10">{t.back}</Link>
    </section>
  );
}
