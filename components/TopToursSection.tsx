"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import BookButton from "@/components/BookButton";

interface TourHighlight {
  id: string;
  tag: string;
  price: string;
  title: string;
  desc: string;
  leftImage: string;
  leftCaption: string;
  rightImage: string;
  rightCaption: string;
  href: string;
}

export default function TopToursSection({ locale }: { locale: Locale }) {
  const tours: TourHighlight[] = [
    {
      id: "ararat-noravank",
      tag: locale === "ru" ? "АРМЕНИЯ" : locale === "hy" ? "ՀԱՅԱՍՏԱՆ" : "ARMENIA",
      price: "15 000 ֏",
      title:
        locale === "ru"
          ? "Хор Вирап, Арени и Нораванк"
          : locale === "hy"
          ? "Խոր Վիրապ, Արենի և Նորավանք"
          : "Khor Virap, Areni & Noravank",
      desc:
        locale === "ru"
          ? "Легендарный вид на библейскую гору Арарат, дегустация автохтонных вин в пещере Арени и грандиозные красные скалы ущелья Нораванк. Путешествие на комфортабельном Mercedes Sprinter с профессиональным гидом."
          : locale === "hy"
          ? "Լեգենդար տեսարան դեպի բիբլիական Արարատ, գինու համտես Արենիում և Նորավանքի կարմիր ժայռերը։ Հարմարավետ Mercedes Sprinter և փորձառու գիդ։"
          : "Iconic view of biblical Mount Ararat, authentic wine tasting in Areni, and dramatic red cliffs of Noravank. Premium Mercedes Sprinter with private guide.",
      leftImage: "/images/khor-virap.jpg",
      leftCaption: locale === "ru" ? "Хор Вирап и Арарат" : "Khor Virap & Ararat",
      rightImage: "/images/noravank.jpg",
      rightCaption: locale === "ru" ? "Каньон Нораванк" : "Noravank Canyon",
      href: `/${locale}/tours/popular/khor-virap-areni-noravank-birds-cave`,
    },
    {
      id: "garni-geghard",
      tag: locale === "ru" ? "АРМЕНИЯ" : locale === "hy" ? "ՀԱՅԱՍՏԱՆ" : "ARMENIA",
      price: "12 000 ֏",
      title:
        locale === "ru"
          ? "Гарни, Гегард и Симфония Камней"
          : locale === "hy"
          ? "Գառնի, Գեղարդ և Քարերի Սիմֆոնիա"
          : "Garni, Geghard & Symphony of Stones",
      desc:
        locale === "ru"
          ? "Единственный сохранившийся языческий храм античности, монастырь Гегард в скале из списка ЮНЕСКО, базальтовые органные колонны и выпечка горячего традиционного лаваша в тандыре."
          : locale === "hy"
          ? "Անտիկ հեթանոսական տաճար, ժայռափոր Գեղարդավանք (ՅՈՒՆԵՍԿՕ), Քարերի Սիմֆոնիա և ավանդական թոնրի լավաշի թխում։"
          : "The sole Hellenistic temple in Caucasus, rock-cut Geghard Monastery (UNESCO), basalt cliff organ, and live traditional lavash baking.",
      leftImage: "/images/garni.jpg",
      leftCaption: locale === "ru" ? "Храм Гарни" : "Garni Temple",
      rightImage: "/images/sevan.jpg",
      rightCaption: locale === "ru" ? "Лазурный Севан" : "Lake Sevan",
      href: `/${locale}/tours/popular/garni-charents-arch-lavash-geghard`,
    },
    {
      id: "tatev-cable",
      tag: locale === "ru" ? "ЮГ АРМЕНИИ" : locale === "hy" ? "ՀԱՐԱՎԱՅԻՆ ՀԱՅԱՍՏԱՆ" : "SOUTH ARMENIA",
      price: "24 000 ֏",
      title:
        locale === "ru"
          ? "Крылья Татева, Водопад Шаки и Джермук"
          : locale === "hy"
          ? "Տաթևի թևեր, Շաքիի ջրվեժ և Ջերմուկ"
          : "Wings of Tatev, Shaki Waterfall & Jermuk",
      desc:
        locale === "ru"
          ? "Самая длинная в мире реверсивная канатная дорога над 320-метровой бездной ущелья Воротан, средневековая монашеская цитадель Татев и целебные минеральные гейзеры курорта Джермук."
          : locale === "hy"
          ? "Աշխարհի ամենաերկար հետադարձ ճոպանուղին Որոտանի կիրճի վրայով, Տաթևի միջնադարյան վանական համալիրը և Ջերմուկի հանքային աղբյուրները։"
          : "The world's longest reversible aerial tramway soaring above Vorotan gorge, medieval Tatev sanctuary, and mineral hot springs.",
      leftImage: "/images/tatev.jpg",
      leftCaption: locale === "ru" ? "Крылья Татева" : "Wings of Tatev",
      rightImage: "/images/azhdahak.jpg",
      rightCaption: locale === "ru" ? "Горные перевалы" : "Highland Passes",
      href: `/${locale}/tours/popular/khor-virap-areni-noravank-birds-cave`,
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentTour = tours[currentIndex];

  const nextTour = () => setCurrentIndex((prev) => (prev + 1) % tours.length);
  const prevTour = () => setCurrentIndex((prev) => (prev - 1 + tours.length) % tours.length);

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A] py-24 sm:py-32 text-white">
      {/* Subtle background glow */}
      <div className="pointer-events-none absolute left-1/2 top-10 -translate-x-1/2 h-[450px] w-[750px] rounded-full bg-[#EA1D24]/10 blur-[160px]" />

      <div className="relative z-10 mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8">
        {/* Section Header: Styled exactly like the user's mockup */}
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-sans text-5xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-md">
            TOP TOURS
          </h2>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-400">
            {locale === "ru"
              ? "Лучшие авторские и групповые экскурсии по Армении. Завораживающие горные панорамы, тысячелетние храмы и безупречный сервис Amaras Tours."
              : locale === "hy"
              ? "Լավագույն հեղինակային և խմբային տուրերը Հայաստանում։ Լեռնային հիասքանչ տեսարաններ, դարավոր վանքեր և անթերի սպասարկում։"
              : "Signature guided excursions across Armenia. Dramatic mountain vistas, ancient monasteries, and premium hospitality by Amaras Tours."}
          </p>

          {/* Dots / arrows control */}
          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={prevTour}
              aria-label="Previous tour"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-white transition-colors hover:border-[#EA1D24] hover:bg-[#EA1D24] cursor-pointer"
            >
              ‹
            </button>
            <div className="flex gap-2">
              {tours.map((t, idx) => (
                <button
                  key={t.id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? "w-8 bg-[#EA1D24]" : "w-2.5 bg-neutral-700 hover:bg-neutral-500"
                  }`}
                  aria-label={`Go to tour ${idx + 1}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={nextTour}
              aria-label="Next tour"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900/80 text-white transition-colors hover:border-[#EA1D24] hover:bg-[#EA1D24] cursor-pointer"
            >
              ›
            </button>
          </div>
        </div>

        {/* 3-Column Showcase matching reference image */}
        <div className="mt-12 sm:mt-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTour.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
            >
              {/* Left Column: Scenic Image */}
              <div className="lg:col-span-4 order-2 lg:order-1">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl group">
                  <Image
                    src={currentTour.leftImage}
                    alt={currentTour.leftCaption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-bold text-neutral-300 tracking-wider">
                    {currentTour.leftCaption}
                  </span>
                </div>
              </div>

              {/* Center Column: Highlighted Red Box + Details */}
              <div className="lg:col-span-4 order-1 lg:order-2 flex flex-col items-center text-center">
                {/* Red Header Banner: USA $299 style */}
                <div className="w-full flex items-center justify-between rounded-t-xl bg-[#EA1D24] px-6 py-4 shadow-lg">
                  <span className="font-sans text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    {currentTour.tag}
                  </span>
                  <span className="font-sans text-2xl sm:text-3xl font-black text-white">
                    {currentTour.price}
                  </span>
                </div>

                {/* Body Content */}
                <div className="w-full rounded-b-xl border border-t-0 border-neutral-800 bg-neutral-900/90 p-6 sm:p-7 backdrop-blur-md shadow-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-sans text-xl sm:text-2xl font-black text-white tracking-tight">
                      {currentTour.title}
                    </h3>
                    <p className="mt-3 text-xs sm:text-sm leading-relaxed text-neutral-300 text-left">
                      {currentTour.desc}
                    </p>
                  </div>

                  <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={currentTour.href}
                      className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-black transition-all hover:bg-neutral-200"
                    >
                      {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "View Tour"}
                    </Link>
                    <BookButton
                      label={locale === "ru" ? "Забронировать" : locale === "hy" ? "Ամրագրել" : "Book Now"}
                      message={`Здравствуйте! Хочу забронировать тур: ${currentTour.title}`}
                      variant="accent"
                      size="md"
                      className="w-full sm:w-auto"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column: Scenic Landscape Image */}
              <div className="lg:col-span-4 order-3">
                <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3] overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl group">
                  <Image
                    src={currentTour.rightImage}
                    alt={currentTour.rightCaption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-bold text-neutral-300 tracking-wider">
                    {currentTour.rightCaption}
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
