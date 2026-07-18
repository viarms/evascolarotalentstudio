"use client";
// src/components/layout/Header.tsx
//
// Pixel-perfect match of the live WP site header (elementor-6189).
// Layout: 3 columns — social icons (15%) | nav (70%) | Join Us button (15%)
// Background: rgba(0,0,0,0.5) by default, solid black on hover/scroll.
// Nav font: Archivo Black, 0.9em, uppercase, letter-spacing 1px.
// Social icons: IG + FB + YT, white fill, 17px, accent on hover.
// Join Us button: semi-transparent black, Archivo Black 1.2em, thin border.
// Gallery has dropdown: Photo | Concerts Documentary.
// Classes has dropdown: all 9 class pages.

import { useState } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_LINKS = [
  { label: "Home",      href: "/" },
  { label: "Price",     href: "/#pricing" },
  {
    label: "Classes",
    href: "/#",
    children: [
      { label: "Hip-Hop",               href: "/classes/hip-hop/" },
      { label: "Ballet",                href: "/classes/ballet/" },
      { label: "Singing",               href: "/classes/singing/" },
      { label: "K-Pop Dance",           href: "/classes/kpop-dance/" },
      { label: "Jazz Dance",            href: "/classes/jazz-dance/" },
      { label: "Drama & Musical Theatre", href: "/classes/drama-musical-theatre/" },
      { label: "Modeling",              href: "/classes/modeling/" },
      { label: "Breakdance",            href: "/classes/breakdance/" },
      { label: "Public Speaking",       href: "/classes/public-speaking/" },
    ],
  },
  { label: "Timetable", href: "/#timetable" },
  {
    label: "Gallery",
    href: "/#",
    children: [
      { label: "Photo",                 href: "/gallery/" },
      { label: "Concerts Documentary",  href: "/concerts-documentary/" },
    ],
  },
  { label: "Practice",  href: "/practice/" },
  { label: "Dancewear", href: "/dancewear/" },
  { label: "News",      href: "/announcement/" },
] as const;

// Join Us opens a WA link (same behaviour as the original popup CTA)
const WA_NUMBER    = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
const JOIN_US_HREF = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to join Eva Scolaro Talent Studio!")}`;

// ─── Social icon SVGs (from live site — Font Awesome 5 Brands) ───────────────

function InstagramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
         className="w-[17px] h-[17px] fill-current">
      <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
         className="w-[17px] h-[17px] fill-current">
      <path d="M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
         className="w-[17px] h-[17px] fill-current">
      <path d="M186.8 202.1l95.2 54.1-95.2 54.1V202.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-42 176.3s0-59.6-7.6-88.2c-4.2-15.8-16.5-28.2-32.2-32.4C337.9 128 224 128 224 128s-113.9 0-142.2 7.7c-15.7 4.2-28 16.6-32.2 32.4-7.6 28.5-7.6 88.2-7.6 88.2s0 59.6 7.6 88.2c4.2 15.8 16.5 27.7 32.2 31.9C110.1 384 224 384 224 384s113.9 0 142.2-7.7c15.7-4.2 28-16.1 32.2-31.9 7.6-28.5 7.6-88.1 7.6-88.1z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  { label: "Instagram", href: "https://www.instagram.com/evascolaro_talent_studio/", Icon: InstagramIcon },
  { label: "Facebook",  href: "https://www.facebook.com/evascolarotalentstudio",     Icon: FacebookIcon },
  { label: "YouTube",   href: "https://www.youtube.com/@evascolarotalentstudio8290",  Icon: YouTubeIcon },
] as const;

// ─── NavItem (handles dropdown) ───────────────────────────────────────────────

type NavLinkItem = {
  label: string;
  href: string;
  children?: readonly { label: string; href: string }[];
};

function NavItem({ item }: { item: NavLinkItem }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <li>
        <a
          href={item.href}
          className="
            block px-[10px] text-[0.9em] uppercase tracking-[1px]
            text-[#DDDDDD] hover:text-[#B20001]
            transition-colors duration-300
            [font-family:var(--font-display)]
          "
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {/* Render as <a> so it's still a valid link target, not a button */}
      <a
        href={item.href}
        aria-expanded={open}
        aria-haspopup="true"
        className="
          flex items-center gap-1 px-[10px] text-[0.9em] uppercase tracking-[1px]
          text-[#DDDDDD] hover:text-[#B20001]
          transition-colors duration-300
          [font-family:var(--font-display)]
        "
      >
        {item.label}
        <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
             className="w-[0.6em] h-[0.6em] fill-current ml-0.5" aria-hidden="true">
          <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
        </svg>
      </a>

      {open && (
        <ul
          role="group"
          className="
            absolute left-0 top-full mt-0 min-w-[180px] z-50
            bg-black py-1
          "
        >
          {item.children.map((child) => (
            <li key={child.href}>
              <a
                href={child.href}
                onClick={() => setOpen(false)}
                className="
                  block px-4 py-2 text-[1em] uppercase
                  text-[#EFEFEF] hover:text-[#B20001]
                  transition-colors duration-300
                  [font-family:var(--font-display)]
                "
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── MobileNavItem (collapsible dropdown for mobile drawer) ──────────────────

function MobileNavItem({ item, onClose }: { item: NavLinkItem; onClose: () => void }) {
  const [open, setOpen] = useState(false);

  if (!item.children) {
    return (
      <li>
        <a
          href={item.href}
          onClick={onClose}
          className="
            block px-6 py-2 text-[0.9em] uppercase tracking-[1px]
            text-[#DDDDDD] hover:text-[#B20001]
            transition-colors [font-family:var(--font-display)]
          "
        >
          {item.label}
        </a>
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        className="
          flex items-center justify-between w-full
          px-6 py-2 text-[0.9em] uppercase tracking-[1px]
          text-[#DDDDDD] hover:text-[#B20001]
          transition-colors [font-family:var(--font-display)]
          bg-transparent border-none cursor-pointer
        "
      >
        {item.label}
        <svg viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"
             className="w-[0.7em] h-[0.7em] fill-current" aria-hidden="true">
          {open
            ? /* minus */ <path d="M416 208H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h384c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
            : /* plus  */ <path d="M416 208H272V64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v144H32c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h144v144c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32V304h144c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32z" />
          }
        </svg>
      </button>

      {open && (
        <ul className="list-none m-0 p-0 border-t border-[#1a1a1a]">
          {item.children.map((child) => (
            <li key={child.href}>
              <a
                href={child.href}
                onClick={onClose}
                className="
                  block pl-10 pr-6 py-2 text-[0.85em] uppercase tracking-[1px]
                  text-[#A5A5A5] hover:text-[#B20001]
                  transition-colors [font-family:var(--font-display)]
                "
              >
                {child.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* ── Desktop header (hidden on mobile / tablet — matches WP elementor-hidden-mobile/tablet) ── */}
      <header
        className="
          fixed top-0 left-0 right-0 z-50
          hidden md:flex items-center
          py-[1em] px-0
          transition-colors duration-[250ms]
          bg-black/50 hover:bg-black
        "
      >
        {/* ── Inner content container: max-width 1140px, centered ── */}
        <div className="w-full max-w-[1140px] mx-auto flex items-center">

          {/* ── Col 1: Social icons (15%) ── */}
          <div className="flex items-center" style={{ width: "15%" }}>
            <ul className="flex items-center gap-3 list-none m-0 p-0">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="nofollow noreferrer"
                    aria-label={label}
                    className="
                      text-[#DDDDDD] hover:text-[#B20001]
                      transition-colors duration-300
                      flex items-center
                    "
                  >
                    <Icon />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Col 2: Navigation (70%) ── */}
          <nav
            aria-label="Main navigation"
            className="flex items-center justify-center"
            style={{ width: "70%" }}
          >
            <ul className="flex items-center list-none m-0 p-0">
              {(NAV_LINKS as readonly NavLinkItem[]).map((item) => (
                <NavItem key={item.label} item={item} />
              ))}
            </ul>
          </nav>

          {/* ── Col 3: Join Us button (15%) ── */}
          <div className="flex items-center justify-end" style={{ width: "15%" }}>
            <a
              href={JOIN_US_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="
                inline-block
                bg-black/40 hover:bg-[#B20001]
                text-[#EFEFEF]
                text-[1.2em] [font-family:var(--font-display)]
                border border-[#222222]
                rounded-[1px]
                px-4 py-2
                transition-colors duration-300
                whitespace-nowrap
              "
            >
              Join Us
            </a>
          </div>

        </div>
      </header>

      {/* ── Mobile header ── */}
      <header className="fixed top-0 left-0 right-0 z-50 md:hidden bg-black/80">
        <div className="flex items-center justify-between px-4 py-3">

          {/* Social icons (mobile) */}
          <ul className="flex items-center gap-3 list-none m-0 p-0">
            {SOCIAL_LINKS.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="nofollow noreferrer"
                  aria-label={label}
                  className="text-[#DDDDDD] hover:text-[#B20001] transition-colors flex items-center"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>

          {/* Hamburger */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            onClick={() => setMenuOpen((v) => !v)}
            className="text-[#DDDDDD] hover:text-[#B20001] transition-colors p-1"
          >
            {menuOpen ? (
              /* X icon */
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"
                   className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z" />
              </svg>
            ) : (
              /* Hamburger icon */
              <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg"
                   className="w-6 h-6 fill-current" aria-hidden="true">
                <path d="M104 333H896C929 333 958 304 958 271S929 208 896 208H104C71 208 42 237 42 271S71 333 104 333ZM104 583H896C929 583 958 554 958 521S929 458 896 458H104C71 458 42 487 42 521S71 583 104 583ZM104 833H896C929 833 958 804 958 771S929 708 896 708H104C71 708 42 737 42 771S71 833 104 833Z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile nav drawer */}
        {menuOpen && (
          <nav id="mobile-nav" aria-label="Mobile navigation"
               className="bg-black border-t border-[#222222]">
            <ul className="list-none m-0 p-0 py-2">
              {NAV_LINKS.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item as NavLinkItem}
                  onClose={() => setMenuOpen(false)}
                />
              ))}
              <li className="px-6 pt-3 pb-2">
                <a
                  href={JOIN_US_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    inline-block bg-black/40 hover:bg-[#B20001]
                    text-[#EFEFEF] text-[1.1em] [font-family:var(--font-display)]
                    border border-[#222222] rounded-[1px] px-4 py-2
                    transition-colors
                  "
                >
                  Join Us
                </a>
              </li>
            </ul>
          </nav>
        )}
      </header>

      {/* Spacer so page content starts below the fixed header */}
      <div className="h-[60px] md:h-[72px]" aria-hidden="true" />
    </>
  );
}
