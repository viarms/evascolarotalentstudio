import type { NextConfig } from "next";

// WP_ORIGIN is set in .env.local (dev) and Vercel env vars (prod)
// e.g. https://evascolarotalentstudio.com
const WP_ORIGIN = process.env.WP_ORIGIN;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: WP_ORIGIN
      ? [
          // Direct origin server (IP or hostname from WP_ORIGIN env var)
          { protocol: "https", hostname: new URL(WP_ORIGIN).hostname },
          // WP media URLs always reference the public domain regardless of WP_ORIGIN
          { protocol: "https", hostname: "www.evascolarotalentstudio.com" },
          { protocol: "https", hostname: "evascolarotalentstudio.com" },
        ]
      : [
          { protocol: "https", hostname: "www.evascolarotalentstudio.com" },
          { protocol: "https", hostname: "evascolarotalentstudio.com" },
        ],
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
