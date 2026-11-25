import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { Inter, JetBrains_Mono, Noto_Sans_Georgian } from "next/font/google";
import "../globals.css";
import Background from "@/components/effects/Background";
import Cursor from "@/components/effects/Cursor";
import CommandPalette from "@/components/effects/CommandPalette";
import HashScroll from "@/components/effects/HashScroll";
import { ScrollProgress } from "@/components/effects/Misc";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import WhatsAppFloat from "@/components/ui/WhatsAppFloat";
import { site } from "@/content/site";
import { getDict, isLang, langs, type Lang } from "@/content/i18n";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-inter-var", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jb-var", display: "swap" });
// Inter has no Georgian letters. This font is only attached on /ka, and not preloaded, so English pages never download it.
const georgian = Noto_Sans_Georgian({ subsets: ["georgian"], variable: "--font-geo-var", display: "swap", preload: false });

type Props = { children: ReactNode; params: Promise<{ lang: string }> };

export const dynamicParams = false;
export function generateStaticParams() {
  return langs.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = getDict(lang).meta;
  return {
    metadataBase: new URL(site.url),
    title: { default: t.title, template: `%s · ${site.name}` },
    description: t.description,
    keywords: t.keywords,
    authors: [{ name: site.person }],
    alternates: {
      canonical: `/${lang}`,
      languages: { ka: "/ka", en: "/en", "x-default": "/ka" },
    },
    openGraph: {
      type: "website",
      url: `${site.url}/${lang}`,
      siteName: site.name,
      locale: t.ogLocale,
      alternateLocale: lang === "ka" ? ["en_US"] : ["ka_GE"],
      title: t.ogTitle,
      description: t.shareDescription,
      images: [{ url: `/og-${lang}.png`, width: 1200, height: 630, alt: t.ogTitle }],
    },
    twitter: { card: "summary_large_image", title: t.title, description: t.shareDescription, images: [`/og-${lang}.png`] },
    icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
  };
}

export const viewport: Viewport = { themeColor: "#080a12", colorScheme: "dark" };

const jsonLd = (lang: Lang) => ({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: lang === "ka" ? "ბექა ცერცვაძე" : site.person,
      jobTitle: site.role,
      url: `${site.url}/${lang}`,
      address: { "@type": "PostalAddress", addressLocality: "Tbilisi", addressCountry: "GE" },
      sameAs: [site.links.github, site.links.linkedin, site.links.upwork],
    },
    { "@type": "ProfessionalService", name: site.name, url: `${site.url}/${lang}`, inLanguage: lang, areaServed: "Georgia", priceRange: "₾700 – ₾1,800" },
  ],
});

export default async function LangLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  const fonts = `${inter.variable} ${mono.variable}${lang === "ka" ? ` ${georgian.variable}` : ""}`;

  return (
    <html lang={lang} className={fonts}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-850 focus:px-4 focus:py-2">
          {t.skip}
        </a>
        <Background />
        <ScrollProgress />
        <Navbar lang={lang} />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer lang={lang} />
        <WhatsAppFloat lang={lang} />
        <CommandPalette lang={lang} />
        <Cursor />
        <HashScroll />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(lang)) }} />
      </body>
    </html>
  );
}
