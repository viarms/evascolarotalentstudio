"use client";
// src/components/layout/Header.tsx
//
// Shell header — structure and nav links are in place.
// Pixel-perfect styling (exact colors, font sizes, logo file) requires
// screenshots from the live WP site (Phase 1 QA checklist item).
//
// All nav links point to the existing WordPress paths — they are served by
// the WP origin via the rewrite proxy in next.config.ts, NOT as Next.js routes.

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Price",     href: "/price" },
  { label: "Timetable", href: "/timetable" },
  { label: "Gallery",   href: "/gallery" },
  { label: "Practice",  href: "/practice" },
  { label: "Dancewear", href: "/dancewear" },
  { label: "News",      href: "/news" },
] as const;

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
const WA_LINK_JOIN  = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to join Eva Scolaro Talent Studio!")}`;
const WA_LINK_TRIAL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to book a free trial class!")}`;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* ── Logo ── */}
          <Link href="/" className="flex-shrink-0 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] rounded">
            {/*
              TODO (Phase 1 QA): replace with the actual SVG/PNG logo from WP.
              Place the file at public/logo.svg and update this to:
                <Image src="/logo.svg" alt="Eva Scolaro Talent Studio" width={160} height={40} priority />
            */}
            <span className="text-[var(--color-brand-red)] text-lg leading-tight [font-family:var(--font-display)]">
              Eva Scolaro<br />
              <span className="text-gray-700 text-sm [font-family:var(--font-sans)]">Talent Studio</span>
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden md:flex items-center gap-6" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-gray-700 hover:text-[var(--color-brand-red)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] rounded [font-family:var(--font-display)]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop CTAs ── */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={WA_LINK_JOIN}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--color-brand-red)] border border-[var(--color-brand-red)] px-4 py-2 rounded-full hover:bg-[var(--color-brand-red)] hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 [font-family:var(--font-display)]"
            >
              Join Us
            </a>
            <a
              href={WA_LINK_TRIAL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-[var(--color-brand-red)] text-white px-4 py-2 rounded-full hover:bg-[var(--color-brand-red-dark)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)] focus-visible:ring-offset-2 [font-family:var(--font-display)]"
            >
              Book Free Trial
            </a>
          </div>

          {/* ── Mobile hamburger ── */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-[var(--color-brand-red)] hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-red)]"
          >
            {/* Hamburger / X icon */}
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden="true">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <div id="mobile-menu" className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 pt-2 pb-4 flex flex-col gap-1" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-md text-sm text-gray-700 hover:text-[var(--color-brand-red)] hover:bg-gray-50 transition-colors [font-family:var(--font-display)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2">
              <a
                href={WA_LINK_JOIN}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm text-[var(--color-brand-red)] border border-[var(--color-brand-red)] px-4 py-2 rounded-full hover:bg-[var(--color-brand-red)] hover:text-white transition-colors [font-family:var(--font-display)]"
              >
                Join Us
              </a>
              <a
                href={WA_LINK_TRIAL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center text-sm bg-[var(--color-brand-red)] text-white px-4 py-2 rounded-full hover:bg-[var(--color-brand-red-dark)] transition-colors [font-family:var(--font-display)]"
              >
                Book Free Trial
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
