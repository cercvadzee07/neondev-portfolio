export const services = [
  {
    title: "MVPs & SaaS prototypes",
    text: "From idea to a deployed product with auth, database and a clean UI, ready to show investors and first users.",
    tag: "next build",
    size: "lg",
  },
  {
    title: "Landing pages",
    text: "Premium design that loads fast and turns visitors into customers.",
    tag: "lighthouse 95+",
    size: "sm",
  },
  {
    title: "Real-time dashboards",
    text: "Data-heavy interfaces with live updates that stay smooth and readable.",
    tag: "websocket://live",
    size: "sm",
  },
  {
    title: "Interactive experiences",
    text: "Canvas, Web Audio and motion for products that need to feel different.",
    tag: "requestAnimationFrame",
    size: "lg",
  },
] as const;

export const packages = [
  {
    name: "Starter",
    price: 80,
    days: 3,
    revisions: 1,
    blurb: "A clean, fast one-page landing.",
    features: ["Up to 3 sections", "Fully responsive", "Deployed live on Vercel", "Full source code"],
    popular: false,
  },
  {
    name: "Standard",
    price: 150,
    days: 5,
    revisions: 2,
    blurb: "A complete business landing page.",
    features: ["Up to 6 sections", "Working contact form", "Smooth animations", "SEO setup", "Deployed live + source code"],
    popular: true,
  },
  {
    name: "Advanced",
    price: 250,
    days: 7,
    revisions: 3,
    blurb: "A premium page for launches and startups.",
    features: ["Up to 10 sections", "Custom animations & micro-interactions", "Contact form", "SEO + analytics", "Deployed live + source code"],
    popular: false,
  },
] as const;

export const processSteps = [
  { step: "01", title: "Discovery & structure", text: "I review your goals and send a page structure and content plan for approval." },
  { step: "02", title: "Design & development", text: "I build with Next.js and Tailwind CSS and share a live preview link as I go." },
  { step: "03", title: "Revisions", text: "You review the preview and I apply your feedback." },
  { step: "04", title: "Launch & handover", text: "I deploy to Vercel, connect your domain and hand over the full source code." },
] as const;

export const faq = [
  {
    q: "Do I need to provide the text and images?",
    a: "It helps, but it's not required. I can start with placeholder content and a suggested structure, then swap in your final text and images.",
  },
  {
    q: "Can you connect my own domain?",
    a: "Yes. I deploy on Vercel and connect your existing domain at no extra cost.",
  },
  {
    q: "How long does a project take?",
    a: "Landing pages take 3–7 days depending on the package. MVPs and web apps depend on scope; I'll give you a clear timeline before we start.",
  },
  {
    q: "What if I need more than a landing page?",
    a: "Send me a message. I build full web apps and MVPs and can prepare a custom quote for your project.",
  },
  {
    q: "How do payments work?",
    a: "Through Upwork, where your payment is protected until you approve the work, or by direct invoice if you prefer.",
  },
] as const;
