# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 18 July 2026 (rev 2)
**Phase:** Phase 1 — Class Pages (Next.js pilot)

---

## Overall Status

```
Phase 1 (9 class pages)  ████████████████░░░░  ~80% done
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
- [x] `layout/Header.tsx` — sticky header, nav links, Join Us WA CTA, mobile hamburger menu; social icons (IG, FB, YT); no logo in header (matches live WP design)
- [x] `layout/Footer.tsx` — ESTS white logo, "Trusted by" partner logos (AIS, Secana, Dyatmika), real address (Jl. Bypass Ngurah Rai No.88A), phone/WA, company name, footer links
- [x] `classes/ClassHero.tsx` — dark `#121212` fallback; shows WP featured image as full-bleed background with dark overlay when available
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
- [x] `src/lib/queries/classQueries.ts` — WP REST API fetcher for live schedule data (`/wp/v2/event` CPT), Yoast SEO meta fetcher, `fetchFeaturedImage()` for hero images
- [x] `src/lib/mock/classMock.ts` — dev mock data (superseded by real data in `page.tsx`; kept as dev reference)
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
  - [x] `fetchFeaturedImage()` called per page — hero image shown if WP Media is uploaded

### SEO files
- [x] `src/app/sitemap.ts` — covers all 9 `/classes/*` slugs; `public-speaking` at 0.6 priority, rest at 0.8
- [x] `src/app/robots.ts` — allows `/classes/`; points to sitemap URL

### Public assets
- [x] `public/logo.svg` — main ESTS logo
- [x] `public/logo-white.svg` — white ESTS logo (used in Footer)
- [x] `public/ests-logo-white.svg` — alternate white logo variant
- [x] `public/ais-logo.svg`, `public/secana-logo.svg`, `public/dyatmika-logo.svg` — partner logos in Footer

### Tooling
- [x] `scripts/seed-classes.mjs` — idempotent script to create/update 9 WP class CPT posts + Yoast SEO meta (`npm run seed:classes`)

### Completed milestones
- [x] **18 Jul 2026** — Run `npm run seed:classes`: all 9 class CPT posts exist (IDs 7102–7110). Yoast custom title write blocked by WP (see P1 #12) — fallback in `page.tsx` handles this correctly.
- [x] **18 Jul 2026** — Verify live schedule: all 8 active classes show correct Sanur/Canggu data. Toki Hub/Parklife tabs filtered out. One WP data entry error found (see below).

---

## Phase 1 — What's Remaining ⏳

### P0 — Needed before DNS cutover to Vercel

| # | Task | Where | Notes |
|---|---|---|---|
| **1** | ~~Seed WordPress~~ | ~~WordPress~~ | ✅ Done 18 Jul 2026 |
| **2** | ~~Verify live schedule data~~ | ~~Browser / WP Admin~~ | ✅ Done 18 Jul 2026 |
| **3** | ~~sitemap.ts + robots.ts~~ | ~~`src/app/`~~ | ✅ Both files exist and are correct |
| **4** | ~~Logo + Header/Footer assets~~ | ~~`public/`~~ | ✅ `logo.svg`, `logo-white.svg`, partner logos all in `public/`. Footer uses real address + company name. |
| **5** | ~~Fix WP data entry error~~ | ~~WP Admin~~ | ✅ Done 18 Jul 2026. TOTS BALLET Canggu Saturday: `10:00–10:45`. JUNIOR BALLET Canggu Saturday: `11:00–12:00`. Both verified via REST API. |
| **6** | ~~Upload hero images to WP Media~~ | ~~WP Admin~~ | ✅ Done 18 Jul 2026. All 9 class posts have featured images assigned (verified via REST API). |
| **7** | ~~Confirm YouTube channel URL in Header~~ | ~~`Header.tsx`~~ | ✅ Confirmed correct: `https://www.youtube.com/@evascolarotalentstudio8290` |
| **8** | Staging test: rewrite proxy | Vercel preview | Deploy to Vercel preview, set `WP_ORIGIN` env var to live WP server. Walk through: homepage, price, timetable, gallery (proxy), then all 9 class pages (Next.js). If clean → DNS cutover is safe. |

### P1 — Important but not hard blockers

| # | Task | Notes |
|---|---|---|
| **9** | Business decision: Public Speaking | Keep `coming_soon` this term, or flip to `active`? One-line change in `STATIC_CONTENT` in `page.tsx` (`status: "active"`). |
| **10** | Mobile QA | Test at 375px, 390px, 428px. Focus on ScheduleTabs horizontal scroll on small screens. |
| **11** | Lighthouse audit | Target ≥ 90 mobile for each class page. Run after hero images are added. |
| **12** | Enable Yoast custom title write on `class` CPT | Until fixed, `page.tsx` auto-detects Yoast's fallback title and uses the static SEO title instead — all 9 pages render correct titles. To fix permanently, add this to a must-use plugin or `functions.php`: |

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
| **13** | Studio location pages — `/studio/canggu/` and `/studio/sanur/` | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §10 |
| **14** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF so client can edit without a developer |
| **15** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 |
| **16** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T signal for SEO |
| **17** | Breakdance Sanur — open if demand grows | Add events in WP `event` CPT; no frontend code change needed |
| **18** | `classMock.ts` cleanup | File is superseded by `STATIC_CONTENT` in `page.tsx`; can be deleted or kept as dev reference |

---

## Next Steps Right Now

In order — do these before touching anything else:

**Step 1 — Fix WP data entry error** ⚠️
WP Admin → Events → find "Tots Ballet Canggu Saturday" → change `Time_End` from `22:45` to `10:45`.

**Step 2 — Upload hero images to WP Media**
For each of the 9 class CPT posts (IDs 7102–7110), upload a suitable hero image in WP Admin → Media, then set it as the featured image on the class post. The Next.js code (`fetchFeaturedImage()` in `classQueries.ts` → `ClassHero.tsx`) is already wired up — no code changes needed. After uploading, ISR will pick up the new images within 1 hour (or force a revalidation).

**Step 3 — Confirm YouTube URL**
Check `Header.tsx` line with `https://www.youtube.com/@evascolarotalentstudio8290` — verify this is the correct channel handle. If wrong, update `SOCIAL_LINKS` in `Header.tsx`.

**Step 4 — Staging test on Vercel preview**
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
│   ├── sitemap.ts                 ← ✅ done
│   └── robots.ts                  ← ✅ done
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← ✅ complete (social icons, nav, Join Us, mobile menu)
│   │   └── Footer.tsx             ← ✅ complete (logo, partners, address, links)
│   └── classes/
│       ├── ClassHero.tsx          ← ✅ WP featured image support wired (images need uploading in WP)
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
│   ├── queries/classQueries.ts    ← ✅ REST API fetcher + Yoast meta + fetchFeaturedImage
│   ├── mock/classMock.ts          ← superseded, keep for dev reference
│   └── types/class.ts             ← ✅
public/
│   ├── logo.svg                   ← ✅
│   ├── logo-white.svg             ← ✅
│   ├── ests-logo-white.svg        ← ✅
│   ├── ais-logo.svg               ← ✅
│   ├── secana-logo.svg            ← ✅
│   └── dyatmika-logo.svg          ← ✅
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
