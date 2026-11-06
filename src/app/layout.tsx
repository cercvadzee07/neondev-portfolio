import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/effects/Background";
import Cursor from "@/components/effects/Cursor";
import CommandPalette from "@/components/effects/CommandPalette";
import HashScroll from "@/components/effects/HashScroll";
import { ScrollProgress } from "@/components/effects/Misc";
import Navbar from "@/components/sections/Navbar";
import Footer from "@/components/sections/Footer";
import { site } from "@/content/site";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"], variable: "--font-inter-var", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-jb-var", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.role}`, template: `%s · ${site.name}` },
  description: site.description,
  keywords: ["Next.js developer", "React developer", "MVP developer", "full-stack developer", "landing page", "freelance", "Tbilisi"],
  authors: [{ name: site.person }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — Building Production-Ready Web Apps & MVPs`,
    description: site.description,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "NEONDEV — Building Production-Ready Web Apps & MVPs" }],
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.role}`, description: site.description, images: ["/og.png"] },
  icons: { icon: "/icon.svg", apple: "/apple-icon.png" },
};

export const viewport: Viewport = { themeColor: "#080a12", colorScheme: "dark" };

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": "Person", name: site.person, jobTitle: site.role, url: site.url, address: { "@type": "PostalAddress", addressLocality: "Tbilisi", addressCountry: "GE" }, sameAs: [site.links.github, site.links.linkedin, site.links.upwork] },
    { "@type": "ProfessionalService", name: site.name, url: site.url, areaServed: "Worldwide", priceRange: "$80 – $250+" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink-850 focus:px-4 focus:py-2">
          Skip to content
        </a>
        <Background />
        <ScrollProgress />
        <Navbar />
        <main id="main" tabIndex={-1} className="outline-none">{children}</main>
        <Footer />
        <CommandPalette />
        <Cursor />
        <HashScroll />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </body>
    </html>
  );
}
