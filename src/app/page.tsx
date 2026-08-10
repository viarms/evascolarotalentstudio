// src/app/page.tsx
// Homepage — server component.
// Fetches schedules at request time (1h revalidation), exports metadata,
// then passes data down to the HomeClient interactive component.

import type { Metadata } from "next";
import { fetchAllSchedules } from "@/lib/queries/classQueries";
import HomeClient from "./HomeClient";

export const revalidate = 3600; // ISR: revalidate every hour

export const metadata: Metadata = {
  title: "Bali's #1 Performing Arts Studio for Kids in Sanur & Canggu!",
  description:
    "Dance and performing arts classes for children in Sanur and Canggu, Bali. Ballet, Hip-Hop, K-Pop, Drama, Singing, Modeling and more. Join us now!",
  alternates: {
    canonical: "https://www.evascolarotalentstudio.com",
  },
  openGraph: {
    url: "https://www.evascolarotalentstudio.com",
    title: "Bali's #1 Performing Arts Studio for Kids in Sanur & Canggu!",
    description:
      "Dance and performing arts classes for children in Sanur and Canggu, Bali. Ballet, Hip-Hop, K-Pop, Drama, Singing, Modeling and more. Join us now!",
    images: [
      {
        url: "/og-home.webp",
        width: 1024,
        height: 682,
        alt: "Eva Scolaro Talent Studio — Bali's performing arts studio for kids",
      },
    ],
  },
};

export default async function HomePage() {
  // Fetch schedules server-side — falls back to [] on error,
  // HomeClient will use MOCK_SCHEDULE as fallback when schedules is empty.
  const schedules = await fetchAllSchedules().catch(() => []);

  return <HomeClient schedules={schedules} />;
}
