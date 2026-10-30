"use client";

import { useState, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import { formatPrice, isPackageTour, type Tour } from "@/lib/tours";

export type CalculatedBookingData = {
  tourTitle: string;
  tourCode?: string;
  date: string;
  departureTime?: string;
  adults: number;
  children: number;
  infants: number;
  totalParticipants: number;
  guideLanguage: string;
  transportId: string;
  transportName: string;
  transportPrice: number;
  selectedServices: { id: string; name: string; price: number }[];
  hotelTier?: number;
  basePricePerAdult: number;
  basePricePerChild: number;
  totalPrice: number;
  breakdown: string[];
};

type Props = {
  tour: Tour;
  locale: Locale;
  onBook: (data: CalculatedBookingData) => void;
  className?: string;
};

// Transport options for day tours
const TRANSPORT_OPTIONS = [
  {
    id: "standard",
    name: {
      ru: "Седан Комфорт",
      hy: "Ստանդարտ Սեդան",
      en: "Comfort Sedan",
    },
    desc: {
      ru: "До 3–4 гостей • Включён в стоимость",
      hy: "Մինչև 3–4 հոգի • Ներառված է արժեքում",
      en: "Up to 3–4 guests • Included in base price",
    },
    icon: "standard",
    priceAmd: 0,
    maxPax: 4,
  },
  {
    id: "minivan",
    name: {
      ru: "Минивэн Люкс (Toyota Alphard)",
      hy: "Մինիվեն Լյուքս (Toyota Alphard)",
      en: "Luxury Minivan (Toyota Alphard)",
    },
    desc: {
      ru: "До 6–7 гостей • Раздельные кресла, премиум комфорт",
      hy: "Մինչև 6–7 հոգի • Պրեմիում հարմարավետություն",
      en: "Up to 6–7 guests • Captain seats, supreme comfort",
    },
    icon: "minivan",
    priceAmd: 15000,
    maxPax: 7,
  },
  {
    id: "minibus",
    name: {
      ru: "Микроавтобус (Mercedes-Benz Sprinter)",
      hy: "Միկրոավտոբուս (Mercedes-Benz Sprinter)",
      en: "Minibus (Mercedes-Benz Sprinter)",
    },
    desc: {
      ru: "До 15–18 гостей • Для больших компаний и групп",
      hy: "Մինչև 15–18 հոգի • Մեծ խմբերի համար",
      en: "Up to 15–18 guests • Ideal for large groups",
    },
    icon: "minibus",
    priceAmd: 25000,
    maxPax: 18,
  },
  {
    id: "suv",
    name: {
      ru: "Внедорожник 4x4 (Toyota Land Cruiser Prado)",
      hy: "Ամենագնաց 4x4 (Toyota Land Cruiser Prado)",
      en: "Off-Road 4x4 SUV (Toyota Prado)",
    },
    desc: {
      ru: "До 4 гостей • Полный привод для горных маршрутов",
      hy: "Մինչև 4 հոգի • Լեռնային երթուղիների համար",
      en: "Up to 4 guests • 4WD capability for mountains",
    },
    icon: "suv",
    priceAmd: 20000,
    maxPax: 4,
  },
];

// Additional services available across tours
const EXTRA_SERVICES_CONFIG = [
  {
    id: "lunch",
    title: {
      ru: "Традиционный армянский обед",
      hy: "Ավանդական հայկական ճաշ",
      en: "Traditional Armenian Lunch",
    },
    desc: {
      ru: "Шашлык в тонире, свежие сыры, зелень и домашний лаваш",
      hy: "Թոնրի խորոված, պանիրներ, տաք լավաշ",
      en: "Tonir barbecue, fresh artisan cheeses and hot lavash",
    },
    pricePerPerson: 7000, // per adult and child
    fixedPrice: 0,
  },
  {
    id: "tickets",
    title: {
      ru: "Входные билеты и канатные дороги",
      hy: "Մուտքի տոմսեր և ճոպանուղի",
      en: "Entry Tickets & Cable Cars",
    },
    desc: {
      ru: "Вход во все платные локации маршрута без очередей",
      hy: "Մուտք բոլոր վճարովի վայրեր առանց հերթի",
      en: "Fast-track passes to all paid route attractions",
    },
    pricePerPerson: 5000,
    fixedPrice: 0,
  },
  {
    id: "hotel_transfer",
    title: {
      ru: "Трансфер от/до вашего отеля в Ереване",
      hy: "Տրանսֆեր հյուրանոցից և հետ (Երևան)",
      en: "Hotel Pick-up & Drop-off in Yerevan",
    },
    desc: {
      ru: "Заберём прямо от дверей отеля и привезём обратно",
      hy: "Կվերցնենք անմիջապես հյուրանոցից և հետ կբերենք",
      en: "Direct pick-up from your hotel door and return",
    },
    pricePerPerson: 0,
    fixedPrice: 5000,
  },
  {
    id: "photographer",
    title: {
      ru: "Профессиональный фотограф на маршруте",
      hy: "Պրոֆեսիոնալ լուսանկարիչ",
      en: "Professional Tour Photographer",
    },
    desc: {
      ru: "50+ обработанных атмосферных снимков у главных достопримечательностей",
      hy: "50+ մշակված պրոֆեսիոնալ լուսանկարներ",
      en: "50+ edited high-res photos at scenic landmarks",
    },
    pricePerPerson: 0,
    fixedPrice: 25000,
  },
  {
    id: "baby_seat",
    title: {
      ru: "Детское автокресло / Бустер",
      hy: "Մանկական ավտոաթոռ",
      en: "Child Safety Car Seat",
    },
    desc: {
      ru: "Безопасность вашего ребёнка • Предоставляется бесплатно",
      hy: "Անվտանգություն երեխայի համար • Տրամադրվում է անվճար",
      en: "Certified safety seat • Provided free of charge",
    },
    pricePerPerson: 0,
    fixedPrice: 0,
  },
];

const GUIDE_LANGUAGES = [
  { id: "ru", label: "Русский", code: "RU", price: 0 },
  { id: "en", label: "English", code: "EN", price: 0 },
  { id: "hy", label: "Հայերեն", code: "HY", price: 0 },
  { id: "other", label: "Français / Deutsch", code: "INT", price: 10000 },
];

export default function TourPriceCalculator({
  tour,
  locale,
  onBook,
  className = "",
}: Props) {
  const isPackage = isPackageTour(tour);
  const isJeep = tour.categories.includes("jeep");

  // Get tomorrow's date formatted as YYYY-MM-DD
  const tomorrowStr = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  }, []);

  const todayStr = useMemo(() => {
    return new Date().toISOString().split("T")[0];
  }, []);

  // Form State
  const [selectedDate, setSelectedDate] = useState(tomorrowStr);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [guideLang, setGuideLang] = useState(locale === "hy" ? "hy" : locale === "en" ? "en" : "ru");
  const [transportId, setTransportId] = useState<string>(
    isJeep ? "suv" : adults + children > 4 ? "minivan" : "standard"
  );
  const [selectedHotelStars, setSelectedHotelStars] = useState<number>(
    isPackage && tour.priceTiers && tour.priceTiers.length > 0 ? tour.priceTiers[0].stars : 3
  );
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});

  // Texts for UI
  const t = {
    ru: {
      headerBadge: "Интерактивный калькулятор",
      title: "Рассчитать стоимость тура",
      subtitle: "Выберите дату, количество участников и нужные опции — цена пересчитается мгновенно",
      dateLabel: "Дата экскурсии",
      participantsLabel: "Количество участников",
      adults: "Взрослые",
      adultsHint: "от 12 лет",
      children: "Дети",
      childrenHint: "5–11 лет (скидка 50%)",
      infants: "Младенцы",
      infantsHint: "до 4 лет (бесплатно)",
      hotelTierLabel: "Категория отеля для проживания",
      stars: "звёзд",
      perPerson: "за чел.",
      guideLabel: "Язык экскурсовода / гида",
      guideFree: "включено",
      transportLabel: "Класс транспорта",
      transportRecommend: "Рекомендуется для вашей группы",
      jeepNotice: "Для данного маршрута предусмотрен комфортабельный внедорожник 4x4 (включён в стоимость).",
      extrasLabel: "Дополнительные услуги и удобства",
      freeBadge: "Бесплатно",
      summaryTitle: "Детализация расчёта",
      adultsItem: "Взрослые",
      childrenItem: "Дети (со скидкой 50%)",
      infantsItem: "Младенцы",
      transportItem: "Транспорт",
      guideItem: "Язык гида",
      totalPriceLabel: "Итоговая стоимость экскурсии",
      ctaButton: "Забронировать тур",
      ctaNote: "Без онлайн-оплаты • Оплата согласовывается после подтверждения мест координатором",
      participantsSummary: "Всего участников",
      guests: "чел.",
    },
    hy: {
      headerBadge: "Ինտերակտիվ հաշվիչ",
      title: "Հաշվարկել տուրի արժեքը",
      subtitle: "Ընտրեք ամսաթիվը, մասնակիցների քանակը և նախընտրելի ծառայությունները",
      dateLabel: "Էքսկուրսիայի ամսաթիվ",
      participantsLabel: "Մասնակիցների քանակ",
      adults: "Մեծահասակներ",
      adultsHint: "12 տարեկանից բարձր",
      children: "Երեխաներ",
      childrenHint: "5–11 տ. (50% զեղչ)",
      infants: "Փոքրիկներ",
      infantsHint: "մինչև 4 տ. (անվճար)",
      hotelTierLabel: "Հյուրանոցի կարգը",
      stars: "աստղ",
      perPerson: "մեկ անձի համար",
      guideLabel: "Էքսկուրսավարի լեզուն",
      guideFree: "ներառված է",
      transportLabel: "Տրանսպորտի դասը",
      transportRecommend: "Խորհուրդ է տրվում ձեր խմբի համար",
      jeepNotice: "Այս երթուղու համար տրամադրվում է 4x4 ամենագնաց (ներառված է արժեքում)։",
      extrasLabel: "Լրացուցիչ ծառայություններ",
      freeBadge: "Անվճար",
      summaryTitle: "Հաշվարկի մանրամասներ",
      adultsItem: "Մեծահասակներ",
      childrenItem: "Երեխաներ (50% զեղչ)",
      infantsItem: "Փոքրիկներ",
      transportItem: "Տրանսպորտ",
      guideItem: "Գիդի լեզու",
      totalPriceLabel: "Ընդհանուր արժեքը",
      ctaButton: "Ամրագրել տուրը",
      ctaNote: "Առանց առցանց վճարման • Վճարումը հաստատվում է մենեջերի հետ",
      participantsSummary: "Ընդհանուր մասնակիցներ",
      guests: "հոգի",
    },
    en: {
      headerBadge: "Live Price Calculator",
      title: "Calculate Tour Price",
      subtitle: "Choose your date, participants and tailored options — price updates instantly",
      dateLabel: "Tour Date",
      participantsLabel: "Number of Participants",
      adults: "Adults",
      adultsHint: "12+ years",
      children: "Children",
      childrenHint: "5–11 years (50% off)",
      infants: "Infants",
      infantsHint: "Under 4 (free)",
      hotelTierLabel: "Hotel Accommodation Class",
      stars: "stars",
      perPerson: "per person",
      guideLabel: "Guide Language",
      guideFree: "included",
      transportLabel: "Vehicle Class",
      transportRecommend: "Recommended for your party size",
      jeepNotice: "Off-Road 4x4 vehicle is already included in this adventure tour.",
      extrasLabel: "Optional Extras & Upgrades",
      freeBadge: "Free",
      summaryTitle: "Pricing Breakdown",
      adultsItem: "Adults",
      childrenItem: "Children (50% discount)",
      infantsItem: "Infants",
      transportItem: "Transport",
      guideItem: "Guide Language",
      totalPriceLabel: "Total Journey Price",
      ctaButton: "Book This Tour",
      ctaNote: "No upfront payment required • Final details confirmed by tour manager",
      participantsSummary: "Total travelers",
      guests: "guests",
    },
  }[locale];

  // Auto-suggest vehicle upgrade if party size grows
  const totalPartySize = adults + children;

  // Calculation Logic
  const calculation = useMemo(() => {
    // 1. Determine base rate per adult
    let adultRate = tour.priceFromAmd || 0;
    if (isPackage && tour.priceTiers && tour.priceTiers.length > 0) {
      const tier = tour.priceTiers.find((t) => t.stars === selectedHotelStars);
      if (tier) adultRate = tier.amd;
    }

    // 2. Child rate: 50% discount
    const childRate = Math.round(adultRate * 0.5);

    // 3. Participants sum
    const adultsCost = adults * adultRate;
    const childrenCost = children * childRate;
    const infantsCost = 0; // free

    // 4. Transport cost
    let vehicleCost = 0;
    const currentTransport = TRANSPORT_OPTIONS.find((v) => v.id === transportId);
    if (!isJeep && currentTransport) {
      vehicleCost = currentTransport.priceAmd;
    }

    // 5. Guide Language cost
    const currentLang = GUIDE_LANGUAGES.find((g) => g.id === guideLang);
    const guideCost = currentLang?.price || 0;

    // 6. Additional services cost
    const chosenExtras: { id: string; name: string; price: number }[] = [];
    let extrasCost = 0;

    EXTRA_SERVICES_CONFIG.forEach((svc) => {
      if (selectedServices[svc.id]) {
        let itemTotal = 0;
        if (svc.pricePerPerson > 0) {
          // Charged for adults + children (infants free)
          itemTotal = svc.pricePerPerson * (adults + children);
        } else if (svc.fixedPrice > 0) {
          itemTotal = svc.fixedPrice;
        }

        extrasCost += itemTotal;
        chosenExtras.push({
          id: svc.id,
          name: svc.title[locale],
          price: itemTotal,
        });
      }
    });

    const total = adultsCost + childrenCost + infantsCost + vehicleCost + guideCost + extrasCost;

    // Breakdown lines for the summary and receipt
    const breakdownLines: string[] = [];
    if (adults > 0) {
      breakdownLines.push(
        `${t.adultsItem} (${adults} × ${formatPrice(adultRate)}): ${formatPrice(adultsCost)}`
      );
    }
    if (children > 0) {
      breakdownLines.push(
        `${t.childrenItem} (${children} × ${formatPrice(childRate)}): ${formatPrice(childrenCost)}`
      );
    }
    if (infants > 0) {
      breakdownLines.push(`${t.infantsItem} (${infants}): ${t.freeBadge}`);
    }
    if (vehicleCost > 0 && currentTransport) {
      breakdownLines.push(
        `${t.transportItem} (${currentTransport.name[locale]}): ${formatPrice(vehicleCost)}`
      );
    }
    if (guideCost > 0 && currentLang) {
      breakdownLines.push(
        `${t.guideItem} (${currentLang.label}): ${formatPrice(guideCost)}`
      );
    }
    chosenExtras.forEach((extra) => {
      breakdownLines.push(
        `${extra.name}: ${extra.price > 0 ? formatPrice(extra.price) : t.freeBadge}`
      );
    });

    return {
      adultRate,
      childRate,
      adultsCost,
      childrenCost,
      vehicleCost,
      guideCost,
      extrasCost,
      chosenExtras,
      total,
      breakdownLines,
      currentTransport,
      currentLang,
    };
  }, [
    tour,
    isPackage,
    isJeep,
    selectedHotelStars,
    adults,
    children,
    infants,
    transportId,
    guideLang,
    selectedServices,
    locale,
    t,
  ]);

  const toggleService = (id: string) => {
    setSelectedServices((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleBookClick = () => {
    const data: CalculatedBookingData = {
      tourTitle: tour.title[locale],
      tourCode: tour.code,
      date: selectedDate,
      departureTime: tour.departure,
      adults,
      children,
      infants,
      totalParticipants: adults + children + infants,
      guideLanguage: calculation.currentLang?.label || "Русский",
      transportId,
      transportName: isJeep
        ? "Внедорожник 4x4 (Jeep Tour)"
        : calculation.currentTransport?.name[locale] || "Стандартный",
      transportPrice: calculation.vehicleCost,
      selectedServices: calculation.chosenExtras,
      hotelTier: isPackage ? selectedHotelStars : undefined,
      basePricePerAdult: calculation.adultRate,
      basePricePerChild: calculation.childRate,
      totalPrice: calculation.total,
      breakdown: calculation.breakdownLines,
    };

    onBook(data);
  };

  return (
    <div
      id="tour-price-calculator"
      className={`scroll-mt-24 rounded-3xl border border-[#EAE9E0] bg-white p-5 sm:p-7 shadow-xl overflow-hidden ${className || ""}`}
    >
      {/* Top Header Badge */}
      <div className="flex items-center justify-between gap-3 border-b border-[#EAE9E0] pb-5">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#586EFF]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#586EFF]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#586EFF] animate-pulse" />
            {t.headerBadge}
          </span>
          <h2 className="mt-2 text-xl sm:text-2xl font-black tracking-tight text-[#312F2F]">
            {t.title}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-[#6B6967]">
            {t.subtitle}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* 1. TOUR DATE PICKER */}
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F] mb-2">
            {t.dateLabel}
          </label>
          <div className="relative">
            <input
              type="date"
              min={todayStr}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] px-4 py-3 text-sm sm:text-base font-bold text-[#312F2F] shadow-xs outline-none transition-all focus:border-[#586EFF] focus:bg-white focus:ring-2 focus:ring-[#586EFF]/20 cursor-pointer"
            />
          </div>
        </div>

        {/* 2. PARTICIPANTS (Adults, Children, Infants) */}
        <div className="rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-4 sm:p-5">
          <div className="flex items-center justify-between mb-3.5">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F]">
              {t.participantsLabel}
            </label>
            <span className="inline-flex items-center rounded-full bg-[#312F2F] px-2.5 py-0.5 text-xs font-black text-[#C7FF32]">
              {adults + children + infants} {t.guests}
            </span>
          </div>

          <div className="space-y-3">
            {/* Adults */}
            <div className="flex items-center justify-between rounded-xl bg-white border border-[#EAE9E0] p-3 shadow-2xs">
              <div>
                <span className="block text-sm sm:text-base font-bold text-[#312F2F]">
                  {t.adults}
                </span>
                <span className="block text-xs text-[#6B6967]">
                  {t.adultsHint} • {formatPrice(calculation.adultRate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={adults <= 1}
                  onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#312F2F] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  −
                </button>
                <span className="w-8 text-center text-base sm:text-lg font-black text-[#312F2F]">
                  {adults}
                </span>
                <button
                  type="button"
                  disabled={adults >= 30}
                  onClick={() => setAdults((prev) => prev + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#586EFF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Children (5-11 yrs, 50% discount) */}
            <div className="flex items-center justify-between rounded-xl bg-white border border-[#EAE9E0] p-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-[#312F2F]">
                    {t.children}
                  </span>
                  <span className="rounded-full bg-[#C7FF32]/30 px-2 py-0.5 text-[10px] font-black text-[#312F2F]">
                    −50%
                  </span>
                </div>
                <span className="block text-xs text-[#6B6967]">
                  {t.childrenHint} • {formatPrice(calculation.childRate)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={children <= 0}
                  onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#312F2F] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  −
                </button>
                <span className="w-8 text-center text-base sm:text-lg font-black text-[#312F2F]">
                  {children}
                </span>
                <button
                  type="button"
                  disabled={children >= 20}
                  onClick={() => setChildren((prev) => prev + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#586EFF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Infants (0-4 yrs, free) */}
            <div className="flex items-center justify-between rounded-xl bg-white border border-[#EAE9E0] p-3 shadow-2xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm sm:text-base font-bold text-[#312F2F]">
                    {t.infants}
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                    {t.freeBadge}
                  </span>
                </div>
                <span className="block text-xs text-[#6B6967]">
                  {t.infantsHint}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={infants <= 0}
                  onClick={() => setInfants((prev) => Math.max(0, prev - 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#312F2F] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  −
                </button>
                <span className="w-8 text-center text-base sm:text-lg font-black text-[#312F2F]">
                  {infants}
                </span>
                <button
                  type="button"
                  disabled={infants >= 10}
                  onClick={() => setInfants((prev) => prev + 1)}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE9E0] bg-[#FCFCF7] text-base font-black text-[#312F2F] transition-all hover:bg-[#586EFF] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. HOTEL TIERS (Only for multi-day package tours) */}
        {isPackage && tour.priceTiers && tour.priceTiers.length > 0 && (
          <div>
            <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F] mb-2.5">
              {t.hotelTierLabel}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {tour.priceTiers.map((tier) => {
                const isSelected = selectedHotelStars === tier.stars;
                return (
                  <button
                    key={tier.stars}
                    type="button"
                    onClick={() => setSelectedHotelStars(tier.stars)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-3 text-center transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#586EFF] bg-[#586EFF]/10 text-[#312F2F] shadow-sm ring-2 ring-[#586EFF]/20"
                        : "border-[#EAE9E0] bg-[#FCFCF7] text-[#6B6967] hover:border-[#586EFF]/40 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-center gap-0.5 text-amber-500">
                      {Array.from({ length: tier.stars }).map((_, i) => (
                        <svg key={i} className="w-3.5 h-3.5 fill-amber-400" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                    <span className="mt-1 text-xs font-bold text-[#312F2F]">
                      {tier.stars} {t.stars}
                    </span>
                    <span className="mt-1 text-[11px] font-black text-[#586EFF]">
                      {formatPrice(tier.amd)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* 4. GUIDE LANGUAGE */}
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F] mb-2.5">
            {t.guideLabel}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {GUIDE_LANGUAGES.map((lang) => {
              const isSelected = guideLang === lang.id;
              return (
                <button
                  key={lang.id}
                  type="button"
                  onClick={() => setGuideLang(lang.id)}
                  className={`flex items-center justify-between rounded-xl border px-3 py-2.5 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "border-[#586EFF] bg-[#586EFF] text-white shadow-xs"
                      : "border-[#EAE9E0] bg-[#FCFCF7] text-[#312F2F] hover:bg-white hover:border-[#586EFF]/30"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 uppercase">{lang.code}</span>
                    <span>{lang.label}</span>
                  </span>
                  {lang.price > 0 && (
                    <span className={`text-[10px] ${isSelected ? "text-white/80" : "text-[#586EFF]"}`}>
                      +{formatPrice(lang.price)}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. VEHICLE TRANSPORT OPTIONS */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F]">
              {t.transportLabel}
            </label>
            {totalPartySize > 4 && !isJeep && (
              <span className="text-[11px] font-bold text-[#586EFF] bg-[#586EFF]/10 px-2 py-0.5 rounded-full">
                {t.transportRecommend}
              </span>
            )}
          </div>

          {isJeep ? (
            <div className="rounded-2xl border border-[#C7FF32]/50 bg-[#C7FF32]/10 p-4 text-xs sm:text-sm text-[#312F2F] font-medium flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#C7FF32]/30 text-[#312F2F]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <span>{t.jeepNotice}</span>
            </div>
          ) : (
            <div className="space-y-2.5">
              {TRANSPORT_OPTIONS.map((veh) => {
                const isSelected = transportId === veh.id;
                const isRecommend =
                  (totalPartySize <= 4 && veh.id === "standard") ||
                  (totalPartySize > 4 && totalPartySize <= 7 && veh.id === "minivan") ||
                  (totalPartySize > 7 && veh.id === "minibus");

                return (
                  <div
                    key={veh.id}
                    onClick={() => setTransportId(veh.id)}
                    className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
                      isSelected
                        ? "border-[#586EFF] bg-[#586EFF]/5 ring-2 ring-[#586EFF]/20 shadow-xs"
                        : "border-[#EAE9E0] bg-[#FCFCF7] hover:bg-white hover:border-[#586EFF]/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                          isSelected ? "bg-[#586EFF] text-white" : "bg-white border border-[#EAE9E0] text-[#312F2F]"
                        }`}
                      >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1" />
                        </svg>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[#312F2F]">
                            {veh.name[locale]}
                          </span>
                          {isRecommend && (
                            <span className="rounded-full bg-[#C7FF32] px-2 py-0.5 text-[9px] font-black text-[#312F2F]">
                              РЕКОМЕНДУЕМ
                            </span>
                          )}
                        </div>
                        <span className="block text-xs text-[#6B6967]">
                          {veh.desc[locale]}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      {veh.priceAmd > 0 ? (
                        <span className="text-xs sm:text-sm font-black text-[#586EFF]">
                          +{formatPrice(veh.priceAmd)}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-emerald-600">
                          {t.guideFree}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. EXTRA SERVICES (Checkboxes) */}
        <div>
          <label className="block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#312F2F] mb-2.5">
            {t.extrasLabel}
          </label>

          <div className="space-y-2.5">
            {EXTRA_SERVICES_CONFIG.map((extra) => {
              const isChecked = Boolean(selectedServices[extra.id]);
              const calculatedCost =
                extra.pricePerPerson > 0
                  ? extra.pricePerPerson * (adults + children)
                  : extra.fixedPrice;

              return (
                <div
                  key={extra.id}
                  onClick={() => toggleService(extra.id)}
                  className={`flex items-center justify-between rounded-2xl border p-3.5 transition-all cursor-pointer ${
                    isChecked
                      ? "border-[#586EFF] bg-[#586EFF]/5 ring-1 ring-[#586EFF]/20 shadow-xs"
                      : "border-[#EAE9E0] bg-[#FCFCF7] hover:bg-white hover:border-[#586EFF]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleService(extra.id)}
                      className="h-5 w-5 rounded-md border-gray-300 text-[#586EFF] focus:ring-[#586EFF] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#312F2F]">
                          {extra.title[locale]}
                        </span>
                      </div>
                      <span className="block text-xs text-[#6B6967]">
                        {extra.desc[locale]}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 pl-2">
                    {calculatedCost > 0 ? (
                      <div>
                        <span className="block text-xs sm:text-sm font-black text-[#312F2F]">
                          +{formatPrice(calculatedCost)}
                        </span>
                        {extra.pricePerPerson > 0 && (
                          <span className="block text-[10px] text-[#6B6967]">
                            ({formatPrice(extra.pricePerPerson)}/чел)
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-emerald-600">
                        {t.freeBadge}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. LIVE BREAKDOWN & TOTAL COST */}
        <div className="rounded-3xl border border-[#312F2F] bg-[#312F2F] p-5 sm:p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-white/60">
              {t.summaryTitle}
            </span>
            <span className="text-xs font-mono font-bold text-[#C7FF32]">
              {selectedDate} • {adults + children + infants} {t.guests}
            </span>
          </div>

          {/* Breakdown items */}
          <div className="space-y-2 text-xs sm:text-sm text-white/80 pb-4 border-b border-white/10">
            {calculation.breakdownLines.map((line, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span>{line.split(":")[0]}</span>
                <span className="font-mono font-bold text-white">
                  {line.split(":")[1] || ""}
                </span>
              </div>
            ))}
          </div>

          {/* Grand Total */}
          <div className="mt-4 flex items-end justify-between">
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-white/60">
                {t.totalPriceLabel}
              </span>
              <span className="block text-3xl sm:text-4xl font-black text-[#C7FF32] tracking-tight">
                {formatPrice(calculation.total)}
              </span>
            </div>

            <div className="text-right">
              <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                100% фикс. цена
              </span>
            </div>
          </div>

          {/* CTA Book Button */}
          <button
            type="button"
            onClick={handleBookClick}
            className="mt-5 w-full flex items-center justify-center gap-2 rounded-2xl bg-[#C7FF32] py-4 text-base sm:text-lg font-black text-[#312F2F] shadow-lg transition-all hover:bg-[#b8f226] hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
          >
            <span>{t.ctaButton}</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <p className="mt-3 text-center text-[11px] text-white/60 leading-relaxed">
            {t.ctaNote}
          </p>
        </div>
      </div>
    </div>
  );
}
