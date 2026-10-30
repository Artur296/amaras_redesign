"use client";

import { useState } from "react";
import type { Locale, Dict } from "@/lib/i18n";
import { PhoneIcon } from "@/components/icons";
import TourPriceCalculator, { type CalculatedBookingData } from "@/components/TourPriceCalculator";
import BookingModal from "@/components/BookingModal";
import type { Tour } from "@/lib/tours";

type Props = {
  tour: Tour;
  locale: Locale;
  dict: Dict;
  phone: string;
  code: string;
  duration: string;
  groupSize: string;
  discount: number | null;
  isPackage: boolean;
};

export default function TourBookingSection({
  tour,
  locale,
  dict,
  phone,
  code,
  duration,
  groupSize,
  discount,
  isPackage,
}: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [calculatedData, setCalculatedData] = useState<CalculatedBookingData | null>(null);

  const handleBookFromCalculator = (data: CalculatedBookingData) => {
    setCalculatedData(data);
    setModalOpen(true);
  };

  const cleanPhone = phone.replace(/\s+/g, "");

  return (
    <div className="space-y-6">
      {/* Interactive Tour Price Calculator */}
      <TourPriceCalculator
        tour={tour}
        locale={locale}
        onBook={handleBookFromCalculator}
      />

      {/* Tour Code & Operator Callout */}
      <div className="flex items-center justify-between rounded-2xl bg-white border border-[#EAE9E0] px-4 py-3 text-xs shadow-xs">
        <span className="text-[#6B6967] font-semibold">
          {locale === "ru"
            ? "Код экскурсии оператору:"
            : locale === "hy"
            ? "Տուրի կոդը օպերատորին․"
            : "Tour code for operator:"}
        </span>
        <span className="font-mono font-black text-[#312F2F] text-sm bg-[#F6F5EE] px-2.5 py-1 rounded-lg border border-black/10">
          #{code}
        </span>
      </div>

      {/* Direct Phone Call */}
      <div className="text-center pt-1">
        <a
          href={`tel:${cleanPhone}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#6B6967] hover:text-[#586EFF] transition-colors"
        >
          <PhoneIcon className="h-4 w-4 text-[#586EFF]" />
          <span>
            {locale === "ru"
              ? "Или позвоните нам:"
              : locale === "hy"
              ? "Կամ զանգահարեք մեզ՝"
              : "Or call us directly:"}{" "}
            <span className="text-[#312F2F] font-black">{phone}</span>
          </span>
        </a>
      </div>

      {/* Trust Badges */}
      <div className="rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-4 text-[11px] sm:text-xs text-[#6B6967] space-y-2">
        <p className="flex items-center gap-2 font-medium">
          <span className="text-[#586EFF] font-bold">✓</span>
          <span>
            {locale === "ru"
              ? "Гарантия выезда в выбранную дату"
              : locale === "hy"
              ? "Երաշխավորված մեկնում նշված օրը"
              : "Guaranteed departure on your date"}
          </span>
        </p>
        <p className="flex items-center gap-2 font-medium">
          <span className="text-[#586EFF] font-bold">✓</span>
          <span>
            {locale === "ru"
              ? "Бесплатная отмена за 48 часов до выезда"
              : locale === "hy"
              ? "Անվճար չեղարկում մեկնումից 48 ժամ առաջ"
              : "Free cancellation up to 48h prior"}
          </span>
        </p>
        <p className="flex items-center gap-2 font-medium">
          <span className="text-[#586EFF] font-bold">✓</span>
          <span>
            {locale === "ru"
              ? "Опытные лицензированные гиды и водители"
              : locale === "hy"
              ? "Փորձառու լիցենզավորված գիդեր և վարորդներ"
              : "Experienced licensed guides and chauffeurs"}
          </span>
        </p>
      </div>

      {/* Booking Modal with Calculated Data */}
      <BookingModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        locale={locale}
        tourTitle={tour.title[locale]}
        calculatedData={calculatedData}
      />
    </div>
  );
}
