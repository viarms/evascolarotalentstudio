"use client";
// src/components/modals/ModalShell.tsx
// Shared modal overlay shell. State-driven — renders nothing when closed.
// No <dialog> element, no showModal(), no browser DOM state.

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  isOpen:       boolean;
  onClose:      () => void;
  title:        string;
  titleId:      string;
  maxWidth?:    string;
  children:     React.ReactNode;
}

export default function ModalShell({
  isOpen, onClose, title, titleId, maxWidth = "560px", children,
}: Props) {
  // Lock body scroll while open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Focus trap — move focus inside when opened
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isOpen) {
      // Defer so the element is painted first
      requestAnimationFrame(() => panelRef.current?.focus());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div
      role="presentation"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="relative w-full bg-white rounded-sm shadow-2xl flex flex-col outline-none"
        style={{ maxWidth, maxHeight: "90dvh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4 flex-shrink-0 rounded-t-sm"
          style={{ backgroundColor: "#121212" }}
        >
          <h2
            id={titleId}
            className="text-base font-semibold tracking-wide text-white m-0"
            style={{ fontFamily: "var(--font-archivo-black, sans-serif)" }}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex items-center justify-center w-8 h-8 rounded-full text-gray-400
              hover:text-white hover:bg-white/10 transition-colors duration-150
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                 strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
          <div className="px-6 py-6">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
