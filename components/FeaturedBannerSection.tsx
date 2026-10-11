"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function FeaturedBannerSection({ locale }: { locale: Locale }) {
  return (
    <section className="relative w-full overflow-hidden bg-black py-28 sm:py-36 text-white">
      {/* Full-width scenic background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/package-sevan.jpg"
          alt="The Best Resort in Armenia"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Dark overlay for rich contrast and readable typography */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/40" />
      </div>

      {/* Centered Content: Meticulously formatted to match user mockup */}
      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Top kicker */}
          <span className="block font-sans text-xs sm:text-sm font-black uppercase tracking-[0.28em] text-[#EA1D24]">
            {locale === "ru" ? "НЕДЕЛЯ В" : locale === "hy" ? "ՄԵԿ ՇԱԲԱԹ" : "WEEK IN"}
          </span>

          {/* Giant condensed bold headline */}
          <h2 className="mt-3 font-sans text-4xl sm:text-6xl lg:text-7xl font-black uppercase tracking-tight text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            {locale === "ru"
              ? "THE BEST BEACH & MOUNTAIN RESORTS"
              : locale === "hy"
              ? "ԼԱՎԱԳՈՒՅՆ ԼԵՌՆԱՅԻՆ ՀՅՈՒՐԱՆՈՑՆԵՐԸ"
              : "THE BEST BEACH HOTEL"}
          </h2>

          {/* Subtitle lead text */}
          <p className="mx-auto mt-4 max-w-2xl text-xs sm:text-base leading-relaxed text-neutral-200 drop-shadow-md">
            {locale === "ru"
              ? "Эксклюзивный отдых на лазурном побережье Севана и среди реликтовых лесов Дилижана. Проживание в лучших отелях, яхтенные прогулки, спа-комплексы и персональные гастрономические ужины."
              : locale === "hy"
              ? "Բացառիկ հանգիստ Սևանի լազուր ափերին և Դիլիջանի անտառներում։ Լավագույն հյուրանոցներ, նավով զբոսանք, սպա և անհատական սպասարկում։"
              : "Signature relaxation along the azure shores of Lake Sevan and pristine pine forests of Dilijan. Premium resort stays, private sailing, spa, and gourmet dining."}
          </p>

          {/* Red bordered Read More button matching user mockup */}
          <div className="mt-8 flex justify-center">
            <Link
              href={`/${locale}/tour-packages`}
              className="inline-flex items-center justify-center rounded-lg border-2 border-[#EA1D24] bg-black/40 px-8 py-3 text-xs sm:text-sm font-black uppercase tracking-widest text-white backdrop-blur-md transition-all duration-300 hover:bg-[#EA1D24] hover:shadow-[0_0_30px_rgba(234,29,36,0.5)] active:scale-95"
            >
              {locale === "ru" ? "Подробнее" : locale === "hy" ? "Մանրամասն" : "Read More"}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
