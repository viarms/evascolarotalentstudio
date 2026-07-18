# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 18 July 2026
**Phase:** Phase 1 — Class Pages (Next.js pilot)

---

## Overall Status

```
Phase 1 (9 class pages)  ████████████░░░░░░░░  ~60% done
Phase 2 (Studio + blog)  ░░░░░░░░░░░░░░░░░░░░  not started
Full migration           ░░░░░░░░░░░░░░░░░░░░  not started
```

---

## Phase 1 — What's Built ✅

### Infrastructure
- [x] Next.js 16 + TypeScript + Tailwind v4 project scaffolded
- [x] `next.config.ts` — rewrite proxy: all non-`/classes/*` paths forward to WordPress origin
- [x] Fonts loaded via `next/font/google` — Archivo Black (display) + Inter (body)
- [x] Root layout with Header + Footer wired in `app/layout.tsx`
- [x] `.env.local.example` with required variables documented
- [x] ISR configured globally (`revalidate = 3600`, 1h)

### Components (all in `src/components/`)
- [x] `layout/Header.tsx` — sticky header, nav links, Join Us / Book Free Trial WA CTAs, mobile hamburger menu
- [x] `layout/Footer.tsx` — nav links, social icons (IG, FB, YT, Spotify, WA), contact columns
- [x] `classes/ClassHero.tsx` — H1 on brand-red background (placeholder until hero images)
- [x] `classes/ClassIntro.tsx`
- [x] `classes/BenefitsList.tsx`
- [x] `classes/AgeGroupTable.tsx`
- [x] `classes/ScheduleTabs.tsx` — dynamic tabs per studio location, accessible ARIA roles
- [x] `classes/CoachNote.tsx`
- [x] `classes/PriceNote.tsx`
- [x] `classes/FaqAccordion.tsx` — accessible expand/collapse
- [x] `classes/CtaButton.tsx` — WhatsApp link with pre-filled message per class
- [x] `classes/ComingSoonBanner.tsx` — used for Public Speaking

### Data layer
- [x] `src/lib/types/class.ts` — full TypeScript types matching intended ACF structure
- [x] `src/lib/queries/classQueries.ts` — WP REST API fetcher for live schedule data (`/wp/v2/event` CPT), Yoast SEO meta fetcher
- [x] `src/lib/mock/classMock.ts` — dev mock data (Ballet + Public Speaking); superseded by real data in `page.tsx`
- [x] `src/lib/apollo-client.ts` — Apollo client (ready for when WPGraphQL is preferred over REST)

### Class pages
- [x] `src/app/classes/[slug]/page.tsx` — dynamic route for all 9 slugs
  - [x] `STATIC_CONTENT` map: all 9 classes fully populated (intro, benefits, age groups, FAQ, CTA)
  - [x] Live schedule fetched from WP REST API, grouped by location, sorted by day+time
  - [x] `generateMetadata()` — Yoast SEO values override static fallback when available
  - [x] `generateStaticParams()` — pre-renders all 9 slugs at build time
  - [x] Schema.org `Course` JSON-LD on every page
  - [x] `public-speaking` renders `ComingSoonBanner` correctly
  - [x] All 8 active classes render full layout

### Tooling
- [x] `scripts/seed-classes.mjs` — idempotent script to create/update 9 WP class CPT posts + Yoast SEO meta (`npm run seed:classes`)

---

## Phase 1 — What's Remaining ⏳

### P0 — Needed before DNS cutover to Vercel

| # | Task | Where | Notes |
|---|---|---|---|
| **1** | ~~Run `npm run seed:classes`~~ | ~~WordPress~~ | ✅ Done 18 Jul 2026. All 9 class CPT posts exist (IDs 7102–7110). Yoast custom title write is blocked (see note below) — fallback logic in `page.tsx` handles this correctly. |
| **2** | ~~Verify live schedule data~~ | ~~Browser / WP Admin~~ | ✅ Done 18 Jul 2026. All 8 active classes show correct Sanur/Canggu data. Partner school tabs (Toki Hub, Parklife) filtered out via `PUBLIC_LOCATIONS` in `classQueries.ts`. One WP data entry error found: Tots Ballet Canggu Saturday `Time_End` shows `22:45` — should be `10:45`. Fix in WP Admin. |
| **3** | Pixel-perfect Header/Footer QA | `Header.tsx`, `Footer.tsx` | Both have TODO comments: replace text logo with actual SVG/PNG (`public/logo.svg`), match exact colors/font sizes from live WP site. Actual social profile URLs need confirming (YouTube, Spotify currently use guesses). |
| **4** | Hero images | `ClassHero.tsx` | Currently solid brand-red placeholder. Upload 1 image per class to WP Media, then uncomment the `next/image` block (TODO is already in `ClassHero.tsx`). |
| **5** | Add sitemap.ts + robots.ts | `src/app/` | Neither file exists yet. Needed for SEO before go-live. See template below. |
| **6** | Staging test: rewrite proxy | Vercel preview | Deploy to Vercel preview URL, set `WP_ORIGIN` to live WP server, verify `/` homepage and other WP pages still load correctly through the proxy before flipping DNS. |

### P1 — Important but not hard blockers

| # | Task | Notes |
|---|---|---|
| **7** | Business decision: Public Speaking | Keep `coming_soon` this term, or flip to `active`? One-line change in `page.tsx` to activate. |
| **8** | Confirm Spotify profile URL in Footer | Currently `https://open.spotify.com` (generic). Update `SOCIAL_LINKS` in `Footer.tsx` with the real URL. |
| **9** | Studio addresses in Footer | `Footer.tsx` has placeholder text "Sanur, Denpasar, Bali" and "Canggu, Badung, Bali". Fill in the real street addresses. |
| **10** | Mobile QA | Test at 375px, 390px, 428px. Focus on ScheduleTabs horizontal scroll on small screens. |
| **11** | Lighthouse audit | Target ≥ 90 mobile for each class page. Run after hero images are added. |
| **12** | Enable Yoast custom title write on `class` CPT | Yoast's `_yoast_wpseo_title` meta key is not REST-writable on custom post types by default. Until fixed, `page.tsx` detects the auto-generated title pattern and falls back to static — all 9 pages render correct SEO titles regardless. To fix permanently, add this to a must-use plugin or `functions.php`: |

```php
// Allow Yoast SEO meta fields to be written via REST API on the 'class' CPT.
// Add to: wp-content/mu-plugins/yoast-rest-meta.php
add_action( 'init', function () {
    foreach ( [ '_yoast_wpseo_title', '_yoast_wpseo_metadesc' ] as $key ) {
        register_meta( 'post', $key, [
            'object_subtype' => 'class',
            'type'           => 'string',
            'single'         => true,
            'show_in_rest'   => true,
            'auth_callback'  => fn() => current_user_can( 'edit_posts' ),
        ] );
    }
} );
```

After adding this, re-run `npm run seed:classes` — titles will write correctly and the auto-title detection guard in `page.tsx` can be simplified.

### P2 — Phase 2 items (after Phase 1 go-live)

| # | Task | Doc reference |
|---|---|---|
| **12** | Studio location pages — `/studio/canggu/` and `/studio/sanur/` | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §10 |
| **13** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF so client can edit without a developer |
| **14** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 |
| **15** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T signal for SEO |
| **16** | Breakdance Sanur — open if demand grows | Add events in WP `event` CPT; no frontend code change needed |
| **17** | `classMock.ts` cleanup | File is now superseded by `STATIC_CONTENT` in `page.tsx`; can be deleted or kept as dev reference |

---

## Next Steps Right Now

In order — do these before touching anything else:

**~~Step 1 — Seed WordPress~~** ✅ Done
All 9 class CPT posts seeded (IDs 7102–7110). Custom Yoast title write silently blocked by WP (see P1 task #12 for the PHP fix) — `page.tsx` handles this correctly via auto-title detection fallback. All 9 pages render the correct full SEO titles.

**~~Step 2 — Verify schedule data on each class page~~** ✅ Done
All 9 class pages verified:
- All 8 active classes show correct schedule data from live WP API
- All pages show only Sanur Studio / Canggu Studio tabs (Toki Hub, Parklife filtered out — fix applied to `classQueries.ts`)
- Breakdance correctly shows only Canggu Studio (single tab)
- Public Speaking correctly shows ComingSoonBanner (no schedule)
- ⚠️ **WP data entry error to fix**: Tots Ballet Canggu Saturday has `Time_End: 22:45` (should be `10:45`). Fix directly in WP Admin → Events → Tots Ballet Canggu Saturday.

**Step 3 — Add sitemap.ts and robots.ts**
Neither file exists. Template (two files, ~30 lines total):

```ts
// src/app/sitemap.ts
import type { MetadataRoute } from "next";

const SLUGS = [
  "hip-hop", "ballet", "singing", "kpop-dance",
  "jazz-dance", "drama-musical-theatre",
  "modeling", "breakdance", "public-speaking",
];
const BASE = "https://www.evascolarotalentstudio.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return SLUGS.map((slug) => ({
    url: `${BASE}/classes/${slug}`,
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

**Step 4 — Logo + Header/Footer polish**
- Drop `logo.svg` (and `logo-white.svg` for footer) into `public/`
- Update `ClassHero.tsx` and both layout components (TODO comments already mark exact locations)
- Confirm real social profile URLs

**Step 5 — Staging test on Vercel preview**
- Deploy branch to Vercel
- Set `WP_ORIGIN` env var to live WP server
- Walk through homepage, price, timetable, gallery (all should proxy through)
- Walk through all 9 class pages (all should render from Next.js)
- If proxy works cleanly → DNS cutover is safe

---

## File Map

```
src/
├── app/
│   ├── classes/[slug]/page.tsx    ← all 9 class pages, STATIC_CONTENT, fetchScheduleForClass
│   ├── layout.tsx                 ← fonts, Header, Footer
│   ├── globals.css
│   ├── sitemap.ts                 ← ❌ missing — create in Step 3
│   └── robots.ts                  ← ❌ missing — create in Step 3
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← ⚠️ logo TODO, social URLs to confirm
│   │   └── Footer.tsx             ← ⚠️ logo TODO, addresses + Spotify URL to fill
│   └── classes/
│       ├── ClassHero.tsx          ← ⚠️ hero image TODO
│       ├── ClassIntro.tsx         ← ✅
│       ├── BenefitsList.tsx       ← ✅
│       ├── AgeGroupTable.tsx      ← ✅
│       ├── ScheduleTabs.tsx       ← ✅
│       ├── CoachNote.tsx          ← ✅
│       ├── PriceNote.tsx          ← ✅
│       ├── FaqAccordion.tsx       ← ✅
│       ├── CtaButton.tsx          ← ✅
│       └── ComingSoonBanner.tsx   ← ✅
├── lib/
│   ├── apollo-client.ts           ← ✅ (ready for WPGraphQL if/when needed)
│   ├── queries/classQueries.ts    ← ✅ REST API fetcher + Yoast meta
│   ├── mock/classMock.ts          ← superseded, keep for dev reference
│   └── types/class.ts             ← ✅
scripts/
└── seed-classes.mjs               ← ✅ run once per environment
_docs/
├── PROJECT-TRACKER.md             ← this file
├── Draft-Konten-Halaman-Kelas-Eva-Scolaro.md
├── Frontend-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Nextjs-Eva-Scolaro.md
└── PRD-SEO-Eva-Scolaro-Talent-Studio.md
```
