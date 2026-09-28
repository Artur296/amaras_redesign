"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

type AltitudeStop = {
  name: Record<Locale, string>;
  alt: string;
  type: string;
  xPercent: number;
};

const STOPS: AltitudeStop[] = [
  {
    name: { ru: "Ереван", hy: "Երևան", en: "Yerevan" },
    alt: "950 m",
    type: "Departure Hub",
    xPercent: 8,
  },
  {
    name: { ru: "Озеро Севан", hy: "Սևանա լիճ", en: "Lake Sevan" },
    alt: "1,900 m",
    type: "Alpine Lake",
    xPercent: 32,
  },
  {
    name: { ru: "Гора Димац", hy: "Դիմաց լեռ", en: "Mt. Dimats" },
    alt: "2,376 m",
    type: "Cliff Edge 4x4",
    xPercent: 58,
  },
  {
    name: { ru: "Вулкан Аждаак", hy: "Աժդահակ", en: "Azhdahak Crater" },
    alt: "3,597 m",
    type: "High-Altitude Summit",
    xPercent: 88,
  },
];

export default function JeepExpeditionWidget({ locale }: { locale: Locale }) {
  const [activeStop, setActiveStop] = useState(2);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-[#586EFF]/25 bg-gradient-to-br from-[#312F2F] via-[#242323] to-[#1c1b1b] p-6 text-[#FCFCF7] shadow-2xl sm:p-10">
      {/* Background topography glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#586EFF]/15 blur-[90px]" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-72 w-72 rounded-full bg-[#C7FF32]/10 blur-[90px]" />

      {/* Header Info */}
      <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
            <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-ping" />
            4x4 OFF-ROAD ARMENIA EXPEDITIONS
          </div>
          <h3 className="mt-3 text-2xl font-black tracking-tight text-[#FCFCF7] sm:text-4xl">
            {locale === "ru" && "Куда не доедет обычный транспорт"}
            {locale === "hy" && "Ուր չի հասնում սովորական տրանսպորտը"}
            {locale === "en" && "Where Ordinary Transport Cannot Reach"}
          </h3>
          <p className="mt-2 max-w-xl text-sm text-[#FCFCF7]/70 sm:text-base">
            {locale === "ru" && "Внедорожные маршруты AMARAS к кратерам потухших вулканов, альпийским каньонам и неприступным горным крепостям."}
            {locale === "hy" && "AMARAS-ի արտաճանապարհային երթուղիները դեպի հանգած հրաբուխներ, կիրճեր և անառիկ լեռնային ամրոցներ։"}
            {locale === "en" && "AMARAS off-road 4x4 journeys across extinct volcanic craters, sheer alpine ridges and remote medieval fortresses."}
          </p>
        </div>

        <Link
          href={`/${locale}/tours/jeep`}
          className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#586EFF] px-6 text-sm font-bold text-white shadow-lg shadow-[#586EFF]/25 transition-all hover:bg-[#475ce6] hover:scale-105"
        >
          {locale === "ru" ? "Смотреть все Джип-туры →" : locale === "hy" ? "Դիտել բոլոր Ջիպ-տուրերը →" : "View all 4x4 Expeditions →"}
        </Link>
      </div>

      {/* Interactive Mountain Ridge & Traversing 4x4 Jeep */}
      <div className="relative mt-12 pt-8">
        {/* SVG Mountain Profile with Interactive Altitude Graph */}
        <div className="relative h-44 w-full">
          <svg
            viewBox="0 0 1000 200"
            preserveAspectRatio="none"
            className="h-full w-full overflow-visible"
          >
            {/* Shaded Mountain Ridge */}
            <defs>
              <linearGradient id="ridgeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#586EFF" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#312F2F" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Filled Terrain Profile */}
            <path
              d="M0 180 Q100 170, 200 155 T400 120 T600 80 T800 50 L1000 35 L1000 200 L0 200 Z"
              fill="url(#ridgeGrad)"
            />

            {/* Elevation Contour Line */}
            <path
              d="M0 180 Q100 170, 200 155 T400 120 T600 80 T800 50 L1000 35"
              fill="none"
              stroke="#586EFF"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />
          </svg>

          {/* Interactive Altitude Stops */}
          {STOPS.map((stop, index) => {
            const isSelected = activeStop === index;
            return (
              <button
                key={index}
                type="button"
                onClick={() => setActiveStop(index)}
                style={{ left: `${stop.xPercent}%` }}
                className="group absolute bottom-4 -translate-x-1/2 flex flex-col items-center text-center transition-all duration-300"
              >
                {/* Waypoint Marker */}
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isSelected
                      ? "scale-110 border-[#C7FF32] bg-[#C7FF32] text-[#312F2F] shadow-lg shadow-[#C7FF32]/50"
                      : "border-[#FCFCF7]/30 bg-[#312F2F] text-[#FCFCF7] group-hover:border-[#586EFF]"
                  }`}
                >
                  <span className="text-xs font-black">{index + 1}</span>
                </div>

                {/* Waypoint Label */}
                <div className="mt-2 whitespace-nowrap">
                  <span className={`block text-xs font-extrabold ${isSelected ? "text-[#C7FF32]" : "text-[#FCFCF7]"}`}>
                    {stop.name[locale]}
                  </span>
                  <span className="block font-mono text-[11px] text-[#FCFCF7]/60">
                    {stop.alt}
                  </span>
                </div>
              </button>
            );
          })}

          {/* Animated 4x4 Jeep traversing to active waypoint */}
          <motion.div
            animate={{
              left: `${STOPS[activeStop].xPercent}%`,
              bottom: activeStop === 0 ? "55px" : activeStop === 1 ? "80px" : activeStop === 2 ? "115px" : "150px",
            }}
            transition={{ type: "spring", stiffness: 80, damping: 14 }}
            className="pointer-events-none absolute -translate-x-1/2 z-20"
          >
            {/* The 4x4 Jeep with off-road vibration */}
            <div className="animate-jeep-bounce relative h-16 w-36">
              {/* Jeep Vector */}
              <svg viewBox="0 0 250 90" className="h-full w-full overflow-visible" fill="none">
                <defs>
                  <linearGradient id="widgetBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#C7FF32" stopOpacity="0.85" />
                    <stop offset="25%" stopColor="#C7FF32" stopOpacity="0.35" />
                    <stop offset="70%" stopColor="#C7FF32" stopOpacity="0.08" />
                    <stop offset="100%" stopColor="#C7FF32" stopOpacity="0" />
                  </linearGradient>
                  <radialGradient id="widgetBulbGlow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                    <stop offset="40%" stopColor="#C7FF32" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#C7FF32" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Volumetric Soft Headlight Cone that moves with Jeep */}
                <g>
                  <path
                    d="M 154 48 L 248 14 L 248 78 Z"
                    fill="url(#widgetBeamGrad)"
                    opacity="0.4"
                  />
                  <path
                    d="M 154 48 L 248 26 L 248 68 Z"
                    fill="url(#widgetBeamGrad)"
                    opacity="0.75"
                  />
                  <ellipse cx="205" cy="74" rx="36" ry="5" fill="url(#widgetBeamGrad)" opacity="0.35" />
                </g>

                {/* Roof rack gear */}
                <rect x="52" y="16" width="60" height="4" rx="2" fill="#586EFF" />
                <rect x="56" y="8" width="22" height="8" rx="2" fill="#C7FF32" />
                <rect x="82" y="6" width="26" height="10" rx="2" fill="#FCFCF7" />
                {/* Cabin & Body */}
                <path
                  d="M48 24 L114 24 L134 44 L154 44 L156 58 L36 58 L36 40 L48 24 Z"
                  fill="#242323"
                  stroke="#FCFCF7"
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                />
                <path d="M134 44 L154 44 L156 58 L134 58 Z" fill="#586EFF" />
                {/* Headlight bulb with lens flare */}
                <circle cx="154" cy="48" r="9" fill="url(#widgetBulbGlow)" />
                <circle cx="154" cy="48" r="3" fill="#FCFCF7" />
                {/* Windows */}
                <path d="M52 28 L80 28 L80 42 L48 42 L52 28 Z" fill="#586EFF" opacity="0.4" stroke="#FCFCF7" strokeWidth="1.5" />
                <path d="M84 28 L110 28 L126 42 L84 42 Z" fill="#586EFF" opacity="0.4" stroke="#FCFCF7" strokeWidth="1.5" />
                <path d="M128 42 L128 26 L124 24" stroke="#C7FF32" strokeWidth="2.5" strokeLinecap="round" />
                <rect x="28" y="32" width="8" height="24" rx="4" fill="#1c1b1b" stroke="#FCFCF7" strokeWidth="1.5" />
                {/* Wheels */}
                <g className="animate-wheel-spin" style={{ transformOrigin: "132px 58px" }}>
                  <circle cx="132" cy="58" r="13" fill="#1c1b1b" stroke="#FCFCF7" strokeWidth="2.5" />
                  <circle cx="132" cy="58" r="6" fill="#586EFF" />
                </g>
                <g className="animate-wheel-spin" style={{ transformOrigin: "62px 58px" }}>
                  <circle cx="62" cy="58" r="13" fill="#1c1b1b" stroke="#FCFCF7" strokeWidth="2.5" />
                  <circle cx="62" cy="58" r="6" fill="#586EFF" />
                </g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
