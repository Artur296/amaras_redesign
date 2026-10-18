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
    <section className="mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12 py-10 sm:py-20 lg:py-28">
      {/* Header */}
      <div className="mb-6 sm:mb-12">
        <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#586EFF]">
          {locale === "ru"
            ? "ПОЧЕМУ ВЫБИРАЮТ AMARAS TOUR?"
            : locale === "hy"
            ? "ԻՆՉՈ՞Ւ ԸՆՏՐԵԼ AMARAS TOUR-Ը"
            : "WHY CHOOSE AMARAS TOUR?"}
        </span>
        <h2 className="mt-2 font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-[#1E1E1E]">
          {locale === "ru" ? (
            <>
              Ваше путешествие — <span className="text-[#586EFF]">наша забота</span>
            </>
          ) : locale === "hy" ? (
            <>
              Ձեր ճամփորդությունը՝ <span className="text-[#586EFF]">մեր հոգատարությունը</span>
            </>
          ) : (
            <>
              Your Journey — <span className="text-[#586EFF]">Our Care</span>
            </>
          )}
        </h2>
        <p className="mt-3 max-w-3xl text-sm sm:text-base text-neutral-600 leading-relaxed font-medium">
          {locale === "ru"
            ? "Мы создаём путешествия, в которых продумана каждая деталь, чтобы вы открывали Армению с комфортом, удовольствием и яркими впечатлениями."
            : locale === "hy"
            ? "Մենք ստեղծում ենք ճանապարհորդություններ, որտեղ մտածված է յուրաքանչյուր մանրուք, որպեսզի դուք բացահայտեք Հայաստանը հարմարավետությամբ, հաճույքով և վառ տպավորություններով։"
            : "We craft journeys where every detail is tailored, so you discover Armenia with comfort, joy, and unforgettable memories."}
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Card 1: Более 10 лет опыта (Electric Blue #586EFF) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#586EFF] p-5 sm:p-7 text-white shadow-xl min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black tracking-wider text-white backdrop-blur-md">
                01
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black leading-snug">
              {locale === "ru"
                ? "Более 10 лет опыта"
                : locale === "hy"
                ? "Ավելի քան 10 տարվա փորձ"
                : "10+ Years of Experience"}
            </h3>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
            {locale === "ru"
              ? "Знаем Армению, её историю, традиции и самые красивые места. Создаём интересные маршруты, чтобы каждое путешествие оставляло незабываемые впечатления."
              : locale === "hy"
              ? "Գիտենք Հայաստանը, նրա պատմությունը, ավանդույթներն ու ամենագեղեցիկ վայրերը։ Ստեղծում ենք հետաքրքիր երթուղիներ՝ անմոռանալի տպավորությունների համար։"
              : "We know Armenia, its history, traditions, and most stunning sights. We craft inspiring itineraries so every trip leaves unforgettable memories."}
          </p>
        </motion.div>

        {/* Card 2: Комфортные путешествия (Deep Blue #0E1A63) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#0E1A63] p-5 sm:p-7 text-white shadow-xl min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-black tracking-wider text-white backdrop-blur-md">
                02
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black leading-snug">
              {locale === "ru"
                ? "Комфортные путешествия"
                : locale === "hy"
                ? "Հարմարավետ ճամփորդություններ"
                : "Comfortable Journeys"}
            </h3>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-blue-200/90 leading-relaxed font-normal">
            {locale === "ru"
              ? "Экскурсии в мини-группах до 8 человек, группах до 19 человек и индивидуальные туры. Комфортный транспорт, профессиональные гиды, интересные истории и внимание к каждому гостю."
              : locale === "hy"
              ? "Էքսկուրսիաներ մինչև 8 հոգանոց մինի-խմբերով, մինչև 19 հոգանոց խմբերով և անհատական տուրեր։ Հարմարավետ տրանսպորտ, պրոֆեսիոնալ գիդեր և ուշադրություն յուրաքանչյուր հյուրին։"
              : "Excursions in mini-groups up to 8, groups up to 19, and private tours. Modern transport, certified guides, captivating stories, and personal attention."}
          </p>
        </motion.div>

        {/* Card 3: Честные цены — без скрытых доплат (Neon Lime #C7FF32) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2rem] bg-[#C7FF32] p-5 sm:p-7 text-[#161616] shadow-xl min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-black/15 px-3 py-1 text-xs font-black tracking-wider text-[#161616]">
                03
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/10 text-[#161616]">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black leading-snug text-[#161616]">
              {locale === "ru"
                ? "Честные цены — без скрытых доплат"
                : locale === "hy"
                ? "Ազնիվ գներ՝ առանց հավելավճարների"
                : "Honest Prices — No Hidden Fees"}
            </h3>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-[#161616]/85 leading-relaxed font-medium">
            {locale === "ru"
              ? "Вы заранее знаете стоимость экскурсии, что включено в программу и какие расходы оплачиваются отдельно. Прозрачные условия бронирования и никаких неприятных сюрпризов."
              : locale === "hy"
              ? "Դուք նախապես գիտեք արժեքը, ինչն է ներառված և ինչն է վճարվում առանձին։ Թափանցիկ պայմաններ և զրո տհաճ անակնկալներ։"
              : "You know the exact cost upfront, what is included, and any separate expenses. Transparent booking terms with zero unpleasant surprises."}
          </p>
        </motion.div>

        {/* Card 4: Забота о каждом госте (Neutral Light Slate) */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="relative flex flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[2rem] bg-neutral-100 border border-neutral-200/90 p-5 sm:p-7 text-[#1E1E1E] shadow-xl min-h-[220px]"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="rounded-full bg-neutral-200 px-3 py-1 text-xs font-black tracking-wider text-neutral-800">
                04
              </span>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm text-neutral-800">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-black leading-snug">
              {locale === "ru"
                ? "Забота о каждом госте"
                : locale === "hy"
                ? "Հոգատարություն յուրաքանչյուր հյուրի"
                : "Care for Every Guest"}
            </h3>
          </div>
          <p className="mt-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            {locale === "ru"
              ? "Мы рядом с вами на каждом этапе путешествия — от выбора маршрута до возвращения. Поможем с организацией, ответим на вопросы и позаботимся о вашем комфорте."
              : locale === "hy"
              ? "Մենք ձեր կողքին ենք ճամփորդության յուրաքանչյուր փուլում՝ երթուղու ընտրությունից մինչև վերադարձ։ Կօգնենք և կհոգանք ձեր հանգստի մասին։"
              : "We are beside you at every step — from route selection to your safe return. We assist with all arrangements and care for your comfort."}
          </p>
        </motion.div>
      </div>

      {/* Slogan Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-6 sm:mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-gradient-to-r from-neutral-50 via-white to-neutral-50 p-5 sm:p-7 shadow-sm"
      >
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <span className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#586EFF]/10 text-[#586EFF]">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <div>
            <p className="font-sans text-base sm:text-xl font-black text-[#1E1E1E]">
              {locale === "ru"
                ? "Amaras Tour — приезжай как гость, уезжай как друг!"
                : locale === "hy"
                ? "Amaras Tour — եկեք որպես հյուր, հեռացեք որպես ընկեր!"
                : "Amaras Tour — Come as a guest, leave as a friend!"}
            </p>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5">
              {locale === "ru"
                ? "Искреннее армянское гостеприимство, продуманные авторские маршруты и внимание к деталям"
                : locale === "hy"
                ? "Անկեղծ հայկական հյուրընկալություն, հեղինակային երթուղիներ և ուշադրություն մանրուքներին"
                : "Genuine Armenian hospitality, signature itineraries, and care in every detail"}
            </p>
          </div>
        </div>
        <Link
          href={`/${locale}/tours`}
          className="inline-flex shrink-0 items-center justify-center rounded-xl bg-[#586EFF] px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md transition-all hover:bg-[#465ae0] hover:shadow-lg"
        >
          {locale === "ru" ? "Выбрать путешествие" : locale === "hy" ? "Ընտրել տուրը" : "Explore Tours"}
        </Link>
      </motion.div>

      {/* Panoramic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-6 sm:mt-12 relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] min-h-[240px] sm:min-h-[440px] shadow-2xl group"
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
        <div className="absolute top-5 right-5 sm:top-8 sm:right-8 flex items-center gap-2 z-10">
          <span className="rounded-full bg-black/50 backdrop-blur-md px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-bold text-white/90 border border-white/20">
            {locale === "ru" ? "Горы и озера" : "Mountains & Lakes"}
          </span>
          <span className="rounded-full bg-[#586EFF] px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-black text-white shadow-md">
            {locale === "ru" ? "Армения" : "Armenia"}
          </span>
        </div>

        {/* Content on the left */}
        <div className="absolute inset-0 p-6 sm:p-12 lg:p-16 flex flex-col justify-end max-w-2xl text-white">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
            {locale === "ru" ? "АВТОРСКИЙ ТУРИЗМ" : locale === "hy" ? "ՀԵՂԻՆԱԿԱՅԻՆ ՏՈՒՐԵՐ" : "SIGNATURE ESCAPES"}
          </span>
          <h3 className="mt-2 font-sans text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            {locale === "ru"
              ? "Тёплое солнце, горы и легендарный сервис"
              : locale === "hy"
              ? "Ջերմ արև, լեռներ և լեգենդար հյուրընկալություն"
              : "Warm Sun, Dramatic Peaks & Warm Hospitality"}
          </h3>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
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
