export type Project = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  image: string;
  accent: "cyan" | "violet" | "indigo";
  tags: string[];
  live: string;
  source?: string;
  challenge: string;
  solution: string;
  features: string[];
  result: string;
};

export const projects: Project[] = [
  {
    slug: "neondev-pulse",
    title: "NEONDEV Pulse",
    subtitle: "Uptime Monitoring SaaS",
    summary:
      "A SaaS that checks websites every few minutes, emails you the moment one goes down, and publishes a live public status page.",
    image: "/projects/neondev-pulse.jpg",
    accent: "violet",
    tags: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS", "Vercel"],
    live: "https://neondev-pulse-ofuh.vercel.app/",
    source: "https://github.com/cercvadzee07/neondev-pulse",
    challenge:
      "Build a complete SaaS MVP end to end: accounts, background jobs, alerting and public pages. It had to be reliable enough to trust with real outages and secure enough that one customer can never see another's data.",
    solution:
      "A Next.js App Router app on Supabase (Postgres + Auth). A scheduled check engine pings every site, retries before declaring an outage, and opens or resolves incidents automatically. Row-Level Security isolates every user's data, and column-level grants keep monitored URLs private even on public status pages. Alerts go out through the Resend API.",
    features: [
      "Uptime checks every 5 minutes with retry",
      "Email alerts on downtime and recovery",
      "Response-time charts and incident timeline",
      "Public status pages with 90-day history",
      "Row-Level Security and private URLs",
    ],
    result:
      "A working, deployed SaaS that shows the full product path: database design, auth, background jobs, third-party APIs, security and a polished dashboard UI. Built from my day-to-day experience as a NOC analyst.",
  },
  {
    slug: "lvlup",
    title: "LVLUP",
    subtitle: "Full-Stack Gaming Store",
    summary:
      "An e-commerce store for gaming hardware with a PC Builder that checks part compatibility, a full buying flow and an admin panel.",
    image: "/projects/lvlup.jpg",
    accent: "cyan",
    tags: ["Next.js", "React", "Zustand", "Express", "PostgreSQL", "Vercel"],
    live: "https://lvlup-fawn.vercel.app/",
    challenge:
      "Build a production-ready online store with a smooth buying flow, a reliable backend, and a feature that helps customers build a working PC without technical knowledge.",
    solution:
      "A Next.js and React front end with Zustand for fast, predictable state, backed by an Express API and a PostgreSQL database for products, users and orders. Deployed on Vercel.",
    features: [
      "Filtered product catalog and live search",
      "PC Builder with part compatibility checks",
      "Cart, checkout and user accounts",
      "Admin panel for products and orders",
      "Fully responsive, bilingual interface",
    ],
    result:
      "A live, data-driven store that shows the full path from idea to deployed MVP: database, API, state management and polished UI.",
  },
  {
    slug: "strata-vault",
    title: "Strata Vault",
    subtitle: "Real-Time Crypto Dashboard",
    summary:
      "A trading terminal styled after Swiss private banking, with live WebSocket prices, a streaming candlestick chart and a Level-2 order book.",
    image: "/projects/strata-vault.jpg",
    accent: "violet",
    tags: ["React", "WebSockets", "Data Viz", "Vercel"],
    live: "https://strata-vault-otlus2s0t-cercvadzee.vercel.app/",
    challenge:
      "Design a data-heavy financial dashboard that stays fast and readable while prices update many times per second.",
    solution:
      "Live Binance WebSocket feeds drive a streaming candlestick chart and order book, with rendering kept efficient so the interface never stutters. A calm, premium visual language keeps dense data easy to scan.",
    features: [
      "Live price feeds via Binance WebSocket",
      "Streaming candlestick chart",
      "Level-2 order book with live depth",
      "OTC order panel",
      "Premium private-banking design",
    ],
    result:
      "A polished real-time dashboard that shows I can handle live data, performance-sensitive rendering and fintech-grade UX.",
  },
  {
    slug: "tokyo-os",
    title: "Tokyo OS",
    subtitle: "Browser-Based Desktop OS",
    summary:
      "A cyberpunk desktop operating system that runs entirely in the browser, with a real Linux terminal and a live synthesizer.",
    image: "/projects/tokyo-os.jpg",
    accent: "indigo",
    tags: ["JavaScript", "Canvas", "Web Audio API", "v86"],
    live: "https://cercvadzee07.github.io/Tokyo-OS/os.html",
    challenge:
      "Push the browser far beyond a normal website and build a rich, app-like environment without any framework.",
    solution:
      "A custom window manager, tabbed browser and system utilities in plain JavaScript, a synthesizer built on the Web Audio API, and a real Linux 6.8 kernel running on emulated x86 hardware through v86.",
    features: [
      "Real Linux 6.8 terminal (v86 emulation)",
      "Window manager and tabbed browser",
      "Live Web Audio synthesizer",
      "English and Georgian interface",
      "No frameworks, plain JavaScript",
    ],
    result:
      "A fast, highly interactive experience that shows deep browser engineering skills for complex, custom interfaces.",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
