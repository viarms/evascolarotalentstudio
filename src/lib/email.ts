// src/lib/email.ts
// Shared Resend email utility. All API routes import sendEmail() from here.

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.RESEND_FROM ?? "noreply@evascolarotalentstudio.com";
const CC   = process.env.FORM_CC     ?? "firestone.stdo@gmail.com";

export async function sendEmail(opts: {
  to:      string;
  subject: string;
  html:    string;
}) {
  return resend.emails.send({
    from: `Eva Scolaro Talent Studio <${FROM}>`,
    to:   opts.to,
    cc:   CC,
    subject: opts.subject,
    html:    opts.html,
  });
}
