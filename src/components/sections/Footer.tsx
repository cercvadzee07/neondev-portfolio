import LogoMark from "@/components/ui/LogoMark";
import { site } from "@/content/site";
import { getDict, type Lang } from "@/content/i18n";

export default function Footer({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <footer className="border-t border-cyan-neon/10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row">
        <div className="flex items-center gap-3">
          <LogoMark size={30} />
          <div>
            <p className="text-sm font-extrabold tracking-[0.35em] text-fg-strong">
              NEON<span className="text-neon">DEV</span>
            </p>
            <p className="font-mono text-[10px] tracking-[0.3em] text-fg-subtle">{site.tagline}</p>
          </div>
        </div>
        <ul className="flex flex-wrap justify-center gap-5 text-sm text-fg-muted">
          {t.nav.map((n) => (
            <li key={n.href}>
              <a href={`/${lang}${n.href}`} className="hover:text-fg-strong">{n.label}</a>
            </li>
          ))}
        </ul>
        <div className="text-center md:text-right">
          <p className="text-xs text-fg-muted">{t.footer.trust}</p>
          <p className="mt-1 font-mono text-[11px] text-fg-subtle">© {new Date().getFullYear()} NEONDEV · {t.footer.shortcut}</p>
        </div>
      </div>
    </footer>
  );
}
