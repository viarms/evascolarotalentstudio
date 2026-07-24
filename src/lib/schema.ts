/**
 * src/lib/schema.ts
 *
 * JSON-LD schema builders for class pages.
 *
 * Produces two schema types:
 *   - Course (with CourseInstance + Schedule per studio location)
 *   - FAQPage (when FAQ items exist)
 *
 * Both are combined into a single @graph array for one <script> tag.
 */

import type { ClassData } from "@/lib/types/class";

// ─── Constants ────────────────────────────────────────────────────────────────

const SITE_URL = "https://www.evascolarotalentstudio.com";

const ORGANIZATION = {
  "@type": "Organization",
  name: "Eva Scolaro Talent Studio",
  url: SITE_URL,
  logo: `${SITE_URL}/logo-evascolaro.svg`,
  telephone: "+62821-4628-4464",
  address: [
    {
      "@type": "PostalAddress",
      name: "Sanur Studio",
      addressLocality: "Sanur",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
    {
      "@type": "PostalAddress",
      name: "Canggu Studio",
      addressLocality: "Canggu",
      addressRegion: "Bali",
      addressCountry: "ID",
    },
  ],
  sameAs: [
    "https://www.instagram.com/evascolarotalentstudio",
    "https://www.facebook.com/evascolarotalentstudio",
    "https://www.youtube.com/@evascolarotalentstudio",
  ],
};

/** Maps schema.org day-of-week URIs to our day name strings */
const DAY_TO_SCHEMA_URI: Record<string, string> = {
  Monday:    "https://schema.org/Monday",
  Tuesday:   "https://schema.org/Tuesday",
  Wednesday: "https://schema.org/Wednesday",
  Thursday:  "https://schema.org/Thursday",
  Friday:    "https://schema.org/Friday",
  Saturday:  "https://schema.org/Saturday",
  Sunday:    "https://schema.org/Sunday",
};

/** Maps known studio location names to city strings for Place address */
const LOCATION_CITY: Record<string, string> = {
  "Sanur Studio":  "Sanur, Bali",
  "Canggu Studio": "Canggu, Bali",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Derives a human-readable age range string from the ageGroups array.
 * e.g. "Ages 3–16" or "Ages 10–16"
 */
function deriveAgeRange(cls: ClassData): string {
  // Extract all numeric ages from ageRange strings like "3–5 years", "10–16 years"
  const ages: number[] = [];
  for (const group of cls.ageGroups) {
    const matches = group.ageRange.match(/\d+/g);
    if (matches) ages.push(...matches.map(Number));
  }
  if (!ages.length) return "Ages 3–16";
  const min = Math.min(...ages);
  const max = Math.max(...ages);
  return min === max ? `Ages ${min}+` : `Ages ${min}–${max}`;
}

/**
 * Converts "HH:MM" to a schema.org time string "THH:MM".
 * Returns undefined if the value is empty/missing.
 */
function toSchemaTime(t: string): string | undefined {
  if (!t) return undefined;
  return `T${t}`;
}

// ─── Course schema builder ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type JsonLdObject = Record<string, any>;

export function buildCourseSchema(cls: ClassData): JsonLdObject {
  const pageUrl = `${SITE_URL}/classes/${cls.slug}`;
  const ageRange = deriveAgeRange(cls);

  // Build CourseInstance array — one per studio location with nested schedules
  const courseInstances: JsonLdObject[] = cls.schedule
    .filter((studio) => studio.items.length > 0)
    .map((studio) => {
      const city = LOCATION_CITY[studio.location] ?? studio.location;

      const schedules: JsonLdObject[] = studio.items.reduce<JsonLdObject[]>((acc, item) => {
          const byDay     = DAY_TO_SCHEMA_URI[item.day];
          const startTime = toSchemaTime(item.timeStart);
          const endTime   = toSchemaTime(item.timeEnd);
          if (!byDay || !startTime || !endTime) return acc;
          acc.push({
            "@type": "Schedule",
            byDay,
            startTime,
            endTime,
            repeatFrequency: "P1W",          // weekly
            scheduleTimezone: "Asia/Makassar", // Bali = WITA = UTC+8
          });
          return acc;
        }, []);

      return {
        "@type": "CourseInstance",
        name: `${cls.h1} — ${studio.location}`,
        courseMode: "onsite",
        location: {
          "@type": "Place",
          name: studio.location,
          address: {
            "@type": "PostalAddress",
            addressLocality: city,
            addressCountry: "ID",
          },
        },
        ...(schedules.length > 0 && { courseSchedule: schedules }),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "IDR",
          name: "Free Trial Class",
          description: "One free trial class, no registration fee required.",
          availability: "https://schema.org/InStock",
          url: pageUrl,
        },
      };
    });

  return {
    "@type": "Course",
    "@id": `${pageUrl}#course`,
    name: cls.h1,
    description: cls.metaDescription || cls.intro,
    url: pageUrl,
    provider: ORGANIZATION,
    educationalLevel: ageRange,
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
      suggestedMinAge: (() => {
        const ages: number[] = [];
        for (const g of cls.ageGroups) {
          const m = g.ageRange.match(/\d+/g);
          if (m) ages.push(...m.map(Number));
        }
        return ages.length ? Math.min(...ages) : 3;
      })(),
      suggestedMaxAge: (() => {
        const ages: number[] = [];
        for (const g of cls.ageGroups) {
          const m = g.ageRange.match(/\d+/g);
          if (m) ages.push(...m.map(Number));
        }
        return ages.length ? Math.max(...ages) : 16;
      })(),
    },
    // Offer at the course level — covers free trial across all locations
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "IDR",
      name: "Free Trial Class",
      description: cls.priceNote
        ? `Free trial available. ${cls.priceNote}`
        : "One free trial class, no registration fee required.",
      availability: "https://schema.org/InStock",
      url: pageUrl,
    },
    ...(courseInstances.length > 0 && { hasCourseInstance: courseInstances }),
  };
}

// ─── FAQPage schema builder ───────────────────────────────────────────────────

export function buildFaqPageSchema(cls: ClassData): JsonLdObject | null {
  if (!cls.faq || cls.faq.length === 0) return null;

  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/classes/${cls.slug}#faq`,
    mainEntity: cls.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ─── Combined @graph output ───────────────────────────────────────────────────

/**
 * Returns a JSON-LD @graph array containing Course + FAQPage (if applicable).
 * Render as a single <script type="application/ld+json"> tag.
 */
export function buildClassPageSchema(cls: ClassData): JsonLdObject {
  const nodes: JsonLdObject[] = [buildCourseSchema(cls)];

  const faq = buildFaqPageSchema(cls);
  if (faq) nodes.push(faq);

  return {
    "@context": "https://schema.org",
    "@graph": nodes,
  };
}

// ─── Studio Rental schema builder ────────────────────────────────────────────

/**
 * Returns JSON-LD schema for the studio rental page:
 *   - LocalBusiness (Sanur studio location)
 *   - Service (Ground Floor rental)
 *   - Service (Second Floor rental)
 */
export function buildStudioRentalSchema(): JsonLdObject {
  const pageUrl = `${SITE_URL}/studio-rental/`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#sanur-studio`,
        name: "Eva Scolaro Talent Studio — Sanur",
        url: SITE_URL,
        logo: `${SITE_URL}/logo-evascolaro.svg`,
        telephone: "+62821-4628-4464",
        address: {
          "@type": "PostalAddress",
          streetAddress: "Jl. Bypass Ngurah Rai No.88A",
          addressLocality: "Sanur",
          addressRegion: "Denpasar Selatan",
          addressCountry: "ID",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "-8.6875",
          longitude: "115.2606",
        },
        priceRange: "IDR 250,000 - 400,000 per hour",
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "10:00",
            closes: "13:00",
          },
        ],
        hasMap: "https://maps.app.goo.gl/Esoa9MtswJxsoN3R7",
        sameAs: [
          "https://www.instagram.com/evascolarotalentstudio",
          "https://www.facebook.com/evascolarotalentstudio",
          "https://www.youtube.com/@evascolarotalentstudio",
        ],
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#ground-floor`,
        name: "Ground Floor Dance Studio Rental",
        description:
          "Professional dance studio rental in Sanur, Bali. Full-length mirrored walls, sprung hardwood floor, built-in sound system, air conditioning. Ideal for group classes, rehearsals, photo shoots, and workshops. Accommodates up to 20 people.",
        provider: {
          "@type": "LocalBusiness",
          name: "Eva Scolaro Talent Studio",
          url: SITE_URL,
        },
        areaServed: {
          "@type": "Place",
          name: "Sanur, Bali, Indonesia",
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `https://wa.me/6282146284464?text=${encodeURIComponent(
            "Hi, I'd like to book the dance studio for rental. Could you please share available slots?"
          )}`,
          serviceType: "WhatsApp",
        },
        offers: {
          "@type": "Offer",
          price: "400000",
          priceCurrency: "IDR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "400000",
            priceCurrency: "IDR",
            unitText: "per hour",
          },
          availability: "https://schema.org/LimitedAvailability",
          availabilityStarts: "10:00",
          availabilityEnds: "13:00",
          validFrom: "2026-01-01",
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#second-floor`,
        name: "Second Floor Practice Studio Rental",
        description:
          "Intimate practice studio rental in Sanur, Bali. Mirror wall, portable speaker, air conditioning. Perfect for solo rehearsals, small group sessions, tutoring, or movement coaching. Ideal for 1–8 people.",
        provider: {
          "@type": "LocalBusiness",
          name: "Eva Scolaro Talent Studio",
          url: SITE_URL,
        },
        areaServed: {
          "@type": "Place",
          name: "Sanur, Bali, Indonesia",
        },
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `https://wa.me/6282146284464?text=${encodeURIComponent(
            "Hi, I'd like to book the dance studio for rental. Could you please share available slots?"
          )}`,
          serviceType: "WhatsApp",
        },
        offers: {
          "@type": "Offer",
          price: "250000",
          priceCurrency: "IDR",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "250000",
            priceCurrency: "IDR",
            unitText: "per hour",
          },
          availability: "https://schema.org/LimitedAvailability",
          availabilityStarts: "10:00",
          availabilityEnds: "13:00",
          validFrom: "2026-01-01",
        },
      },
    ],
  };
}
