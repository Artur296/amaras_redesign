"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function NoFinePrintCards({
  locale,
  bannerImage,
}: {
  locale: Locale;
  bannerImage?: string;
}) {
  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      {/* Header matching Screenshot 5 */}
      <div className="mb-12">
        <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
          ПОЧЕМУ AMARAS TOURS
        </span>
        <h2 className="mt-2 font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-[#1E1E1E]">
          {locale === "ru" ? (
            <>
              Отдых <span className="text-[#586EFF]">без мелкого шрифта</span>
            </>
          ) : locale === "hy" ? (
            <>
              Հանգիստ <span className="text-[#586EFF]">առանց մանր տառերի</span>
            </>
          ) : (
            <>
              Travel <span className="text-[#586EFF]">with zero fine print</span>
            </>
          )}
        </h2>
      </div>

      {/* 4 Cards Row matching Screenshot 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Electric Blue #586EFF */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#586EFF] p-7 sm:p-8 text-white shadow-xl min-h-[220px]"
        >
          <div className="flex items-start justify-between">
            <h3 className="font-sans text-xl sm:text-2xl font-black">
              {locale === "ru" ? "Цены напрямую" : locale === "hy" ? "Ուղիղ գներ" : "Direct Rates"}
            </h3>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </span>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-blue-100 leading-relaxed font-medium">
            {locale === "ru"
              ? "От проверенных отелей и прямых организаторов, без скрытых агентских наценок."
              : locale === "hy"
              ? "Ուղիղ համագործակցություն հյուրանոցների հետ՝ առանց միջնորդավճարների։"
              : "Direct supplier rates with zero hidden markups or agent commissions."}
          </p>
        </motion.div>

        {/* Card 2: Deep Blue #1E2875 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-[#0E1A63] p-7 sm:p-8 text-white shadow-xl min-h-[220px]"
        >
          <div className="flex items-start justify-between">
            <h3 className="font-sans text-xl sm:text-2xl font-black">
              {locale === "ru" ? "Гарантия цены" : locale === "hy" ? "Գնի երաշխիք" : "Price Guarantee"}
            </h3>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md text-white">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </span>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-blue-200/90 leading-relaxed font-medium">
            {locale === "ru"
              ? "Забронировали — и стоимость зафиксирована. Честно, без доплат в пути."
              : locale === "hy"
              ? "Ամրագրեցիք՝ գինը չի փոխվում։ Ազնիվ և առանց հավելյալ ծախսերի։"
              : "Locked-in pricing upon confirmation. No surprise fees during the journey."}
          </p>
        </motion.div>

        {/* Card 3: Light Lime Card #C7FF32 with Big Metric */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-col items-center justify-center text-center overflow-hidden rounded-[2rem] bg-[#C7FF32] p-7 sm:p-8 text-[#161616] shadow-xl min-h-[220px]"
        >
          <div>
            <span className="font-sans text-5xl sm:text-6xl font-black tracking-tight text-[#161616]">
              50+
            </span>
            <span className="block mt-2 text-xs font-black uppercase tracking-wider text-[#161616]/80">
              {locale === "ru"
                ? "ТУРИСТИЧЕСКИХ НАПРАВЛЕНИЙ"
                : locale === "hy"
                ? "ԶԲՈՍԱՇՐՋԱՅԻՆ ՈՒՂՂՈՒԹՅՈՒՆ"
                : "CURATED DESTINATIONS"}
            </span>
          </div>
        </motion.div>

        {/* Card 4: Soft Slate Card with Headphone Icon */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-[2rem] bg-neutral-100 border border-neutral-200/80 p-7 sm:p-8 text-[#1E1E1E] shadow-xl min-h-[220px]"
        >
          <div className="flex items-start justify-between">
            <h3 className="font-sans text-xl sm:text-2xl font-black">
              {locale === "ru" ? "Поддержка 24/7" : locale === "hy" ? "Աջակցություն 24/7" : "Support 24/7"}
            </h3>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm text-neutral-800">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
          </div>
          <p className="mt-6 text-xs sm:text-sm text-neutral-600 leading-relaxed font-medium">
            {locale === "ru"
              ? "Живые координаторы на связи до, во время и после завершения поездки."
              : locale === "hy"
              ? "Կոորդինատորը կապի մեջ է ուղևորությունից առաջ, ընթացքում և հետո։"
              : "Dedicated human support before, throughout, and after your trip."}
          </p>
        </motion.div>
      </div>

      {/* Panoramic Card (From Screenshot 4: "Тёплое солнце, горы и сервис") */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-12 relative overflow-hidden rounded-[2.5rem] min-h-[380px] sm:min-h-[440px] shadow-2xl group"
      >
        <Image
          src={bannerImage || "/images/noravank.jpg"}
          alt="Отдых в Армении"
          fill
          sizes="100vw"
          className="object-cover object-center transition-transform duration-1000 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent" />

        {/* Top Right Filter Tags */}
        <div className="absolute top-6 right-6 sm:top-8 sm:right-8 flex items-center gap-2 z-10">
          <span className="rounded-full bg-black/50 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white/90 border border-white/20">
            {locale === "ru" ? "Горы и озера" : "Mountains & Lakes"}
          </span>
          <span className="rounded-full bg-[#586EFF] px-3.5 py-1 text-xs font-black text-white shadow-md">
            {locale === "ru" ? "Армения" : "Armenia"}
          </span>
        </div>

        {/* Content on the left */}
        <div className="absolute inset-0 p-8 sm:p-12 lg:p-16 flex flex-col justify-end max-w-2xl text-white">
          <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
            {locale === "ru" ? "АВТОРСКИЙ ТУРИЗМ" : locale === "hy" ? "ՀԵՂԻՆԱԿԱՅԻՆ ՏՈՒՐԵՐ" : "SIGNATURE ESCAPES"}
          </span>
          <h3 className="mt-2 font-sans text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {locale === "ru"
              ? "Тёплое солнце, горы и легендарный сервис"
              : locale === "hy"
              ? "Ջերմ արև, լեռներ և լեգենդար հյուրընկալություն"
              : "Warm Sun, Dramatic Peaks & Warm Hospitality"}
          </h3>
          <p className="mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
            {locale === "ru"
              ? "Направления для романтического отдыха вдвоем, семейных каникул и незабываемых путешествий по всей Армении."
              : "Curated routes for couples, family holidays, and unforgettable journeys across Armenia."}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 border border-white/15">
              Севан
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 border border-white/15">
              Дилижан
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/80 border border-white/15">
              Джермук
            </span>
            <Link
              href={`/${locale}/tours`}
              className="ml-2 inline-flex items-center justify-center rounded-xl border border-white/40 bg-black/40 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:border-white"
            >
              {locale === "ru" ? "СМОТРЕТЬ ТУРЫ" : locale === "hy" ? "ԴԻՏԵԼ ՏՈՒՐԵՐԸ" : "EXPLORE TOURS"}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
