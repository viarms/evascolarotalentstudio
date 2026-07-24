"use client";
// src/app/studio-rental/AvailabilityGrid.tsx
// Four availability info blocks — animated icons trigger on container hover.

import { useRef } from "react";
import {
  BellRingIcon,
  ZapIcon,
  CircleCheckIcon,
  MapPinCheckInsideIcon,
} from "@animateicons/react/lucide";

type IconHandle = { startAnimation: () => void; stopAnimation: () => void };

interface InfoItem {
  label: string;
  value: string;
}

const ITEMS: InfoItem[] = [
  { label: "Days",     value: "Monday – Friday" },
  { label: "Hours",    value: "10:00 – 13:00"   },
  { label: "Minimum",  value: "1 hour"           },
  { label: "Location", value: "Sanur Studio"     },
];

function InfoBlock({
  item,
  icon,
}: {
  item: InfoItem;
  icon: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#111111",
        border: "1px solid #1e1e1e",
        borderRadius: "6px",
        padding: "1.1rem 1.25rem",
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
      }}
    >
      <div style={{ flexShrink: 0, marginTop: "2px" }}>{icon}</div>
      <div>
        <p
          style={{
            fontFamily: "var(--font-inter, sans-serif)",
            fontSize: "0.65rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#555555",
            marginBottom: "0.25rem",
          }}
        >
          {item.label}
        </p>
        <p
          style={{
            fontFamily: "var(--font-archivo-black, sans-serif)",
            fontSize: "0.95rem",
            color: "#EFEFEF",
            margin: 0,
          }}
        >
          {item.value}
        </p>
      </div>
    </div>
  );
}

export default function AvailabilityGrid() {
  const bellRef    = useRef<IconHandle>(null);
  const zapRef     = useRef<IconHandle>(null);
  const checkRef   = useRef<IconHandle>(null);
  const mapPinRef  = useRef<IconHandle>(null);

  const refs = [bellRef, zapRef, checkRef, mapPinRef];

  const icons = [
    <BellRingIcon         key="bell"   ref={bellRef}   size={20} color="#B20001" isAnimated={false} />,
    <ZapIcon              key="zap"    ref={zapRef}    size={20} color="#B20001" isAnimated={false} />,
    <CircleCheckIcon      key="check"  ref={checkRef}  size={20} color="#B20001" isAnimated={false} />,
    <MapPinCheckInsideIcon key="map"   ref={mapPinRef} size={20} color="#B20001" isAnimated={false} />,
  ];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      {ITEMS.map((item, i) => (
        <div
          key={item.label}
          onMouseEnter={() => refs[i].current?.startAnimation()}
          onMouseLeave={() => refs[i].current?.stopAnimation()}
          style={{ cursor: "default" }}
        >
          <InfoBlock item={item} icon={icons[i]} />
        </div>
      ))}
    </div>
  );
}
