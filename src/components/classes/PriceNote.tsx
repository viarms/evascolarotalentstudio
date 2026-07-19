"use client";
// src/components/classes/PriceNote.tsx
// Fades in with a subtle upward lift on scroll reveal.

import { useInView } from "@/hooks/useInView";

type Props = {
  note: string;
};

export default function PriceNote({ note }: Props) {
  const [ref, visible] = useInView();

  if (!note) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Pricing information"
    >
      <div
        className="bg-gray-50 rounded-md border border-gray-200 px-6 py-5 transition-all duration-600 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
          transitionDuration: "600ms",
        }}
      >
        <h2 className="flex items-center gap-2 text-lg font-normal text-gray-900 mb-2">
          {/* Price tag icon */}
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
               className="w-5 h-5 text-[var(--color-brand-red)] flex-shrink-0">
            <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
            <line x1="7" y1="7" x2="7.01" y2="7" />
          </svg>
          Pricing
        </h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
