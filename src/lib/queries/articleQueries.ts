// src/lib/queries/articleQueries.ts
// Data fetching for the "articles" custom post type via WP REST API.
//
// CPT REST slug: articles
// Yoast SEO data is exposed on yoast_head_json (requires Yoast SEO plugin
// with "enable_rest_api" setting active).
//
// Revalidation budget:
//   Listing page  → 3600 s (1 hour)
//   Single post   → 3600 s (1 hour)
//   Slug list     → 3600 s (used by generateStaticParams)

import type { ArticleListItem, ArticleSingle, YoastArticleMeta } from "@/lib/types/article";

const WP_BASE = "https://www.evascolarotalentstudio.com/wp-json/wp/v2";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip HTML tags from a string — used to clean wp excerpt wrappers. */
function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, "").trim();
}

/**
 * Decode common HTML entities to plain-text characters.
 * Covers the set WordPress / Yoast typically emit in titles and descriptions.
 */
function decodeEntities(str: string): string {
  return str
    .replace(/&#8217;/g, "\u2019") // '
    .replace(/&#8216;/g, "\u2018") // '
    .replace(/&#8220;/g, "\u201C") // "
    .replace(/&#8221;/g, "\u201D") // "
    .replace(/&#8211;/g, "\u2013") // –
    .replace(/&#8212;/g, "\u2014") // —
    .replace(/&#038;|&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

/** Pull Yoast fields we care about out of the raw yoast_head_json object. */
function mapYoast(raw: Record<string, unknown> | null | undefined): YoastArticleMeta | null {
  if (!raw) return null;
  return {
    title:          raw.title as string | undefined,
    description:    (raw.og_description ?? raw.description) as string | undefined,
    og_title:       raw.og_title as string | undefined,
    og_description: raw.og_description as string | undefined,
    og_image:       raw.og_image as YoastArticleMeta["og_image"],
    twitter_card:   raw.twitter_card as string | undefined,
    canonical:      raw.canonical as string | undefined,
    robots:         raw.robots as YoastArticleMeta["robots"],
  };
}

// ─── WP REST response shape (partial) ────────────────────────────────────────

type WpArticleRaw = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  content: { rendered: string };
  featured_media: number;
  // _embedded is present when ?_embed is passed
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      code?: string; // "rest_post_invalid_id" when no media
      media_details?: { sizes?: { full?: { source_url?: string } } };
    }>;
    "wp:term"?: Array<Array<{ name: string; taxonomy: string }>>;
  };
  yoast_head_json?: Record<string, unknown>;
};

// ─── Fetch helpers ────────────────────────────────────────────────────────────

function extractFeaturedImage(post: WpArticleRaw): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media || media.code === "rest_post_invalid_id") return null;
  return (
    media.media_details?.sizes?.full?.source_url ??
    media.source_url ??
    null
  );
}

function extractCategories(post: WpArticleRaw): string[] {
  const terms = post._embedded?.["wp:term"];
  if (!terms) return [];
  return terms
    .flat()
    .filter((t) => t.taxonomy === "category" || t.taxonomy === "article_category")
    .map((t) => t.name);
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Parses the slug out of a Yoast canonical URL.
 * e.g. "https://example.com/articles/my-post/" → "my-post"
 * Returns null if the URL can't be parsed or yields an empty segment.
 */
function slugFromCanonical(canonical: string | undefined): string | null {
  if (!canonical) return null;
  try {
    const parts = new URL(canonical).pathname.replace(/\/$/, "").split("/");
    const last = parts[parts.length - 1];
    return last || null;
  } catch {
    return null;
  }
}

/**
 * Fetches the latest articles for the archive/listing page.
 * Returns up to `perPage` posts (default 12) ordered by date descending.
 */
export async function fetchArticles(perPage = 12): Promise<ArticleListItem[]> {
  const url = new URL(`${WP_BASE}/article`);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("order", "desc");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("_embed", "1");
  url.searchParams.set(
    "_fields",
    "id,slug,date,title,excerpt,featured_media,_links,_embedded,yoast_head_json"
  );

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return [];

  const posts: WpArticleRaw[] = await res.json();

  return posts.map((p) => {
    const yoast = p.yoast_head_json;
    const canonical = yoast?.canonical as string | undefined;
    return {
      id:               p.id,
      slug:             p.slug,
      title:            p.title.rendered,
      excerpt:          decodeEntities(stripHtml(p.excerpt.rendered)),
      date:             p.date,
      featuredImage:    extractFeaturedImage(p),
      categories:       extractCategories(p),
      yoastTitle:       yoast?.title ? decodeEntities(yoast.title as string) : null,
      yoastDescription: yoast ? decodeEntities(((yoast.og_description ?? yoast.description) as string | undefined) ?? "") || null : null,
      yoastSlug:        slugFromCanonical(canonical),
    };
  });
}

/**
 * Fetches a single article by slug including full content and Yoast meta.
 * Returns null if the post doesn't exist.
 */
export async function fetchArticleBySlug(slug: string): Promise<ArticleSingle | null> {
  const url = new URL(`${WP_BASE}/article`);
  url.searchParams.set("slug", slug);
  url.searchParams.set("_embed", "1");
  url.searchParams.set(
    "_fields",
    "id,slug,date,modified,title,excerpt,content,featured_media,_links,_embedded,yoast_head_json"
  );

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const posts: WpArticleRaw[] = await res.json();
  const p = posts?.[0];
  if (!p) return null;

  return {
    id:               p.id,
    slug:             p.slug,
    title:            p.title.rendered,
    excerpt:          decodeEntities(stripHtml(p.excerpt.rendered)),
    content:          p.content.rendered,
    date:             p.date,
    modifiedDate:     p.modified,
    featuredImage:    extractFeaturedImage(p),
    categories:       extractCategories(p),
    yoast:            mapYoast(p.yoast_head_json),
    yoastTitle:       (p.yoast_head_json?.title as string | undefined) ? decodeEntities(p.yoast_head_json!.title as string) : null,
    yoastDescription: ((p.yoast_head_json?.og_description ?? p.yoast_head_json?.description) as string | undefined)
                        ? decodeEntities((p.yoast_head_json?.og_description ?? p.yoast_head_json?.description) as string)
                        : null,
    yoastSlug:        slugFromCanonical(p.yoast_head_json?.canonical as string | undefined),
  };
}

/**
 * Fetches all article slugs for generateStaticParams.
 * Returns up to 100 slugs — increase per_page if the blog grows.
 */
export async function fetchAllArticleSlugs(): Promise<string[]> {
  const res = await fetch(
    `${WP_BASE}/article?per_page=100&_fields=slug`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];

  const posts: Array<{ slug: string }> = await res.json();
  return posts.map((p) => p.slug);
}
