import type { Locale } from "@/lib/i18n";

export type SpecialOffer = {
  id: string;
  active: boolean;
  badge: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  priceHighlightText?: Record<Locale, string>;
  priceFromAmd?: number;
  priceOldAmd?: number;
  linkHref: string;
  image: string;
  bannerImage?: string;
  leftRouteTitle?: Record<Locale, string>;
  rightRouteTitle?: Record<Locale, string>;
  secondaryLinkHref?: string;
  secondaryLinkText?: Record<Locale, string>;
  primaryButtonText?: Record<Locale, string>;
  validUntil?: Record<Locale, string>;
  highlightFeatures?: Record<Locale, string[]>;
};

export const defaultOffers: SpecialOffer[] = [
  {
    id: "autumn-promo-october",
    active: true,
    badge: {
      ru: "СПЕЦИАЛЬНОЕ ПРЕДЛОЖЕНИЕ 🍁",
      hy: "ՀԱՏՈՒԿ ԱՌԱՋԱՐԿ 🍁",
      en: "SPECIAL EXCLUSIVE DEAL 🍁",
    },
    title: {
      ru: "Путешествуй больше — плати меньше",
      hy: "Ճամփորդիր ավելին — վճարիր պակաս",
      en: "Travel More — Pay Less",
    },
    subtitle: {
      ru: "Два насыщенных путешествия по Армении по одной специальной цене.",
      hy: "Երկու հագեցած ճամփորդություն Հայաստանում մեկ հատուկ գնով։",
      en: "Two breathtaking Armenia journeys for one special combined price.",
    },
    priceHighlightText: {
      ru: "2 экскурсии — всего 39 900 драм с человека",
      hy: "2 էքսկուրսիա — ընդամենը 39 900 դրամ մեկ անձի համար",
      en: "2 Day Tours — Only 39 900 AMD per person",
    },
    priceFromAmd: 39900,
    priceOldAmd: 55000,
    linkHref: "https://wa.me/37493444455?text=%D0%97%D0%B4%D1%80%D0%B0%D0%B2%D1%81%D1%82%D0%B2%D1%83%D0%B9%D1%82%D0%B5!%20%D0%A5%D0%BE%D1%87%D1%83%20%D0%B7%D0%B0%D0%B1%D1%80%D0%BE%D0%BD%D0%B8%D1%80%D0%BE%D0%B2%D0%B0%D1%82%D1%8C%20%D1%81%D0%BF%D0%B5%D1%86%D0%BF%D1%80%D0%B5%D0%B4%D0%BB%D0%BE%D0%B6%D0%B5%D0%BD%D0%B8%D0%B5:%202%20%D1%8D%D0%BA%D1%81%D0%BA%D1%83%D1%80%D1%81%D0%B8%D0%B8%20%D0%B7%D0%B0%2039%20900%20%D0%B4%D1%80%D0%B0%D0%BC",
    secondaryLinkHref: "/#tours",
    image: "/images/special-offer-autumn.jpg",
    bannerImage: "/images/special-offer-autumn.jpg",
    leftRouteTitle: {
      ru: "ОТ АРАРАТА ДО ДЖЕРМУКА",
      hy: "ԱՐԱՐԱՏԻՑ ՄԻՆՉԵՎ ՋԵՐՄՈՒԿ",
      en: "FROM ARARAT TO JERMUK",
    },
    rightRouteTitle: {
      ru: "ОТ ГАРНИ ДО СЕВАНА",
      hy: "ԳԱՌՆԻԻՑ ՄԻՆՉԵՎ ՍԵՎԱՆ",
      en: "FROM GARNI TO SEVAN",
    },
    primaryButtonText: {
      ru: "ЗАБРОНИРОВАТЬ СЕЙЧАС",
      hy: "ԱՄՐԱԳՐԵԼ ՀԻՄԱ",
      en: "BOOK NOW",
    },
    secondaryLinkText: {
      ru: "ПОДРОБНЕЕ",
      hy: "ՄԱՆՐԱՄԱՍՆ",
      en: "DETAILS",
    },
    validUntil: {
      ru: "До конца сезона включительно",
      hy: "Մինչև սեզոնի ավարտ",
      en: "Limited Availability This Season",
    },
    highlightFeatures: {
      ru: [
        "Только при 2 экскурсиях",
        "Специальная фиксированная цена",
        "Два уникальных маршрута",
        "Больше впечатлений по выгодной цене",
      ],
      hy: [
        "Միայն 2 էքսկուրսիայի դեպքում",
        "Հատուկ ֆիքսված գին",
        "Երկու եզակի երթուղի",
        "Ավելի շատ տպավորություններ շահավետ գնով",
      ],
      en: [
        "Valid for any 2 day tours",
        "Special fixed bundle rate",
        "Two iconic Armenia routes",
        "Maximum impressions & best value",
      ],
    },
  },
];
