// src/lib/types/article.ts
// TypeScript types for the "articles" custom post type fetched via WP REST API.

export type ArticleListItem = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  date: string;           // ISO 8601
  featuredImage: string | null;
  categories: string[];
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
