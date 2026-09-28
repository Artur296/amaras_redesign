"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function TourGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const validImages = images.filter(Boolean);
  const [currentIndex, setCurrentIndex] = useState(0);

  if (validImages.length === 0) {
    return null;
  }

  if (validImages.length === 1) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#EAE9E0] shadow-sm bg-black/5">
        <Image
          src={validImages[0]}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />
      </div>
    );
  }

  const prev = () =>
    setCurrentIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  const next = () =>
    setCurrentIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));

  return (
    <div className="space-y-3">
      {/* Main Slide Stage */}
      <div className="group relative aspect-[16/10] overflow-hidden rounded-3xl border border-[#EAE9E0] bg-black shadow-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0"
          >
            <Image
              src={validImages[currentIndex]}
              alt={`${title} - slide ${currentIndex + 1}`}
              fill
              priority={currentIndex === 0}
              sizes="(max-width: 1024px) 100vw, 65vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>

        {/* Counter Badge */}
        <div className="absolute bottom-4 right-4 z-10 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-bold text-white tracking-widest">
          {currentIndex + 1} / {validImages.length}
        </div>

        {/* Navigation Arrows */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous photo"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:bg-[#586EFF] hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next photo"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all duration-200 hover:bg-[#586EFF] hover:scale-110 active:scale-95 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Thumbnails Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {validImages.map((src, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 ${
              currentIndex === i
                ? "border-[#586EFF] scale-105 shadow-md"
                : "border-transparent opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="96px"
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
