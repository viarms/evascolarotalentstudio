"use client";
// src/components/classes/ClassIntro.tsx
// Intro paragraph — fade-in + slide up on scroll reveal.

import { useInView } from "@/hooks/useInView";

type Props = {
  text: string;
};

export default function ClassIntro({ text }: Props) {
  const [ref, visible] = useInView();

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Class introduction"
    >
      <p
        className="text-lg text-gray-700 leading-relaxed transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(24px)",
        }}
      >
        {text}
      </p>
    </section>
  );
}
