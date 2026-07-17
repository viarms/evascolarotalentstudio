// src/components/classes/PriceNote.tsx
// Pricing information note for the class.

type Props = {
  note: string;
};

export default function PriceNote({ note }: Props) {
  if (!note) return null;

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Pricing information">
      <div className="bg-gray-50 rounded-xl border border-gray-200 px-6 py-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">Pricing</h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
