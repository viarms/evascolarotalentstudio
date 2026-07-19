"use client";
// src/components/classes/AgeGroupTable.tsx
// Age group table — fades in with a subtle scale-up on scroll reveal.

import { useInView } from "@/hooks/useInView";
import type { AgeGroup } from "@/lib/types/class";

type Props = {
  groups: AgeGroup[];
};

export default function AgeGroupTable({ groups }: Props) {
  const [ref, visible] = useInView();

  if (!groups.length) return null;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-3xl mx-auto"
      aria-label="Age groups"
    >
      <h2
        className="flex items-center gap-2 text-2xl font-normal text-gray-900 mb-6 transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {/* Users / group icon */}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
             className="w-6 h-6 text-[var(--color-brand-red)] flex-shrink-0">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
        Age Groups
      </h2>

      <div
        className="overflow-x-auto rounded-md border border-gray-200 transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.98) translateY(12px)",
        }}
      >
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#121212] text-white text-left">
              <th className="px-4 py-3 font-semibold">Level</th>
              <th className="px-4 py-3 font-semibold">Age Range</th>
              <th className="px-4 py-3 font-semibold">Focus</th>
            </tr>
          </thead>
          <tbody>
            {groups.map((group, i) => (
              <tr key={i} className="even:bg-gray-50 border-t border-gray-200">
                <td className="px-4 py-3 font-medium text-gray-900">{group.level}</td>
                <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{group.ageRange}</td>
                <td className="px-4 py-3 text-gray-700">{group.focus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
