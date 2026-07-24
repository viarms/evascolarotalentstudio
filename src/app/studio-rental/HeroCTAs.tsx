"use client";
// src/app/studio-rental/HeroCTAs.tsx
// Hero CTA row — "Book on WhatsApp" + "See availability" buttons.
// Both get micro-lift animation on hover.

import BookingButton from "./BookingButton";

const KEYFRAMES = `
@keyframes sr-ghost-lift {
  0%   { transform: translateY(0) scale(1); }
  40%  { transform: translateY(-3px) scale(1.02); }
  70%  { transform: translateY(-1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}
.sr-ghost-btn {
  display: inline-block;
  padding: 0.7rem 1.6rem;
  border: 1px solid #333333;
  border-radius: 3px;
  color: #AAAAAA;
  text-decoration: none;
  font-size: 0.85rem;
  font-family: var(--font-inter, sans-serif);
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: border-color 0.18s ease, color 0.18s ease;
  will-change: transform;
}
.sr-ghost-btn:hover {
  border-color: #555555;
  color: #DDDDDD;
  animation: sr-ghost-lift 0.36s ease forwards;
}
.sr-ghost-btn:active {
  transform: translateY(0) scale(0.98);
}
`;

interface Props {
  waHref: string;
}

export default function HeroCTAs({ waHref }: Props) {
  function scrollToAvailability(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("availability")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <BookingButton href={waHref} />
        <a href="#availability" className="sr-ghost-btn" onClick={scrollToAvailability}>
          See availability ↓
        </a>
      </div>
    </>
  );
}
