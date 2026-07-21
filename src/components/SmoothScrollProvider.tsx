"use client";
// src/components/SmoothScrollProvider.tsx
// Lenis smooth scroll — temporarily disabled.
// Native browser scroll is used instead.

export function useLenis() {
  return null;
}

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
