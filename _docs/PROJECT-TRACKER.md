# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 22 July 2026 (rev 8)
**Phase:** Homepage built → staging + go-live pending

---

## Overall Status

```
Phase 1 (9 class pages)  ████████████████████  100% done ✅
Homepage (Next.js)       ████████████████░░░░  ~80% — built, mock schedule, staging pending
Phase 2 (Studio + blog)  ░░░░░░░░░░░░░░░░░░░░  not started
Full migration           ░░░░░░░░░░░░░░░░░░░░  not started
```

---

## Build Status

⚠️ `npm run build` — last confirmed clean on 19 Jul 2026 (15 routes). Homepage (`"use client"`) added since then — **re-verify before deploy.**

```
/classes/[slug]   ISR (revalidate 1h / expire 1y)
/classes          Static (class index page)
/                 ✅ page.tsx exists — Next.js homepage (client component, GSAP + mock schedule)
/robots.txt       Static
/sitemap.xml      Static
```

---

## What's Built ✅ (complete audit as of 22 Jul 2026)

### Infrastructure
- [x] Next.js 16 + TypeScript + Tailwind v4 scaffolded
- [x] `next.config.ts` — rewrite proxy for all non-Next.js paths → WordPress origin
- [x] `_docs/cloudflare-worker.js` — Cloudflare Worker **fully updated**:
  - Redirects `/class/*` → `/classes/*` (301)
  - Routes `/` to Vercel (homepage)
  - Routes `/classes/*`, `/slideshow/*`, `/api/*`, `/_next/*`, favicons, root-level assets, `sitemap.xml`, `robots.txt` to Vercel
  - Everything else passthrough to WordPress
  - `isRootLevelFile()` helper prevents WP asset paths being misrouted
- [x] Fonts: Archivo Black (`--font-archivo-black`), Inter (`--font-inter`), Licorice (`--font-licorice`), Alumni Sans (`--font-alumni-sans`) — all via `next/font/google`
- [x] Root layout (`app/layout.tsx`): Header + Footer + GTM (`GTM-NKCTQ2DW`) + GA (`G-1JDY0MTPSV`) + SmoothScrollProvider + all 3 modals mounted globally
- [x] `.env.local.example` with all required variables documented
- [x] ISR configured globally (`revalidate = 3600`, 1h)
- [x] Favicon assets: `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`
- [x] Brand color tokens: `--color-brand-red: #B20001`, `--color-brand-red-dark: #8a0001`
- [x] Animation keyframes: `heroReveal`, `fadeIn`, `ctaPulse`
- [x] OG image: `public/og-home.webp` (1024×682) — referenced in root layout metadata

### Layout / routing
- [x] `src/app/classes/layout.tsx` — white card wrapper (`max-w-[960px]`, `bg-white`, shadow) isolated to `/classes/*` routes only
- [x] `src/app/layout.tsx` — clean: Header, Footer, SmoothScrollProvider, modals, GTM/GA only. No white card.

### Components
- [x] `layout/Header.tsx` — sticky, CSS `navSlideDown` entrance (no GSAP), 3-col desktop (15% social | 70% nav | 15% Join Us), Classes + Gallery dropdowns, mobile hamburger, social icons (IG, FB, YT). "Join Us" button dispatches `open-join-us-modal` event. Mobile nav also triggers `open-join-us-modal`.
- [x] `layout/Footer.tsx` — white ESTS logo, "Trusted by" + partner logos (AIS, Secana, Dyatmika), address, phone/WA, PT EVA SCOLARO ENTERTAINMENT, footer links, FireStone Studio credit
- [x] `classes/ClassHero.tsx` — full-bleed `next/image`, `#121212` fallback, bottom scrim, `heroReveal` animation
- [x] `classes/ClassIntro.tsx`, `classes/BenefitsList.tsx`, `classes/AgeGroupTable.tsx`
- [x] `classes/ScheduleTabs.tsx` — dynamic tabs, stagger-reveal, fade on tab switch, ARIA roles, horizontal scroll
- [x] `classes/CoachNote.tsx`, `classes/PriceNote.tsx`, `classes/FaqAccordion.tsx` (CSS grid-rows transition)
- [x] `classes/CtaButton.tsx` — WA link with pre-filled message, `ctaPulse` animation
- [x] `classes/ComingSoonBanner.tsx` — used for Public Speaking
- [x] `classes/ClassBreadcrumb.tsx` — breadcrumb nav for class pages
- [x] `hooks/useInView.ts` — `IntersectionObserver` scroll-reveal hook
- [x] `SmoothScrollProvider.tsx` — Lenis smooth scroll, exposes `LenisContext` / `useLenis()` hook
- [x] `modals/ModalShell.tsx` — `<dialog>`-based shell, calls `lenis.stop()` on open / `lenis.start()` on close, `data-lenis-prevent` on modal body, top-right radial gradient
- [x] `modals/JoinUsModal.tsx` — registration form (parentName, childName, age, classes, studio, WA, email, notes), client validation, dispatched by `open-join-us-modal` event
- [x] `modals/BookTrialModal.tsx` — free trial form (same fields + preferredDay), dispatched by `open-book-trial-modal` event
- [x] `modals/FeedbackModal.tsx` — feedback/contact form, dispatched by `open-feedback-modal` event
- [x] `AboutEvaShader.tsx` + `AboutEvaNavyShader.tsx` — WebGL shader components used in homepage About section

### Data layer
- [x] `src/lib/types/class.ts` — TypeScript types
- [x] `src/lib/queries/classQueries.ts`:
  - `fetchScheduleForClass(slug)` — WP REST API, Sanur + Canggu only, keyword-matched
  - `fetchYoastMeta(slug)` — Yoast SEO head JSON
  - `fetchFeaturedImage(slug)` — featured image URL
- [x] `src/lib/schema.ts` — `Course` + `FAQPage` JSON-LD builders
- [x] `src/lib/email.ts` — Resend utility (`sendEmail()`), FROM + CC from env vars
- [x] `src/lib/apollo-client.ts` — Apollo client (ready for WPGraphQL)
- [x] `src/lib/mock/classMock.ts` — superseded dev reference

### API routes (all via Resend)
- [x] `src/app/api/join-us/route.ts` — Registration form → `FORM_RECIPIENT_AGENT3`, CC `FORM_CC`
- [x] `src/app/api/book-trial/route.ts` — Free Trial form → `FORM_RECIPIENT_AGENT3`, CC `FORM_CC`
- [x] `src/app/api/feedback/route.ts` — Feedback form → `FORM_RECIPIENT_AGENT2`, CC `FORM_CC`

### Class pages
- [x] `src/app/classes/[slug]/page.tsx` — all 9 slugs, `STATIC_CONTENT`, live schedule, `generateMetadata()` with Yoast guard, `generateStaticParams()`, `Course` + `FAQPage` JSON-LD, `ClassBreadcrumb`
- [x] `src/app/classes/page.tsx` — `/classes` index / catalogue

### Homepage (`src/app/page.tsx`) — 80% complete ⚠️
- [x] `"use client"` — GSAP + SplitText animations, crossfade carousel
- [x] `HomeHero` — video background (WP hosted .webm), 85% black overlay, ESTS logo, SplitText word-mask reveal on h1, Join Us CTA button (opens `JoinUsModal`)
- [x] `HomeAbout` — about copy, studio intro, crossfade photo carousel (`public/slideshow/`), WebGL shader (AboutEvaShader)
- [x] `HomePricing` — 3 pricing cards (180K / 140K / 110K), `id="pricing"`, Book Free Trial CTA
- [x] `HomeTimetable` — 5-tab timetable (Sanur, Canggu, AIS, Dyatmika, Toki Hub), `id="timetable"`, day-grouped rows
- [x] `HomeLocation` — 2 studio cards (Sanur + Canggu), addresses, `id="location"`
- [x] `HomeAboutEva` — Eva bio (3 paragraphs, SplitText), Licorice font, AboutEvaNavyShader, Spotify CTA
- [x] All sections inline in `page.tsx` (no separate `src/components/home/` directory — all co-located)
- [x] Cloudflare Worker already routes `pathname === "/"` to Vercel
- [x] `public/og-home.webp` exists (1024×682)
- ✅ **Schedule: live WP data via `fetchAllSchedules()`** — 4 tabs: Sanur · Canggu · AIS (9) · Dyatmika (4). `MOCK_SCHEDULE` retained as graceful fallback.
- ⚠️ **`sitemap.ts`** — does not include `/` yet
- ⚠️ **No `generateMetadata()` or `LocalBusiness` JSON-LD** — page is `"use client"`, metadata lives in root `layout.tsx`
- ⚠️ **`revalidate` export missing** — page is client component, ISR not applicable; root layout metadata used instead

### SEO files
- [x] `src/app/sitemap.ts` — all 9 `/classes/*` slugs; ⚠️ `/` not yet included
- [x] `src/app/robots.ts` — allows `/classes/`, points to sitemap

### Public assets
- [x] `public/logo.svg`, `public/logo-white.svg`, `public/ests-logo-white.svg`
- [x] `public/ais-logo.svg`, `public/secana-logo.svg`, `public/dyatmika-logo.svg`
- [x] `public/favicon-16.png`, `public/favicon-32.png`, `public/apple-touch-icon.png`
- [x] `public/og-home.webp` (1024×682) ✅ exists
- [x] `public/slideshow/` — 12 class photos (`.webp` + `.jpg`) used by About carousel
- [x] `public/classes/` — class hero images directory

### Tooling
- [x] `scripts/seed-classes.mjs` — creates/updates 9 WP class CPT posts + Yoast SEO meta

### Completed milestones
- [x] **18 Jul 2026** — 9 class CPT posts created (IDs 7102–7110), hero images assigned, schedule verified
- [x] **18 Jul 2026** — TOTS BALLET Canggu Saturday `Time_End` fixed (`10:45`, was `22:45`)
- [x] **18 Jul 2026** — YouTube URL confirmed in `Header.tsx`
- [x] **19 Jul 2026** — `npm run build` clean (15 routes)
- [x] **19 Jul 2026** — Cloudflare Worker: `/class/* → /classes/*` redirect added
- [x] **20 Jul 2026** — `src/app/classes/layout.tsx` created; white card moved out of root layout (Step 0 ✅)
- [x] **20–21 Jul 2026** — Homepage `src/app/page.tsx` built (GSAP, video hero, carousel, pricing, timetable, location, About Eva — all sections complete with mock schedule data)
- [x] **21 Jul 2026** — All 3 modal components built (`JoinUsModal`, `BookTrialModal`, `FeedbackModal`) + `ModalShell`
- [x] **21 Jul 2026** — All 3 API routes built (`/api/join-us`, `/api/book-trial`, `/api/feedback`) with Resend + server-side validation
- [x] **21 Jul 2026** — `src/lib/email.ts` — Resend utility wired; all 3 routes use `sendEmail()`
- [x] **21 Jul 2026** — `ClassBreadcrumb.tsx` added to class pages
- [x] **22 Jul 2026** — Navbar GSAP entrance replaced with pure CSS `navSlideDown` keyframe
- [x] **22 Jul 2026** — Lenis smooth scroll live: `SmoothScrollProvider`, `LenisContext`, `useLenis()`; `ModalShell` stops/starts Lenis correctly
- [x] **22 Jul 2026** — Modal body radial gradient moved to top-right
- [x] **22 Jul 2026** — Cloudflare Worker updated: `pathname === "/"` routes to Vercel; `/slideshow/*` and `/api/*` added to Vercel routes
- [x] **22 Jul 2026** — `public/og-home.webp` added (1024×682); referenced in root layout OG metadata
- [x] **22 Jul 2026** — **Cloudflare Worker deployed to production.** `/class/* → /classes/*` 301 redirect live. Homepage (`/`) routes to Vercel. All routing rules active.
- [x] **22 Jul 2026** — `sitemap.ts` updated: `/` added at priority 1.0 (10 entries total).
- [x] **22 Jul 2026** — Watzap chat widget live on all pages. Plain `<script async data-watzapkey="rAMU1787">` in `<head>`. Verified in production.
- [x] **22 Jul 2026** — `fetchAllSchedules()` added to `classQueries.ts`. `/api/schedules` route created (ISR 1h). Homepage timetable wired to live WP data. All 4 tabs live: Sanur (20) · Canggu (20) · AIS (9) · Dyatmika (4). `MOCK_SCHEDULE` retained as graceful fallback.

---

## What's Remaining ⏳

### P0 — Needed before DNS cutover

| # | Task | Where | Est. |
|---|---|---|---|
| **1** | **`fetchAllSchedules()` → wire into homepage** | `src/lib/queries/classQueries.ts` + `src/app/page.tsx` | 1h |
| **2** | **Add `/` to `sitemap.ts`** | `src/app/sitemap.ts` | 5 min |
| **3** | **`npm run build` — verify clean** | Terminal | 5 min |
| **4** | **Add Watzap script** | `src/app/layout.tsx` | 10 min |
| **5** | **Deploy Cloudflare Worker** | Cloudflare dashboard | ✅ Done |
| **6** | **Staging test: all routes** | Vercel preview URL | 1h |
| **7** | **DNS cutover** | Vercel / registrar | — |

### P0 detail

**Task 1 — `fetchAllSchedules()`**

First, audit exact WP location strings:
```bash
curl "https://www.evascolarotalentstudio.com/wp-json/wp/v2/event?per_page=100&_fields=acf" | \
  jq '[.[].acf.event_location] | unique'
```
Then add to `src/lib/queries/classQueries.ts`:
```ts
// Returns ALL events grouped by location (no keyword filter).
// Used by the homepage timetable.
export async function fetchAllSchedules(): Promise<StudioSchedule[]>
```
Then convert `page.tsx` from `"use client"` to a server component that calls `fetchAllSchedules()` at build time — or keep it client and fetch via `useEffect`. **Preferred:** extract the timetable into its own server component, keep the rest of the page client-side for GSAP animations.

**Task 2 — Sitemap**
```ts
// Add to sitemap() return array:
{ url: `${BASE}/`, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 }
```

**Task 4 — Watzap**
Add to `src/app/layout.tsx` (inside `<body>`, after `</SmoothScrollProvider>`):
```tsx
import Script from "next/script";
<Script
  src="https://cdn.watzap.id/widget-api.js"
  data-watzapkey="rAMU1787"
  strategy="lazyOnload"
/>
```

**Task 5 — Cloudflare Worker**
Worker source (`_docs/cloudflare-worker.js`) is already correct — `pathname === "/"` is in. Just needs to be deployed via Cloudflare dashboard (Workers → Create → paste → Deploy).

---

### P1 — Important but not hard blockers

| # | Task | Notes |
|---|---|---|
| **1** | **Cookie consent banner** | Simple client component, `localStorage`, link to `/privacy-notice/`. No third-party library. ~45 min. |
| **2** | **Mobile QA** | 375px / 390px / 428px. Focus: ScheduleTabs horizontal scroll, hero video scaling, Footer partner logos, timetable tabs. |
| **3** | **Lighthouse audit** | Target ≥ 90 mobile per class page. Run after DNS (real CDN matters). |
| **4** | **Business decision: Public Speaking** | One-line flip: `status: "active"` in `STATIC_CONTENT["public-speaking"]` in `classes/[slug]/page.tsx`. Schedule auto-loads from WP. |
| **5** | **Enable Yoast custom title write on `class` CPT** | Workaround in `generateMetadata()` is correct. Permanent fix: `wp-content/mu-plugins/yoast-rest-meta.php` (snippet unchanged from rev 7). |

---

### P2 — After homepage go-live

| # | Task | Notes |
|---|---|---|
| **6** | Studio location pages `/studio/canggu/` + `/studio/sanur/` | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §10 |
| **7** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF |
| **8** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 |
| **9** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T |
| **10** | Breakdance Sanur — open if demand grows | Add events in WP only; no code change |
| **11** | `classMock.ts` cleanup | Superseded by `STATIC_CONTENT`. Safe to delete. |
| **12** | **Privacy Notice page** (`/privacy-notice/`) | Cover forms (Join Us, Book Free Trial, Feedback), WA, cookies, GTM/GA |
| **13** | **Dance Studio for Rent** (`/studio-rental/`) | Facilities, pricing (1F: 400k/hr, 2F: 250k/hr), availability (Mon–Fri 10:00–13:00), Jl. Bypass Ngurah Rai 88A Sanur, WA booking |
| **14** | **Concert page** (`/concert/`) | Content TBD |
| **15** | Full WordPress → Next.js migration | Gallery, Practice, Dancewear, News, Contact, T&C; WP moves to `cms.evascolarotalentstudio.com` |

---

## Known Issues / Notes

| Issue | Status | Detail |
|---|---|---|
| Homepage uses `MOCK_SCHEDULE` as fallback | ✅ Live data active | `fetchAllSchedules()` wired. MOCK_SCHEDULE kept as graceful fallback if API fails. |
| `/` not in `sitemap.ts` | ⚠️ Active | 5-min fix. Task P0 #2. |
| Cloudflare Worker not deployed to production | ✅ Deployed 22 Jul 2026 | Live. `/class/* → /classes/*` redirects active. `pathname === "/"` routes to Vercel. |
| `page.tsx` is `"use client"` — no ISR / `generateMetadata` | ℹ️ By design | Homepage metadata lives in root `layout.tsx`. OG image is set. Acceptable for now; can refactor to server component after launch. |
| Watzap widget not showing | ✅ Fixed 22 Jul 2026 | Plain `<script async data-watzapkey="rAMU1787">` placed in `<head>` (between `<html>` and `<body>` in App Router layout). Works in production — `document.currentScript` requires a real HTTP environment, not Next.js dev server. |
| Yoast custom title write blocked on `class` CPT | ⚠️ Workaround active | `generateMetadata()` handles correctly. Fix via `mu-plugins/yoast-rest-meta.php`. |
| `classMock.ts` is dead code | ℹ️ Low priority | P2 #11. |

---

## File Map

```
src/
├── app/
│   ├── classes/
│   │   ├── layout.tsx             ← ✅ white card wrapper (moved from root layout — done)
│   │   ├── page.tsx               ← ✅ /classes index
│   │   └── [slug]/page.tsx        ← ✅ all 9 class pages
│   ├── api/
│   │   ├── join-us/route.ts       ← ✅ Registration form → Resend
│   │   ├── book-trial/route.ts    ← ✅ Free Trial form → Resend
│   │   └── feedback/route.ts      ← ✅ Feedback form → Resend
│   ├── layout.tsx                 ← ✅ fonts, GTM/GA, Header, Footer, SmoothScrollProvider, 3 modals
│   ├── page.tsx                   ← ✅ homepage (client component, mock schedule ⚠️)
│   ├── globals.css                ← ✅ brand tokens, keyframes
│   ├── sitemap.ts                 ← ✅ /classes/* — ⚠️ add / (P0 #2)
│   └── robots.ts                  ← ✅
├── components/
│   ├── layout/
│   │   ├── Header.tsx             ← ✅ CSS navSlideDown, modal triggers wired
│   │   └── Footer.tsx             ← ✅
│   ├── classes/
│   │   ├── ClassHero.tsx          ← ✅
│   │   ├── ClassBreadcrumb.tsx    ← ✅
│   │   ├── ClassIntro.tsx         ← ✅
│   │   ├── BenefitsList.tsx       ← ✅
│   │   ├── AgeGroupTable.tsx      ← ✅
│   │   ├── ScheduleTabs.tsx       ← ✅
│   │   ├── CoachNote.tsx          ← ✅
│   │   ├── PriceNote.tsx          ← ✅
│   │   ├── FaqAccordion.tsx       ← ✅
│   │   ├── CtaButton.tsx          ← ✅
│   │   └── ComingSoonBanner.tsx   ← ✅
│   ├── modals/
│   │   ├── ModalShell.tsx         ← ✅ Lenis stop/start, top-right gradient
│   │   ├── JoinUsModal.tsx        ← ✅ registration form, Resend
│   │   ├── BookTrialModal.tsx     ← ✅ free trial form, Resend
│   │   └── FeedbackModal.tsx      ← ✅ feedback form, Resend
│   ├── SmoothScrollProvider.tsx   ← ✅ Lenis, LenisContext, useLenis()
│   ├── AboutEvaShader.tsx         ← ✅ WebGL shader (light bg)
│   └── AboutEvaNavyShader.tsx     ← ✅ WebGL shader (dark bg)
├── hooks/
│   └── useInView.ts               ← ✅
├── lib/
│   ├── email.ts                   ← ✅ Resend sendEmail() utility
│   ├── apollo-client.ts           ← ✅
│   ├── queries/classQueries.ts    ← ✅ 3 fetchers — ⚠️ fetchAllSchedules() not yet added
│   ├── schema.ts                  ← ✅ Course + FAQPage JSON-LD
│   ├── mock/classMock.ts          ← superseded, P2 cleanup
│   └── types/class.ts             ← ✅
public/
├── logo.svg, logo-white.svg, ests-logo-white.svg  ← ✅
├── ais-logo.svg, secana-logo.svg, dyatmika-logo.svg  ← ✅
├── og-home.webp                   ← ✅ (1024×682)
├── favicon-16.png, favicon-32.png, apple-touch-icon.png  ← ✅
├── slideshow/                     ← ✅ 12 class photos for homepage carousel
└── classes/                       ← ✅ class hero images
scripts/
└── seed-classes.mjs               ← ✅
_docs/
├── PROJECT-TRACKER.md             ← this file (rev 8, 22 Jul 2026)
├── cloudflare-worker.js           ← ✅ deployed to production (22 Jul 2026)
├── Plan-Homepage-Nextjs.md
├── Plan-Forms-Modal-Resend.md
├── class-pages-seo.md
├── Draft-Konten-Halaman-Kelas-Eva-Scolaro.md
├── Frontend-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Fase1-Halaman-Kelas.md
├── Migration-Plan-Nextjs-Eva-Scolaro.md
└── PRD-SEO-Eva-Scolaro-Talent-Studio.md
```

---

## Next Steps Right Now

**Three tasks tonight (in order, ~90 min total):**

### 1. `fetchAllSchedules()` + wire into homepage (1h)
1. Audit WP location strings: `curl ".../wp/v2/event?per_page=100&_fields=acf" | jq '[.[].acf.event_location] | unique'`
2. Add `fetchAllSchedules()` to `classQueries.ts` (no keyword filter, no location filter — returns all)
3. Convert `MOCK_SCHEDULE` in `page.tsx` to live data — either via `useEffect` fetch (stays client) or extract `HomeTimetable` as a server component (preferred for ISR)

### 2. Sitemap + build check (10 min)
1. Add `{ url: BASE + "/", ... priority: 1.0 }` to `sitemap.ts`
2. `npm run build` — confirm clean

### 3. Watzap + deploy (20 min)
1. Add `<Script src="https://cdn.watzap.id/widget-api.js" data-watzapkey="rAMU1787" strategy="lazyOnload" />` to `layout.tsx`
2. Set Vercel env vars (`WP_ORIGIN`, `NEXT_PUBLIC_WA_NUMBER`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_GA_ID`, `RESEND_API_KEY`, `RESEND_FROM`, `FORM_CC`, `FORM_RECIPIENT_AGENT2`, `FORM_RECIPIENT_AGENT3`)
3. Deploy Cloudflare Worker via dashboard
4. Test staging URL → DNS cutover
