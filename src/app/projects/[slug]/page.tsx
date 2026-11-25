import { permanentRedirect } from "next/navigation";

// Old URL (/projects/<slug>) — case studies now live at /en/projects/<slug>. middleware.ts redirects first; this is a fallback.
export default async function OldProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  permanentRedirect(`/en/projects/${slug}`);
}
