// src/components/classes/CoachNote.tsx
// Short message from/about the coaches for this class.

type Props = {
  note: string;
};

export default function CoachNote({ note }: Props) {
  if (!note) return null;

  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Note from our coaches">
      <div className="border-l-4 border-[var(--color-brand-red)] pl-5">
        <h2 className="text-lg font-bold text-gray-900 mb-2">A Note from Our Coaches</h2>
        <p className="text-gray-700 leading-relaxed">{note}</p>
      </div>
    </section>
  );
}
