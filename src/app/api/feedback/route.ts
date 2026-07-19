// src/app/api/feedback/route.ts
//
// Proxies feedback form submissions to WPForms form ID 1045 on the live
// WordPress /contact/ page.
//
// Flow:
//   1. Fetch /contact/ to obtain a fresh WPForms nonce + token (single-use
//      CSRF tokens — cannot be shared across requests).
//   2. Re-POST the user's fields — plus all required WPForms hidden fields —
//      to /contact/ as application/x-www-form-urlencoded.
//   3. Return a typed JSON response to the client.
//
// Field map (WPForms form 1045):
//   fields[2]            — Your name          (text, optional)
//   fields[5][primary]   — Email              (email, required)
//   fields[5][secondary] — Confirm Email      (email, required — must match)
//   fields[1]            — Type of Feedback   (select, optional)
//   fields[3]            — Phone              (number, optional — no + prefix)
//   fields[4]            — Write Feedback     (textarea, optional)
//   fields[6]            — Honeypot           (must be blank — anti-spam)

import { NextRequest, NextResponse } from "next/server";

const WP_ORIGIN   = process.env.WP_ORIGIN ?? "https://www.evascolarotalentstudio.com";
const CONTACT_URL = `${WP_ORIGIN}/contact/`;
const FORM_ID     = "1045";
const POST_ID     = "1075";

export const FEEDBACK_TYPES = [
  "General Feedback from Parents/Students",
  "Positive Feedback",
  "Suggestion or Complaints",
  "Studio Maintenance or Repairs",
  "Website Errors",
  "Other",
] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

async function fetchWpTokens(): Promise<{
  nonce: string;
  token: string;
  tokenTime: string;
}> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

  let res: Response;
  try {
    res = await fetch(CONTACT_URL, {
      headers: { "User-Agent": "NextJS-FeedbackProxy/1.0" },
      cache: "no-store",
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) throw new Error(`WP fetch failed: ${res.status}`);

  const html = await res.text();

  // nonce lives in the wpforms_settings JS block
  const nonceMatch = html.match(/"nonce"\s*:\s*"([a-f0-9]+)"/);
  // token + token_time are data-attrs on the <form> element for form 1045
  const tokenMatch     = html.match(/id="wpforms-form-1045"[^>]+data-token="([a-f0-9]+)"/);
  const tokenTimeMatch = html.match(/id="wpforms-form-1045"[^>]+data-token-time="(\d+)"/);

  // Fallback: grab first token in document if the targeted match fails
  const tokenFallback     = tokenMatch     ?? html.match(/data-token="([a-f0-9]+)"/);
  const tokenTimeFallback = tokenTimeMatch ?? html.match(/data-token-time="(\d+)"/);

  if (!nonceMatch || !tokenFallback || !tokenTimeFallback) {
    throw new Error("Could not extract WPForms security tokens from WP page");
  }

  return {
    nonce:     nonceMatch[1],
    token:     tokenFallback[1],
    tokenTime: tokenTimeFallback[1],
  };
}

function sanitise(v: string): string {
  return v.replace(/<[^>]*>/g, "").trim();
}

// ── Route Handler ─────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse body
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const name     = sanitise(body.name     ?? "");
  const email    = sanitise(body.email    ?? "");
  const emailCfm = sanitise(body.emailCfm ?? "");
  const type     = sanitise(body.type     ?? "");
  const phone    = sanitise(body.phone    ?? "");
  const feedback = sanitise(body.feedback ?? "");

  // 2. Server-side validation
  if (!email) {
    return NextResponse.json({ ok: false, message: "Email is required." }, { status: 422 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 422 });
  }
  if (email !== emailCfm) {
    return NextResponse.json({ ok: false, message: "Email addresses do not match." }, { status: 422 });
  }

  // 3. Fetch fresh WP tokens
  let tokens: { nonce: string; token: string; tokenTime: string };
  try {
    tokens = await fetchWpTokens();
  } catch (err) {
    console.error("[feedback] WP token fetch error:", err);
    return NextResponse.json(
      { ok: false, message: "Could not reach the server. Please try again." },
      { status: 502 }
    );
  }

  // 4. Build WPForms POST body matching form 1045 exactly
  const formData = new URLSearchParams({
    [`wpforms[fields][2]`]:            name,
    [`wpforms[fields][5][primary]`]:   email,
    [`wpforms[fields][5][secondary]`]: emailCfm,
    [`wpforms[fields][1]`]:            type,
    [`wpforms[fields][3]`]:            phone,
    [`wpforms[fields][4]`]:            feedback,
    // Honeypot — must be blank
    [`wpforms[fields][6]`]:            "",

    [`wpforms[id]`]:         FORM_ID,
    [`wpforms[post_id]`]:    POST_ID,
    [`wpforms[nonce]`]:      tokens.nonce,
    [`wpforms[token]`]:      tokens.token,
    [`wpforms[token_time]`]: tokens.tokenTime,

    page_title:  "Contact",
    page_url:    CONTACT_URL,
    url_referer: "",
    page_id:     POST_ID,
  });

  // 5. Submit to WordPress
  let wpRes: Response;
  try {
    wpRes = await fetch(CONTACT_URL, {
      method:  "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent":   "NextJS-FeedbackProxy/1.0",
        "Referer":      CONTACT_URL,
      },
      body:  formData.toString(),
      cache: "no-store",
    });
  } catch (err) {
    console.error("[feedback] WP submit error:", err);
    return NextResponse.json(
      { ok: false, message: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  if (!wpRes.ok) {
    console.error("[feedback] WP returned non-2xx:", wpRes.status);
    return NextResponse.json(
      { ok: false, message: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "Thank you! Your feedback has been sent." });
}
