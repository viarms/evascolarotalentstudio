// src/app/robots.ts
// Robots rules for the Next.js layer.
//
// Next.js owns:  /, /classes/*, /studio/*, /studio-rental/, /privacy-notice/
// WordPress owns: everything else (its own robots.txt handles those paths)
//
// We explicitly disallow API routes and Next.js internals so they are never
// indexed, and allow all user-facing pages.

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/classes/",
          "/studio/",
          "/studio-rental/",
          "/privacy-notice/",
        ],
        disallow: [
          "/api/",
          "/_next/",
        ],
      },
    ],
    sitemap: "https://www.evascolarotalentstudio.com/sitemap.xml",
  };
}
