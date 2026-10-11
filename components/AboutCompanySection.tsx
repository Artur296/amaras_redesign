"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, MotionConfig } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function AboutCompanySection({ locale }: { locale: Locale }) {
  const content = {
    ru: {
      badge: "10+ ЛЕТ ОПЫТА В ЕРЕВАНЕ",
      title: "О компании Amaras Tour Armenia",
      p1: "Amaras Tour Armenia — туристическая компания с более чем 10-летним опытом работы в Ереване, специализирующаяся на организации экскурсий и путешествий по всей Армении.",
      p2: "Компания предлагает групповые и индивидуальные туры, джип-туры, фототуры, многодневные турпакеты под ключ, трансферы и транспортные услуги комфорт- и премиум-класса, а также профессиональную фото- и видеосъёмку, включая аэросъёмку с дрона.",
      chips: [
        "Групповые & частные туры",
        "Джип-туры 4x4",
        "Фототуры & видео с дрона",
        "Турпакеты под ключ",
        "Комфорт- и премиум трансфер",
        "Лицензированные гиды",
      ],
      toursBtn: "Смотреть туры",
      contactBtn: "Связаться с нами",
      statsExp: "10+ лет",
      statsExpLabel: "успешной работы в Ереване",
      statsHappy: "15 000+",
      statsHappyLabel: "довольных гостей со всего мира",
    },
    hy: {
      badge: "10+ ՏԱՐՎԱ ՓՈՐՁ ԵՐԵՎԱՆՈՒՄ",
      title: "Amaras Tour Armenia ընկերության մասին",
      p1: "Amaras Tour Armenia-ն Երևանում ավելի քան 10 տարվա աշխատանքային փորձ ունեցող տուրիստական ընկերություն է, որը մասնագիտացած է ողջ Հայաստանով էքսկուրսիաների և ճանապարհորդությունների կազմակերպման մեջ։",
      p2: "Ընկերությունն առաջարկում է խմբային և անհատական տուրեր, ջիպ-տուրեր, ֆոտոտուրեր, բազմօրյա տուր-փաթեթներ «բանալին ձեռքին», կոմֆորտ և պրեմիում դասի տրանսֆերներ ու տրանսպորտային ծառայություններ, ինչպես նաև պրոֆեսիոնալ ֆոտո և վիդեոնկարահանում՝ ներառյալ աերոնկարահանում դրոնով։",
      chips: [
        "Խմբային և անհատական տուրեր",
        "Ջիպ-տուրեր 4x4",
        "Ֆոտոտուրեր և դրոնով նկարահանում",
        "Տուրփաթեթներ «բանալին ձեռքին»",
        "Կոմֆորտ և պրեմիում տրանսֆեր",
        "Պրոֆեսիոնալ գիդեր",
      ],
      toursBtn: "Դիտել տուրերը",
      contactBtn: "Կապվել մեզ հետ",
      statsExp: "10+ տարի",
      statsExpLabel: "աշխատանքային փորձ Երևանում",
      statsHappy: "15 000+",
      statsHappyLabel: "գոհ ճամփորդներ աշխարհից",
    },
    en: {
      badge: "10+ YEARS EXPERIENCE IN YEREVAN",
      title: "About Amaras Tour Armenia",
      p1: "Amaras Tour Armenia is a premier travel company based in Yerevan with over 10 years of experience, specializing in organizing tours and guided journeys across Armenia.",
      p2: "The company offers group and private excursions, 4x4 jeep expeditions, photo tours, turnkey multi-day tour packages, comfort and executive transfers, as well as professional photography and drone aerial videography.",
      chips: [
        "Group & Private Tours",
        "4x4 Jeep Expeditions",
        "Photo Tours & Drone Footage",
        "Turnkey Tour Packages",
        "Comfort & Executive Transfers",
        "Licensed Expert Guides",
      ],
      toursBtn: "Explore Tours",
      contactBtn: "Contact Us",
      statsExp: "10+ Years",
      statsExpLabel: "of hospitality in Yerevan",
      statsHappy: "15,000+",
      statsHappyLabel: "happy travelers worldwide",
    },
  }[locale];

  return (
    <MotionConfig reducedMotion="user">
      <section
        className="relative overflow-hidden bg-[#1E1E1E] py-16 sm:py-24 lg:py-28 text-[#FCFCF7]"
        id="about-company"
      >
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute -left-32 top-1/3 h-[420px] w-[420px] rounded-full bg-[#C7FF32]/8 blur-[150px]" />
        <div className="pointer-events-none absolute -right-32 bottom-1/4 h-[420px] w-[420px] rounded-full bg-[#586EFF]/12 blur-[160px]" />

        <div className="relative z-10 mx-auto max-w-[1360px] px-5 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* LEFT COLUMN: Editorial Story & Services */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 flex flex-col items-start"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3.5 py-1.5 sm:px-4 sm:py-1.5 backdrop-blur-md shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
                <span className="text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
                  {content.badge}
                </span>
              </div>

              {/* Section Heading */}
              <h2 className="mt-4 sm:mt-5 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFCF7] leading-[1.12]">
                {content.title}
              </h2>

              {/* Lead Paragraph */}
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-[#FCFCF7] font-medium">
                {content.p1}
              </p>

              {/* Second Paragraph */}
              <p className="mt-3.5 text-sm sm:text-base leading-relaxed text-[#FCFCF7]/80 font-normal">
                {content.p2}
              </p>

              {/* Service Chips */}
              <div className="mt-6 flex flex-wrap gap-2 sm:gap-2.5">
                {content.chips.map((chip, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 sm:px-3.5 sm:py-1.5 text-xs font-bold text-white/90 backdrop-blur-sm transition-colors hover:border-[#C7FF32]/50 hover:bg-[#C7FF32]/10 hover:text-[#C7FF32]"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#C7FF32]" />
                    <span>{chip}</span>
                  </span>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href={`/${locale}/tours`}
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl sm:rounded-2xl bg-[#C7FF32] px-7 py-3.5 sm:px-8 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-[0_10px_25px_rgba(199,255,50,0.3)] transition-all hover:bg-[#b8f226] hover:scale-105 active:scale-95 text-center"
                >
                  <span>{content.toursBtn}</span>
                  <span className="text-base font-black">→</span>
                </Link>

                <Link
                  href={`/${locale}/contacts`}
                  className="inline-flex items-center justify-center rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 sm:px-7 sm:py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-white backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/40 active:scale-95 text-center"
                >
                  <span>{content.contactBtn}</span>
                </Link>
              </div>
            </motion.div>

            {/* RIGHT COLUMN: Visual Poster Card & Trust Pillars */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-white/15 bg-neutral-900 shadow-2xl aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] group">
                <Image
                  src="/images/hero-travellers.jpg"
                  alt="Amaras Tour Armenia"
                  fill
                  sizes="(max-width: 1024px) 100vw, 42vw"
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/20 pointer-events-none" />

                {/* Top Badge on Photo */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <span className="rounded-full bg-black/60 px-3 py-1 text-[11px] font-black uppercase tracking-wider text-[#C7FF32] backdrop-blur-md border border-white/10">
                    Amaras Tour
                  </span>
                  <div className="flex items-center gap-1 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-[#C7FF32] backdrop-blur-md border border-white/10">
                    <span>★</span>
                    <span className="text-white">5.0</span>
                  </div>
                </div>

                {/* Bottom Trust Stat Strip */}
                <div className="absolute bottom-4 inset-x-4 sm:bottom-6 sm:inset-x-6 z-10 grid grid-cols-2 gap-3 p-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/15">
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-[#C7FF32] tracking-tight">
                      {content.statsExp}
                    </span>
                    <span className="block mt-0.5 text-[11px] sm:text-xs text-white/70 leading-snug">
                      {content.statsExpLabel}
                    </span>
                  </div>
                  <div>
                    <span className="block text-xl sm:text-2xl font-black text-white tracking-tight">
                      {content.statsHappy}
                    </span>
                    <span className="block mt-0.5 text-[11px] sm:text-xs text-white/70 leading-snug">
                      {content.statsHappyLabel}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}
