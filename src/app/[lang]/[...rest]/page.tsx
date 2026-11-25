import { notFound } from "next/navigation";

// Any unknown path under /en or /ka shows the localized 404 page.
export default function CatchAll() {
  notFound();
}
