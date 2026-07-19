/**
 * Cloudflare Worker — Eva Scolaro Talent Studio
 *
 * 1. Redirects /class/* → /classes/* (WordPress CPT → Next.js, 301 permanent)
 *
 * 2. Routes to Vercel (evascolarotalentstudio.vercel.app):
 *   - /classes/*         Next.js class pages
 *   - /_next/*           Next.js JS/CSS/font assets
 *   - /favicon*          Favicons served by Next.js
 *   - /*.svg             SVG assets from Next.js /public
 *   - /*.png             PNG assets from Next.js /public
 *   - /*.ico             ICO files from Next.js /public
 *   - /sitemap.xml       Next.js sitemap
 *   - /robots.txt        Next.js robots
 *
 * 3. Everything else passes through to WordPress unchanged.
 */

const VERCEL_HOST = "evascolarotalentstudio.vercel.app";

function shouldRouteToVercel(pathname) {
  return (
    pathname.startsWith("/classes") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/favicon") ||
    pathname.endsWith(".svg") ||
    pathname.endsWith(".png") ||
    pathname.endsWith(".ico") ||
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
