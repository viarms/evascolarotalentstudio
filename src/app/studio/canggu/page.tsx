// src/app/studio/canggu/page.tsx
// Dance Studio, Canggu — Eva Scolaro Talent Studio
// Primary keyword: "dance studio canggu" / "dance studio bali"

import type { Metadata } from "next";
import Link from "next/link";
import { fetchScheduleForLocation } from "@/lib/queries/classQueries";
import { buildStudioLocationSchema } from "@/lib/schema";
import HeroCTAs from "./HeroCTAs";
import GalleryStrip from "./GalleryStrip";
import BookTrialButton from "./BookTrialButton";

export const metadata: Metadata = {
  title: "Dance Studio Canggu — Kids & Teen Classes | Eva Scolaro Talent Studio",
  description:
    "Looking for a dance studio in Canggu? Eva Scolaro Talent Studio offers ballet, hip-hop, K-pop, singing & more for kids and teens. Book a free trial today.",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com/studio/canggu/",
    languages: {
      "en": "https://www.evascolarotalentstudio.com/studio/canggu/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Eva Scolaro Talent Studio",
    title: "Dance Studio Canggu — Kids & Teen Classes | Eva Scolaro Talent Studio",
    description:
      "Bali's leading performing arts studio for children — right in the heart of Canggu. Ballet, Hip-Hop, K-Pop, Singing & more. First trial class is free.",
    url: "https://www.evascolarotalentstudio.com/studio/canggu/",
    images: [{ url: "/slideshow/hiphop-junior.webp", width: 1200, height: 800, alt: "Kids hip-hop class at Eva Scolaro Talent Studio, Canggu" }],
  },
};

// ─── Static content ───────────────────────────────────────────────────────────

const CLASSES = [
  { slug: "hip-hop",    name: "Hip-Hop",    ages: "3–16 yrs" },
  { slug: "ballet",     name: "Ballet",     ages: "3–16 yrs" },
  { slug: "singing",    name: "Singing",    ages: "3–16 yrs" },
  { slug: "kpop-dance", name: "K-Pop Dance", ages: "6–16 yrs" },
  { slug: "breakdance", name: "Breakdance", ages: "6–16 yrs" },
  { slug: "modeling",   name: "Modeling",   ages: "3–16 yrs" },
] as const;

const PRICING = [
  { tier: "4× / month",  price: "180,000", highlight: false },
  { tier: "8× / month",  price: "140,000", highlight: true  },
  { tier: "12× / month", price: "110,000", highlight: false },
] as const;

const FAQS = [
  {
    question: "Where is the Canggu studio?",
    answer:
      "Our Canggu studio is located at Jl. Pemelisan Agung, Canggu, Kuta Utara, Badung, Bali 80361 — easy to reach from Canggu, Seminyak, and Echo Beach. Free parking available on-site.",
  },
  {
    question: "Is parking available?",
    answer: "Yes, free parking is available at our Canggu studio.",
  },
  {
    question: "What classes run at the Canggu studio?",
    answer:
      "We run Hip-Hop, Ballet, K-Pop Dance, Singing, Breakdance, and Modeling at our Canggu location. Check the timetable above for exact days and times.",
  },
  {
    question: "How is Canggu different from the Sanur studio?",
    answer:
      "The class offering is similar but the schedule and class mix differ slightly. Sanur is our flagship with the widest timetable. Both studios have the same quality coaches and facilities.",
  },
  {
    question: "How do I book a free trial at the Canggu studio?",
    answer:
      "Tap 'Book a Free Trial' on this page — our team will reach out via WhatsApp to confirm your preferred class and time, usually within a few hours.",
  },
] as const;

const DAY_ORDER = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// ─── Style constants ──────────────────────────────────────────────────────────

const s = {
  eyebrow: {
    fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.65rem", fontWeight: 700,
    letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#B20001",
    marginBottom: "0.75rem", display: "block",
  },
  h1: {
    fontFamily: "var(--font-archivo-black, sans-serif)",
    fontSize: "clamp(2rem, 5vw, 3.25rem)", fontWeight: 400, color: "#EFEFEF",
    lineHeight: 1.1, marginBottom: "1rem",
  },
  h2: {
    fontFamily: "var(--font-archivo-black, sans-serif)",
    fontSize: "clamp(1.4rem, 3vw, 2rem)", fontWeight: 400, color: "#EFEFEF",
    lineHeight: 1.2, marginBottom: "0.75rem", marginTop: "0.25rem",
  },
  lead: {
    fontFamily: "var(--font-inter, sans-serif)", fontSize: "1rem", color: "#AAAAAA",
    lineHeight: 1.7, maxWidth: "520px", margin: "0 auto",
  },
  bodySub: {
    fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.875rem",
    color: "#999999", lineHeight: 1.75, marginBottom: "0.5rem",
  },
  sectionLabel: {
    fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.65rem", fontWeight: 700,
    letterSpacing: "0.18em", textTransform: "uppercase" as const, color: "#B20001",
    marginBottom: "0.6rem", display: "block",
  },
} as const;

const wrap  = { maxWidth: "900px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" };
const wrapN = { maxWidth: "760px", margin: "0 auto", padding: "3.5rem 1.5rem 2rem" };
const divider = { borderTop: "1px solid #1a1a1a" };

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function CangguPage() {
  const schedule = await fetchScheduleForLocation("Canggu Studio");

  const byDay: Record<string, typeof schedule> = {};
  for (const item of schedule) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }
  const orderedDays = DAY_ORDER.filter((d) => byDay[d]);

  const schema = buildStudioLocationSchema({
    location: "canggu",
    faqs: FAQS.map((f) => ({ question: f.question, answer: f.answer })),
  });

  return (
    <main style={{ background: "#0d0d0d", color: "#DDDDDD", minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% -10%, #B20001 0%, #6a0001 25%, #2a0000 55%, #0d0d0d 80%)",
          padding: "5rem 1.5rem 3.5rem", textAlign: "center", borderBottom: "1px solid #1e1e1e",
        }}
        aria-label="Canggu studio intro"
      >
        <span style={s.eyebrow}>Canggu · Bali</span>
        <h1 style={s.h1}>Kids Dance Studio<br />in Canggu, Bali</h1>
        <p style={s.lead}>
          Right in the heart of Canggu — Eva Scolaro Talent Studio brings Bali&apos;s best
          performing arts classes for kids to Kuta Utara, Echo Beach, and the surrounding area.
        </p>
        <HeroCTAs />
      </section>

      {/* ── About the Studio ─────────────────────────────────────────────── */}
      <section style={{ ...wrap, ...divider }} aria-label="About Canggu studio">
        <span style={s.sectionLabel}>About the Studio</span>
        <h2 style={s.h2}>Eva Scolaro in Canggu</h2>
        <p style={{ ...s.bodySub, maxWidth: "620px", marginBottom: "1.25rem" }}>
          Our Canggu studio sits on Jl. Pemelisan Agung in Canggu — easy access from Canggu, Seminyak,
          and the surrounding expat neighbourhoods. The same world-class facilities as our
          Sanur flagship: sprung floor, mirrors, AC, and pro sound. Free parking available.
        </p>

        {/* Facility chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.75rem" }}>
          {["Sprung hardwood floor","Full-length mirrors","Air conditioning","Pro sound system","Free parking","Changing area"].map((f) => (
            <span key={f} style={{
              fontSize: "0.75rem", background: "#111111", border: "1px solid #222222",
              borderRadius: "3px", padding: "0.3rem 0.7rem", color: "#AAAAAA",
            }}>{f}</span>
          ))}
        </div>

        {/* Address placeholder — update once confirmed by client */}
        <div style={{
          background: "#111111", border: "1px solid #222222", borderRadius: "3px",
          padding: "1.25rem 1.5rem", display: "flex", flexWrap: "wrap",
          alignItems: "center", justifyContent: "space-between", gap: "1rem",
        }}>
          <div>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.75rem", fontWeight: 600, color: "#666666", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.3rem" }}>Address</p>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.9rem", color: "#DDDDDD", lineHeight: 1.6 }}>
                Jl. Pemelisan Agung<br />Canggu, Kuta Utara, Badung, Bali 80361
            </p>
          </div>
          <a
            href="https://share.google/ZhCOKdpFJfby710Zr"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              padding: "0.6rem 1.2rem", background: "#1a1a1a", border: "1px solid #333333",
              borderRadius: "2px", color: "#AAAAAA", fontSize: "0.8rem",
              fontFamily: "var(--font-inter, sans-serif)", textDecoration: "none", whiteSpace: "nowrap",
            }}
          >
            📍 Get directions
          </a>
        </div>
      </section>

      {/* ── Classes at Canggu ────────────────────────────────────────────── */}
      <section style={{ ...wrap, ...divider }} aria-label="Classes available at Canggu">
        <span style={s.sectionLabel}>Classes at This Studio</span>
        <h2 style={s.h2}>What we teach in Canggu</h2>
        <p style={s.bodySub}>Classes running at our Canggu studio. Click any class for full details.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "1.75rem" }}>
          {CLASSES.map((cls) => (
            <Link key={cls.slug} href={`/classes/${cls.slug}`} style={{
              background: "#111111", border: "1px solid #1e1e1e", borderRadius: "3px",
              padding: "1rem 1.1rem", textDecoration: "none", display: "block",
            }}>
              <p style={{ fontFamily: "var(--font-archivo-black, sans-serif)", fontSize: "0.85rem", color: "#EFEFEF", marginBottom: "0.4rem" }}>{cls.name}</p>
              <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.72rem", color: "#555555", marginBottom: "0.5rem" }}>Ages {cls.ages}</p>
              <span style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.72rem", color: "#B20001", fontWeight: 600 }}>Details →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Timetable ────────────────────────────────────────────────────── */}
      <section id="timetable" style={{ ...wrap, ...divider }} aria-label="Canggu weekly timetable">
        <span style={s.sectionLabel}>Weekly Timetable</span>
        <h2 style={s.h2}>Canggu class schedule</h2>
        <p style={s.bodySub}>Live schedule — updated automatically from our booking system.</p>
        <div style={{ marginTop: "1.75rem", overflowX: "auto" }}>
          {schedule.length === 0 ? (
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.85rem", color: "#555555" }}>
              Schedule loading — please check back shortly or{" "}
              <a href="https://wa.me/6282146284464" style={{ color: "#B20001" }}>ask us on WhatsApp</a>.
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid #1e1e1e" }}>
                  {(["Day","Class","Time","Coach"] as const).map((h) => (
                    <th key={h} style={{
                      textAlign: "left", padding: "0.6rem 1rem 0.6rem 0", fontWeight: 600,
                      color: "#555555", fontSize: "0.65rem", letterSpacing: "0.1em",
                      textTransform: "uppercase", whiteSpace: "nowrap",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orderedDays.map((day) =>
                  byDay[day].map((item, i) => (
                    <tr key={`${day}-${i}`} style={{ borderBottom: "1px solid #141414" }}>
                      <td style={{ padding: "0.65rem 1rem 0.65rem 0", verticalAlign: "top", whiteSpace: "nowrap" }}>
                        {i === 0 && (
                          <span style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#888888" }}>
                            {day}
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "0.65rem 1rem", color: "#DDDDDD" }}>{item.className}</td>
                      <td style={{ padding: "0.65rem 1rem", color: "#AAAAAA", whiteSpace: "nowrap" }}>{item.timeStart}–{item.timeEnd}</td>
                      <td style={{ padding: "0.65rem 0 0.65rem 1rem", color: "#666666", fontSize: "0.78rem" }}>{item.coach}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* ── Gallery ──────────────────────────────────────────────────────── */}
      <section style={{ ...wrap, ...divider }} aria-label="Studio photo gallery">
        <span style={s.sectionLabel}>Gallery</span>
        <h2 style={s.h2}>Life at the Canggu studio</h2>
        <p style={s.bodySub}>Hover any photo to expand it.</p>
        <div style={{ marginTop: "1.75rem" }}><GalleryStrip /></div>
        <a
          href="https://www.evascolarotalentstudio.com/gallery/"
          target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-block", marginTop: "1rem", fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", color: "#555555", textDecoration: "none" }}
        >
          View full gallery →
        </a>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section style={{ ...wrap, ...divider }} aria-label="Pricing">
        <span style={s.sectionLabel}>Pricing</span>
        <h2 style={s.h2}>Simple, transparent pricing</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "0.75rem", marginTop: "1.5rem" }}>
          {PRICING.map((p) => (
            <div key={p.tier} style={{
              background: p.highlight ? "#1a0000" : "#111111",
              border: `1px solid ${p.highlight ? "#B20001" : "#222222"}`,
              borderRadius: "3px", padding: "1.25rem 1.5rem", position: "relative",
            }}>
              {p.highlight && (
                <span style={{
                  position: "absolute", top: "-1px", right: "1.25rem",
                  background: "#B20001", color: "#fff", fontSize: "0.6rem",
                  fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "0.2rem 0.6rem", borderRadius: "0 0 3px 3px",
                  fontFamily: "var(--font-inter, sans-serif)",
                }}>Most popular</span>
              )}
              <p style={{ fontFamily: "var(--font-archivo-black, sans-serif)", fontSize: "1.5rem", color: "#EFEFEF", marginBottom: "0.2rem" }}>IDR {p.price}</p>
              <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.75rem", color: "#666666", marginBottom: "0.6rem" }}>per session</p>
              <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", fontWeight: 600, color: "#888888" }}>{p.tier}</p>
            </div>
          ))}
        </div>
        <div style={{
          marginTop: "1.25rem", background: "#111111", border: "1px solid #1a3a1a",
          borderRadius: "3px", padding: "1rem 1.25rem", display: "flex", alignItems: "center", gap: "0.75rem",
        }}>
          <span aria-hidden="true" style={{ fontSize: "1.1rem" }}>🎁</span>
          <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.85rem", color: "#AAAAAA", lineHeight: 1.5 }}>
            <strong style={{ color: "#EFEFEF" }}>First trial class is free</strong> — no registration fee, no commitment required.{" "}
            <Link href="/#pricing" style={{ color: "#B20001", textDecoration: "none" }}>Full pricing details →</Link>
          </p>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section style={{ ...wrapN, ...divider }} aria-label="Frequently asked questions — Canggu">
        <span style={s.sectionLabel}>FAQ</span>
        <h2 style={s.h2}>Common questions — Canggu</h2>
        <div style={{ marginTop: "1.75rem" }}>
          {FAQS.map((faq, i) => (
            <details key={i} style={{ borderTop: i === 0 ? "1px solid #1e1e1e" : undefined, borderBottom: "1px solid #1e1e1e" }}>
              <summary style={{
                padding: "1.1rem 0", cursor: "pointer", listStyle: "none",
                display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem",
                fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.9rem", fontWeight: 600, color: "#EFEFEF",
              }}>
                {faq.question}
                <span style={{ color: "#B20001", fontSize: "1rem", flexShrink: 0 }} aria-hidden="true">+</span>
              </summary>
              <p style={{
                fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.85rem",
                color: "#999999", lineHeight: 1.75, paddingBottom: "1.1rem", paddingRight: "1rem",
              }}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── Book Trial CTA strip ─────────────────────────────────────────── */}
      <section
        style={{
          background: "radial-gradient(ellipse 70% 120% at 100% 50%, #2a0001 0%, #111111 60%)",
          borderTop: "1px solid #1e1e1e", borderBottom: "1px solid #1e1e1e",
          padding: "3.5rem 1.5rem", textAlign: "center",
        }}
        aria-label="Book a free trial"
      >
        <span style={s.eyebrow}>Ready to start?</span>
        <h2 style={{ ...s.h2, marginBottom: "0.75rem" }}>Book your free trial class</h2>
        <p style={{ ...s.bodySub, maxWidth: "480px", margin: "0 auto 2rem" }}>
          No registration fee. No commitment. Just bring your child and let them try.
        </p>
        <BookTrialButton label="Book a Free Trial — Canggu" />
      </section>

      {/* ── Cross-links ──────────────────────────────────────────────────── */}
      <section style={{ ...wrap, ...divider }} aria-label="Also at Eva Scolaro Talent Studio">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1rem", maxWidth: "640px" }}>
          <Link href="/studio/sanur/" style={{
            background: "#111111", border: "1px solid #1e1e1e", borderRadius: "3px",
            padding: "1.25rem 1.5rem", textDecoration: "none", display: "block",
          }}>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B20001", marginBottom: "0.35rem" }}>Also in Sanur</p>
            <p style={{ fontFamily: "var(--font-archivo-black, sans-serif)", fontSize: "0.95rem", color: "#EFEFEF", marginBottom: "0.3rem" }}>Dance Studio, Sanur →</p>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.78rem", color: "#666666" }}>Our flagship, head office location.</p>
          </Link>
          <Link href="/classes/" style={{
            background: "#111111", border: "1px solid #1e1e1e", borderRadius: "3px",
            padding: "1.25rem 1.5rem", textDecoration: "none", display: "block",
          }}>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#B20001", marginBottom: "0.35rem" }}>Explore classes</p>
            <p style={{ fontFamily: "var(--font-archivo-black, sans-serif)", fontSize: "0.95rem", color: "#EFEFEF", marginBottom: "0.3rem" }}>All 9 class types →</p>
            <p style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.78rem", color: "#666666" }}>Ballet, Hip-Hop, K-Pop &amp; more.</p>
          </Link>
        </div>
      </section>

      <div style={{ textAlign: "center", paddingBottom: "3rem" }}>
        <Link href="/" style={{ fontFamily: "var(--font-inter, sans-serif)", fontSize: "0.8rem", color: "#444444", textDecoration: "none" }}>← Back to homepage</Link>
      </div>

      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

    </main>
  );
}
