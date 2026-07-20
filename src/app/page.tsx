// src/app/page.tsx
// Homepage — pixel-accurate visual match to the live WordPress/Elementor site.
// Structure and styling extracted from post-1028.css and the saved HTML.
// Static mockup: schedule uses hardcoded data; replace with fetchAllSchedules() in Step 1-3.

"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  ZapIcon,
  CheckIcon,
  RocketIcon,
  AudioLinesIcon,
  MicIcon,
  CompassIcon,
  UserIcon,
} from "@animateicons/react/lucide";
import AboutEvaShader from "@/components/AboutEvaShader";
import AboutEvaNavyShader from "@/components/AboutEvaNavyShader";

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "6282146284464";
const WA_JOIN   = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to join Eva Scolaro Talent Studio!")}`;
const WA_TRIAL  = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi, I'd like to book a free trial class!")}`;



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

const LOCATION_ORDER = ["Sanur Studio", "Canggu Studio", "AIS School CCAs", "Dyatmika School ECAs"];
const DAY_ORDER      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];



// ─── Hero ─────────────────────────────────────────────────────────────────────
// Dark bg with 85% black overlay, ESTS SVG logo, centered text stack, Join Us CTA
// Source: elementor-element-50c1893 (min-height:100vh, overlay 0.85)
//         headings: c5bd5cf (1em Inter 600 uppercase), 18b3370 (3em Archivo Black uppercase),
//         9f14ff9 (1.6em Archivo Black uppercase brand-red), 9e14629 (1em Inter 600 uppercase)

function HomeHero() {
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
      <div className="relative z-20 flex flex-col items-center text-center px-6 py-16" style={{ gap: 0 }}>
        {/* ESTS wordmark SVG — same as footer white logo */}
        <div className="mb-8">
          <Image src="/logo-white.svg" alt="Eva Scolaro Talent Studio" width={180} height={98} priority />
        </div>

        {/* "Bali's #1 Performing Arts Studio for Kids in SANUR & CANGGU!" */}
        {/* 3em Archivo Black uppercase #EFEFEF */}
        <h1
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
            fontSize: "clamp(0.7rem, 1.5vw, 1em)",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "1px",
            color: "#EFEFEF",
            maxWidth: "620px",
          }}
        >
          Join us and be part of a community where young stars are born!
        </p>

        {/* Join Us CTA — dark semi-transparent, Archivo Black 1.2em, 1px border #222 */}
        <a
          href={WA_JOIN}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block transition-colors duration-300"
          style={{
            background: "rgba(0,0,0,0.39)",
            fontFamily: '"Archivo Black", sans-serif',
            fontSize: "1.2em",
            fontWeight: 400,
            color: "#EFEFEF",
            border: "1px solid #222222",
            borderRadius: "1px",
            padding: "0.5em 1.2em",
            textDecoration: "none",
            animation: "ctaPulse 2.5s ease-in-out infinite",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#B20001")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(0,0,0,0.39)")}
        >
          <span style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
            <ZapIcon size={18} color="#EFEFEF" />
            Join Us
          </span>
        </a>
      </div>
    </section>
  );
}



// ─── About carousel photos ────────────────────────────────────────────────────
// 5 best shots from the gallery (2026/07 batch, selected by filesize / content)
const ABOUT_SLIDES = [
  "https://www.evascolarotalentstudio.com/wp-content/uploads/2026/07/KWA9474.webp",
  "https://www.evascolarotalentstudio.com/wp-content/uploads/2026/07/KWA9194.webp",
  "https://www.evascolarotalentstudio.com/wp-content/uploads/2026/07/KWA9360.webp",
  "https://www.evascolarotalentstudio.com/wp-content/uploads/2026/07/KWA9350.webp",
  "https://www.evascolarotalentstudio.com/wp-content/uploads/2026/07/KWA9322.webp",
];

// Crossfade interval in ms
const SLIDE_INTERVAL = 4000;

function AboutCarousel() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev]       = useState<number | null>(null);
  const [fading, setFading]   = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const next = (current + 1) % ABOUT_SLIDES.length;
      setPrev(current);
      setFading(true);
      // after the CSS transition completes, retire the prev layer
      const cleanup = setTimeout(() => {
        setPrev(null);
        setFading(false);
        setCurrent(next);
      }, 900); // matches transition duration below
      return () => clearTimeout(cleanup);
    }, SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [current]);

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
      {/* Render up to two layers: outgoing (fading out) + incoming (always opaque) */}
      {ABOUT_SLIDES.map((src, i) => {
        const isCurrent = i === current;
        const isPrev    = i === prev;
        if (!isCurrent && !isPrev) return null;
        return (
          <div
            key={src}
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url('${src}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              opacity: isPrev && fading ? 0 : 1,
              transition: isPrev ? "opacity 0.9s ease-in-out" : "none",
              zIndex: isPrev ? 1 : 2,
            }}
          />
        );
      })}
      {/* 75% black overlay — sits above all slides */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          zIndex: 3,
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
  return (
    <section
      style={{
        background: "#121212",
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
        className="flex flex-col justify-center"
        style={{
          width: "50%",
          flex: "1 1 280px",
          padding: "3em 3.5em",
          gap: "1.5em",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* WebGL mesh-drift shader — same as About Eva section, sits behind everything */}
        <AboutEvaShader />

        {/* Bottom scrim — fades from transparent at top to solid black at the section edge,
            layered above the shader but below the text */}
        <div
          className="absolute bottom-0 left-0 right-0 pointer-events-none"
          style={{ height: "50%", background: "linear-gradient(to bottom, transparent 0%, #121212 100%)", zIndex: 1 }}
          aria-hidden="true"
        />

        {/* Text content — above both shader and scrim */}
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25em", color: "#FFFFFF", margin: 0, lineHeight: 1.6, position: "relative", zIndex: 2 }}>
          Eva Scolaro Talent Studio is a premier performing arts institution dedicated to nurturing the creativity
          and talents of young minds aged 3 to 16 years old. Our studio offers a comprehensive range of performing
          arts classes, including singing, dancing, acting, and modeling.
        </p>
        <p style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#EFEFEF", margin: 0, lineHeight: 1.6, position: "relative", zIndex: 2 }}>
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

function HomePricing() {
  return (
    <section
      id="pricing"
      style={{
        background: "#121212",
        borderTop: "2px solid #000000",
        padding: "4em 0",
      }}
      aria-label="Pricing"
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>

        {/* Section heading */}
        <div style={{ paddingBottom: "2em", textAlign: "center" }}>
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
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0", marginBottom: "-20px" }}>
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

        {/* Book Free Trial CTA */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
          <a
            href={WA_TRIAL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block transition-colors duration-300"
            style={{
              background: "rgba(178,0,1,0.5)",
              fontFamily: "Inter, sans-serif",
              fontSize: "1.5em",
              fontWeight: 800,
              color: "#EFEFEF",
              border: "5px solid rgba(239,239,239,0.75)",
              borderRadius: "1px",
              padding: "0.4em 1.5em",
              textDecoration: "none",
              display: "inline-block",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#B20001")}
            onMouseLeave={e => (e.currentTarget.style.background = "rgba(178,0,1,0.5)")}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.4em" }}>
              <RocketIcon size={20} color="#EFEFEF" />
              Book Free Trial
            </span>
          </a>
        </div>
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

function HomeTimetable() {
  const [activeTab, setActiveTab] = useState<string>(LOCATION_ORDER[0]);
  const [panelKey, setPanelKey] = useState(0);

  function changeTab(loc: string) {
    setActiveTab(loc);
    setPanelKey((k) => k + 1);
  }

  const items = MOCK_SCHEDULE[activeTab] ?? [];
  const byDay: Record<string, typeof items> = {};
  for (const item of items) {
    if (!byDay[item.day]) byDay[item.day] = [];
    byDay[item.day].push(item);
  }
  const days = DAY_ORDER.filter((d) => byDay[d]);

  return (
    <section
      id="timetable"
      style={{
        background: "#121212",
        borderTop: "2px solid #000000",
        padding: "3em 0 1em",
      }}
      aria-label="Timetable"
    >
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>

        {/* "TIMETABLE" */}
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
          {LOCATION_ORDER.map((loc) => {
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

        {/* Tab panel — day columns */}
        <div
          key={panelKey}
          role="tabpanel"
          style={{
            padding: "2em 0 4em 0",
            animation: "fadeIn 0.25s ease-out both",
            overflowX: "auto",
          }}
        >
          {/* Column grid: one column per day that has classes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${days.length}, minmax(140px, 1fr))`,
              gap: "0",
              minWidth: days.length > 5 ? `${days.length * 140}px` : undefined,
            }}
          >
            {days.map((day) => (
              <div key={day} style={{ display: "flex", flexDirection: "column" }}>

                {/* Day header */}
                <div
                  style={{
                    background: "#1a1a1a",
                    border: "1px solid #2a2a2a",
                    padding: "0.6em 0.75em",
                    textAlign: "center",
                  }}
                >
                  <h2 style={{
                    fontFamily: "Inter, sans-serif",
                    fontSize: "0.75em",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "2px",
                    color: "#EFEFEF",
                    margin: 0,
                  }}>
                    {day}
                  </h2>
                </div>

                {/* Classes for this day */}
                {byDay[day].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#111111" : "#141414",
                      border: "1px solid #1f1f1f",
                      borderTop: "none",
                      padding: "0.65em 0.75em",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.3em",
                    }}
                  >
                    <span style={{
                      fontFamily: '"Archivo Black", sans-serif',
                      fontSize: "0.72em",
                      fontWeight: 400,
                      color: "#EFEFEF",
                      textTransform: "uppercase",
                      lineHeight: 1.3,
                    }}>
                      {item.name}
                    </span>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.7em",
                      color: "#AAAAAA",
                    }}>
                      {item.time}
                    </span>
                    <span style={{
                      fontFamily: "Inter, sans-serif",
                      fontSize: "0.68em",
                      color: "#888888",
                    }}>
                      {item.coach}
                    </span>
                  </div>
                ))}
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

  return (
    <section
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
              animation: "fadeIn 0.7s ease-out both",
            }}
          >
            {studio.name}
          </h2>

          {/* Direction button */}
          <a
            href={studio.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-block transition-colors duration-300"
            style={{
              background: "#121212",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.88em",
              fontWeight: 500,
              textTransform: "uppercase",
              letterSpacing: "2px",
              color: "#DDDDDD",
              border: "1px solid #DDDDDD",
              borderRadius: "2px",
              padding: "0.5em 1.5em",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.45em",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "#B20001")}
            onMouseLeave={e => (e.currentTarget.style.background = "#121212")}
          >
            <CompassIcon size={14} color="#DDDDDD" />
            Direction
          </a>
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
        style={{
          flex: "1 1 300px",
          width: "50%",
          padding: "2em",
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
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "1em",
          fontWeight: 300,
          color: "#DDDDDD",
          margin: "0 0 1em 0",
          lineHeight: 1.6,
        }}>
          With over 28 years in the entertainment industry, Eva Scolaro isn&apos;t just a performer—she&apos;s a
          force of nature. Fueled by passion and an unstoppable creative spirit, Eva brings unforgettable energy
          to every stage she steps on. From the age of 5, Eva has been captivating audiences, lighting up stages
          across Indonesia and Southeast Asia with her undeniable talent.
        </p>
        <div style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          color: "#DDDDDD",
          margin: "0 0 1em 0",
          lineHeight: 1.6,
        }}>
          She&apos;s not just a performer, she&apos;s an experience that touches your soul. Fresh off recording
          her first solo album in Spain, Eva has just released her latest single, &quot;Deeper Love&quot;.
          You can now dive into her latest work on Spotify and iTunes.{" "}
          <a
            href="https://open.spotify.com/artist/1Cnhz3VFCwxhAgrvrCOXlT"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#DDDDDD", display: "inline-flex", alignItems: "center", gap: "0.3em", verticalAlign: "middle" }}
          >
            <MicIcon size={13} color="#DDDDDD" />
            LISTEN NOW!
          </a>
        </div>
        <p style={{
          fontFamily: "Inter, sans-serif",
          fontSize: "14px",
          color: "#DDDDDD",
          margin: 0,
          lineHeight: 1.6,
        }}>
          Eva has made her dream full circle. Bringing the knowledge and experience of performing arts
          that she had as a child, which has proven true and brought her so much success in her career
          to date. To now share this with the younger generations so they may experience the joy of the stage.
        </p>
        </div>{/* end text content wrapper */}
      </div>
    </section>
  );
}



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <main>
      <HomeHero />
      <HomeAbout />
      <HomePricing />
      <HomeTimetable />
      <HomeLocation />
      <HomeAboutEva />
    </main>
  );
}
