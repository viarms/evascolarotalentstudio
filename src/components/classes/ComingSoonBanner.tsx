// src/components/classes/ComingSoonBanner.tsx
// Rendered in place of Schedule / CoachNote / PriceNote / FAQ / CtaButton
// when a class has status === "coming_soon" (e.g. Public Speaking).

type Props = {
  note?: string;
  waLink: string;
  ctaLabel: string;
};

export default function ComingSoonBanner({ note, waLink, ctaLabel }: Props) {
  return (
    <section
      className="py-12 px-4 max-w-2xl mx-auto text-center"
      aria-label="Coming soon"
    >
      <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 space-y-6">
        <div>
          <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide mb-3">
            Coming Soon
          </span>
          {note && (
            <p className="text-gray-700 leading-relaxed">{note}</p>
          )}
        </div>
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[var(--color-brand-red)] text-white px-8 py-3 rounded-full hover:bg-[var(--color-brand-red-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 [font-family:var(--font-display)]"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
