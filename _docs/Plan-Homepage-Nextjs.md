# Plan: Homepage Migration — WordPress → Next.js
## Eva Scolaro Talent Studio

**Status:** Planning
**Last updated:** 19 July 2026
**Depends on:** Phase 1 (class pages) fully live — DNS already pointing to Vercel

---

## Why

The WordPress + Elementor homepage is the heaviest page on the site:
- Elementor loads a full page builder runtime (~150–300 KB extra JS/CSS, render-blocking)
- Timetable section renders 5 location tabs via JS accordion — content behind JS tabs is harder for Google to index
- No structured data on the homepage (no `LocalBusiness`, no `Course` schema)
- Next.js ISR equivalent would be: pre-rendered HTML at build time, revalidated every hour from WP REST API — no client-side rendering for above-the-fold content

Expected outcome: LCP drops from ~4–6s to ~1–2s. Core Web Vitals pass. Timetable content fully crawlable.

---

## Scope

### In scope
- `/` — the homepage, rendered by Next.js
- All 6 visible sections (Hero, About, Pricing, Timetable, Location, CTAs)
- Full timetable for all 5 locations (Sanur Studio, Canggu Studio, AIS School CCAs, Dyatmika School ECAs, Toki Hub)
- `LocalBusiness` schema.org JSON-LD for both studios
- `generateMetadata()` for homepage title/description/OG
- Cloudflare Worker update: route `/` (and any other homepage-related paths) to Vercel

### Out of scope (deferred)
- Registration / Book Free Trial / Feedback **forms** — keep as WhatsApp CTAs for now (same approach as class pages). Full form rebuild (Resend) is Phase 2.
- Gallery, Practice, Dancewear, News pages — still proxied to WordPress
- Homepage hero video (if any) — defer; use static image first
- Popup modal rebuild — deferred to Phase 2

---

## Homepage Sections (from live site)

| # | Section | Content | Dynamic? |
|---|---|---|---|
| 1 | **Hero** | Full-bleed image, headline "Bali's #1 Performing Arts Studio for Kids in SANUR & CANGGU!", "Join Us" WA CTA | Static |
| 2 | **About** | 2-paragraph studio description, partner logos (AIS, Secana, Dyatmika) | Static |
| 3 | **Pricing** | 3 packs (180K / 140K / 110K), features list per pack, "Book Free Trial" WA CTA | Static (prices rarely change) |
| 4 | **Timetable** | Class schedule tabs: Sanur Studio / Canggu Studio / AIS School CCAs / Dyatmika School ECAs / Toki Hub. Each tab: days → classes with coach + time. | **Live from WP `event` CPT** (ISR 1h) |
| 5 | **Location** | Two studio addresses + Google Maps embeds. Canggu & Sanur. | Static |
| 6 | **CTAs** | "Join Us" + "Book Free Trial" — both WA links | Static |

---

## Data Strategy

### Timetable
The WP `event` CPT is already the data source for class pages. The homepage needs **all** locations instead of filtering to Sanur/Canggu only.

New function needed in `classQueries.ts`:

```ts
// Fetches ALL events grouped by location (no keyword filter, no location filter)
// Used by the homepage timetable.
export async function fetchAllSchedules(): Promise<StudioSchedule[]>
```

Location display order on homepage:
1. Sanur Studio
2. Canggu Studio
3. AIS School CCAs
4. Dyatmika School ECAs
5. Toki Hub

This matches the tab order on the existing WP site.

### Everything else
Static — hardcoded in `HOMEPAGE_CONTENT` constant in `src/app/page.tsx`, same pattern as `STATIC_CONTENT` in the class pages. No CMS dependency for pricing, about text, addresses.

### Pricing
If prices change, it's a code change — same situation as today (prices are hardcoded in Elementor). Migrating to ACF is a Phase 2 improvement.

---

## Components to Build

All new components go in `src/components/home/`.

| Component | Description | Reuses? |
|---|---|---|
| `HomeHero.tsx` | Full-bleed image, headline, "Join Us" WA CTA button | Pattern from `ClassHero.tsx` |
| `HomeAbout.tsx` | Studio description paragraphs + partner logos row | Partner logos already in `public/` (AIS, Secana, Dyatmika) — same as Footer |
| `PricingSection.tsx` | 3 pricing cards side by side, features list, "Book Free Trial" CTA | New |
| `HomeTimetable.tsx` | Tabs for 5 locations, day headers, class rows with coach + time. | Extend `ScheduleTabs.tsx` pattern — but needs to handle 5 locations and a "day" grouping row |
| `LocationSection.tsx` | Two studio cards side by side: address, phone, Google Maps iframe | New |

### Existing components reused as-is
- `Header.tsx` — no change needed (nav links already point to `/#pricing`, `/#timetable`)
- `Footer.tsx` — no change needed
- `CtaButton.tsx` — reused for CTAs

---

## Timetable Component Design

This is the most complex part. The live WP timetable has:
- **Outer tabs** — one per location (5 tabs)
- **Within each tab** — grouped by day (Monday → Saturday)
- **Within each day** — list of classes (name, coach, start time, end time)

`ScheduleTabs.tsx` (used on class pages) handles location tabs + class rows already. The homepage version differs only in:
1. No keyword filter — shows all classes at that location
2. Day headers between rows (the class page version shows day as a column, homepage shows day as a section header)
3. 5 locations instead of 2

Options:
- **A (recommended):** Create `HomeTimetable.tsx` as a new component — it uses the same tab pattern from `ScheduleTabs.tsx` but with day-header grouping. Copy what's needed rather than making `ScheduleTabs` do double duty.
- **B:** Extend `ScheduleTabs.tsx` with a `groupByDay` prop. Adds complexity to a component that's already stable.

→ Go with **Option A**.

---

## Forms Strategy

The existing WP forms (Registration, Book Free Trial, Feedback) submit to `fstdoservo.com`. Rebuilding them is a significant effort (form validation, Resend integration, email templates, testing).

**For this phase:** replace with WhatsApp CTAs, same as the class pages:
- "Join Us" → `wa.me/6282146284464?text=Hi, I'd like to join Eva Scolaro Talent Studio!`
- "Book Free Trial" → `wa.me/6282146284464?text=Hi, I'd like to book a free trial class!`

This is already what the class pages do. Users already expect WA as a primary contact channel.

**Phase 2:** rebuild forms with React Hook Form + Zod + Resend, matching the existing field structure (parent name, child name/age, class interest, location, WA number).

---

## Routing Change

### Cloudflare Worker

Add `/` to the Vercel routing rules:

```js
function shouldRouteToVercel(pathname) {
  return (
    pathname === "/" ||                   // ← add this
    pathname.startsWith("/classes") ||
    pathname.startsWith("/_next/") ||
    // ... rest unchanged
  );
}
```

### `next.config.ts`

No change needed — there are no rewrites in `next.config.ts` (routing is handled by the Worker in production).

### Anchor links
The nav links `/#pricing` and `/#timetable` will work automatically once the homepage is in Next.js — the browser scrolls to elements with `id="pricing"` and `id="timetable"` on the page.

---

## SEO

```ts
// src/app/page.tsx
export const metadata: Metadata = {
  title: "Eva Scolaro Talent Studio — Performing Arts Classes for Kids in Bali",
  description:
    "Bali's #1 performing arts studio for kids aged 3–16. Ballet, Hip-Hop, Singing, Drama, K-Pop & more in Sanur & Canggu. Free trial available!",
  openGraph: {
    title: "Eva Scolaro Talent Studio",
    description: "Performing arts classes for kids in Sanur & Canggu, Bali.",
    url: "https://www.evascolarotalentstudio.com",
    images: [{ url: "/og-home.jpg", width: 1200, height: 630 }],
  },
};
```

### JSON-LD: LocalBusiness (x2)

Add `LocalBusiness` schema for both studio locations — this directly feeds Google Maps / local pack results.

```json
{
  "@type": "LocalBusiness",
  "name": "Eva Scolaro Talent Studio — Sanur",
  "address": { "streetAddress": "...", "addressLocality": "Sanur", "addressRegion": "Bali" },
  "telephone": "+6282146284464",
  "url": "https://www.evascolarotalentstudio.com",
  "geo": { "@type": "GeoCoordinates", "latitude": ..., "longitude": ... }
}
```

Also add an `ItemList` of the 9 class pages as `hasOfferCatalog` — internal linking signal for SEO.

---

## Layout Consideration

Class pages use a white content card (`max-w-[960px] bg-white rounded shadow`). The homepage should break out of this card — the Hero, Timetable, and Location sections are designed to be full-width with their own backgrounds.

Options:
- **A (recommended):** Homepage gets its own layout — no white card wrapper. Create `src/app/(home)/layout.tsx` or simply don't wrap `page.tsx` children in the card. The simplest approach: move the white card from `layout.tsx` into each class page, so `layout.tsx` only provides Header + Footer.
- **B:** Keep the card in `layout.tsx`, override with `-mx-6 -my-10` negative margins on full-bleed sections (brittle, not recommended).

→ **Option A** is the right call. The white card in `layout.tsx` was always a class-page-specific design, not a site-wide pattern. Refactor `layout.tsx` to remove the card, and add it explicitly inside `src/app/classes/[slug]/page.tsx` or a `classes` route group layout.

This is a small but meaningful refactor — needs to be done before the homepage is built.

---

## Implementation Order

### Step 0 — Layout refactor (prerequisite)
Move the white card wrapper out of `layout.tsx` and into a `/classes` route group layout (`src/app/classes/layout.tsx`). This decouples the homepage from the class page card design.

Files affected:
- `src/app/layout.tsx` — remove `<div className="max-w-[960px]...bg-white...">` wrapper
- Create `src/app/classes/layout.tsx` — add the white card wrapper here
- Verify: `npm run build` still clean, all 9 class pages still render correctly

### Step 1 — Data layer
Add `fetchAllSchedules()` to `src/lib/queries/classQueries.ts`:
- No keyword filter
- No location filter (include all locations except the WP placeholder)
- Same day-sort logic as `fetchScheduleForClass`
- Location display order: Sanur → Canggu → AIS → Dyatmika → Toki Hub

### Step 2 — Components
Build in this order (each is independent):
1. `HomeHero.tsx`
2. `HomeAbout.tsx`
3. `PricingSection.tsx`
4. `HomeTimetable.tsx` (most complex — do last among components)
5. `LocationSection.tsx`

### Step 3 — `src/app/page.tsx`
Wire everything together:
- `HOMEPAGE_CONTENT` constant with all static data (hero text, about copy, pricing, addresses)
- `fetchAllSchedules()` call for timetable
- `generateMetadata()` for SEO
- `LocalBusiness` JSON-LD (two locations)
- ISR: `export const revalidate = 3600`

### Step 4 — Cloudflare Worker update
Add `pathname === "/"` to `shouldRouteToVercel()` in `_docs/cloudflare-worker.js`.
Deploy updated Worker to Cloudflare.

### Step 5 — QA
- Desktop + mobile (375px, 390px, 428px)
- All 5 timetable location tabs load correct data
- Anchor links (`/#pricing`, `/#timetable`) scroll correctly
- "Join Us" and "Book Free Trial" WA links open correct conversation
- All 9 class page links from homepage nav + timetable still work
- `npm run build` clean

---

## Risks

| Risk | Mitigation |
|---|---|
| Timetable data mismatch vs WP version | QA all 5 tabs row-by-row against the live WP site before deploying Worker change |
| Layout refactor breaks class pages | Keep the class pages working throughout — build `classes/layout.tsx` first, verify build, then touch `layout.tsx` |
| Homepage hero image not available in `public/` | Fetch from WP featured image on the homepage post, same pattern as class hero images (`fetchFeaturedImage`) |
| AIS / Dyatmika / Toki Hub event data has inconsistent `event_location` values | Audit the REST API response before building `fetchAllSchedules()` — check exact location strings |
| Anchor scroll on `/#pricing` and `/#timetable` may not work with Next.js Link navigation | Use plain `<a href="/#pricing">` in Header (already the case in `Header.tsx`) — no change needed |

---

## Open Questions (decide before starting)

1. **Hero image** — use the existing WP featured image for the homepage post, or supply a dedicated `/public/hero-home.jpg`? Recommend fetching from WP (consistent with class pages) for now.
2. **Pricing data in CMS** — stay hardcoded for this phase (same as now), or add an ACF field group for pricing so the client can update without a code deploy? Recommend: hardcode for now, ACF migration is Phase 2.
3. **Google Maps embed** — use `<iframe>` embeds (simplest), or static map images with links (faster, no third-party JS)? Recommend static images for performance.
4. **OG image** — need a dedicated `og-home.jpg` (1200×630) for social sharing. Does one exist? If not, create or export from Canva.

---

## Estimated Effort

| Task | Estimate |
|---|---|
| Step 0 — Layout refactor | 30 min |
| Step 1 — `fetchAllSchedules()` | 1 hour |
| Step 2 — Components (all 5) | 4–6 hours |
| Step 3 — `page.tsx` wiring | 1–2 hours |
| Step 4 — Worker update + deploy | 15 min |
| Step 5 — QA | 1–2 hours |
| **Total** | **~8–12 hours** |

---

## What This Unlocks

After the homepage is in Next.js:
- Only remaining pages still proxied to WP: `/gallery/`, `/practice/`, `/dancewear/`, `/announcement/`, `/contact/`, `/terms-conditions/`
- The "strangler fig" migration is ~30% complete (homepage + 9 class pages = the highest-traffic pages)
- Full WordPress → Next.js migration (Phase 2) becomes a matter of converting those 6 remaining pages one at a time

---

*See `Migration-Plan-Nextjs-Eva-Scolaro.md` for the full Phase 2 migration plan.*
