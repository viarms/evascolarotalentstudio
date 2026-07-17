// src/components/classes/ClassIntro.tsx
// Short introductory paragraph shown immediately below the hero.

type Props = {
  text: string;
};

export default function ClassIntro({ text }: Props) {
  return (
    <section className="py-10 px-4 max-w-3xl mx-auto" aria-label="Class introduction">
      <p className="text-lg text-gray-700 leading-relaxed">{text}</p>
    </section>
  );
}
