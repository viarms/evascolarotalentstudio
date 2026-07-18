# Class Page Content Draft — Eva Scolaro Talent Studio

**Last updated:** 18 July 2026
**Project status as of this update:**

All 9 class pages are implemented and build successfully. Content status by layer:

| Layer | Status | Source |
|---|---|---|
| Static content (intro, benefits, age groups, FAQ, CTA) | ✅ Live in code | `src/app/classes/[slug]/page.tsx` → `STATIC_CONTENT` |
| Schedule data | ✅ Fetched live from WP REST API | `/wp/v2/event` CPT, ISR 1h |
| SEO metadata (title, description) | ✅ In code; Yoast override ready | `STATIC_CONTENT` → `generateMetadata()`, overridden by `fetchYoastMeta()` |
| WP class CPT posts + Yoast seed | ⏳ Run `npm run seed:classes` | `scripts/seed-classes.mjs` |
| Hero images | ⚠️ Placeholder | Solid brand-red background — needs per-class images uploaded to WP Media |
| Static content in ACF/WP CMS | ⏳ Not yet | Intro, benefits, FAQ still hardcoded in `page.tsx` |

**Schedule note:** Schedules shown below were drawn from the timetable displayed on the website at the time of the audit (17 July 2026). The live site now fetches schedule data automatically from the WordPress `event` CPT — so schedule tables below are reference only, not the source of truth. Double-check coaches and times before each term.

---

## 1. Hip-Hop

**URL:** `/classes/hip-hop/`
**SEO Title:** Hip-Hop Classes for Kids in Bali (Sanur & Canggu) | Eva Scolaro Talent Studio
**Meta Description:** Hip-hop classes for children aged 4–16 in Sanur & Canggu. Experienced coaches, Tots/Junior/Teen levels. Free trial, no registration fee!

**H1:** Hip-Hop Classes for Kids in Sanur & Canggu

**Intro:**
Hip-hop is one of the most popular classes at Eva Scolaro Talent Studio. Kids learn energetic choreography, musical rhythm, and urban dance style in a fun and supportive environment — perfect for beginners and confident performers alike.

**Why join this class:**
- Builds coordination, rhythm, and physical strength
- Boosts self-confidence through end-of-term stage performances
- Classes are grouped by age so content matches ability
- Part of the studio's annual concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Tots | 3–5 years | Introduction to basic movement, rhythm, confidence in front of the mirror |
| Junior | 6–9 years | More complex choreography, teamwork |
| Teen | 10–16 years | Advanced technique, personal style, performance preparation |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Monday | Tots Hip-Hop | 14:30–15:15 | Novie |
| Monday | Junior Hip-Hop | 15:30–16:30 | Novie |
| Monday | Teen Hip-Hop | 16:30–17:30 | Novie |
| Thursday | Tots Hip-Hop | 14:30–15:15 | Faith |
| Thursday | Junior Hip-Hop | 15:30–16:30 | Faith |
| Thursday | Teen Hip-Hop | 16:30–17:30 | Faith |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Tuesday | Tots Hip-Hop | 15:30–16:15 | Tya |
| Wednesday | Junior Hip-Hop | 15:30–16:30 | Novie |
| Wednesday | Junior/Teen Hip-Hop | 16:30–17:30 | Novie |
| Thursday | Tots Hip-Hop | 15:30–16:15 | Tya |
| Saturday | Tots Hip-Hop | 12:00–12:45 | Faith |

**Coaches:** Novie, Faith, Tya — our hip-hop coaches have experience teaching children across all age groups and regularly choreograph end-of-term concert routines.

**Pricing:** Starting from Rp110,000/class (30-class/3-style package) — see the [full pricing page](#) for all package options.

**FAQ:**
- *Does my child need prior dance experience?* No, the Tots & Junior classes are designed for beginners.
- *What uniform is required?* Studio t-shirt uniform (included in the package); concert costume is separate (+Rp200,000/class during term concert).
- *Can we try a class before enrolling?* Yes, we offer a free trial class with no registration fee.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 2. Ballet

**URL:** `/classes/ballet/`
**SEO Title:** Children's Ballet Classes in Bali — Sanur & Canggu | Eva Scolaro Talent Studio
**Meta Description:** Ballet classes for children aged 3+ in Sanur & Canggu, guided by experienced coaches. Tots through Junior/Teen levels. Book a free trial now!

**H1:** Ballet Classes for Kids in Sanur & Canggu

**Intro:**
Our ballet classes introduce the fundamentals of classical technique in a fun and engaging way — building posture, flexibility, discipline, and graceful movement from an early age.

**Why join this class:**
- A strong technical dance foundation applicable to any style later on
- Trains posture, flexibility, and discipline
- A gentle and supportive class environment for young children
- Opportunity to perform in the end-of-term concert in a tutu costume

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Tots | 3–5 years | Basic movement, flexibility, listening to music |
| Junior/Teen | 6–16 years | Foot & hand position technique, movement combinations, expression |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Tuesday | Tots Ballet 1 | 15:00–15:45 | Vivian |
| Tuesday | Tots Ballet 2 | 15:45–16:30 | Vivian |
| Tuesday | Junior/Teen Ballet | 16:30–17:30 | Vivian |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Friday | Tots Ballet | 15:30–16:15 | Rahma |
| Friday | Junior Ballet | 16:15–17:15 | Rahma |
| Saturday | Tots Ballet | 10:00–10:45 | Rahma |
| Saturday | Junior Ballet | 11:00–12:00 | Rahma |

**Coaches:** Vivian (Sanur), Rahma (Canggu) — focused on safe, age-appropriate foundational ballet technique.

**Pricing:** Starting from Rp110,000/class — packages include the option of a Tutu Ballet uniform.

**FAQ:**
- *What age can children start ballet?* Tots classes accept children from around age 3.
- *Are special ballet shoes required?* Yes, they are recommended; ask for details at the trial class or see the [dancewear page](#).

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 3. Singing

**URL:** `/classes/singing/`
**SEO Title:** Vocal / Singing Classes for Kids in Bali | Eva Scolaro Talent Studio
**Meta Description:** Singing classes for children and teens in Sanur & Canggu. Vocal training, singing technique, and end-of-term concert performances. Free trial!

**H1:** Singing (Vocal) Classes for Kids in Sanur & Canggu

**Intro:**
Singing classes help children find their voice — literally and figuratively. From basic breathing technique to solo performances on stage, kids learn to sing with confidence.

**Why join this class:**
- Trains foundational vocal technique (breathing, pitch, voice control)
- Builds confidence performing solo and in groups
- Great for kids who love singing and those who want to be braver on stage
- Perform at the studio's end-of-term concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Tots | 3–5 years | Pitch introduction, singing together, performance courage |
| Junior | 6–9 years | Basic vocal technique, simple song practice |
| Teen | 10–16 years | Advanced voice control, solo performance preparation |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Friday | Tots Singing | 14:30–15:15 | Kuna |
| Friday | Junior Singing | 15:30–16:30 | Kuna |
| Friday | Teen Singing | 16:30–17:30 | Kuna |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Monday | Tots Singing 1 | 15:15–16:00 | Kuna |
| Monday | Tots Singing 2 | 16:00–16:45 | Kuna |
| Monday | Junior Singing | 16:45–17:45 | Kuna |
| Monday | Teen Singing | 17:45–18:45 | Andini |

**Coaches:** Kuna, Andini — teaching foundational vocal technique through to stage performance preparation.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *My child has never had vocal lessons — can they join?* Yes, the Tots & Junior classes are designed for complete beginners.
- *Are there solo performances?* There are opportunities to perform solo or in groups at the end-of-term concert.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 4. K-Pop Dance

**URL:** `/classes/kpop-dance/`
**SEO Title:** K-Pop Dance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio
**Meta Description:** K-Pop dance classes for children and teens in Sanur & Canggu. Trending choreography, Junior & Teen levels. Book a free trial now!

**H1:** K-Pop Dance Classes for Kids & Teens in Sanur & Canggu

**Intro:**
The favorite class for K-Pop fans! Children and teenagers learn the latest K-Pop-style choreography, training their stamina, formation teamwork, and idol-worthy stage presence.

**Why join this class:**
- Choreography follows the latest K-Pop song trends
- Trains stamina, formation coordination, and stage presence
- Hugely popular among primary school-aged children and teens
- Group performance at the end-of-term concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Junior | 6–9 years | Basic formation movement, following K-Pop song rhythms |
| Teen | 10–16 years | Complex choreography, idol-style stage expression |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Monday | Junior K-Pop | 16:30–17:30 | Faith |
| Monday | Teen K-Pop | 17:30–18:30 | Faith |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Tuesday | K-Pop Dance | 17:30–18:30 | Faith |

**Coach:** Faith — stays up to date with the latest K-Pop choreography to keep content relevant to what kids love.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *Do you have to be a K-Pop fan to join?* Not required, but it's most fun for kids who already enjoy K-Pop music.
- *Is there a Tots (toddler) class?* K-Pop Dance currently starts at the Junior level; contact us via WhatsApp to check availability of a Tots K-Pop class in the current term.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 5. Jazz Dance

**URL:** `/classes/jazz-dance/`
**SEO Title:** Jazz Dance Classes for Kids in Bali | Eva Scolaro Talent Studio
**Meta Description:** Jazz dance classes for kids in Sanur & Canggu. Trains expression, technique, and stage confidence. Free trial, no registration fee.

**H1:** Jazz Dance Classes for Kids in Sanur & Canggu

**Intro:**
Jazz dance blends technique, musicality, and self-expression. This class is perfect for kids who love dynamic movement and want to explore a more expressive style of dance.

**Why join this class:**
- Trains flexibility, core strength, and musicality
- An expressive and enjoyable dance style
- A solid foundation for children interested in musical theatre
- Perform at the end-of-term concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Tots | 3–5 years | Basic movement, facial & body expression |
| Junior | 6–9 years | Movement combinations, basic jazz technique |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Wednesday | Tots Jazz Dance | 15:00–15:45 | Putri |
| Wednesday | Junior Jazz Dance | 15:45–16:45 | Putri |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Tuesday | Jazz Dance | 16:15–17:15 | Putri |

**Coach:** Putri — brings an energetic jazz style that's easy and fun for kids to follow.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *What's the difference between Jazz Dance and Hip-Hop?* Jazz places greater emphasis on technique, musicality, and body expression; Hip-Hop leans more toward urban rhythm and freestyle.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 6. Drama & Musical Theatre

**URL:** `/classes/drama-musical-theatre/`
**SEO Title:** Drama & Musical Theatre Classes for Kids in Bali | Eva Scolaro Talent Studio
**Meta Description:** Drama & musical theatre classes for children and teens in Sanur & Canggu. Trains acting, expression, and stage confidence. Free trial!

**H1:** Drama & Musical Theatre Classes for Kids in Sanur & Canggu

**Intro:**
This class combines acting (drama) and musical performance, helping children express themselves, build empathy through character work, and perform with confidence in front of an audience.

**Why join this class:**
- Trains expression, vocal delivery, and physical movement all at once
- Builds confidence speaking and performing in public
- Develops imagination and storytelling skills
- Preparation for a musical theatre performance at the end-of-term concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Junior | 6–9 years | Basic acting exercises, role play |
| Teen | 10–16 years | Musical theatre, character acting, stage vocal work |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Wednesday | Teen Drama | 16:45–17:45 | Andini |
| Thursday | Junior Drama | 16:30–17:30 | Andini |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Thursday | Musical Theatre | 16:15–17:15 | Putri |
| Friday | Junior/Teen Drama | 17:30–18:30 | Andini |

**Coaches:** Andini, Putri — experienced in guiding children through acting and musical theatre for stage performances.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *Can shy children join this class?* This class is designed specifically to help shy children build confidence gradually.
- *What's the difference between Drama and Musical Theatre?* Drama focuses on acting & dialogue; Musical Theatre combines acting, singing, and movement/dance in a single production.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 7. Modeling

**URL:** `/classes/modeling/`
**SEO Title:** Modeling Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio
**Meta Description:** Modeling classes for children and teens in Sanur & Canggu. Trains catwalk, posture, and confidence in front of the camera. Free trial!

**H1:** Modeling Classes for Kids & Teens in Sanur & Canggu

**Intro:**
Modeling classes train children and teens in posture, catwalk technique, and confidence in front of the camera and on stage — skills that are useful far beyond the modeling world itself.

**Why join this class:**
- Trains posture and confident walking
- Builds comfort performing in front of a camera/on stage
- Trains facial expression and body language
- Opportunity to appear at studio concerts & photo/documentation sessions

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Tots/Junior | 3–9 years | Posture introduction, basic walking, confidence in front of others |
| Teen | 10–16 years | Catwalk technique, posing, camera expression |

**Schedule & Location (reference — live data from WP):**

*Sanur Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Friday | Teen Modeling | 15:30–16:30 | Cintya |
| Friday | Junior/Tots Modeling | 16:30–17:30 | Cintya |

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Thursday | Tots Modeling | 14:30–15:15 | Cintya |
| Thursday | Junior/Teen Modeling | 17:30–18:30 | Cintya |

**Coach:** Cintya — guides age-appropriate modeling fundamentals with an emphasis on confidence, not appearance pressure.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *Does this class guarantee my child becomes a professional model?* The primary goal of the class is to build self-confidence and good posture — not to promise a modeling career.
- *Are there photo sessions?* The studio documents performance moments and activities; for formal photo sessions, ask for more details via WhatsApp.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 8. Breakdance (RnB Breakdance)

**URL:** `/classes/breakdance/`
**SEO Title:** Breakdance Classes for Kids & Teens in Bali | Eva Scolaro Talent Studio
**Meta Description:** Breakdance classes for children and teens in Canggu. Trains strength, agility, and freestyle style. Free trial, no registration fee!

**H1:** Breakdance Classes for Kids & Teens in Canggu

**Intro:**
Breakdance classes introduce the foundational movements of breaking — from footwork to freezes — in a safe and structured environment, building physical strength alongside personal style.

**Why join this class:**
- Trains muscle strength, agility, and balance
- Develops freestyle style and personal confidence
- Great for energetic kids who enjoy physical challenges
- Perform at the end-of-term concert

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Junior/Teen | 6–16 years | Basic breaking movements, footwork, freezes, freestyle |

**Schedule & Location (reference — live data from WP):**

*Canggu Studio*
| Day | Class | Time | Coach |
|---|---|---|---|
| Saturday | Junior/Teen Breakdance | 13:00–14:00 | Faith |

> Note: Breakdance is currently only available at Canggu Studio. The page `priceNote` already mentions this. If Sanur demand grows, add classes there and the live schedule will update automatically.

**Coach:** Faith.

**Pricing:** Starting from Rp110,000/class.

**FAQ:**
- *Does my child need to be flexible before joining?* No, classes start from basic movements and progress gradually according to each child's ability.

**CTA:** Book Free Trial Class — WhatsApp +62 821 4628 4464

---

## 9. Public Speaking (Teen)

**URL:** `/classes/public-speaking/`
**SEO Title:** Public Speaking Classes for Teens in Bali | Eva Scolaro Talent Studio
**Meta Description:** Public speaking classes for teenagers — builds confidence speaking in public. Part of the Eva Scolaro Talent Studio performing arts program.

**H1:** Public Speaking Classes for Teens

**Status:** `coming_soon` — page renders `ComingSoonBanner` instead of schedule/price/FAQ.

**Intro:**
Public speaking classes help teenagers build the confidence to speak in front of others — a skill that reaches far beyond the stage, from school presentations to everyday life.

**Why join this class:**
- Trains speech structure, intonation, and body language
- Reduces nerves when performing or speaking in public
- Complements other performing arts skills (drama, modeling)

**Age Groups:**
| Level | Approx. Age | Focus |
|---|---|---|
| Teen | 10–16 years | Speech structure, intonation, confidence speaking in public |

**Current availability:**
> Public Speaking is currently running as an ECA (Extracurricular Activity) program exclusively at our partner schools. For general enrollment at Sanur or Canggu Studio, please contact us via WhatsApp — we will notify you as soon as regular classes open to the public.

**Coach:** Andini.

**CTA:** Enquire About Class Availability — WhatsApp +62 821 4628 4464

**To activate:** Change `status: "coming_soon"` → `"active"` in the `STATIC_CONTENT` map in `src/app/classes/[slug]/page.tsx`. Add schedule entries to the WP `event` CPT and they will appear automatically.

---

## Implementation Status & Remaining Tasks

### ✅ Done
- All 9 class pages implemented at `/classes/[slug]` with ISR (1h revalidation)
- Schedule data auto-fetched from WP REST API `/wp/v2/event` — no hardcoded tables in frontend
- ScheduleTabs component: dynamic tabs per location (Sanur / Canggu / any future location)
- Static content (intro, benefits, age groups, FAQ, CTA) in `STATIC_CONTENT` map
- SEO metadata via `generateMetadata()` — Yoast values override static content when available
- Schema.org `Course` JSON-LD on every class page
- `seed-classes.mjs` script ready to push WP class CPT posts + Yoast SEO (`npm run seed:classes`)
- `public-speaking` renders `ComingSoonBanner` correctly
- All other 8 classes render active layout
- Proxy rewrite: all non-`/classes/*` routes fall back to WordPress origin

### ⏳ Remaining before launch

1. **Run seed script** — `npm run seed:classes` — requires `WP_ADMIN_USER` + `WP_ADMIN_PASS` (Application Password) in `.env.local`. Creates/updates 9 WP class CPT posts and sets Yoast SEO title + meta description on each.

2. **Hero images** — `ClassHero` currently shows a solid brand-red background with a TODO comment. Upload one hero image per class to WP Media, then replace the placeholder in `ClassHero.tsx` with `next/image` (the TODO comment in the component shows exactly how).

3. **Business decision: Public Speaking** — decide whether to open it to the public at Sanur/Canggu this term, or keep `coming_soon`. One line change in `page.tsx` to flip.

4. **ACF field group (optional, Phase 2)** — intro, benefits, age groups, FAQ are hardcoded in `page.tsx`. If the client needs to edit content without a developer, set up the ACF `classFields` group in WordPress and migrate `STATIC_CONTENT` to WP GraphQL queries. The type definitions in `src/lib/types/class.ts` already mirror the intended ACF structure.

5. **Validate live schedule data** — once the seed script has run, check each class page on the live site to confirm the WP `event` CPT entries are being matched correctly (keyword matching in `SLUG_TO_KEYWORDS` in `classQueries.ts`). In particular verify `DRAMA`, `MUSICAL THEATRE`, and `MODELING` keywords match the actual `event_name` values in the database.

6. **Breakdance Sanur** — only one location currently. Add Sanur events in WP if demand grows; no frontend changes needed.
