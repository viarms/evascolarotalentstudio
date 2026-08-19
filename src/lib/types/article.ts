// src/lib/types/article.ts
// TypeScript types for the "articles" custom post type fetched via WP REST API.

export type ArticleListItem = {
  id: number;
  slug: string;           // WP post slug (used as fallback)
  title: string;          // WP post title (used as fallback)
  excerpt: string;        // WP excerpt (used as fallback)
  date: string;           // ISO 8601
  featuredImage: string | null;
  categories: string[];
  // Yoast SEO fields — preferred over WP fallbacks when present
  yoastTitle: string | null;
  yoastDescription: string | null;
  yoastSlug: string | null; // slug parsed from yoast_head_json.canonical
};

export type ArticleSingle = ArticleListItem & {
  content: string;        // raw HTML from WP (wp_kses_post)
  modifiedDate: string;   // ISO 8601 — used for article:modified_time meta
  yoast: YoastArticleMeta | null;
};

export type YoastArticleMeta = {
  title?: string;
  description?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  twitter_card?: string;
  canonical?: string;
  robots?: {
    index?: string;
    follow?: string;
  };
};
