"use client";
// src/components/classes/CtaButton.tsx
// CTA — reveals on scroll, lifts on hover, subtle idle pulse animation.

import { useInView } from "@/hooks/useInView";

type Props = {
  label: string;
  waLink: string;
};

export default function CtaButton({ label, waLink }: Props) {
  const [ref, visible] = useInView(0.5);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-12 px-4 text-center"
      aria-label="Call to action"
    >
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="
          inline-block bg-[var(--color-brand-red)] text-white text-lg px-10 py-4 rounded-sm
          hover:bg-[var(--color-brand-red-dark)]
          hover:-translate-y-1 hover:shadow-lg
          active:translate-y-0 active:shadow-none
          transition-all duration-200 ease-out
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2
          [font-family:var(--font-display)]
        "
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          transition: "opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.22,1,0.36,1), background-color 0.2s, box-shadow 0.2s",
          animation: visible ? "ctaPulse 3s ease-in-out 1.5s infinite" : "none",
        }}
      >
        {label}
      </a>
    </section>
  );
}
