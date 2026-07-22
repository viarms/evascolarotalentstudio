# Tonight's Go-Live Checklist — Eva Scolaro Talent Studio
**Date:** 22 July 2026
**Goal:** Homepage ready → staging test → DNS cutover

---

## Quick Wins (ordered by priority)

### ✅ Task 1 — Build check (5 min)
**What:** Verify `npm run build` is clean after homepage was added.  
**Why:** Homepage is `"use client"` with GSAP — needs verification.  
**How:**
```bash
npm run build
```
**Success:** All routes compile, no TS errors, no warnings.

---

### ✅ Task 2 — Add `/` to sitemap (5 min)
**File:** `src/app/sitemap.ts`  
**Change:**
```ts
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...CLASS_SLUGS.map((slug) => ({
      url: `${BASE}/classes/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: slug === "public-speaking" ? 0.6 : 0.8,
    }))
  ];
}
```

---

### ✅ Task 3 — Add Watzap widget (10 min)
**File:** `src/app/layout.tsx`  
**Change:** Add to `<body>` after `</SmoothScrollProvider>`:
```tsx
import Script from "next/script";

// Inside <body>, after <Footer /> and before <GoogleAnalytics />:
<Script
  src="https://cdn.watzap.id/widget-api.js"
  data-watzapkey="rAMU1787"
  strategy="lazyOnload"
/>
```

**Success:** Widget loads bottom-right. Label "Hi it's Lola, let's have a chat!" (configured in Watzap dashboard — no code change needed).

---

### 🟡 Task 4 — Wire live schedule into homepage (1h)

**Current state:** Homepage uses `MOCK_SCHEDULE` hardcoded data.  
**Goal:** Replace with live WP data via `fetchAllSchedules()`.

#### Step 4a — Audit WP location strings (5 min)
```bash
curl "https://www.evascolarotalentstudio.com/wp-json/wp/v2/event?per_page=100&_fields=acf" | \
  jq '[.[].acf.event_location] | unique'
```
Note exact strings for: AIS, Dyatmika, Toki Hub (needed for `LOCATION_ORDER`).

#### Step 4b — Add `fetchAllSchedules()` to `classQueries.ts` (20 min)
```ts
// src/lib/queries/classQueries.ts

/**
 * Fetches ALL events from WP and returns a schedule grouped by location.
 * No keyword filter, no location filter — used by the homepage timetable.
 * Returns in order: Sanur Studio → Canggu Studio → AIS → Dyatmika → Toki Hub.
 */
export async function fetchAllSchedules(): Promise<StudioSchedule[]> {
  const res = await fetch(
    `${WP_BASE}/event?per_page=100&_fields=id,slug,title,schedule,acf`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];

  const events: WpEvent[] = await res.json();

  const relevant = events.filter((e) => {
    const loc = e.acf.event_location;
    return loc && loc !== PLACEHOLDER_LOCATION;
  });

  const grouped: Record<string, ScheduleItem[]> = {};

  for (const event of relevant) {
    const location = event.acf.event_location;
    const dayId = event.schedule?.[0];
    const day = dayId ? (SCHEDULE_ID_TO_DAY[dayId] ?? "") : "";

    if (!grouped[location]) grouped[location] = [];
    grouped[location].push({
      day,
      className: event.acf.event_name ?? event.title.rendered,
      timeStart: formatTime(event.acf.Time_Start),
      timeEnd:   formatTime(event.acf.Time_End),
      coach:     event.acf.event_featuring ?? "",
    });
  }

  const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  for (const items of Object.values(grouped)) {
    items.sort((a, b) => {
      const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.timeStart.localeCompare(b.timeStart);
    });
  }

  // Update LOCATION_ORDER after running Step 4a to match exact WP strings
  const LOCATION_ORDER = [
    "Sanur Studio",
    "Canggu Studio",
    "AIS School CCAs",        // ← confirm exact string from WP audit
    "Dyatmika School ECAs",    // ← confirm exact string from WP audit
    "Toki Hub",                // ← confirm exact string from WP audit
  ];

  const knownFirst = LOCATION_ORDER.filter((l) => grouped[l]);
  const rest = Object.keys(grouped).filter((l) => !LOCATION_ORDER.includes(l)).sort();

  return [...knownFirst, ...rest].map((location) => ({
    location,
    items: grouped[location],
  }));
}
```

#### Step 4c — Wire into `page.tsx` (30 min)

**Option A (recommended):** Extract `HomeTimetable` as a server component, keep rest of page client-side.

1. Create `src/components/home/HomeTimetable.tsx` as async server component:
```tsx
import { fetchAllSchedules } from "@/lib/queries/classQueries";

export default async function HomeTimetable() {
  const schedules = await fetchAllSchedules();
  // ... existing JSX from page.tsx HomeTimetable function ...
  // Replace MOCK_SCHEDULE with `schedules`
}
```

2. In `src/app/page.tsx`, replace `<HomeTimetable />` call with async import:
```tsx
import HomeTimetable from "@/components/home/HomeTimetable";
// ... in render:
<HomeTimetable />  {/* no await needed — Next.js handles it */}
```

**Option B (simpler, stays client):** Fetch via `useEffect` in `page.tsx`:
```tsx
const [schedules, setSchedules] = useState(MOCK_SCHEDULE);

useEffect(() => {
  fetch("/api/schedules")   // create /api/schedules/route.ts that calls fetchAllSchedules()
    .then(r => r.json())
    .then(setSchedules);
}, []);
```

**Prefer Option A** — server component, ISR, no client fetch overhead.

**Success:** Homepage timetable shows live WP data. No more `MOCK_SCHEDULE`.

---

### 🔴 Task 5 — Vercel env vars + Cloudflare Worker deploy (15 min)

#### 5a — Set Vercel env vars
Go to Vercel dashboard → Settings → Environment Variables:

| Key | Value | Env |
|---|---|---|
| `WP_ORIGIN` | `https://www.evascolarotalentstudio.com` | All |
| `NEXT_PUBLIC_WA_NUMBER` | `6282146284464` | All |
| `NEXT_PUBLIC_GTM_ID` | `GTM-NKCTQ2DW` | All |
| `NEXT_PUBLIC_GA_ID` | `G-1JDY0MTPSV` | All |
| `RESEND_API_KEY` | _(from Resend dashboard)_ | Production + Preview |
| `RESEND_FROM` | `noreply@evascolarotalentstudio.com` | All |
| `FORM_CC` | `firestone.stdo@gmail.com` | All |
| `FORM_RECIPIENT_AGENT2` | `agent2.evascolaro@gmail.com` | All |
| `FORM_RECIPIENT_AGENT3` | `agent3.evascolaro@gmail.com` | All |

**Success:** Preview deployment has all env vars set.

#### 5b — Deploy Cloudflare Worker ✅ DONE
1. ~~Go to Cloudflare dashboard → Workers & Pages → Create~~
2. ~~Paste `_docs/cloudflare-worker.js` into editor~~
3. ~~Click **Deploy**~~

**Verified live:** `/class/* → /classes/*` redirects active. `pathname === "/"` routes to Vercel.

---

### 🔵 Task 6 — Staging test (30 min)

On Vercel preview URL:

- [ ] `/` → homepage loads, video plays, timetable shows data, Join Us button works
- [ ] `/classes/ballet` → class page loads, schedule data shows
- [ ] `/gallery/` → proxies to WP correctly
- [ ] `/api/join-us` → form submission works (check email delivery)
- [ ] Watzap widget appears bottom-right
- [ ] GTM/GA fire correctly (check browser dev tools)

**If any issues:** fix → redeploy → test again.

---

### 🟢 Task 7 — DNS cutover (5 min + propagation wait)

1. Point `www.evascolarotalentstudio.com` CNAME to `cname.vercel-dns.com`
2. Wait 5–10 min for DNS propagation
3. Test live domain:
   - Homepage loads
   - `/classes/*` all load
   - WP pages (`/gallery/`, `/dancewear/`) proxy correctly
4. Submit sitemap to Google Search Console: `https://www.evascolarotalentstudio.com/sitemap.xml`
5. Run Lighthouse baseline: `https://www.evascolarotalentstudio.com/classes/ballet`

**Success:** 🎉 Site is live on Next.js + Vercel.

---

## Final Checklist Before Go-Live

- [ ] `npm run build` clean
- [ ] `/` in `sitemap.ts`
- [ ] Watzap widget loads
- [ ] Homepage shows live schedule (not `MOCK_SCHEDULE`)
- [ ] Vercel env vars set (9 total)
- [ ] Cloudflare Worker deployed
- [ ] Preview URL tested (6 checks above)
- [ ] DNS pointed to Vercel
- [ ] Live site tested
- [ ] Sitemap submitted to GSC
- [ ] Lighthouse baseline recorded

---

## If Blocked

**Problem:** `fetchAllSchedules()` taking too long or complex.  
**Workaround:** Ship with `MOCK_SCHEDULE` tonight. Fix P0 #1 tomorrow — homepage is still better than WP proxy.

**Problem:** Resend API key not ready.  
**Workaround:** Forms still open (frontend works). Email delivery fails gracefully with error message. Add key later — zero downtime.

**Problem:** Cloudflare Worker deploy fails.  
**Workaround:** Skip it. Next.js serves `/` directly. `/class/*` redirect won't work until Worker is live, but `/classes/*` canonical URLs work fine.

---

**Est. total time:** 2h 30min  
**Critical path:** Tasks 1–3 + 5b + 7 can go live tonight. Task 4 (live schedule) can ship tomorrow if needed.
