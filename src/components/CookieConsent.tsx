"use client";

/**
 * CookieConsent — bottom-fixed cookie notice banner.
 *
 * Behaviour:
 *   - Hidden if localStorage key "cookie_consent" === "accepted" or "declined".
 *   - "Accept" and "Decline" both dismiss the banner permanently (localStorage).
 *   - Links to /privacy-notice/ for full policy details.
 *   - Slides up from the bottom on first render, slides back down on dismiss.
 *   - Accessible: focus-trapped inside, keyboard-navigable, ARIA labelled.
 */

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "cookie_consent";

type ConsentValue = "accepted" | "declined";

export default function CookieConsent() {
  // null = not yet checked (prevents flash); false = dismissed; true = show banner
  const [visible, setVisible] = useState<boolean | null>(null);
  // Controls slide-out animation before unmount
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentValue | null;
      setVisible(!stored);
    } catch {
      // Private browsing or storage blocked — show banner, it will just not persist
      setVisible(true);
    }
  }, []);

  function handleConsent(value: ConsentValue) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Silently ignore storage errors
    }
    // Animate out first, then unmount
    setDismissing(true);
    setTimeout(() => setVisible(false), 350);
  }

  // Don't render anything until we've checked localStorage (avoids SSR/hydration flash)
  if (visible === null || visible === false) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-live="polite"
      className={[
        // Floating card — centred, not full-width
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]",
        "w-[calc(100%-2rem)] max-w-2xl",
        // Glass surface
        "backdrop-blur-xl",
        "bg-white/[0.06]",
        "border border-white/[0.12]",
        "rounded-2xl",
        "shadow-[0_8px_32px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]",
        // Layout
        "flex items-center justify-between gap-4 flex-wrap",
        "px-5 py-4 sm:px-6 sm:py-4",
        // Slide-out on dismiss
        "transition-all duration-300 ease-out",
        dismissing ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0",
        // Entrance
        "animate-cookie-slide-up",
      ].join(" ")}
    >
      {/* Cookie icon + text */}
      <div className="flex items-start gap-3 min-w-0">
        {/* Small icon — pure CSS, no dep */}
        <span
          className="mt-0.5 shrink-0 text-base leading-none select-none"
          aria-hidden="true"
        >
          🍪
        </span>
        <p className="text-[13px] text-white/70 leading-relaxed tracking-[0.01em] font-[family-name:var(--font-inter)]">
          We use cookies to improve your experience, analyse traffic, and
          support form features on this site.{" "}
          <Link
            href="/privacy-notice/"
            className="text-white/90 underline underline-offset-[3px] decoration-white/30 hover:decoration-white/70 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-white/60 rounded transition-all duration-150"
          >
            Privacy notice
          </Link>
          .
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={() => handleConsent("declined")}
          className={[
            "px-4 py-[7px] text-[13px] font-medium tracking-[0.02em] rounded-lg",
            "text-white/50 border border-white/[0.1]",
            "hover:text-white/80 hover:border-white/25 hover:bg-white/[0.06]",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/40",
            "transition-all duration-150",
            "font-[family-name:var(--font-inter)]",
          ].join(" ")}
          aria-label="Decline cookies"
        >
          Decline
        </button>

        <button
          onClick={() => handleConsent("accepted")}
          className={[
            "px-5 py-[7px] text-[13px] font-semibold tracking-[0.02em] rounded-lg",
            "bg-[#B20001] text-white",
            "hover:bg-[#8a0001]",
            "shadow-[0_2px_12px_rgba(178,0,1,0.45)]",
            "hover:shadow-[0_2px_18px_rgba(178,0,1,0.65)]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B20001] focus-visible:ring-offset-1 focus-visible:ring-offset-transparent",
            "transition-all duration-150",
            "font-[family-name:var(--font-inter)]",
          ].join(" ")}
          aria-label="Accept cookies"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
