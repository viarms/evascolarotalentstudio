// src/lib/mock/classMock.ts
// Development-only mock data. Swap fetchClass() to use Apollo once
// WPGraphQL is live on WordPress.

import type { ClassData } from "@/lib/types/class";

/** One active class (Ballet) — exercises the full layout */
export const MOCK_BALLET: ClassData = {
  slug: "ballet",
  seoTitle: "Ballet Classes for Kids Bali | Eva Scolaro Talent Studio",
  metaDescription:
    "Fun, structured ballet classes for children aged 3–15 in Sanur and Canggu, Bali. Build discipline, grace, and confidence at Eva Scolaro Talent Studio.",
  h1: "Ballet Classes",
  intro:
    "Our ballet programme nurtures creativity and physical coordination in a warm, supportive environment. From tiny Tots taking their first pliés to Teens preparing for exams, every child is celebrated at every stage.",
  benefits: [
    "Improves posture, balance, and coordination",
    "Builds focus and listening skills",
    "Develops musicality and rhythm",
    "Fosters confidence and self-expression",
    "Teaches discipline in a fun, nurturing setting",
  ],
  ageGroups: [
    { level: "Tots", ageRange: "3–5 years", focus: "Creative movement & basic rhythm" },
    { level: "Junior", ageRange: "6–9 years", focus: "Technique foundations & barre work" },
    { level: "Teen", ageRange: "10–15 years", focus: "Classical ballet & exam preparation" },
  ],
  schedule: [
    {
      location: "Sanur Studio",
      items: [
        { day: "Monday", className: "Tots Ballet", timeStart: "15:00", timeEnd: "15:45", coach: "Ms. Eva" },
        { day: "Wednesday", className: "Junior Ballet", timeStart: "16:00", timeEnd: "17:00", coach: "Ms. Eva" },
        { day: "Saturday", className: "Teen Ballet", timeStart: "09:00", timeEnd: "10:30", coach: "Ms. Eva" },
      ],
    },
    {
      location: "Canggu Studio",
      items: [
        { day: "Tuesday", className: "Tots Ballet", timeStart: "14:30", timeEnd: "15:15", coach: "Ms. Sari" },
        { day: "Thursday", className: "Junior Ballet", timeStart: "15:30", timeEnd: "16:30", coach: "Ms. Sari" },
      ],
    },
  ],
  coachesNote:
    "Ballet builds the foundation for all dance styles. We focus on joy first — technique follows naturally when children feel safe and celebrated.",
  priceNote:
    "Monthly packages start from IDR 800.000. Trial class available for free. Contact us via WhatsApp for current pricing and promotions.",
  faq: [
    {
      question: "What should my child wear to ballet class?",
      answer:
        "A simple leotard and ballet shoes are ideal. We recommend soft pink ballet flats for beginners. Hair should be tied up neatly, ideally in a bun.",
    },
    {
      question: "At what age can my child start?",
      answer:
        "We welcome children from 3 years old in our Tots programme. Classes are structured to match each developmental stage.",
    },
    {
      question: "Do you hold recitals or performances?",
      answer:
        "Yes! We hold an end-of-year showcase where all students have the opportunity to perform. It's a highlight for both students and families.",
    },
    {
      question: "Can I watch the class?",
      answer:
        "Parents are welcome to observe during our open class days, held once per term. For regular classes, we find children focus better without observers in the room.",
    },
  ],
  ctaLabel: "Join Ballet Class",
  status: "active",
};

/** One coming-soon class (Public Speaking) — exercises the ComingSoonBanner */
export const MOCK_PUBLIC_SPEAKING: ClassData = {
  slug: "public-speaking",
  seoTitle: "Public Speaking Classes for Kids Bali | Eva Scolaro Talent Studio",
  metaDescription:
    "Public speaking and confidence coaching for children in Bali. Coming soon to Eva Scolaro Talent Studio Sanur and Canggu.",
  h1: "Public Speaking Classes",
  intro:
    "We're launching a dedicated public speaking programme to help children find their voice, speak with confidence, and communicate with impact.",
  benefits: [
    "Build confidence speaking in front of an audience",
    "Develop clear communication and storytelling skills",
    "Learn voice projection, pacing, and body language",
  ],
  ageGroups: [
    { level: "Junior", ageRange: "6–9 years", focus: "Storytelling & basic presentation skills" },
    { level: "Teen", ageRange: "10–15 years", focus: "Debate, speeches & public presentation" },
  ],
  schedule: [],
  coachesNote: "",
  priceNote: "",
  faq: [],
  ctaLabel: "Ask About Class Availability",
  status: "coming_soon",
  availabilityNote:
    "This class is launching soon. Register your interest via WhatsApp and we'll notify you as soon as spots open.",
};

/** Map of all mock slugs — used by generateStaticParams in dev */
export const MOCK_CLASSES: Record<string, ClassData> = {
  ballet: MOCK_BALLET,
  "public-speaking": MOCK_PUBLIC_SPEAKING,
};
