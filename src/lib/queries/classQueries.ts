/**
 * src/lib/queries/classQueries.ts
 *
 * Data fetching for class pages.
 *
 * Schedule data comes from the WordPress `event` CPT via the REST API.
 * Each event entry represents one class session with the following ACF fields:
 *
 *   event_name      → class name shown in the table (e.g. "JUNIOR HIPHOP")
 *   event_location  → studio name (e.g. "Sanur Studio", "Canggu Studio", "Toki Hub", "Parklife")
 *   event_featuring → coach name
 *   Time_Start      → "HH:MM:SS"
 *   Time_End        → "HH:MM:SS"
 *
 * Day of week comes from the `schedule` taxonomy term attached to each event.
 *
 * All locations with a real name are included. The only excluded value is
 * "Event Venue/Location, City" which is an unfilled WP template placeholder.
 */

import type { StudioSchedule, ScheduleItem } from "@/lib/types/class";

// ─── Types ────────────────────────────────────────────────────────────────────

export type WpEvent = {
  id: number;
  slug: string;
  title: { rendered: string };
  /** Array of `schedule` taxonomy term IDs (day of week) */
  schedule: number[];
  acf: {
    event_name: string;
    event_location: string;
    event_featuring: string;
    Time_Start: string; // "HH:MM:SS"
    Time_End: string;   // "HH:MM:SS"
  };
};

// ─── Constants ────────────────────────────────────────────────────────────────

const WP_BASE = "https://www.evascolarotalentstudio.com/wp-json/wp/v2";

/** Maps schedule taxonomy term IDs → day name */
const SCHEDULE_ID_TO_DAY: Record<number, string> = {
  13: "Sunday",
  14: "Monday",
  15: "Tuesday",
  16: "Thursday",
  17: "Friday",
  18: "Saturday",
  19: "Wednesday",
};

/**
 * Placeholder value used in WordPress when a location hasn't been filled in.
 * Events with this location are excluded from the schedule.
 */
const PLACEHOLDER_LOCATION = "Event Venue/Location, City";

/**
 * Only these two locations are shown on public class pages.
 * Toki Hub, Parklife, AIS, Dyatmika etc. are school-partner CCA/ECA venues —
 * they are excluded here and mentioned only on the School Partnerships page.
 */
const PUBLIC_LOCATIONS = new Set(["Sanur Studio", "Canggu Studio"]);

/**
 * Maps a class page slug to keywords matched against `event_name` (case-insensitive).
 */
const SLUG_TO_KEYWORDS: Record<string, string[]> = {
  "hip-hop":               ["HIPHOP", "HIP-HOP", "HIP HOP"],
  "ballet":                ["BALLET"],
  "singing":               ["SINGING"],
  "kpop-dance":            ["KPOP", "K-POP"],
  "jazz-dance":            ["JAZZ"],
  "drama-musical-theatre": ["DRAMA", "MUSICAL THEATRE", "MUSICAL THEATER"],
  "modeling":              ["MODELING", "MODELLING"],
  "breakdance":            ["BREAKDANCE", "BREAK DANCE"],
  "public-speaking":       ["PUBLIC SPEAKING"],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Strips HH:MM:SS → HH:MM */
function formatTime(t: string): string {
  return t ? t.slice(0, 5) : "";
}

// ─── Yoast meta ───────────────────────────────────────────────────────────────

export type YoastMeta = {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  twitter_card?: string;
  robots?: {
    index?: string;
    follow?: string;
  };
};

/**
 * Fetches Yoast SEO meta for a class post by slug.
 * Returns null if the post doesn't exist or Yoast fields are empty.
 */
export async function fetchYoastMeta(slug: string): Promise<YoastMeta | null> {
  const res = await fetch(
    `${WP_BASE}/class?slug=${encodeURIComponent(slug)}&_fields=yoast_head_json`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return null;

  const data = await res.json();
  const yoast = data?.[0]?.yoast_head_json;
  if (!yoast) return null;

  return {
    title:          yoast.title,
    description:    yoast.og_description ?? yoast.description,
    og_title:       yoast.og_title,
    og_description: yoast.og_description,
    og_image:       yoast.og_image,
    twitter_card:   yoast.twitter_card,
    robots:         yoast.robots,
  };
}

// ─── Fetch ────────────────────────────────────────────────────────────────────

/**
 * Fetches all events from the WP REST API and returns a schedule grouped
 * by studio location for the given class page slug.
 *
 * - Excludes events whose location is the WP placeholder value
 * - Includes all other active locations (Sanur Studio, Canggu Studio, Toki Hub, Parklife, etc.)
 * - Matches events whose `event_name` contains any keyword for the slug
 * - Sorts within each location by day order then time
 */
export async function fetchScheduleForClass(
  slug: string
): Promise<StudioSchedule[]> {
  const keywords = SLUG_TO_KEYWORDS[slug];
  if (!keywords) return [];

  const res = await fetch(
    `${WP_BASE}/event?per_page=100&_fields=id,slug,title,schedule,acf`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];

  const events: WpEvent[] = await res.json();

  const keywordsUpper = keywords.map((k) => k.toUpperCase());

  const relevant = events.filter((e) => {
    const loc = e.acf.event_location;
    if (!loc || loc === PLACEHOLDER_LOCATION) return false;
    if (!PUBLIC_LOCATIONS.has(loc)) return false;        // exclude partner school venues
    const name = e.acf.event_name?.toUpperCase() ?? "";
    return keywordsUpper.some((kw) => name.includes(kw));
  });

  // Group by location name (dynamic — no hardcoded location list)
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

  // Sort within each location: day order then timeStart
  const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  for (const items of Object.values(grouped)) {
    items.sort((a, b) => {
      const dayDiff = DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day);
      if (dayDiff !== 0) return dayDiff;
      return a.timeStart.localeCompare(b.timeStart);
    });
  }

  // Build result — Sanur Studio first, Canggu Studio second
  const LOCATION_ORDER = ["Sanur Studio", "Canggu Studio"];

  const knownFirst = LOCATION_ORDER.filter((l) => grouped[l]);
  const rest = Object.keys(grouped).filter((l) => !LOCATION_ORDER.includes(l)).sort();

  return [...knownFirst, ...rest].map((location) => ({
    location,
    items: grouped[location],
  }));
}
