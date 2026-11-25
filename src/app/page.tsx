import { redirect } from "next/navigation";

// "/" is normally handled by src/middleware.ts (Georgian by default, or the visitor's last choice). This is a fallback.
export default function RootPage() {
  redirect("/ka");
}
