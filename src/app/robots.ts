// src/app/robots.ts
// Allows crawling of /classes/* routes served by Next.js.
// All other paths are proxied to WordPress which manages its own robots rules.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/classes/",
      },
    ],
    sitemap: "https://www.evascolarotalentstudio.com/sitemap.xml",
  };
}
