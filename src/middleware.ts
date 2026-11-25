import { NextResponse, type NextRequest } from "next/server";

const LANGS = ["en", "ka"] as const;
type Lang = (typeof LANGS)[number];
const isLang = (v?: string): v is Lang => v === "en" || v === "ka";
const COOKIE = "lang";

/** Georgian is the main language of the site. */
const DEFAULT: Lang = "ka";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const seg = pathname.split("/")[1];

  if (isLang(seg)) {
    // case studies are English-only for now
    if (seg === "ka" && pathname.startsWith("/ka/projects/")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/ka/, "/en");
      return NextResponse.redirect(url, 307);
    }
    const res = NextResponse.next();
    // remember the last language the visitor chose, so "/" sends them back to it
    if (req.cookies.get(COOKIE)?.value !== seg) {
      res.cookies.set(COOKIE, seg, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return res;
  }

  const url = req.nextUrl.clone();
  if (pathname === "/") {
    const saved = req.cookies.get(COOKIE)?.value;
    // the language the visitor picked last time, otherwise Georgian
    url.pathname = `/${isLang(saved) ? saved : DEFAULT}`;
    return NextResponse.redirect(url, 307);
  }

  // old case-study links (/projects/lvlup) -> English case study; anything else -> Georgian
  url.pathname = `/${pathname.startsWith("/projects/") ? "en" : DEFAULT}${pathname}`;
  return NextResponse.redirect(url, 308);
}

export const config = {
  // skip Next internals and any file with an extension (icon.svg, og.png, sitemap.xml, robots.txt…)
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
