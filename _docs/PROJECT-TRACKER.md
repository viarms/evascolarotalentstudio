# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 19 July 2026 (rev 4)
**Phase:** Phase 1 — Class Pages (Next.js pilot)

---

## Overall Status

```
Phase 1 (9 class pages)  ██████████████████░░  ~90% done
Phase 2 (Studio + blog)  ░░░░░░░░░░░░░░░░░░░░  not started
Full migration           ░░░░░░░░░░░░░░░░░░░░  not started
```

---

## Build Status

✅ `npm run build` — clean. All 15 routes compile and pre-render successfully (Next.js 16.2.10 / Turbopack).

```
/classes/[slug]   ISR (revalidate 1h / expire 1y)
/                 Static (WP proxy placeholder)
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
| **1** | **Staging test: rewrite proxy + Cloudflare Worker** | Vercel preview + CF Worker staging | Deploy branch to Vercel. Set `WP_ORIGIN` env var. Walk through: `/` (homepage proxy), `/gallery/`, `/practice/`, `/dancewear/`, `/announcement/` — all should return 200 from WP. Then walk all 9 `/classes/*` pages. Also verify Worker redirect: `https://www.evascolarotalentstudio.com/class/ballet/` should 301 → `/classes/ballet/` (once Worker is deployed to production). If clean → DNS cutover is safe. |

That's the only remaining P0 blocker. Everything else is done or is a P1/P2 item.

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

### P2 — Phase 2 items (after Phase 1 go-live)

| # | Task | Doc reference |
|---|---|---|
| **6** | Studio location pages — `/studio/canggu/` and `/studio/sanur/` | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §10 |
| **7** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF so client can edit without a developer. Types in `class.ts` already mirror the intended structure. |
| **8** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 |
| **9** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T signal for SEO |
| **10** | Breakdance Sanur — open if demand grows | Add events in WP `event` CPT only; no frontend code change needed |
| **11** | `classMock.ts` cleanup | Superseded by `STATIC_CONTENT` in `page.tsx`; can be deleted or kept as dev reference |
| **12** | Full WordPress → Next.js migration | Migrate remaining pages (Home, Gallery, Practice, Dancewear, News, Contact, T&C); move WP to `cms.evascolarotalentstudio.com`; implement Resend forms. See `Migration-Plan-Nextjs-Eva-Scolaro.md`. |

---

## Next Steps Right Now

**Only one thing stands between the current code and going live:**

### Step 1 — Staging test on Vercel preview

1. Push current branch to Git remote.
2. In Vercel dashboard → project → Settings → Environment Variables, add:
   - `WP_ORIGIN` = `https://evascolarotalentstudio.com` (the live WP server before DNS changes)
   - `NEXT_PUBLIC_WA_NUMBER` = `6282146284464`
   - `NEXT_PUBLIC_GTM_ID` = `GTM-NKCTQ2DW`
   - `NEXT_PUBLIC_GA_ID` = `G-1JDY0MTPSV`
3. Open the Vercel preview URL and check each of these:
   - `[preview-url]/` → should proxy to WordPress homepage ✓
   - `[preview-url]/gallery/` → WP gallery page ✓
   - `[preview-url]/practice/` → WP practice page ✓
   - `[preview-url]/announcement/` → WP news page ✓
   - `[preview-url]/classes/hip-hop/` → Next.js renders, schedule table shows Sanur + Canggu data ✓
   - `[preview-url]/classes/ballet/` → hero image appears ✓
   - `[preview-url]/classes/public-speaking/` → ComingSoonBanner shows, no schedule ✓
   - Check mobile (DevTools → 390px) for all 9 class pages
4. Once Worker is deployed to Cloudflare: verify `https://www.evascolarotalentstudio.com/class/ballet/` returns a 301 redirect to `https://www.evascolarotalentstudio.com/classes/ballet/`
5. If all proxy, class pages, and redirect pass → proceed to DNS cutover (point `www` A record / CNAME to Vercel).

### After go-live

Once DNS is live, run these in order:
1. Submit `https://www.evascolarotalentstudio.com/sitemap.xml` to Google Search Console.
2. Check GSC → URL Inspection on a few class pages — verify indexed, no noindex signals.
3. Run Lighthouse on 2–3 class pages to baseline mobile score.
4. Decide on Public Speaking status (P1 #4).

---

## Known Issues / Notes

| Issue | Status | Detail |
|---|---|---|
| Yoast custom title write blocked on `class` CPT | ⚠️ Workaround active | `generateMetadata()` auto-detects Yoast's fallback title pattern and ignores it, using `STATIC_CONTENT.seoTitle` instead. All 9 pages render correct titles. Fix: add `mu-plugin` snippet above (P1 #5). |
| Cloudflare Worker not yet deployed to production | ⏳ Pending | `_docs/cloudflare-worker.js` is the reference/source for the Worker. It still needs to be deployed via the Cloudflare dashboard (Workers → Create → paste code). The `/class/* → /classes/*` redirect will only be live once deployed. |
| Worker bug fixed: `*.png`/`*.svg`/`*.ico` were matching WP deep asset paths | ✅ Fixed in Worker source | Original `pathname.endsWith(".svg")` etc. matched `/wp-content/uploads/photo.png` → routed to Vercel → returned HTML → browser MIME error ("Refused to apply style... MIME type 'text/html'"). Fixed with `isRootLevelFile()` helper that only matches root-level paths (e.g. `/logo.svg`), not paths with subdirectories. |
| `layout.tsx` white card wraps `{children}` | ℹ️ By design | The `<div className="max-w-[960px] ... bg-white">` in `layout.tsx` clips the class page body sections inside a card. `ClassHero` is a sibling inside `<main>`, so it renders inside the card, not full-bleed across the viewport. This matches the current intended design (dark page bg + white content card). If truly full-bleed hero is wanted later, `ClassPage` would need to use a layout that breaks out of the card — defer to Phase 2 redesign if needed. |
| `classMock.ts` is dead code | ℹ️ Low priority | Superseded by `STATIC_CONTENT` in `page.tsx`. No component imports it. Safe to delete in cleanup (P2 #11). |

---

## File Map

```
src/
├── app/
│   ├── classes/[slug]/page.tsx    ← all 9 class pages, STATIC_CONTENT, fetchScheduleForClass
│   ├── layout.tsx                 ← fonts, GTM/GA, Header, Footer, white-card layout
│   ├── page.tsx                   ← dev placeholder (WP proxies this in prod)
│   ├── globals.css                ← brand tokens, base styles, keyframes
│   ├── sitemap.ts                 ← ✅ /classes/* only
│   └── robots.ts                  ← ✅ allows /classes/
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← ✅ complete
│   │   └── Footer.tsx             ← ✅ complete
│   └── classes/
│       ├── ClassHero.tsx          ← ✅ WP featured image, heroReveal animation
│       ├── ClassIntro.tsx         ← ✅ scroll-reveal
│       ├── BenefitsList.tsx       ← ✅ stagger reveal
│       ├── AgeGroupTable.tsx      ← ✅
│       ├── ScheduleTabs.tsx       ← ✅ dynamic tabs, fade on switch
│       ├── CoachNote.tsx          ← ✅ slide-in
│       ├── PriceNote.tsx          ← ✅ fade+lift
│       ├── FaqAccordion.tsx       ← ✅ grid-rows transition
│       ├── CtaButton.tsx          ← ✅ ctaPulse animation
│       └── ComingSoonBanner.tsx   ← ✅
├── hooks/
│   └── useInView.ts               ← ✅ IntersectionObserver scroll-reveal hook
├── lib/
│   ├── apollo-client.ts           ← ✅ (ready for WPGraphQL if needed)
│   ├── queries/classQueries.ts    ← ✅ schedule + Yoast + featuredImage fetchers
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
│   └── apple-touch-icon.png       ← ✅
scripts/
└── seed-classes.mjs               ← ✅ run once per environment
_docs/
├── PROJECT-TRACKER.md             ← this file
├── cloudflare-worker.js           ← ✅ Cloudflare Worker: /class/* redirect + Vercel routing + WP passthrough
├── class-pages-seo.md             ← SEO titles & meta descriptions for all 9 class pages
├── Draft-Konten-Halaman-Kelas-Eva-Scolaro.md
├── Frontend-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Nextjs-Eva-Scolaro.md
└── PRD-SEO-Eva-Scolaro-Talent-Studio.md
```
