"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Vehicle, VehicleCategory } from "@/lib/fleet";
import FadeIn from "@/components/FadeIn";

type Props = {
  locale: Locale;
  fleet: Vehicle[];
};

export default function FleetSection({ locale, fleet = [] }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories: { id: string; label: Record<Locale, string> }[] = [
    {
      id: "all",
      label: { ru: "Все автомобили", hy: "Բոլոր մեքենաները", en: "All Vehicles" },
    },
    {
      id: "minivan",
      label: { ru: "Минивэны (6-7 мест)", hy: "Մինիվեններ (6-7 տեղ)", en: "Minivans (6-7 seats)" },
    },
    {
      id: "suv",
      label: { ru: "Внедорожники 4x4", hy: "Ամենագնացներ 4x4", en: "4x4 SUVs" },
    },
    {
      id: "minibus",
      label: { ru: "Микроавтобусы", hy: "Միկրոավտոբուսներ", en: "Minibuses" },
    },
    {
      id: "sedan",
      label: { ru: "Комфорт Седаны", hy: "Կոմֆորտ Սեդաններ", en: "Comfort Sedans" },
    },
  ];

  const filtered = selectedCategory === "all"
    ? fleet
    : fleet.filter((v) => v.category === selectedCategory || (selectedCategory === "minivan" && v.category === "vip"));

  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#586EFF]">
              {locale === "ru"
                ? "Наш автопарк"
                : locale === "hy"
                ? "Մեր ավտոպարկը"
                : "Our Modern Fleet"}
            </span>
            <h2 className="mt-2 sm:mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#312F2F]">
              {locale === "ru"
                ? "Комфорт и безопасность на горных дорогах"
                : locale === "hy"
                ? "Հարմարավետություն և անվտանգություն ճանապարհներին"
                : "Comfort & Safety on Every Armenian Road"}
            </h2>
            <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-[#555351]">
              {locale === "ru"
                ? "Все автомобили Amaras Tour регулярно проходят техосмотр, оснащены кондиционерами, Wi-Fi и управляются профессиональными водителями с многолетним горным стажем."
                : locale === "hy"
                ? "Բոլոր մեքենաները պարբերաբար անցնում են տեխզննում, ունեն օդորակիչներ, Wi-Fi և վարվում են փորձառու լեռնային վարորդների կողմից։"
                : "All vehicles undergo strict technical inspections, feature multi-zone climate control, onboard Wi-Fi, and are piloted by seasoned mountain drivers."}
            </p>
          </div>

          <Link
            href={`/${locale}/fleet`}
            className="inline-flex shrink-0 items-center gap-2 sm:gap-3 rounded-full bg-[#312F2F] px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-base font-black uppercase tracking-wider text-[#C7FF32] shadow-lg transition-all hover:bg-[#242323] hover:scale-105 active:scale-95"
          >
            <span>
              {locale === "ru"
                ? "Все машины"
                : locale === "hy"
                ? "Ավտոպարկ"
                : "View All Fleet"}
            </span>
            <span className="text-base font-black">→</span>
          </Link>
        </div>

        {/* Category Pills */}
        <div className="mt-6 sm:mt-8 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 rounded-full px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-black transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-[#312F2F] text-[#C7FF32] shadow-md scale-105"
                  : "bg-white text-[#555351] hover:text-[#312F2F] hover:bg-[#F3F2EE] border border-black/10"
              }`}
            >
              {cat.label[locale]}
            </button>
          ))}
        </div>

        {/* Vehicle Cards Grid */}
        <div className="mt-6 sm:mt-10 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(0, 6).map((car) => (
            <div
              key={car.id}
              className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <div>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/5">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    unoptimized={car.image.startsWith("http")}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                  <span className="absolute top-3 left-3 rounded-full bg-[#312F2F]/85 backdrop-blur-md px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#C7FF32]">
                    {car.categoryName?.[locale] || car.category}
                  </span>

                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#312F2F]">
                    {car.name}
                  </h3>
                </div>
              </div>

              <div className="p-5 sm:p-6 pt-0">
                <Link
                  href={`/${locale}/fleet`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F5F5F0] px-4 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] transition-all hover:bg-[#312F2F] hover:text-[#C7FF32]"
                >
                  <span>
                    {locale === "ru"
                      ? "Подробнее об авто"
                      : locale === "hy"
                      ? "Մանրամասն"
                      : "Vehicle Details"}
                  </span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>
    </section>
  );
}
