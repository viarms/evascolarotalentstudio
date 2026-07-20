# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 20 July 2026 (rev 5)
**Phase:** Phase 1 complete → Homepage migration active

---

## Overall Status

```
Phase 1 (9 class pages)  ████████████████████  100% done ✅
Homepage (Next.js)       ░░░░░░░░░░░░░░░░░░░░  0% — starting now
Phase 2 (Studio + blog)  ░░░░░░░░░░░░░░░░░░░░  not started
Full migration           ░░░░░░░░░░░░░░░░░░░░  not started
```

---

## Build Status

✅ `npm run build` — clean. All 15 routes compile and pre-render successfully (Next.js 16.2.10 / Turbopack).

```
/classes/[slug]   ISR (revalidate 1h / expire 1y)
/classes          Static (class index page)
/                 ⚠️  No page.tsx yet — falls through to WP proxy (by design until homepage is built)
/robots.txt       Static
/sitemap.xml      Static
```

---

## Phase 1 — What's Built ✅

### Infrastructure
- [x] Next.js 16 + TypeScript + Tailwind v4 project scaffolded
- [x] `next.config.ts` — rewrite proxy: all non-`/classes/*` paths forward to WordPress origin
- [x] `_docs/cloudflare-worker.js` — Cloudflare Worker (production routing layer):
  1. **Redirects `/class/*` → `/classes/*`** (301 permanent) — handles WP CPT URL pattern before Next.js sees the request
  2. Forwards Next.js routes (`/classes/*`, `/_next/*`, static assets, `sitemap.xml`, `robots.txt`) to Vercel
  3. Passes everything else through to WordPress unchanged
- [x] Fonts loaded via `next/font/google` — Archivo Black (display, `--font-archivo-black`) + Inter (body, `--font-inter`); exposed as CSS variables in `globals.css @theme`
- [x] Root layout (`app/layout.tsx`) with Header + Footer + Google Tag Manager + Google Analytics
- [x] `.env.local.example` with all required variables documented
- [x] ISR configured globally (`revalidate = 3600`, 1h)
- [x] Favicon assets in `public/`: `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`
- [x] Brand color tokens in `globals.css`: `--color-brand-red: #B20001`, `--color-brand-red-dark: #8a0001`
- [x] Animation keyframes in `globals.css`: `heroReveal`, `fadeIn`, `ctaPulse`

### Components (all in `src/components/`)
- [x] `layout/Header.tsx` — sticky header, nav links (with Classes + Gallery dropdowns), Join Us WA CTA, mobile hamburger menu; social icons (IG, FB, YT); no logo (matches live WP design); desktop 3-col layout (15% social | 70% nav | 15% Join Us)
- [x] `layout/Footer.tsx` — white ESTS logo, "Trusted by" + partner logos (AIS, Secana, Dyatmika), real address, phone/WA, PT EVA SCOLARO ENTERTAINMENT, footer links, FireStone Studio credit
- [x] `classes/ClassHero.tsx` — full-bleed `next/image`, dark `#121212` fallback, bottom scrim gradient, title pinned bottom-left with `heroReveal` animation
- [x] `classes/ClassIntro.tsx` — scroll-reveal fade+slide via `useInView`
- [x] `classes/BenefitsList.tsx` — staggered left-slide reveal per item
- [x] `classes/AgeGroupTable.tsx`
- [x] `classes/ScheduleTabs.tsx` — dynamic tabs per studio location, stagger-reveal, fade on tab switch, accessible ARIA roles, horizontal scroll on small screens
- [x] `classes/CoachNote.tsx` — left-border accent, slide-in from left
- [x] `classes/PriceNote.tsx` — fade+lift reveal, gray card
- [x] `classes/FaqAccordion.tsx` — CSS grid-rows height transition (no layout thrash), accessible expand/collapse, stagger reveal
- [x] `classes/CtaButton.tsx` — WhatsApp link with pre-filled message per class, `ctaPulse` animation
- [x] `classes/ComingSoonBanner.tsx` — used for Public Speaking
- [x] `hooks/useInView.ts` — lightweight `IntersectionObserver` hook for all scroll-reveal animations; fires once then disconnects

### Data layer
- [x] `src/lib/types/class.ts` — full TypeScript types matching intended ACF structure
- [x] `src/lib/queries/classQueries.ts`:
  - `fetchScheduleForClass(slug)` — WP REST API `/wp/v2/event` CPT; groups by location, sorts by day+time; filters to Sanur Studio + Canggu Studio only (partner school venues excluded); keyword matching via `SLUG_TO_KEYWORDS`
  - `fetchYoastMeta(slug)` — Yoast SEO head JSON from `/wp/v2/class` endpoint
  - `fetchFeaturedImage(slug)` — featured image URL from `_embedded` `wp:featuredmedia`
- [x] `src/lib/schema.ts` — JSON-LD builders: `Course` (with `CourseInstance` + `Schedule` per location), `FAQPage`, combined `@graph` output
- [x] `src/lib/mock/classMock.ts` — dev mock data (superseded by `STATIC_CONTENT` in `page.tsx`; kept as dev reference)
- [x] `src/lib/apollo-client.ts` — Apollo client ready for WPGraphQL if/when preferred over REST

### Class pages
- [x] `src/app/classes/[slug]/page.tsx` — dynamic route for all 9 slugs
  - [x] `STATIC_CONTENT` map: all 9 classes fully populated (intro, benefits, age groups, FAQ, CTA, coachNote, priceNote)
  - [x] Live schedule fetched from WP REST API, grouped by location, sorted by day+time
  - [x] `generateMetadata()` — Yoast override with auto-title detection guard (handles Yoast's fallback title pattern `"Title — Site Name"` correctly; falls back to `seoTitle` from `STATIC_CONTENT`)
  - [x] `generateStaticParams()` — pre-renders all 9 slugs at build time
  - [x] Schema.org `Course` + `FAQPage` JSON-LD on every page
  - [x] `public-speaking` renders `ComingSoonBanner` correctly (status: `coming_soon`)
  - [x] All 8 active classes render full layout
  - [x] `fetchFeaturedImage()` called per page; hero shows WP featured image when set

### SEO files
- [x] `src/app/sitemap.ts` — all 9 `/classes/*` slugs; `public-speaking` at 0.6 priority, rest at 0.8
- [x] `src/app/robots.ts` — allows `/classes/`, points to sitemap URL

### Public assets
- [x] `public/logo.svg` — main ESTS logo
- [x] `public/logo-white.svg` — white ESTS logo (used in Footer)
- [x] `public/ests-logo-white.svg` — alternate white logo variant
- [x] `public/ais-logo.svg`, `public/secana-logo.svg`, `public/dyatmika-logo.svg` — partner logos in Footer
- [x] `public/favicon-16.png`, `public/favicon-32.png`, `public/apple-touch-icon.png` — favicon assets

### Tooling
- [x] `scripts/seed-classes.mjs` — idempotent: creates/updates 9 WP class CPT posts + Yoast SEO meta; reads `.env.local` automatically

### Completed milestones
- [x] **18 Jul 2026** — `npm run seed:classes` run: all 9 class CPT posts created (IDs 7102–7110). Yoast custom title write blocked by WP (P1 #12 below); fallback in `generateMetadata()` handles this correctly for all 9 pages.
- [x] **18 Jul 2026** — Live schedule verified: all 8 active classes show correct Sanur/Canggu data. Toki Hub/Parklife filtered out correctly.
- [x] **18 Jul 2026** — WP data entry error fixed: TOTS BALLET Canggu Saturday `Time_End` corrected to `10:45` (was `22:45`). Verified via REST API.
- [x] **18 Jul 2026** — Hero images: all 9 class CPT posts have featured images assigned in WP Media. Verified via REST API.
- [x] **18 Jul 2026** — YouTube channel URL confirmed correct in `Header.tsx`: `https://www.youtube.com/@evascolarotalentstudio8290`
- [x] **19 Jul 2026** — `npm run build` clean. All 15 routes pre-render without errors or TypeScript warnings.
- [x] **19 Jul 2026** — Cloudflare Worker (`_docs/cloudflare-worker.js`) updated: added `/class/* → /classes/*` 301 redirect (step 1 in routing order) so WP CPT canonical URLs auto-redirect to Next.js slugs. Routing order clarified: redirect → Vercel → WP passthrough.

---

## Phase 1 — What's Remaining ⏳

### P0 — Needed before DNS cutover to Vercel

| # | Task | Where | Notes |
|---|---|---|---|
| **1** | **Deploy Cloudflare Worker to production** | Cloudflare dashboard | `_docs/cloudflare-worker.js` is ready. Go to Cloudflare → Workers → Create → paste code → Deploy. Once live: `https://www.evascolarotalentstudio.com/class/ballet/` should 301 → `/classes/ballet/`. |
| **2** | **Staging test: all routes** | Vercel preview URL | Set `WP_ORIGIN`, `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID` in Vercel env vars. Verify: `/` proxies to WP, `/gallery/` proxies to WP, all 9 `/classes/*` pages render with live schedule data. |
| **3** | **DNS cutover** | Vercel / domain registrar | Point `www` CNAME to `cname.vercel-dns.com`. After live: submit sitemap to GSC, run Lighthouse baseline. |

These can happen in parallel with or after the homepage build — they don't block each other.

---

## Homepage Migration — Next Steps 🚀

**Full plan:** `Plan-Homepage-Nextjs.md`

### Step 0 — Layout refactor (prerequisite, ~30 min)

The white card wrapper is currently in `src/app/layout.tsx`, which means it would wrap the homepage too. Must be moved first.

**What to do:**
1. Create `src/app/classes/layout.tsx` — move the `<div className="flex-1 w-full max-w-[960px]...bg-white...">` wrapper here
2. Update `src/app/layout.tsx` — remove that wrapper div; keep only `<Header>`, `<body>` base styles, `<Footer>`
3. `npm run build` — verify all 9 class pages and `/classes` index still render (they inherit the new `classes/layout.tsx`)

**File diff:**
- `src/app/layout.tsx` — remove inner wrapper div
- New `src/app/classes/layout.tsx` — contains the white card

### Step 1 — Data layer (~1 hour)

Add to `src/lib/queries/classQueries.ts`:

```ts
// Fetches ALL events grouped by location (no keyword filter, no location filter)
// Used by the homepage timetable.
export async function fetchAllSchedules(): Promise<StudioSchedule[]>
```

**Before coding:** audit the WP REST API for the exact `event_location` strings for the 3 school-partner venues:
```bash
curl "https://www.evascolarotalentstudio.com/wp-json/wp/v2/event?per_page=100&_fields=acf" | \
  jq '[.[].acf.event_location] | unique'
```
Use the returned strings to set `HOMEPAGE_LOCATION_ORDER` (Sanur → Canggu → AIS → Dyatmika → Toki Hub).

### Step 2 — Components (~4–6 hours)

New directory: `src/components/home/`

| File | Description |
|---|---|
| `HomeHero.tsx` | Full-bleed, WP featured image via `fetchFeaturedImage`, headline, "Join Us" WA CTA |
| `HomeAbout.tsx` | 2-para studio description + partner logos row |
| `PricingSection.tsx` | 3 pricing cards (180K / 140K / 110K), features list, "Book Free Trial" WA CTA; `id="pricing"` |
| `LocationSection.tsx` | 2 studio cards with address + static map image; `id="location"` |
| `HomeTimetable.tsx` | 5-tab timetable, day-header grouping rows; `id="timetable"` |

### Step 3 — `src/app/page.tsx` (~1–2 hours)

Create the homepage route:
- `HOMEPAGE_CONTENT` constant (hero text, about copy, pricing packs, studio addresses)
- `fetchAllSchedules()` for timetable
- `generateMetadata()` — homepage title/description/OG
- `LocalBusiness` JSON-LD for both studios (Sanur + Canggu)
- `export const revalidate = 3600`
- Update `src/app/sitemap.ts` to include `'/'` (priority 1.0)

### Step 4 — Cloudflare Worker update (~15 min)

In `_docs/cloudflare-worker.js`, add to `shouldRouteToVercel()`:
```js
pathname === "/" ||    // homepage
```
Deploy updated Worker.

### Step 5 — QA (~1–2 hours)

Desktop + 375/390/428px mobile. Verify all 5 timetable tabs, anchor scroll for `/#pricing` and `/#timetable`, WA CTAs, all 9 class page nav links, `npm run build` clean.

---

### P1 — Important but not hard blockers

| # | Task | Notes |
|---|---|---|
| **2** | **Mobile QA** | Test at 375px, 390px, 428px. Focus: ScheduleTabs horizontal scroll on small screens; hero image scaling; Footer partner logos on narrow viewports. |
| **3** | **Lighthouse audit** | Target ≥ 90 mobile for each class page. Run after DNS is pointed (real domain + CDN makes a real difference). |
| **4** | **Business decision: Public Speaking** | Keep `coming_soon` this term or flip to `active`? One-line change: `status: "active"` in `STATIC_CONTENT["public-speaking"]` in `src/app/classes/[slug]/page.tsx`. If flipped, schedule data will load automatically from WP `event` CPT — no other code change needed. |
| **5** | **Enable Yoast custom title write on `class` CPT** | Current workaround in `generateMetadata()` works correctly. To fix permanently in WP, add this to a must-use plugin at `wp-content/mu-plugins/yoast-rest-meta.php`: |

```php
// Allow Yoast SEO meta fields to be written via REST API on the 'class' CPT.
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

After adding, re-run `npm run seed:classes` to write titles correctly. The auto-title detection guard in `page.tsx` can then be simplified (but leaving it in does no harm).

### P2 — Phase 2 items (after homepage go-live)

| # | Task | Doc reference |
|---|---|---|
| **6** | **Homepage → Next.js** | ✅ Plan ready in `Plan-Homepage-Nextjs.md`. Active work — see "Homepage Migration — Next Steps" above. |
| **7** | Studio location pages — `/studio/canggu/` and `/studio/sanur/` | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §10 |
| **8** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF so client can edit without a developer. Types in `class.ts` already mirror the intended structure. |
| **9** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 |
| **10** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T signal for SEO |
| **11** | Breakdance Sanur — open if demand grows | Add events in WP `event` CPT only; no frontend code change needed |
| **12** | `classMock.ts` cleanup | Superseded by `STATIC_CONTENT` in `page.tsx`; can be deleted or kept as dev reference |
| **13** | Registration / Book Free Trial / Feedback forms in Next.js | Replace WA CTA fallback with real forms. React Hook Form + Zod + Resend. See `Migration-Plan-Nextjs-Eva-Scolaro.md` §5. |
| **14** | Full WordPress → Next.js migration | Migrate remaining pages (Gallery, Practice, Dancewear, News, Contact, T&C); move WP to `cms.evascolarotalentstudio.com`. See `Migration-Plan-Nextjs-Eva-Scolaro.md`. |

---

## Next Steps Right Now

**Two parallel tracks:**

### Track A — Phase 1 go-live (can be done any time, independent of Track B)

1. **Deploy Cloudflare Worker** — paste `_docs/cloudflare-worker.js` into Cloudflare dashboard (Workers → Create → paste → Deploy).
2. **Staging test** — add env vars to Vercel, walk through proxy pages + all 9 class pages on preview URL.
3. **DNS cutover** — point `www` CNAME to Vercel. Submit sitemap to GSC. Run Lighthouse baseline.

### Track B — Homepage build (start now)

Do these in order:

**Step 0 — Layout refactor** (30 min, prerequisite)
- Create `src/app/classes/layout.tsx` with the white card wrapper
- Remove white card wrapper from `src/app/layout.tsx`
- `npm run build` — confirm all class pages still render

**Step 1 — Audit WP location strings** (5 min)
```bash
curl "https://www.evascolarotalentstudio.com/wp-json/wp/v2/event?per_page=100&_fields=acf" | \
  jq '[.[].acf.event_location] | unique'
```
Note exact strings for AIS / Dyatmika / Toki Hub before writing `fetchAllSchedules()`.

**Step 2 — `fetchAllSchedules()`** (1 hour)
Add to `src/lib/queries/classQueries.ts`.

**Step 3 — Components** (4–6 hours)
`src/components/home/`: HomeHero → HomeAbout → PricingSection → LocationSection → HomeTimetable.

**Step 4 — `src/app/page.tsx`** (1–2 hours)
Wire everything together with `HOMEPAGE_CONTENT`, metadata, JSON-LD, ISR.

**Step 5 — Worker update + QA + deploy**

---

## Known Issues / Notes

| Issue | Status | Detail |
|---|---|---|
| Yoast custom title write blocked on `class` CPT | ⚠️ Workaround active | `generateMetadata()` auto-detects Yoast's fallback title pattern and ignores it, using `STATIC_CONTENT.seoTitle` instead. All 9 pages render correct titles. Fix: add `mu-plugin` snippet above (P1 #5). |
| Cloudflare Worker not yet deployed to production | ⏳ Pending | `_docs/cloudflare-worker.js` is ready. Needs to be deployed via Cloudflare dashboard (Workers → Create → paste code → Deploy). The `/class/* → /classes/*` redirect and homepage routing will only be live once deployed. |
| Worker bug fixed: `*.png`/`*.svg`/`*.ico` were matching WP deep asset paths | ✅ Fixed in Worker source | Original `pathname.endsWith(".svg")` etc. matched `/wp-content/uploads/photo.png` → routed to Vercel → returned HTML → browser MIME error ("Refused to apply style... MIME type 'text/html'"). Fixed with `isRootLevelFile()` helper that only matches root-level paths (e.g. `/logo.svg`), not paths with subdirectories. |
| `layout.tsx` white card wraps `{children}` | ⏳ Fix in progress | The `<div className="max-w-[960px] ... bg-white">` in `layout.tsx` will be moved to `src/app/classes/layout.tsx` as Step 0 of the homepage build. This unblocks full-bleed homepage sections (hero, timetable, location). |
| `classMock.ts` is dead code | ℹ️ Low priority | Superseded by `STATIC_CONTENT` in `page.tsx`. No component imports it. Safe to delete in cleanup (P2 #11). |

---

## File Map

```
src/
├── app/
│   ├── classes/
│   │   ├── layout.tsx             ← 🔜 Step 0: white card wrapper (move from root layout)
│   │   ├── page.tsx               ← ✅ /classes index (class catalogue)
│   │   └── [slug]/page.tsx        ← ✅ all 9 class pages, STATIC_CONTENT, fetchScheduleForClass
│   ├── layout.tsx                 ← ✅ fonts, GTM/GA, Header, Footer (white card moves out in Step 0)
│   ├── page.tsx                   ← 🔜 Step 3: homepage (doesn't exist yet — / falls to WP proxy)
│   ├── globals.css                ← ✅ brand tokens, base styles, keyframes
│   ├── sitemap.ts                 ← ✅ /classes/* (update in Step 3 to add /)
│   └── robots.ts                  ← ✅ allows /classes/
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← ✅ complete
│   │   └── Footer.tsx             ← ✅ complete
│   ├── classes/
│   │   ├── ClassHero.tsx          ← ✅ WP featured image, heroReveal animation
│   │   ├── ClassIntro.tsx         ← ✅ scroll-reveal
│   │   ├── BenefitsList.tsx       ← ✅ stagger reveal
│   │   ├── AgeGroupTable.tsx      ← ✅
│   │   ├── ScheduleTabs.tsx       ← ✅ dynamic tabs, fade on switch
│   │   ├── CoachNote.tsx          ← ✅ slide-in
│   │   ├── PriceNote.tsx          ← ✅ fade+lift
│   │   ├── FaqAccordion.tsx       ← ✅ grid-rows transition
│   │   ├── CtaButton.tsx          ← ✅ ctaPulse animation
│   │   └── ComingSoonBanner.tsx   ← ✅
│   └── home/                      ← 🔜 Step 2: create this directory + all 5 components
│       ├── HomeHero.tsx
│       ├── HomeAbout.tsx
│       ├── PricingSection.tsx
│       ├── HomeTimetable.tsx
│       └── LocationSection.tsx
├── hooks/
│   └── useInView.ts               ← ✅ IntersectionObserver scroll-reveal hook
├── lib/
│   ├── apollo-client.ts           ← ✅ (ready for WPGraphQL if needed)
│   ├── queries/classQueries.ts    ← ✅ existing fetchers; 🔜 Step 1: add fetchAllSchedules()
│   ├── schema.ts                  ← ✅ Course + FAQPage JSON-LD builders
│   ├── mock/classMock.ts          ← superseded, P2 cleanup
│   └── types/class.ts             ← ✅
public/
│   ├── logo.svg                   ← ✅
│   ├── logo-white.svg             ← ✅
│   ├── ests-logo-white.svg        ← ✅
│   ├── ais-logo.svg               ← ✅
│   ├── secana-logo.svg            ← ✅
│   ├── dyatmika-logo.svg          ← ✅
│   ├── favicon-16.png             ← ✅
│   ├── favicon-32.png             ← ✅
│   ├── apple-touch-icon.png       ← ✅
│   └── og-home.jpg                ← 🔜 needed for Step 3 OG meta (export from Canva, 1200×630)
scripts/
└── seed-classes.mjs               ← ✅ run once per environment
_docs/
├── PROJECT-TRACKER.md             ← this file (rev 5, 20 Jul 2026)
├── cloudflare-worker.js           ← ✅ ready; 🔜 Step 4: add pathname === "/" then deploy
├── Plan-Homepage-Nextjs.md        ← 📋 Homepage migration plan (active)
├── class-pages-seo.md             ← SEO titles & meta descriptions for all 9 class pages
├── Draft-Konten-Halaman-Kelas-Eva-Scolaro.md
├── Frontend-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Nextjs-Eva-Scolaro.md
└── PRD-SEO-Eva-Scolaro-Talent-Studio.md
```
