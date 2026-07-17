# Eva Scolaro Talent Studio

Next.js 16 frontend for [evascolarotalentstudio.com](https://www.evascolarotalentstudio.com).

## Phase 1 — Class Pages

Nine class pages served by Next.js (`/classes/[slug]`). All other routes proxy to the existing WordPress site via `next.config.ts` rewrite rules.

## Getting Started

```bash
cp .env.local.example .env.local
# fill in WP_ORIGIN and NEXT_PUBLIC_WP_GRAPHQL_URL

npm install
npm run dev
```

Open [http://localhost:3000/classes/ballet](http://localhost:3000/classes/ballet) to preview.

## Planning docs

See `_docs/` for the full migration plan, frontend plan, and content drafts.
