"use client";

import Image from "next/image";
import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import type { Vehicle, FleetCategory } from "@/lib/fleet";
import { defaultFleetCategories } from "@/lib/fleet";
import type { SiteInfo } from "@/lib/site";
import FadeIn from "@/components/FadeIn";
import BookingModal from "@/components/BookingModal";
import { WhatsAppIcon, ShieldIcon, StarIcon, RouteIcon } from "@/components/icons";
import { useMemo } from "react";

type Props = {
  locale: Locale;
  fleet: Vehicle[];
  categories?: FleetCategory[];
  site: SiteInfo;
};

export default function FleetPageClient({ locale, fleet = [], categories, site }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);

  const categoryTabs = useMemo(() => {
    const list: { id: string; label: Record<Locale, string> }[] = [
      {
        id: "all",
        label: { ru: "Все автомобили", hy: "Բոլոր մեքենաները", en: "All Vehicles" },
      },
    ];
    const source = categories && categories.length > 0 ? categories : defaultFleetCategories;
    source.forEach((cat) => {
      list.push({
        id: cat.id,
        label: cat.name,
      });
    });
    return list;
  }, [categories]);

  const filtered = selectedCategory === "all"
    ? fleet
    : fleet.filter((v) => v.category === selectedCategory);

  const cleanPhone = (site.phone || "").replace(/[^\d+]/g, "");

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 4 Trust & Guarantee Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10 sm:mb-14">
        <div className="rounded-2xl border border-white/10 bg-[#242323] p-5 shadow-sm">
          <div className="text-2xl mb-2">🛡️</div>
          <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
            {locale === "ru" ? "100% Техосмотр" : locale === "hy" ? "100% Տեխզննում" : "100% Inspected"}
          </h4>
          <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
            {locale === "ru"
              ? "Тормоза, подвеска и шины проверяются перед каждым выездом в горы."
              : locale === "hy"
              ? "Արգելակները, կախոցը և անվադողերը ստուգվում են յուրաքանչյուր ուղևորությունից առաջ։"
              : "Brakes, tires, and suspension undergo inspection before every mountain departure."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#242323] p-5 shadow-sm">
          <div className="text-2xl mb-2">🏔️</div>
          <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
            {locale === "ru" ? "Опытные горные водители" : locale === "hy" ? "Փորձառու վարորդներ" : "Mountain Certified Chauffeurs"}
          </h4>
          <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
            {locale === "ru"
              ? "Стаж наших водителей на серпантинах и перевалах Армении от 7 лет."
              : locale === "hy"
              ? "Մեր վարորդներն ունեն 7+ տարվա լեռնային վարորդական փորձառություն։"
              : "Over 7 years of professional mountain pass driving experience."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#242323] p-5 shadow-sm">
          <div className="text-2xl mb-2">❄️</div>
          <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
            {locale === "ru" ? "Идеальный микроклимат" : locale === "hy" ? "Իդեալական կլիմա" : "Climate & Wi-Fi"}
          </h4>
          <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
            {locale === "ru"
              ? "Кондиционеры работают безупречно в любую жару, салон без запахов."
              : locale === "hy"
              ? "Օդորակիչները գործում են անթերի, սրահում կա Wi-Fi և մաքրություն։"
              : "Flawless air conditioning even in summer heat, non-smoking spotless cabins."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#242323] p-5 shadow-sm">
          <div className="text-2xl mb-2">👶</div>
          <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
            {locale === "ru" ? "Детские кресла бесплатно" : locale === "hy" ? "Մանկական նստատեղ" : "Free Child Seats"}
          </h4>
          <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
            {locale === "ru"
              ? "Предоставляем сертифицированные детские кресла по запросу без доплат."
              : locale === "hy"
              ? "Անվճար տրամադրում ենք մանկական նստատեղեր՝ ձեր երեխաների անվտանգության համար։"
              : "Certified child booster and safety seats available free upon request."}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
        {categoryTabs.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`shrink-0 rounded-full px-5 py-2.5 text-xs sm:text-sm font-black transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? "bg-[#C7FF32] text-[#312F2F] shadow-lg scale-105"
                : "bg-[#242323] text-[#FCFCF7]/80 hover:text-white hover:bg-[#383636] border border-white/10"
            }`}
          >
            {cat.label[locale]}
          </button>
        ))}
      </div>

      {/* Vehicles Grid */}
      <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
        {filtered.map((car) => {
          const whatsappText = encodeURIComponent(
            locale === "ru"
              ? `Здравствуйте, Amaras Tour! Хочу заказать тур / трансфер на автомобиле: ${car.name}. Подскажите, свободен ли он на мои даты?`
              : locale === "hy"
              ? `Բարև ձեզ, Amaras Tour: Ցանկանում եմ պատվիրել տուր / տրանսֆեր ${car.name} մեքենայով։`
              : `Hello Amaras Tour! I would like to inquire about booking a tour / transfer with the ${car.name}.`
          );
          const whatsappUrl = `https://wa.me/${cleanPhone}?text=${whatsappText}`;

          return (
            <div
              key={car.id}
              className="flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#242323] shadow-md transition-all hover:border-[#C7FF32]/40"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/30">
                <Image
                  src={car.image}
                  alt={car.name}
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  unoptimized={car.image.startsWith("http")}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#242323] via-transparent to-transparent opacity-80" />

                <span className="absolute top-4 left-4 rounded-full bg-[#312F2F]/90 backdrop-blur-md px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32] border border-white/10">
                  {car.categoryName?.[locale] || car.category}
                </span>

                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-bold">
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                    👥 {car.passengers} {locale === "ru" ? "пассажирских мест" : locale === "hy" ? "նստատեղ" : "passenger seats"}
                  </span>
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10">
                    🧳 {car.luggage} {locale === "ru" ? "чемоданов" : locale === "hy" ? "ճամպրուկ" : "luggage capacity"}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#FCFCF7]">
                    {car.name}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#FCFCF7]/75">
                    {car.description?.[locale]}
                  </p>

                  {/* Feature checklist */}
                  <div className="mt-6 border-t border-white/10 pt-5">
                    <h5 className="text-xs font-black uppercase tracking-wider text-[#C7FF32] mb-3">
                      {locale === "ru" ? "Оснащение и удобства салона" : locale === "hy" ? "Հարմարավետություն" : "Cabin Equipment & Amenities"}
                    </h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#FCFCF7]/85">
                      {(car.features?.[locale] || []).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <span className="text-[#C7FF32] font-black">✓</span>
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* CTAs */}
                <div className="mt-8 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#20ba59] active:scale-95"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>
                      {locale === "ru"
                        ? "Заказать этот авто"
                        : locale === "hy"
                        ? "Պատվիրել մեքենան"
                        : "Book this Vehicle"}
                    </span>
                  </a>

                  <a
                    href={`tel:${cleanPhone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-5 py-3.5 text-xs sm:text-sm font-bold text-[#FCFCF7] transition-all hover:bg-white/10 hover:border-white/40"
                  >
                    <span>📞 {site.phone}</span>
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Airport Transfer & Custom Trips Banner */}
      <div className="mt-14 sm:mt-20 overflow-hidden rounded-3xl bg-gradient-to-br from-[#383636] to-[#242323] p-8 sm:p-12 border border-white/15 relative">
        <div className="max-w-2xl relative z-10">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
            {locale === "ru" ? "Трансферы & Индивидуальный заказ" : locale === "hy" ? "Տրանսֆերներ և Անհատական պատվերներ" : "Airport Transfers & Custom Hires"}
          </span>
          <h3 className="mt-3 font-serif text-2xl sm:text-4xl font-normal text-[#FCFCF7]">
            {locale === "ru"
              ? "Нужен трансфер из аэропорта Звартноц или персональный маршрут?"
              : locale === "hy"
              ? "Անհրաժե՞շտ է տրանսֆեր Զվարթնոց օդանավակայանից կամ անհատական երթուղի:"
              : "Need a Zvartnots Airport transfer or a bespoke custom route?"}
          </h3>
          <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#FCFCF7]/80">
            {locale === "ru"
              ? "Встречаем с именной табличкой в зоне прилёта, помогаем с багажом, довозим в любую точку Армении и Грузии с максимальным комфортом."
              : locale === "hy"
              ? "Դիմավորում ենք ցուցանակով, օգնում ուղեբեռի հարցում և հասցնում Հայաստանի կամ Վրաստանի ցանկացած կետ։"
              : "Personal meet & greet with nameplate at arrivals, luggage assistance, and direct travel to any destination in Armenia and Georgia."}
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <a
              href={`https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                locale === "ru"
                  ? "Здравствуйте! Нужен трансфер / аренда авто с водителем в Армении."
                  : locale === "hy"
                  ? "Բարև ձեզ, ինձ անհրաժեշտ է տրանսֆեր / մեքենայի վարձույթ վարորդով։"
                  : "Hello! I need an airport transfer / chauffeur hire in Armenia."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#C7FF32] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-all hover:bg-[#b5eb2a]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              <span>{locale === "ru" ? "Написать в WhatsApp" : locale === "hy" ? "Գրել WhatsApp" : "Message on WhatsApp"}</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
