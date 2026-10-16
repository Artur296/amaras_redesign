"use client";

import { useState } from "react";
import type { Locale } from "@/lib/i18n";
import { faqs, type FaqItem } from "@/lib/faqs";

export type { FaqItem };
export { faqs };

export default function FaqSection({ locale }: { locale: Locale }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  const badgeText =
    locale === "ru"
      ? "ЧАСТЫЕ ВОПРОСЫ"
      : locale === "hy"
      ? "ՀԱՃԱԽ ՏՐՎՈՂ ՀԱՐՑԵՐ"
      : "FREQUENTLY ASKED QUESTIONS";

  const titleText =
    locale === "ru"
      ? "Все о поездках по Армении с AMARAS"
      : locale === "hy"
      ? "Ամեն ինչ AMARAS-ի տուրերի մասին"
      : "Everything About Armenia Tours With AMARAS";

  const subText =
    locale === "ru"
      ? "Ответы на главные вопросы о бронировании, оплате, транспорте и безопасности вашего путешествия."
      : locale === "hy"
      ? "Պատասխաններ ամրագրման, վճարման, տրանսպորտի և անվտանգության հիմնական հարցերին։"
      : "Everything you need to know about booking, vehicles, payment options, and safety.";

  return (
    <section className="bg-white py-10 sm:py-20 border-b border-[#EAE9E0]" id="faq">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#586EFF]/30 bg-[#586EFF]/10 px-3.5 sm:px-4 py-1 text-[11px] sm:text-xs font-black uppercase tracking-[0.2em] text-[#586EFF]">
            {badgeText}
          </span>
          <h2 className="mt-3 font-heading text-2xl sm:text-4xl lg:text-5xl tracking-wide uppercase text-[#312F2F]">
            {titleText}
          </h2>
          <p className="mt-2.5 sm:mt-3 text-xs sm:text-base text-[#6B6967] max-w-2xl mx-auto leading-relaxed">
            {subText}
          </p>
        </div>

        <div className="mt-8 sm:mt-12 space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            const q = faq.question[locale] || faq.question.ru;
            const a = faq.answer[locale] || faq.answer.ru;

            return (
              <div
                key={index}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-[#586EFF] bg-[#586EFF]/[0.03] shadow-md shadow-[#586EFF]/5"
                    : "border-[#EAE9E0] bg-[#FCFCF7] hover:border-black/20"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 text-left"
                >
                  <span className="font-heading text-base sm:text-xl tracking-wide uppercase text-[#312F2F] leading-snug">
                    {q}
                  </span>
                  <span
                    className={`flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full border text-sm sm:text-base font-bold transition-transform duration-200 ${
                      isOpen
                        ? "rotate-180 border-[#586EFF] bg-[#586EFF] text-white"
                        : "border-[#EAE9E0] bg-white text-[#312F2F]"
                    }`}
                  >
                    ↓
                  </span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-5 pt-3 sm:px-6 sm:pb-6 sm:pt-4 text-xs sm:text-base leading-relaxed text-[#6B6967] border-t border-[#EAE9E0]/50">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
