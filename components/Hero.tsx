"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, MotionConfig } from "framer-motion";
import BookButton from "@/components/BookButton";
import type { Dict, Locale } from "@/lib/i18n";

const SLIDE_MS = 6000;

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero({
  locale,
  dict,
  images,
}: {
  locale: Locale;
  dict: Dict;
  images: string[];
}) {
  const slides = images.map((src, i) => ({
    src,
    alt: i === 0 ? dict.hero.imageAlt : "",
  }));
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setIndex((i) => (i + 1) % slides.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative flex min-h-[560px] flex-col overflow-hidden md:h-[78vh]">
        {/* Crossfading slideshow; the active slide slowly zooms (Ken Burns).
            All slides stay mounted so images are loaded before they fade in. */}
        {slides.map((slide, i) => (
          <motion.div
            key={slide.src}
            className="absolute inset-0"
            initial={false}
            animate={{
              opacity: i === index ? 1 : 0,
              scale: i === index ? 1.08 : 1,
            }}
            transition={{
              opacity: { duration: 1.2, ease: "easeInOut" },
              scale: { duration: 7, ease: "linear" },
            }}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-deep/70 via-deep/40 to-deep/80" />

        <div className="relative flex flex-1 items-center">
          <div className="mx-auto w-full max-w-[1200px] px-6 py-20 text-center">
            <motion.div variants={container} initial="hidden" animate="visible">
              <motion.h1
                variants={item}
                className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-6xl"
              >
                {dict.hero.title}
              </motion.h1>
              <motion.p
                variants={item}
                className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/85"
              >
                {dict.hero.subtitle}
              </motion.p>
              <motion.div
                variants={item}
                className="mx-auto mt-9 flex max-w-md flex-wrap justify-center gap-3"
              >
                <Link
                  href={`/${locale}/tours`}
                  className="w-full rounded-full bg-accent px-7 py-3 text-center font-bold text-deep transition-colors hover:bg-accent-dark hover:text-white sm:w-auto"
                >
                  {dict.hero.ctaTours}
                </Link>
                <div className="w-full sm:w-auto">
                  <BookButton label={dict.hero.ctaWrite} variant="light" />
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5, ease: "easeOut" }}
          className="relative border-t border-white/15 bg-deep/50 backdrop-blur"
        >
          <dl className="mx-auto grid max-w-[1200px] grid-cols-3 px-6 py-5">
            {dict.stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-xl font-extrabold text-accent md:text-2xl">
                  {stat.value}
                </dd>
                <dd className="mt-0.5 text-xs text-white/75 md:text-sm">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </section>
    </MotionConfig>
  );
}
