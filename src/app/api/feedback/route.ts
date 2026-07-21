// src/app/api/feedback/route.ts
//
// Receives Feedback form (Form 3 / WPForms 1045) submissions and sends via Resend.
//
// Fields:
//   name     — Your Name         (text, optional)
//   email    — Email             (email, required)
//   emailCfm — Confirm Email     (email, required — must match)
//   type     — Type of Feedback  (select, optional)
//   phone    — Phone             (tel, optional)
//   feedback — Write Feedback    (textarea, optional)
//
// To:  FORM_RECIPIENT_AGENT2 (agent2.evascolaro@gmail.com)
// CC:  FORM_CC               (firestone.stdo@gmail.com)

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const RECIPIENT = process.env.FORM_RECIPIENT_AGENT2 ?? "agent2.evascolaro@gmail.com";

function sanitise(v: unknown): string {
  return String(v ?? "").replace(/<[^>]*>/g, "").trim();
}

function row(label: string, value: string) {
  if (!value) return "";
  return `
    <tr>
      <td style="padding:10px 16px;font-weight:600;width:40%;background:#f9f9f9;border-bottom:1px solid #eee">${label}</td>
      <td style="padding:10px 16px;border-bottom:1px solid #eee">${value}</td>
    </tr>`;
}

function buildHtml(fields: {
  name: string; email: string; type: string; phone: string; feedback: string;
}): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="background:#121212;color:#efefef;padding:16px 24px;margin:0">
    Feedback — Eva Scolaro Talent Studio
  </h2>
  <table style="width:100%;border-collapse:collapse;margin-top:0">
    ${row("Name",              fields.name)}
    ${row("Email",             fields.email)}
    ${row("Type of Feedback",  fields.type)}
    ${row("Phone",             fields.phone)}
    ${row("Feedback",          fields.feedback)}
  </table>
  <p style="padding:16px 24px;color:#888;font-size:12px">
    Submitted via evascolarotalentstudio.com
  </p>
</div>`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse body
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const name     = sanitise(body.name);
  const email    = sanitise(body.email);
  const emailCfm = sanitise(body.emailCfm);
  const type     = sanitise(body.type);
  const phone    = sanitise(body.phone);
  const feedback = sanitise(body.feedback);

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

  // 3. Send via Resend
  const subject = `Feedback — ${type || "General"} from ${name || "Anonymous"}`;

  try {
    const { error } = await sendEmail({
      to:      RECIPIENT,
      subject,
      html:    buildHtml({ name, email, type, phone, feedback }),
    });

    if (error) {
      console.error("[feedback] Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "Could not send your feedback. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[feedback] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "Thank you! Your feedback has been sent." });
}
