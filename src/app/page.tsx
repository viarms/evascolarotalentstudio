// src/app/page.tsx
// The homepage (/) is served by WordPress via the rewrite proxy in
// next.config.ts — this file will never be reached in production once
// WP_ORIGIN is set and DNS is pointed to Vercel.
//
// During local development (no WP_ORIGIN) this placeholder is shown instead.

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        Eva Scolaro Talent Studio
      </h1>
      <p className="text-gray-500 max-w-md">
        This page is served by WordPress in production.
        Set <code className="bg-gray-100 px-1 rounded text-sm">WP_ORIGIN</code> in{" "}
        <code className="bg-gray-100 px-1 rounded text-sm">.env.local</code> to
        enable the proxy, or browse to a class page directly:
      </p>
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          href="/classes/ballet"
          className="px-6 py-3 bg-[var(--color-brand-red)] text-white font-semibold rounded-full hover:bg-[var(--color-brand-red-dark)] transition-colors"
        >
          Ballet Class →
        </a>
        <a
          href="/classes/public-speaking"
          className="px-6 py-3 border border-[var(--color-brand-red)] text-[var(--color-brand-red)] font-semibold rounded-full hover:bg-red-50 transition-colors"
        >
          Public Speaking (Coming Soon) →
        </a>
      </div>
    </main>
  );
}
