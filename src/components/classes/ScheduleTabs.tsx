"use client";
// src/components/classes/ScheduleTabs.tsx
// Location tabs — tabs fade in on reveal; panel cross-fades on tab switch.

import { useState } from "react";
import { useInView } from "@/hooks/useInView";
import type { StudioSchedule } from "@/lib/types/class";

type Props = {
  schedule: StudioSchedule[];
};

export default function ScheduleTabs({ schedule }: Props) {
  const [active, setActive] = useState<string>(schedule[0]?.location ?? "");
  const [panelKey, setPanelKey] = useState(0);
  const [ref, visible] = useInView();
  const current = schedule.find((s) => s.location === active);

  function handleTabChange(location: string) {
    setActive(location);
    setPanelKey((k) => k + 1); // remount panel to retrigger fade
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="py-10 px-4 max-w-4xl mx-auto"
      aria-label="Class schedule"
    >
      <h2
        className="flex items-center gap-2 text-2xl font-normal text-gray-900 mb-6 transition-all duration-500 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(16px)",
        }}
      >
        {/* Calendar icon */}
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round"
             className="w-6 h-6 text-[var(--color-brand-red)] flex-shrink-0">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        Class Schedule
      </h2>

      {/* Tab list — stagger in */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Studio locations">
        {schedule.map((s, i) => {
          const isActive = active === s.location;
          return (
            <button
              key={s.location}
              id={`tab-${s.location}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${s.location}`}
              onClick={() => handleTabChange(s.location)}
              className={[
                "px-5 py-2 rounded-md text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121212] focus-visible:ring-offset-2",
                isActive
                  ? "bg-[#121212] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:-translate-y-0.5",
              ].join(" ")}
              style={{
                transitionDelay: visible ? `${i * 60 + 100}ms` : "0ms",
                opacity: visible ? 1 : 0,
                transform: isActive
                  ? "none"
                  : visible ? "translateY(0)" : "translateY(8px)",
              }}
            >
              {s.location}
            </button>
          );
        })}
      </div>

      {/* Tab panel — fade on switch */}
      {current && (
        <div
          key={panelKey}
          id={`tabpanel-${current.location}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.location}`}
          className="overflow-x-auto rounded-md border border-gray-200 animate-[fadeIn_0.25s_ease-out_both]"
        >
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700">Day</th>
                <th className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700">Class</th>
                <th className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-700">Coach</th>
              </tr>
            </thead>
            <tbody>
              {current.items.map((item, i) => (
                <tr
                  key={i}
                  className="even:bg-gray-50 border-t border-gray-200 transition-colors duration-150 hover:bg-gray-100"
                >
                  <td className="px-4 py-3 text-gray-900">{item.day}</td>
                  <td className="px-4 py-3 text-gray-900">{item.className}</td>
                  <td className="px-4 py-3 text-gray-700 whitespace-nowrap">
                    {item.timeStart}–{item.timeEnd}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{item.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
