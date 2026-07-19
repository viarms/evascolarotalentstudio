// src/app/classes/[slug]/page.tsx
// Dynamic route for all 9 class pages.
//
// DATA SOURCE:
//   Schedule → WP REST API /wp/v2/event, filtered by class slug keywords
//              and studio location (Sanur Studio / Canggu Studio only).
//   Static content (intro, benefits, age groups, FAQ, etc.) → classMock.ts
//              until the custom ACF field group is set up in WordPress.
//
// CACHING: revalidate = 3600 (ISR, 1-hour).

import { notFound } from "next/navigation";
import type { Metadata } from "next";

import type { ClassData } from "@/lib/types/class";
import { fetchScheduleForClass, fetchYoastMeta, fetchFeaturedImage } from "@/lib/queries/classQueries";
import { buildClassPageSchema } from "@/lib/schema";

// ─── Components ──────────────────────────────────────────────────────────────
import ClassHero from "@/components/classes/ClassHero";
import ClassIntro from "@/components/classes/ClassIntro";
import BenefitsList from "@/components/classes/BenefitsList";
import AgeGroupTable from "@/components/classes/AgeGroupTable";
import ScheduleTabs from "@/components/classes/ScheduleTabs";
import CoachNote from "@/components/classes/CoachNote";
import PriceNote from "@/components/classes/PriceNote";
import FaqAccordion from "@/components/classes/FaqAccordion";
import CtaButton from "@/components/classes/CtaButton";
import ComingSoonBanner from "@/components/classes/ComingSoonBanner";

// ─── ISR: revalidate every hour ───────────────────────────────────────────────
export const revalidate = 3600;

// ─── Valid class slugs ────────────────────────────────────────────────────────
const CLASS_SLUGS = [
  "hip-hop",
  "ballet",
  "singing",
  "kpop-dance",
  "jazz-dance",
  "drama-musical-theatre",
  "modeling",
  "breakdance",
  "public-speaking",
] as const;

type ClassSlug = (typeof CLASS_SLUGS)[number];

// ─── Static content per slug ──────────────────────────────────────────────────
// This provides all non-schedule fields. Replace with a WPGraphQL/REST call
// once the ACF classFields group is set up on the WordPress class CPT.

type StaticContent = Omit<ClassData, "schedule">;

const STATIC_CONTENT: Record<ClassSlug, StaticContent> = {
  "hip-hop": {
    slug: "hip-hop",
    seoTitle: "Hip-Hop Classes for Kids in Bali (Sanur & Canggu) | Eva Scolaro Talent Studio",
    metaDescription: "Hip-hop classes for children aged 4–16 in Sanur & Canggu. Experienced coaches, Tots/Junior/Teen levels. Free trial, no registration fee!",
    h1: "Hip-Hop Classes for Kids in Sanur & Canggu",
    intro: "Hip-hop is one of the most popular classes at Eva Scolaro Talent Studio. Kids learn energetic choreography, musical rhythm, and urban dance style in a fun and supportive environment — perfect for beginners and confident performers alike.",
    benefits: [
      "Builds coordination, rhythm, and physical strength",
      "Boosts self-confidence through end-of-term stage performances",
      "Classes are grouped by age so content matches ability",
      "Part of the studio's annual concert",
    ],
    ageGroups: [
      { level: "Tots",   ageRange: "3–5 years",   focus: "Introduction to basic movement, rhythm, confidence in front of the mirror" },
      { level: "Junior", ageRange: "6–9 years",   focus: "More complex choreography, teamwork" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Advanced technique, personal style, performance preparation" },
    ],
    coachesNote: "We believe every child carries rhythm inside them — our job is simply to bring it out. In this class, there's no such thing as 'not a dancer.' We start from where your child is, build their confidence step by step, and by the end of term you'll see them own the stage in a way that will give you chills. Hip-hop isn't just a dance style — it's a way of expressing who you are, and we can't wait to help your child discover that.",
    priceNote: "Starting from Rp110,000/class (30-class/3-style package). See the full pricing page for all package options.",
    faq: [
      { question: "Does my child need prior dance experience?", answer: "No, the Tots & Junior classes are designed for beginners." },
      { question: "What uniform is required?", answer: "Studio t-shirt uniform (included in the package); concert costume is separate (+Rp200,000/class during term concert)." },
      { question: "Can we try a class before enrolling?", answer: "Yes, we offer a free trial class with no registration fee." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "ballet": {
    slug: "ballet",
    seoTitle: "Children's Ballet Classes in Bali — Sanur & Canggu | Eva Scolaro Talent Studio",
    metaDescription: "Ballet classes for children aged 3+ in Sanur & Canggu, guided by experienced coaches. Tots through Junior/Teen levels. Book a free trial now!",
    h1: "Ballet Classes for Kids in Sanur & Canggu",
    intro: "Our ballet classes introduce the fundamentals of classical technique in a fun and engaging way — building posture, flexibility, discipline, and graceful movement from an early age.",
    benefits: [
      "A strong technical dance foundation applicable to any style later on",
      "Trains posture, flexibility, and discipline",
      "A gentle and supportive class environment for young children",
      "Opportunity to perform in the end-of-term concert in a tutu costume",
    ],
    ageGroups: [
      { level: "Tots",        ageRange: "3–5 years",  focus: "Basic movement, flexibility, listening to music" },
      { level: "Junior/Teen", ageRange: "6–16 years", focus: "Foot & hand position technique, movement combinations, expression" },
    ],
    coachesNote: "Ballet gives children something that lasts a lifetime — not just technique, but the discipline to keep going when something is hard, and the grace to make it look effortless. We teach this class with patience and warmth, because we know that the little one who struggles with their first plié today will be the one who stands tallest on stage. Every child who walks through our door belongs here.",
    priceNote: "Starting from Rp110,000/class — packages include the option of a Tutu Ballet uniform.",
    faq: [
      { question: "What age can children start ballet?", answer: "Tots classes accept children from around age 3." },
      { question: "Are special ballet shoes required?", answer: "Yes, they are recommended; ask for details at the trial class." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "singing": {
    slug: "singing",
    seoTitle: "Vocal / Singing Classes for Kids in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Singing classes for children and teens in Sanur & Canggu. Vocal training, singing technique, and end-of-term concert performances. Free trial!",
    h1: "Singing (Vocal) Classes for Kids in Sanur & Canggu",
    intro: "Singing classes help children find their voice — literally and figuratively. From basic breathing technique to solo performances on stage, kids learn to sing with confidence.",
    benefits: [
      "Trains foundational vocal technique (breathing, pitch, voice control)",
      "Builds confidence performing solo and in groups",
      "Great for kids who love singing and those who want to be braver on stage",
      "Perform at the studio's end-of-term concert",
    ],
    ageGroups: [
      { level: "Tots",   ageRange: "3–5 years",   focus: "Pitch introduction, singing together, performance courage" },
      { level: "Junior", ageRange: "6–9 years",   focus: "Basic vocal technique, simple song practice" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Advanced voice control, solo performance preparation" },
    ],
    coachesNote: "Every child has a voice worth hearing — and this class is the place where they learn to trust it. We've seen children come in barely willing to hum, and leave term after term singing solos in front of a full audience. The transformation isn't magic; it's consistent encouragement, the right technique, and a safe space to be imperfect while growing. If your child loves music, this is where they belong.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "My child has never had vocal lessons — can they join?", answer: "Yes, the Tots & Junior classes are designed for complete beginners." },
      { question: "Are there solo performances?", answer: "There are opportunities to perform solo or in groups at the end-of-term concert." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "kpop-dance": {
    slug: "kpop-dance",
    seoTitle: "K-Pop Dance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
    metaDescription: "K-Pop dance classes for children and teens in Sanur & Canggu. Trending choreography, Junior & Teen levels. Book a free trial now!",
    h1: "K-Pop Dance Classes for Kids & Teens in Sanur & Canggu",
    intro: "The favorite class for K-Pop fans! Children and teenagers learn the latest K-Pop-style choreography, training their stamina, formation teamwork, and idol-worthy stage presence.",
    benefits: [
      "Choreography follows the latest K-Pop song trends",
      "Trains stamina, formation coordination, and stage presence",
      "Hugely popular among primary school-aged children and teens",
      "Group performance at the end-of-term concert",
    ],
    ageGroups: [
      { level: "Junior", ageRange: "6–9 years",   focus: "Basic formation movement, following K-Pop song rhythms" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Complex choreography, idol-style stage expression" },
    ],
    coachesNote: "K-Pop is more than a trend — it's a full performance art that demands precision, energy, and teamwork. We keep the choreography fresh each term so students are always learning something they're genuinely excited about. But beyond the moves, what we're really building is presence: the ability to walk into any room and light it up. When your child performs at the concert, you'll see exactly what we mean.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "Do you have to be a K-Pop fan to join?", answer: "Not required, but it's most fun for kids who already enjoy K-Pop music." },
      { question: "Is there a Tots (toddler) class?", answer: "K-Pop Dance currently starts at the Junior level; contact us via WhatsApp to check availability of a Tots K-Pop class in the current term." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "jazz-dance": {
    slug: "jazz-dance",
    seoTitle: "Jazz Dance Classes for Kids in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Jazz dance classes for kids in Sanur & Canggu. Trains expression, technique, and stage confidence. Free trial, no registration fee.",
    h1: "Jazz Dance Classes for Kids in Sanur & Canggu",
    intro: "Jazz dance blends technique, musicality, and self-expression. This class is perfect for kids who love dynamic movement and want to explore a more expressive style of dance.",
    benefits: [
      "Trains flexibility, core strength, and musicality",
      "An expressive and enjoyable dance style",
      "A solid foundation for children interested in musical theatre",
      "Perform at the end-of-term concert",
    ],
    ageGroups: [
      { level: "Tots",   ageRange: "3–5 years", focus: "Basic movement, facial & body expression" },
      { level: "Junior", ageRange: "6–9 years", focus: "Movement combinations, basic jazz technique" },
    ],
    coachesNote: "Jazz dance teaches children to feel the music in their whole body — and once they feel it, you can't stop them. This class is joyful, expressive, and alive. We push technique because it matters, but we never let it get in the way of the fun. Our goal is for every child to leave each session feeling more confident and more themselves than when they walked in.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "What's the difference between Jazz Dance and Hip-Hop?", answer: "Jazz places greater emphasis on technique, musicality, and body expression; Hip-Hop leans more toward urban rhythm and freestyle." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "drama-musical-theatre": {
    slug: "drama-musical-theatre",
    seoTitle: "Drama & Musical Theatre Classes for Kids in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Drama & musical theatre classes for children and teens in Sanur & Canggu. Trains acting, expression, and stage confidence. Free trial!",
    h1: "Drama & Musical Theatre Classes for Kids in Sanur & Canggu",
    intro: "This class combines acting (drama) and musical performance, helping children express themselves, build empathy through character work, and perform with confidence in front of an audience.",
    benefits: [
      "Trains expression, vocal delivery, and physical movement all at once",
      "Builds confidence speaking and performing in public",
      "Develops imagination and storytelling skills",
      "Preparation for a musical theatre performance at the end-of-term concert",
    ],
    ageGroups: [
      { level: "Junior", ageRange: "6–9 years",   focus: "Basic acting exercises, role play" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Musical theatre, character acting, stage vocal work" },
    ],
    coachesNote: "Theatre taught us that the most powerful thing a person can do is stand in front of others and tell the truth through a character. That's what we teach here — not just how to act or sing, but how to be brave enough to be seen. Some of our most transformative students started as the quietest kids in the room. Drama and musical theatre have a way of finding the performer hiding inside every child.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "Can shy children join this class?", answer: "This class is designed specifically to help shy children build confidence gradually." },
      { question: "What's the difference between Drama and Musical Theatre?", answer: "Drama focuses on acting & dialogue; Musical Theatre combines acting, singing, and movement/dance in a single production." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "modeling": {
    slug: "modeling",
    seoTitle: "Modeling Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Modeling classes for children and teens in Sanur & Canggu. Trains catwalk, posture, and confidence in front of the camera. Free trial!",
    h1: "Modeling Classes for Kids & Teens in Sanur & Canggu",
    intro: "Modeling classes train children and teens in posture, catwalk technique, and confidence in front of the camera and on stage — skills that are useful far beyond the modeling world itself.",
    benefits: [
      "Trains posture and confident walking",
      "Builds comfort performing in front of a camera/on stage",
      "Trains facial expression and body language",
      "Opportunity to appear at studio concerts & photo/documentation sessions",
    ],
    ageGroups: [
      { level: "Tots/Junior", ageRange: "3–9 years",   focus: "Posture introduction, basic walking, confidence in front of others" },
      { level: "Teen",        ageRange: "10–16 years", focus: "Catwalk technique, posing, camera expression" },
    ],
    coachesNote: "Confidence isn't something you're born with — it's something you practice. That's the real lesson in this class. We use posture, movement, and presence as tools to help children discover how powerful they already are. It has nothing to do with looks and everything to do with how you carry yourself. The students who come through this program walk differently — and not just on the catwalk.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "Does this class guarantee my child becomes a professional model?", answer: "The primary goal of the class is to build self-confidence and good posture — not to promise a modeling career." },
      { question: "Are there photo sessions?", answer: "The studio documents performance moments and activities; for formal photo sessions, ask for more details via WhatsApp." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "breakdance": {
    slug: "breakdance",
    seoTitle: "Breakdance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Breakdance classes for children and teens in Canggu. Trains strength, agility, and freestyle style. Free trial, no registration fee!",
    h1: "Breakdance Classes for Kids & Teens in Canggu",
    intro: "Breakdance classes introduce the foundational movements of breaking — from footwork to freezes — in a safe and structured environment, building physical strength alongside personal style.",
    benefits: [
      "Trains muscle strength, agility, and balance",
      "Develops freestyle style and personal confidence",
      "Great for energetic kids who enjoy physical challenges",
      "Perform at the end-of-term concert",
    ],
    ageGroups: [
      { level: "Junior/Teen", ageRange: "6–16 years", focus: "Basic breaking movements, footwork, freezes, freestyle" },
    ],
    coachesNote: "Breakdance is one of the most honest art forms there is — it rewards hard work, creativity, and the courage to keep trying after you fall. And you will fall. That's part of it. What we build in this class goes way beyond dance: grit, physical strength, and the kind of self-belief that comes from mastering something genuinely difficult. Every freeze landed, every freeze stuck — that's your child proving to themselves what they're made of.",
    priceNote: "Starting from Rp110,000/class. Currently only available at Canggu Studio — contact us via WhatsApp if you're in Sanur.",
    faq: [
      { question: "Does my child need to be flexible before joining?", answer: "No, classes start from basic movements and progress gradually according to each child's ability." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "public-speaking": {
    slug: "public-speaking",
    seoTitle: "Public Speaking Classes for Teens in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Public speaking classes for teenagers — builds confidence speaking in public. Part of the Eva Scolaro Talent Studio performing arts program.",
    h1: "Public Speaking Classes for Teens",
    intro: "Public speaking classes help teenagers build the confidence to speak in front of others — a skill that reaches far beyond the stage, from school presentations to everyday life.",
    benefits: [
      "Trains speech structure, intonation, and body language",
      "Reduces nerves when performing or speaking in public",
      "Complements other performing arts skills (drama, modeling)",
    ],
    ageGroups: [
      { level: "Teen", ageRange: "10–16 years", focus: "Speech structure, intonation, confidence speaking in public" },
    ],
    coachesNote: "The ability to speak clearly, think on your feet, and hold a room's attention is one of the most valuable skills a young person can develop — and it's entirely learnable. We work on structure, voice, and body language, but most importantly we work on the belief that what you have to say matters. Students who complete this program don't just speak better; they show up differently in school, in friendships, and in life.",
    priceNote: "",
    faq: [],
    ctaLabel: "Enquire About Class Availability",
    status: "coming_soon",
    availabilityNote: "Public Speaking is currently running as an ECA program exclusively at our partner schools. For general enrollment at Sanur or Canggu Studio, please contact us via WhatsApp — we will notify you as soon as regular classes open to the public.",
  },
};

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchClass(slug: string): Promise<ClassData | null> {
  if (!CLASS_SLUGS.includes(slug as ClassSlug)) return null;

  const staticContent = STATIC_CONTENT[slug as ClassSlug];
  const schedule = staticContent.status === "coming_soon"
    ? []
    : await fetchScheduleForClass(slug);

  return { ...staticContent, schedule };
}

// ─── generateStaticParams ─────────────────────────────────────────────────────
export async function generateStaticParams() {
  return CLASS_SLUGS.map((slug) => ({ slug }));
}

// ─── Metadata ─────────────────────────────────────────────────────────────────
type SlugProps = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: SlugProps): Promise<Metadata> {
  const { slug } = await props.params;
  const [cls, yoast] = await Promise.all([fetchClass(slug), fetchYoastMeta(slug)]);
  if (!cls) return {};

  // Canonical always points to the Next.js URL, not the WP /class/ URL
  const canonical = `https://www.evascolarotalentstudio.com/classes/${cls.slug}`;

  // Yoast values take precedence; fall back to hardcoded static content.
  //
  // Title: Yoast generates a fallback title even when no custom title has been
  // set (pattern: "{Post Title} - {Site Name}"). We detect that pattern and
  // ignore it so our descriptive static SEO title is used instead.
  // Once Yoast's _yoast_wpseo_title meta is writable on this CPT (requires
  // register_meta() in WP — see _docs/PROJECT-TRACKER.md), this guard can be removed.
  const YOAST_AUTO_TITLE_RE = /^[^|–—]+\s[-–—]\s+Eva Scolaro Talent Studio\s*$/;
  const yoastTitleIsCustom = yoast?.title && !YOAST_AUTO_TITLE_RE.test(yoast.title);

  const title       = (yoastTitleIsCustom ? yoast!.title : cls.seoTitle) ?? cls.h1;
  const description = yoast?.description ?? cls.metaDescription;
  const ogTitle     = (yoastTitleIsCustom ? yoast?.og_title : null) ?? title;
  const ogImage     = yoast?.og_image?.[0];

  // Respect Yoast robots directives; default to index/follow
  const robotsIndex  = yoast?.robots?.index  ?? "index";
  const robotsFollow = yoast?.robots?.follow ?? "follow";

  return {
    // Use `absolute` so the layout template ("%s | Eva Scolaro Talent Studio")
    // is not applied — our seoTitle already contains the studio name.
    title: { absolute: title },
    description,
    robots: {
      index:  robotsIndex  === "index",
      follow: robotsFollow === "follow",
      "max-snippet":      -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
    openGraph: {
      title:       ogTitle,
      description: yoast?.og_description ?? description,
      url:         canonical,
      siteName:    "Eva Scolaro Talent Studio",
      locale:      yoast ? "en_US" : "en_US",
      type:        "website",
      ...(ogImage && {
        images: [{
          url:    ogImage.url,
          width:  ogImage.width,
          height: ogImage.height,
        }],
      }),
    },
    twitter: {
      card:        (yoast?.twitter_card as "summary_large_image" | "summary") ?? "summary_large_image",
      title:       ogTitle,
      description: yoast?.og_description ?? description,
      ...(ogImage && { images: [ogImage.url] }),
    },
    alternates: { canonical },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ClassPage(props: SlugProps) {
  const { slug } = await props.params;
  const cls = await fetchClass(slug);
  if (!cls) notFound();

  const isComingSoon = cls.status === "coming_soon";

  const [featuredImage] = await Promise.all([fetchFeaturedImage(slug)]);

  const waMessage = encodeURIComponent(
    `Hi, I'd like to know more about the ${cls.h1} class`
  );
  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
  const waLink = `https://wa.me/${waNumber}?text=${waMessage}`;

  const jsonLd = buildClassPageSchema(cls);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <ClassHero title={cls.h1} slug={cls.slug} featuredImage={featuredImage} />

        <ClassIntro text={cls.intro} />
        <BenefitsList items={cls.benefits} />
        <AgeGroupTable groups={cls.ageGroups} />

        {isComingSoon ? (
          <ComingSoonBanner
            note={cls.availabilityNote}
            waLink={waLink}
            ctaLabel="Ask About Class Availability"
          />
        ) : (
          <>
            {cls.schedule.length > 0 && <ScheduleTabs schedule={cls.schedule} />}
            <CoachNote note={cls.coachesNote} />
            <PriceNote note={cls.priceNote} />
            <FaqAccordion items={cls.faq} />
            <CtaButton label={cls.ctaLabel} waLink={waLink} />
          </>
        )}
    </main>
  );
}
