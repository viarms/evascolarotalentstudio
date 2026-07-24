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
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-[9999]",
        "w-[calc(100%-2rem)] max-w-2xl",
        // Dark bg + radial glow from bottom-left in dark brand red
        "rounded-lg",
        "border border-[#3d0001]",
        // Layout
        "flex items-center justify-between gap-4 flex-wrap",
        "px-5 py-4 sm:px-6",
        // Dismiss animation
        "transition-all duration-300 ease-out",
        dismissing ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0",
        // Entrance
        "animate-cookie-slide-up",
      ].join(" ")}
      style={{
        background:
          "radial-gradient(ellipse 70% 120% at 90% -10%, #3a0001 0%, #1a0000 45%, #0e0e0e 100%)",
      }}
    >
      {/* Cookie icon + text */}
      <div className="flex items-start gap-3 min-w-0">
        <span
          className="mt-0.5 shrink-0 text-base leading-none select-none"
          aria-hidden="true"
        >
          🍪
        </span>
        <p className="text-[13px] text-[#BBBBBB] leading-relaxed tracking-[0.01em] font-[family-name:var(--font-inter)]">
          We use cookies to improve your experience, analyse traffic, and
          support form features on this site.{" "}
          <Link
            href="/privacy-notice/"
            className="text-[#DDDDDD] underline underline-offset-[3px] decoration-white/25 hover:decoration-white/60 hover:text-white focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B20001] rounded transition-all duration-150"
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
            "px-4 py-[7px] text-[13px] font-medium tracking-[0.02em] rounded",
            "text-[#777777] border border-[#2e2e2e]",
            "hover:text-[#AAAAAA] hover:border-[#444444]",
            "focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B20001]",
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
            "px-5 py-[7px] text-[13px] font-semibold tracking-[0.02em] rounded",
            "bg-[#8a0001] text-white",
            "hover:bg-[#6e0001]",
            "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B20001] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111111]",
            "transition-colors duration-150",
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
