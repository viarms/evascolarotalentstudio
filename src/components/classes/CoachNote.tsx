"use client";
// src/components/classes/CoachNote.tsx
// Slides in from the left with the border-left accent leading the motion.

import { useInView } from "@/hooks/useInView";

type Props = {
  note: string;
};

export default function CoachNote({ note }: Props) {
  const [ref, visible] = useInView();

  if (!note) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Note from our coaches"
    >
      <div
        className="border-l-4 border-[var(--color-brand-red)] pl-5 transition-all duration-600 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateX(0)" : "translateX(-28px)",
          transitionDuration: "600ms",
        }}
      >
        <h2 className="flex items-center gap-2 text-lg font-normal text-gray-900 mb-2">
          {/* Quote / speech bubble icon */}
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
               strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
               className="w-5 h-5 text-[var(--color-brand-red)] flex-shrink-0">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          A Note from Our Coaches
        </h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
