// src/app/sitemap.ts
// Covers /classes/* only. WordPress continues to manage sitemap.xml for all
// other pages. Merge into a combined sitemap when doing the full migration.

import type { MetadataRoute } from "next";

const BASE = "https://www.evascolarotalentstudio.com";

const CLASS_SLUGS = [
  "hip-hop",
  "ballet",
  "singing",
  "kpop-dance",
  "jazz-dance",
  "drama-musical-theatre",
  "modeling",
  "breakdance",
  "public-speaking",
] as const;

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
    })),
  ];
}
