// src/components/classes/ClassHero.tsx
// Hero with immediate fade-in + slide-up on mount.
// If a featured image is provided (from WP), it is shown as a full-bleed
// background with a dark overlay. Falls back to solid #121212.

import Image from "next/image";

type Props = {
  title: string;
  slug: string;
  featuredImage?: string | null;
};

export default function ClassHero({ title, featuredImage }: Props) {
  return (
    <section
      className="relative flex items-center justify-center min-h-[320px] bg-[#121212] overflow-hidden"
      aria-label="Hero section"
    >
      {featuredImage && (
        <>
          <Image
            src={featuredImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Dark overlay so the title stays readable */}
          <div className="absolute inset-0 bg-black/55" aria-hidden="true" />
        </>
      )}

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
