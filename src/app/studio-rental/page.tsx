// src/app/studio-rental/page.tsx
// Dance Studio for Rent — Eva Scolaro Talent Studio, Sanur
//
// Two floors available for hourly rental:
//   Ground Floor (1F): 400,000 IDR/hour
//   Second Floor (2F): 250,000 IDR/hour
//
// Availability: Monday–Friday, 10:00–13:00
// Location: Jl. Bypass Ngurah Rai No.88A, Sanur, Denpasar Selatan
// Booking: WhatsApp only

import type { Metadata } from "next";
import Link from "next/link";
import BookingButton from "./BookingButton";
import AvailabilityGrid from "./AvailabilityGrid";
import HeroCTAs from "./HeroCTAs";
import AnimatedSection from "./AnimatedSection";
import { buildStudioRentalSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "Dance Studio for Rent in Sanur, Bali",
  description:
    "Rent a professional dance studio in Sanur, Bali by the hour. Two floors available — Ground Floor 400k/hr, 2nd Floor 250k/hr. Mon–Fri 10:00–13:00. Book via WhatsApp.",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com/studio-rental/",
  },
  openGraph: {
    title: "Dance Studio for Rent in Sanur, Bali | Eva Scolaro Talent Studio",
    description:
      "Professional dance studio rental by the hour in Sanur, Bali. Mirrored walls, sprung floor, sound system. From 250,000 IDR/hour.",
    url: "https://www.evascolarotalentstudio.com/studio-rental/",
  },
};

const WA_NUMBER = "6282146284464";
const WA_MSG_BOOKING = encodeURIComponent(
  "Hi, I'd like to book the dance studio for rental. Could you please share available slots?"
);
const WA_HREF = `https://wa.me/${WA_NUMBER}?text=${WA_MSG_BOOKING}`;

// ─── Floor data ───────────────────────────────────────────────────────────────

const FLOORS = [
  {
    id: "ground-floor",
    label: "Ground Floor",
    shortLabel: "1F",
    price: 400000,
    priceFormatted: "400,000",
    tag: "Main Studio",
    tagColor: "#B20001",
    description:
      "Our largest studio space — full-length mirrored walls, sprung hardwood floor, and a built-in sound system. Ideal for group classes, rehearsals, photo shoots, and workshops.",
    features: [
      "Full mirrored walls",
      "Sprung hardwood floor",
      "Built-in sound system",
      "Air conditioning",
      "Changing area access",
      "Suitable for up to ~20 people",
    ],
  },
  {
    id: "second-floor",
    label: "Second Floor",
    shortLabel: "2F",
    price: 250000,
    priceFormatted: "250,000",
    tag: "Practice Studio",
    tagColor: "#444444",
    description:
      "A more intimate practice space — perfect for solo rehearsals, small group sessions, tutoring, or movement coaching. Mirrors, speaker, and AC included.",
    features: [
      "Mirror wall",
      "Portable speaker",
      "Air conditioning",
      "Changing area access",
      "Ideal for 1–8 people",
    ],
  },
] as const;

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "How do I book a studio?",
    a: "Send us a WhatsApp message with your preferred date, time slot, floor, and how long you need it. We'll confirm availability and send payment details.",
  },
  {
    q: "What are the rental hours?",
    a: "Studios are available for rent Monday to Friday, 10:00–13:00. Outside these hours, the studios are in use for our regular classes.",
  },
  {
    q: "Is there a minimum rental duration?",
    a: "Yes — minimum booking is 1 hour per session.",
  },
  {
    q: "What's included in the rental?",
    a: "All rentals include use of the space, mirrors, sound system (or speaker for 2F), air conditioning, and access to the changing area. You bring your own music device.",
  },
  {
    q: "Can I use the studio for photography or videography?",
    a: "Yes, both floors are suitable for photo and video shoots. Please mention this when booking so we can advise on the best setup.",
  },
  {
    q: "Is parking available?",
    a: "Yes, there is parking available on-site at Jl. Bypass Ngurah Rai No.88A, Sanur.",
  },
] as const;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function StudioRentalPage() {
  return (
    <main style={{ background: "#0d0d0d", color: "#DDDDDD", minHeight: "100vh" }}>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, #6a0001 0%, #3a0000 40%, #0d0d0d 75%)",
          padding: "5rem 1.5rem 3.5rem",
          textAlign: "center",
          borderBottom: "1px solid #1e1e1e",
        }}
        aria-label="Studio rental intro"
      >
        <p style={s.eyebrow}>Sanur · Bali</p>
        <h1 style={s.h1}>Dance Studio for Rent</h1>
        <p style={s.lead}>
          Professional studio spaces available by the hour — ideal for rehearsals,
          classes, workshops, and shoots.
        </p>
        <HeroCTAs waHref={WA_HREF} />
      </section>

      {/* ── Floor cards ────────────────────────────────────────────────────── */}
      <AnimatedSection>
        <section
          aria-label="Studio options"
          style={{ maxWidth: "900px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}
        >
          <SectionLabel>Studio Spaces</SectionLabel>
          <h2 style={s.h2}>Two floors, two price points</h2>
          <p style={s.bodySub}>
            Choose the space that fits your session — both floors are fully equipped and available
            Monday to Friday, 10:00–13:00.
          </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem", marginTop: "2rem" }}>
          {FLOORS.map((floor) => (
            <div
              key={floor.id}
              style={{
                background: "#111111",
                border: "1px solid #222222",
                borderRadius: "6px",
                overflow: "hidden",
              }}
            >
              {/* Card header */}
              <div style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #141414 100%)",
                borderBottom: "1px solid #1e1e1e",
                padding: "1.5rem",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div>
                    <span style={{
                      fontFamily: "var(--font-inter, sans-serif)",
                      fontSize: "0.65rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: floor.tagColor,
                      display: "block",
                      marginBottom: "0.35rem",
                    }}>
                      {floor.tag}
                    </span>
                    <h3 style={{
                      fontFamily: "var(--font-archivo-black, sans-serif)",
                      fontSize: "1.15rem",
                      fontWeight: 400,
                      color: "#EFEFEF",
                      margin: 0,
                    }}>
                      {floor.label}
                    </h3>
                  </div>
                  {/* Floor badge */}
                  <div style={{
                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    border: `1px solid ${floor.tagColor}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <span style={{
                      fontFamily: "var(--font-archivo-black, sans-serif)",
                      fontSize: "0.85rem",
                      color: floor.tagColor,
                    }}>
                      {floor.shortLabel}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{
                    fontFamily: "var(--font-archivo-black, sans-serif)",
                    fontSize: "1.9rem",
                    color: "#FFFFFF",
                    lineHeight: 1,
                  }}>
                    IDR {floor.priceFormatted}
                  </span>
                  <span style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", color: "#666666" }}>
                    / hour
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div style={{ padding: "1.5rem" }}>
                <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.85rem", color: "#999999", lineHeight: 1.7, marginBottom: "1.25rem" }}>
                  {floor.description}
                </p>
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {floor.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", marginBottom: "0.5rem" }}>
                      <CheckMark />
                      <span style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.82rem", color: "#BBBBBB" }}>
                        {f}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>
      </AnimatedSection>

      {/* ── Availability ───────────────────────────────────────────────────── */}
      <AnimatedSection delay={0.1}>
        <section
          id="availability"
          aria-label="Rental availability"
          style={{
            maxWidth: "900px",
          margin: "0 auto",
          padding: "2rem 1.5rem 3rem",
          borderTop: "1px solid #1a1a1a",
        }}
      >
        <SectionLabel>Availability</SectionLabel>
        <h2 style={s.h2}>When you can book</h2>
        <p style={s.bodySub}>
          Studios are available during off-peak hours while our regular classes are not running.
        </p>

        <AvailabilityGrid />

        {/* Address card */}
        <div style={{
          marginTop: "1.5rem",
          background: "#111111",
          border: "1px solid #222222",
          borderRadius: "6px",
          padding: "1.25rem 1.5rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", fontWeight: 600, color: "#666666", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>
              Address
            </p>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.9rem", color: "#DDDDDD", margin: 0, lineHeight: 1.6 }}>
              Jl. Bypass Ngurah Rai No.88A<br />
              Sanur, Denpasar Selatan, Bali
            </p>
          </div>
          <a
            href="https://maps.app.goo.gl/Esoa9MtswJxsoN3R7"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.6rem 1.2rem",
              background: "#1a1a1a",
              border: "1px solid #333",
              borderRadius: "3px",
              color: "#AAAAAA",
              fontSize: "0.8rem",
              fontFamily: "var(--font-inter, sans-serif)",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            <span aria-hidden="true">📍</span> Get directions
          </a>
        </div>
      </section>
      </AnimatedSection>

      {/* ── Booking CTA ────────────────────────────────────────────────────── */}
      <AnimatedSection delay={0.15}>
        <section
          aria-label="Booking call to action"
          style={{
            background: "radial-gradient(ellipse 70% 120% at 100% 50%, #2a0001 0%, #111111 60%)",
            borderTop: "1px solid #1e1e1e",
            borderBottom: "1px solid #1e1e1e",
            padding: "3.5rem 1.5rem",
            textAlign: "center",
          }}
        >
          <p style={s.eyebrow}>Book your session</p>
          <h2 style={{ ...s.h2, marginBottom: "0.75rem" }}>Reserve via WhatsApp</h2>
          <p style={{ ...s.bodySub, maxWidth: "480px", margin: "0 auto 2rem" }}>
            Tell us which floor, your preferred date, start time, and duration.
            We'll confirm within a few hours.
          </p>
          <BookingButton href={WA_HREF} large />
        </section>
      </AnimatedSection>

      {/* ── FAQ ────────────────────────────────────────────────────────────── */}
      <AnimatedSection delay={0.2}>
        <section
          aria-label="Frequently asked questions"
          style={{ maxWidth: "760px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" }}
        >
          <SectionLabel>FAQ</SectionLabel>
          <h2 style={s.h2}>Common questions</h2>

        <div style={{ marginTop: "1.75rem" }}>
          {FAQS.map((faq, i) => (
            <div
              key={i}
              style={{
                borderTop: i === 0 ? "1px solid #1e1e1e" : undefined,
                borderBottom: "1px solid #1e1e1e",
                padding: "1.25rem 0",
              }}
            >
              <h3 style={{
                fontFamily: "var(--font-inter, sans-serif)",
                fontSize: "0.9rem",
                fontWeight: 600,
                color: "#EFEFEF",
                margin: "0 0 0.5rem",
              }}>
                {faq.q}
              </h3>
              <p style={{
                fontFamily: "var(--font-inter, sans-serif)",
                fontSize: "0.85rem",
                color: "#999999",
                lineHeight: 1.75,
                margin: 0,
              }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
      </AnimatedSection>

      {/* ── Also at ESTS ────────────────────────────────────────────────────── */}
      <AnimatedSection delay={0.25}>
        <section
          aria-label="Also at Eva Scolaro Talent Studio"
          style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem 1.5rem 4rem" }}
        >
        <div style={{
          background: "#111111",
          border: "1px solid #1e1e1e",
          borderRadius: "6px",
          padding: "1.75rem 2rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1.25rem",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B20001", marginBottom: "0.4rem" }}>
              Eva Scolaro Talent Studio
            </p>
            <p style={{ fontFamily: "var(--font-archivo-black, sans-serif)", fontSize: "1rem", color: "#EFEFEF", margin: "0 0 0.4rem" }}>
              Looking for classes for your child?
            </p>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.82rem", color: "#888888", margin: 0 }}>
              Ballet, Hip-Hop, K-Pop, Singing, Drama & more — Sanur & Canggu.
            </p>
          </div>
          <Link
            href="/classes"
            style={{
              display: "inline-block",
              padding: "0.65rem 1.5rem",
              background: "#B20001",
              borderRadius: "3px",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontFamily: "var(--font-inter, sans-serif)",
              fontWeight: 600,
              textDecoration: "none",
              whiteSpace: "nowrap",
              letterSpacing: "0.03em",
            }}
          >
            View classes →
          </Link>
        </div>
      </section>
      </AnimatedSection>

      {/* Back link */}
      <div style={{ textAlign: "center", paddingBottom: "3rem" }}>
        <Link href="/" style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", color: "#444444", textDecoration: "none" }}>
          ← Back to homepage
        </Link>
      </div>

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildStudioRentalSchema()) }}
      />

    </main>
  );
}

// ─── Small shared components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{
      fontFamily: "var(--font-inter, sans-serif)",
      fontSize: "0.65rem",
      fontWeight: 700,
      letterSpacing: "0.18em",
      textTransform: "uppercase",
      color: "#B20001",
      marginBottom: "0.6rem",
    }}>
      {children}
    </p>
  );
}

function CheckMark() {
  return (
    <svg viewBox="0 0 16 16" fill="none" style={{ width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#B20001" strokeWidth="1.2" />
      <path d="M5 8l2 2 4-4" stroke="#B20001" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Style constants ──────────────────────────────────────────────────────────

const s = {
  eyebrow: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase" as const,
    color: "#B20001",
    marginBottom: "0.75rem",
  },
  h1: {
    fontFamily: "var(--font-archivo-black, sans-serif)",
    fontSize: "clamp(2rem, 5vw, 3.25rem)",
    fontWeight: 400,
    color: "#EFEFEF",
    lineHeight: 1.1,
    marginBottom: "1rem",
  },
  h2: {
    fontFamily: "var(--font-archivo-black, sans-serif)",
    fontSize: "clamp(1.4rem, 3vw, 2rem)",
    fontWeight: 400,
    color: "#EFEFEF",
    lineHeight: 1.2,
    marginBottom: "0.75rem",
    marginTop: "0.25rem",
  },
  lead: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "1rem",
    color: "#AAAAAA",
    lineHeight: 1.7,
    maxWidth: "520px",
    margin: "0 auto",
  },
  bodySub: {
    fontFamily: "var(--font-inter, sans-serif)",
    fontSize: "0.875rem",
    color: "#888888",
    lineHeight: 1.75,
    marginBottom: "0.5rem",
  },
} as const;
