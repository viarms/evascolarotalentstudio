"use client";
// src/components/modals/ModalShell.tsx
// Glassmorphism modal shell.
// Header : near-black solid.
// Body   : dark frosted glass — light text for clear contrast.

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const ENTER_MS = 320;
const EXIT_MS  = 190;

interface Props {
  isOpen:    boolean;
  onClose:   () => void;
  title:     string;
  titleId:   string;
  maxWidth?: string;
  children:  React.ReactNode;
}

export default function ModalShell({
  isOpen, onClose, title, titleId, maxWidth = "560px", children,
}: Props) {
  const [mounted, setMounted] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
    } else {
      const t = setTimeout(() => setMounted(false), EXIT_MS);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => panelRef.current?.focus());
  }, [isOpen]);

  if (!mounted) return null;

  const overlayT = isOpen
    ? `opacity ${ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : `opacity ${EXIT_MS}ms ease-out`;

  const panelT = isOpen
    ? `opacity ${ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1), transform ${ENTER_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`
    : `opacity ${EXIT_MS}ms ease-out, transform ${EXIT_MS}ms ease-out`;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        background: "rgba(6, 3, 14, 0.68)",
        backdropFilter: "blur(12px) saturate(1.3)",
        WebkitBackdropFilter: "blur(12px) saturate(1.3)",
        opacity:    isOpen ? 1 : 0,
        transition: overlayT,
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full flex flex-col outline-none overflow-hidden"
        style={{
          maxWidth,
          maxHeight: "90dvh",
          borderRadius: "10px",
          // Glass edge: white top-highlight + faint border
          border: "1px solid rgba(255, 255, 255, 0.11)",
          boxShadow:
            "0 1px 0 rgba(255,255,255,0.14) inset, " +
            "0 24px 60px rgba(0,0,0,0.60), " +
            "0 6px 20px rgba(0,0,0,0.40)",
          opacity:    isOpen ? 1 : 0,
          transform:  isOpen ? "translateY(0) scale(1)" : "translateY(18px) scale(0.96)",
          transition: panelT,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header — near-black, solid ── */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0"
          style={{
            background: "#080808",
            borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
          }}
        >
          <h2
            id={titleId}
            className="m-0 text-[15px] font-semibold tracking-wide"
            style={{
              fontFamily: "var(--font-archivo-black, sans-serif)",
              color: "#fff",
              letterSpacing: "0.04em",
            }}
          >
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/20"
            style={{ color: "rgba(255,255,255,0.38)", background: "transparent" }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.09)";
              (e.currentTarget as HTMLButtonElement).style.color      = "rgba(255,255,255,0.85)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
              (e.currentTarget as HTMLButtonElement).style.color      = "rgba(255,255,255,0.38)";
            }}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-[15px] h-[15px]">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* ── Body — frost black + corner accent ── */}
        <div
          className="flex-1 min-h-0 overflow-y-auto overscroll-contain"
          style={{
            // #080808 base + visible radial glow anchored to bottom-right corner
            background:
              "radial-gradient(ellipse 60% 50% at 100% 100%, rgba(185,28,28,0.28) 0%, rgba(185,28,28,0.08) 40%, transparent 70%), " +
              "#080808",
            backdropFilter: "blur(32px) saturate(1.3)",
            WebkitBackdropFilter: "blur(32px) saturate(1.3)",
          }}
        >
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
