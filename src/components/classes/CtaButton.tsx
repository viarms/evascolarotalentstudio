// src/components/classes/CtaButton.tsx
// WhatsApp CTA button. The waLink has the class name pre-filled in the message
// (constructed in the page component).

type Props = {
  label: string;
  waLink: string;
};

export default function CtaButton({ label, waLink }: Props) {
  return (
    <section className="py-12 px-4 text-center" aria-label="Call to action">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[var(--color-brand-red)] text-white text-lg px-10 py-4 rounded-full hover:bg-[var(--color-brand-red-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 [font-family:var(--font-display)]"
      >
        {label}
      </a>
    </section>
  );
}
