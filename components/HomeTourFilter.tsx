"use client";

import { useState } from "react";
import Link from "next/link";
import TourCard from "@/components/TourCard";
import type { Dict, Locale } from "@/lib/i18n";
import { isPackageTour, type Category, type Tour } from "@/lib/tours";

export default function HomeTourFilter({
  tours,
  categories,
  locale,
  dict,
}: {
  tours: Tour[];
  categories: Category[];
  locale: Locale;
  dict: Dict;
}) {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: locale === "ru" ? "Все популярные" : locale === "hy" ? "Բոլորը" : "All Popular" },
    { id: "group", label: locale === "ru" ? "Групповые" : locale === "hy" ? "Խմբային" : "Group Tours" },
    { id: "individual", label: locale === "ru" ? "Индивидуальные" : locale === "hy" ? "Անհատական" : "Private" },
    { id: "jeep", label: locale === "ru" ? "Джип-туры 4x4" : locale === "hy" ? "Ջիպ-տուրեր" : "4x4 Jeep" },
    { id: "packages", label: locale === "ru" ? "Тур-пакеты" : locale === "hy" ? "Տուր փաթեթներ" : "Packages" },
  ];

  const filtered = tours.filter((t) => {
    if (activeTab === "all") return true;
    if (activeTab === "packages") return isPackageTour(t);
    return t.categories.includes(activeTab);
  });

  const displayedTours = filtered.slice(0, 6);

  return (
    <div>
      {/* Filter Tabs / Pills (TripMate reference pattern) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-[#586EFF] text-white shadow-md shadow-[#586EFF]/30 scale-105"
                  : "bg-white border border-[#EAE9E0] text-[#312F2F] hover:border-[#586EFF] hover:text-[#586EFF]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Link
          href={`/${locale}/tours`}
          className="inline-flex items-center gap-2 text-sm font-bold text-[#586EFF] hover:underline"
        >
          <span>{dict.featured.all}</span>
          <span className="text-base font-black">→</span>
        </Link>
      </div>

      {/* Tours Grid */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {displayedTours.map((tour) => (
          <div key={tour.slug} className="h-full">
            <TourCard
              tour={tour}
              locale={locale}
              dict={dict}
              categories={categories}
            />
          </div>
        ))}
      </div>

      {filtered.length > 6 && (
        <div className="mt-12 text-center">
          <Link
            href={`/${locale}/tours`}
            className="inline-flex items-center justify-center rounded-full border-2 border-[#312F2F] bg-[#312F2F] px-8 py-3.5 text-sm font-black uppercase tracking-wider text-[#FCFCF7] shadow-lg transition-all hover:bg-[#586EFF] hover:border-[#586EFF] hover:shadow-xl"
          >
            {locale === "ru" ? "Смотреть еще туры" : locale === "hy" ? "Դիտել ավելին" : "Discover More Tours"} →
          </Link>
        </div>
      )}
    </div>
  );
}
