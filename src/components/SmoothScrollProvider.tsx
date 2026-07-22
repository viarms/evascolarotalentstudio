"use client";
// src/components/SmoothScrollProvider.tsx
//
// Wraps the app with Lenis smooth scroll.
// Exposes the Lenis instance via LenisContext so any child (e.g. ModalShell)
// can call lenis.stop() / lenis.start() without prop drilling.

import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// ─── Context ──────────────────────────────────────────────────────────────────

const LenisContext = createContext<Lenis | null>(null);

/** Returns the Lenis instance (available after first client render). */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    setLenis(instance);

    // RAF loop
    let raf: number;
    function loop(time: number) {
      instance.raf(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenis}>
      {children}
    </LenisContext.Provider>
  );
}
