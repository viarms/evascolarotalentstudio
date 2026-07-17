import { gql } from "@apollo/client";

/**
 * Fetches the slugs of all class CPT entries (kelases).
 * Used by generateStaticParams to pre-render all 9 class pages at build time.
 *
 * NOTE: GraphQL type names (kelases, kelas, classFields, etc.) must match
 * exactly what is configured in ACF + WPGraphQL on the WordPress side.
 * See Section 3 of Migration-Plan-Fase1-Halaman-Kelas.md.
 */
export const GET_ALL_CLASS_SLUGS = gql`
  query GetAllClassSlugs {
    kelases(first: 20) {
      nodes {
        slug
      }
    }
  }
`;

/**
 * Fetches all content for a single class page by slug.
 * Used by the [slug]/page.tsx route to render the page and its metadata.
 */
export const GET_CLASS_BY_SLUG = gql`
  query GetClassBySlug($slug: ID!) {
    kelas(id: $slug, idType: SLUG) {
      slug
      classFields {
        seoTitle
        metaDescription
        h1
        intro
        benefits {
          item
        }
        ageGroups {
          level
          ageRange
          focus
        }
        schedule {
          location
          items {
            day
            className
            timeStart
            timeEnd
            coach
          }
        }
        coachesNote
        priceNote
        faq {
          question
          answer
        }
        ctaLabel
        status
        availabilityNote
      }
    }
  }
`;
