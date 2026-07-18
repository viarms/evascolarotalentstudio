"use client";
// src/components/classes/ScheduleTabs.tsx
// Location tabs — one tab per active studio location returned from the API.
// Works with any number of locations; no hardcoded location keys.

import { useState } from "react";
import type { StudioSchedule } from "@/lib/types/class";

type Props = {
  schedule: StudioSchedule[];
};

export default function ScheduleTabs({ schedule }: Props) {
  const [active, setActive] = useState<string>(schedule[0]?.location ?? "");
  const current = schedule.find((s) => s.location === active);

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto" aria-label="Class schedule">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Class Schedule</h2>

      {/* Tab list */}
      <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label="Studio locations">
        {schedule.map((s) => {
          const isActive = active === s.location;
          return (
            <button
              key={s.location}
              id={`tab-${s.location}`}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${s.location}`}
              onClick={() => setActive(s.location)}
              className={[
                "px-5 py-2 rounded-full text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2",
                isActive
                  ? "bg-[var(--color-brand-red)] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200",
              ].join(" ")}
            >
              {s.location}
            </button>
          );
        })}
      </div>

      {/* Tab panel */}
      {current && (
        <div
          id={`tabpanel-${current.location}`}
          role="tabpanel"
          aria-labelledby={`tab-${current.location}`}
          className="overflow-x-auto rounded-xl border border-gray-200"
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
                <tr key={i} className="even:bg-gray-50 border-t border-gray-200">
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
