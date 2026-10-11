"use client";

import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n";

export default function AdvantagesGrid({ locale }: { locale: Locale }) {
  const advantages = [
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Более 5 000" : locale === "hy" ? "Ավելի քան 5 000" : "Over 5,000",
      title: locale === "ru" ? "довольных туристов на отдыхе" : locale === "hy" ? "գոհ զբոսաշրջիկ" : "Happy travelers guided",
      desc: locale === "ru" ? "Организовали безупречный отдых и яркие эмоции" : "Curated memorable holidays across Armenia",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Онлайн-бронь" : locale === "hy" ? "Օնլայն ամրագրում" : "Online booking",
      title: locale === "ru" ? "и моментальная связь" : locale === "hy" ? "և ակնթարթային կապ" : "in under 1 minute",
      desc: locale === "ru" ? "Без очередей и визитов в офис: бронируйте в 1 клик" : "Direct WhatsApp & Telegram confirmation",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Честная цена" : locale === "hy" ? "Ազնիվ գներ" : "Direct rates",
      title: locale === "ru" ? "на любой кошелек" : locale === "hy" ? "ցանկացած բյուջեի համար" : "for every travel budget",
      desc: locale === "ru" ? "От групповых поездок от 10 000 ֏ до VIP-туров" : "From budget friendly groups to luxury VIP",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Официальный" : locale === "hy" ? "Պաշտոնական" : "Licensed",
      title: locale === "ru" ? "член реестров туроператоров" : locale === "hy" ? "տուրօպերատոր" : "tour operator in Armenia",
      desc: locale === "ru" ? "Полная безопасность, лицензии и страховка" : "Fully verified legal partner with insurance",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Профессиональные" : locale === "hy" ? "Պրոֆեսիոնալ" : "Certified",
      title: locale === "ru" ? "гиды и консультанты" : locale === "hy" ? "գիդեր և էքսկուրսավարներ" : "local storytellers",
      desc: locale === "ru" ? "Живые захватывающие истории на 3 языках" : "Fluent in Russian, Armenian & English",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      highlight: locale === "ru" ? "Премиум-транспорт" : locale === "hy" ? "Պրեմիում տրանսպորտ" : "Modern fleet",
      title: locale === "ru" ? "Mercedes и внедорожники 4x4" : locale === "hy" ? "Mercedes և 4x4 ջիպեր" : "Mercedes Sprinter & 4x4 SUVs",
      desc: locale === "ru" ? "Климат-контроль, панорамные окна и вода" : "Full A/C, panoramic view and comfort",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Служба поддержки" : locale === "hy" ? "Աջակցության ծառայություն" : "24/7 Support",
      title: locale === "ru" ? "на связи 24/7" : locale === "hy" ? "24/7 ռեժիմով" : "always at your side",
      desc: locale === "ru" ? "Персональный менеджер отвечает за 5 минут" : "Prompt personal assistant during journey",
    },
    {
      icon: (
        <svg className="h-8 w-8 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      highlight: locale === "ru" ? "Без предоплаты" : locale === "hy" ? "Առանց կանխավճարի" : "Zero prepayment",
      title: locale === "ru" ? "оплата в день поездки" : locale === "hy" ? "վճարում տեղում" : "pay on tour day",
      desc: locale === "ru" ? "Гибкие условия отмены и бронирования" : "Stress-free booking and free cancellations",
    },
  ];

  return (
    <section className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
      <div className="mb-12 sm:mb-16">
        <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#312F2F]">
          {locale === "ru"
            ? "Наши преимущества"
            : locale === "hy"
            ? "Մեր առավելությունները"
            : "Why Travel With Us"}
        </h2>
      </div>

      {/* 8-Item Grid: 2 rows of 4 columns matching Screenshot 3 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {advantages.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.06 }}
            className="flex flex-col items-start space-y-3"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#586EFF]/10 border border-[#586EFF]/20 shadow-sm">
              {item.icon}
            </div>
            <div>
              <p className="text-base font-bold text-[#1E1E1E] leading-snug">
                <span className="text-[#586EFF] font-black">{item.highlight}</span>{" "}
                {item.title}
              </p>
              <p className="mt-1.5 text-xs text-neutral-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
