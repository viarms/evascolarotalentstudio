# Plan: Forms — Modal System with Resend
## Eva Scolaro Talent Studio

**Status:** Planned — ready to implement
**Last updated:** 20 July 2026
**Depends on:** Homepage (`src/app/page.tsx`) exists ✅, FeedbackModal pattern ✅

---

## Overview

Replicate all forms from the live WordPress/Elementor site as native Next.js modal
components. Each form:
- Uses the existing `<dialog>`-based modal pattern (`FeedbackModal.tsx`)
- Is opened by a specific CTA trigger (button or link) — matching the original popup IDs
- Submits to a dedicated Next.js API route
- Sends email via **Resend** (not WPForms proxy)

---

## Forms Inventory — from live site

| # | Form name | WPForms ID | Elementor Popup ID | Trigger CTA(s) |
|---|---|---|---|---|
| 1 | **Join Us / Registration** | 852 | 2266 | Header "Join Us" btn, Hero "Join Us" btn, About section "Join Us" btn |
| 2 | **Book Free Trial** | 2207 | 840 | Pricing section "Book Free Trial" btn |
| 3 | **Feedback** | 1045 | 1050 | Footer "Feedback" link |

---

## Recipient Routing

| Form | To | CC |
|---|---|---|
| Join Us / Registration | `agent3.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| Book Free Trial | `agent3.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| Feedback | `agent2.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| Contact Form | `agent2.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| RSVP | `agent2.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| Registration for Dyatmika | `agent3.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |

> Note: Contact Form and RSVP are on `/contact/` and other pages currently still
> proxied to WordPress. Implement those when those pages are migrated to Next.js.
> Join Us / Book Free Trial / Feedback are homepage-critical — implement first.

---

## Environment Variables

Add to `.env.local` (and to Vercel env vars):

```bash
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx          # provided by client
RESEND_FROM=noreply@evascolarotalentstudio.com  # verified sender domain in Resend

# Form recipients
FORM_RECIPIENT_AGENT2=agent2.evascolaro@gmail.com
FORM_RECIPIENT_AGENT3=agent3.evascolaro@gmail.com
FORM_CC=firestone.stdo@gmail.com
```

Add the same keys to `.env.local.example` (with placeholder values, no real addresses).

---

## Form Field Specs

### Form 1 — Join Us / Registration (WPForms 852)

Replicates the original registration popup. Fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| Parent / Guardian Name | text | ✅ | |
| Child's Name | text | ✅ | |
| Child's Age | number / select | ✅ | 3–16 |
| Class Interest | select (multi) | ✅ | All 8 active classes as options |
| Preferred Studio | select | ✅ | Sanur Studio / Canggu Studio |
| WhatsApp Number | tel | ✅ | International format note: no `+` |
| Email | email | ✅ | |
| Additional Notes | textarea | ❌ | optional |

### Form 2 — Book Free Trial (WPForms 2207)

Simpler form. Fields:

| Field | Type | Required | Notes |
|---|---|---|---|
| Parent / Guardian Name | text | ✅ | |
| Child's Name | text | ✅ | |
| Child's Age | number / select | ✅ | 3–16 |
| Class Interest | select | ✅ | All 8 active classes |
| Preferred Studio | select | ✅ | Sanur Studio / Canggu Studio |
| Preferred Day | select | ❌ | Monday–Saturday |
| WhatsApp Number | tel | ✅ | |
| Email | email | ❌ | optional |

### Form 3 — Feedback (WPForms 1045)

Already implemented as `FeedbackModal.tsx` / `POST /api/feedback` (currently proxies
to WPForms). Needs to be **migrated from WPForms proxy → Resend**.

Current fields (keep as-is):

| Field | Type | Required |
|---|---|---|
| Your Name | text | ❌ |
| Email | email | ✅ |
| Confirm Email | email | ✅ |
| Type of Feedback | select | ❌ |
| Phone | tel | ❌ |
| Write Feedback | textarea | ❌ |

---

## Modal Architecture

### Pattern (matches existing `FeedbackModal.tsx`)

```
window.dispatchEvent(new Event("open-<form-key>-modal"))
  ↓
<dialog ref> .showModal()
  ↓
form submit → POST /api/<form-key>
  ↓
Resend.emails.send({ to, cc, subject, html })
  ↓
{ ok: true, message: "..." } → success state in modal
```

### New components

```
src/components/modals/
├── JoinUsModal.tsx          ← Form 1 — opens on "open-join-us-modal"
├── BookTrialModal.tsx       ← Form 2 — opens on "open-book-trial-modal"
└── FeedbackModal.tsx        ← Form 3 — MOVE from layout/ + migrate to Resend
```

> `FeedbackModal.tsx` currently lives in `src/components/layout/`. Move it to
> `src/components/modals/` as part of this work. Update import in `layout.tsx`.

All three modals are mounted in `src/app/layout.tsx` (alongside the existing
`FeedbackModal`) so they are available on every page.

### Trigger wiring

Replace current `href="https://wa.me/..."` CTAs on the homepage with `<button>`
elements that fire the correct event:

| Current CTA | New behaviour |
|---|---|
| Header "Join Us" `<a href="https://wa.me/...">` | `<button onClick={() => window.dispatchEvent(new Event("open-join-us-modal"))}>`  |
| Hero "Join Us" `<a>` | same event as above |
| About section "Join Us" `<a>` | same event as above |
| Pricing "Book Free Trial" `<a>` | `<button onClick={() => window.dispatchEvent(new Event("open-book-trial-modal"))}>`  |
| Footer "Feedback" link | already wired → `open-feedback-modal` ✅ |

> Keep WA links as a fallback `<a>` inside the modal success state ("or reach us
> directly on WhatsApp") — not as the primary CTA.

---

## API Routes

### `POST /api/join-us`

Receives Form 1 fields. Validates. Sends via Resend.

**To:** `agent3.evascolaro@gmail.com`
**CC:** `firestone.stdo@gmail.com`
**Subject:** `New Registration — {childName} ({class}, {studio})`
**Body:** HTML email listing all fields in a clean table layout.

### `POST /api/book-trial`

Receives Form 2 fields. Validates. Sends via Resend.

**To:** `agent3.evascolaro@gmail.com`
**CC:** `firestone.stdo@gmail.com`
**Subject:** `Free Trial Request — {childName} ({class}, {studio})`
**Body:** HTML email with all fields.

### `POST /api/feedback` — migrate existing

Currently: proxies to WPForms on WP site.
After: sends via Resend.

**To:** `agent2.evascolaro@gmail.com`
**CC:** `firestone.stdo@gmail.com`
**Subject:** `Feedback — {type || "General"} from {name || "Anonymous"}`
**Body:** HTML email with all fields.

---

## Shared Email Utilities

Create `src/lib/email.ts`:

```ts
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM    = process.env.RESEND_FROM ?? "noreply@evascolarotalentstudio.com";
const CC      = process.env.FORM_CC     ?? "firestone.stdo@gmail.com";

export async function sendEmail(opts: {
  to:      string;
  subject: string;
  html:    string;
}) {
  return resend.emails.send({
    from: `Eva Scolaro Talent Studio <${FROM}>`,
    to:   opts.to,
    cc:   CC,
    ...opts,
  });
}
```

All three API routes import and call `sendEmail()` — no Resend SDK wiring
duplicated across routes.

---

## Email HTML Templates

Keep templates inline (tagged template literals) in each API route — no external
template engine needed. Common structure:

```html
<div style="font-family:sans-serif;max-width:600px;margin:0 auto">
  <h2 style="background:#121212;color:#efefef;padding:16px 24px;margin:0">
    {Form Title} — Eva Scolaro Talent Studio
  </h2>
  <table style="width:100%;border-collapse:collapse;margin-top:0">
    <!-- one row per field -->
    <tr style="border-bottom:1px solid #eee">
      <td style="padding:10px 16px;font-weight:600;width:40%;background:#f9f9f9">{Label}</td>
      <td style="padding:10px 16px">{Value}</td>
    </tr>
    ...
  </table>
  <p style="padding:16px 24px;color:#888;font-size:12px">
    Submitted via evascolarotalentstudio.com
  </p>
</div>
```

---

## Validation Strategy

- **Client-side:** inline in each modal component (same pattern as `FeedbackModal.tsx`)
  — validate on blur + on submit, show inline error messages, block submit if invalid
- **Server-side:** each API route re-validates all required fields, returns
  `{ ok: false, message: "..." }` with `status: 422` on failure
- **No external validation library** — keep deps minimal (vanilla checks only,
  same as the existing feedback form)

---

## Resend Setup (before coding)

1. Client creates a Resend account at [resend.com](https://resend.com)
2. Verify the sender domain `evascolarotalentstudio.com` (add DNS records Resend provides)
3. Create an API key → add as `RESEND_API_KEY` in `.env.local` and Vercel
4. Install the Resend package:
   ```bash
   npm install resend
   ```

> Until the domain is verified in Resend, emails can be tested with
> `onboarding@resend.dev` as the `from` address (Resend's sandbox sender).

---

## Implementation Order

| Step | Task | File(s) | Notes |
|---|---|---|---|
| 1 | Install Resend | `package.json` | `npm install resend` |
| 2 | Add env vars | `.env.local`, `.env.local.example`, Vercel | `RESEND_API_KEY`, `RESEND_FROM`, `FORM_RECIPIENT_AGENT2`, `FORM_RECIPIENT_AGENT3`, `FORM_CC` |
| 3 | Create `src/lib/email.ts` | new file | Shared `sendEmail()` utility |
| 4 | Migrate `POST /api/feedback` | `src/app/api/feedback/route.ts` | Replace WPForms proxy with `sendEmail()` |
| 5 | Move `FeedbackModal.tsx` | `src/components/layout/` → `src/components/modals/` | Update import in `layout.tsx` |
| 6 | Build `JoinUsModal.tsx` | `src/components/modals/` | Form 1 fields, `open-join-us-modal` event |
| 7 | Build `POST /api/join-us` | `src/app/api/join-us/route.ts` | Validate + Resend |
| 8 | Build `BookTrialModal.tsx` | `src/components/modals/` | Form 2 fields, `open-book-trial-modal` event |
| 9 | Build `POST /api/book-trial` | `src/app/api/book-trial/route.ts` | Validate + Resend |
| 10 | Mount all modals in layout | `src/app/layout.tsx` | Add `<JoinUsModal />` + `<BookTrialModal />` alongside existing `<FeedbackModal />` |
| 11 | Wire triggers on homepage | `src/app/page.tsx` | Replace `href="https://wa.me/..."` with `dispatchEvent` buttons on Join Us + Book Trial CTAs |
| 12 | Wire trigger in Header | `src/components/layout/Header.tsx` | Replace `href={JOIN_US_HREF}` with event dispatch |
| 13 | QA all three forms | — | Test submit → check email arrives at correct To + CC. Test validation. Test close/reopen. Test mobile. |

---

## File Map (after implementation)

```
src/
├── app/
│   ├── api/
│   │   ├── feedback/route.ts      ← ✅ exists — migrate from WPForms proxy to Resend
│   │   ├── join-us/route.ts       ← 🔜 new
│   │   └── book-trial/route.ts    ← 🔜 new
│   ├── layout.tsx                 ← update: add JoinUsModal + BookTrialModal
│   └── page.tsx                   ← update: wire Join Us + Book Trial triggers
├── components/
│   ├── layout/
│   │   └── Header.tsx             ← update: wire Join Us trigger
│   └── modals/                    ← 🔜 new directory
│       ├── FeedbackModal.tsx      ← move from layout/
│       ├── JoinUsModal.tsx        ← 🔜 new
│       └── BookTrialModal.tsx     ← 🔜 new
└── lib/
    └── email.ts                   ← 🔜 new — shared Resend utility
```

---

## Future forms (when those pages migrate to Next.js)

| Form | Page | To | CC |
|---|---|---|---|
| Contact Form | `/contact/` | `agent2.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| RSVP | event/concert pages | `agent2.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |
| Registration for Dyatmika | school-specific page | `agent3.evascolaro@gmail.com` | `firestone.stdo@gmail.com` |

Same modal + Resend pattern applies. Add a `POST /api/contact`, `POST /api/rsvp`,
`POST /api/join-us-dyatmika` route when those pages are built.

---

*Part of the Phase 2 full Next.js migration. See `Migration-Plan-Nextjs-Eva-Scolaro.md` for broader context.*
