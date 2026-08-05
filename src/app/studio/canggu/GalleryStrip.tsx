"use client";
// src/app/studio/canggu/GalleryStrip.tsx
// Accordion-expand gallery for the Canggu page — Canggu-specific photo set.

import Image from "next/image";

interface Panel { src: string; label: string; name: string; }

const PANELS: Panel[] = [
  { src: "/slideshow/hiphop-junior.webp",  label: "Hip-Hop",  name: "Junior Hip-Hop" },
  { src: "/slideshow/kpop-junior.webp",    label: "K-Pop",    name: "K-Pop Junior"   },
  { src: "/slideshow/kpop-teen.webp",      label: "K-Pop",    name: "K-Pop Teen"     },
  { src: "/slideshow/ballet-junior.webp",  label: "Ballet",   name: "Junior Ballet"  },
  { src: "/slideshow/singing-teen.webp",   label: "Singing",  name: "Teen Singing"   },
  { src: "/slideshow/singing-tots.webp",   label: "Singing",  name: "Tots Singing"   },
];

const STYLES = `
.gs-strip{display:flex;align-items:stretch;gap:6px;height:360px;width:100%;overflow:hidden}
.gs-panel{position:relative;flex:1 1 60px;min-width:48px;overflow:hidden;transition:flex .55s cubic-bezier(.4,0,.2,1);cursor:pointer;border-radius:3px}
.gs-panel:hover{flex:4 1 60px}
.gs-panel:hover .gs-img{transform:scale(1.04)}
.gs-img{transition:transform .55s cubic-bezier(.4,0,.2,1)!important;pointer-events:none;user-select:none}
.gs-caption{position:absolute;bottom:0;left:0;right:0;padding:2.5rem 1rem .9rem;background:linear-gradient(to top,rgba(0,0,0,.78) 0%,transparent 100%);opacity:0;transform:translateY(6px);transition:opacity .3s ease .1s,transform .3s ease .1s;pointer-events:none}
.gs-panel:hover .gs-caption{opacity:1;transform:translateY(0)}
.gs-caption-label{display:block;font-family:var(--font-inter,sans-serif);font-size:.6rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#B20001;margin-bottom:.2rem}
.gs-caption-name{display:block;font-family:var(--font-archivo-black,sans-serif);font-size:.9rem;color:#EFEFEF;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
`;

export default function GalleryStrip() {
  return (
    <>
      <style>{STYLES}</style>
      <div className="gs-strip" role="list" aria-label="Studio photo gallery">
        {PANELS.map((p) => (
          <div key={p.src} className="gs-panel" role="listitem">
            <Image
              src={p.src}
              alt={`${p.name} class at Eva Scolaro Talent Studio Canggu`}
              fill
              sizes="(max-width: 768px) 50vw, 16vw"
              className="gs-img"
              style={{ objectFit: "cover", objectPosition: "center" }}
              loading="lazy"
            />
            <div className="gs-caption" aria-hidden="true">
              <span className="gs-caption-label">{p.label}</span>
              <span className="gs-caption-name">{p.name}</span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
