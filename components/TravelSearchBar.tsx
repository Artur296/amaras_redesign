"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function TravelSearchBar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [travelClass, setTravelClass] = useState<"economy" | "business" | "first">("business");
  const [location, setLocation] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = location.trim() ? encodeURIComponent(location.trim()) : "";
    const params = new URLSearchParams();
    if (query) params.set("q", location.trim());
    if (travelClass !== "economy") params.set("class", travelClass);
    router.push(`/${locale}/tours${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const classes = [
    {
      id: "economy",
      label: locale === "ru" ? "Эконом" : locale === "hy" ? "Էկոնոմ" : "Economy",
    },
    {
      id: "business",
      label: locale === "ru" ? "Бизнес-класс" : locale === "hy" ? "Բիզնես դաս" : "Business Class",
    },
    {
      id: "first",
      label: locale === "ru" ? "Первый класс (VIP)" : locale === "hy" ? "Առաջին դաս (VIP)" : "First Class",
    },
  ];

  return (
    <section className="relative z-20 -mt-8 sm:-mt-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1240px]">
        {/* 1. Travel Class Switcher Pills (Brand colors: Lime & Blue) */}
        <div className="flex items-center justify-center gap-3 sm:gap-6 mb-4">
          {classes.map((cls) => {
            const isActive = travelClass === cls.id;
            return (
              <button
                key={cls.id}
                type="button"
                onClick={() => setTravelClass(cls.id as typeof travelClass)}
                className={`relative px-5 sm:px-8 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-black tracking-wide transition-all duration-300 ${
                  isActive
                    ? "bg-[#C7FF32] text-[#161616] shadow-[0_4px_25px_rgba(199,255,50,0.4)] scale-105"
                    : "bg-[#242323]/90 text-white/90 hover:bg-[#312F2F] hover:text-[#C7FF32] border border-white/10 shadow-sm"
                }`}
              >
                {cls.label}
              </button>
            );
          })}
        </div>

        {/* 2. Floating Capsule Search Bar in Logo Palette */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl sm:rounded-full bg-[#1A1A1A]/95 sm:bg-[#1E1E1E]/95 p-3 sm:p-3.5 sm:px-6 text-[#FCFCF7] shadow-[0_18px_50px_rgba(0,0,0,0.7)] border border-white/15 backdrop-blur-xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Field 1: Location */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF]/20 border border-[#586EFF]/40 text-[#586EFF] shadow-md">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                  {locale === "ru" ? "Направление" : locale === "hy" ? "Ուղղություն" : "Location"}
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder={
                    locale === "ru"
                      ? "Севан, Гарни, Татев..."
                      : locale === "hy"
                      ? "Սևան, Գառնի, Տաթև..."
                      : "Where You Wanna Go"
                  }
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-white placeholder-white/50 focus:outline-none"
                />
              </div>
            </div>

            <div className="hidden lg:block h-8 w-[1px] bg-white/15" />

            {/* Field 2: Travelers */}
            <div className="lg:col-span-2 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF]/20 border border-[#586EFF]/40 text-[#586EFF] shadow-md">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                  {locale === "ru" ? "Туристы" : locale === "hy" ? "Հյուրեր" : "Travelers"}
                </label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer [&>option]:text-neutral-900"
                >
                  <option value="1">1 {locale === "ru" ? "гость" : locale === "hy" ? "հյուր" : "Guest"}</option>
                  <option value="2">2 {locale === "ru" ? "гостя" : locale === "hy" ? "հյուր" : "Guests"}</option>
                  <option value="3-4">3-4 {locale === "ru" ? "гостя" : locale === "hy" ? "հյուր" : "Guests"}</option>
                  <option value="5+">5+ {locale === "ru" ? "группа" : locale === "hy" ? "խումբ" : "Group"}</option>
                </select>
              </div>
            </div>

            <div className="hidden lg:block h-8 w-[1px] bg-white/15" />

            {/* Field 3: Check In */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF]/20 border border-[#586EFF]/40 text-[#586EFF] shadow-md">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                  {locale === "ru" ? "Дата заезда" : locale === "hy" ? "Սկիզբ" : "Check In"}
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            <div className="hidden lg:block h-8 w-[1px] bg-white/15" />

            {/* Field 4: Check Out */}
            <div className="lg:col-span-3 flex items-center gap-3 px-3 py-2 rounded-2xl bg-white/5 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF]/20 border border-[#586EFF]/40 text-[#586EFF] shadow-md">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <label className="block text-[11px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                  {locale === "ru" ? "Дата выезда" : locale === "hy" ? "Ավարտ" : "Check Out"}
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Field 5: Circular Search Button in Electric Lime */}
            <div className="lg:col-span-1 flex items-center justify-center sm:justify-end">
              <button
                type="submit"
                aria-label="Search tours"
                className="flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full bg-[#C7FF32] text-[#161616] shadow-[0_4px_25px_rgba(199,255,50,0.45)] transition-all duration-300 hover:scale-110 hover:bg-[#b8f226] active:scale-95 cursor-pointer font-black"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
