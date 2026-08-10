# PRD: Eva Scolaro Talent Studio — Bilingual Website (EN/ID)

**Product:** evascolarotalentstudio.com
**Stack:** Next.js frontend, WordPress (headless-ish) backend
**Author:** VMS
**Status:** Draft v1

---

## 1. Background

Eva Scolaro Talent Studio's website is mid-migration from a legacy WordPress theme to a Next.js frontend. Homepage, 9 class pages, Studio Rental, and Privacy Notice are already migrated. Gallery, Dancewear, and News/Blog remain on the old WP theme, with News/Blog confirmed for eventual Next.js migration.

The site currently serves English only. The business needs it available in both English and Bahasa Indonesia to serve local Bali families alongside the existing expat/international audience.

## 2. Problem Statement

The studio is losing reach with Indonesian-speaking parents who search in Bahasa Indonesia and may not fully engage with an English-only site. At the same time, the site is mid-migration, so any bilingual solution needs to work with pages in two different technical states (Next.js-native and legacy WP) without doubling the team's translation-tooling work.

## 3. Goals

- Serve the full site in English and Bahasa Indonesia
- Preserve existing English SEO equity (English stays the default/canonical locale)
- Rank independently in Indonesian-language local search (e.g. "les menari anak Sanur")
- Avoid investing in throwaway tooling for pages that are about to be migrated off WordPress anyway

### Non-Goals

- Full WordPress multilingual plugin setup (WPML/Polylang) — explicitly out of scope
- Translating proper nouns (class/style names, teacher names) — these stay in English in both locales
- Changing URL slug language (slugs stay English in both locales)

## 4. Users & Use Cases

| User | Need |
|---|---|
| English-speaking / expat parent (existing audience) | Continue landing on English content by default, no disruption |
| Indonesian-speaking local parent | Find and read the site in Bahasa Indonesia, discover it via ID-language search |
| Studio staff (content contributor) | Add/edit bilingual content without needing developer help, in WP admin where possible |
| VMS (dev/translator) | Manage UI-string translations in code, editorial translations via CMS |

## 5. Functional Requirements

### 5.1 Locale Routing & Switching
- FR1: Site supports `/en/...` (default, unprefixed) and `/id/...` locale routing via `next-intl`
- FR2: Manual language switcher in header, visible on all pages
- FR3: Locale choice persisted via cookie after first manual selection; no forced auto-redirect based on browser language for returning visitors
- FR4: Root `/` always serves English by default

### 5.2 Content & Translation Management
- FR5: UI strings (nav, buttons, pricing labels, form labels) stored in translation files (JSON/TS), managed by VMS
- FR6: Editorial content (about text, class descriptions, blog posts) stored as bilingual field pairs in WordPress (ACF `_en` / `_id` fields), editable by client-side staff
- FR7: Shared glossary/style guide established before translation begins — covers tone, which terms stay untranslated, and location-name handling (Sanur/Canggu)
- FR8: Class/style names and teacher names remain untranslated in both locales

### 5.3 SEO
- FR9: `hreflang="en"`, `hreflang="id"`, and `hreflang="x-default"` tags on every paired page
- FR10: Bilingual sitemap (or per-locale sitemap entries) submitted to Google Search Console for both locales
- FR11: Meta titles/descriptions localized per page — Indonesian metadata based on independent ID keyword research, not literal translation of English metadata
- FR12: `og:locale` / `og:locale:alternate` correctly set per page (includes fixing existing bug where `og:locale` is set to `id_ID` on English-only pages)
- FR13: Canonical tags scoped per locale (no cross-language canonical pointing)

### 5.4 Migration Alignment
- FR14: Every page migrated from WordPress to Next.js going forward ships bilingual as part of that migration — no separate "translate later" pass
- FR15: No WP-side multilingual plugin investment for pages awaiting migration; they may remain English-only in the interim

## 6. Technical Approach

| Area | Decision |
|---|---|
| Routing/i18n library | `next-intl` (App Router) |
| Locale detection | First-visit only via `Accept-Language`; cookie-persisted after that |
| WP content fields | ACF `_en` / `_id` field pairs (no WPML/Polylang) |
| Slugs | English slugs for both locales |
| Proper nouns | Untranslated in both locales |

## 7. Rollout Plan

**Phase 1 — Foundation + already-migrated pages**
- `next-intl` routing setup, language switcher, cookie persistence
- Translate: Homepage, 9 class pages, Studio Rental, Privacy Notice
- Fix `og:locale` bug
- ID keyword research for meta titles/descriptions

**Phase 2 — In-flight migration pages**
- Concert page, Sanur/Canggu location pages built bilingual from day one as they migrate
- ACF bilingual fields added to relevant WP post types

**Phase 3 — Remaining legacy pages (Gallery, Dancewear, News/Blog)**
- Each ships bilingual as part of its Next.js migration
- No interim WP bilingual tooling; may stay English-only until migrated

**Phase 4 — SEO validation**
- hreflang audit
- Bilingual sitemap submitted to GSC
- Per-locale performance tracked in Search Console post-launch

## 8. Success Metrics

- Indonesian-language organic sessions/impressions (baseline: ~0 today, English-only site)
- No drop in existing English organic traffic/rankings post-launch
- Both locale versions indexed and appearing in GSC coverage report
- Bounce rate / trial-booking conversion comparable across EN and ID versions

## 9. Roles & Ownership

- **Translation:** Shared — client-side staff + VMS
- **Dev/i18n implementation, UI strings, SEO setup:** VMS
- **Editorial content translation (WP fields):** Client-side staff, with VMS support

## 10. Risks

- Duplicate-content SEO risk if hreflang/canonical setup is incomplete — mitigated by Phase 4 audit
- Split translation ownership (staff + VMS) could produce inconsistent tone/terminology — mitigated by shared glossary (FR7)
- Pages still on legacy WP remain English-only until their migration slot — acceptable per confirmed scope, but worth setting stakeholder expectations on timing
