# Frontend Sub-Plan — Phase 1 (Pilot): Class Pages in Next.js
## Eva Scolaro Talent Studio

> This document is the technical frontend breakdown for Phase 1 only (9 class pages).
> Read alongside `Migration-Plan-Fase1-Halaman-Kelas.md` and `Migration-Plan-Nextjs-Eva-Scolaro.md`.

---

## 1. Project Setup

### Init repo
```bash
npx create-next-app@latest evascolarotalentstudio \
  --typescript --tailwind --eslint --app --src-dir \
  --import-alias "@/*"
```

### Additional dependencies
```bash
npm install @apollo/client graphql        # WPGraphQL client
npm install next-seo                       # OG/meta fallback helper (optional)
npm install clsx tailwind-merge            # class utility
```

### Directory structure (Phase 1 relevant files only)

```
src/
├── app/
│   ├── classes/
│   │   └── [slug]/
│   │       └── page.tsx          ← dynamic route for all class pages
│   ├── layout.tsx                ← root layout (Header + Footer)
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── classes/
│       ├── ClassHero.tsx
│       ├── ClassIntro.tsx
│       ├── BenefitsList.tsx
│       ├── AgeGroupTable.tsx
│       ├── ScheduleTabs.tsx      ← Sanur / Canggu location tabs
│       ├── CoachNote.tsx
│       ├── PriceNote.tsx
│       ├── FaqAccordion.tsx
│       ├── CtaButton.tsx
│       └── ComingSoonBanner.tsx  ← only rendered when status = coming_soon
├── lib/
│   ├── apollo-client.ts
│   ├── queries/
│   │   └── classQueries.ts       ← all GraphQL queries for class data
│   └── types/
│       └── class.ts              ← TypeScript types for class data
└── next.config.ts                ← rewrite rules proxying to WP origin
```

---

## 2. next.config.ts — Rewrite Proxy to WordPress

All paths **except** `/classes/*` are transparently forwarded to the existing WordPress server.

```ts
// next.config.ts
import type { NextConfig } from "next";

const WP_ORIGIN = process.env.WP_ORIGIN!; // e.g. https://your-wp-host.com

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: new URL(WP_ORIGIN).hostname },
    ],
  },
  async rewrites() {
    return {
      // Next.js handles /classes/* natively — no rewrite needed here.
      // All OTHER paths are forwarded to the WordPress origin.
      fallback: [
        {
          source: "/:path*",
          destination: `${WP_ORIGIN}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
```

**Environment variables required in Vercel:**
| Key | Value |
|---|---|
| `WP_ORIGIN` | Current WP server URL, e.g. `https://evascolarotalentstudio.com` (before DNS is pointed to Vercel, use the hosting IP or original CNAME) |
| `NEXT_PUBLIC_WP_GRAPHQL_URL` | `${WP_ORIGIN}/graphql` |
| `NEXT_PUBLIC_WA_NUMBER` | `6282146284464` |

---

## 3. TypeScript Types

```ts
// src/lib/types/class.ts

export type AgeGroup = {
  level: string;       // "Tots" | "Junior" | "Teen"
  ageRange: string;    // e.g. "3–5 years"
  focus: string;
};

export type ScheduleItem = {
  day: string;         // e.g. "Monday"
  className: string;   // e.g. "Tots Hip-Hop"
  timeStart: string;   // e.g. "14:30"
  timeEnd: string;     // e.g. "15:15"
  coach: string;
};

export type StudioSchedule = {
  location: "sanur" | "canggu";
  items: ScheduleItem[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ClassStatus = "active" | "coming_soon";

export type ClassData = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  benefits: string[];
  ageGroups: AgeGroup[];
  schedule: StudioSchedule[];   // one entry per studio location
  coachesNote: string;
  priceNote: string;
  faq: FaqItem[];
  ctaLabel: string;
  status: ClassStatus;
  availabilityNote?: string;    // shown only when status = coming_soon
};
```

---

## 4. GraphQL Queries

```ts
// src/lib/queries/classQueries.ts
import { gql } from "@apollo/client";

export const GET_ALL_CLASS_SLUGS = gql`
  query GetAllClassSlugs {
    kelases(first: 20) {
      nodes {
        slug
      }
    }
  }
`;

export const GET_CLASS_BY_SLUG = gql`
  query GetClassBySlug($slug: ID!) {
    kelas(id: $slug, idType: SLUG) {
      slug
      classFields {
        seoTitle
        metaDescription
        h1
        intro
        benefits { item }
        ageGroups { level ageRange focus }
        schedule {
          location
          items { day className timeStart timeEnd coach }
        }
        coachesNote
        priceNote
        faq { question answer }
        ctaLabel
        status
        availabilityNote
      }
    }
  }
`;
```

> **Note:** GraphQL field names (`classFields`, `kelases`, etc.) must match what is configured in ACF + WPGraphQL during CMS setup (see Section 3 of the Phase 1 Migration Plan).

---

## 5. Apollo Client

```ts
// src/lib/apollo-client.ts
import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export function getClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WP_GRAPHQL_URL,
      fetchOptions: { next: { revalidate: 3600 } }, // ISR: revalidate every 1 hour
    }),
    cache: new InMemoryCache(),
  });
}
```

---

## 6. Dynamic Route — `app/classes/[slug]/page.tsx`

### generateStaticParams (SSG + ISR)

```tsx
// src/app/classes/[slug]/page.tsx
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_CLASS_SLUGS, GET_CLASS_BY_SLUG } from "@/lib/queries/classQueries";
import { ClassData } from "@/lib/types/class";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// --- ISR revalidation ---
export const revalidate = 3600; // 1 hour

// --- generateStaticParams: pre-render all 9 slugs at build time ---
export async function generateStaticParams() {
  const client = getClient();
  const { data } = await client.query({ query: GET_ALL_CLASS_SLUGS });
  return data.kelases.nodes.map((node: { slug: string }) => ({
    slug: node.slug,
  }));
}

// --- per-page metadata ---
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const cls = await fetchClass(params.slug);
  if (!cls) return {};
  return {
    title: cls.seoTitle,
    description: cls.metaDescription,
    openGraph: {
      title: cls.seoTitle,
      description: cls.metaDescription,
      url: `https://www.evascolarotalentstudio.com/classes/${cls.slug}`,
      siteName: "Eva Scolaro Talent Studio",
      locale: "id_ID",
      type: "website",
    },
  };
}

// --- fetch helper ---
async function fetchClass(slug: string): Promise<ClassData | null> {
  const client = getClient();
  const { data } = await client.query({
    query: GET_CLASS_BY_SLUG,
    variables: { slug },
  });
  if (!data?.kelas) return null;
  const f = data.kelas.classFields;
  return {
    slug: data.kelas.slug,
    seoTitle: f.seoTitle,
    metaDescription: f.metaDescription,
    h1: f.h1,
    intro: f.intro,
    benefits: f.benefits.map((b: { item: string }) => b.item),
    ageGroups: f.ageGroups,
    schedule: f.schedule,
    coachesNote: f.coachesNote,
    priceNote: f.priceNote,
    faq: f.faq,
    ctaLabel: f.ctaLabel,
    status: f.status,
    availabilityNote: f.availabilityNote ?? undefined,
  };
}

// --- Page component ---
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

export default async function ClassPage({ params }: { params: { slug: string } }) {
  const cls = await fetchClass(params.slug);
  if (!cls) notFound();

  const isComingSoon = cls.status === "coming_soon";
  const waMessage = encodeURIComponent(
    `Hi, I'd like to know more about the ${cls.h1} class`
  );
  const waLink = `https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER}?text=${waMessage}`;

  return (
    <main>
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
          <ScheduleTabs schedule={cls.schedule} />
          <CoachNote note={cls.coachesNote} />
          <PriceNote note={cls.priceNote} />
          <FaqAccordion items={cls.faq} />
          <CtaButton label={cls.ctaLabel} waLink={waLink} />
        </>
      )}
    </main>
  );
}
```

---

## 7. Components — Specs & Implementation Sketches

### 7.1 Header & Footer

These are the most critical components for a seamless "one site" feel. Both live in `app/layout.tsx`.

**Replication checklist:**
- [ ] Logo SVG/PNG identical (size, position)
- [ ] Nav links: Home / Price / Timetable / Gallery / Practice / Dancewear / News — all link to the original WordPress URLs (`/`, `/price`, etc.) — **not** Next.js routes, since those pages are still served by WP via the rewrite proxy
- [ ] Nav background color, font, hover state
- [ ] Mobile hamburger menu with matching behavior
- [ ] "Join Us" and "Book Free Trial" buttons → for Phase 1, plain WhatsApp links are sufficient, same as the class page CTAs
- [ ] Social media icons: Instagram, Facebook, YouTube, Spotify, WhatsApp

```tsx
// src/app/layout.tsx
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="font-sans bg-white text-gray-900">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
```

### 7.2 ClassHero

- Hero background image per class (pulled from WP Media, or one image per slug)
- Large H1, high-contrast text over the background
- Fallback: solid `#dd3333` background with a dark overlay if no image is available yet

```tsx
// src/components/classes/ClassHero.tsx
type Props = { title: string; slug: string };

export default function ClassHero({ title, slug }: Props) {
  return (
    <section
      className="relative flex items-center justify-center min-h-[320px] bg-[#dd3333]"
      aria-label="Hero section"
    >
      {/* next/image hero background can be added here once images are available */}
      <div className="relative z-10 px-6 py-12 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
          {title}
        </h1>
      </div>
    </section>
  );
}
```

### 7.3 ScheduleTabs

The most complex component. Sanur / Canggu location tabs — data from `schedule: StudioSchedule[]`.
- If a class has only one location (Breakdance: Canggu only), still render the tab list but with a single item; append `availabilityNote` below the table.
- Use `useState` for the active tab state (client component — add `"use client"` directive).

```tsx
"use client";
// src/components/classes/ScheduleTabs.tsx
import { useState } from "react";
import type { StudioSchedule } from "@/lib/types/class";

const LOCATION_LABEL: Record<string, string> = {
  sanur: "Sanur Studio",
  canggu: "Canggu Studio",
};

export default function ScheduleTabs({ schedule }: { schedule: StudioSchedule[] }) {
  const [active, setActive] = useState(schedule[0]?.location ?? "sanur");
  const current = schedule.find((s) => s.location === active);

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Class Schedule</h2>
      <div className="flex gap-2 mb-6" role="tablist">
        {schedule.map((s) => (
          <button
            key={s.location}
            role="tab"
            aria-selected={active === s.location}
            onClick={() => setActive(s.location)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors
              ${active === s.location
                ? "bg-[#dd3333] text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            {LOCATION_LABEL[s.location] ?? s.location}
          </button>
        ))}
      </div>
      {current && (
        <div className="overflow-x-auto" role="tabpanel">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="p-3 border border-gray-200">Day</th>
                <th className="p-3 border border-gray-200">Class</th>
                <th className="p-3 border border-gray-200">Time</th>
                <th className="p-3 border border-gray-200">Coach</th>
              </tr>
            </thead>
            <tbody>
              {current.items.map((item, i) => (
                <tr key={i} className="even:bg-gray-50">
                  <td className="p-3 border border-gray-200">{item.day}</td>
                  <td className="p-3 border border-gray-200">{item.className}</td>
                  <td className="p-3 border border-gray-200 whitespace-nowrap">
                    {item.timeStart}–{item.timeEnd}
                  </td>
                  <td className="p-3 border border-gray-200">{item.coach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
```

### 7.4 FaqAccordion

Client component, expand/collapse per item. Accessible: `aria-expanded`, `aria-controls`.

```tsx
"use client";
// src/components/classes/FaqAccordion.tsx
import { useState } from "react";
import type { FaqItem } from "@/lib/types/class";

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-10 px-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">FAQ</h2>
      <dl className="divide-y divide-gray-200 border-t border-gray-200">
        {items.map((item, i) => (
          <div key={i}>
            <dt>
              <button
                aria-expanded={openIndex === i}
                aria-controls={`faq-${i}`}
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex justify-between items-center w-full py-4 text-left font-semibold text-gray-900"
              >
                {item.question}
                <span aria-hidden="true">{openIndex === i ? "−" : "+"}</span>
              </button>
            </dt>
            <dd
              id={`faq-${i}`}
              hidden={openIndex !== i}
              className="pb-4 text-gray-700 text-sm leading-relaxed"
            >
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

### 7.5 CtaButton

WhatsApp link with the class name pre-filled in the message.

```tsx
// src/components/classes/CtaButton.tsx
type Props = { label: string; waLink: string };

export default function CtaButton({ label, waLink }: Props) {
  return (
    <section className="py-10 px-4 text-center">
      <a
        href={waLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-[#dd3333] text-white font-bold text-lg
                   px-10 py-4 rounded-full hover:bg-red-700 transition-colors"
      >
        {label}
      </a>
    </section>
  );
}
```

### 7.6 ComingSoonBanner

Rendered in place of Schedule / Price / FAQ when `status = "coming_soon"` (Public Speaking case).

```tsx
// src/components/classes/ComingSoonBanner.tsx
type Props = { note?: string; waLink: string; ctaLabel: string };

export default function ComingSoonBanner({ note, waLink, ctaLabel }: Props) {
  return (
    <section className="py-10 px-4 max-w-2xl mx-auto text-center">
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
        {note && <p className="text-gray-700 mb-6">{note}</p>}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#dd3333] text-white font-bold px-8 py-3
                     rounded-full hover:bg-red-700 transition-colors"
        >
          {ctaLabel}
        </a>
      </div>
    </section>
  );
}
```

---

## 8. SEO & Structured Data

### Schema.org `Course` per class page

Add JSON-LD inside `app/classes/[slug]/page.tsx`, inside the page component:

```tsx
// Add inside ClassPage, before the return statement
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Course",
  "name": cls.h1,
  "description": cls.metaDescription,
  "provider": {
    "@type": "Organization",
    "name": "Eva Scolaro Talent Studio",
    "url": "https://www.evascolarotalentstudio.com"
  },
  "url": `https://www.evascolarotalentstudio.com/classes/${cls.slug}`,
};

// Inside JSX:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
/>
```

### robots.txt & sitemap

```ts
// src/app/sitemap.ts
import { getClient } from "@/lib/apollo-client";
import { GET_ALL_CLASS_SLUGS } from "@/lib/queries/classQueries";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getClient();
  const { data } = await client.query({ query: GET_ALL_CLASS_SLUGS });
  const base = "https://www.evascolarotalentstudio.com";

  return data.kelases.nodes.map((node: { slug: string }) => ({
    url: `${base}/classes/${node.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));
}
```

```ts
// src/app/robots.ts
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/classes/" },
    sitemap: "https://www.evascolarotalentstudio.com/sitemap.xml",
  };
}
```

> **Note:** This `sitemap.ts` covers `/classes/*` only. WordPress continues to manage `sitemap.xml` for all other pages. Merge them when doing the full migration.

---

## 9. Tailwind — Design Tokens

Add to `tailwind.config.ts` so all components share the same colors and font as the WP site:

```ts
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#dd3333",         // Eva Scolaro primary brand color
          "red-dark": "#b52929",
        },
      },
      fontFamily: {
        // Match the font used in Elementor (check DevTools → Computed → font-family)
        sans: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

---

## 10. Pre-Launch QA Checklist

### Per class page (9 pages)
- [ ] H1, meta title, meta description match the content draft
- [ ] `Course` structured data is valid (test at [schema.org/validator](https://validator.schema.org))
- [ ] All schedule data renders correctly (day, time, coach)
- [ ] Sanur/Canggu tabs work (or single tab for single-location classes)
- [ ] `coming_soon` status → Schedule/Price/FAQ hidden, banner shown (Public Speaking)
- [ ] WhatsApp CTA link opens with the correct pre-filled message
- [ ] Mobile responsive (test at 375px, 390px, 428px)
- [ ] No layout shift on load (CLS < 0.1)

### Coexistence (rewrite proxy)
- [ ] Homepage (`/`) still renders correctly after DNS is pointed to Vercel
- [ ] All nav links from the Next.js header point to the correct WP pages
- [ ] No redirect loop on `/classes/*` paths
- [ ] Network tab: WP-proxied pages return status 200, not 404 or a redirect

### SEO
- [ ] `/classes/*/` URLs are included in the Next.js sitemap
- [ ] OG image is set (or a default studio image fallback is in place)
- [ ] Lighthouse page speed ≥ 90 (mobile) for class pages

---

## 11. Development Task Order

Follow this order to minimise blockers between tasks:

| # | Task | Blocked by |
|---|---|---|
| 1 | Set up Next.js repo + Tailwind + TypeScript | — |
| 2 | Configure `next.config.ts` rewrite to WP | Needs `WP_ORIGIN` from hosting |
| 3 | Create TypeScript types (`class.ts`) | — |
| 4 | Create Apollo client + GraphQL queries | Needs WPGraphQL live on WP |
| 5 | Build Header & Footer (replicate from WP) | Screenshots + CSS from existing site |
| 6 | Build all class components (Hero, Intro, Benefits, AgeGroupTable, ScheduleTabs, CoachNote, PriceNote, FaqAccordion, CtaButton, ComingSoonBanner) | Types from task 3 |
| 7 | Build `app/classes/[slug]/page.tsx` (wire all components) | Tasks 4, 6 |
| 8 | Build `sitemap.ts` and `robots.ts` | Task 4 |
| 9 | Enter content for 9 classes in WP Admin (can run in parallel from task 4) | CPT + ACF live on WP |
| 10 | QA per page + rewrite proxy QA | Tasks 7, 9 |
| 11 | Go-live: DNS cutover to Vercel | QA complete |

---

*This document is the technical frontend breakdown for Phase 1 only. Once the pilot is complete and a decision is made to proceed with the full migration, all components and configuration here can be extended directly as described in `Migration-Plan-Nextjs-Eva-Scolaro.md`.*
