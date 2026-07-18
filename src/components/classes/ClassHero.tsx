// src/components/classes/ClassHero.tsx
// Hero with immediate fade-in + slide-up on mount.

type Props = {
  title: string;
  slug: string;
};

export default function ClassHero({ title }: Props) {
  return (
    <section
      className="relative flex items-center justify-center min-h-[320px] bg-[#121212]"
      aria-label="Hero section"
    >
      <div className="relative z-10 px-6 py-12 text-center">
        <h1
          className="
            text-3xl md:text-5xl font-normal text-white leading-tight drop-shadow-md
            animate-[heroReveal_0.7s_cubic-bezier(0.22,1,0.36,1)_both]
          "
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
