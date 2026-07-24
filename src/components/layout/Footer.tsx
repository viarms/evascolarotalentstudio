"use client";
// src/components/layout/Footer.tsx
//
// Pixel-perfect match of the live WP site footer (elementor-6804).
//
// Bottom strip links: Terms & Conditions | Privacy Notice | Contact | Feedback
// Link text color: #A5A5A5, hover: #EFEFEF

import Image from "next/image";
import Link from "next/link";

// ─── Constants ────────────────────────────────────────────────────────────────

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";

const FOOTER_LINKS = [
  { label: "Terms & Conditions", href: "https://www.evascolarotalentstudio.com/terms-conditions/", external: true },
  { label: "Privacy Notice", href: "/privacy-notice/", external: false },
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
          backgroundColor: "#000000",
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
          backgroundColor: "#000000",
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
          {FOOTER_LINKS.map(({ label, href, external }) => (
            <li key={label}>
              {external ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#A5A5A5] hover:text-[#EFEFEF] transition-colors duration-300 no-underline"
                  style={{ fontSize: "0.8em" }}
                >
                  {label}
                </a>
              ) : (
                <Link
                  href={href}
                  className="text-[#A5A5A5] hover:text-[#EFEFEF] transition-colors duration-300 no-underline"
                  style={{ fontSize: "0.8em" }}
                >
                  {label}
                </Link>
              )}
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
              className="text-[#A5A5A5] hover:text-[#EFEFEF] transition-colors duration-300 cursor-pointer bg-transparent border-none p-0"
              style={{ fontSize: "0.8em" }}
            >
              Feedback
            </button>
          </li>
          <li>
            <a
              href="/contact/"
              className="text-[#A5A5A5] hover:text-[#EFEFEF] transition-colors duration-300 no-underline"
              style={{ fontSize: "0.8em" }}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* Handcrafted with love credit */}
        <p
          className="flex items-center justify-center gap-1.5 m-0 mt-4"
          style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", color: "#666666" }}
        >
          Handcrafted with
          <svg aria-label="love" role="img" viewBox="0 0 24 24" fill="currentColor"
               className="w-3.5 h-3.5 flex-shrink-0" style={{ color: "#666666" }}>
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
          by{" "}
          <a
            href="https://www.fstdo.co.id"
            target="_blank"
            rel="noopener noreferrer"
            title="Web Developer in Bali"
            className="hover:text-[#EFEFEF] transition-colors duration-300"
            style={{ color: "#666666" }}
          >
            FireStone Studio
          </a>
        </p>
      </div>
    </footer>
  );
}
