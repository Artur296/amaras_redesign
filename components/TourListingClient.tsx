"use client";

import { useMemo, useState, useEffect } from "react";
import TourCard from "@/components/TourCard";
import type { Dict, Locale } from "@/lib/i18n";
import { getTourCode, isPackageTour, type Category, type Tour } from "@/lib/tours";

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
  const [toursList, setToursList] = useState<Tour[]>(tours);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState(initialQuery);
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc" | "duration">("default");

  useEffect(() => {
    setToursList(tours);
  }, [tours]);

  useEffect(() => {
    function syncLive() {
      try {
        const raw = localStorage.getItem("amaras_live_content_v2");
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed.content?.tours && Array.isArray(parsed.content.tours)) {
            if (Date.now() - (parsed.timestamp || 0) < 30 * 60 * 1000) {
              const dayTours = parsed.content.tours.filter((t: Tour) => !isPackageTour(t));
              if (dayTours.length > 0) {
                setToursList(dayTours);
              }
            }
          }
        }
      } catch {}
    }

    syncLive();

    let bc: BroadcastChannel | null = null;
    if (typeof BroadcastChannel !== "undefined") {
      try {
        bc = new BroadcastChannel("amaras_content_sync");
        bc.onmessage = () => syncLive();
      } catch {}
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "amaras_live_content_v2") syncLive();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const q = params.get("q");
      if (q) {
        setSearch(q);
      }
    }
  }, []);

  const categoryTabs = [
    { id: "all", label: locale === "ru" ? "Все туры" : locale === "hy" ? "Բոլորը" : "All Tours" },
    { id: "popular", label: locale === "ru" ? "⭐ Популярные" : locale === "hy" ? "⭐ Հանրաճանաչ" : "⭐ Popular" },
    { id: "group", label: locale === "ru" ? "Групповые" : locale === "hy" ? "Խմբային" : "Group Tours" },
    { id: "individual", label: locale === "ru" ? "Индивидуальные" : locale === "hy" ? "Անհատական" : "Private Tours" },
    { id: "jeep", label: locale === "ru" ? "Джип-туры 4x4" : locale === "hy" ? "Ջիպ 4x4" : "4x4 Jeep Expeditions" },
  ];

  const filteredTours = useMemo(() => {
    return toursList
      .filter((tour) => {
        // Category filter
        if (selectedCategory !== "all") {
          if (selectedCategory === "popular") {
            const isPop = (tour.featured ?? true) || tour.categories.includes("popular");
            if (!isPop) return false;
          } else if (!tour.categories.includes(selectedCategory)) {
            return false;
          }
        }

        // Search query filter (code, title, destinations, description across languages)
        if (search.trim()) {
          const q = search.toLowerCase();
          const cleanQ = q.replace(/[#№]/g, "").trim();
          const tourCode = getTourCode(tour).toLowerCase();
          if (tourCode && (tourCode === cleanQ || tourCode.includes(cleanQ))) {
            return true;
          }
          const title = (tour.title[locale] || "").toLowerCase();
          const titleRu = (tour.title.ru || "").toLowerCase();
          const titleEn = (tour.title.en || "").toLowerCase();
          const desc = (tour.description[locale] || "").toLowerCase();
          const descRu = (tour.description.ru || "").toLowerCase();
          const stops = (tour.destinations[locale] || []).join(" ").toLowerCase();
          const stopsRu = (tour.destinations.ru || []).join(" ").toLowerCase();
          if (
            !title.includes(q) &&
            !titleRu.includes(q) &&
            !titleEn.includes(q) &&
            !desc.includes(q) &&
            !descRu.includes(q) &&
            !stops.includes(q) &&
            !stopsRu.includes(q)
          ) {
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
      <div className="flex flex-col gap-2.5 sm:gap-3 rounded-2xl sm:rounded-full border border-[#EAE9E0] bg-white p-2 sm:p-2.5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* Category Pills - horizontal swipeable row */}
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5 min-w-0 flex-1 pr-1">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelectedCategory(tab.id)}
              className={`shrink-0 rounded-full px-3 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold sm:font-black uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? "bg-[#586EFF] text-white shadow-sm shadow-[#586EFF]/25"
                  : "bg-[#FCFCF7] text-[#312F2F] hover:bg-[#EAE9E0] border border-[#EAE9E0]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input and Sort dropdown - horizontal row */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Search */}
          <div className="relative flex-1 sm:w-56 md:w-52 lg:w-64">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none">
              <svg className="w-3.5 h-3.5 text-black/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={
                locale === "ru"
                  ? "Поиск по коду или месту..."
                  : locale === "hy"
                  ? "Որոնել ըստ կոդի կամ վայրի..."
                  : "Search code or place..."
              }
              className="w-full rounded-full border border-[#EAE9E0] bg-[#FCFCF7] h-8 sm:h-9 pl-8 pr-7 text-xs font-semibold text-[#312F2F] placeholder-black/40 focus:border-[#586EFF] focus:bg-white focus:outline-none transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-full border border-[#EAE9E0] bg-[#FCFCF7] h-8 sm:h-9 px-3 text-xs font-bold text-[#312F2F] focus:border-[#586EFF] focus:bg-white focus:outline-none cursor-pointer shrink-0 transition-all"
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
            ? (filteredTours.length === 1
                ? "Найден 1 тур"
                : filteredTours.length >= 2 && filteredTours.length <= 4
                ? `Найдено ${filteredTours.length} тура`
                : `Найдено ${filteredTours.length} туров`)
            : locale === "hy"
            ? `Գտնվել է ${filteredTours.length} տուր`
            : `${filteredTours.length} ${filteredTours.length === 1 ? "tour" : "tours"} found`}
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
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#586EFF]/10 text-[#586EFF]">
            <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm3.6 6.4l-2 5.6-5.6 2 2-5.6 5.6-2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-black text-[#312F2F]">
            {locale === "ru" ? "Ничего не найдено" : locale === "hy" ? "Ոչինչ չի գտնվել" : "No tours found"}
          </h3>
          <p className="mt-2 text-sm text-[#6B6967]">
            {locale === "ru"
              ? "Попробуйте изменить поисковый запрос или выбрать другую категорию."
              : locale === "hy"
              ? "Փորձեք փոխել որոնման պարամետրերը։"
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
