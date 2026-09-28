"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

export default function JeepPreloader() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Only show full preloader once per session to avoid annoying recurring visitors
    const hasSeen = typeof window !== "undefined" && sessionStorage.getItem("amaras_seen_intro");
    if (hasSeen) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("amaras_seen_intro", "true");
          }, 350);
          return 100;
        }
        // Rapid energetic increment
        const step = Math.floor(Math.random() * 14) + 6;
        return Math.min(prev + step, 100);
      });
    }, 70);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          key="jeep-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#312F2F] text-[#FCFCF7]"
        >
          {/* Background Ambient Glow */}
          <div className="pointer-events-none absolute h-[400px] w-[400px] rounded-full bg-[#586EFF]/10 blur-[120px]" />
          <div className="pointer-events-none absolute -bottom-20 right-10 h-[300px] w-[300px] rounded-full bg-[#C7FF32]/10 blur-[100px]" />

          {/* Center Stage: Logo + Jeep + Progress */}
          <div className="relative z-10 flex flex-col items-center px-6 text-center">
            {/* Official Logo */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Image
                src="/images/amaras-logo.png"
                alt="AMARAS"
                width={190}
                height={38}
                priority
                className="h-9 w-auto object-contain"
              />
              <span className="mt-2 block text-[11px] font-bold uppercase tracking-[0.3em] text-[#C7FF32]">
                Armenia Expedition & Tours
              </span>
            </motion.div>

            {/* Expedition 4x4 Jeep SVG Animation */}
            <div className="relative mb-6 h-32 w-80">
              {/* Mountain Silhouette in the background */}
              <svg
                viewBox="0 0 320 80"
                className="absolute -top-4 left-0 h-20 w-full text-[#FCFCF7]/10"
                fill="none"
              >
                <path
                  d="M0 65 L40 40 L80 55 L130 20 L180 50 L220 28 L270 58 L320 45 L320 80 L0 80 Z"
                  fill="currentColor"
                />
                <path
                  d="M130 20 L145 32 L160 28 L170 36"
                  stroke="#C7FF32"
                  strokeWidth="1.5"
                  strokeOpacity="0.4"
                />
              </svg>

              {/* The 4x4 Off-Road Jeep */}
              <div className="animate-jeep-bounce relative z-10 h-full w-full">
                <svg
                  viewBox="0 0 250 90"
                  className="h-full w-full overflow-visible"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient id="preloaderBeamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#C7FF32" stopOpacity="0.85" />
                      <stop offset="25%" stopColor="#C7FF32" stopOpacity="0.35" />
                      <stop offset="70%" stopColor="#C7FF32" stopOpacity="0.08" />
                      <stop offset="100%" stopColor="#C7FF32" stopOpacity="0" />
                    </linearGradient>
                    <radialGradient id="preloaderBulbGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
                      <stop offset="40%" stopColor="#C7FF32" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#C7FF32" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  {/* Volumetric Soft Headlight Cone that moves with Jeep */}
                  <g>
                    <path
                      d="M 154 48 L 248 14 L 248 78 Z"
                      fill="url(#preloaderBeamGrad)"
                      opacity="0.4"
                    />
                    <path
                      d="M 154 48 L 248 26 L 248 68 Z"
                      fill="url(#preloaderBeamGrad)"
                      opacity="0.75"
                    />
                    <ellipse cx="205" cy="74" rx="36" ry="5" fill="url(#preloaderBeamGrad)" opacity="0.35" />
                  </g>

                  {/* Roof Rack & Expedition Baggage */}
                  <rect x="52" y="16" width="60" height="4" rx="2" fill="#586EFF" />
                  <rect x="56" y="8" width="22" height="8" rx="2" fill="#C7FF32" opacity="0.9" />
                  <rect x="82" y="6" width="26" height="10" rx="2" fill="#FCFCF7" opacity="0.8" />
                  <path d="M54 20 L58 24 M75 20 L75 24 M95 20 L95 24 M110 20 L108 24" stroke="#586EFF" strokeWidth="2" />

                  {/* Jeep Body Shell */}
                  {/* Cabin */}
                  <path
                    d="M48 24 L114 24 L134 44 L154 44 L156 58 L36 58 L36 40 L48 24 Z"
                    fill="#312F2F"
                    stroke="#FCFCF7"
                    strokeWidth="2.5"
                    strokeLinejoin="round"
                  />
                  {/* Front hood & grille */}
                  <path d="M134 44 L154 44 L156 58 L134 58 Z" fill="#586EFF" />
                  {/* Headlight bulb with lens flare */}
                  <circle cx="154" cy="48" r="9" fill="url(#preloaderBulbGlow)" />
                  <circle cx="154" cy="48" r="3" fill="#FCFCF7" />

                  {/* Windows */}
                  <path d="M52 28 L80 28 L80 42 L48 42 L52 28 Z" fill="#586EFF" opacity="0.4" stroke="#FCFCF7" strokeWidth="1.5" />
                  <path d="M84 28 L110 28 L126 42 L84 42 Z" fill="#586EFF" opacity="0.4" stroke="#FCFCF7" strokeWidth="1.5" />

                  {/* Snorkel */}
                  <path d="M128 42 L128 26 L124 24" stroke="#C7FF32" strokeWidth="2.5" strokeLinecap="round" />

                  {/* Spare wheel on rear */}
                  <rect x="28" y="32" width="8" height="24" rx="4" fill="#242323" stroke="#FCFCF7" strokeWidth="1.5" />

                  {/* Wheel Arches */}
                  <path d="M48 58 A 15 15 0 0 1 76 58" stroke="#FCFCF7" strokeWidth="2.5" fill="#242323" />
                  <path d="M118 58 A 15 15 0 0 1 146 58" stroke="#FCFCF7" strokeWidth="2.5" fill="#242323" />

                  {/* Front Wheel */}
                  <g className="animate-wheel-spin" style={{ transformOrigin: "132px 58px" }}>
                    <circle cx="132" cy="58" r="13" fill="#242323" stroke="#FCFCF7" strokeWidth="2.5" />
                    <circle cx="132" cy="58" r="6" fill="#586EFF" />
                    {/* Wheel spokes */}
                    <line x1="132" y1="46" x2="132" y2="70" stroke="#C7FF32" strokeWidth="1.5" />
                    <line x1="120" y1="58" x2="144" y2="58" stroke="#C7FF32" strokeWidth="1.5" />
                  </g>

                  {/* Rear Wheel */}
                  <g className="animate-wheel-spin" style={{ transformOrigin: "62px 58px" }}>
                    <circle cx="62" cy="58" r="13" fill="#242323" stroke="#FCFCF7" strokeWidth="2.5" />
                    <circle cx="62" cy="58" r="6" fill="#586EFF" />
                    {/* Wheel spokes */}
                    <line x1="62" y1="46" x2="62" y2="70" stroke="#C7FF32" strokeWidth="1.5" />
                    <line x1="50" y1="58" x2="74" y2="58" stroke="#C7FF32" strokeWidth="1.5" />
                  </g>
                </svg>
              </div>

              {/* Road / Topography Ground Line */}
              <svg viewBox="0 0 240 10" className="absolute -bottom-1 left-0 w-full overflow-visible">
                <line
                  x1="0"
                  y1="5"
                  x2="240"
                  y2="5"
                  stroke="#FCFCF7"
                  strokeOpacity="0.2"
                  strokeWidth="2"
                  className="animate-mountain-trail"
                />
              </svg>
            </div>

            {/* Progress Bar & Percentage */}
            <div className="w-56 space-y-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#FCFCF7]/10">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#586EFF] to-[#C7FF32]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#FCFCF7]/60">
                <span>EXPEDITION READY</span>
                <span className="text-[#C7FF32]">{progress}%</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
