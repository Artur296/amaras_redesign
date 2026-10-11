"use client";

import { motion, MotionConfig } from "framer-motion";
import type { Dict, Locale } from "@/lib/i18n";

export default function Hero({
  locale,
  dict,
  images,
}: {
  locale: Locale;
  dict: Dict;
  images: string[];
}) {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[100dvh] w-full flex-col items-center justify-center overflow-hidden bg-black text-[#FCFCF7] px-4 sm:px-6 pt-20">
        {/* Fullscreen Video Background - 100% natural, crisp, bright & vivid with poster fallback */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            poster="/images/og-amaras.jpg"
            className="h-full w-full object-cover object-center"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Hero Main Content */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1360px] flex-col items-start justify-center px-4 sm:px-6">
          <div className="max-w-4xl">
            {/* Brand pill badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 rounded-full border border-white/20 bg-black/40 px-5 py-2 backdrop-blur-md shadow-lg"
            >
              <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                Armenia • Curated Journeys
              </span>
            </motion.div>

            {/* Editorial Title - Luxury Travel typography with razor-sharp shadow */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.6 }}
              className="mt-4 sm:mt-6 font-serif text-5xl font-normal leading-[1.04] tracking-tight text-[#FCFCF7] sm:text-7xl lg:text-8xl drop-shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            >
              {dict.hero.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.6 }}
              className="mt-4 sm:mt-6 max-w-2xl text-lg font-normal leading-relaxed text-[#FCFCF7]/95 sm:text-xl lg:text-2xl drop-shadow-[0_2px_16px_rgba(0,0,0,0.85)]"
            >
              {dict.hero.subtitle}
            </motion.p>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
