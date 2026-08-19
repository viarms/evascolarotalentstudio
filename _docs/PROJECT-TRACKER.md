# Project Tracker — Eva Scolaro Talent Studio
**Last updated:** 19 August 2026 (rev 15)
**Phase:** Articles (blog) section built ✅ → Bilingual (EN/ID) next

---

## Overall Status

```
Phase 1 (9 class pages)         ████████████████████  100% done ✅
Homepage (Next.js)              ████████████████████  100% done ✅
Phase 2a (Studio location pgs)  ████████████████████  100% done ✅
Articles / blog section         ████████████████████  100% done ✅
Phase 2b (Bilingual EN/ID)      ░░░░░░░░░░░░░░░░░░░░  not started
Phase 2c (Concert page)         ░░░░░░░░░░░░░░░░░░░░  not started
Full migration                  ░░░░░░░░░░░░░░░░░░░░  not started
```

---

## Build Status

✅ `npm run build` — clean on 5 Aug 2026 (26 routes). Articles added 14 Aug 2026.

```
/classes/[slug]   ISR (revalidate 1h)
/classes          Static (class index page)
/articles         ISR (revalidate 1h) ← new
/articles/[slug]  ISR (revalidate 1h) ← new
/                 Static (client component, GSAP + live schedule)
/privacy-notice   Static ✅ (added 24 Jul 2026)
/studio-rental    Static ✅ (added 24 Jul 2026)
/studio/sanur/    Static ✅ (added 5 Aug 2026)
/studio/canggu/   Static ✅ (added 5 Aug 2026)
/robots.txt       Static
/sitemap.xml      ISR (now async — fetches article slugs)
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
- [x] `src/lib/types/article.ts` — TypeScript types for `article` CPT ← new
- [x] `src/lib/queries/classQueries.ts`:
  - `fetchScheduleForClass(slug)` — WP REST API, Sanur + Canggu only, keyword-matched
  - `fetchYoastMeta(slug)` — Yoast SEO head JSON
  - `fetchFeaturedImage(slug)` — featured image URL
- [x] `src/lib/queries/articleQueries.ts` ← new:
  - `fetchArticles(perPage)` — listing page, `_embed` for images + terms
  - `fetchArticleBySlug(slug)` — full post + Yoast meta
  - `fetchAllArticleSlugs()` — for `generateStaticParams`
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
- [x] `src/app/privacy-notice/page.tsx` — Privacy Notice (Static, dark-themed, 11 sections)
- [x] `src/app/studio-rental/page.tsx` — Dance Studio for Rent (Static, 1F 400k/hr · 2F 250k/hr · Mon–Fri 10–13)

### Homepage (`src/app/page.tsx`) — ✅ complete
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
- ✅ **`sitemap.ts`** — `/` included at priority 1.0
- ⚠️ **No `generateMetadata()` or `LocalBusiness` JSON-LD** — page is `"use client"`, metadata lives in root `layout.tsx`
- ⚠️ **`revalidate` export missing** — page is client component, ISR not applicable; root layout metadata used instead

### Studio location pages — ✅ complete (added 5 Aug 2026)
- [x] `src/app/studio/sanur/page.tsx` — Static SEO page targeting "dance studio sanur"
  - `HeroCTAs.tsx` — "use client" CTA buttons, opens BookTrialModal prefilled Sanur
  - `BookTrialButton.tsx` — "use client" WA button
  - `GalleryStrip.tsx` — photo strip component
  - Sections: Hero, About the Studio, Classes Available, Timetable, School Partnerships (AIS/Dyatmika/Toki Hub logos), Pricing, FAQ, Cross-links
  - `LocalBusiness` + `FAQPage` JSON-LD for Sanur
- [x] `src/app/studio/canggu/page.tsx` — Static SEO page targeting "dance studio canggu"
  - `HeroCTAs.tsx` — "use client" CTA buttons, opens BookTrialModal prefilled Canggu
  - `BookTrialButton.tsx` — "use client" WA button
  - `GalleryStrip.tsx` — photo strip component
  - Sections: Hero, About the Studio, Classes Available, Timetable, Pricing, FAQ, Cross-links
  - `LocalBusiness` + `FAQPage` JSON-LD for Canggu
- [x] `sitemap.ts` updated — `/studio/sanur/` and `/studio/canggu/` at priority 0.9
- [x] Cloudflare Worker — ⚠️ needs `/studio/*` routes added and redeployed (see P0 below)

### Article pages — ✅ complete (added 14 Aug 2026, updated 19 Aug 2026)
- [x] `src/lib/types/article.ts` — `ArticleListItem` (with `yoastTitle`, `yoastDescription`, `yoastSlug`), `ArticleSingle`, `YoastArticleMeta`
- [x] `src/lib/queries/articleQueries.ts` — WP REST `/wp/v2/article`
  - `fetchArticles()` — tagged `"articles"` for on-demand revalidation; maps Yoast title/desc/slug; HTML entities decoded
  - `fetchArticleBySlug(slug)` — tagged `"articles"` + `"article-{slug}"`; Yoast meta mapped
  - `fetchAllArticleSlugs()` — for `generateStaticParams`
  - `decodeEntities()` — decodes WP/Yoast HTML entities to plain text
- [x] `src/app/articles/page.tsx` — Archive/listing, ISR 1h, 3-col card grid. Cards use `yoastTitle` / `yoastDescription` / `yoastSlug` with WP fallbacks.
- [x] `src/app/articles/[slug]/page.tsx` — Single post, ISR 1h
  - `generateStaticParams()` — pre-builds all slugs at deploy
  - `generateMetadata()` — Yoast title/desc used directly (no broken regex filter); site-name suffix skipped when Yoast title already contains it
  - `BlogPosting` JSON-LD structured data
  - Breadcrumb nav, `<time dateTime>` for publish + modified dates
- [x] `src/app/api/revalidate/route.ts` — on-demand ISR revalidation (see below)
- [x] `sitemap.ts` — async; includes `/articles/` + all `/articles/[slug]/`
- [x] Header nav — `Articles` link added
- ⚠️ **Cloudflare Worker** — needs `/articles/` and `/articles/*` added to `shouldRouteToVercel()` before deploying (P0 #2)

### On-demand revalidation — ✅ wired (19 Aug 2026)

`POST /api/revalidate` with header `x-revalidate-secret: <REVALIDATE_SECRET>`

**Revalidate a specific article (use after publishing/updating a post in WP):**
```json
{ "type": "article", "slug": "my-post-slug" }
```
Busts: `"articles"` tag, `"article-my-post-slug"` tag, `/articles/` path, `/articles/my-post-slug/` path.

**Revalidate all articles (listing only):**
```json
{ "type": "article" }
```

**Revalidate arbitrary paths (e.g. homepage after a schedule change):**
```json
{ "paths": ["/"] }
```

**WordPress webhook setup (WP Webhooks plugin):**
- URL: `https://www.evascolarotalentstudio.com/api/revalidate`
- Method: POST
- Header: `x-revalidate-secret: <REVALIDATE_SECRET>`
- Trigger: Save Post (article CPT)
- Body: `{"type":"article","slug":"{{post_slug}}"}`

**Manual curl (from terminal):**
```bash
curl -X POST https://www.evascolarotalentstudio.com/api/revalidate \
  -H "Content-Type: application/json" \
  -H "x-revalidate-secret: <REVALIDATE_SECRET>" \
  -d '{"type":"article","slug":"my-post-slug"}'
```

Response includes `revalidatedTags`, `revalidatedPaths`, `timestamp`.

### SEO files
- [x] `src/app/sitemap.ts` — `/` (priority 1.0), `/studio/sanur/` + `/studio/canggu/` (0.9), `/articles/` (0.8), `/studio-rental/` (0.7), all 9 `/classes/*` (0.8 / 0.6), all `/articles/[slug]/` (0.7)
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
- [x] **22 Jul 2026** — **DNS cutover complete.** `www.evascolarotalentstudio.com` CNAME pointed to Vercel. Site live on Next.js.
- [x] **24 Jul 2026** — `src/app/privacy-notice/page.tsx` built (Static, 11 sections: data collected, usage, retention, children's privacy, rights, security, third-party links). Cookie banner `/privacy-notice/` link no longer 404s. Footer updated with Privacy Notice link (internal `<Link>`). Build clean at 21 routes.
- [x] **24 Jul 2026** — `src/app/studio-rental/page.tsx` built (Static). Two-floor rental: 1F 400k/hr · 2F 250k/hr · Mon–Fri 10:00–13:00 · Sanur. WA booking CTA, availability grid, 6-question FAQ, ESTS cross-link. Header nav + Footer + sitemap updated. Build clean at 22 routes.
- [x] **5 Aug 2026** — `src/app/studio/sanur/page.tsx` built (Static, P2 #6). SEO target: "dance studio sanur". Sections: Hero, About, Classes grid, Timetable, School Partnerships (AIS/Dyatmika/Toki Hub), Pricing, FAQ, cross-links. `LocalBusiness` + `FAQPage` JSON-LD. HeroCTAs + BookTrialButton + GalleryStrip co-located.
- [x] **5 Aug 2026** — `src/app/studio/canggu/page.tsx` built (Static, P2 #6). SEO target: "dance studio canggu". Same structure as Sanur page. Separate `LocalBusiness` JSON-LD for Canggu address/geo.
- [x] **5 Aug 2026** — `sitemap.ts` updated: `/studio/sanur/` + `/studio/canggu/` added at priority 0.9. Build clean at 26 routes.
- [x] **10 Aug 2026** — Cloudflare Worker updated: `pathname.startsWith("/studio/")` added to `shouldRouteToVercel()`. `/studio/sanur/` and `/studio/canggu/` now live in production.
- [x] **14 Aug 2026** — Articles (blog) section built. `article` CPT (WP REST base: `article` singular). Archive `/articles/` + single `/articles/[slug]/` — both ISR 1h, server-side rendered, Yoast SEO connected, `BlogPosting` JSON-LD. `sitemap.ts` now async and includes all article URLs. Header nav updated with Articles link. TypeScript clean.
- [x] **19 Aug 2026** — Article Yoast SEO bugs fixed. Three issues resolved:
  - `generateMetadata()` in `articles/[slug]/page.tsx` was discarding the Yoast title on every post due to a faulty regex (`YOAST_AUTO_TITLE_RE` always matched, so `yoastTitleIsCustom` was always `false`). Fix: use `yoast.title` directly when present.
  - `title: { absolute: ... }` was appending ` | Eva Scolaro Talent Studio` even when Yoast title already included the site name, doubling it. Fix: skip the suffix when `yoast.title` is present.
  - Commits: `eeddead` (title/desc fix), `0a3fab0` (listing page Yoast), `dd50fcd` (HTML entity decode), `c1f8c74` (on-demand revalidation).
- [x] **19 Aug 2026** — `/articles` listing page now uses Yoast title, Yoast description, and Yoast canonical slug for each card. `ArticleListItem` type gains `yoastTitle`, `yoastDescription`, `yoastSlug` fields. `fetchArticles()` maps all three. Card title no longer uses `dangerouslySetInnerHTML`.
- [x] **19 Aug 2026** — HTML entity decoding added. `decodeEntities()` helper in `articleQueries.ts` decodes `&#8217;`, `&#8220;`, `&#8221;`, `&#8211;`, `&#8212;`, `&amp;`, `&lt;`, `&gt;`, `&quot;`, and any `&#NNN;` numeric entities. Applied to `excerpt`, `yoastTitle`, `yoastDescription` in both `fetchArticles()` and `fetchArticleBySlug()`.
- [x] **19 Aug 2026** — On-demand ISR revalidation wired for articles. `fetchArticles()` fetch tagged `"articles"`; `fetchArticleBySlug()` tagged `"articles"` + `"article-{slug}"`. `/api/revalidate` updated to accept `{ type: "article", slug?: string }` payload — calls `revalidateTag("articles", "max")`, `revalidateTag("article-{slug}", "max")`, and `revalidatePath("/articles/")` + `"/articles/{slug}/"`. See **On-demand revalidation** section below.

---

## What's Remaining ⏳

---

## What's Remaining ⏳

### P0 — Cloudflare Worker

| # | Task | Status |
|---|---|---|
| **1** | **Add `/studio/*` to Vercel routing block in Worker** | ✅ Done — 10 Aug 2026 |
| **2** | **Add `/articles/` and `/articles/*` to Vercel routing block** | ⏳ Pending |

`pathname.startsWith("/studio/")` added to `shouldRouteToVercel()`. Worker redeployed. `/studio/sanur/` and `/studio/canggu/` now route to Vercel in production.

For articles: add `pathname.startsWith("/articles/")` to `shouldRouteToVercel()` in `_docs/cloudflare-worker.js` and redeploy.

---

### P1 — Bilingual site (EN/ID) — `EVA-SCOLARO-BILINGUAL-PRD.md`

| # | Task | Notes |
|---|---|---|
| **1** | **`next-intl` setup** | Install + configure App Router routing for `/en/` + `/id/`. `next.config.ts` changes. |
| **2** | **Language switcher in Header** | Persistent cookie, no forced auto-redirect for returning visitors |
| **3** | **Translation files** | JSON/TS files for all UI strings (nav, buttons, form labels, pricing labels) |
| **4** | **Translate already-migrated pages** | Homepage, 9 class pages, Studio Rental, Privacy Notice, Studio Sanur, Studio Canggu |
| **5** | **Fix `og:locale` bug** | Currently `og:locale` set to `id_ID` on English-only pages — fix in root layout metadata |
| **6** | **`hreflang` tags on all pages** | `en`, `id`, `x-default` per page |
| **7** | **Bilingual sitemap entries** | Per-locale URLs in `sitemap.ts` |
| **8** | **ID keyword research** | Independent ID meta titles/descriptions — not literal translation of EN metadata |
| **9** | **ACF bilingual fields** | `_en` / `_id` field pairs on WP post types for editorial content (class descriptions etc.) |

**Prerequisite for bilingual:** shared glossary + style guide agreed with client before translation begins (which terms stay EN, tone, location name handling).

---

### P2 — Concert page (`/concert/`)

| # | Task | Notes |
|---|---|---|
| **1** | **Content brief from client** | TBD — what goes on this page? |
| **2** | **Build `/concert/page.tsx`** | Static or ISR depending on content |
| **3** | **Add to sitemap + Cloudflare Worker** | Same pattern as studio pages |

---

### P3 — SEO / quality tasks

| # | Task | Notes |
|---|---|---|
| **1** | **Mobile QA** | 375px / 390px / 428px. Focus: studio pages (new), ScheduleTabs horizontal scroll, timetable tabs, Footer partner logos. |
| **2** | **Lighthouse audit** | Run on `/studio/sanur/` and `/studio/canggu/` (new). Target ≥ 90 mobile. |
| **3** | **Google Business Profile** | Verify profiles for Sanur + Canggu locations — needed for LocalBusiness schema to have full impact |
| **4** | **Testimonials for studio pages** | 2–3 parent quotes per location needed from client (currently placeholder sections) |
| **5** | **Studio photos for location pages** | Interior/exterior photos for Sanur + Canggu (currently using class photos as placeholders) |
| **6** | **Exact addresses + Google Maps embed URLs** | Client to confirm Canggu studio address + both Maps embed URLs |
| **7** | **Submit bilingual sitemap to GSC** | After bilingual launch (Phase 2b) |

---

### P4 — Post-migration / long tail

| # | Task | Notes |
|---|---|---|
| **1** | Blog / educational content (min. 8 articles) | `PRD-SEO-Eva-Scolaro-Talent-Studio.md` §6 Phase 2 — **section built ✅, content from client needed** |
| **2** | School Partnerships page (`/school-partnerships/`) | Social proof + E-E-A-T |
| **3** | ACF field group for static content | Migrate `STATIC_CONTENT` from `page.tsx` into WP ACF |
| **4** | Breakdance Sanur — open if demand grows | Add events in WP only; no code change |
| **5** | `classMock.ts` cleanup | Superseded by `STATIC_CONTENT`. Safe to delete. |
| **6** | Public Speaking activation | One-line: `status: "active"` in `STATIC_CONTENT["public-speaking"]` in `classes/[slug]/page.tsx` |
| **7** | Full WP → Next.js migration | Gallery, Dancewear, News/Blog, Contact, T&C; WP moves to `cms.evascolarotalentstudio.com` |
| **8** | Enable Yoast custom title write on `class` CPT | Permanent fix: `mu-plugins/yoast-rest-meta.php` (snippet in rev 7) |

---

## Known Issues / Notes

| Issue | Status | Detail |
|---|---|---|
| `/articles/*` not routed to Vercel in Cloudflare Worker | ⚠️ Active — P0 #2 | Add `pathname.startsWith("/articles/")` to `shouldRouteToVercel()`, redeploy Worker |
| Article Yoast title discarded by faulty regex | ✅ Fixed 19 Aug 2026 | `YOAST_AUTO_TITLE_RE` always matched → `yoastTitleIsCustom` always `false`. Removed. `yoast.title` now used directly. Commit `eeddead`. |
| Article meta title doubled site name | ✅ Fixed 19 Aug 2026 | `\| Eva Scolaro Talent Studio` suffix now skipped when Yoast title is present. Commit `eeddead`. |
| HTML entities in article titles/excerpts | ✅ Fixed 19 Aug 2026 | `decodeEntities()` added to `articleQueries.ts`. Commit `dd50fcd`. |
| Article listing used WP title/excerpt, not Yoast | ✅ Fixed 19 Aug 2026 | `/articles` cards now use `yoastTitle`, `yoastDescription`, `yoastSlug`. Commit `0a3fab0`. |
| Homepage uses `MOCK_SCHEDULE` as fallback | ✅ Live data active | `fetchAllSchedules()` wired. MOCK_SCHEDULE kept as graceful fallback if API fails. |
| `/studio/*` not routed to Vercel in Cloudflare Worker | ✅ Fixed 10 Aug 2026 | `pathname.startsWith("/studio/")` added to `shouldRouteToVercel()`. Redeployed. |
| `page.tsx` is `"use client"` — no ISR / `generateMetadata` | ℹ️ By design | Homepage metadata lives in root `layout.tsx`. OG image is set. Acceptable for now. |
| `og:locale` set to `id_ID` on English-only pages | ⚠️ Active | Bug in root layout metadata. Fix as part of bilingual setup (P1 #5). |
| Watzap widget not showing | ✅ Fixed 22 Jul 2026 | Plain `<script async data-watzapkey="rAMU1787">` in `<head>`. Works in production. |
| Yoast custom title write blocked on `class` CPT | ⚠️ Workaround active | `generateMetadata()` handles correctly. Permanent fix: `mu-plugins/yoast-rest-meta.php`. |
| `classMock.ts` is dead code | ℹ️ Low priority | P4. Safe to delete. |
| Studio location pages — content placeholders | ⚠️ Active | Testimonials, exact addresses, studio photos, Google Maps embed URLs needed from client. P3 #3–6. |

---

## File Map

```
src/
├── app/
│   ├── classes/
│   │   ├── layout.tsx             ← ✅ white card wrapper (moved from root layout — done)
│   │   ├── page.tsx               ← ✅ /classes index
│   │   └── [slug]/page.tsx        ← ✅ all 9 class pages
│   ├── articles/
│   │   ├── page.tsx               ← ✅ /articles archive (ISR 1h, card grid)
│   │   └── [slug]/page.tsx        ← ✅ /articles/[slug] single post (ISR 1h, BlogPosting JSON-LD)
│   ├── studio/
│   │   ├── sanur/
│   │   │   ├── page.tsx           ← ✅ /studio/sanur/ (Static, LocalBusiness JSON-LD)
│   │   │   ├── HeroCTAs.tsx       ← ✅ "use client" CTA buttons
│   │   │   ├── BookTrialButton.tsx← ✅ "use client" WA button
│   │   │   └── GalleryStrip.tsx   ← ✅ photo strip
│   │   └── canggu/
│   │       ├── page.tsx           ← ✅ /studio/canggu/ (Static, LocalBusiness JSON-LD)
│   │       ├── HeroCTAs.tsx       ← ✅ "use client" CTA buttons
│   │       ├── BookTrialButton.tsx← ✅ "use client" WA button
│   │       └── GalleryStrip.tsx   ← ✅ photo strip
│   ├── privacy-notice/
│   │   ├── page.tsx               ← ✅ /privacy-notice (Static, 11 sections)
│   │   └── FeedbackButton.tsx     ← ✅ "use client" modal trigger
│   ├── studio-rental/
│   │   ├── page.tsx               ← ✅ /studio-rental (Static, 2-floor pricing, FAQ, WA CTA)
│   │   └── BookingButton.tsx      ← ✅ "use client" WA booking button
│   ├── api/
│   │   ├── join-us/route.ts       ← ✅ Registration form → Resend
│   │   ├── book-trial/route.ts    ← ✅ Free Trial form → Resend
│   │   └── feedback/route.ts      ← ✅ Feedback form → Resend
│   ├── layout.tsx                 ← ✅ fonts, GTM/GA, Header, Footer, SmoothScrollProvider, 3 modals
│   ├── page.tsx                   ← ✅ homepage (client component, live schedule)
│   ├── globals.css                ← ✅ brand tokens, keyframes
│   ├── sitemap.ts                 ← ✅ / + /studio/* + /classes/* + /studio-rental/
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
│   ├── queries/classQueries.ts    ← ✅ fetchScheduleForClass, fetchAllSchedules, fetchYoastMeta, fetchFeaturedImage
│   ├── queries/articleQueries.ts  ← ✅ fetchArticles, fetchArticleBySlug, fetchAllArticleSlugs
│   ├── schema.ts                  ← ✅ Course + FAQPage JSON-LD
│   ├── email.ts                   ← ✅ Resend sendEmail() utility
│   ├── mock/classMock.ts          ← superseded, P4 cleanup
│   ├── types/class.ts             ← ✅
│   └── types/article.ts           ← ✅
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
├── PROJECT-TRACKER.md             ← this file (rev 13, 10 Aug 2026)
├── EVA-SCOLARO-BILINGUAL-PRD.md   ← ✅ bilingual PRD (Phase 2b spec)
├── cloudflare-worker.js           ← ✅ deployed (10 Aug 2026) — /studio/* routing added
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

### 1. Update Cloudflare Worker — P0 #2 (BLOCKING for articles in production)
Add `pathname.startsWith("/articles/")` to `shouldRouteToVercel()` in `_docs/cloudflare-worker.js`, then redeploy the Worker. Without this, `/articles/*` requests will passthrough to WordPress and 404.

### 2. Publish articles in WordPress
The frontend is ready. Go to WP Admin → Articles (CPT) → Add New. Assign a featured image, categories, and fill in the Yoast SEO fields (title + meta description). The Next.js frontend will pick them up on the next revalidation (1 hour) or via the `/api/revalidate` webhook.

### 3. Start bilingual (EN/ID) — Phase 2b
See `_docs/EVA-SCOLARO-BILINGUAL-PRD.md` for full spec. First step: `npm install next-intl`, then configure App Router i18n routing. Prerequisite: agree glossary + tone guide with client before any translation.

### 4. Gather content from client (unblocks studio pages and bilingual)
- Exact Canggu studio address + opening hours
- Google Maps embed URLs for Sanur + Canggu
- 2–3 parent testimonial quotes per location
- Interior/exterior studio photos for both locations
