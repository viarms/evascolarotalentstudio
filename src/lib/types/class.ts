// ─── Eva Scolaro — Class data types ───────────────────────────────────────────
// These mirror the ACF field structure exposed via WPGraphQL.
// Field names here must match what is configured in ACF + WPGraphQL.

export type AgeGroup = {
  /** e.g. "Tots" | "Junior" | "Teen" */
  level: string;
  /** e.g. "3–5 years" */
  ageRange: string;
  /** Short description of the focus for this age group */
  focus: string;
};

export type ScheduleItem = {
  /** e.g. "Monday" */
  day: string;
  /** e.g. "Tots Hip-Hop" */
  className: string;
  /** 24-hour format, e.g. "14:30" */
  timeStart: string;
  /** 24-hour format, e.g. "15:15" */
  timeEnd: string;
  /** Coach name, e.g. "Novie" */
  coach: string;
};

export type StudioLocation = string;

export type StudioSchedule = {
  /** Location name exactly as it appears in WordPress, e.g. "Sanur Studio", "Toki Hub" */
  location: StudioLocation;
  items: ScheduleItem[];
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type ClassStatus = "active" | "coming_soon";

export type ClassData = {
  slug: string;
  seoTitle: string;
  metaDescription: string;
  /** Page H1 — used as the hero title and in the WhatsApp CTA message */
  h1: string;
  /** Short introductory paragraph shown below the hero */
  intro: string;
  /** Bullet-point benefit list */
  benefits: string[];
  ageGroups: AgeGroup[];
  /** One entry per studio location — Breakdance (Canggu only) will have one entry */
  schedule: StudioSchedule[];
  coachesNote: string;
  priceNote: string;
  faq: FaqItem[];
  /** Label for the WhatsApp CTA button, e.g. "Join Ballet Class" */
  ctaLabel: string;
  status: ClassStatus;
  /** Only populated when status === "coming_soon" (e.g. Public Speaking) */
  availabilityNote?: string;
};
