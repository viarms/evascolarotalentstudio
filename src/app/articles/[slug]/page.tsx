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

  // Detect auto-generated Yoast titles ("Post Name - Site Name") and ignore them
  // in favour of the actual post title, same guard as classQueries.ts.
  const YOAST_AUTO_TITLE_RE = /^[^|–—]+\s[-–—]\s+Eva Scolaro Talent Studio\s*$/;
  const yoastTitleIsCustom = yoast?.title && !YOAST_AUTO_TITLE_RE.test(yoast.title);

  const title       = (yoastTitleIsCustom ? yoast!.title : null) ?? article.title;
  const description = yoast?.description ?? article.excerpt;
  const ogTitle     = (yoastTitleIsCustom ? yoast?.og_title : null) ?? title;
  const ogImage     = yoast?.og_image?.[0] ?? (article.featuredImage ? { url: article.featuredImage } : null);

  const robotsIndex  = yoast?.robots?.index  ?? "index";
  const robotsFollow = yoast?.robots?.follow ?? "follow";

  return {
    title: { absolute: `${title} | Eva Scolaro Talent Studio` },
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
    alternates: {
      canonical,
    },
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
      logo: {
        "@type": "ImageObject",
        url: `${BASE}/logo.svg`,
      },
    },
    ...(article.featuredImage && {
      image: {
        "@type": "ImageObject",
        url: article.featuredImage,
      },
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
    <main>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── Hero / featured image ──────────────────────────────────────── */}
      {article.featuredImage && (
        <div className="relative w-full aspect-[21/9] bg-[#121212] overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80"
          />
          {/* Dark gradient overlay so the title is readable if placed here */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[rgba(0,0,0,0.55)]" />
        </div>
      )}

      {/* ── White content card ─────────────────────────────────────────── */}
      <div
        className={article.featuredImage ? "bg-[#f5f4f2]" : "bg-[#121212] pt-10"}
      >
        <div className="max-w-[720px] mx-auto px-4 sm:px-6 py-10">
          <article className="bg-white rounded-sm shadow-sm px-6 py-10 sm:px-10 md:px-14 md:py-12">

            {/* Breadcrumb */}
            <nav aria-label="breadcrumb" className="mb-6">
              <ol className="flex items-center gap-1.5 text-xs text-gray-400 list-none p-0 m-0"
                  style={{ fontFamily: "var(--font-inter)" }}>
                <li><Link href="/" className="hover:text-gray-600 transition-colors">Home</Link></li>
                <li aria-hidden>›</li>
                <li><Link href="/articles/" className="hover:text-gray-600 transition-colors">Articles</Link></li>
                <li aria-hidden>›</li>
                <li className="text-gray-600 truncate max-w-[200px]" aria-current="page"
                    dangerouslySetInnerHTML={{ __html: article.title }} />
              </ol>
            </nav>

            {/* Categories */}
            {article.categories.length > 0 && (
              <p
                className="text-[#c49a6c] uppercase tracking-widest text-xs mb-3"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                {article.categories.join(" · ")}
              </p>
            )}

            {/* Title */}
            <h1
              className="text-gray-900 text-2xl sm:text-3xl leading-tight mb-4"
              style={{ fontFamily: "var(--font-archivo-black)" }}
              dangerouslySetInnerHTML={{ __html: article.title }}
            />

            {/* Meta */}
            <p
              className="text-gray-400 text-xs mb-8 border-b border-gray-100 pb-6"
              style={{ fontFamily: "var(--font-inter)" }}
            >
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              {article.modifiedDate !== article.date && (
                <>
                  {" · Updated "}
                  <time dateTime={article.modifiedDate}>{formatDate(article.modifiedDate)}</time>
                </>
              )}
            </p>

            {/* Body — WP block content */}
            <div
              className="prose prose-gray prose-sm sm:prose-base max-w-none
                         prose-headings:font-[var(--font-archivo-black)]
                         prose-a:text-[#c49a6c] prose-a:no-underline hover:prose-a:underline
                         prose-img:rounded-sm prose-img:shadow-sm"
              style={{ fontFamily: "var(--font-inter)" }}
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Back link */}
            <div className="mt-12 pt-8 border-t border-gray-100">
              <Link
                href="/articles/"
                className="inline-flex items-center gap-2 text-sm text-[#c49a6c] hover:underline"
                style={{ fontFamily: "var(--font-inter)" }}
              >
                <span aria-hidden>←</span> Back to Articles
              </Link>
            </div>

          </article>
        </div>
      </div>
    </main>
  );
}
