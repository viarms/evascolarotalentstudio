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
        <h2 className="text-lg font-normal text-gray-900 mb-2">Pricing</h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
