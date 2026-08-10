"use client";
// src/components/classes/CtaButton.tsx
// CTA — reveals on scroll, fires the free-trial modal on click.

import { useInView } from "@/hooks/useInView";
import { SparklesIcon } from "@animateicons/react/lucide";
import { useRef } from "react";

type Props = {
  label: string;
};

export default function CtaButton({ label }: Props) {
  const [ref, visible] = useInView(0.5);
  const iconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  function openModal() {
    window.dispatchEvent(new Event("open-book-trial-modal"));
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-12 px-4 text-center"
      aria-label="Call to action"
    >
      <button
        type="button"
        onClick={openModal}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
        className="
          inline-flex items-center gap-3
          bg-[var(--color-brand-red)] text-white text-lg px-10 py-4 rounded-sm
          hover:bg-[var(--color-brand-red-dark)] hover:-translate-y-[3px]
          active:translate-y-0 active:brightness-90
          [font-family:var(--font-display)]
          cursor-pointer
        "
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? undefined : "translateY(20px) scale(0.97)",
          transition: "opacity 0.6s ease-out, transform 0.35s cubic-bezier(0.22,1,0.36,1), background-color 0.25s ease, filter 0.15s ease",
          animation: visible ? "ctaPulse 5s ease-in-out 2s infinite" : "none",
        }}
      >
        <SparklesIcon
          ref={iconRef}
          size={20}
          color="#FFFFFF"
          isAnimated={false}
        />
        {label}
      </button>
    </section>
  );
}
