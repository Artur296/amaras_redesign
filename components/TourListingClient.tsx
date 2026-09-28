"use client";

import { useMemo, useState } from "react";
import TourCard from "@/components/TourCard";
import type { Dict, Locale } from "@/lib/i18n";
import type { Category, Tour } from "@/lib/tours";

export default function TourListingClient({
  tours,
  categories,
  locale,
  dict,
  initialCategory = "all",
  initialQuery = "",
}: {
  tours: Tour[];
  categories: Category[];
  locale: Locale;
  dict: Dict;
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "duration">("default");

  const categoryTabs = [
    { id: "all", label: locale === "ru" ? "Все туры" : locale === "hy" ? "Բոլորը" : "All Tours" },
    { id: "group", label: locale === "ru" ? "Групповые" : locale === "hy" ? "Խմբային" : "Group Tours" },
    { id: "individual", label: locale === "ru" ? "Индивидуальные" : locale === "hy" ? "Անհատական" : "Private Tours" },
    { id: "jeep", label: locale === "ru" ? "Джип-туры 4x4" : locale === "hy" ? "Ջիպ 4x4" : "4x4 Jeep Expeditions" },
  ];

  const filteredTours = useMemo(() => {
    return tours
      .filter((tour) => {
        // Category filter
        if (selectedCategory !== "all" && !tour.categories.includes(selectedCategory)) {
          return false;
        }

        // Search query filter (title, destinations, description)
        if (search.trim()) {
          const q = search.toLowerCase();
          const title = (tour.title[locale] || "").toLowerCase();
          const desc = (tour.description[locale] || "").toLowerCase();
          const stops = (tour.destinations[locale] || []).join(" ").toLowerCase();
          if (!title.includes(q) && !desc.includes(q) && !stops.includes(q)) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") {
          return (a.priceFromAmd || 0) - (b.priceFromAmd || 0);
        }
        if (sortBy === "price-desc") {
          return (b.priceFromAmd || 0) - (a.priceFromAmd || 0);
        }
        if (sortBy === "duration") {
          const durA = parseFloat(String(a.durationHours || a.days || 0)) || 0;
          const durB = parseFloat(String(b.durationHours || b.days || 0)) || 0;
          return durB - durA;
        }
        return 0;
      });
  }, [tours, selectedCategory, search, sortBy, locale]);

  return (
    <div className="mt-8 space-y-8">
      {/* Control Bar: Search, Category Tabs & Sort */}
      <div className="flex flex-col gap-4 rounded-3xl border border-[#EAE9E0] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-wider transition-all ${
                selectedCategory === tab.id
                  ? "bg-[#586EFF] text-white shadow-md shadow-[#586EFF]/25"
                  : "bg-[#FCFCF7] text-[#312F2F] hover:bg-[#EAE9E0] border border-[#EAE9E0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input and Sort dropdown */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-muted">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                locale === "ru"
                  ? "Поиск по названию или месту..."
                  : locale === "hy"
                  ? "Որոնել ըստ վայրի..."
                  : "Search destination..."
              }
              className="w-full rounded-full border border-[#EAE9E0] bg-[#FCFCF7] py-2 pl-9 pr-4 text-xs font-semibold text-[#312F2F] placeholder-black/40 focus:border-[#586EFF] focus:outline-none"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-[#EAE9E0] bg-[#FCFCF7] px-4 py-2 text-xs font-bold text-[#312F2F] focus:border-[#586EFF] focus:outline-none cursor-pointer"
          >
            <option value="default">{locale === "ru" ? "По умолчанию" : locale === "hy" ? "Ըստ լռելյայնի" : "Default order"}</option>
            <option value="price-asc">{locale === "ru" ? "Сначала недорогие" : locale === "hy" ? "Սկզբում մատչելի" : "Price: Low to High"}</option>
            <option value="price-desc">{locale === "ru" ? "Сначала премиум" : locale === "hy" ? "Սկզբում թանկ" : "Price: High to Low"}</option>
            <option value="duration">{locale === "ru" ? "По длительности" : locale === "hy" ? "Ըստ տևողության" : "Longest duration"}</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs font-bold text-[#6B6967]">
        <span>
          {locale === "ru"
            ? `Найдено туров: ${filteredTours.length}`
            : locale === "hy"
            ? `Գտնվել է ${filteredTours.length} տուր`
            : `Found ${filteredTours.length} tours`}
        </span>
        {search && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="text-[#586EFF] hover:underline"
          >
            {locale === "ru" ? "Сбросить фильтры" : locale === "hy" ? "Մաքրել ֆիլտրերը" : "Reset filters"}
          </button>
        )}
      </div>

      {/* Tours Grid */}
      {filteredTours.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTours.map((tour) => (
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
      ) : (
        <div className="rounded-3xl border border-dashed border-[#EAE9E0] bg-white p-12 text-center">
          <span className="text-4xl">🏔️</span>
          <h3 className="mt-4 text-lg font-black text-[#312F2F]">
            {locale === "ru" ? "Ничего не найдено" : locale === "hy" ? "Ոչինչ չի գտնվել" : "No tours found"}
          </h3>
          <p className="mt-2 text-sm text-[#6B6967]">
            {locale === "ru"
              ? "Попробуйте изменить поисковый запрос или выбрать другую категорию."
              : locale === "hy"
              ? "Փորձեք փոխել որոնման պարամետրերը:"
              : "Try adjusting your search criteria or choosing a different category."}
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedCategory("all");
            }}
            className="mt-6 rounded-full bg-[#586EFF] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#475be6]"
          >
            {locale === "ru" ? "Показать все туры" : locale === "hy" ? "Ցուցադրել բոլորը" : "Show all tours"}
          </button>
        </div>
      )}
    </div>
  );
}
