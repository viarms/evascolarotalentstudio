// src/app/api/revalidate/route.ts
// On-demand ISR revalidation endpoint.
// Called by a WordPress webhook whenever schedule/class data is saved.
//
// WordPress setup:
//   Plugin: WP Webhooks (free) or any "Save Post" webhook plugin.
//   URL:    https://www.evascolarotalentstudio.com/api/revalidate
//   Method: POST
//   Header: x-revalidate-secret: <REVALIDATE_SECRET>
//   Body:   JSON — { "paths": ["/"] }  (optional, defaults to ["/"])
//
// Environment variable required:
//   REVALIDATE_SECRET=<long random string>  (set in Vercel + .env.local)

import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

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

  // ── Parse body (optional) ────────────────────────────────────────────────
  let paths: string[] = ["/"];
  try {
    const body = await req.json() as { paths?: string[] };
    if (Array.isArray(body.paths) && body.paths.length > 0) {
      paths = body.paths;
    }
  } catch {
    // No body or invalid JSON — fall back to revalidating "/"
  }

  // ── Revalidate ────────────────────────────────────────────────────────────
  const revalidated: string[] = [];
  for (const p of paths) {
    revalidatePath(p);
    revalidated.push(p);
  }

  console.log("[revalidate] Revalidated paths:", revalidated);

  return NextResponse.json({ revalidated, timestamp: new Date().toISOString() });
}

// Reject non-POST methods
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
