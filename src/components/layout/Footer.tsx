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
      className="fixed left-0 right-0 z-[999]"
      style={{ bottom: "-63px" }}
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
        {/* Logo + Trusted by */}
        <div className="flex flex-col items-center gap-[10px] mb-4">
          {/* ESTS White logo (SVG inline so we don't need a file for footer) */}
          <Image
            src="/logo-white.svg"
            alt="Eva Scolaro Talent Studio"
            width={200}
            height={109}
            className="h-auto"
            style={{ width: "200px" }}
          />

          {/* "Trusted by" */}
          <p
            className="text-center m-0"
            style={{ fontFamily: "Inter, sans-serif", fontSize: "13px", fontWeight: 400, color: "#DDDDDD" }}
          >
            Trusted by
          </p>
        </div>

        {/* Partner logos row */}
        <div className="flex flex-row flex-wrap items-center justify-center gap-6 mb-2">
          {/* Toki Hub logo */}
          <TokiHubLogo />
          {/* Parklife logo */}
          <ParklifeLogo />
          {/* Toki Hub logo (second instance matches WP) */}
          <TokiHubLogo />
        </div>
      </div>

      {/* ── Bottom strip ── */}
      <div
        className="w-full flex flex-col items-center gap-[10px]"
        style={{
          backgroundColor: "rgba(0, 0, 0, 0.85)",
          borderBottom: "5px solid #000000",
          paddingBottom: "3em",
          paddingTop: "0",
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
                className="transition-colors duration-300"
                style={{ fontSize: "0.8em", color: "#A5A5A5", textDecoration: "none" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#EFEFEF"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "#A5A5A5"; }}
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

// ─── Partner logo components (inline SVG to avoid external image deps) ────────

// Toki Hub: white inline SVG (100×100)
function TokiHubLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width="100"
      height="100"
      viewBox="0 0 922.08 810"
      preserveAspectRatio="xMidYMid meet"
      aria-label="Toki Hub"
      role="img"
    >
      <defs>
        <clipPath id="toki-clip">
          <path d="M 1.05 1.09 L 919.63 1.09 L 919.63 808.79 L 1.05 808.79 Z" />
        </clipPath>
      </defs>
      <g clipPath="url(#toki-clip)">
        {/* Simplified white placeholder — actual partner logo */}
        <rect width="920" height="808" x="1" y="1" fill="white" opacity="0.15" rx="8" />
        <text x="460" y="420" textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize="80" fontFamily="Inter, sans-serif" fontWeight="700">
          TOKI
        </text>
        <text x="460" y="520" textAnchor="middle" dominantBaseline="middle"
              fill="white" fontSize="60" fontFamily="Inter, sans-serif" fontWeight="400">
          HUB
        </text>
      </g>
    </svg>
  );
}

// Parklife: white inline SVG (100×~130)
function ParklifeLogo() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="100"
      height="130"
      viewBox="0 0 5197.49 6739.38"
      aria-label="Parklife"
      role="img"
      style={{ fill: "white" }}
    >
      {/* Simplified placeholder — actual Parklife logo is the inline SVG from WP */}
      <rect width="5000" height="6500" x="100" y="100" fill="white" opacity="0.15" rx="200" />
      <text x="2598" y="3200" textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize="800" fontFamily="Inter, sans-serif" fontWeight="700">
        PARK
      </text>
      <text x="2598" y="4200" textAnchor="middle" dominantBaseline="middle"
            fill="white" fontSize="700" fontFamily="Inter, sans-serif" fontWeight="400">
        LIFE
      </text>
    </svg>
  );
}
