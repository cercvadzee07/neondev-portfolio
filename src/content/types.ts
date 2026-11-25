export type Lang = "en" | "ka";

export type NavItem = { label: string; href: string };
export type ServiceItem = { title: string; text: string; tag?: string; size: "lg" | "sm" };
export type Pkg = {
  name: string;
  price: number;
  days: string;
  revisions: number;
  blurb: string;
  features: readonly string[];
  popular: boolean;
};
export type QA = { q: string; a: string };
export type Step = { step: string; title: string; text: string };
export type Fact = { k: string; v: string };
export type Testimonial = { name: string; business: string; text: string };
export type DemoCard = { title: string; subtitle: string; summary: string; hud: string };

export type Dict = {
  lang: Lang;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    shareDescription: string;
    ogLocale: string;
    keywords: string[];
  };
  skip: string;
  nav: readonly NavItem[];
  navCta: string;
  navSearch: string;
  menuLabel: string;
  hero: {
    eyebrow: string;
    lead: string;
    nowrap?: string;
    decrypt: string;
    subtitle: string;
    primary: string;
    secondary: string;
    showStack: boolean;
  };
  work: { eyebrow: string; title: string; intro: string; live: string; caseStudy: string };
  /** Work section layout: demo cards, featured store, then the "complex projects" group. */
  showcase: {
    demos: readonly DemoCard[];
    demoSoon: string;
    demoCta: string;
    featuredSlug: string;
    advancedTitle: string;
    advancedIntro: string;
    projectText: Record<string, { subtitle: string; summary: string }>;
  };
  services: { eyebrow: string; title: string; items: readonly ServiceItem[]; visual0: readonly [string, string, string] };
  pricing: {
    eyebrow: string;
    title: string;
    intro: string;
    currency: string;
    fixed: string;
    popular: string;
    packages: readonly Pkg[];
    meta: (p: Pkg) => string;
    choose: (name: string) => string;
    footPrefix: string;
    footLink: string;
    addon: { label: string; title: string; price: string; text: string };
  };
  process: { eyebrow: string; title: string; steps: readonly Step[] };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    facts: readonly Fact[];
    signature: string;
    terminalLabel: string;
    trust: string;
  };
  faq: { eyebrow: string; title: string; items: readonly QA[] };
  testimonials: { eyebrow: string; title: string; items: readonly Testimonial[] };
  contact: {
    eyebrow: string;
    title: string;
    intro: string;
    whatsappCta: string;
    whatsappText: string;
    labels: { name: string; contact: string; type: string; budget: string; message: string };
    placeholders: { name: string; contact: string; message: string };
    types: readonly string[];
    budgets: readonly string[];
    defaultBudget: string;
    errInvalid: string;
    errSend: string;
    sent: string;
    send: string;
    sending: string;
    subject: string;
  };
  footer: { shortcut: string; trust: string };
  palette: {
    goTo: (label: string) => string;
    openProject: (title: string) => string;
    upwork?: string;
    github: string;
    copyEmail: string;
    top: string;
    placeholder: string;
    empty: string;
    hints: { section: string; project: string; link: string; action: string };
  };
  notFound: { error: string; before: string; word: string; after: string; back: string };
};
