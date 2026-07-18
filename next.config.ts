import type { NextConfig } from "next";

// WP_ORIGIN is set in .env.local (dev) and Vercel env vars (prod)
// e.g. https://evascolarotalentstudio.com
const WP_ORIGIN = process.env.WP_ORIGIN;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: WP_ORIGIN
      ? [
          { protocol: "https", hostname: new URL(WP_ORIGIN).hostname },
          // Also allow www subdomain (WP may serve media from either)
          { protocol: "https", hostname: `www.${new URL(WP_ORIGIN).hostname}` },
        ]
      : [],
  },

  async rewrites() {
    // /classes/* is handled natively by Next.js — no rewrite needed.
    // All other paths fall back to the WordPress origin.
    if (!WP_ORIGIN) return { fallback: [] };

    return {
      fallback: [
        {
          source: "/:path*",
          destination: `${WP_ORIGIN}/:path*`,
        },
      ],
    };
  },
};

export default nextConfig;
