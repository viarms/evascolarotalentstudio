// src/components/classes/ClassHero.tsx
// Hero: full-bleed image, title pinned to bottom-left with a smooth bottom scrim.
// Falls back to solid #121212 when no featured image is available.

import Image from "next/image";

type Props = {
  title: string;
  slug: string;
  featuredImage?: string | null;
};

export default function ClassHero({ title, featuredImage }: Props) {
  return (
    <section
      className="relative min-h-[380px] md:min-h-[480px] bg-[#121212] overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image */}
      {featuredImage && (
        <Image
          src={featuredImage}
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
      )}

      {/* Smooth bottom scrim — transparent at top, dark at bottom */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Title pinned to bottom with generous padding from all edges */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-14 pb-10 md:pb-14">
        <h1
          className="
            text-3xl md:text-5xl font-normal text-white leading-tight
            animate-[heroReveal_0.7s_cubic-bezier(0.22,1,0.36,1)_both]
          "
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
