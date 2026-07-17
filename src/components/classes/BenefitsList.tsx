// src/components/classes/BenefitsList.tsx
// Renders the bullet-point list of class benefits.

type Props = {
  items: string[];
};

export default function BenefitsList({ items }: Props) {
  if (!items.length) return null;

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Class benefits">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Why Join This Class?</h2>
      <ul className="space-y-3" role="list">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            {/* Decorative checkmark using brand red */}
            <span
              className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--color-brand-red)] flex items-center justify-center"
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
