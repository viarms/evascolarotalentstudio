import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

/**
 * Creates a new ApolloClient instance pointed at the WPGraphQL endpoint.
 *
 * A new instance is created per call so it is safe to use in Server Components
 * and in generateStaticParams / generateMetadata (no shared singleton state
 * between requests at build or runtime).
 *
 * The GraphQL URL is read from NEXT_PUBLIC_WP_GRAPHQL_URL — set this in
 * .env.local for development and in Vercel env vars for production.
 */
export function getClient() {
  return new ApolloClient({
    link: new HttpLink({
      uri: process.env.NEXT_PUBLIC_WP_GRAPHQL_URL,
    }),
    cache: new InMemoryCache(),
    // Disable SSR warning — we are intentionally using this in a server context
    ssrMode: true,
  });
}
