/**
 * Cloudflare Worker — Eva Scolaro Talent Studio
 *
 * 1. Redirects /class/* → /classes/* (WordPress CPT → Next.js, 301 permanent)
 *
 * 2. Routes to Vercel (evascolarotalentstudio.vercel.app):
 *   - /              Next.js homepage
 *   - /classes/*     Next.js class pages
 *   - /slideshow/*   Slideshow images served from Next.js /public/slideshow/
 *   - /api/*         Next.js API route handlers
 *   - /_next/*       Next.js JS/CSS/font assets
 *   - /favicon*      Favicons served by Next.js
 *   - /*.svg         Root-level SVG assets from Next.js /public (no subdirectory)
 *   - /*.png         Root-level PNG assets from Next.js /public (no subdirectory)
 *   - /*.webp        Root-level WebP assets from Next.js /public (no subdirectory)
 *   - /*.ico         Root-level ICO files from Next.js /public (no subdirectory)
 *   - /sitemap.xml   Next.js sitemap
 *   - /robots.txt    Next.js robots
 *
 * 3. Everything else passes through to WordPress unchanged.
 *
 * NOTE: The static asset rules (*.svg, *.png, *.webp, *.ico) intentionally match
 * ONLY root-level paths (e.g. /og-home.webp) — NOT paths with subdirectories like
 * /wp-content/uploads/photo.png. This prevents WP assets from being incorrectly
 * routed to Vercel.
 */

const VERCEL_HOST = "evascolarotalentstudio.vercel.app";

// Matches a root-level file: no slash after the leading slash.
// e.g. /logo.svg ✓   /wp-content/uploads/photo.png ✗
function isRootLevelFile(pathname, ext) {
  return pathname.endsWith(ext) && !pathname.slice(1).includes("/");
}

function shouldRouteToVercel(pathname) {
  return (
    pathname === "/" ||
    pathname.startsWith("/classes") ||
    pathname.startsWith("/slideshow/") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    isRootLevelFile(pathname, ".svg") ||
    isRootLevelFile(pathname, ".png") ||
    isRootLevelFile(pathname, ".webp") ||
    isRootLevelFile(pathname, ".ico") ||
    pathname === "/sitemap.xml" ||
    pathname === "/robots.txt"
  );
}

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // 1. Redirect /class/* → /classes/* (301 permanent)
    if (url.pathname.startsWith("/class/")) {
      const newPath = url.pathname.replace(/^\/class\//, "/classes/");
      const redirectUrl = new URL(request.url);
      redirectUrl.pathname = newPath;
      return Response.redirect(redirectUrl.toString(), 301);
    }

    // 2. Forward Next.js assets and pages to Vercel
    if (shouldRouteToVercel(url.pathname)) {
      const vercelUrl = new URL(request.url);
      vercelUrl.hostname = VERCEL_HOST;
      return fetch(vercelUrl.toString(), {
        method: request.method,
        headers: request.headers,
        body: request.method !== "GET" && request.method !== "HEAD"
          ? request.body
          : undefined,
      });
    }

    // 3. Everything else → WordPress (Cloudflare passes through normally)
    return fetch(request);
  },
};
