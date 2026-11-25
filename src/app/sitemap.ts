import type { MetadataRoute } from "next";
import { site } from "@/content/site";
import { projects } from "@/content/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const languages = { en: `${site.url}/en`, ka: `${site.url}/ka` };
  return [
    { url: `${site.url}/ka`, lastModified: now, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    { url: `${site.url}/en`, lastModified: now, changeFrequency: "monthly", priority: 1, alternates: { languages } },
    ...projects.map((p) => ({
      url: `${site.url}/en/projects/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
