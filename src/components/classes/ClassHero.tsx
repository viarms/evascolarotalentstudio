"use client";
// src/components/classes/ClassHero.tsx
// Hero: full-bleed image with GSAP fade-in reveal, title word-rise via SplitText.
// Falls back to solid #121212 when no featured image is available.

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

type Props = {
  title: string;
  slug: string;
  featuredImage?: string | null;
};

export default function ClassHero({ title, featuredImage }: Props) {
  const imageRef = useRef<HTMLDivElement>(null);
  const h1Ref    = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    const h1  = h1Ref.current;

    // ── Featured image — fade in from dark ───────────────────────────────────
    if (img) {
      gsap.fromTo(
        img,
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: "power2.out", delay: 0.1 }
      );
    }

    // ── Title — same masked word-rise as home hero ───────────────────────────
    if (!h1) return;

    const split = SplitText.create(h1, {
      type: "words",
      mask: "words",
      aria: "hidden",
    });

    const tween = gsap.from(split.words, {
      yPercent: 100,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.07,
      delay: 0.5,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <section
      className="relative min-h-[380px] md:min-h-[480px] bg-[#121212] overflow-hidden"
      aria-label="Hero section"
    >
      {/* Background image — wrapped in a div so we can animate opacity independently */}
      {featuredImage && (
        <div ref={imageRef} className="absolute inset-0" style={{ opacity: 0 }}>
          <Image
            src={featuredImage}
            alt=""
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
        </div>
      )}

      {/* Smooth bottom scrim */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55) 60%, rgba(0,0,0,0.85) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Title pinned to bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-10 px-8 md:px-14 pb-10 md:pb-14">
        <h1
          ref={h1Ref}
          aria-label={title}
          className="text-3xl md:text-5xl font-normal text-white leading-tight"
        >
          {title}
        </h1>
      </div>
    </section>
  );
}
