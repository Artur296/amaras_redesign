"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { HomepageImages, BentoExtremeConfig } from "@/lib/site";

export default function TrendBentoGrid({
  locale,
  images,
  bentoExtreme,
}: {
  locale: Locale;
  images?: Partial<HomepageImages>;
  bentoExtreme?: Partial<BentoExtremeConfig>;
}) {
  const img1 = images?.bentoCard1 || "/images/package-sevan.jpg";
  const img2 = images?.bentoCard2 || "/images/offer-khor-virap.jpg";
  const img3 = images?.bentoCard3 || "/images/package-dilijan.jpg";
  const img4 = images?.bentoCard4 || "/images/package-garni-hd.jpg";
  const imgGuests = images?.bentoCardGuests || "/images/hero-travellers.jpg";
  const imgExtreme = images?.bentoCardExtreme || "/images/1792096571726-jeep-mountain-road-web.jpg";

  const extremeBadge = bentoExtreme?.badge || "4×4";
  const extremeTitle =
    bentoExtreme?.title?.[locale] ||
    bentoExtreme?.title?.ru ||
    (locale === "ru" ? "Экстрим" : locale === "hy" ? "Էքսթրիմ" : "Extreme");
  const extremeSubtitle =
    bentoExtreme?.subtitle?.[locale] ||
    bentoExtreme?.subtitle?.ru ||
    (locale === "ru"
      ? "Зиплайн, парашют, 4×4 и перевалы"
      : locale === "hy"
      ? "Զիփլայն, պարաշյուտ, 4×4 և լեռնանցքներ"
      : "Zipline, skydiving, 4×4 & passes");
  const extremeActivities = Array.isArray(bentoExtreme?.activities)
    ? bentoExtreme.activities
    : ["Зиплайн", "Прыжок с парашютом", "Джип-туры 4×4", "Параплан", "Рафтинг"];
  const rawLink = bentoExtreme?.link || "/tours/jeep";
  const extremeLink = rawLink.startsWith("http")
    ? rawLink
    : `/${locale}${rawLink.startsWith("/") ? rawLink : `/${rawLink}`}`;

  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-24">
      {/* Title */}
      <div className="mb-6 sm:mb-12">
        <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-tight text-[#312F2F]">
          {locale === "ru"
            ? "Туры по Армении — это тренд"
            : locale === "hy"
            ? "Հայաստանի տուրերը թրենդ են"
            : "Armenia Travel — The Trend"}
        </h2>
      </div>

      {/* 6-Card Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Left Column: 2 Stacked Cards (Горная сказка + Наши гости) */}
        <div className="lg:col-span-4 flex flex-col gap-4 sm:gap-6">
          {/* Card 1: Путешествие в горную сказку */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative overflow-hidden rounded-[2rem] min-h-[220px] sm:min-h-[285px] lg:min-h-[295px] shadow-lg group flex-1"
          >
            <Image
              src={img1}
              alt="Севан и Цахкадзор"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

            {/* Text on card */}
            <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 text-white">
              <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-medium leading-snug">
                {locale === "ru"
                  ? "Путешествие в горную сказку"
                  : locale === "hy"
                  ? "Ճամփորդություն լեռնային հեքիաթում"
                  : "Journey to Mountain Wonder"}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2">
                {locale === "ru"
                  ? "Застывшие горные озера, древние монастыри и чистейший альпийский воздух"
                  : locale === "hy"
                  ? "Սառած բարձրլեռնային լճեր, դարավոր վանքեր և մաքուր ալպիական օդ"
                  : "Frozen alpine lakes, medieval monasteries and pristine mountain air"}
              </p>
            </div>

            {/* Action button */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <Link
                href={`/${locale}/tours/popular`}
                className="inline-flex items-center justify-center rounded-full bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-all hover:bg-[#C7FF32] hover:scale-105 active:scale-95"
              >
                {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
              </Link>
            </div>
          </motion.div>

          {/* Card 2: НАШИ ГОСТИ (Our Guests) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] min-h-[220px] sm:min-h-[285px] lg:min-h-[295px] shadow-lg group flex-1"
          >
            <Image
              src={imgGuests}
              alt="Наши гости в Армении"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

            <div className="absolute top-4 inset-x-4 sm:top-6 sm:inset-x-6 text-white">
              <span className="inline-block rounded-full bg-[#C7FF32]/25 border border-[#C7FF32]/40 px-2.5 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32] backdrop-blur-md mb-1 sm:mb-2">
                {locale === "ru" ? "Живые эмоции" : locale === "hy" ? "Կենդանի պահեր" : "Real Moments"}
              </span>
              <h3 className="font-serif text-lg sm:text-2xl lg:text-3xl font-medium leading-snug">
                {locale === "ru"
                  ? "Наши гости"
                  : locale === "hy"
                  ? "Մեր հյուրերը"
                  : "Our Guests"}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/85 leading-relaxed line-clamp-2">
                {locale === "ru"
                  ? "Искренние фото, видео и тёплые воспоминания наших путешественников"
                  : locale === "hy"
                  ? "Մեր ճամփորդների անկեղծ լուսանկարներ, տեսանյութեր և ջերմ հիշողություններ"
                  : "Genuine photos, videos and heartfelt memories from our travelers"}
              </p>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
              <Link
                href={`/${locale}/guests`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-all hover:bg-[#C7FF32] hover:scale-105 active:scale-95"
              >
                <span>{locale === "ru" ? "Смотреть галерею" : locale === "hy" ? "Դիտել հյուրերին" : "View Gallery"}</span>
                <span className="text-xs">→</span>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Right Column: Top Wide Card + Bottom 3 Cards */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          {/* Card 3: Top Wide Horizontal Card - Что посмотреть в Армении */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="relative overflow-hidden rounded-[2rem] min-h-[220px] sm:min-h-[285px] lg:min-h-[295px] shadow-lg group cursor-pointer"
          >
            <Link href={`/${locale}/what-to-see`} className="absolute inset-0 z-10" aria-label="Что посмотреть в Армении" />
            <Image
              src={img2}
              alt="Что посмотреть в Армении"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

            <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-8 max-w-lg text-white pointer-events-none">
              <span className="inline-block rounded-full bg-[#C7FF32]/20 border border-[#C7FF32]/35 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#C7FF32] backdrop-blur-md mb-1 sm:mb-2">
                {locale === "ru" ? "Путеводитель" : locale === "hy" ? "Ուղեցույց" : "Travel Guide"}
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-medium leading-snug">
                {locale === "ru"
                  ? "Что посмотреть в Армении"
                  : locale === "hy"
                  ? "Ինչ տեսնել Հայաստանում"
                  : "What to See in Armenia"}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/85 leading-relaxed max-w-md line-clamp-2">
                {locale === "ru"
                  ? "Древние монастыри ЮНЕСКО, средневековые крепости и чудеса природы с точным расстоянием от Еревана"
                  : locale === "hy"
                  ? "ՅՈՒՆԵՍԿՕ-ի հնագույն վանքեր, միջնադարյան ամրոցներ և բնության հրաշքներ՝ Երևանից հեռավորությամբ"
                  : "Ancient UNESCO sanctuaries, medieval fortresses and natural wonders with distances from Yerevan"}
              </p>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8 z-20">
              <Link
                href={`/${locale}/what-to-see`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-all hover:bg-[#C7FF32] hover:scale-105 active:scale-95"
              >
                <span>{locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}</span>
                <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Bottom Row: 3 Cards side-by-side (Премиум-отели + Экскурсионные туры + ЭКСТРИМ 4x4) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 flex-1">
            {/* Card 4: Премиум-отели */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] min-h-[190px] sm:min-h-[270px] lg:min-h-[295px] shadow-lg group"
            >
              <Image
                src={img3}
                alt="Премиум-отели Армении"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

              <div className="absolute top-3.5 inset-x-3.5 sm:top-5 sm:inset-x-5 text-white">
                <h4 className="font-serif text-base sm:text-xl lg:text-2xl font-medium leading-tight">
                  {locale === "ru"
                    ? "Премиум-отели"
                    : locale === "hy"
                    ? "Պրեմիում հյուրանոցներ"
                    : "Premium Hotels"}
                </h4>
                <p className="mt-1 text-xs text-white/80 line-clamp-1">
                  {locale === "ru"
                    ? "Комфорт и спа"
                    : locale === "hy"
                    ? "Հարմարավետություն և սպա"
                    : "Luxury and comfort"}
                </p>
              </div>

              <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5">
                <Link
                  href={`/${locale}/tour-packages`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-[#161616] shadow-md transition-all hover:bg-[#C7FF32] hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Learn more"}
                </Link>
              </div>
            </motion.div>

            {/* Card 5: Экскурсионные туры */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] min-h-[190px] sm:min-h-[270px] lg:min-h-[295px] shadow-lg group"
            >
              <Image
                src={img4}
                alt="Экскурсионные туры"
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />

              <div className="absolute top-3.5 inset-x-3.5 sm:top-5 sm:inset-x-5 text-white">
                <h4 className="font-serif text-base sm:text-xl lg:text-2xl font-medium leading-tight">
                  {locale === "ru"
                    ? "Экскурсионные туры"
                    : locale === "hy"
                    ? "Էքսկուրսիոն տուրեր"
                    : "Guided Tours"}
                </h4>
                <p className="mt-1 text-xs text-white/80 line-clamp-1">
                  {locale === "ru"
                    ? "Яркие впечатления"
                    : locale === "hy"
                    ? "Վառ տպավորություններ"
                    : "Unforgettable"}
                </p>
              </div>

              <div className="absolute bottom-3.5 left-3.5 sm:bottom-5 sm:left-5">
                <Link
                  href={`/${locale}/tours/group`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-5 py-1.5 sm:py-2 text-xs font-bold text-[#161616] shadow-md transition-all hover:bg-[#C7FF32] hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Learn more"}
                </Link>
              </div>
            </motion.div>

            {/* Card 6: ЭКСТРИМ & ПРИКЛЮЧЕНИЯ (Zipline, Parachute, 4x4, etc.) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] min-h-[190px] sm:min-h-[270px] lg:min-h-[295px] shadow-lg group border border-[#C7FF32]/25 flex flex-col justify-between"
            >
              <Image
                src={imgExtreme}
                alt={extremeTitle}
                fill
                sizes="(max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/35" />

              <div className="relative z-10 p-3.5 sm:p-5 text-white">
                <span className="inline-block rounded-md bg-[#C7FF32] px-1.5 py-0.5 text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-[#312F2F] mb-1">
                  {extremeBadge}
                </span>
                <h4 className="font-serif text-base sm:text-xl lg:text-2xl font-medium leading-tight text-[#C7FF32]">
                  {extremeTitle}
                </h4>
                <p className="mt-1 text-xs text-white/85 line-clamp-2 leading-snug">
                  {extremeSubtitle}
                </p>

                {/* Extreme activity chips (Zipline, Parachute, 4x4, etc.) */}
                {extremeActivities.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {extremeActivities.slice(0, 3).map((act, idx) => (
                      <span
                        key={idx}
                        className="rounded-full bg-white/15 backdrop-blur-xs px-2 py-0.5 text-[9px] sm:text-[10px] font-medium text-white/90 border border-white/15"
                      >
                        {act}
                      </span>
                    ))}
                    {extremeActivities.length > 3 && (
                      <span className="rounded-full bg-[#C7FF32]/20 px-1.5 py-0.5 text-[9px] sm:text-[10px] font-bold text-[#C7FF32]">
                        +{extremeActivities.length - 3}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="relative z-10 p-3.5 sm:p-5 pt-0">
                <Link
                  href={extremeLink}
                  className="inline-flex items-center justify-center rounded-full bg-[#C7FF32] px-3.5 sm:px-5 py-1.5 sm:py-2 text-xs font-black text-[#312F2F] shadow-md transition-all hover:bg-white hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Explore"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
