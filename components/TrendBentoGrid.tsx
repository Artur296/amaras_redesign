"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { HomepageImages } from "@/lib/site";

export default function TrendBentoGrid({
  locale,
  images,
}: {
  locale: Locale;
  images?: Partial<HomepageImages>;
}) {
  const img1 = images?.bentoCard1 || "/images/package-sevan.jpg";
  const img2 = images?.bentoCard2 || "/images/offer-khor-virap.jpg";
  const img3 = images?.bentoCard3 || "/images/package-dilijan.jpg";
  const img4 = images?.bentoCard4 || "/images/package-garni-hd.jpg";

  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-16 lg:py-28">
      {/* Title */}
      <div className="mb-6 sm:mb-14">
        <h2 className="font-serif text-2xl sm:text-5xl font-normal tracking-tight text-[#312F2F]">
          {locale === "ru"
            ? "Туры по Армении — это тренд"
            : locale === "hy"
            ? "Հայաստանի տուրերը թրենդ են"
            : "Armenia Travel — The Trend"}
        </h2>
      </div>

      {/* 4-Card Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
        {/* Card 1: Left Tall Vertical Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 relative overflow-hidden rounded-[2rem] min-h-[260px] sm:min-h-[460px] lg:min-h-[580px] shadow-lg group"
        >
          <Image
            src={img1}
            alt="Севан и Цахкадзор"
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/30" />

          {/* Text on card */}
          <div className="absolute top-5 inset-x-5 sm:top-8 sm:inset-x-8 text-white">
            <h3 className="font-serif text-xl sm:text-3xl font-medium leading-snug">
              {locale === "ru"
                ? "Путешествие в горную сказку"
                : locale === "hy"
                ? "Ճամփորդություն լեռնային հեքիաթում"
                : "Journey to Mountain Wonder"}
            </h3>
            <p className="mt-1.5 sm:mt-3 text-xs sm:text-sm text-white/80 leading-relaxed max-w-xs line-clamp-2 sm:line-clamp-none">
              {locale === "ru"
                ? "Застывшие горные озера, древние монастыри в снежных шапках и чистейший альпийский воздух"
                : locale === "hy"
                ? "Սառած բարձրլեռնային լճեր, դարավոր վանքեր և մաքուր ալպիական օդ"
                : "Frozen alpine lakes, medieval cliff monasteries and pristine mountain air"}
            </p>
          </div>

          {/* Action button */}
          <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8">
            <Link
              href={`/${locale}/tours/popular`}
              className="inline-flex items-center justify-center rounded-full bg-white px-5 sm:px-7 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Top Wide Card + Bottom Two Cards */}
        <div className="lg:col-span-8 flex flex-col gap-4 sm:gap-6">
          {/* Card 2: Top Wide Horizontal Card - Что посмотреть в Армении */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] min-h-[190px] sm:min-h-[280px] shadow-lg group cursor-pointer"
          >
            <Link href={`/${locale}/what-to-see`} className="absolute inset-0 z-10" aria-label="Что посмотреть в Армении" />
            <Image
              src={img2}
              alt="Что посмотреть в Армении"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-transparent" />

            <div className="absolute top-5 left-5 right-5 sm:top-8 sm:left-8 max-w-lg text-white pointer-events-none">
              <span className="inline-block rounded-full bg-[#C7FF32]/20 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#C7FF32] backdrop-blur-md mb-1 sm:mb-2">
                {locale === "ru" ? "Путеводитель" : locale === "hy" ? "Ուղեցույց" : "Travel Guide"}
              </span>
              <h3 className="font-serif text-xl sm:text-3xl font-medium leading-snug">
                {locale === "ru"
                  ? "Что посмотреть в Армении"
                  : locale === "hy"
                  ? "Ինչ տեսնել Հայաստանում"
                  : "What to See in Armenia"}
              </h3>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-white/80 leading-relaxed max-w-md line-clamp-2">
                {locale === "ru"
                  ? "Древние монастыри ЮНЕСКО, средневековые крепости и чудеса природы с точным расстоянием от Еревана"
                  : locale === "hy"
                  ? "ՅՈՒՆԵՍԿՕ-ի հնագույն վանքեր, միջնադարյան ամրոցներ և բնության հրաշքներ՝ Երևանից հեռավորությամբ"
                  : "Ancient UNESCO sanctuaries, medieval fortresses and natural wonders with distances from Yerevan"}
              </p>
            </div>

            <div className="absolute bottom-5 left-5 sm:bottom-8 sm:left-8 z-20">
              <Link
                href={`/${locale}/what-to-see`}
                className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-5 sm:px-7 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95 group-hover:bg-[#C7FF32]"
              >
                <span>{locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}</span>
                <span className="text-xs transition-transform group-hover:translate-x-1">→</span>
              </Link>
            </div>
          </motion.div>

          {/* Bottom Row: 2 Split Cards side-by-side */}
          <div className="grid grid-cols-2 gap-3 sm:gap-6 flex-1">
            {/* Card 3: Premium Resorts & Spas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] min-h-[170px] sm:min-h-[250px] shadow-lg group"
            >
              <Image
                src={img3}
                alt="Премиум-отели Армении"
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

              <div className="absolute top-3.5 inset-x-3.5 sm:top-6 sm:inset-x-6 text-white">
                <h4 className="font-serif text-sm sm:text-2xl font-medium leading-tight sm:leading-snug">
                  {locale === "ru"
                    ? "Премиум-отели"
                    : locale === "hy"
                    ? "Պրեմիում հյուրանոցներ"
                    : "Premium Hotels"}
                </h4>
                <p className="mt-1 text-[11px] sm:text-xs text-white/80 line-clamp-1 sm:line-clamp-none">
                  {locale === "ru"
                    ? "Комфорт и спа"
                    : locale === "hy"
                    ? "Հարմարավետություն և սպա"
                    : "Luxury and comfort"}
                </p>
              </div>

              <div className="absolute bottom-3.5 left-3.5 sm:bottom-6 sm:left-6">
                <Link
                  href={`/${locale}/tour-packages`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-6 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Learn more"}
                </Link>
              </div>
            </motion.div>

            {/* Card 4: Excursions & Heritage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-2xl sm:rounded-[2rem] min-h-[170px] sm:min-h-[250px] shadow-lg group"
            >
              <Image
                src={img4}
                alt="Экскурсионные туры"
                fill
                sizes="(max-width: 1024px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />

              <div className="absolute top-3.5 inset-x-3.5 sm:top-6 sm:inset-x-6 text-white">
                <h4 className="font-serif text-sm sm:text-2xl font-medium leading-tight sm:leading-snug">
                  {locale === "ru"
                    ? "Экскурсионные туры"
                    : locale === "hy"
                    ? "Էքսկուրսիոն տուրեր"
                    : "Guided Tours"}
                </h4>
                <p className="mt-1 text-[11px] sm:text-xs text-white/80 line-clamp-1 sm:line-clamp-none">
                  {locale === "ru"
                    ? "Яркие впечатления"
                    : locale === "hy"
                    ? "Վառ տպավորություններ"
                    : "Unforgettable"}
                </p>
              </div>

              <div className="absolute bottom-3.5 left-3.5 sm:bottom-6 sm:left-6">
                <Link
                  href={`/${locale}/tours/group`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-3 sm:px-6 py-1.5 sm:py-2.5 text-[10px] sm:text-xs font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Learn more"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
