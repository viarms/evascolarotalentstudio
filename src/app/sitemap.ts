// src/app/sitemap.ts
// Covers /classes/* and /articles/*. WordPress continues to manage sitemap.xml
// for all other pages. Merge into a combined sitemap when doing the full migration.

import type { MetadataRoute } from "next";
import { fetchAllArticleSlugs } from "@/lib/queries/articleQueries";

export const revalidate = 86400; // 24 h

const BASE = "https://www.evascolarotalentstudio.com";

const CLASS_SLUGS = [
  "hip-hop",
  "ballet",
  "singing",
  "kpop-dance",
  "jazz-dance",
  "drama",
  "musical-theatre",
  "modeling",
  "breakdance",
  "public-speaking",
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articleSlugs = await fetchAllArticleSlugs();

  return [
    {
      url: `${BASE}/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    {
      url: `${BASE}/studio/sanur/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/studio/canggu/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.9,
    },
    {
      url: `${BASE}/studio-rental/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    },
    // Articles archive
    {
      url: `${BASE}/articles/`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    // Class pages
    ...CLASS_SLUGS.map((slug) => ({
      url: `${BASE}/classes/${slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: slug === "public-speaking" ? 0.6 : 0.8,
    })),
    // Article posts
    ...articleSlugs.map((slug) => ({
      url: `${BASE}/articles/${slug}/`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
