"use client";
// src/components/classes/FaqAccordion.tsx
// Accessible FAQ with smooth CSS grid height transition (no layout thrash).
// Section reveals on scroll; answer panel expands via grid-rows trick.

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { FaqItem } from "@/lib/types/class";

type Props = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [ref, visible] = useInView();

  if (!items.length) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Frequently asked questions"
    >
      <h2
        className="text-2xl font-normal text-gray-900 mb-6 transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        FAQ
      </h2>

      <dl className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="transition-all duration-500 ease-out"
              style={{
                transitionDelay: visible ? `${i * 60}ms` : "0ms",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(10px)",
              }}
            >
              <dt>
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex justify-between items-center w-full py-4 text-left text-gray-900 hover:text-[var(--color-brand-red)] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="ml-4 flex-shrink-0 text-xl font-light text-[var(--color-brand-red)] transition-transform duration-300 ease-out"
                    style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
                  >
                    +
                  </span>
                </button>
              </dt>

              {/* CSS grid-rows trick: animates from 0fr → 1fr smoothly */}
              <dd
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                className="grid transition-all duration-300 ease-out"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="pb-4 text-gray-700 text-sm leading-relaxed">{item.answer}</p>
                </div>
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
