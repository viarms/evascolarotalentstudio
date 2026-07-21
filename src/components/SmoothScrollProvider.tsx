"use client";
// src/components/SmoothScrollProvider.tsx
// Initialises Lenis smooth scroll via its own requestAnimationFrame loop.
// Exposes the Lenis instance via LenisContext so modals can stop/start it.

import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

const LenisContext = createContext<{ stop: () => void; start: () => void } | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenisRef.current = lenis;

    let rafId: number;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Stable callbacks — never recreated, always call through the ref.
  const stop  = useCallback(() => lenisRef.current?.stop(),  []);
  const start = useCallback(() => lenisRef.current?.start(), []);

  // useMemo would still recreate the object; inline stable refs are simpler.
  // We pass a stable object by keeping the same reference via useRef.
  const apiRef = useRef({ stop, start });
  apiRef.current = { stop, start }; // keep values fresh without changing reference

  return (
    <LenisContext.Provider value={apiRef.current}>
      {children}
    </LenisContext.Provider>
  );
}
