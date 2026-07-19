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
        <h2 className="text-lg font-normal text-gray-900 mb-2">A Note from Our Coaches</h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
