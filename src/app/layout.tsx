import type { ReactNode } from "react";

/**
 * The real root layout (with <html lang>) lives in app/[lang]/layout.tsx.
 * This file only exists so the global not-found page has a layout; it just passes children through.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
