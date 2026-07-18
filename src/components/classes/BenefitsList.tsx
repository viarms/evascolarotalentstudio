"use client";
// src/components/classes/BenefitsList.tsx
// Benefits list — heading reveals first, then items stagger in from the left.

import { useInView } from "@/hooks/useInView";

type Props = {
  items: string[];
};

export default function BenefitsList({ items }: Props) {
  const [ref, visible] = useInView();

  if (!items.length) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Class benefits"
    >
      <h2
        className="text-2xl font-normal text-gray-900 mb-6 transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        Why Join This Class?
      </h2>

      <ul className="space-y-3" role="list">
        {items.map((item, i) => (
          <li
            key={i}
            className="flex items-start gap-3 transition-all ease-out"
            style={{
              transitionDuration: "500ms",
              transitionDelay: visible ? `${i * 80}ms` : "0ms",
              opacity: visible ? 1 : 0,
              transform: visible ? "translateX(0)" : "translateX(-20px)",
            }}
          >
            <span
              className="mt-1 flex-shrink-0 w-5 h-5 rounded-sm bg-[var(--color-brand-red)] flex items-center justify-center"
              aria-hidden="true"
            >
              <svg
                className="w-3 h-3 text-white"
                fill="none"
                viewBox="0 0 12 10"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M1 5l3.5 3.5L11 1" />
              </svg>
            </span>
            <span className="text-gray-700 leading-relaxed">{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
