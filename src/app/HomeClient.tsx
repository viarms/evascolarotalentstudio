// src/app/HomeClient.tsx
// Client component — receives schedules from the server page and renders
// all GSAP animations and interactive sections.

"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

import {
  CheckIcon,
  SparklesIcon,
  BellRingIcon,
  MapPinCheckInsideIcon,
  AudioLinesIcon,
  CompassIcon,
  UserIcon,
} from "@animateicons/react/lucide";
import AboutEvaShader from "@/components/AboutEvaShader";
import AboutEvaNavyShader from "@/components/AboutEvaNavyShader";
import type { StudioSchedule } from "@/lib/types/class";
import {
  MOCK_SCHEDULE,
  LOCATION_ORDER,
  DAY_ORDER,
  PACKS,
  ABOUT_SLIDES,
} from "./home-data";

// Crossfade interval in ms
const SLIDE_INTERVAL = 4500;
const DISSOLVE_MS    = 1400;

// ─── JoinUsButton ─────────────────────────────────────────────────────────────

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
        <BellRingIcon ref={iconRef} size={18} color="#EFEFEF" isAnimated={false} />
        Join Us
      </button>
    </>
  );
}

// ─── HomeHero ─────────────────────────────────────────────────────────────────

function HomeHero() {
  const h1Ref = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = h1Ref.current;
    if (!el) return;
    const split = SplitText.create(el, { type: "words", mask: "words", aria: "hidden" });
    const tween = gsap.from(split.words, {
      yPercent: 100,
      opacity: 0,
      duration: 1.0,
      ease: "power3.out",
      stagger: 0.07,
      delay: 0.4,
    });
    return () => { tween.kill(); split.revert(); };
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center w-full overflow-hidden"
      style={{ minHeight: "100vh", background: "#121212" }}
      aria-label="Hero"
    >
      <video
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/VideoWebsiteHomepage_web.webm"
        autoPlay muted loop playsInline aria-hidden="true"
      />
      <div className="absolute inset-0 z-10" style={{ background: "rgba(0,0,0,0.85)" }} aria-hidden="true" />
      <div
        className="absolute bottom-0 left-0 right-0 z-[15]"
        style={{ height: "35%", background: "linear-gradient(to bottom, transparent 0%, #000000 100%)" }}
        aria-hidden="true"
      />
      <div className="relative z-20 flex flex-col items-center text-center px-6 py-16" style={{ gap: 0 }}>
        <div className="mb-8">
          <Image src="/logo-white.svg" alt="Eva Scolaro Talent Studio" width={180} height={98} priority />
        </div>
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
        <p className="mt-4 mb-0" style={{ fontFamily: "Inter, sans-serif", fontSize: "1em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF" }}>
          Performing arts
        </p>
        <p className="mt-0 mb-4" style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "clamp(1rem, 2.5vw, 1.6em)", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#B20001" }}>
          Builds life-long confidence
        </p>
        <p className="mb-8" style={{ fontFamily: "Inter, sans-serif", fontSize: "clamp(0.6rem, 1.2vw, 0.85em)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", maxWidth: "620px" }}>
          Join us and be part of a community where young stars are born!
        </p>
        <JoinUsButton />
      </div>
    </section>
  );
}

// ─── AboutCarousel ────────────────────────────────────────────────────────────

function AboutCarousel() {
  const [current, setCurrent]   = useState(0);
  const [next, setNext]         = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [ready, setReady]       = useState(false);
  const rafRef     = useRef<number>(0);
  const startRef   = useRef<number>(0);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(true);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => { visibleRef.current = entry.isIntersecting; },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const hold = setTimeout(() => {
      const nextSlide = (current + 1) % ABOUT_SLIDES.length;
      setNext(nextSlide);
      setProgress(0);
      startRef.current = performance.now();

      function tick(now: number) {
        if (!visibleRef.current) {
          setCurrent(nextSlide); setNext(null); setProgress(0);
          return;
        }
        const p = Math.min((now - startRef.current) / DISSOLVE_MS, 1);
        const eased = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        setProgress(eased);
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setCurrent(nextSlide); setNext(null); setProgress(0);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }, SLIDE_INTERVAL);

    return () => { clearTimeout(hold); cancelAnimationFrame(rafRef.current); };
  }, [current]);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      style={{ width: "50%", minWidth: "280px", flex: "1 1 280px", minHeight: "500px", borderRight: "2px solid #000000", position: "relative", overflow: "hidden" }}
    >
      {/* Spinner preloader */}
      <div style={{ position: "absolute", inset: 0, zIndex: 10, opacity: ready ? 0 : 1, transition: ready ? "opacity 700ms ease-out" : "none", pointerEvents: ready ? "none" : "auto", background: "#0d0808", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ position: "relative", width: 44, height: 44 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px dashed rgba(178,0,1,0.35)", animation: "spinOrbit 3s linear infinite" }} />
          <div style={{ position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#B20001", boxShadow: "0 0 6px rgba(178,0,1,0.9)", animation: "spinOrbit 3s linear infinite", transformOrigin: "50% 25px" }} />
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AudioLinesIcon size={18} color="#B20001" isAnimated />
          </div>
        </div>
      </div>

      <Image key={`cur-${current}`} src={ABOUT_SLIDES[current]} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" priority={current === 0} style={{ objectFit: "cover", objectPosition: "center", opacity: next !== null ? 1 - progress : 1, zIndex: 1, transition: "none" }} />
      {next !== null && (
        <Image key={`next-${next}`} src={ABOUT_SLIDES[next]} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" style={{ objectFit: "cover", objectPosition: "center", opacity: progress, zIndex: 2, transition: "none" }} />
      )}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)", zIndex: 3 }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "40%", background: "linear-gradient(to bottom, transparent 0%, #0d0808 100%)", zIndex: 4 }} />
    </div>
  );
}

// ─── HomeAbout ────────────────────────────────────────────────────────────────

function HomeAbout() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef    = useRef<HTMLDivElement>(null);
  const p1Ref      = useRef<HTMLParagraphElement>(null);
  const p2Ref      = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const p1 = p1Ref.current;
    const p2 = p2Ref.current;
    if (!p1 || !p2) return;
    const split = SplitText.create(p1, { type: "words", aria: "hidden" });
    const wordTween = gsap.from(split.words, { opacity: 0, duration: 2, ease: "sine.out", stagger: 0.08, paused: true });
    gsap.set(p2, { opacity: 0 });
    const staggerEnd = (split.words.length - 1) * 0.08 + 2;
    const fadeTween = gsap.to(p2, { opacity: 1, duration: 2.2, ease: "power1.out", delay: staggerEnd * 0.7, paused: true });
    const trigger = ScrollTrigger.create({
      trigger: p1, start: "top 85%", once: true,
      onEnter: () => { wordTween.play(); fadeTween.play(); },
    });
    return () => { trigger.kill(); wordTween.kill(); fadeTween.kill(); split.revert(); };
   
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ background: "#0d0808", borderTop: "2px solid #000000", minHeight: "25rem", display: "flex", flexDirection: "row", flexWrap: "wrap" }}
      aria-label="About"
    >
      <AboutCarousel />
      <div ref={textRef} className="flex flex-col justify-center" style={{ width: "50%", flex: "1 1 280px", padding: "3em 3.5em", gap: "1.5em", position: "relative", overflow: "hidden", background: "#0d0808" }}>
        <AboutEvaShader />
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{ height: "50%", background: "linear-gradient(to bottom, transparent 0%, #0d0808 100%)", zIndex: 1 }} aria-hidden="true" />
        <h2 style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "3px", color: "#888888", margin: "0 0 1.25em 0", position: "relative", zIndex: 2 }}>
          About Eva Scolaro Talent Studio
        </h2>
        <p
          ref={p1Ref}
          aria-label="Eva Scolaro Talent Studio is a premier performing arts institution dedicated to nurturing the creativity and talents of young minds aged 3 to 16 years old. Our studio offers a comprehensive range of performing arts classes, including singing, dancing, acting, and modeling."
          style={{ fontFamily: "Inter, sans-serif", fontSize: "1.25em", color: "#FFFFFF", margin: 0, lineHeight: 1.6, position: "relative", zIndex: 2 }}
        >
          Eva Scolaro Talent Studio is a premier performing arts institution dedicated to nurturing the creativity
          and talents of young minds aged 3 to 16 years old. Our studio offers a comprehensive range of performing
          arts classes, including singing, dancing, acting, and modeling.
        </p>
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

// ─── BookFreeTrialButton ──────────────────────────────────────────────────────

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
        .bft-btn:active { transform: translateY(0) scale(0.98); }
      `}</style>
      <button
        type="button"
        className="bft-btn"
        onClick={() => window.dispatchEvent(new Event("open-book-trial-modal"))}
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <SparklesIcon ref={iconRef} size={20} color="#EFEFEF" isAnimated={false} />
        Book Free Trial
      </button>
    </>
  );
}

// ─── HomePricing ──────────────────────────────────────────────────────────────

function HomePricing() {
  const headingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 30 });
    const trigger = ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }),
    });
    return () => trigger.kill();
   
  }, []);

  return (
    <section id="pricing" style={{ background: "#080808", borderTop: "2px solid #000000", padding: "4em 0" }} aria-label="Pricing">
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>
        <div ref={headingRef} style={{ paddingBottom: "2em", textAlign: "center" }}>
          <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "2em", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", margin: 0 }}>
            Pricing
          </h2>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0", marginBottom: "-20px" }}>
          {PACKS.map((pack) => (
            <div key={pack.name} style={{ flex: "1 1 200px", padding: "0 1em", marginBottom: "20px" }}>
              <h3 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "1.5em", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", textAlign: "center", margin: "0 0 5px 0" }}>
                {pack.name}
              </h3>
              <p style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "2em", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#B20001", textAlign: "center", margin: 0 }}>
                {pack.price}
              </p>
              <p style={{ fontFamily: "Roboto, sans-serif", fontSize: "1em", fontWeight: 400, color: "#EFEFEF", textAlign: "center", margin: "0 0 1.5em 0", paddingBottom: "1.5em" }}>
                /class
              </p>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "center" }}>
                {pack.features.map((f, i) => (
                  <li key={i} style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8em", color: "#EFEFEF", padding: "7.5px 0", borderBottom: i < pack.features.length - 1 ? "1px dashed #A5A5A5" : "none", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4em" }}>
                    <CheckIcon size={13} color="#B20001" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{ marginTop: "-20px", padding: "0 1em" }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, textAlign: "center" }}>
            <li style={{ fontFamily: "Inter, sans-serif", fontSize: "0.8em", color: "#EFEFEF", padding: "7.5px 0" }}>
              *Additional IDR 200k/class for term concert costume
            </li>
          </ul>
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2em" }}>
          <BookFreeTrialButton />
        </div>
      </div>
    </section>
  );
}

// ─── HomeTimetable ────────────────────────────────────────────────────────────

function HomeTimetable({ schedules }: { schedules: StudioSchedule[] }) {
  const liveData = schedules.length > 0;
  const tabs = liveData ? schedules.map((s) => s.location) : LOCATION_ORDER;

  const [activeTab, setActiveTab] = useState<string>(tabs[0]);
  const headingRef = useRef<HTMLDivElement>(null);
  const panelRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    gsap.set(el, { opacity: 0, y: 30 });
    const trigger = ScrollTrigger.create({
      trigger: el, start: "top 88%", once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }),
    });
    return () => trigger.kill();
   
  }, []);

  function changeTab(loc: string) {
    if (loc === activeTab) return;
    const panel = panelRef.current;
    if (!panel) { setActiveTab(loc); return; }
    gsap.to(panel, {
      opacity: 0, duration: 0.2, ease: "power2.in",
      onComplete: () => {
        setActiveTab(loc);
        gsap.fromTo(panel, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
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
    <section id="timetable" style={{ background: "#080808", borderTop: "2px solid #000000", padding: "3em 0 1em" }} aria-label="Timetable">
      <div style={{ maxWidth: 1140, margin: "0 auto", padding: "0 1.5em" }}>
        <div ref={headingRef}>
          <h2 style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "2em", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", textAlign: "center", margin: 0 }}>
            Timetable
          </h2>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", color: "#DDDDDD", textAlign: "center", margin: "0 0 2em 0", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4em" }}>
            <AudioLinesIcon size={15} color="#DDDDDD" />
            Class Schedule
            <AudioLinesIcon size={15} color="#DDDDDD" />
          </div>
        </div>

        {/* Location tabs */}
        <div role="tablist" aria-label="Studio locations" style={{ display: "flex", flexWrap: "wrap", gap: "0.5em", marginBottom: 0 }}>
          {tabs.map((loc) => {
            const isActive = activeTab === loc;
            return (
              <button
                key={loc}
                role="tab"
                aria-selected={isActive}
                onClick={() => changeTab(loc)}
                style={{ background: "transparent", fontFamily: "Inter, sans-serif", fontWeight: 400, color: "#EFEFEF", border: `1px solid ${isActive ? "#B20001" : "#EFEFEF"}`, borderRadius: "0px", padding: "0.5em 2em", cursor: "pointer", marginBottom: "0.5em", transition: "border-color 0.2s" }}
              >
                {loc}
              </button>
            );
          })}
        </div>

        {/* Tab panel */}
        <div ref={panelRef} role="tabpanel" style={{ padding: "2em 0 4em 0" }}>
          {/* Desktop: horizontal scrolling grid */}
          <div className="hidden sm:block" style={{ overflowX: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${days.length}, minmax(130px, 1fr))`, gap: 0, minWidth: days.length > 4 ? `${days.length * 130}px` : undefined }}>
              {days.map((day) => (
                <div key={day} style={{ display: "flex", flexDirection: "column" }}>
                  <div style={{ background: "#1a1a1a", border: "1px solid #2a2a2a", padding: "0.6em 0.75em", textAlign: "center" }}>
                    <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#EFEFEF", margin: 0 }}>{day}</div>
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

          {/* Mobile: stacked day blocks */}
          <div className="flex sm:hidden flex-col gap-4">
            {days.map((day) => (
              <div key={day} style={{ border: "1px solid #2a2a2a", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ background: "#1a1a1a", padding: "0.6em 1em" }}>
                  <div style={{ fontFamily: "Inter, sans-serif", fontSize: "0.75em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#EFEFEF", margin: 0 }}>{day}</div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
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

// ─── DirectionButton ──────────────────────────────────────────────────────────

function DirectionButton({ href, title }: { href: string; title: string }) {
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
          display: inline-flex; align-items: center; gap: 0.45em;
          font-family: Inter, sans-serif; font-size: 0.88em; font-weight: 500;
          text-transform: uppercase; letter-spacing: 2px; color: #DDDDDD;
          background: transparent; border: 1px solid #DDDDDD; border-radius: 2px;
          padding: 0.5em 1.5em; text-decoration: none; cursor: pointer;
          transition: background 0.22s ease, border-color 0.22s ease, color 0.22s ease;
          will-change: transform;
        }
        .dir-btn:hover { background: #B20001; border-color: rgba(178,0,1,0.6); color: #EFEFEF; animation: dir-lift 0.38s ease forwards; }
        .dir-btn:active { transform: translateY(0) scale(0.98); }
      `}</style>
      <a href={href} title={title} target="_blank" rel="noopener noreferrer" className="relative z-10 dir-btn"
        onMouseEnter={() => iconRef.current?.startAnimation()}
        onMouseLeave={() => iconRef.current?.stopAnimation()}
      >
        <MapPinCheckInsideIcon ref={iconRef} size={14} color="#DDDDDD" isAnimated={false} />
        Direction
      </a>
    </>
  );
}

// ─── HomeLocation ─────────────────────────────────────────────────────────────

function HomeLocation() {
  const studios = [
    { name: "Canggu", photo: "https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/photo-2024-studio-11_orig.webp", mapsUrl: "https://maps.app.goo.gl/WWUYTzG88ofyuYJ78", mapsTitle: "Get directions to Eva Scolaro Talent Studio – Canggu, Bali", studioUrl: "/studio/canggu", studioTitle: "Eva Scolaro Talent Studio Canggu – Performing Arts Classes in Canggu, Bali" },
    { name: "Sanur",  photo: "https://www.evascolarotalentstudio.com/wp-content/uploads/2024/10/studio-sanur-hd_orig.webp",         mapsUrl: "https://maps.app.goo.gl/Esoa9MtswJxsoN3R7", mapsTitle: "Get directions to Eva Scolaro Talent Studio – Sanur, Bali",  studioUrl: "/studio/sanur",  studioTitle: "Eva Scolaro Talent Studio Sanur – Performing Arts Classes in Sanur, Bali"  },
  ];

  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const titles = Array.from(container.querySelectorAll<HTMLElement>("h2"));
    gsap.set(titles, { opacity: 0, y: 28 });
    const trigger = ScrollTrigger.create({
      trigger: container, start: "top 85%", once: true,
      onEnter: () => gsap.to(titles, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out", stagger: 0.15 }),
    });
    return () => trigger.kill();
   
  }, []);

  return (
    <section ref={containerRef} style={{ background: "#121212", borderTop: "1px solid #000000", minHeight: "400px", display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "1px" }} aria-label="Studio locations">
      {studios.map((studio) => (
        <div key={studio.name} className="flex flex-col items-center justify-center" style={{ flex: "1 1 300px", minHeight: "400px", backgroundImage: `url('${studio.photo}')`, backgroundSize: "cover", backgroundPosition: "center", position: "relative", gap: "10px" }}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.5)" }} aria-hidden="true" />
          <h2 className="relative z-10" style={{ fontFamily: '"Archivo Black", sans-serif', fontSize: "2em", fontWeight: 400, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", margin: 0, textAlign: "center" }}>
            {studio.name}
          </h2>
          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href={studio.studioUrl} title={studio.studioTitle}
              style={{ display: "inline-flex", alignItems: "center", gap: "0.45em", fontFamily: "Inter, sans-serif", fontSize: "0.88em", fontWeight: 600, textTransform: "uppercase", letterSpacing: "2px", color: "#EFEFEF", background: "#B20001", border: "1px solid rgba(178,0,1,0.7)", borderRadius: "2px", padding: "0.5em 1.5em", textDecoration: "none", transition: "background 0.22s ease, border-color 0.22s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#8f0001"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "#8f0001"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "#B20001"; (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(178,0,1,0.7)"; }}
            >
              <CompassIcon size={14} color="#EFEFEF" />
              Explore Studio
            </a>
            <DirectionButton href={studio.mapsUrl} title={studio.mapsTitle} />
          </div>
        </div>
      ))}
    </section>
  );
}

// ─── HomeAboutEva ─────────────────────────────────────────────────────────────

function HomeAboutEva() {
  const quoteRef   = useRef<HTMLQuoteElement>(null);
  const bioP1Ref   = useRef<HTMLParagraphElement>(null);
  const bioP2Ref   = useRef<HTMLParagraphElement>(null);
  const bioP3Ref   = useRef<HTMLParagraphElement>(null);
  const spotifyRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const quote = quoteRef.current;
    if (quote) {
      gsap.set(quote, { opacity: 0, y: 24 });
      ScrollTrigger.create({
        trigger: quote, start: "top 88%", once: true,
        onEnter: () => gsap.to(quote, { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" }),
      });
    }

    const p1 = bioP1Ref.current;
    const p2 = bioP2Ref.current;
    const p3 = bioP3Ref.current;
    const spotify = spotifyRef.current;
    if (!p1 || !p2 || !p3) return;

    const split = SplitText.create([p1, p2, p3], { type: "words", aria: "hidden" });
    const totalWords = split.words.length;
    const totalDur = (totalWords - 1) * 0.08 + 2;
    const tween = gsap.from(split.words, { opacity: 0, duration: 2, ease: "sine.out", stagger: 0.08, paused: true });

    if (spotify) gsap.set(spotify, { opacity: 0, y: 10 });
    const tweenSpotify = spotify
      ? gsap.to(spotify, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: totalDur, paused: true })
      : null;

    const trigger = ScrollTrigger.create({
      trigger: p1, start: "top 85%", once: true,
      onEnter: () => { tween.play(); tweenSpotify?.play(); },
    });

    return () => { trigger.kill(); tween.kill(); tweenSpotify?.kill(); split.revert(); };
   
  }, []);

  return (
    <section style={{ background: "#222222", display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", borderTop: "1px solid #000000" }} aria-label="About Eva Scolaro">
      {/* Left: Eva photo + quote */}
      <div style={{ flex: "1 1 300px", width: "50%", minHeight: "100vh", backgroundImage: "url('https://www.evascolarotalentstudio.com/wp-content/uploads/2025/06/Eva-Scolaro.webp')", backgroundSize: "cover", backgroundPosition: "center", position: "relative", display: "flex", flexDirection: "column", justifyContent: "flex-end", borderRight: "1px solid #000000", overflow: "hidden" }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.5) 50%, #000000 100%)" }} aria-hidden="true" />
        <blockquote ref={quoteRef} className="relative z-10" style={{ padding: "3em", margin: 0, fontFamily: "var(--font-alumni-sans), sans-serif", fontStyle: "italic", fontSize: "23px", color: "#EFEFEF", lineHeight: 1.4 }}>
          &ldquo;There are no words to describe how proud I am to offer students the full performing art
          collective at the studio. Our students build skills for the rest of their lives. It is a
          true gift to share this.&rdquo;
        </blockquote>
      </div>

      {/* Right: About text */}
      <div style={{ flex: "1 1 300px", width: "50%", padding: "3em 3.5em", display: "flex", flexDirection: "column", justifyContent: "center", gap: 0, position: "relative", overflow: "hidden" }}>
        <AboutEvaNavyShader />
        <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ fontFamily: "Inter, sans-serif", fontSize: "1em", fontWeight: 200, textTransform: "uppercase", letterSpacing: "1px", color: "#EFEFEF", margin: "0 0 0.5em 0", paddingBottom: "0.5em", display: "flex", alignItems: "center", gap: "0.4em" }}>
            <UserIcon size={15} color="#EFEFEF" />
            About
          </div>
          <h2 style={{ fontFamily: "var(--font-licorice), cursive", fontSize: "3em", fontWeight: 400, letterSpacing: "1px", color: "#EFEFEF", margin: "0 0 1em 0" }}>
            Eva Scolaro
          </h2>
          <p ref={bioP1Ref} aria-label="With over 28 years in the entertainment industry, Eva Scolaro isn't just a performer—she's a force of nature. Fueled by passion and an unstoppable creative spirit, Eva brings unforgettable energy to every stage she steps on. From the age of 5, Eva has been captivating audiences, lighting up stages across Indonesia and Southeast Asia with her undeniable talent." style={{ fontFamily: "Inter, sans-serif", fontSize: "1em", fontWeight: 300, color: "#DDDDDD", margin: "0 0 1em 0", lineHeight: 1.6 }}>
            With over 28 years in the entertainment industry, Eva Scolaro isn&apos;t just a performer—she&apos;s a
            force of nature. Fueled by passion and an unstoppable creative spirit, Eva brings unforgettable energy
            to every stage she steps on. From the age of 5, Eva has been captivating audiences, lighting up stages
            across Indonesia and Southeast Asia with her undeniable talent.
          </p>
          <p ref={bioP2Ref} aria-label="She's not just a performer, she's an experience that touches your soul. Fresh off recording her first solo album in Spain, Eva has just released her latest single, Deeper Love. You can now dive into her latest work on Spotify and iTunes." style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#DDDDDD", margin: "0 0 1em 0", lineHeight: 1.6 }}>
            She&apos;s not just a performer, she&apos;s an experience that touches your soul. Fresh off recording
            her first solo album in Spain, Eva has just released her latest single, &quot;Deeper Love&quot;.
            You can now dive into her latest work on Spotify and iTunes.
          </p>
          <p ref={bioP3Ref} aria-label="Eva has made her dream full circle. Bringing the knowledge and experience of performing arts that she had as a child, which has proven true and brought her so much success in her career to date. To now share this with the younger generations so they may experience the joy of the stage." style={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#DDDDDD", margin: "0 0 1.5em 0", lineHeight: 1.6 }}>
            Eva has made her dream full circle. Bringing the knowledge and experience of performing arts
            that she had as a child, which has proven true and brought her so much success in her career
            to date. To now share this with the younger generations so they may experience the joy of the stage.
          </p>
          <a
            ref={spotifyRef}
            href="https://open.spotify.com/artist/1Cnhz3VFCwxhAgrvrCOXlT?si=YW5CRx18SCCOkJ-TphkHPg"
            target="_blank" rel="noopener noreferrer"
            style={{ display: "inline-flex", alignSelf: "flex-start", alignItems: "center", gap: "0.5em", fontFamily: "Inter, sans-serif", fontSize: "0.85em", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", color: "#EFEFEF", textDecoration: "none", border: "1px solid rgba(239,239,239,0.25)", borderRadius: "2px", padding: "0.55em 1.2em", background: "rgba(255,255,255,0.04)", transition: "background 0.2s, border-color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(30,215,96,0.12)"; e.currentTarget.style.borderColor = "#1DB954"; gsap.to(e.currentTarget, { y: -3, scale: 1.03, duration: 0.2, ease: "power2.out" }); }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = "rgba(239,239,239,0.25)"; gsap.to(e.currentTarget, { y: 0, scale: 1, duration: 0.25, ease: "power2.out" }); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#1DB954" aria-hidden="true">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Listen Now
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── HomeClient (default export) ─────────────────────────────────────────────

export default function HomeClient({ schedules }: { schedules: StudioSchedule[] }) {
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
