// src/app/classes/[slug]/page.tsx
// Dynamic route for all 9 class pages.
//
// DATA SOURCE (toggle via USE_MOCK_DATA):
//   true  → mock data in src/lib/mock/classMock.ts  (works today, no WP needed)
//   false → live Apollo/WPGraphQL query              (enable once WP is ready)
//
// CACHING: export const revalidate = 3600 (ISR, 1-hour) — standard Next.js
// model without cacheComponents flag.

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { ClassData } from "@/lib/types/class";

// ─── Components ──────────────────────────────────────────────────────────────
import ClassHero from "@/components/classes/ClassHero";
import ClassIntro from "@/components/classes/ClassIntro";
import BenefitsList from "@/components/classes/BenefitsList";
import AgeGroupTable from "@/components/classes/AgeGroupTable";
import ScheduleTabs from "@/components/classes/ScheduleTabs";
import CoachNote from "@/components/classes/CoachNote";
import PriceNote from "@/components/classes/PriceNote";
import FaqAccordion from "@/components/classes/FaqAccordion";
import CtaButton from "@/components/classes/CtaButton";
import ComingSoonBanner from "@/components/classes/ComingSoonBanner";

// ─── ISR: revalidate every hour ───────────────────────────────────────────────
export const revalidate = 3600;

// ─── Toggle: mock vs live data ────────────────────────────────────────────────
// Set to false and uncomment the Apollo block below once WPGraphQL is live.
const USE_MOCK_DATA = true;

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchClass(slug: string): Promise<ClassData | null> {
  if (USE_MOCK_DATA) {
    // -- MOCK ------------------------------------------------------------------
    const { MOCK_CLASSES } = await import("@/lib/mock/classMock");
    return MOCK_CLASSES[slug] ?? null;
  }

  // -- LIVE (Apollo + WPGraphQL) -----------------------------------------------
  // Uncomment this block when WPGraphQL is live on WordPress:
  //
  // const { getClient } = await import("@/lib/apollo-client");
  // const { GET_CLASS_BY_SLUG } = await import("@/lib/queries/classQueries");
  // const client = getClient();
  // const { data } = await client.query({
  //   query: GET_CLASS_BY_SLUG,
  //   variables: { slug },
  // });
  // if (!data?.kelas) return null;
  // const f = data.kelas.classFields;
  // return {
  //   slug: data.kelas.slug,
  //   seoTitle: f.seoTitle,
  //   metaDescription: f.metaDescription,
  //   h1: f.h1,
  //   intro: f.intro,
  //   benefits: f.benefits.map((b: { item: string }) => b.item),
  //   ageGroups: f.ageGroups,
  //   schedule: f.schedule,
  //   coachesNote: f.coachesNote,
  //   priceNote: f.priceNote,
  //   faq: f.faq,
  //   ctaLabel: f.ctaLabel,
  //   status: f.status,
  //   availabilityNote: f.availabilityNote ?? undefined,
  // };

  return null; // remove once live block is uncommented
}

// ─── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  if (USE_MOCK_DATA) {
    const { MOCK_CLASSES } = await import("@/lib/mock/classMock");
    return Object.keys(MOCK_CLASSES).map((slug) => ({ slug }));
  }

  // -- LIVE --
  // const { getClient } = await import("@/lib/apollo-client");
  // const { GET_ALL_CLASS_SLUGS } = await import("@/lib/queries/classQueries");
  // const client = getClient();
  // const { data } = await client.query({ query: GET_ALL_CLASS_SLUGS });
  // return data.kelases.nodes.map((node: { slug: string }) => ({ slug: node.slug }));

  return [];
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
type SlugProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(
  props: SlugProps
): Promise<Metadata> {
  const { slug } = await props.params;
  const cls = await fetchClass(slug);
  if (!cls) return {};

  const url = `https://www.evascolarotalentstudio.com/classes/${cls.slug}`;

  return {
    title: cls.seoTitle,
    description: cls.metaDescription,
    openGraph: {
      title: cls.seoTitle,
      description: cls.metaDescription,
      url,
      siteName: "Eva Scolaro Talent Studio",
      locale: "id_ID",
      type: "website",
    },
    alternates: { canonical: url },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ClassPage(props: SlugProps) {
  const { slug } = await props.params;
  const cls = await fetchClass(slug);
  if (!cls) notFound();

  const isComingSoon = cls.status === "coming_soon";

  const waMessage = encodeURIComponent(
    `Hi, I'd like to know more about the ${cls.h1} class`
  );
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  // Schema.org Course structured data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: cls.h1,
    description: cls.metaDescription,
    provider: {
      "@type": "Organization",
      name: "Eva Scolaro Talent Studio",
      url: "https://www.evascolarotalentstudio.com",
    },
    url: `https://www.evascolarotalentstudio.com/classes/${cls.slug}`,
  };

  return (
    <main>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ClassHero title={cls.h1} slug={cls.slug} />
      <ClassIntro text={cls.intro} />
      <BenefitsList items={cls.benefits} />
      <AgeGroupTable groups={cls.ageGroups} />

      {isComingSoon ? (
        <ComingSoonBanner
          note={cls.availabilityNote}
          waLink={waLink}
          ctaLabel="Ask About Class Availability"
        />
      ) : (
        <>
          {cls.schedule.length > 0 && <ScheduleTabs schedule={cls.schedule} />}
          <CoachNote note={cls.coachesNote} />
          <PriceNote note={cls.priceNote} />
          <FaqAccordion items={cls.faq} />
          <CtaButton label={cls.ctaLabel} waLink={waLink} />
        </>
      )}
    </main>
  );
}
