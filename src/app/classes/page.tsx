// src/app/classes/page.tsx
// Index page listing all 9 class offerings.
// Statically generated at build time (no dynamic data needed).

import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Our Classes",
  description:
    "Explore all performing arts classes at Eva Scolaro Talent Studio — ballet, hip-hop, K-Pop dance, singing, drama, modeling, breakdance, and more. Studios in Sanur & Canggu, Bali.",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com/classes",
  },
};

// ─── Class catalogue ──────────────────────────────────────────────────────────

type ClassCard = {
  slug: string;
  name: string;
  tagline: string;
  ages: string;
  status: "active" | "coming_soon";
  /** Emoji used as a lightweight visual stand-in until real featured images are shown */
  icon: string;
};

const CLASSES: ClassCard[] = [
  {
    slug: "hip-hop",
    name: "Hip-Hop",
    tagline: "Energetic urban choreography — rhythm, confidence, and stage presence.",
    ages: "3–16 years",
    status: "active",
    icon: "🎤",
  },
  {
    slug: "ballet",
    name: "Ballet",
    tagline: "Classical technique that builds posture, flexibility, and grace.",
    ages: "3–16 years",
    status: "active",
    icon: "🩰",
  },
  {
    slug: "singing",
    name: "Singing",
    tagline: "Find your voice — breathing, pitch, and solo stage performance.",
    ages: "3–16 years",
    status: "active",
    icon: "🎵",
  },
  {
    slug: "kpop-dance",
    name: "K-Pop Dance",
    tagline: "Trending K-Pop choreography, formation teamwork, and idol-level presence.",
    ages: "6–16 years",
    status: "active",
    icon: "⭐",
  },
  {
    slug: "jazz-dance",
    name: "Jazz Dance",
    tagline: "Dynamic movement blending technique, musicality, and self-expression.",
    ages: "3–9 years",
    status: "active",
    icon: "🎷",
  },
  {
    slug: "drama-musical-theatre",
    name: "Drama & Musical Theatre",
    tagline: "Acting, singing, and movement combined into one transformative class.",
    ages: "6–16 years",
    status: "active",
    icon: "🎭",
  },
  {
    slug: "modeling",
    name: "Modeling",
    tagline: "Posture, catwalk, and camera confidence — skills for life.",
    ages: "3–16 years",
    status: "active",
    icon: "👑",
  },
  {
    slug: "breakdance",
    name: "Breakdance",
    tagline: "Breaking fundamentals — footwork, freezes, and freestyle strength.",
    ages: "6–16 years",
    status: "active",
    icon: "🔥",
  },
  {
    slug: "public-speaking",
    name: "Public Speaking",
    tagline: "Speech structure, intonation, and the confidence to hold a room.",
    ages: "10–16 years",
    status: "coming_soon",
    icon: "🎙️",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ClassesIndexPage() {
  const active = CLASSES.filter((c) => c.status === "active");
  const comingSoon = CLASSES.filter((c) => c.status === "coming_soon");

  return (
    <main>
      {/* Page header */}
      <header className="mb-10 md:mb-14">
        <p className="uppercase tracking-[0.18em] text-xs font-semibold text-brand-red mb-3">
          Sanur &amp; Canggu, Bali
        </p>
        <h1 className="text-3xl md:text-5xl font-normal leading-tight text-gray-900 mb-4">
          Our Classes
        </h1>
        <p className="text-base md:text-lg text-gray-600 max-w-2xl leading-relaxed">
          Nine performing arts classes for children aged 3–16. Every class ends the
          term with a stage performance — because real confidence comes from doing it
          in front of an audience.
        </p>
      </header>

      {/* Active classes grid */}
      <section aria-label="Classes">
        <ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 p-0 m-0 list-none"
          role="list"
        >
          {active.map((cls) => (
            <li key={cls.slug}>
              <ClassCard cls={cls} />
            </li>
          ))}
        </ul>
      </section>

      {/* Coming-soon section */}
      {comingSoon.length > 0 && (
        <section aria-label="Coming soon" className="mt-10 md:mt-14">
          <h2 className="text-lg font-normal text-gray-400 uppercase tracking-widest mb-4">
            Coming Soon
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-0 m-0 list-none" role="list">
            {comingSoon.map((cls) => (
              <li key={cls.slug}>
                <ClassCard cls={cls} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Free trial CTA strip */}
      <aside
        className="mt-12 md:mt-16 rounded-sm bg-[#121212] text-white px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        aria-label="Free trial offer"
      >
        <div>
          <p className="text-lg font-normal leading-snug" style={{ fontFamily: "var(--font-display)" }}>
            Not sure which class is right for your child?
          </p>
          <p className="text-sm text-gray-400 mt-1">
            Every class offers a free trial — no registration fee required.
          </p>
        </div>
        <a
          href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464"}?text=${encodeURIComponent("Hi, I'd like to find out which class is right for my child.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block shrink-0 bg-brand-red hover:bg-brand-red-dark
            text-white text-sm font-semibold tracking-wide
            px-6 py-3 rounded-sm transition-colors
          "
        >
          Chat with Us on WhatsApp
        </a>
      </aside>
    </main>
  );
}

// ─── ClassCard component ──────────────────────────────────────────────────────

function ClassCard({ cls }: { cls: ClassCard }) {
  const isComingSoon = cls.status === "coming_soon";

  const inner = (
    <div
      className={`
        group flex flex-col h-full
        border border-gray-200 rounded-sm
        px-6 py-5
        transition-all duration-200
        ${isComingSoon
          ? "opacity-60 cursor-default"
          : "hover:border-brand-red hover:shadow-md cursor-pointer"
        }
      `}
    >
      {/* Icon + name row */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl leading-none" aria-hidden="true">
          {cls.icon}
        </span>
        <h2
          className={`
            text-lg font-normal leading-snug text-gray-900
            ${!isComingSoon ? "group-hover:text-brand-red transition-colors" : ""}
          `}
        >
          {cls.name}
          {isComingSoon && (
            <span className="ml-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
              Soon
            </span>
          )}
        </h2>
      </div>

      {/* Tagline */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1">{cls.tagline}</p>

      {/* Ages + arrow */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">
          Ages {cls.ages}
        </span>
        {!isComingSoon && (
          <span
            className="text-brand-red text-sm font-semibold group-hover:translate-x-1 transition-transform"
            aria-hidden="true"
          >
            →
          </span>
        )}
      </div>
    </div>
  );

  if (isComingSoon) return inner;

  return (
    <Link href={`/classes/${cls.slug}`} className="block h-full" aria-label={`${cls.name} class details`}>
      {inner}
    </Link>
  );
}
