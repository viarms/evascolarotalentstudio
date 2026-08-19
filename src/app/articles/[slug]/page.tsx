// src/app/articles/[slug]/page.tsx
// Single article post — server component, ISR, Yoast SEO-connected.
//
// Metadata: Yoast values take priority; falls back to WP post fields.
// Structured data: BlogPosting schema (Google recommended for articles).
// ISR: revalidate every hour; slug list pre-built at deploy via generateStaticParams.

import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { fetchArticleBySlug, fetchAllArticleSlugs } from "@/lib/queries/articleQueries";

// ─── ISR ──────────────────────────────────────────────────────────────────────
export const revalidate = 3600;

// ─── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  const slugs = await fetchAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

// ─── Types ────────────────────────────────────────────────────────────────────
type PageProps = { params: Promise<{ slug: string }> };

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const BASE = "https://www.evascolarotalentstudio.com";

// ─── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const { slug } = await props.params;
  const article = await fetchArticleBySlug(slug);
  if (!article) return {};

  const canonical = article.yoast?.canonical ?? `${BASE}/articles/${slug}/`;
  const yoast = article.yoast;

  // Use Yoast title/description directly when present — they are the SEO-optimised
  // values set in the WP Yoast panel and should always take priority.
  const title       = yoast?.title ?? article.title;
  const description = yoast?.description ?? article.excerpt;
  const ogTitle     = yoast?.og_title ?? title;
  const ogImage     = yoast?.og_image?.[0] ?? (article.featuredImage ? { url: article.featuredImage } : null);

  const robotsIndex  = yoast?.robots?.index  ?? "index";
  const robotsFollow = yoast?.robots?.follow ?? "follow";

  // Yoast title already includes the site name; only append it for the fallback.
  const metaTitle = yoast?.title
    ? { absolute: title }
    : { absolute: `${title} | Eva Scolaro Talent Studio` };

  return {
    title: metaTitle,
    description,
    robots: {
      index:  robotsIndex  === "index",
      follow: robotsFollow === "follow",
      "max-snippet":       -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title:       ogTitle,
      description: yoast?.og_description ?? description,
      url:         canonical,
      siteName:    "Eva Scolaro Talent Studio",
      type:        "article",
      publishedTime: article.date,
      modifiedTime:  article.modifiedDate,
      ...(ogImage && {
        images: [{ url: ogImage.url, width: (ogImage as { width?: number }).width, height: (ogImage as { height?: number }).height }],
      }),
    },
    twitter: {
      card:        (yoast?.twitter_card as "summary_large_image" | "summary") ?? "summary_large_image",
      title:       ogTitle,
      description: yoast?.og_description ?? description,
      ...(ogImage && { images: [ogImage.url] }),
    },
    alternates: { canonical },
  };
}

// ─── Structured data ──────────────────────────────────────────────────────────

function buildArticleSchema(article: Awaited<ReturnType<typeof fetchArticleBySlug>> & object) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    url: `${BASE}/articles/${article.slug}/`,
    datePublished: article.date,
    dateModified: article.modifiedDate,
    author: {
      "@type": "Organization",
      name: "Eva Scolaro Talent Studio",
      url: BASE,
    },
    publisher: {
      "@type": "Organization",
      name: "Eva Scolaro Talent Studio",
      url: BASE,
      logo: { "@type": "ImageObject", url: `${BASE}/logo.svg` },
    },
    ...(article.featuredImage && {
      image: { "@type": "ImageObject", url: article.featuredImage },
    }),
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE}/articles/${article.slug}/`,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ArticlePage(props: PageProps) {
  const { slug } = await props.params;
  const article = await fetchArticleBySlug(slug);
  if (!article) notFound();

  const jsonLd = buildArticleSchema(article);

  return (
    <main className="bg-[#0e0e0e] min-h-screen">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Full-bleed hero ─────────────────────────────────────────────── */}
      <div className="relative w-full" style={{ aspectRatio: "21/9", minHeight: "280px", maxHeight: "520px" }}>
        {article.featuredImage ? (
          <>
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            {/* Multi-stop gradient: transparent top → heavy dark bottom */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(14,14,14,0.15) 0%, rgba(14,14,14,0.35) 50%, rgba(14,14,14,0.85) 80%, rgba(14,14,14,1) 100%)",
              }}
            />
          </>
        ) : (
          /* No image — decorative dark gradient placeholder */
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, #1a1a1a 0%, #111 50%, #0e0e0e 100%)",
            }}
          />
        )}

        {/* Title block pinned to bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 px-4 sm:px-8 pb-8 sm:pb-10">
          <div className="max-w-[760px] mx-auto">
            {/* Categories */}
            {article.categories.length > 0 && (
              <p
                className="text-[#c49a6c] uppercase tracking-[0.2em] text-xs mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {article.categories.join(" · ")}
              </p>
            )}
            {/* Title */}
            <h1
              className="text-white text-2xl sm:text-3xl md:text-4xl leading-tight"
              style={{
                fontFamily: "var(--font-archivo-black)",
                textShadow: "0 2px 16px rgba(0,0,0,0.5)",
              }}
              dangerouslySetInnerHTML={{ __html: article.title }}
            />
          </div>
        </div>
      </div>

      {/* ── Article body ────────────────────────────────────────────────── */}
      <div className="max-w-[760px] mx-auto px-4 sm:px-8 pt-8 pb-20">

        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-6">
          <ol
            className="flex items-center flex-wrap gap-1.5 list-none p-0 m-0"
            style={{ fontFamily: "var(--font-inter)", fontSize: "0.75rem" }}
          >
            <li>
              <Link href="/" className="text-[#666] hover:text-[#c49a6c] transition-colors">
                Home
              </Link>
            </li>
            <li aria-hidden className="text-[#444]">›</li>
            <li>
              <Link href="/articles/" className="text-[#666] hover:text-[#c49a6c] transition-colors">
                Articles
              </Link>
            </li>
            <li aria-hidden className="text-[#444]">›</li>
            <li
              className="text-[#888] truncate max-w-[220px]"
              aria-current="page"
              dangerouslySetInnerHTML={{ __html: article.title }}
            />
          </ol>
        </nav>

        {/* Byline */}
        <div
          className="flex items-center gap-3 mb-8 pb-6"
          style={{ borderBottom: "1px solid #222" }}
        >
          {/* Studio avatar dot */}
          <div
            className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #c49a6c, #8a6a42)" }}
            aria-hidden
          >
            <span
              className="text-white text-xs font-bold select-none"
              style={{ fontFamily: "var(--font-archivo-black)" }}
            >
              E
            </span>
          </div>
          <div style={{ fontFamily: "var(--font-inter)" }}>
            <p className="text-[#DDDDDD] text-xs font-medium leading-tight">
              Eva Scolaro Talent Studio
            </p>
            <p className="text-[#666] text-xs leading-tight mt-0.5">
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              {article.modifiedDate !== article.date && (
                <>
                  {" · Updated "}
                  <time dateTime={article.modifiedDate}>{formatDate(article.modifiedDate)}</time>
                </>
              )}
            </p>
          </div>
        </div>

        {/* ── WP content — custom dark prose styles ── */}
        <div
          className="article-body"
          style={{ fontFamily: "var(--font-inter)" }}
          dangerouslySetInnerHTML={{ __html: article.content }}
        />

        {/* ── Back link ───────────────────────────────────────────────── */}
        <div
          className="mt-14 pt-8 flex items-center justify-between"
          style={{ borderTop: "1px solid #222" }}
        >
          <Link
            href="/articles/"
            className="inline-flex items-center gap-2 text-sm text-[#c49a6c] hover:text-[#d4b07c] transition-colors"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            <span aria-hidden>←</span> All Articles
          </Link>
          {/* Subtle studio credit */}
          <p
            className="text-[#444] text-xs hidden sm:block"
            style={{ fontFamily: "var(--font-inter)" }}
          >
            Eva Scolaro Talent Studio · Bali
          </p>
        </div>
      </div>
    </main>
  );
}
