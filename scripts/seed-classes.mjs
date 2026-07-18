#!/usr/bin/env node
/**
 * scripts/seed-classes.mjs
 *
 * Creates or updates all 9 class CPT posts in WordPress, then sets
 * Yoast SEO title and meta description on each post in the same pass.
 *
 * Prerequisites on WordPress:
 *  - Custom Post Type registered with slug "class" (show_in_rest: true)
 *  - Yoast SEO plugin active
 *  - Application Password created for your admin user
 *    (WP Admin → Users → Edit → Application Passwords)
 *
 * Usage:
 *   npm run seed:classes
 *
 * Idempotent: checks for an existing post by slug and updates rather
 * than creating a duplicate.
 */

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

// ─── Load .env.local ─────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(__dir, "../.env.local");

try {
  const raw = readFileSync(envPath, "utf8");
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
} catch {
  console.error("⚠️  .env.local not found — set WP_ORIGIN, WP_ADMIN_USER, WP_ADMIN_PASS as env vars.");
}

const WP_ORIGIN = process.env.WP_ORIGIN?.replace(/\/$/, "");
const WP_USER   = process.env.WP_ADMIN_USER;
const WP_PASS   = process.env.WP_ADMIN_PASS; // Application Password (spaces OK)

if (!WP_ORIGIN || !WP_USER || !WP_PASS) {
  console.error("Missing env vars: WP_ORIGIN, WP_ADMIN_USER, WP_ADMIN_PASS");
  process.exit(1);
}

const AUTH = Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const HEADERS = {
  "Authorization": `Basic ${AUTH}`,
  "Content-Type":  "application/json",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function wpFetch(path, options = {}) {
  const res = await fetch(`${WP_ORIGIN}/wp-json${path}`, {
    ...options,
    headers: { ...HEADERS, ...(options.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`WP API ${options.method ?? "GET"} ${path} → ${res.status}: ${body}`);
  }
  return res.json();
}

/** Find existing post by slug; returns post ID or null. */
async function findBySlug(slug) {
  const results = await wpFetch(`/wp/v2/class?slug=${encodeURIComponent(slug)}&_fields=id,slug`);
  return results.length > 0 ? results[0].id : null;
}

/**
 * Create or update a class post, then set Yoast SEO meta in the same request.
 * Yoast reads _yoast_wpseo_title and _yoast_wpseo_metadesc from the post meta.
 */
async function upsertClass(entry) {
  const { slug, title, acf, yoast } = entry;
  const existingId = await findBySlug(slug);

  const body = JSON.stringify({
    title,
    slug,
    status: "publish",
    acf,
    meta: {
      _yoast_wpseo_title:    yoast.seoTitle,
      _yoast_wpseo_metadesc: yoast.metaDesc,
    },
  });

  if (existingId) {
    const updated = await wpFetch(`/wp/v2/class/${existingId}`, { method: "POST", body });
    const yoastTitle = updated.yoast_head_json?.title ?? "(pending)";
    console.log(`  ✔  updated  → ${slug}  (id ${existingId})`);
    console.log(`       yoast title: ${yoastTitle}`);
  } else {
    const created = await wpFetch("/wp/v2/class", { method: "POST", body });
    const yoastTitle = created.yoast_head_json?.title ?? "(pending)";
    console.log(`  ✔  created  → ${slug}  (id ${created.id})`);
    console.log(`       yoast title: ${yoastTitle}`);
  }
}

// ─── Class data ───────────────────────────────────────────────────────────────
// Each entry has:
//   slug, title  — WP post fields
//   acf          — ACF fields (stored but not yet used by frontend)
//   yoast        — SEO title & meta description seeded into Yoast

const CLASSES = [

  // ── 1. Hip-Hop ──────────────────────────────────────────────────────────────
  {
    slug:  "hip-hop",
    title: "Hip-Hop",
    yoast: {
      seoTitle: "Hip-Hop Classes for Kids in Bali (Sanur & Canggu) | Eva Scolaro Talent Studio",
      metaDesc: "Hip-hop classes for children aged 4–16 in Sanur & Canggu. Experienced coaches, Tots/Junior/Teen levels. Free trial, no registration fee!",
    },
    acf: {
      seoTitle:        "Hip-Hop Classes for Kids in Bali (Sanur & Canggu) | Eva Scolaro Talent Studio",
      metaDescription: "Hip-hop classes for children aged 4–16 in Sanur & Canggu. Experienced coaches, Tots/Junior/Teen levels. Free trial, no registration fee!",
      h1:    "Hip-Hop Classes for Kids in Sanur & Canggu",
      intro: "Hip-hop is one of the most popular classes at Eva Scolaro Talent Studio. Kids learn energetic choreography, musical rhythm, and urban dance style in a fun and supportive environment — perfect for beginners and confident performers alike.",
      benefits: [
        { item: "Builds coordination, rhythm, and physical strength" },
        { item: "Boosts self-confidence through end-of-term stage performances" },
        { item: "Classes are grouped by age so content matches ability" },
        { item: "Part of the studio's annual concert" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 years",   focus: "Introduction to basic movement, rhythm, confidence in front of the mirror" },
        { level: "Junior", ageRange: "6–9 years",   focus: "More complex choreography, teamwork" },
        { level: "Teen",   ageRange: "10–16 years", focus: "Advanced technique, personal style, performance preparation" },
      ],
      coachesNote: "Novie, Faith, Tya — our hip-hop coaches have experience teaching children across all age groups and regularly choreograph end-of-term concert routines.",
      priceNote:   "Starting from Rp110,000/class (30-class/3-style package). See the full pricing page for all package options.",
      faq: [
        { question: "Does my child need prior dance experience?",  answer: "No, the Tots & Junior classes are designed for beginners." },
        { question: "What uniform is required?",                   answer: "Studio t-shirt uniform (included in the package); concert costume is separate (+Rp200,000/class during term concert)." },
        { question: "Can we try a class before enrolling?",        answer: "Yes, we offer a free trial class with no registration fee." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 2. Ballet ───────────────────────────────────────────────────────────────
  {
    slug:  "ballet",
    title: "Ballet",
    yoast: {
      seoTitle: "Children's Ballet Classes in Bali — Sanur & Canggu | Eva Scolaro Talent Studio",
      metaDesc: "Ballet classes for children aged 3+ in Sanur & Canggu, guided by experienced coaches. Tots through Junior/Teen levels. Book a free trial now!",
    },
    acf: {
      seoTitle:        "Children's Ballet Classes in Bali — Sanur & Canggu | Eva Scolaro Talent Studio",
      metaDescription: "Ballet classes for children aged 3+ in Sanur & Canggu, guided by experienced coaches. Tots through Junior/Teen levels. Book a free trial now!",
      h1:    "Ballet Classes for Kids in Sanur & Canggu",
      intro: "Our ballet classes introduce the fundamentals of classical technique in a fun and engaging way — building posture, flexibility, discipline, and graceful movement from an early age.",
      benefits: [
        { item: "A strong technical dance foundation applicable to any style later on" },
        { item: "Trains posture, flexibility, and discipline" },
        { item: "A gentle and supportive class environment for young children" },
        { item: "Opportunity to perform in the end-of-term concert in a tutu costume" },
      ],
      ageGroups: [
        { level: "Tots",        ageRange: "3–5 years",  focus: "Basic movement, flexibility, listening to music" },
        { level: "Junior/Teen", ageRange: "6–16 years", focus: "Foot & hand position technique, movement combinations, expression" },
      ],
      coachesNote: "Vivian (Sanur), Rahma (Canggu) — focused on safe, age-appropriate foundational ballet technique.",
      priceNote:   "Starting from Rp110,000/class — packages include the option of a Tutu Ballet uniform.",
      faq: [
        { question: "What age can children start ballet?",  answer: "Tots classes accept children from around age 3." },
        { question: "Are special ballet shoes required?",   answer: "Yes, they are recommended; ask for details at the trial class." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 3. Singing ──────────────────────────────────────────────────────────────
  {
    slug:  "singing",
    title: "Singing",
    yoast: {
      seoTitle: "Vocal / Singing Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Singing classes for children and teens in Sanur & Canggu. Vocal training, singing technique, and end-of-term concert performances. Free trial!",
    },
    acf: {
      seoTitle:        "Vocal / Singing Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Singing classes for children and teens in Sanur & Canggu. Vocal training, singing technique, and end-of-term concert performances. Free trial!",
      h1:    "Singing (Vocal) Classes for Kids in Sanur & Canggu",
      intro: "Singing classes help children find their voice — literally and figuratively. From basic breathing technique to solo performances on stage, kids learn to sing with confidence.",
      benefits: [
        { item: "Trains foundational vocal technique (breathing, pitch, voice control)" },
        { item: "Builds confidence performing solo and in groups" },
        { item: "Great for kids who love singing and those who want to be braver on stage" },
        { item: "Perform at the studio's end-of-term concert" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 years",   focus: "Pitch introduction, singing together, performance courage" },
        { level: "Junior", ageRange: "6–9 years",   focus: "Basic vocal technique, simple song practice" },
        { level: "Teen",   ageRange: "10–16 years", focus: "Advanced voice control, solo performance preparation" },
      ],
      coachesNote: "Kuna, Andini — teaching foundational vocal technique through to stage performance preparation.",
      priceNote:   "Starting from Rp110,000/class.",
      faq: [
        { question: "My child has never had vocal lessons — can they join?", answer: "Yes, the Tots & Junior classes are designed for complete beginners." },
        { question: "Are there solo performances?",                          answer: "There are opportunities to perform solo or in groups at the end-of-term concert." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 4. K-Pop Dance ──────────────────────────────────────────────────────────
  {
    slug:  "kpop-dance",
    title: "K-Pop Dance",
    yoast: {
      seoTitle: "K-Pop Dance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDesc: "K-Pop dance classes for children and teens in Sanur & Canggu. Trending choreography, Junior & Teen levels. Book a free trial now!",
    },
    acf: {
      seoTitle:        "K-Pop Dance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDescription: "K-Pop dance classes for children and teens in Sanur & Canggu. Trending choreography, Junior & Teen levels. Book a free trial now!",
      h1:    "K-Pop Dance Classes for Kids & Teens in Sanur & Canggu",
      intro: "The favorite class for K-Pop fans! Children and teenagers learn the latest K-Pop-style choreography, training their stamina, formation teamwork, and idol-worthy stage presence.",
      benefits: [
        { item: "Choreography follows the latest K-Pop song trends" },
        { item: "Trains stamina, formation coordination, and stage presence" },
        { item: "Hugely popular among primary school-aged children and teens" },
        { item: "Group performance at the end-of-term concert" },
      ],
      ageGroups: [
        { level: "Junior", ageRange: "6–9 years",   focus: "Basic formation movement, following K-Pop song rhythms" },
        { level: "Teen",   ageRange: "10–16 years", focus: "Complex choreography, idol-style stage expression" },
      ],
      coachesNote: "Faith — stays up to date with the latest K-Pop choreography to keep content relevant to what kids love.",
      priceNote:   "Starting from Rp110,000/class.",
      faq: [
        { question: "Do you have to be a K-Pop fan to join?", answer: "Not required, but it's most fun for kids who already enjoy K-Pop music." },
        { question: "Is there a Tots (toddler) class?",       answer: "K-Pop Dance currently starts at the Junior level; contact us via WhatsApp to check availability of a Tots K-Pop class in the current term." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 5. Jazz Dance ───────────────────────────────────────────────────────────
  {
    slug:  "jazz-dance",
    title: "Jazz Dance",
    yoast: {
      seoTitle: "Jazz Dance Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Jazz dance classes for kids in Sanur & Canggu. Trains expression, technique, and stage confidence. Free trial, no registration fee.",
    },
    acf: {
      seoTitle:        "Jazz Dance Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Jazz dance classes for kids in Sanur & Canggu. Trains expression, technique, and stage confidence. Free trial, no registration fee.",
      h1:    "Jazz Dance Classes for Kids in Sanur & Canggu",
      intro: "Jazz dance blends technique, musicality, and self-expression. This class is perfect for kids who love dynamic movement and want to explore a more expressive style of dance.",
      benefits: [
        { item: "Trains flexibility, core strength, and musicality" },
        { item: "An expressive and enjoyable dance style" },
        { item: "A solid foundation for children interested in musical theatre" },
        { item: "Perform at the end-of-term concert" },
      ],
      ageGroups: [
        { level: "Tots",   ageRange: "3–5 years", focus: "Basic movement, facial & body expression" },
        { level: "Junior", ageRange: "6–9 years", focus: "Movement combinations, basic jazz technique" },
      ],
      coachesNote: "Putri — brings an energetic jazz style that's easy and fun for kids to follow.",
      priceNote:   "Starting from Rp110,000/class.",
      faq: [
        { question: "What's the difference between Jazz Dance and Hip-Hop?", answer: "Jazz places greater emphasis on technique, musicality, and body expression; Hip-Hop leans more toward urban rhythm and freestyle." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 6. Drama & Musical Theatre ──────────────────────────────────────────────
  {
    slug:  "drama-musical-theatre",
    title: "Drama & Musical Theatre",
    yoast: {
      seoTitle: "Drama & Musical Theatre Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Drama & musical theatre classes for children and teens in Sanur & Canggu. Trains acting, expression, and stage confidence. Free trial!",
    },
    acf: {
      seoTitle:        "Drama & Musical Theatre Classes for Kids in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Drama & musical theatre classes for children and teens in Sanur & Canggu. Trains acting, expression, and stage confidence. Free trial!",
      h1:    "Drama & Musical Theatre Classes for Kids in Sanur & Canggu",
      intro: "This class combines acting (drama) and musical performance, helping children express themselves, build empathy through character work, and perform with confidence in front of an audience.",
      benefits: [
        { item: "Trains expression, vocal delivery, and physical movement all at once" },
        { item: "Builds confidence speaking and performing in public" },
        { item: "Develops imagination and storytelling skills" },
        { item: "Preparation for a musical theatre performance at the end-of-term concert" },
      ],
      ageGroups: [
        { level: "Junior", ageRange: "6–9 years",   focus: "Basic acting exercises, role play" },
        { level: "Teen",   ageRange: "10–16 years", focus: "Musical theatre, character acting, stage vocal work" },
      ],
      coachesNote: "Andini, Putri — experienced in guiding children through acting and musical theatre for stage performances.",
      priceNote:   "Starting from Rp110,000/class.",
      faq: [
        { question: "Can shy children join this class?",                      answer: "This class is designed specifically to help shy children build confidence gradually." },
        { question: "What's the difference between Drama and Musical Theatre?", answer: "Drama focuses on acting & dialogue; Musical Theatre combines acting, singing, and movement/dance in a single production." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 7. Modeling ─────────────────────────────────────────────────────────────
  {
    slug:  "modeling",
    title: "Modeling",
    yoast: {
      seoTitle: "Modeling Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Modeling classes for children and teens in Sanur & Canggu. Trains catwalk, posture, and confidence in front of the camera. Free trial!",
    },
    acf: {
      seoTitle:        "Modeling Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Modeling classes for children and teens in Sanur & Canggu. Trains catwalk, posture, and confidence in front of the camera. Free trial!",
      h1:    "Modeling Classes for Kids & Teens in Sanur & Canggu",
      intro: "Modeling classes train children and teens in posture, catwalk technique, and confidence in front of the camera and on stage — skills that are useful far beyond the modeling world itself.",
      benefits: [
        { item: "Trains posture and confident walking" },
        { item: "Builds comfort performing in front of a camera/on stage" },
        { item: "Trains facial expression and body language" },
        { item: "Opportunity to appear at studio concerts & photo/documentation sessions" },
      ],
      ageGroups: [
        { level: "Tots/Junior", ageRange: "3–9 years",   focus: "Posture introduction, basic walking, confidence in front of others" },
        { level: "Teen",        ageRange: "10–16 years", focus: "Catwalk technique, posing, camera expression" },
      ],
      coachesNote: "Cintya — guides age-appropriate modeling fundamentals with an emphasis on confidence, not appearance pressure.",
      priceNote:   "Starting from Rp110,000/class.",
      faq: [
        { question: "Does this class guarantee my child becomes a professional model?", answer: "The primary goal of the class is to build self-confidence and good posture — not to promise a modeling career." },
        { question: "Are there photo sessions?",                                        answer: "The studio documents performance moments and activities; for formal photo sessions, ask for more details via WhatsApp." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 8. Breakdance ───────────────────────────────────────────────────────────
  {
    slug:  "breakdance",
    title: "Breakdance",
    yoast: {
      seoTitle: "Breakdance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Breakdance classes for children and teens in Canggu. Trains strength, agility, and freestyle style. Free trial, no registration fee!",
    },
    acf: {
      seoTitle:        "Breakdance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Breakdance classes for children and teens in Canggu. Trains strength, agility, and freestyle style. Free trial, no registration fee!",
      h1:    "Breakdance Classes for Kids & Teens in Canggu",
      intro: "Breakdance classes introduce the foundational movements of breaking — from footwork to freezes — in a safe and structured environment, building physical strength alongside personal style.",
      benefits: [
        { item: "Trains muscle strength, agility, and balance" },
        { item: "Develops freestyle style and personal confidence" },
        { item: "Great for energetic kids who enjoy physical challenges" },
        { item: "Perform at the end-of-term concert" },
      ],
      ageGroups: [
        { level: "Junior/Teen", ageRange: "6–16 years", focus: "Basic breaking movements, footwork, freezes, freestyle" },
      ],
      coachesNote: "Faith.",
      priceNote:   "Starting from Rp110,000/class. Currently only available at Canggu Studio — contact us via WhatsApp if you're in Sanur.",
      faq: [
        { question: "Does my child need to be flexible before joining?", answer: "No, classes start from basic movements and progress gradually according to each child's ability." },
      ],
      ctaLabel: "Book Free Trial Class",
      status:   "active",
    },
  },

  // ── 9. Public Speaking ──────────────────────────────────────────────────────
  {
    slug:  "public-speaking",
    title: "Public Speaking",
    yoast: {
      seoTitle: "Public Speaking Classes for Teens in Bali | Eva Scolaro Talent Studio",
      metaDesc: "Public speaking classes for teenagers — builds confidence speaking in public. Part of the Eva Scolaro Talent Studio performing arts program.",
    },
    acf: {
      seoTitle:        "Public Speaking Classes for Teens in Bali | Eva Scolaro Talent Studio",
      metaDescription: "Public speaking classes for teenagers — builds confidence speaking in public. Part of the Eva Scolaro Talent Studio performing arts program.",
      h1:    "Public Speaking Classes for Teens",
      intro: "Public speaking classes help teenagers build the confidence to speak in front of others — a skill that reaches far beyond the stage, from school presentations to everyday life.",
      benefits: [
        { item: "Trains speech structure, intonation, and body language" },
        { item: "Reduces nerves when performing or speaking in public" },
        { item: "Complements other performing arts skills (drama, modeling)" },
      ],
      ageGroups: [
        { level: "Teen", ageRange: "10–16 years", focus: "Speech structure, intonation, confidence speaking in public" },
      ],
      coachesNote:      "Andini.",
      priceNote:        "",
      faq:              [],
      ctaLabel:         "Enquire About Class Availability",
      status:           "coming_soon",
      availabilityNote: "Public Speaking is currently running as an ECA program exclusively at our partner schools. For general enrollment at Sanur or Canggu Studio, please contact us via WhatsApp — we will notify you as soon as regular classes open to the public.",
    },
  },

]; // end CLASSES


// ─── Runner ──────────────────────────────────────────────────────────────────

async function main() {
  console.log(`\n🚀  Seeding ${CLASSES.length} classes + Yoast SEO → ${WP_ORIGIN}\n`);

  // Verify CPT is reachable before touching any data
  try {
    await wpFetch("/wp/v2/types/class?_fields=slug");
  } catch (err) {
    console.error(`\n❌  Cannot reach WP REST API or "class" CPT not found.\n   ${err.message}`);
    console.error(`\n   Make sure:\n   1. The "class" CPT is registered with show_in_rest: true\n   2. WP_ORIGIN is correct and the site is reachable\n`);
    process.exit(1);
  }

  let ok = 0;
  let failed = 0;

  for (const entry of CLASSES) {
    try {
      await upsertClass(entry);
      ok++;
    } catch (err) {
      console.error(`  ✗  FAILED  → ${entry.slug}: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n✅  Done — ${ok} succeeded, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

main();
