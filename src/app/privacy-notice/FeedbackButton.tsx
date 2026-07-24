"use client";
// src/app/privacy-notice/FeedbackButton.tsx
// Inline text button that opens the global FeedbackModal.
// Extracted as a client component so the parent page stays a static server component.

export default function FeedbackButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-feedback-modal"))}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        color: "#CC2222",
        textDecoration: "underline",
        textDecorationColor: "rgba(178,0,1,0.4)",
        textUnderlineOffset: "3px",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: "inherit",
      }}
    >
      Feedback form
    </button>
  );
}
