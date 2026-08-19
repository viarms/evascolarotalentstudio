// src/app/articles/page.tsx
// Articles archive — server component, ISR, SEO-optimised.
//
// Rendered server-side on every request (after revalidation).
// Each article card links to /articles/[slug] which is the single post template.

import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fetchArticles } from "@/lib/queries/articleQueries";

// ─── ISR: revalidate every hour ───────────────────────────────────────────────
export const revalidate = 3600;

// ─── Metadata ─────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Articles & News",
  description:
    "Read the latest articles, news, and updates from Eva Scolaro Talent Studio — Bali's performing arts studio for kids.",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com/articles/",
  },
  openGraph: {
    title: "Articles & News | Eva Scolaro Talent Studio",
    description:
      "Read the latest articles, news, and updates from Eva Scolaro Talent Studio.",
    url: "https://www.evascolarotalentstudio.com/articles/",
    siteName: "Eva Scolaro Talent Studio",
    type: "website",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ArticlesPage() {
  const articles = await fetchArticles(12);

  return (
    <main>
      {/* ── Page header ───────────────────────────────────────────────────── */}
      <section className="bg-[#121212] pt-14 pb-10 px-4 text-center">
        <p
          className="text-[#c49a6c] uppercase tracking-[0.2em] text-sm mb-3"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Eva Scolaro Talent Studio
        </p>
        <h1
          className="text-white text-4xl sm:text-5xl uppercase"
          style={{ fontFamily: "var(--font-archivo-black)" }}
        >
          Articles
        </h1>
        <p
          className="text-[#AAAAAA] mt-4 text-base max-w-xl mx-auto"
          style={{ fontFamily: "var(--font-inter)" }}
        >
          Tips, updates, and stories from the studio.
        </p>
      </section>

      {/* ── Article grid ──────────────────────────────────────────────────── */}
      <section className="bg-[#f5f4f2] py-14 px-4">
        <div className="max-w-[960px] mx-auto">
          {articles.length === 0 ? (
            <p
              className="text-center text-gray-500 py-20"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              No articles yet — check back soon.
            </p>
          ) : (
            <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 list-none p-0 m-0">
              {articles.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/articles/${article.slug}/`}
                    className="group flex flex-col bg-white rounded-sm shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-[16/9] bg-[#e0ddd8] overflow-hidden">
                      {article.featuredImage ? (
                        <Image
                          src={article.featuredImage}
                          alt={article.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl select-none" aria-hidden>📰</span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {/* Categories */}
                      {article.categories.length > 0 && (
                        <p
                          className="text-[#c49a6c] uppercase tracking-widest text-xs mb-2"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {article.categories.join(" · ")}
                        </p>
                      )}

                      {/* Title */}
                      <h2
                        className="text-gray-900 text-base font-semibold leading-snug mb-2 group-hover:text-[#c49a6c] transition-colors"
                        style={{ fontFamily: "var(--font-archivo-black)" }}
                        /* eslint-disable-next-line react/no-danger */
                        dangerouslySetInnerHTML={{ __html: article.title }}
                      />

                      {/* Excerpt */}
                      {article.excerpt && (
                        <p
                          className="text-gray-600 text-sm leading-relaxed line-clamp-3 flex-1"
                          style={{ fontFamily: "var(--font-inter)" }}
                        >
                          {article.excerpt}
                        </p>
                      )}

                      {/* Date */}
                      <time
                        dateTime={article.date}
                        className="block mt-4 text-xs text-gray-400"
                        style={{ fontFamily: "var(--font-inter)" }}
                      >
                        {formatDate(article.date)}
                      </time>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
