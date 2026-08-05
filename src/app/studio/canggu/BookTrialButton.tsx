"use client";
// src/app/studio/canggu/BookTrialButton.tsx

export default function BookTrialButton({ label = "Book a Free Trial" }: { label?: string }) {
  function handleClick() {
    window.dispatchEvent(
      new CustomEvent("open-book-trial-modal", { detail: { studio: "Canggu Studio" } })
    );
  }
  return (
    <button
      onClick={handleClick}
      style={{
        display: "inline-block", padding: "0.65rem 1.5rem", background: "#B20001",
        borderRadius: "3px", color: "#FFFFFF", fontSize: "0.82rem",
        fontFamily: "var(--font-inter, sans-serif)", fontWeight: 600,
        whiteSpace: "nowrap", letterSpacing: "0.03em", border: "none", cursor: "pointer",
      }}
    >
      {label}
    </button>
  );
}
