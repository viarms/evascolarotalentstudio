// src/app/api/join-us/route.ts
//
// Receives Join Us / Registration form (Form 1 / WPForms 852) submissions and sends via Resend.
//
// Fields:
//   parentName — Parent / Guardian Name  (text, required)
//   childName  — Child's Name            (text, required)
//   childAge   — Child's Age             (number 3–16, required)
//   classes    — Class Interest          (string[], required — at least one)
//   studio     — Preferred Studio        (select, required)
//   whatsapp   — WhatsApp Number         (tel, required)
//   email      — Email                   (email, optional)
//   notes      — Additional Notes        (textarea, optional)
//
// To:  FORM_RECIPIENT_AGENT3 (agent3.evascolaro@gmail.com)
// CC:  FORM_CC               (firestone.stdo@gmail.com)

import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

const RECIPIENT = process.env.FORM_RECIPIENT_AGENT3 ?? "agent3.evascolaro@gmail.com";

function sanitise(v: unknown): string {
  return String(v ?? "").replace(/<[^>]*>/g, "").trim();
}

function sanitiseArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map(sanitise).filter(Boolean);
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
  parentName: string; childName: string; childAge: string;
  classes: string[]; studio: string; whatsapp: string; email: string; notes: string;
}): string {
  return `
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="background:#121212;color:#efefef;padding:16px 24px;margin:0">
    New Registration — Eva Scolaro Talent Studio
  </h2>
  <table style="width:100%;border-collapse:collapse;margin-top:0">
    ${row("Parent / Guardian",  fields.parentName)}
    ${row("Child's Name",       fields.childName)}
    ${row("Child's Age",        fields.childAge)}
    ${row("Class Interest",     fields.classes.join(", "))}
    ${row("Preferred Studio",   fields.studio)}
    ${row("WhatsApp",           fields.whatsapp)}
    ${row("Email",              fields.email)}
    ${row("Additional Notes",   fields.notes)}
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

  const parentName = sanitise(body.parentName);
  const childName  = sanitise(body.childName);
  const childAge   = sanitise(body.childAge);
  const classes    = sanitiseArray(body.classes);
  const studio     = sanitise(body.studio);
  const whatsapp   = sanitise(body.whatsapp);
  const email      = sanitise(body.email);
  const notes      = sanitise(body.notes);

  // 2. Server-side validation
  if (!parentName) return NextResponse.json({ ok: false, message: "Parent / Guardian name is required." }, { status: 422 });
  if (!childName)  return NextResponse.json({ ok: false, message: "Child's name is required." }, { status: 422 });
  if (!childAge)   return NextResponse.json({ ok: false, message: "Child's age is required." }, { status: 422 });
  const age = parseInt(childAge, 10);
  if (isNaN(age) || age < 3 || age > 16) {
    return NextResponse.json({ ok: false, message: "Child's age must be between 3 and 16." }, { status: 422 });
  }
  if (classes.length === 0) return NextResponse.json({ ok: false, message: "Please select at least one class." }, { status: 422 });
  if (!studio)     return NextResponse.json({ ok: false, message: "Please select a preferred studio." }, { status: 422 });
  if (!whatsapp)   return NextResponse.json({ ok: false, message: "WhatsApp number is required." }, { status: 422 });
  if (!/^\d{7,15}$/.test(whatsapp.replace(/\s/g, ""))) {
    return NextResponse.json({ ok: false, message: "Enter a valid WhatsApp number without + (e.g. 628xxxxxxxxxx)." }, { status: 422 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ ok: false, message: "Please enter a valid email address." }, { status: 422 });
  }

  // 3. Send via Resend
  const subject = `New Registration — ${childName} (${classes[0]}${classes.length > 1 ? ` +${classes.length - 1}` : ""}, ${studio})`;

  try {
    const { error } = await sendEmail({
      to:      RECIPIENT,
      subject,
      html:    buildHtml({ parentName, childName, childAge, classes, studio, whatsapp, email, notes }),
    });

    if (error) {
      console.error("[join-us] Resend error:", error);
      return NextResponse.json(
        { ok: false, message: "Could not send your registration. Please try again." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("[join-us] Unexpected error:", err);
    return NextResponse.json(
      { ok: false, message: "Submission failed. Please try again." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "Thank you! Your registration has been received. We'll be in touch soon." });
}
