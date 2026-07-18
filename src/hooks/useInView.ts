"use client";
// src/hooks/useInView.ts
// Lightweight IntersectionObserver hook for scroll-reveal animations.
// Returns a [ref, isVisible] tuple. Once visible, stays visible.

import { useEffect, useRef, useState } from "react";

export function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect(); // fire once
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible] as const;
}
