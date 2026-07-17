// src/components/classes/AgeGroupTable.tsx
// Renders the age group breakdown as a responsive table.

import type { AgeGroup } from "@/lib/types/class";

type Props = {
  groups: AgeGroup[];
};

export default function AgeGroupTable({ groups }: Props) {
  if (!groups.length) return null;

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Age groups">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Age Groups</h2>
      <div className="overflow-x-auto rounded-xl border border-gray-200">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[var(--color-brand-red)] text-white text-left">
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
