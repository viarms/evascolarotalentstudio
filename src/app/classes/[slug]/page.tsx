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
import ClassBreadcrumb from "@/components/classes/ClassBreadcrumb";
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
  "drama",
  "musical-theatre",
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
    intro: "Fun, high-energy dance that helps kids feel the beat, move with confidence, and light up on stage. Our hip-hop class in Sanur and Canggu is where that energy turns into real moves.",
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
    coachesNote: "We don't just teach kids to perform. We help them believe in themselves. Every class, every rehearsal, every little moment of courage, it all leads to something we're endlessly proud of.",
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
    intro: "From their very first steps at the barre to their moment on stage, our ballet classes help children grow stronger, more graceful, and more confident, all at their own pace. Our kids' ballet class in Bali welcomes every child, whether it's their first time in ballet shoes or they already love to dance.",
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
    coachesNote: "We teach more than technique; we help kids find their confidence and grace. Whether they're a first-timer or already love to dance, there's a place for them here. Seeing a child stand a little taller with every class never gets old, and that's exactly why we do what we do.",
    priceNote: "Starting from Rp110,000/class — packages include the option of a Tutu Ballet uniform.",
    faq: [
      { question: "What age can children start ballet?", answer: "Our classes accept children aged 3-16." },
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
    intro: "Big voice or barely a whisper, every child starts somewhere, and this is the place to begin. At our kids' singing classes in Bali, we help children find their voice through breathing, pitch, and plenty of encouragement, watching them grow from nervous first notes to standing tall for a solo on stage.",
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
    coachesNote: "We believe every child has a beautiful voice, and we're here to help them find it. Whether they sing loud and proud or are still a little shy, there's a place for them here. Watching a quiet kid sing their heart out on stage never gets old, and that's exactly why we do what we do.",
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
    intro: "Got a kid who knows every move to their favorite group's latest comeback? Our kids K-Pop dance class in Sanur and Canggu is made for them. Bright lights, big energy, and the songs they already love, K-Pop class brings idol-level choreography to life, teaching sharp moves, formation teamwork, and how to command a stage, all while having an absolute blast.",
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
    coachesNote: "For us, K-Pop is never just about the choreography. It's about the friendships that form, the teamwork that clicks, and the moment a kid realizes they can really do this. We're here to cheer every step of the way, and we can't wait to dance alongside your child.",
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
    intro: "Some kids just can't keep still when music plays, always spinning, bouncing, moving to their own rhythm. Jazz class gives that energy somewhere to go. Kids learn to dance with style, control, and a little flair, building real technique while discovering their own way to move.",
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
    coachesNote: "Jazz is where we get to watch kids' personalities really come out. There's no single way to do it right, and that's the beauty of it; every child brings their own flavor to the floor. Whether they're bold from day one or still finding their groove, we're here to help them shine.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "What's the difference between Jazz Dance and Hip-Hop?", answer: "Jazz places greater emphasis on technique, musicality, and body expression; Hip-Hop leans more toward urban rhythm and freestyle." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "drama": {
    slug: "drama",
    seoTitle: "Drama Classes for Kids in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Drama classes for children and teens in Sanur & Canggu. Builds acting, expression, and stage confidence. Free trial!",
    h1: "Drama Classes for Kids in Sanur & Canggu",
    intro: "Drama class is where all that imagination finds its home. Kids get to become anyone they want: a hero, a villain, someone brand new, and somewhere in all that pretending, they discover their own voice.",
    benefits: [
      "Kids learn to speak up, express big feelings, and stand in front of others without fear.",
      "Acting sharpens creativity, quick thinking, and the confidence to try new ideas.",
      "Speaking clearly and performing helps kids feel braver at school and in everyday life.",
      "Every term ends with a live show, a proud moment they'll never forget.",
    ],
    ageGroups: [
      { level: "Junior", ageRange: "6–9 years",   focus: "Basic acting exercises, role play" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Character acting, dialogue, stage performance" },
    ],
    coachesNote: "Drama is where we watch quiet kids find their voice and lively kids learn to channel theirs. There's something magical about a child stepping into a character and realizing they're braver than they thought. Whether they love the spotlight or are still warming up to it, there's a place for them here.",
    priceNote: "Starting from Rp110,000/class.",
    faq: [
      { question: "Can shy children join this class?", answer: "This class is designed specifically to help shy children build confidence gradually." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "musical-theatre": {
    slug: "musical-theatre",
    seoTitle: "Musical Theatre Classes for Kids in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Musical theatre classes for children and teens in Sanur & Canggu. Combines acting, singing, and dancing. Free trial!",
    h1: "Musical Theatre Classes for Kids in Sanur & Canggu",
    intro: "Got a kid who sings, dances, and acts out the whole movie in one go? Musical theatre is made for them. It's the class where acting, singing, and dancing come together, and kids learn to tell a whole story with their voice, their body, and their heart.",
    benefits: [
      "Kids learn acting, singing, and dancing together, the complete performer package.",
      "They discover how to bring characters and songs to life, start to finish.",
      "Performing on stage builds courage and self-expression that show up far beyond class.",
      "Every term ends with a live show, a proud moment they'll never forget.",
    ],
    ageGroups: [
      { level: "Junior", ageRange: "6–9 years",   focus: "Basic acting exercises, songs, movement" },
      { level: "Teen",   ageRange: "10–16 years", focus: "Musical theatre, character acting, stage vocal work" },
    ],
    coachesNote: "Musical theater asks a lot of a kid: sing here, act there, and hit the choreography, and that's exactly why we love it. There's nothing like watching a child pull all three together and realize they can do it. Whether they're a natural triple threat or just starting out, there's a place for them here.",
    priceNote: "Starting from Rp110,000/class. Currently only available at Canggu Studio — contact us via WhatsApp if you're in Sanur.",
    faq: [
      { question: "Does my child need to already sing or dance to join?", answer: "Not at all — musical theatre welcomes beginners. We build all three skills together from day one." },
    ],
    ctaLabel: "Book Free Trial Class",
    status: "active",
  },

  "modeling": {
    slug: "modeling",
    seoTitle: "Modeling Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio",
    metaDescription: "Modeling classes for children and teens in Sanur & Canggu. Trains catwalk, posture, and confidence in front of the camera. Free trial!",
    h1: "Modeling Classes for Kids & Teens in Sanur & Canggu",
    intro: "Looking for a kids modeling class in Sanur or Canggu? At our studio, modeling is about so much more than looks. This is where that spark turns into real confidence. Kids learn to walk, pose, and carry themselves with ease, the kind of self-belief that stays with them long after class ends.",
    benefits: [
      "Kids learn catwalk, posing, and camera presence that make them feel sure of themselves.",
      "Our modeling class teaches posture and poise that carry into everyday life.",
      "Learning to be seen helps kids feel braver at school and in new situations.",
      "Every term at our Bali performing arts studio ends with a real stage concert.",
    ],
    ageGroups: [
      { level: "Tots/Junior", ageRange: "3–9 years",   focus: "Posture introduction, basic walking, confidence in front of others" },
      { level: "Teen",        ageRange: "10–16 years", focus: "Catwalk technique, posing, camera expression" },
    ],
    coachesNote: "Modeling, to us, has never been about appearances; it's about helping kids feel at home in their own skin. Whether they're a natural in front of the camera or still finding their confidence, there's a place for them at our Sanur and Canggu studios.",
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
    intro: "Got a kid who's always spinning, dropping, and flipping around the house? At our breakdance class in Sanur and Canggu, all that energy finally finds its groove. As one of the most high-energy programs at Eva Scolaro Talent Studio, breakdance teaches kids real footwork, freezes, and freestyle strength, and every move they master builds a little more confidence. It's the kind of class kids in Bali are always excited to come back to.",
    benefits: [
      "Kids build genuine breakdance technique from the ground up.",
      "Classes develop coordination and body control quite like breaking does.",
      "Confidence that carries everywhere.",
      "Every class at our Bali studio, the term ends on a real stage, in front of a live audience they'll never forget.",
    ],
    ageGroups: [
      { level: "Junior/Teen", ageRange: "6–16 years", focus: "Basic breaking movements, footwork, freezes, freestyle" },
    ],
    coachesNote: "There's nothing like seeing a child land a move they've worked on for weeks and light up with pride. Some come in already spinning at home, others are complete beginners, and both are equally welcome at our Sanur and Canggu studios. Breakdance is where kids get to be bold, and we love watching them go for it.",
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
    alternates: {
      canonical,
      languages: {
        "en": canonical,
      },
    },
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
      <ClassBreadcrumb current={cls.h1} />

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
            <CtaButton label={cls.ctaLabel} />
          </>
        )}
    </main>
  );
}
