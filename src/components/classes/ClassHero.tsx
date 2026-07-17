// src/components/classes/ClassHero.tsx
// Fallback: solid brand-red background until per-class hero images are available.

type Props = {
  title: string;
  slug: string;
};

export default function ClassHero({ title }: Props) {
  return (
    <section
      className="relative flex items-center justify-center min-h-[320px] bg-[var(--color-brand-red)]"
      aria-label="Hero section"
    >
      {/*
        TODO (Phase 1 QA): replace solid background with next/image hero once
        images are uploaded to WP Media. One image per slug recommended.
        Example:
          <Image
            src={`/api/hero/${slug}`}
            alt=""
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" aria-hidden="true" />
      */}
      <div className="relative z-10 px-6 py-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight drop-shadow-md">
          {title}
        </h1>
      </div>
    </section>
  );
}
