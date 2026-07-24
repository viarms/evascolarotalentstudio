// src/app/privacy-notice/page.tsx
// Privacy Notice for Eva Scolaro Talent Studio.
//
// Covers:
//   - Data collected via forms (Join Us, Book Free Trial, Feedback)
//   - WhatsApp communication
//   - Cookies and analytics (GTM / Google Analytics)
//   - Data retention and your rights
//
// Static page — no client JS needed.

import type { Metadata } from "next";
import Link from "next/link";
import FeedbackButton from "./FeedbackButton";

export const metadata: Metadata = {
  title: "Privacy Notice",
  description:
    "How Eva Scolaro Talent Studio collects, uses, and protects your personal information. Covers registration forms, WhatsApp, cookies, and Google Analytics.",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com/privacy-notice/",
  },
  robots: { index: true, follow: true },
};

// ─── Content ──────────────────────────────────────────────────────────────────

const LAST_UPDATED = "24 July 2026";
const CONTACT_WA   = "+62 821 4628 4464";
const CONTACT_WA_HREF = "https://wa.me/6282146284464";
const COMPANY_NAME = "PT Eva Scolaro Entertainment";
const COMPANY_ADDRESS = "Jl. Bypass Ngurah Rai No.88A, Sanur, Denpasar Selatan, Bali, Indonesia";

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PrivacyNoticePage() {
  return (
    <main
      style={{ background: "#0d0d0d", color: "#DDDDDD", minHeight: "100vh" }}
    >
      {/* ── Hero strip ─────────────────────────────────────────────────── */}
      <div
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "4rem 1.5rem 2.5rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-inter, sans-serif)",
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#B20001",
            marginBottom: "0.75rem",
          }}
        >
          Legal
        </p>
        <h1
          style={{
            fontFamily: "var(--font-archivo-black, sans-serif)",
            fontSize: "clamp(1.75rem, 4vw, 2.75rem)",
            fontWeight: 400,
            color: "#EFEFEF",
            marginBottom: "0.75rem",
            lineHeight: 1.15,
          }}
        >
          Privacy Notice
        </h1>
        <p
          style={{
            fontFamily: "var(--font-inter, sans-serif)",
            fontSize: "0.85rem",
            color: "#777777",
            marginBottom: 0,
          }}
        >
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      {/* ── Body ───────────────────────────────────────────────────────── */}
      <div
        style={{
          maxWidth: "760px",
          margin: "0 auto",
          padding: "3rem 1.5rem 5rem",
        }}
      >
        {/* Intro */}
        <Section>
          <p style={styles.lead}>
            Eva Scolaro Talent Studio, operated by <strong style={styles.strong}>{COMPANY_NAME}</strong>,
            is committed to protecting the privacy of the children, parents, and guardians who
            engage with us. This notice explains what personal information we collect, why we
            collect it, and how we keep it safe.
          </p>
          <p style={styles.body}>
            If you have any questions, you can reach us at any time via WhatsApp on{" "}
            <a href={CONTACT_WA_HREF} target="_blank" rel="noopener noreferrer" style={styles.link}>
              {CONTACT_WA}
            </a>
            .
          </p>
        </Section>

        <Divider />

        {/* 1 — Who we are */}
        <Section>
          <SectionHeading number="1">Who We Are</SectionHeading>
          <p style={styles.body}>
            <strong style={styles.strong}>{COMPANY_NAME}</strong> is the data controller for
            personal information collected through this website
            (evascolarotalentstudio.com). Our registered address is:
          </p>
          <address style={styles.address}>{COMPANY_ADDRESS}</address>
        </Section>

        <Divider />

        {/* 2 — What we collect */}
        <Section>
          <SectionHeading number="2">What Information We Collect</SectionHeading>

          <SubHeading>A. Registration &amp; Enrolment Form ("Join Us")</SubHeading>
          <p style={styles.body}>
            When you submit a registration enquiry, we collect:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>Parent or guardian full name</li>
            <li style={styles.li}>Child's full name and age</li>
            <li style={styles.li}>Class interest(s) and preferred studio location</li>
            <li style={styles.li}>WhatsApp phone number (required)</li>
            <li style={styles.li}>Email address (optional)</li>
            <li style={styles.li}>Any additional notes you choose to include</li>
          </ul>

          <SubHeading>B. Free Trial Booking Form ("Book a Free Trial")</SubHeading>
          <p style={styles.body}>
            When you book a free trial class, we collect:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>Parent or guardian full name</li>
            <li style={styles.li}>Child's full name and age</li>
            <li style={styles.li}>Class interest and preferred studio location</li>
            <li style={styles.li}>Preferred day of the week (optional)</li>
            <li style={styles.li}>WhatsApp phone number (required)</li>
            <li style={styles.li}>Email address (optional)</li>
          </ul>

          <SubHeading>C. Feedback Form</SubHeading>
          <p style={styles.body}>
            When you submit feedback, we collect:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>Your name (optional)</li>
            <li style={styles.li}>Email address (required for reply)</li>
            <li style={styles.li}>Phone number (optional)</li>
            <li style={styles.li}>Type of feedback and the content of your message</li>
          </ul>

          <SubHeading>D. WhatsApp Communication</SubHeading>
          <p style={styles.body}>
            If you contact us directly via WhatsApp, we will receive your phone number and the
            content of your messages. WhatsApp messages are processed by Meta Platforms, Inc.
            under{" "}
            <a
              href="https://www.whatsapp.com/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={styles.link}
            >
              WhatsApp's own Privacy Policy
            </a>
            .
          </p>

          <SubHeading>E. Cookies and Analytics</SubHeading>
          <p style={styles.body}>
            This website uses cookies and similar technologies for the following purposes:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>
              <strong style={styles.strong}>Google Analytics (GA4)</strong> — measures how visitors
              use the site (pages visited, session duration, device type). Data is anonymised
              before being sent to Google.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Google Tag Manager (GTM)</strong> — a container that
              loads and manages our analytics and marketing scripts. It does not itself store
              personal data.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Watzap WhatsApp Widget</strong> — a chat button
              that lets you open a WhatsApp conversation with us. This widget may set a session
              cookie to function correctly.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Functional cookies</strong> — we store your cookie
              consent preference in your browser's local storage (key: <code style={styles.code}>cookie_consent</code>)
              so we do not re-ask you on every visit.
            </li>
          </ul>
          <p style={styles.body}>
            You can accept or decline non-essential cookies using the banner that appears on your
            first visit. You can also clear cookies at any time through your browser settings.
          </p>
        </Section>

        <Divider />

        {/* 3 — How we use it */}
        <Section>
          <SectionHeading number="3">How We Use Your Information</SectionHeading>
          <p style={styles.body}>
            We use the information you provide only for the following purposes:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>
              To respond to your registration enquiry or trial booking and arrange your child's
              first class.
            </li>
            <li style={styles.li}>
              To send you class schedules, schedule changes, or important studio announcements
              via WhatsApp or email.
            </li>
            <li style={styles.li}>
              To process feedback and follow up where a response has been requested.
            </li>
            <li style={styles.li}>
              To understand how our website is used so we can improve it (analytics only).
            </li>
          </ul>
          <p style={styles.body}>
            We do not use your information for automated decision-making or profiling, and we do
            not send promotional marketing without your explicit consent.
          </p>
        </Section>

        <Divider />

        {/* 4 — Who we share with */}
        <Section>
          <SectionHeading number="4">Who We Share Your Information With</SectionHeading>
          <p style={styles.body}>
            We do not sell your personal information to third parties. We share data only with:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>
              <strong style={styles.strong}>Resend</strong> — our transactional email provider.
              Form submissions are delivered to our team by email via Resend's infrastructure.
              Resend processes data in accordance with{" "}
              <a
                href="https://resend.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Resend's Privacy Policy
              </a>
              .
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Google</strong> — receives anonymised analytics data
              via Google Analytics. See{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Google's Privacy Policy
              </a>
              .
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Vercel</strong> — our website hosting provider.
              Vercel may log anonymised request metadata (IP addresses, user-agent strings) as
              part of normal server infrastructure. See{" "}
              <a
                href="https://vercel.com/legal/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.link}
              >
                Vercel's Privacy Policy
              </a>
              .
            </li>
          </ul>
        </Section>

        <Divider />

        {/* 5 — Children's privacy */}
        <Section>
          <SectionHeading number="5">Children's Privacy</SectionHeading>
          <p style={styles.body}>
            Our classes are designed for children aged 3–16 years. We collect children's names
            and ages only for the purpose of placing them in the correct class. This information
            is provided by a parent or guardian and is never shared publicly or used for any
            marketing purpose.
          </p>
          <p style={styles.body}>
            We do not knowingly collect personal information directly from children under 13.
            All form submissions are completed by a parent or guardian on behalf of their child.
          </p>
        </Section>

        <Divider />

        {/* 6 — Retention */}
        <Section>
          <SectionHeading number="6">How Long We Keep Your Data</SectionHeading>
          <p style={styles.body}>
            We retain registration and trial booking information for as long as your child is
            enrolled with us, plus a reasonable period afterward in case you return. Feedback
            submissions are retained for 12 months. You can request deletion of your data at
            any time (see Section 7).
          </p>
          <p style={styles.body}>
            Analytics data retained by Google is governed by Google's data retention settings,
            which we have configured to the minimum available period (14 months by default).
          </p>
        </Section>

        <Divider />

        {/* 7 — Your rights */}
        <Section>
          <SectionHeading number="7">Your Rights</SectionHeading>
          <p style={styles.body}>
            You have the right to:
          </p>
          <ul style={styles.list}>
            <li style={styles.li}>
              <strong style={styles.strong}>Access</strong> the personal information we hold about
              you or your child.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Correct</strong> any inaccurate information.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Delete</strong> your data — we will remove it from
              our records within 30 days of your request.
            </li>
            <li style={styles.li}>
              <strong style={styles.strong}>Withdraw consent</strong> for us to contact you at
              any time.
            </li>
          </ul>
          <p style={styles.body}>
            To exercise any of these rights, please contact us via WhatsApp at{" "}
            <a href={CONTACT_WA_HREF} target="_blank" rel="noopener noreferrer" style={styles.link}>
              {CONTACT_WA}
            </a>{" "}
            or use the{" "}
            <FeedbackButton />
            . We will respond within 7 business days.
          </p>
        </Section>

        <Divider />

        {/* 8 — Security */}
        <Section>
          <SectionHeading number="8">Security</SectionHeading>
          <p style={styles.body}>
            Form data is transmitted over HTTPS and delivered securely via email. We do not
            store payment card information — we do not process any payments through this website.
            Access to form submissions is restricted to authorised staff only.
          </p>
        </Section>

        <Divider />

        {/* 9 — Third-party links */}
        <Section>
          <SectionHeading number="9">Links to Other Websites</SectionHeading>
          <p style={styles.body}>
            This website contains links to external sites (including WhatsApp, Google, and our
            partner schools). We are not responsible for the privacy practices of those sites and
            encourage you to read their privacy policies before submitting any personal information.
          </p>
        </Section>

        <Divider />

        {/* 10 — Changes */}
        <Section>
          <SectionHeading number="10">Changes to This Notice</SectionHeading>
          <p style={styles.body}>
            We may update this notice from time to time to reflect changes in our practices or
            for legal or regulatory reasons. The "Last updated" date at the top of the page will
            always show when it was last revised. Significant changes will be communicated via
            WhatsApp broadcast to active students.
          </p>
        </Section>

        <Divider />

        {/* Contact */}
        <Section>
          <SectionHeading number="11">Contact Us</SectionHeading>
          <p style={styles.body}>
            If you have any questions about this privacy notice or how we handle your data,
            please get in touch:
          </p>
          <div
            style={{
              background: "#161616",
              border: "1px solid #2a2a2a",
              borderRadius: "6px",
              padding: "1.25rem 1.5rem",
              marginTop: "1rem",
            }}
          >
            <p style={{ ...styles.body, marginBottom: "0.4rem" }}>
              <strong style={styles.strong}>{COMPANY_NAME}</strong>
            </p>
            <p style={{ ...styles.body, marginBottom: "0.4rem", color: "#999999" }}>
              {COMPANY_ADDRESS}
            </p>
            <p style={{ ...styles.body, marginBottom: 0 }}>
              WhatsApp:{" "}
              <a href={CONTACT_WA_HREF} target="_blank" rel="noopener noreferrer" style={styles.link}>
                {CONTACT_WA}
              </a>
            </p>
          </div>
        </Section>

        {/* Back link */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-inter, sans-serif)",
              fontSize: "0.8rem",
              color: "#555555",
              textDecoration: "none",
              letterSpacing: "0.05em",
            }}
          >
            ← Back to homepage
          </Link>
        </div>
      </div>
    </main>
  );
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function Section({ children }: { children: React.ReactNode }) {
  return <section style={{ marginBottom: "0.5rem" }}>{children}</section>;
}

function Divider() {
  return (
    <hr
      style={{
        border: "none",
        borderTop: "1px solid #1e1e1e",
        margin: "2.25rem 0",
      }}
    />
  );
}

function SectionHeading({
  number,
  children,
}: {
  number: string;
  children: React.ReactNode;
}) {
  return (
    <h2
      style={{
        fontFamily: "var(--font-archivo-black, sans-serif)",
        fontSize: "1rem",
        fontWeight: 400,
        color: "#EFEFEF",
        marginBottom: "1rem",
        display: "flex",
        alignItems: "baseline",
        gap: "0.6rem",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-inter, sans-serif)",
          fontSize: "0.7rem",
          fontWeight: 600,
          color: "#B20001",
          letterSpacing: "0.1em",
          flexShrink: 0,
        }}
      >
        {number.padStart(2, "0")}
      </span>
      {children}
    </h2>
  );
}

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontFamily: "var(--font-inter, sans-serif)",
        fontSize: "0.8rem",
        fontWeight: 600,
        color: "#BBBBBB",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
        marginTop: "1.5rem",
        marginBottom: "0.5rem",
      }}
    >
      {children}
    </h3>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────

const styles = {
  lead: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.95rem",
    color: "#CCCCCC",
    lineHeight: 1.75,
    marginBottom: "1rem",
  } as React.CSSProperties,
  body: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.875rem",
    color: "#AAAAAA",
    lineHeight: 1.8,
    marginBottom: "0.75rem",
  } as React.CSSProperties,
  strong: {
    color: "#DDDDDD",
    fontWeight: 600,
  } as React.CSSProperties,
  list: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.875rem",
    color: "#AAAAAA",
    lineHeight: 1.8,
    paddingLeft: "1.25rem",
    marginBottom: "0.75rem",
  } as React.CSSProperties,
  li: {
    marginBottom: "0.4rem",
  } as React.CSSProperties,
  link: {
    color: "#CC2222",
    textDecoration: "underline",
    textDecorationColor: "rgba(178,0,1,0.4)",
    textUnderlineOffset: "3px",
  } as React.CSSProperties,
  address: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.875rem",
    color: "#999999",
    fontStyle: "normal",
    lineHeight: 1.7,
    marginTop: "0.5rem",
    marginBottom: "0.75rem",
    paddingLeft: "1rem",
    borderLeft: "2px solid #2a2a2a",
  } as React.CSSProperties,
  code: {
    fontFamily: "ui-monospace, monospace",
    fontSize: "0.82rem",
    color: "#CCCCCC",
    background: "#1e1e1e",
    padding: "0.1em 0.35em",
    borderRadius: "3px",
  } as React.CSSProperties,
} as const;
