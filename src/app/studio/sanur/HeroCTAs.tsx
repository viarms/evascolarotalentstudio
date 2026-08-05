"use client";
// src/app/studio/sanur/HeroCTAs.tsx
// Hero CTA row for the Sanur location page.
// Dispatches open-book-trial-modal with studio prefilled to "Sanur Studio".

const KEYFRAMES = `
@keyframes sl-lift {
  0%   { transform: translateY(0) scale(1); }
  40%  { transform: translateY(-3px) scale(1.02); }
  70%  { transform: translateY(-1px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
}
.sl-primary-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: #B20001;
  color: #fff;
  font-family: var(--font-inter, sans-serif);
  font-size: 0.875rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  border-radius: 3px;
  text-decoration: none;
  border: none;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s ease, box-shadow 0.18s ease;
  animation: ctaPulse 3s ease-in-out infinite;
}
.sl-primary-btn:hover {
  background: #8a0001;
  box-shadow: 0 6px 24px rgba(178,0,1,0.45);
  animation: sl-lift 0.36s ease forwards;
}
.sl-ghost-btn {
  display: inline-block;
  padding: 0.75rem 1.75rem;
  background: transparent;
  color: #AAAAAA;
  font-family: var(--font-inter, sans-serif);
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid #333333;
  border-radius: 3px;
  text-decoration: none;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.18s ease, color 0.18s ease;
}
.sl-ghost-btn:hover { border-color: #555555; color: #DDDDDD; animation: sl-lift 0.36s ease forwards; }
@keyframes ctaPulse {
  0%,100% { box-shadow: 0 2px 12px rgba(178,0,1,0.25); }
  50%      { box-shadow: 0 4px 28px rgba(178,0,1,0.55); }
}
`;

export default function HeroCTAs() {
  function openTrialModal(e: React.MouseEvent) {
    e.preventDefault();
    window.dispatchEvent(
      new CustomEvent("open-book-trial-modal", { detail: { studio: "Sanur Studio" } })
    );
  }

  function scrollToTimetable(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    document.getElementById("timetable")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap", marginTop: "2rem" }}>
        <button className="sl-primary-btn" onClick={openTrialModal}>
          Book a Free Trial
        </button>
        <a href="#timetable" className="sl-ghost-btn" onClick={scrollToTimetable}>
          View Timetable ↓
        </a>
      </div>
    </>
  );
}
