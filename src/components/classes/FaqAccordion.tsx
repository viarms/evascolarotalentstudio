"use client";
// src/components/classes/FaqAccordion.tsx
// Accessible expand/collapse FAQ. One item open at a time.

import { useState } from "react";
import type { FaqItem } from "@/lib/types/class";

type Props = {
  items: FaqItem[];
};

export default function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!items.length) return null;

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Frequently asked questions">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">FAQ</h2>
      <dl className="divide-y divide-gray-200 border-y border-gray-200">
        {items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <dt>
                <button
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-900 hover:text-[var(--color-brand-red)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 rounded"
                >
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className={[
                      "ml-4 flex-shrink-0 text-xl font-light text-[var(--color-brand-red)] transition-transform duration-200",
                      isOpen ? "rotate-45" : "rotate-0",
                    ].join(" ")}
                  >
                    +
                  </span>
                </button>
              </dt>
              <dd
                id={`faq-answer-${i}`}
                role="region"
                aria-labelledby={`faq-question-${i}`}
                hidden={!isOpen}
                className="pb-4 text-gray-700 text-sm leading-relaxed"
              >
                {item.answer}
              </dd>
            </div>
          );
        })}
      </dl>
    </section>
  );
}
