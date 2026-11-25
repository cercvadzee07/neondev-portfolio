"use client";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { site } from "@/content/site";
import { getDict, type Lang } from "@/content/i18n";

/**
 * Floating WhatsApp button in the bottom-right corner.
 * Appears after the first screen and hides while the Contact section (which has its own big WhatsApp button) is on screen.
 */
export default function WhatsAppFloat({ lang }: { lang: Lang }) {
  const t = getDict(lang).contact;
  const [scrolled, setScrolled] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const contact = document.getElementById("contact");
    const io = contact ? new IntersectionObserver(([e]) => setContactVisible(e.isIntersecting), { threshold: 0.15 }) : null;
    if (contact && io) io.observe(contact);

    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = scrolled && !contactVisible;

  return (
    <a
      href={`${site.local.whatsapp}?text=${encodeURIComponent(t.whatsappText)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.whatsappCta}
      title={t.whatsappCta}
      tabIndex={show ? 0 : -1}
      aria-hidden={!show}
      className={`group fixed bottom-5 right-5 z-[70] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-ink-950 shadow-[0_0_24px_-4px_#25D366] transition-[opacity,transform,box-shadow,filter] duration-500 ease-out hover:brightness-110 hover:shadow-[0_0_40px_0_#25D366] sm:bottom-7 sm:right-7 ${
        show ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-75 opacity-0"
      }`}
    >
      {/* soft pulsing ring */}
      <span aria-hidden className="absolute inset-0 rounded-full bg-[#25D366]/40 motion-safe:animate-[wa-pulse_2.6s_ease-out_infinite]" />
      <FaWhatsapp aria-hidden className="relative h-7 w-7" />
      <style>{`@keyframes wa-pulse { 0% { transform: scale(1); opacity: .6; } 80%, 100% { transform: scale(1.6); opacity: 0; } }`}</style>
    </a>
  );
}
