import type { NextConfig } from "next";

// WP_ORIGIN is only used locally (.env.local) so Next.js <Image> can load
// images from the direct WP server during development.
// In production, routing is handled by Cloudflare Workers — no proxy needed here.
const WP_ORIGIN = process.env.WP_ORIGIN;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "www.evascolarotalentstudio.com" },
      { protocol: "https", hostname: "evascolarotalentstudio.com" },
      // Allow direct WP origin in local dev if WP_ORIGIN is set
      ...(WP_ORIGIN
        ? [
            {
              protocol: new URL(WP_ORIGIN).protocol.replace(":", "") as
                | "http"
                | "https",
              hostname: new URL(WP_ORIGIN).hostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
