"use client";
import { useState, type CSSProperties, type FormEvent } from "react";
import Reveal from "@/components/effects/Reveal";
import DecryptText from "@/components/effects/DecryptText";
import Magnetic from "@/components/effects/Magnetic";
import { LiveClock } from "@/components/effects/Misc";
import { site } from "@/content/site";
import { getDict, type Lang } from "@/content/i18n";
import { FaEnvelope, FaInstagram, FaLinkedinIn, FaPhone, FaViber, FaWhatsapp } from "react-icons/fa6";

type Status = "idle" | "sending" | "sent" | "mailto" | "error";
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

const field =
  "w-full rounded-xl border border-cyan-neon/15 bg-ink-850/80 px-4 py-3 text-base text-fg-strong outline-none transition-colors placeholder:text-fg-subtle focus:border-cyan-neon/60 caret-ok";

const isEmail = (v: string) => /^\S+@\S+\.\S+$/.test(v);
const isPhone = (v: string) => v.replace(/[^\d]/g, "").length >= 9;

export default function Contact({ lang }: { lang: Lang }) {
  const t = getDict(lang).contact;
  const ka = lang === "ka";
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const message = String(data.get("message") || "").trim();
    if (String(data.get("_gotcha") || "")) return; // bot
    // one "phone or email" field: send it to Formspree as "email" or "phone"
    data.delete("email");
    if (isEmail(email)) data.set("email", email);
    else data.set("phone", email);
    const contactOk = isEmail(email) || isPhone(email);
    if (!name || !contactOk || message.length < 10) {
      setError(t.errInvalid);
      setStatus("error");
      return;
    }
    setError("");

    // Without a Formspree ID, fall back to the visitor's email app.
    if (!FORMSPREE_ID) {
      const body = `Name: ${name}\nContact: ${email}\nProject: ${data.get("type")}\nBudget: ${data.get("budget")}\n\n${message}`;
      window.location.href = `mailto:${site.links.email}?subject=${encodeURIComponent(t.subject + name)}&body=${encodeURIComponent(body)}`;
      setStatus("mailto");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      if (!res.ok) throw new Error();
      form.reset();
      setStatus("sent");
    } catch {
      setError(t.errSend);
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="section scroll-mt-16">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <Reveal>
          <p className="eyebrow">{t.eyebrow}</p>
          <DecryptText as="h2" text={t.title} className="h2" />
          <p className="mt-5 text-fg-muted">{t.intro}</p>
          <Channels cta={t.whatsappCta} text={t.whatsappText} />
          <p className="mt-6 font-mono text-[11px] tracking-[0.2em] text-fg-subtle">
            <LiveClock />
          </p>
        </Reveal>

        <Reveal delay={150}>
          <form onSubmit={onSubmit} noValidate className="panel space-y-4 p-6 sm:p-8">
            {/* honeypot: hidden from people, bots fill it and Formspree drops the submission */}
            <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" />
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{t.labels.name}</span>
                <input name="name" autoComplete="name" className={field} placeholder={t.placeholders.name} />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{t.labels.contact}</span>
                <input
                  name="email"
                  type="text"
                  autoComplete="tel"
                  className={field}
                  placeholder={t.placeholders.contact}
                />
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{t.labels.type}</span>
                <select name="type" className={field} defaultValue={t.types[0]}>
                  {t.types.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{t.labels.budget}</span>
                <select name="budget" className={field} defaultValue={t.defaultBudget}>
                  {t.budgets.map((o) => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-fg-muted">{t.labels.message}</span>
              <textarea name="message" rows={5} className={field} placeholder={t.placeholders.message} />
            </label>
            {status === "error" && <p role="alert" className="text-sm text-bad">{error}</p>}
            {status === "mailto" && (
              <p role="status" className="text-sm text-warn">
                {ka ? (
                  <>
                    ელფოსტის აპში მზა შეტყობინება გაიხსნება — დააჭირე <strong>Send</strong>-ს. თუ აპი არ გაიხსნა, მომწერე პირდაპირ:{" "}
                    <a className="text-cyan-neon underline" href={`mailto:${site.links.email}`}>{site.links.email}</a>.
                  </>
                ) : (
                  <>
                    Your email app should open with the message ready — press <strong>Send</strong> there. If nothing opened, email me
                    directly at <a className="text-cyan-neon underline" href={`mailto:${site.links.email}`}>{site.links.email}</a>.
                  </>
                )}
              </p>
            )}
            {status === "sent" && (
              <p role="status" className="text-sm text-ok">{t.sent}</p>
            )}
            <Magnetic strength={0.2}>
              <button type="submit" disabled={status === "sending"} className="btn-primary w-full sm:w-auto">
                {status === "sending" ? t.sending : t.send}
              </button>
            </Magnetic>
          </form>
        </Reveal>
      </div>
    </section>
  );
}

/** Each app's own brand colour — used for its icon and its glow. */
const BRAND = {
  whatsapp: "#25D366",
  viber: "#7360F2",
  linkedin: "#0A66C2",
  instagram: "#E1306C",
  phone: "#34C759",
  email: "#EA4335",
} as const;

/** Contact channels: one big WhatsApp button, then the rest. Each one glows in its app's colour. */
function Channels({ cta, text }: { cta: string; text: string }) {
  const l = site.local;
  const rest = [
    { label: "Viber", href: l.viber, Icon: FaViber, color: BRAND.viber },
    { label: "LinkedIn", href: site.links.linkedin, Icon: FaLinkedinIn, color: BRAND.linkedin },
    { label: "Instagram", href: l.instagram, Icon: FaInstagram, color: BRAND.instagram },
    { label: l.phone, href: l.phoneHref, Icon: FaPhone, color: BRAND.phone },
  ];
  const external = (href: string) => href.startsWith("http");
  // --brand drives the border, icon and glow colour of each card
  const brand = (color: string) => ({ "--brand": color }) as CSSProperties;
  const card =
    "group flex items-center justify-between gap-3 rounded-2xl border border-cyan-neon/15 bg-ink-850/85 text-sm font-semibold text-fg-strong " +
    "shadow-[0_0_0_transparent] transition-[border-color,box-shadow] duration-300 ease-out " +
    "hover:border-[color:var(--brand)] hover:shadow-[0_0_22px_-4px_var(--brand)] " +
    "focus-visible:border-[color:var(--brand)] focus-visible:shadow-[0_0_22px_-4px_var(--brand)]";
  const icon = "h-5 w-5 shrink-0 text-[color:var(--brand)] transition-[filter] duration-300 group-hover:drop-shadow-[0_0_8px_var(--brand)]";

  return (
    <div className="mt-8 space-y-3">
      {/* buttons follow the cursor a little, like the hero buttons */}
      <Magnetic strength={0.12} className="block">
      <a
        href={`${l.whatsapp}?text=${encodeURIComponent(text)}`}
        target="_blank"
        rel="noopener noreferrer"
        style={brand(BRAND.whatsapp)}
        className="flex w-full items-center justify-center gap-3 rounded-xl bg-[color:var(--brand)] px-6 py-4 text-base font-bold text-ink-950 shadow-[0_0_24px_-6px_var(--brand)] transition-[filter,box-shadow] duration-300 ease-out hover:brightness-110 hover:shadow-[0_0_40px_-2px_var(--brand)]"
      >
        <FaWhatsapp aria-hidden className="h-6 w-6" />
        {cta}
      </a>
      </Magnetic>
      <div className="grid grid-cols-2 gap-3">
        {rest.map((c) => (
          <Magnetic key={c.label} strength={0.25} className="block">
          <a
            href={c.href}
            target={external(c.href) ? "_blank" : undefined}
            rel="noopener noreferrer"
            style={brand(c.color)}
            className={`${card} px-4 py-3.5`}
          >
            <span className="min-w-0 truncate">{c.label}</span>
            <c.Icon aria-hidden className={icon} />
          </a>
          </Magnetic>
        ))}
      </div>
      <Magnetic strength={0.15} className="block">
        <a href={`mailto:${site.links.email}`} style={brand(BRAND.email)} className={`${card} px-5 py-4`}>
          <span className="min-w-0 truncate">{site.links.email}</span>
          <FaEnvelope aria-hidden className={icon} />
        </a>
      </Magnetic>
    </div>
  );
}
