// src/components/layout/Footer.tsx
//
// Pixel-perfect match of the live WP site footer (elementor-6804).
//
// Structure: fixed sticky bottom bar, mostly below viewport (bottom: -63px),
// slides up naturally as the user scrolls to the bottom of the page.
//
// Outer bar background: rgba(0,0,0,0.85)
// Bottom strip: border-top none / border-bottom 5px solid #000; bg: rgba(0,0,0,0.85)
//
// Content (top section, padding 3em top / 1em bottom):
//   - ESTS logo (white SVG, 200px wide)
//   - "Trusted by" heading (Inter 13px, #DDDDDD)
//   - Partner logos row: Toki Hub | Parklife | Toki Hub (inline SVGs, 100px each)
//
// Bottom strip (padding-bottom 3em):
//   - Address: Jl. Bypass Ngurah Rai No.88A, Sanur. Denpasar Selatan
//   - Phone/WA: +62 821 4628 4464
//   - PT EVA SCOLARO ENTERTAINMENT
//   - Links: Terms & Conditions | Feedback | Contact
//   - Link text color: #A5A5A5, hover: #EFEFEF

import Image from "next/image";

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";

const FOOTER_LINKS = [
  { label: "Terms & Conditions", href: "https://www.evascolarotalentstudio.com/terms-conditions/" },
  { label: "Feedback",           href: "/contact/" },
  { label: "Contact",            href: "/contact/" },
] as const;

// ─── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  return (
    <footer
      className="w-full"
      aria-label="Site footer"
    >
      {/* ── Main content bar ── */}
      <div
        className="w-full flex flex-col items-center justify-center"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          paddingTop: "3em",
          paddingBottom: "1em",
        }}
      >
        {/* Logo + Trusted by — ample gap between them */}
        <div className="flex flex-col items-center gap-[20px] mb-8">
          <Image
            src="/logo-white.svg"
            alt="Eva Scolaro Talent Studio"
            width={200}
            height={109}
            className="h-auto"
            style={{ width: "200px" }}
          />
          <p
            className="text-center m-0"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: "#DDDDDD" }}
          >
            Trusted by
          </p>
        </div>

        {/* Partner logos row — narrower max-width, even spacing */}
        <div className="w-full max-w-[600px] flex flex-row items-center justify-between px-8 mb-10">
          <Image
            src="/ais-logo.svg"
            alt="AIS Indonesia"
            width={130}
            height={90}
            className="h-[90px]"
            style={{ width: "auto" }}
          />
          <Image
            src="/secana-logo.svg"
            alt="Secana Beachtown"
            width={70}
            height={90}
            className="h-[90px]"
            style={{ width: "auto" }}
          />
          <Image
            src="/dyatmika-logo.svg"
            alt="Dyatmika"
            width={90}
            height={90}
            className="h-[90px] w-auto"
          />
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div
        className="w-full flex flex-col items-center gap-[10px]"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderBottom: "5px solid #000000",
          paddingBottom: "3em",
          paddingTop: "2em",
        }}
      >
        {/* Address & phone */}
        <p
          className="text-center m-0 px-4"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: "#DDDDDD" }}
        >
          Head Office : Jl. Bypass Ngurah Rai No.88A, Sanur. Denpasar Selatan
          <br />
          Phone call &amp; Whatsapp :{" "}
          <a
            href={`https://wa.me/${WA_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: "#DDDDDD" }}
          >
            +62 821 4628 4464
          </a>{" "}
          (Customer service)
        </p>

        {/* Company name */}
        <p
          className="text-center m-0"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: "#DDDDDD" }}
        >
          PT EVA SCOLARO ENTERTAINMENT
        </p>

        {/* Footer links */}
        <ul className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1 list-none m-0 p-0">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={label}>
              <a
                href={href}
                className="text-[#A5A5A5] hover:text-[#EFEFEF] transition-colors duration-300 no-underline"
                style={{ fontSize: "0.8em" }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}


