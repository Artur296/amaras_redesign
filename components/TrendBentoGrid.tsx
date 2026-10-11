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
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
      {/* Title */}
      <div className="mb-8 sm:mb-14">
        <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#312F2F]">
          {locale === "ru"
            ? "Туры по Армении — это тренд"
            : locale === "hy"
            ? "Հայաստանի տուրերը թրենդ են"
            : "Armenia Travel — The Trend"}
        </h2>
      </div>

      {/* 4-Card Bento Grid (Screenshot 1 Layout) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Left Tall Vertical Card (Russian North style -> Winter / Mountain Armenia) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="lg:col-span-4 relative overflow-hidden rounded-[2rem] min-h-[360px] sm:min-h-[460px] lg:min-h-[580px] shadow-lg group"
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
          <div className="absolute top-6 inset-x-6 sm:top-8 sm:inset-x-8 text-white">
            <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug">
              {locale === "ru"
                ? "Путешествие в горную сказку"
                : locale === "hy"
                ? "Ճամփորդություն լեռնային հեքիաթում"
                : "Journey to Mountain Wonder"}
            </h3>
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-white/80 leading-relaxed max-w-xs">
              {locale === "ru"
                ? "Застывшие горные озера, древние монастыри в снежных шапках и чистейший альпийский воздух"
                : locale === "hy"
                ? "Սառած բարձրլեռնային լճեր, դարավոր վանքեր և մաքուր ալպիական օդ"
                : "Frozen alpine lakes, medieval cliff monasteries and pristine mountain air"}
            </p>
          </div>

          {/* Action button */}
          <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
            <Link
              href={`/${locale}/tours/popular`}
              className="inline-flex items-center justify-center rounded-full bg-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
            >
              {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Top Wide Card + Bottom Two Cards */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 2: Top Wide Horizontal Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative overflow-hidden rounded-[2rem] min-h-[230px] sm:min-h-[280px] shadow-lg group"
          >
            <Image
              src={img2}
              alt="Популярные направления Армении"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />

            <div className="absolute top-6 left-6 right-6 sm:top-8 sm:left-8 max-w-md text-white">
              <h3 className="font-serif text-2xl sm:text-3xl font-medium leading-snug">
                {locale === "ru"
                  ? "Популярные направления для отдыха в Армении"
                  : locale === "hy"
                  ? "Հանրաճանաչ ուղղություններ Հայաստանում"
                  : "Popular Destinations Across Armenia"}
              </h3>
            </div>

            <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8">
              <Link
                href={`/${locale}/tours`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
              </Link>
            </div>
          </motion.div>

          {/* Bottom Row: 2 Split Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 flex-1">
            {/* Card 3: Premium Resorts & Spas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative overflow-hidden rounded-[2rem] min-h-[220px] sm:min-h-[250px] shadow-lg group"
            >
              <Image
                src={img3}
                alt="Премиум-отели Армении"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

              <div className="absolute top-6 inset-x-6 text-white">
                <h4 className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                  {locale === "ru"
                    ? "Премиум-отели Армении"
                    : locale === "hy"
                    ? "Պրեմիում հյուրանոցներ"
                    : "Premium Hotels of Armenia"}
                </h4>
                <p className="mt-2 text-xs text-white/80">
                  {locale === "ru"
                    ? "Для тех, кто выбирает комфорт и спа"
                    : locale === "hy"
                    ? "Նրանց համար, ովքեր նախընտրում են հարմարավետություն"
                    : "For travelers who choose luxury and comfort"}
                </p>
              </div>

              <div className="absolute bottom-6 left-6">
                <Link
                  href={`/${locale}/tour-packages`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
                </Link>
              </div>
            </motion.div>

            {/* Card 4: Excursions & Heritage */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative overflow-hidden rounded-[2rem] min-h-[220px] sm:min-h-[250px] shadow-lg group"
            >
              <Image
                src={img4}
                alt="Экскурсионные туры"
                fill
                sizes="(max-width: 1024px) 100vw, 33vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

              <div className="absolute top-6 inset-x-6 text-white">
                <h4 className="font-serif text-xl sm:text-2xl font-medium leading-snug">
                  {locale === "ru"
                    ? "Экскурсионные туры"
                    : locale === "hy"
                    ? "Էքսկուրսիոն տուրեր"
                    : "Guided Heritage Tours"}
                </h4>
                <p className="mt-2 text-xs text-white/80">
                  {locale === "ru"
                    ? "Впечатления, которые останутся навсегда"
                    : locale === "hy"
                    ? "Տպավորություններ, որոնք կմնան միշտ"
                    : "Memories that stay with you forever"}
                </p>
              </div>

              <div className="absolute bottom-6 left-6">
                <Link
                  href={`/${locale}/tours/group`}
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-xs font-bold text-[#161616] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  {locale === "ru" ? "Узнать больше" : locale === "hy" ? "Իմանալ ավելին" : "Learn more"}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
