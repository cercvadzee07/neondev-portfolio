export const site = {
  name: "NEONDEV",
  person: "Beqa Tsertsvadze",
  role: "Full-Stack & Rapid MVP Developer",
  tagline: "BUILD · SHIP · REPEAT",
  location: "Tbilisi, Georgia",
  timezone: "Asia/Tbilisi",
  url: "https://neondev-portfolio.vercel.app",
  description:
    "I turn ideas into fast, polished, production-ready web apps, often in days, not weeks. Next.js, React, TypeScript and Tailwind CSS.",
  stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "PostgreSQL", "Zustand", "Vercel", "Canvas", "Web Audio API"],
  links: {
    upwork: "https://www.upwork.com/freelancers/~01cae3191ce6fb81cc",
    github: "https://github.com/cercvadzee07",
    linkedin: "https://www.linkedin.com/in/beqa-tsertsvadze-a01b88383/",
    email: "neondev.code@gmail.com",
  },
} as const;

export const nav = [
  { label: "Work", href: "#work" },
  { label: "Services", href: "#services" },
  { label: "Pricing", href: "#pricing" },
  { label: "Process", href: "#process" },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
] as const;
