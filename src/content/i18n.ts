import type { Dict, Lang } from "./types";
import { en } from "./en";
import { ka } from "./ka";

export type { Dict, Lang } from "./types";

export const langs = ["en", "ka"] as const satisfies readonly Lang[];
export const defaultLang: Lang = "ka";

export const isLang = (v: string | undefined | null): v is Lang => v === "en" || v === "ka";

const dicts: Record<Lang, Dict> = { en, ka };
export const getDict = (lang: Lang): Dict => dicts[lang];

/** Path of the same page in another language: "/ka/..." <-> "/en/...". Case studies only exist in English. */
export const switchPath = (pathname: string, to: Lang) => {
  const parts = pathname.split("/");
  if (isLang(parts[1])) parts[1] = to;
  else parts.splice(1, 0, to);
  const path = parts.join("/").replace(/\/$/, "") || `/${to}`;
  return to === "ka" && path.startsWith("/ka/projects/") ? "/ka#work" : path;
};
