// src/app/page.tsx
// Homepage — pixel-accurate visual match to the live WordPress/Elementor site.
// Structure and styling extracted from post-1028.css and the saved HTML.

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);
import {
  ZapIcon,
  CheckIcon,
  SparklesIcon,
  BellRingIcon,
  MapPinCheckInsideIcon,
  AudioLinesIcon,
  MicIcon,
  CompassIcon,
  UserIcon,
} from "@animateicons/react/lucide";
import AboutEvaShader from "@/components/AboutEvaShader";
import AboutEvaNavyShader from "@/components/AboutEvaNavyShader";
import type { StudioSchedule } from "@/lib/types/class";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";


// ─── Timetable mock data ──────────────────────────────────────────────────────

const MOCK_SCHEDULE: Record<string, { day: string; name: string; time: string; coach: string }[]> = {
  "Sanur Studio": [
    { day: "Monday",    name: "TOTS HIPHOP",          time: "14:30–15:15", coach: "Novie"  },
    { day: "Monday",    name: "JUNIOR HIPHOP",         time: "15:30–16:30", coach: "Novie"  },
    { day: "Monday",    name: "JUNIOR KPOP",           time: "16:30–17:30", coach: "Faith"  },
    { day: "Monday",    name: "TEEN HIPHOP",           time: "16:30–17:30", coach: "Novie"  },
    { day: "Monday",    name: "TEEN KPOP",             time: "17:30–18:30", coach: "Faith"  },
    { day: "Tuesday",   name: "TOTS BALLET 1",         time: "15:00–15:45", coach: "Vivian" },
    { day: "Tuesday",   name: "TOTS BALLET 2",         time: "15:45–16:30", coach: "Vivian" },
    { day: "Tuesday",   name: "JUNIOR TEEN BALLET",    time: "16:30–17:30", coach: "Vivian" },
    { day: "Wednesday", name: "TOTS JAZZ DANCE",       time: "15:00–15:45", coach: "Putri"  },
    { day: "Wednesday", name: "JUNIOR JAZZ DANCE",     time: "15:45–16:45", coach: "Putri"  },
    { day: "Wednesday", name: "TEEN DRAMA",            time: "16:45–17:45", coach: "Andini" },
    { day: "Thursday",  name: "TOTS HIPHOP",           time: "14:30–15:15", coach: "Faith"  },
    { day: "Thursday",  name: "JUNIOR HIPHOP",         time: "15:30–16:30", coach: "Faith"  },
    { day: "Thursday",  name: "TEEN HIPHOP",           time: "16:30–17:30", coach: "Faith"  },
    { day: "Thursday",  name: "JUNIOR DRAMA",          time: "16:30–17:30", coach: "Andini" },
    { day: "Friday",    name: "TOTS SINGING",          time: "14:30–15:15", coach: "Kuna"   },
    { day: "Friday",    name: "TEEN MODELING",         time: "15:30–16:30", coach: "Cintya" },
    { day: "Friday",    name: "JUNIOR SINGING",        time: "15:30–16:30", coach: "Kuna"   },
    { day: "Friday",    name: "JUNIOR TOTS MODELING",  time: "16:30–17:30", coach: "Cintya" },
    { day: "Friday",    name: "TEEN SINGING",          time: "16:30–17:30", coach: "Kuna"   },
  ],
  "Canggu Studio": [
    { day: "Monday",    name: "TOTS SINGING 1",            time: "15:15–16:00", coach: "Kuna"   },
    { day: "Monday",    name: "TOTS SINGING 2",            time: "16:00–16:45", coach: "Kuna"   },
    { day: "Monday",    name: "JUNIOR SINGING",            time: "16:45–17:45", coach: "Kuna"   },
    { day: "Monday",    name: "TEEN SINGING",              time: "17:45–18:45", coach: "Andini" },
    { day: "Tuesday",   name: "TOTS HIPHOP",               time: "15:30–16:15", coach: "Tya"    },
    { day: "Tuesday",   name: "JAZZ DANCE",                time: "16:15–17:15", coach: "Putri"  },
    { day: "Tuesday",   name: "KPOP DANCE",                time: "17:30–18:30", coach: "Faith"  },
    { day: "Wednesday", name: "JUNIOR HIPHOP",             time: "15:30–16:30", coach: "Novie"  },
    { day: "Wednesday", name: "JUNIOR TEEN HIPHOP",        time: "16:30–17:30", coach: "Novie"  },
    { day: "Thursday",  name: "TOTS MODELING",             time: "14:30–15:15", coach: "Cintya" },
    { day: "Thursday",  name: "TOTS HIPHOP",               time: "15:30–16:15", coach: "Tya"    },
    { day: "Thursday",  name: "MUSICAL THEATRE",           time: "16:15–17:15", coach: "Putri"  },
    { day: "Thursday",  name: "JUNIOR TEEN MODELING",      time: "17:30–18:30", coach: "Cintya" },
    { day: "Friday",    name: "TOTS BALLET",               time: "15:30–16:15", coach: "Rahma"  },
    { day: "Friday",    name: "JUNIOR BALLET",             time: "16:15–17:15", coach: "Rahma"  },
    { day: "Friday",    name: "JUNIOR TEEN DRAMA",         time: "17:30–18:30", coach: "Andini" },
    { day: "Saturday",  name: "TOTS BALLET",               time: "10:00–10:45", coach: "Rahma"  },
    { day: "Saturday",  name: "JUNIOR BALLET",             time: "11:00–12:00", coach: "Rahma"  },
    { day: "Saturday",  name: "TOTS HIPHOP",               time: "12:00–12:45", coach: "Faith"  },
    { day: "Saturday",  name: "JUNIOR TEEN BREAKDANCE",    time: "13:00–14:00", coach: "Faith"  },
  ],
  "AIS School CCAs": [
    { day: "Tuesday",  name: "TOTS & JUNIOR KPOP",          time: "14:45–15:30", coach: "Yuda"   },
    { day: "Tuesday",  name: "JUNIOR & TEENS DRAMA",        time: "14:45–15:45", coach: "Andini" },
    { day: "Tuesday",  name: "JUNIOR+ KPOP",                time: "15:30–16:30", coach: "Yuda"   },
    { day: "Thursday", name: "TOTS & JUNIOR SINGING",       time: "14:45–15:30", coach: "Kuna"   },
    { day: "Thursday", name: "JUNIOR+ SINGING",             time: "14:45–15:45", coach: "Kuna"   },
    { day: "Friday",   name: "TOTS & JUNIOR MUSICAL THEATRE", time: "14:45–15:30", coach: "Putri" },
    { day: "Friday",   name: "TOTS & JUNIOR HIPHOP",        time: "14:45–15:30", coach: "Faith"  },
    { day: "Friday",   name: "JUNIOR+ MUSICAL THEATRE",     time: "14:45–15:45", coach: "Putri"  },
    { day: "Friday",   name: "JUNIOR+ HIPHOP",              time: "14:45–15:45", coach: "Faith"  },
  ],
  "Dyatmika School ECAs": [
    { day: "Monday",    name: "JUNIOR KPOP",           time: "15:00–16:00", coach: "Yuda"   },
    { day: "Tuesday",   name: "JUNIOR HIPHOP",         time: "15:00–16:00", coach: "Faith"  },
    { day: "Wednesday", name: "TEENS PUBLIC SPEAKING", time: "15:00–16:00", coach: "Andini" },
    { day: "Friday",    name: "TEENS MODELING",        time: "15:00–16:00", coach: "Aura"   },
  ],
  "Toki Hub": [
    { day: "Wednesday", name: "TOTS JUNIOR KPOP",    time: "15:00–16:00", coach: "Faith"    },
    { day: "Wednesday", name: "TOTS JUNIOR SINGING", time: "16:00–17:00", coach: "Kuna"     },
    { day: "Friday",    name: "TOTS JUNIOR HIPHOP",  time: "16:00–17:00", coach: "Saul"     },
    { day: "Saturday",  name: "TOTS JUNIOR BALLET",  time: "16:00–17:00", coach: "Vallerie" },
  ],
};

// Location order for timetable tabs — matches HOMEPAGE_LOCATION_ORDER in classQueries.ts
const LOCATION_ORDER = ["Sanur Studio", "Canggu Studio", "AIS School CCAs", "Dyatmika School ECAs"];
const DAY_ORDER      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];



// ─── Hero ─────────────────────────────────────────────────────────────────────
// Dark bg with 85% black overlay, ESTS SVG logo, centered text stack, Join Us CTA
// Source: elementor-element-50c1893 (min-height:100vh, overlay 0.85)
//         headings: c5bd5cf (1em Inter 600 uppercase), 18b3370 (3em Archivo Black uppercase),
//         9f14ff9 (1.6em Archivo Black uppercase brand-red), 9e14629 (1em Inter 600 uppercase)

// ─── JoinUsButton ─────────────────────────────────────────────────────────────
// Flat style, thin border, micro-movement on hover.
// Icon animation triggered by button hover, not by the icon itself.

function JoinUsButton() {
  const iconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  return (
    <>
      <style>{`
        @keyframes ju-lift {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-3px) scale(1.015); }
          70%  { transform: translateY(-1px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .ju-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.4em;
          font-family: "Archivo Black", sans-serif;
          font-size: 1.2em;
          font-weight: 400;
          color: #EFEFEF;
          background: transparent;
          border: 1.5px solid rgba(34,34,34,0.9);
          border-radius: 2px;
          padding: 0.5em 1.2em;
          cursor: pointer;
          animation: ctaPulse 2.5s ease-in-out infinite;
          transition: background 0.22s ease, border-color 0.22s ease;
          will-change: transform;
        }
        .ju-btn:hover {
          background: #B20001;
          border-color: rgba(178,0,1,0.6);
          animation: ju-lift 0.38s ease forwards;
        }
        .ju-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
      <button
        type="button"
        className="ju-btn"
        onClick={() => window.dispatchEvent(new Event("open-join-us-modal"))}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <BellRingIcon
          ref={iconRef}
          size={18}
          color="#EFEFEF"
          isAnimated={false}
        />
        Join Us
      </button>
    </>
  );
}

function HomeHero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const h1Ref      = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;

    // shshaw-style masked word reveal: words rise up from below their overflow:hidden clip
    const split = SplitText.create(el, {
      type: "words",
      mask: "words",  // each word gets an overflow:hidden wrapper — cinematic reveal
      aria: "hidden",
    });

    const tween = gsap.from(split.words, {
      yPercent: 100,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.07,
      delay: 0.4,
    });

    return () => {
      tween.kill();
      split.revert();
    };
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#121212" }}
      aria-label="Hero"
    >
      {/* Video background — matches original WP site (elementor-element-50c1893) */}
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/VideoWebsiteHomepage_web.webm"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />

      {/* 85% black overlay — matches WP */}
      <div
        className="absolute inset-0 z-10"
        style={{ background: "rgba(0,0,0,0.85)" }}
        aria-hidden="true"
      />

      {/* Bottom scrim — fades video to solid black at the section edge */}
      <div
        className="absolute bottom-0 left-0 right-0 z-[15]"
        style={{ height: "35%", background: "linear-gradient(to bottom, transparent 0%, #000000 100%)" }}
        aria-hidden="true"
      />

      {/* Content */}
      <div ref={contentRef} className="relative z-20 flex flex-col items-center text-center px-6 py-16" style={{ gap: 0 }}>
        {/* ESTS wordmark SVG — same as footer white logo */}
        <div className="mb-8">
          <Image src="/logo-white.svg" alt="Eva Scolaro Talent Studio" width={180} height={98} priority />
        </div>

        {/* "Bali's #1 Performing Arts Studio for Kids in SANUR & CANGGU!" */}
        {/* 3em Archivo Black uppercase #EFEFEF */}
        <h1
          ref={h1Ref}
          aria-label="Bali's #1 Performing Arts Studio for Kids in SANUR & CANGGU!"
          className="text-white leading-tight mb-0"
          style={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: "clamp(1.4rem, 4vw, 3rem)",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#EFEFEF",
            maxWidth: "780px",
          }}
        >
          Bali&apos;s #1 Performing Arts Studio for Kids in SANUR &amp; CANGGU!
        </h1>
        {/* "Performing arts" — 1em Inter 600 uppercase #EFEFEF */}
        <p
          className="mt-4 mb-0"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1em",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#EFEFEF",
          }}
        >
          Performing arts
        </p>

        {/* "Builds life-long confidence" — 1.6em Archivo Black uppercase #B20001 */}
        <p
          className="mt-0 mb-4"
          style={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: "clamp(1rem, 2.5vw, 1.6em)",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#B20001",
          }}
        >
          Builds life-long confidence
        </p>

        {/* "Join us and be part..." — 1em Inter 600 uppercase #EFEFEF */}
        <p
          className="mb-8"
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "clamp(0.6rem, 1.2vw, 0.85em)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#EFEFEF",
            maxWidth: "620px",
          }}
        >
          Join us and be part of a community where young stars are born!
        </p>

        {/* Join Us CTA — opens registration modal */}
        <JoinUsButton />
      </div>
    </section>
  );
}



// ─── About carousel photos ────────────────────────────────────────────────────
// Class photos from the studio — showcasing the range of disciplines offered.
const ABOUT_SLIDES = [
  "/slideshow/ballet-junior.webp",
  "/slideshow/ballet-tots.webp",
  "/slideshow/drama-musical-theatre.webp",
  "/slideshow/hiphop-junior.webp",
  "/slideshow/jazz-dance.webp",
  "/slideshow/kpop-teen.webp",
  "/slideshow/modeling-junior.webp",
  "/slideshow/singing-junior.webp",
  "/slideshow/singing-teen.webp",
  "/slideshow/singing-tots.webp",
];

// Crossfade interval in ms — time each slide is fully visible
const SLIDE_INTERVAL = 4500;
// Dissolve duration in ms — both slides cross-fade simultaneously
const DISSOLVE_MS    = 1400;

function AboutCarousel() {
  const [current, setCurrent] = useState(0);
  const [next,    setNext]    = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready,   setReady]   = useState(false); // true once all images are loaded
  const rafRef  = useRef<number>(0);
  const startRef= useRef<number>(0);

  // Preload all slides; reveal carousel only after every image has loaded
  useEffect(() => {
    let loaded = 0;
    const total = ABOUT_SLIDES.length;
    const imgs: HTMLImageElement[] = [];

    ABOUT_SLIDES.forEach((src) => {
      const img = new window.Image();
      img.onload = img.onerror = () => {
        loaded += 1;
        if (loaded === total) setReady(true);
      };
      img.src = src;
      imgs.push(img);
    });

    return () => {
      // Let GC collect — nothing to explicitly cancel on HTMLImageElement
      imgs.length = 0;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;

    const hold = setTimeout(() => {
      const nextSlide = (current + 1) % ABOUT_SLIDES.length;
      setNext(nextSlide);
      setProgress(0);

      startRef.current = performance.now();

      function tick(now: number) {
        const p = Math.min((now - startRef.current) / DISSOLVE_MS, 1);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setProgress(eased);

        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(nextSlide);
          setNext(null);
          setProgress(0);
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }, SLIDE_INTERVAL);

    return () => {
      clearTimeout(hold);
      cancelAnimationFrame(rafRef.current);
    };
  }, [current, ready]);

  return (
    <div
      aria-hidden="true"
      style={{
        width: "50%",
        minWidth: "280px",
        flex: "1 1 280px",
        minHeight: "500px",
        borderRight: "2px solid #000000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Spinner preloader — shown until all images are loaded */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 10,
          opacity: ready ? 0 : 1,
          transition: ready ? "opacity 700ms ease-out" : "none",
          pointerEvents: ready ? "none" : "auto",
          background: "#0d0808",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ position: "relative", width: 44, height: 44 }}>
          {/* Spinning dashed ring */}
          <div style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "2px dashed rgba(178,0,1,0.35)",
            animation: "spinOrbit 3s linear infinite",
          }} />
          {/* Orbiting dot */}
          <div style={{
            position: "absolute",
            top: -3,
            left: "50%",
            transform: "translateX(-50%)",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#B20001",
            boxShadow: "0 0 6px rgba(178,0,1,0.9)",
            animation: "spinOrbit 3s linear infinite",
            transformOrigin: "50% 25px",
          }} />
          {/* Centre icon */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <AudioLinesIcon size={18} color="#B20001" isAnimated />
          </div>
        </div>
      </div>

      {/* Current slide */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url('${ABOUT_SLIDES[current]}')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: next !== null ? 1 - progress : 1,
          zIndex: 1,
        }}
      />

      {/* Next slide */}
      {next !== null && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url('${ABOUT_SLIDES[next]}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: progress,
            zIndex: 2,
          }}
        />
      )}
      {/* Vignette overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)",
          zIndex: 3,
        }}
      />
      {/* Bottom scrim */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "40%",
          background: "linear-gradient(to bottom, transparent 0%, #0d0808 100%)",
          zIndex: 4,
        }}
      />
    </div>
  );
}


// ─── About ────────────────────────────────────────────────────────────────────
// Source: elementor-element-fccd84d (#121212 bg, min-height:25rem, 2px top border #000)
//         Left col (860bcac): 50% width, photo bg (Term-1-2023), 75% overlay, "Join Us" btn centered
//         Right col (08c2dc2): 50% width, 2em left/right padding
//         Text: 7279e57 = 1.25em white; 2e743d2 = 14px #EFEFEF

function HomeAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const p1Ref      = useRef<HTMLParagraphElement>(null);
  const p2Ref      = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    if (!p1 || !p2) return;

    // Split first paragraph into individual words
    const split = SplitText.create(p1, { type: "words", aria: "hidden" });

    // Word stagger tween — paused until ScrollTrigger fires
    const wordTween = gsap.from(split.words, {
      opacity: 0,
      duration: 2,
      ease: "sine.out",
      stagger: 0.08,
      paused: true,
    });

    // Second paragraph invisible until stagger finishes
    gsap.set(p2, { opacity: 0 });
    // Total duration of the word stagger: last word starts at (n-1)*stagger, then runs for duration
    const staggerEnd = (split.words.length - 1) * 0.08 + 2;
    const fadeTween = gsap.to(p2, {
      opacity: 1,
      duration: 2.2,
      ease: "power1.out",
      delay: staggerEnd * 0.7,
      paused: true,
    });

    const trigger = ScrollTrigger.create({
      trigger: p1,
      start: "top 85%",
      once: true,
      onEnter: () => {
        wordTween.play();
        fadeTween.play();
      },
    });

    return () => {
      trigger.kill();
      wordTween.kill();
      fadeTween.kill();
      split.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{
        background: "#0d0808",
        borderTop: "2px solid #000000",
        minHeight: "25rem",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      }}
      aria-label="About"
    >
      {/* Left: autoplay crossfade carousel */}
      <AboutCarousel />

      {/* Right: about text */}
      <div
        ref={textRef}
        className="flex flex-col justify-center"
        style={{
          width: "50%",
          flex: "1 1 280px",
          padding: "3em 3.5em",
          gap: "1.5em",
          position: "relative",
          overflow: "hidden",
          /* Warm near-black: sits between pure black and the shader's #0a0101 base,
             reads as "dark with a hint of depth" without being #000 */
          background: "#0d0808",
        }}
      >
        {/* WebGL mesh-drift shader — same as About Eva section, sits behind everything */}
        <AboutEvaShader />

        {/* Bottom scrim — fades into the section background colour */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "50%", background: "linear-gradient(to bottom, transparent 0%, #0d0808 100%)", zIndex: 1 }}
          aria-hidden="true"
        />

        {/* First paragraph — SplitText word-stagger reveal.
            aria-label preserves screen-reader access without a visible duplicate. */}
        <p
          ref={p1Ref}
          aria-label="Eva Scolaro Talent Studio is a premier performing arts institution dedicated to nurturing the creativity and talents of young minds aged 3 to 16 years old. Our studio offers a comprehensive range of performing arts classes, including singing, dancing, acting, and modeling."
          style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25em", color: "#FFFFFF", margin: 0, lineHeight: 1.6, position: "relative", zIndex: 2 }}
        >
          Eva Scolaro Talent Studio is a premier performing arts institution dedicated to nurturing the creativity
          and talents of young minds aged 3 to 16 years old. Our studio offers a comprehensive range of performing
          arts classes, including singing, dancing, acting, and modeling.
        </p>

        {/* Second paragraph — fades in after the word stagger completes */}
        <p
          ref={p2Ref}
          style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#EFEFEF", margin: 0, lineHeight: 1.6, position: "relative", zIndex: 2 }}
        >
          With a team of experienced coaches, we create an inspiring environment where passion meets discipline,
          offering quarterly performances to showcase the incredible growth and talent of our students. Every end
          of term, we organize and host a vibrant concert showcasing the talents of our students, providing them
          with an invaluable platform to showcase their skills and creativity.
        </p>
      </div>
    </section>
  );
}



// ─── Pricing ──────────────────────────────────────────────────────────────────
// Source: elementor-element-486b9e1 (#121212 bg, 4em top/bottom padding, 2px top border #000)
//         d0bca1c: "PRICING" heading 2em Archivo Black uppercase #EFEFEF
//         Pack cols: name 1.5em Archivo Black uppercase #EFEFEF
//                    price 2em Archivo Black uppercase #B20001
//                    "/class" 1em Roboto #EFEFEF
//                    features list 0.8em #EFEFEF, dashed separator #A5A5A5
//         "Book Free Trial" btn: f3b55c5 = #B2000180 bg, 5px border #EFEFEFBF, 1.5em Inter 800

const PACKS = [
  {
    name: "Pack 1", price: "180K",
    features: ["10 classes / 1 style", "Uniform T-Shirt"],
  },
  {
    name: "Pack 2", price: "140K",
    features: ["20 classes / 2 style", "Uniform T-Shirt or Uniform Tutu Ballet"],
  },
  {
    name: "Pack 3", price: "110K",
    features: ["30 classes / 3 style", "Tutu + Shoes + Scrunchie + T-Shirt or Leotard + Shortpants + Tshirt"],
  },
];

// ─── BookFreeTrialButton ──────────────────────────────────────────────────────
// Flat style, thin border, micro-movement on hover.
// Icon animation is triggered by button hover, not by the icon itself.

function BookFreeTrialButton() {
  const iconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  return (
    <>
      <style>{`
        @keyframes bft-lift {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-3px) scale(1.015); }
          70%  { transform: translateY(-1px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .bft-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45em;
          font-family: Inter, sans-serif;
          font-size: 1.4em;
          font-weight: 800;
          color: #EFEFEF;
          background: transparent;
          border: 1.5px solid rgba(239,239,239,0.55);
          border-radius: 2px;
          padding: 0.42em 1.6em;
          cursor: pointer;
          transition: background 0.22s ease, border-color 0.22s ease;
          will-change: transform;
        }
        .bft-btn:hover {
          background: rgba(178,0,1,0.72);
          border-color: rgba(239,239,239,0.9);
          animation: bft-lift 0.38s ease forwards;
        }
        .bft-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
      <button
        type="button"
        className="bft-btn"
        onClick={() => window.dispatchEvent(new Event("open-book-trial-modal"))}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <SparklesIcon
          ref={iconRef}
          size={20}
          color="#EFEFEF"
          isAnimated={false}
        />
        Book Free Trial
      </button>
    </>
  );
}

function HomePricing() {
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const packsRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 30 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }),
    });
    return () => trigger.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={sectionRef}
      id="pricing"
      style={{
        background: "#080808",
        borderTop: "2px solid #000000",
        padding: "4em 0",
      }}
      aria-label="Pricing"
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>

        {/* Section heading */}
        <div ref={headingRef} style={{ paddingBottom: "2em", textAlign: "center" }}>
          <h2 style={{
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: "2em",
            fontWeight: 400,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#EFEFEF",
            margin: 0,
          }}>
            Pricing
          </h2>
        </div>

        {/* 3 pack columns */}
        <div ref={packsRef} style={{ display: "flex", flexWrap: "wrap", gap: "0", marginBottom: "-20px" }}>
          {PACKS.map((pack) => (
            <div key={pack.name} style={{ flex: "1 1 200px", padding: "0 1em", marginBottom: "20px" }}>
              {/* Pack name */}
              <h2 style={{
                fontFamily: '"Archivo Black", sans-serif',
                fontSize: "1.5em",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#EFEFEF",
                textAlign: "center",
                margin: "0 0 5px 0",
              }}>
                {pack.name}
              </h2>
              {/* Price */}
              <h2 style={{
                fontFamily: '"Archivo Black", sans-serif',
                fontSize: "2em",
                fontWeight: 400,
                textTransform: "uppercase",
                letterSpacing: "1px",
                color: "#B20001",
                textAlign: "center",
                margin: "0",
              }}>
                {pack.price}
              </h2>
              {/* /class */}
              <h2 style={{
                fontFamily: "Roboto, sans-serif",
                fontSize: "1em",
                fontWeight: 400,
                color: "#EFEFEF",
                textAlign: "center",
                margin: "0 0 1.5em 0",
                paddingBottom: "1.5em",
              }}>
                /class
              </h2>
              {/* Feature list with dashed separators */}
              <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "center" }}>
                {pack.features.map((f, i) => (
                  <li key={i} style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.8em",
                    color: "#EFEFEF",
                    padding: "7.5px 0",
                    borderBottom: i < pack.features.length - 1 ? "1px dashed #A5A5A5" : "none",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.4em",
                  }}>
                    <CheckIcon size={13} color="#B20001" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Fine print */}
        <div style={{ marginTop: "-20px", padding: "0 1em" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "center" }}>
            <li style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8em", color: "#EFEFEF", padding: "7.5px 0" }}>
              *Additional IDR 200k/class for term concert costume
            </li>
          </ul>
        </div>

        {/* Book Free Trial CTA — opens trial modal */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
          <BookFreeTrialButton /></div>
      </div>
    </section>
  );
}



// ─── Timetable ────────────────────────────────────────────────────────────────
// Source: elementor-element-3f09bbe (#121212 bg, 2px top border #000, pt 3em pb 1em)
//         Section headings: "TIMETABLE" 2em Archivo Black #EFEFEF, "Class Schedule" 1em Inter 600 uppercase #DDDDDD
//         Tabs (b3324fe): border 1px #EFEFEF inactive; border 1px #B20001 active; gap 2em; padding 0.5em 2em
//         Tab panel bg: #121212 (33cfa0e), inner row items from loop template (post-372)
//         Day header boxes: border 1px #DDDDDD, day name 0.8em uppercase #EFEFEF
//         Class rows: event_name, Coach: X, Start: X, End: X (from WP loop template)

function HomeTimetable({ schedules }: { schedules: StudioSchedule[] }) {
  // Build a lookup map from live data; fall back to MOCK_SCHEDULE if empty
  const liveData = schedules.length > 0;
  const tabs = liveData
    ? schedules.map((s) => s.location)
    : LOCATION_ORDER;

  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const sectionRef  = useRef<HTMLElement>(null);
  const headingRef  = useRef<HTMLDivElement>(null);
  const panelRef    = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 30 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }),
    });
    return () => trigger.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function changeTab(loc: string) {
    if (loc === activeTab) return;

    const panel = panelRef.current;
    if (!panel) {
      setActiveTab(loc);
      return;
    }

    // Fade out current panel, then swap content and fade in
    gsap.to(panel, {
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setActiveTab(loc);
        gsap.fromTo(
          panel,
          { opacity: 0 },
          { opacity: 1, duration: 0.3, ease: "power2.out" }
        );
      },
    });
  }

  const liveItems = liveData
    ? (schedules.find((s) => s.location === activeTab)?.items ?? [])
    : (MOCK_SCHEDULE[activeTab] ?? []).map((i) => ({
        day: i.day,
        className: i.name,
        timeStart: i.time.split("–")[0] ?? i.time,
        timeEnd:   i.time.split("–")[1] ?? "",
        coach:     i.coach,
      }));

  const byDay: Record<string, typeof liveItems> = {};
  for (const item of liveItems) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }
  const days = DAY_ORDER.filter((d) => byDay[d]);

  return (
    <section
      ref={sectionRef}
      id="timetable"
      style={{
        background: "#080808",
        borderTop: "2px solid #000000",
        padding: "3em 0 1em",
      }}
      aria-label="Timetable"
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>

        {/* "TIMETABLE" */}
        <div ref={headingRef}>
        <h2 style={{
          fontFamily: '"Archivo Black", sans-serif',
          fontSize: "2em",
          fontWeight: 400,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#EFEFEF",
          textAlign: "center",
          margin: "0 0 0 0",
        }}>
          Timetable
        </h2>
        {/* "Class Schedule" */}
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1em",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#DDDDDD",
          textAlign: "center",
          margin: "0 0 2em 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.4em",
        }}>
          <AudioLinesIcon size={15} color="#DDDDDD" />
          Class Schedule
          <AudioLinesIcon size={15} color="#DDDDDD" />
        </div>
        </div>

        {/* Location tabs */}
        <div
          role="tablist"
          aria-label="Studio locations"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5em",
            marginBottom: "0",
          }}
        >
          {tabs.map((loc) => {
            const isActive = activeTab === loc;
            return (
              <button
                key={loc}
                role="tab"
                aria-selected={isActive}
                onClick={() => changeTab(loc)}
                style={{
                  background: "transparent",
                  fontFamily: "Inter, sans-serif",
                  fontWeight: 400,
                  color: "#EFEFEF",
                  border: `1px solid ${isActive ? "#B20001" : "#EFEFEF"}`,
                  borderRadius: "0px",
                  padding: "0.5em 2em",
                  cursor: "pointer",
                  marginBottom: "0.5em",
                  transition: "border-color 0.2s",
                }}
              >
                {loc}
              </button>
            );
          })}
        </div>

        {/* Tab panel */}
        <div
          ref={panelRef}
          role="tabpanel"
          style={{ padding: "2em 0 4em 0" }}
        >
          {/* ── Desktop / tablet: horizontal scrolling grid ── */}
          <div className="hidden sm:block" style={{ overflowX: "auto" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${days.length}, minmax(130px, 1fr))`,
                gap: "0",
                minWidth: days.length > 4 ? `${days.length * 130}px` : undefined,
              }}
            >
              {days.map((day) => (
                <div key={day} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "0.6em 0.75em", textAlign: "center" }}>
                    <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#EFEFEF", margin: 0 }}>
                      {day}
                    </h2>
                  </div>
                  {byDay[day].map((item, i) => (
                    <div key={i} style={{ background: i % 2 === 0 ? "#111111" : "#141414", border: "1px solid #1f1f1f", borderTop: "none", padding: "0.65em 0.75em", display: "flex", flexDirection: "column", gap: "0.3em" }}>
                      <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "0.72em", color: "#EFEFEF", textTransform: "uppercase", lineHeight: 1.3 }}>{item.className}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.7em", color: "#AAAAAA" }}>{item.timeStart}–{item.timeEnd}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68em", color: "#888888" }}>{item.coach}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ── Mobile: stacked day blocks ── */}
          <div className="flex sm:hidden flex-col gap-4">
            {days.map((day) => (
              <div key={day} style={{ border: "1px solid #2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                {/* Day header */}
                <div style={{ background: "#1a1a1a", padding: "0.6em 1em" }}>
                  <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#EFEFEF", margin: 0 }}>
                    {day}
                  </h2>
                </div>
                {/* Class rows — 2-column micro-grid */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0" }}>
                  {byDay[day].map((item, i) => (
                    <div key={i} style={{ background: i % 2 === 0 ? "#111111" : "#141414", border: "1px solid #1f1f1f", padding: "0.65em 0.75em", display: "flex", flexDirection: "column", gap: "0.25em" }}>
                      <span style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "0.7em", color: "#EFEFEF", textTransform: "uppercase", lineHeight: 1.3 }}>{item.className}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.68em", color: "#AAAAAA" }}>{item.timeStart}–{item.timeEnd}</span>
                      <span style={{ fontFamily: "Inter, sans-serif", fontSize: "0.65em", color: "#888888" }}>{item.coach}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



// ─── Location ─────────────────────────────────────────────────────────────────
// Source: elementor-element-0cf1a00 (#121212 bg, min-height:400px, 2-col row, 1px top border #000)
//         Each col has a real photo background + 50% black overlay
//         eb89e4e = Canggu photo, 76838ee = Sanur photo
//         Studio name: 2em Archivo Black uppercase #EFEFEF, centered
//         "Direction" button: dark bg (#121212), 1px border #DDDDDD, Inter 500 0.88em uppercase letter-spacing 2px
//         btn hover → #B20001

// ─── DirectionButton ──────────────────────────────────────────────────────────
// Flat style, micro-movement on hover.
// MapPinCheckInsideIcon animation triggered by button hover via imperative ref.

function DirectionButton({ href }: { href: string }) {
  const iconRef = useRef<{ startAnimation: () => void; stopAnimation: () => void }>(null);

  return (
    <>
      <style>{`
        @keyframes dir-lift {
          0%   { transform: translateY(0) scale(1); }
          40%  { transform: translateY(-3px) scale(1.015); }
          70%  { transform: translateY(-1px) scale(1.01); }
          100% { transform: translateY(0) scale(1); }
        }
        .dir-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.45em;
          font-family: Inter, sans-serif;
          font-size: 0.88em;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 2px;
          color: #DDDDDD;
          background: transparent;
          border: 1px solid #DDDDDD;
          border-radius: 2px;
          padding: 0.5em 1.5em;
          text-decoration: none;
          cursor: pointer;
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
          will-change: transform;
        }
        .dir-btn:hover {
          background: #B20001;
          border-color: rgba(178,0,1,0.6);
          color: #EFEFEF;
          animation: dir-lift 0.38s ease forwards;
        }
        .dir-btn:active {
          transform: translateY(0) scale(0.98);
        }
      `}</style>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="relative z-10 dir-btn"
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <MapPinCheckInsideIcon
          ref={iconRef}
          size={14}
          color="#DDDDDD"
          isAnimated={false}
        />
        Direction
      </a>
    </>
  );
}

function HomeLocation() {
  const studios = [
    {
      name: "Canggu",
      photo: "https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/photo-2024-studio-11_orig.webp",
      mapsUrl: "https://maps.app.goo.gl/WWUYTzG88ofyuYJ78",
    },
    {
      name: "Sanur",
      photo: "https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/studio-sanur-hd_orig.webp",
      mapsUrl: "https://maps.app.goo.gl/Esoa9MtswJxsoN3R7",
    },
  ];

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const titles = Array.from(container.querySelectorAll<HTMLElement>("h2"));
    gsap.set(titles, { opacity: 0, y: 28 });
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(titles, {
        opacity: 1, y: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.15,
      }),
    });
    return () => trigger.kill();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        background: "#121212",
        borderTop: "1px solid #000000",
        minHeight: "400px",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: "1px",
      }}
      aria-label="Studio locations"
    >
      {studios.map((studio) => (
        <div
          key={studio.name}
          className="flex flex-col items-center justify-center"
          style={{
            flex: "1 1 300px",
            minHeight: "400px",
            backgroundImage: `url('${studio.photo}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            gap: "10px",
          }}
        >
          {/* 50% black overlay */}
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} aria-hidden="true" />

          {/* Name */}
          <h2
            className="relative z-10"
            style={{
              fontFamily: '"Archivo Black", sans-serif',
              fontSize: "2em",
              fontWeight: 400,
              textTransform: "uppercase",
              letterSpacing: "1px",
              color: "#EFEFEF",
              margin: 0,
              textAlign: "center",
            }}
          >
            {studio.name}
          </h2>

          {/* Direction button */}
          <DirectionButton href={studio.mapsUrl} />
        </div>
      ))}
    </section>
  );
}



// ─── About Eva ────────────────────────────────────────────────────────────────
// Source: elementor-element-a67dcfe (#222222 bg, row, justify-content:center)
//         Left col (3ac4eac): 50%, min-height:100vh, Eva Scolaro photo bg,
//                             gradient overlay: linear-gradient(180deg, #00000080 50%, #000 100%)
//                             Quote (8502a0d): Alumni Sans 23px #EFEFEF, 3em padding
//         Right col (ee85ca4): 50%, 2em padding
//                              "About" heading: Inter 1em 200 uppercase #EFEFEF
//                              "Eva Scolaro": Licorice 3em #EFEFEF
//                              Bio text: 1em 300 #DDDDDD, 14px #DDDDDD

function HomeAboutEva() {
  const photoRef   = useRef<HTMLDivElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const quoteRef   = useRef<HTMLQuoteElement>(null);
  const bioP1Ref   = useRef<HTMLParagraphElement>(null);
  const bioP2Ref   = useRef<HTMLParagraphElement>(null);
  const bioP3Ref   = useRef<HTMLParagraphElement>(null);
  const spotifyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    // ── Quote fade-in (left column) ──────────────────────────────────────────
    const quote = quoteRef.current;
    if (quote) {
      gsap.set(quote, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: quote,
        start: "top 88%",
        once: true,
        onEnter: () => gsap.to(quote, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }),
      });
    }

    // ── Bio word-stagger (right column) ─────────────────────────────────────
    const p1 = bioP1Ref.current;
    const p2 = bioP2Ref.current;
    const p3 = bioP3Ref.current;
    const spotify = spotifyRef.current;
    if (!p1 || !p2 || !p3) return;

    // Split all three into words in one call so stagger flows continuously
    const split = SplitText.create([p1, p2, p3], { type: "words", aria: "hidden" });

    const totalWords = split.words.length;
    const totalDur = (totalWords - 1) * 0.08 + 2;

    const tween = gsap.from(split.words, {
      opacity: 0,
      duration: 2,
      ease: "sine.out",
      stagger: 0.08,
      paused: true,
    });

    // Spotify button fades in after all words finish
    if (spotify) gsap.set(spotify, { opacity: 0, y: 10 });
    const tweenSpotify = spotify
      ? gsap.to(spotify, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: totalDur, paused: true })
      : null;

    const trigger = ScrollTrigger.create({
      trigger: p1,
      start: "top 85%",
      once: true,
      onEnter: () => {
        tween.play();
        tweenSpotify?.play();
      },
    });

    return () => {
      trigger.kill();
      tween.kill();
      tweenSpotify?.kill();
      split.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section
      style={{
        background: "#222222",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        borderTop: "1px solid #000000",
      }}
      aria-label="About Eva Scolaro"
    >
      {/* Left: Eva photo + quote */}
      <div
        ref={photoRef}
        style={{
          flex: "1 1 300px",
          width: "50%",
          minHeight: "100vh",
          backgroundImage: "url('https://www.evascolarotalentstudio.com/wp-content/uploads/2025/06/Eva-Scolaro.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          borderRight: "1px solid #000000",
          overflow: "hidden",
        }}
      >
        {/* Gradient overlay: top half semi-dark → solid black at bottom */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 50%, #000000 100%)" }}
          aria-hidden="true"
        />
        {/* Quote */}
        <blockquote
          ref={quoteRef}
          className="relative z-10"
          style={{
            padding: "3em",
            margin: 0,
            fontFamily: 'var(--font-alumni-sans), sans-serif',
            fontStyle: "italic",
            fontSize: "23px",
            color: "#EFEFEF",
            lineHeight: 1.4,
          }}
        >
          "There are no words to describe how proud I am to offer students the full performing art
          collective at the studio. Our students build skills for the rest of their lives. It is a
          true gift to share this."
        </blockquote>
      </div>

      {/* Right: About text */}
      <div
        ref={textRef}
        style={{
          flex: "1 1 300px",
          width: "50%",
          padding: "3em 3.5em",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 0,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* ── WebGL mesh-drift shader background ── */}
        <AboutEvaNavyShader />
        {/* ── Text content — above the shader ── */}
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>

        {/* "ABOUT" label */}
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1em",
          fontWeight: 200,
          textTransform: "uppercase",
          letterSpacing: "1px",
          color: "#EFEFEF",
          margin: "0 0 0.5em 0",
          paddingBottom: "0.5em",
          display: "flex",
          alignItems: "center",
          gap: "0.4em",
        }}>
          <UserIcon size={15} color="#EFEFEF" />
          About
        </div>
        {/* "Eva Scolaro" — Licorice font */}
        <h2 style={{
          fontFamily: 'var(--font-licorice), cursive',
          fontSize: "3em",
          fontWeight: 400,
          letterSpacing: "1px",
          color: "#EFEFEF",
          margin: "0 0 1em 0",
        }}>
          Eva Scolaro
        </h2>
        <p
          ref={bioP1Ref}
          aria-label="With over 28 years in the entertainment industry, Eva Scolaro isn't just a performer—she's a force of nature. Fueled by passion and an unstoppable creative spirit, Eva brings unforgettable energy to every stage she steps on. From the age of 5, Eva has been captivating audiences, lighting up stages across Indonesia and Southeast Asia with her undeniable talent."
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "1em",
            fontWeight: 300,
            color: "#DDDDDD",
            margin: "0 0 1em 0",
            lineHeight: 1.6,
          }}
        >
          With over 28 years in the entertainment industry, Eva Scolaro isn&apos;t just a performer—she&apos;s a
          force of nature. Fueled by passion and an unstoppable creative spirit, Eva brings unforgettable energy
          to every stage she steps on. From the age of 5, Eva has been captivating audiences, lighting up stages
          across Indonesia and Southeast Asia with her undeniable talent.
        </p>

        {/* p2 — SplitText target */}
        <p
          ref={bioP2Ref}
          aria-label="She's not just a performer, she's an experience that touches your soul. Fresh off recording her first solo album in Spain, Eva has just released her latest single, Deeper Love. You can now dive into her latest work on Spotify and iTunes."
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#DDDDDD",
            margin: "0 0 1em 0",
            lineHeight: 1.6,
          }}
        >
          She&apos;s not just a performer, she&apos;s an experience that touches your soul. Fresh off recording
          her first solo album in Spain, Eva has just released her latest single, &quot;Deeper Love&quot;.
          You can now dive into her latest work on Spotify and iTunes.
        </p>

        <p
          ref={bioP3Ref}
          aria-label="Eva has made her dream full circle. Bringing the knowledge and experience of performing arts that she had as a child, which has proven true and brought her so much success in her career to date. To now share this with the younger generations so they may experience the joy of the stage."
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
            color: "#DDDDDD",
            margin: "0 0 1.5em 0",
            lineHeight: 1.6,
          }}
        >
          Eva has made her dream full circle. Bringing the knowledge and experience of performing arts
          that she had as a child, which has proven true and brought her so much success in her career
          to date. To now share this with the younger generations so they may experience the joy of the stage.
        </p>

        {/* Spotify CTA — fades in after p3 completes */}
        <a
          ref={spotifyRef}
          href="https://open.spotify.com/artist/1Cnhz3VFCwxhAgrvrCOXlT?si=YW5CRx18SCCOkJ-TphkHPg"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignSelf: "flex-start",
            alignItems: "center",
            gap: "0.5em",
            fontFamily: "Inter, sans-serif",
            fontSize: "0.85em",
            fontWeight: 600,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#EFEFEF",
            textDecoration: "none",
            border: "1px solid rgba(239,239,239,0.25)",
            borderRadius: "2px",
            padding: "0.55em 1.2em",
            background: "rgba(255,255,255,0.04)",
            transition: "background 0.2s, border-color 0.2s",
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = "rgba(30,215,96,0.12)";
            e.currentTarget.style.borderColor = "#1DB954";
            gsap.to(e.currentTarget, { y: -3, scale: 1.03, duration: 0.2, ease: "power2.out" });
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.borderColor = "rgba(239,239,239,0.25)";
            gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" });
          }}
        >
          {/* Spotify SVG icon */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Listen Now
        </a>
        </div>{/* end text content wrapper */}
      </div>
    </section>
  );
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [schedules, setSchedules] = useState<StudioSchedule[]>([]);

  useEffect(() => {
    fetch("/api/schedules")
      .then((r) => r.json())
      .then((data: StudioSchedule[]) => setSchedules(data))
      .catch(() => { /* silently fall back to MOCK_SCHEDULE */ });
  }, []);

  return (
    <main>
      <HomeHero />
      <HomeAbout />
      <HomePricing />
      <HomeTimetable schedules={schedules} />
      <HomeLocation />
      <HomeAboutEva />
    </main>
  );
}
