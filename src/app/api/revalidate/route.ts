// src/app/api/revalidate/route.ts
// On-demand ISR revalidation endpoint.
//
// ── WordPress webhook setup ───────────────────────────────────────────────────
// Plugin: WP Webhooks (free) or any "Save Post" hook.
// URL:    https://www.evascolarotalentstudio.com/api/revalidate
// Method: POST
// Header: x-revalidate-secret: <REVALIDATE_SECRET>
//
// Payload for a new/updated article post:
//   { "type": "article", "slug": "my-post-slug" }
//
// Payload to revalidate specific paths:
//   { "paths": ["/", "/articles/"] }
//
// Payload to revalidate everything article-related:
//   { "type": "article" }
//
// ── Environment variable required ─────────────────────────────────────────────
//   REVALIDATE_SECRET=<long random string>  (set in Vercel + .env.local)

import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

type RevalidateBody = {
  /** Revalidate a content type. "article" busts the articles fetch cache. */
  type?: "article";
  /** Specific post slug — revalidates that post's fetch cache entry. */
  slug?: string;
  /** Explicit path list — revalidates those Next.js page routes. */
  paths?: string[];
};

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Auth ──────────────────────────────────────────────────────────────────
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) {
    console.error("[revalidate] REVALIDATE_SECRET env var is not set");
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const incoming = req.headers.get("x-revalidate-secret");
  if (incoming !== secret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ── Parse body ────────────────────────────────────────────────────────────
  let body: RevalidateBody = {};
  try {
    body = (await req.json()) as RevalidateBody;
  } catch {
    // No body — fall through to defaults
  }

  const revalidatedTags: string[]  = [];
  const revalidatedPaths: string[] = [];

  // ── Tag-based cache busting (fetch cache) ─────────────────────────────────
  if (body.type === "article" || (!body.type && !body.paths)) {
    // Bust the articles listing fetch cache
    revalidateTag("articles", "max");
    revalidatedTags.push("articles");

    // Bust a specific post's fetch cache if slug is provided
    if (body.slug) {
      revalidateTag(`article-${body.slug}`, "max");
      revalidatedTags.push(`article-${body.slug}`);
    }
  }

  // ── Path-based page revalidation ──────────────────────────────────────────
  // Always revalidate the articles listing page when an article changes
  if (body.type === "article" || (!body.type && !body.paths)) {
    revalidatePath("/articles/");
    revalidatedPaths.push("/articles/");

    if (body.slug) {
      revalidatePath(`/articles/${body.slug}/`);
      revalidatedPaths.push(`/articles/${body.slug}/`);
    }
  }

  // Additional explicit paths (e.g. homepage after a class/schedule update)
  if (Array.isArray(body.paths) && body.paths.length > 0) {
    for (const p of body.paths) {
      revalidatePath(p);
      revalidatedPaths.push(p);
    }
  }

  const result = { revalidatedTags, revalidatedPaths, timestamp: new Date().toISOString() };
  console.log("[revalidate]", result);

  return NextResponse.json(result);
}

// Reject non-POST methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
