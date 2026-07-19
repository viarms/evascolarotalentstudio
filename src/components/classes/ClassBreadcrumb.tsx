// src/components/classes/ClassBreadcrumb.tsx
//
// Slim breadcrumb strip rendered just below the class hero.
// Palette: inherits the site's dark theme — near-black bg, muted text,
// red (#B20001) accent on hover, separator styled as a thin slash.
// Includes JSON-LD BreadcrumbList for SEO.

import Link from "next/link";

type Crumb = {
  label: string;
  href: string;
};

type Props = {
  /** The current page label (not linked). */
  current: string;
};

const BASE_CRUMBS: Crumb[] = [
  { label: "Home",    href: "/" },
  { label: "Classes", href: "/classes/" },
];

export default function ClassBreadcrumb({ current }: Props) {
  const allCrumbs = [...BASE_CRUMBS, { label: current, href: "" }];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allCrumbs.map((crumb, i) => ({
      "@type":    "ListItem",
      position:   i + 1,
      name:       crumb.label,
      ...(crumb.href && { item: `https://www.evascolarotalentstudio.com${crumb.href}` }),
    })),
  };

  return (
    <>
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav
        aria-label="Breadcrumb"
        className="w-full bg-[#0a0a0a] border-b border-white/[0.06]"
      >
        <ol
          className="
            flex items-center flex-wrap gap-x-0 gap-y-1
            max-w-5xl mx-auto
            px-8 md:px-14 py-3
            list-none m-0
          "
        >
          {allCrumbs.map((crumb, i) => {
            const isLast = i === allCrumbs.length - 1;
            return (
              <li key={crumb.label} className="flex items-center">
                {/* Separator — shown before every item except the first */}
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="mx-2.5 text-white/20 font-light select-none text-xs"
                    style={{ letterSpacing: "0.05em" }}
                  >
                    /
                  </span>
                )}

                {isLast ? (
                  /* Current page — not a link */
                  <span
                    aria-current="page"
                    className="
                      text-white/50
                      font-normal text-[11px] tracking-wide
                      truncate max-w-[200px] md:max-w-none
                    "
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {crumb.label}
                  </span>
                ) : (
                  /* Ancestor links */
                  <Link
                    href={crumb.href}
                    className="
                      text-white/40 hover:text-[#B20001]
                      font-normal text-[11px] tracking-wide
                      transition-colors duration-200
                      no-underline whitespace-nowrap
                    "
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
