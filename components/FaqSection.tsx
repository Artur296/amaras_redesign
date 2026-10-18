"use client";

import { useState } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";
import { faqs, faqCategories, type FaqItem, type FaqCategoryKey } from "@/lib/faqs";
import { useLinks } from "@/components/SiteProvider";
import { WhatsAppIcon, TelegramIcon } from "@/components/icons";

export type { FaqItem };
export { faqs };

const SECTION_I18N = {
  ru: {
    badge: "ЧАСТЫЕ ВОПРОСЫ",
    title: "Всё, что нужно знать перед путешествием с Amaras Tour",
    subtitle:
      "Мы позаботились о том, чтобы подготовка к путешествию была простой и понятной. Здесь вы найдёте ответы на вопросы о бронировании, оплате, организации экскурсий и других важных деталях. Если вам понадобится дополнительная информация, наша команда всегда готова помочь.",
    allTab: "Все вопросы",
    ctaTitle: "Остались вопросы? Мы рядом!",
    ctaSubtitle:
      "Не нашли нужную информацию или хотите обсудить особенный маршрут? Напишите нашей команде — мы поможем выбрать экскурсию и ответим на ваши вопросы.",
    btnWhatsapp: "Написать в WhatsApp",
    btnTelegram: "Написать в Telegram",
    btnChooseTour: "Выбрать экскурсию",
    showMore: "Показать больше",
    showLess: "Свернуть",
  },
  hy: {
    badge: "ՀԱՃԱԽ ՏՐՎՈՂ ՀԱՐՑԵՐ",
    title: "Ամեն ինչ, ինչ պետք է իմանալ Amaras Tour-ի հետ ճամփորդելուց առաջ",
    subtitle:
      "Մենք հոգ ենք տարել, որպեսզի ուղևորության նախապատրաստումը լինի պարզ և հասկանալի: Այստեղ կգտնեք պատասխաններ ամրագրման, վճարման, կազմակերպման և այլ կարևոր մանրամասների վերաբերյալ:",
    allTab: "Բոլոր հարցերը",
    ctaTitle: "Մնացի՞ն հարցեր: Մենք միշտ կապի մեջ ենք:",
    ctaSubtitle:
      "Չգտա՞ք ձեզ անհրաժեշտ տեղեկությունը կամ ցանկանո՞ւմ եք կազմել առանձնահատուկ երթուղի: Գրեք մեզ՝ սիրով կօգնենք ընտրել լավագույն տուրը:",
    btnWhatsapp: "Գրել WhatsApp-ում",
    btnTelegram: "Գրել Telegram-ում",
    btnChooseTour: "Ընտրել էքսկուրսիան",
    showMore: "Ցուցադրել ավելին",
    showLess: "Ծալել",
  },
  en: {
    badge: "FREQUENTLY ASKED QUESTIONS",
    title: "Everything You Need to Know Before Traveling With Amaras Tour",
    subtitle:
      "We've made trip preparation effortless and transparent. Find answers below on booking, payments, departures, and tour comfort. Need tailored advice? Our dedicated team is always ready to assist.",
    allTab: "All Questions",
    ctaTitle: "Still Have Questions? We're Here to Help!",
    ctaSubtitle:
      "Didn't find what you were looking for or wish to discuss a bespoke custom itinerary? Get in touch — we're delighted to answer your questions and assist with bookings.",
    btnWhatsapp: "Chat on WhatsApp",
    btnTelegram: "Chat on Telegram",
    btnChooseTour: "Explore Tours",
    showMore: "Show more",
    showLess: "Show less",
  },
};

export default function FaqSection({ locale }: { locale: Locale }) {
  const [openId, setOpenId] = useState<number | null>(1);
  const [selectedCategory, setSelectedCategory] = useState<FaqCategoryKey | "all">("all");
  const [showAll, setShowAll] = useState(false);
  const links = useLinks();

  const t = SECTION_I18N[locale] || SECTION_I18N.ru;

  const toggle = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFaqs =
    selectedCategory === "all"
      ? faqs
      : faqs.filter((f) => f.categoryKey === selectedCategory);

  const displayedFaqs = showAll ? filteredFaqs : filteredFaqs.slice(0, 3);
  const hasMore = filteredFaqs.length > 3;
  const remainingCount = filteredFaqs.length - 3;

  return (
    <section className="bg-white py-12 sm:py-20 lg:py-24 border-b border-[#EAE9E0]" id="faq">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#586EFF]/30 bg-[#586EFF]/10 px-4 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#586EFF]">
            {t.badge}
          </span>
          <h2 className="mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#312F2F]">
            {t.title}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#6B6967] leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="mt-8 sm:mt-10 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 pt-1 scrollbar-none snap-x touch-pan-x">
          <button
            type="button"
            onClick={() => {
              setSelectedCategory("all");
              setShowAll(false);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              selectedCategory === "all"
                ? "bg-[#312F2F] text-[#C7FF32] shadow-md scale-102"
                : "border border-[#EAE9E0] bg-[#FCFCF7] text-[#6B6967] hover:border-black/30 hover:text-[#312F2F]"
            }`}
          >
            {t.allTab} ({faqs.length})
          </button>

          {faqCategories.map((cat) => {
            const active = selectedCategory === cat.key;
            const count = faqs.filter((f) => f.categoryKey === cat.key).length;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.key);
                  setShowAll(false);
                }}
                className={`shrink-0 rounded-full px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  active
                    ? "bg-[#312F2F] text-[#C7FF32] shadow-md scale-102"
                    : "border border-[#EAE9E0] bg-[#FCFCF7] text-[#6B6967] hover:border-black/30 hover:text-[#312F2F]"
                }`}
              >
                {cat.title[locale]} ({count})
              </button>
            );
          })}
        </div>

        {/* Accordion Questions List */}
        <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
          {displayedFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            const q = faq.question[locale] || faq.question.ru;
            const a = faq.answer[locale] || faq.answer.ru;
            const catTitle = faq.category[locale] || faq.category.ru;

            return (
              <div
                key={faq.id}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#586EFF] bg-white shadow-lg shadow-[#586EFF]/5 ring-1 ring-[#586EFF]/20"
                    : "border-[#EAE9E0] bg-[#FCFCF7] hover:border-black/25"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(faq.id)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left cursor-pointer"
                >
                  <div className="flex-1 pr-1">
                    <span className="block text-[10px] sm:text-xs font-black uppercase tracking-wider text-[#586EFF] mb-1">
                      {catTitle} • #{faq.id}
                    </span>
                    <span className="font-heading text-base sm:text-xl tracking-wide uppercase text-[#312F2F] leading-snug">
                      {q}
                    </span>
                  </div>

                  <span
                    className={`flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full border text-sm sm:text-base font-bold transition-transform duration-200 mt-1 sm:mt-0 ${
                      isOpen
                        ? "rotate-180 border-[#586EFF] bg-[#586EFF] text-white shadow-sm"
                        : "border-[#EAE9E0] bg-white text-[#312F2F]"
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-2 sm:px-6 sm:pb-6 sm:pt-3 text-sm sm:text-base leading-relaxed text-[#555351] border-t border-[#EAE9E0]/70 whitespace-pre-line break-words bg-white">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#586EFF] bg-white px-7 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-[#586EFF] hover:bg-[#586EFF] hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95 cursor-pointer"
            >
              <span>
                {showAll
                  ? t.showLess
                  : `${t.showMore} (+${remainingCount})`}
              </span>
              <span
                className={`inline-block text-base transition-transform duration-200 ${
                  showAll ? "rotate-180" : ""
                }`}
              >
                ↓
              </span>
            </button>
          </div>
        )}

        {/* Closing Contact CTA Block */}
        <div className="mt-12 sm:mt-16 rounded-[2rem] border border-[#EAE9E0] bg-[#312F2F] p-6 sm:p-10 text-center text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto">
            <span className="inline-block rounded-full bg-[#C7FF32]/20 border border-[#C7FF32]/35 px-3 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32] mb-3">
              AMARAS 24/7 SUPPORT
            </span>
            <h3 className="font-serif text-2xl sm:text-4xl font-normal tracking-tight text-white">
              {t.ctaTitle}
            </h3>
            <p className="mt-2.5 text-xs sm:text-base text-white/80 leading-relaxed">
              {t.ctaSubtitle}
            </p>

            {/* 3 Action Buttons */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="w-5 h-5" />
                <span>{t.btnWhatsapp}</span>
              </a>

              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#229ED9] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <TelegramIcon className="w-5 h-5" />
                <span>{t.btnTelegram}</span>
              </a>

              <Link
                href={`/${locale}/tours`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#C7FF32] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-transform hover:bg-[#b8f226] hover:scale-105 active:scale-95"
              >
                <span>{t.btnChooseTour}</span>
                <span className="font-black">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
