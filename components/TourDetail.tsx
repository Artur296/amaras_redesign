import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import PackageIncludes from "@/components/PackageIncludes";
import TourInfo from "@/components/TourInfo";
import TourGallery from "@/components/TourGallery";
import { CalendarIcon, PhoneIcon } from "@/components/icons";
import type { Dict, Locale } from "@/lib/i18n";
import {
  discountPercent,
  formatPrice,
  hasPrice,
  isPackageTour,
  type Category,
  type Tour,
} from "@/lib/tours";

export default function TourDetail({
  tour,
  locale,
  dict,
  categories,
  backHref,
  backLabel,
  phone,
}: {
  tour: Tour;
  locale: Locale;
  dict: Dict;
  categories: Category[];
  backHref: string;
  backLabel: string;
  phone: string;
}) {
  const catTitle = (id: string) =>
    categories.find((c) => c.id === id)?.title[locale] ?? id;
  const isPackage = isPackageTour(tour);
  const discount = discountPercent(tour);
  const duration = tour.days
    ? `${tour.days} ${dict.tours.days}${tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}`
    : `${tour.durationHours} ${dict.tours.hours}`;

  return (
    <div className="mx-auto max-w-[1240px] px-6 py-12 md:py-16">
      {/* Breadcrumb Navigation */}
      <FadeIn>
        <div className="flex items-center gap-2 text-xs font-bold text-[#6B6967]">
          <Link href={`/${locale}`} className="hover:text-[#586EFF]">
            {dict.nav.home}
          </Link>
          <span>/</span>
          <Link href={backHref} className="hover:text-[#586EFF]">
            {backLabel}
          </Link>
          <span>/</span>
          <span className="truncate text-[#312F2F]">{tour.title[locale]}</span>
        </div>

        {/* Tour Header */}
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {tour.categories.map((id) => (
              <span
                key={id}
                className="rounded-full bg-[#312F2F] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#C7FF32]"
              >
                {catTitle(id)}
              </span>
            ))}
            {discount !== null && (
              <span className="rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black text-[#312F2F] shadow-sm">
                −{discount}% {locale === "ru" ? "СКИДКА" : locale === "hy" ? "ԶԵՂՉ" : "OFF"}
              </span>
            )}
            <span className="flex items-center gap-1 rounded-full bg-white border border-[#EAE9E0] px-3 py-1 text-xs font-bold text-[#312F2F]">
              <span>★</span> 4.9 (120+ {locale === "ru" ? "отзывов" : "reviews"})
            </span>
          </div>

          <h1 className="font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl lg:text-5xl">
            {tour.title[locale]}
          </h1>

          {/* Quick specs bar */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-[#6B6967]">
            {isPackage ? (
              <span className="flex items-center gap-1.5 rounded-full bg-[#586EFF]/10 px-3.5 py-1 text-xs font-bold text-[#586EFF]">
                <CalendarIcon className="h-4 w-4" />
                {tour.days} {dict.tours.days}
                {tour.nights ? ` / ${tour.nights} ${dict.tours.nights}` : ""}
              </span>
            ) : (
              <>
                {tour.departure && (
                  <span className="flex items-center gap-1.5">
                    <span>⏱</span>
                    <span>{dict.tour.departure}: <b>{tour.departure}</b></span>
                  </span>
                )}
                <span className="flex items-center gap-1.5">
                  <span>⌛</span>
                  <span>{dict.tour.duration}: <b>{duration}</b></span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>{locale === "ru" ? "Выезд из Еревана" : locale === "hy" ? "Մեկնում Երևանից" : "From Yerevan"}</span>
                </span>
              </>
            )}
          </div>
        </div>
      </FadeIn>

      {/* Main Grid: Details + Sticky Booking Card */}
      <div className="mt-10 grid items-start gap-12 lg:grid-cols-12">
        {/* Left Column: Image, Story, Route, Itinerary, Info */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-10">
          {/* Main Hero Gallery / Slideshow */}
          <FadeIn>
            <TourGallery
              images={
                tour.images && tour.images.length > 0
                  ? tour.images
                  : [tour.image]
              }
              title={tour.title[locale]}
            />
          </FadeIn>

          {/* Description & Overview */}
          <FadeIn delay={0.1}>
            <div className="rounded-3xl border border-[#EAE9E0] bg-white p-8 shadow-sm">
              <h2 className="text-xl font-black uppercase tracking-tight text-[#312F2F]">
                {locale === "ru" ? "О путешествии" : locale === "hy" ? "Տուրի մասին" : "About this journey"}
              </h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed text-[#6B6967]">
                {tour.about[locale].split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* Itinerary Timeline */}
          {tour.itinerary?.length ? (
            <FadeIn delay={0.15}>
              <div className="rounded-3xl border border-[#EAE9E0] bg-white p-8 shadow-sm">
                <h2 className="text-xl font-black uppercase tracking-tight text-[#312F2F]">
                  {dict.tour.itinerary}
                </h2>
                <ol className="mt-6 space-y-6">
                  {tour.itinerary.map((entry) => (
                    <li
                      key={entry.day}
                      className="rounded-2xl border border-[#EAE9E0] bg-[#FCFCF7] p-6 transition-all hover:border-[#586EFF]/40"
                    >
                      <div className="flex items-baseline gap-3">
                        <span className="rounded-full bg-[#586EFF] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-white">
                          {dict.tour.day} {entry.day}
                        </span>
                        <h3 className="text-lg font-black text-[#312F2F]">
                          {entry.title[locale]}
                        </h3>
                      </div>
                      <ul className="mt-4 space-y-2.5">
                        {entry.items[locale].map((item, k) => (
                          <li
                            key={k}
                            className="flex items-start gap-3 text-sm leading-relaxed text-[#6B6967]"
                          >
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#586EFF]" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ol>
              </div>
            </FadeIn>
          ) : null}

          {/* Practical Info Panel */}
          {!isPackage && (
            <FadeIn delay={0.2}>
              <TourInfo tour={tour} locale={locale} dict={dict} phone={phone} />
            </FadeIn>
          )}
        </div>

        {/* Right Sticky Column: Route stops & Booking Card */}
        <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24 space-y-6">
          {/* Main Booking Card */}
          <FadeIn delay={0.15}>
            <div className="rounded-3xl border border-[#EAE9E0] bg-white p-7 shadow-xl">
              {/* Pricing Box */}
              <div className="border-b border-[#EAE9E0] pb-6">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6967]">
                  {dict.tours.from}
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  {tour.priceOldAmd && (
                    <s className="text-sm font-bold text-[#6B6967]/60">
                      {formatPrice(tour.priceOldAmd)}
                    </s>
                  )}
                  <span className="text-3xl font-black text-[#312F2F]">
                    {hasPrice(tour) ? formatPrice(tour.priceFromAmd) : dict.tours.onRequest}
                  </span>
                </div>
                {discount !== null && (
                  <span className="mt-2 inline-block rounded-full bg-[#C7FF32] px-3 py-0.5 text-xs font-black text-[#312F2F]">
                    {locale === "ru" ? `Экономия ${formatPrice(tour.priceOldAmd! - tour.priceFromAmd)}` : `Save ${formatPrice(tour.priceOldAmd! - tour.priceFromAmd)}`}
                  </span>
                )}
              </div>

              {/* Key Highlights list */}
              <div className="py-5 space-y-2.5 text-xs font-semibold text-[#6B6967]">
                <div className="flex items-center justify-between">
                  <span>{dict.tour.duration}</span>
                  <span className="font-bold text-[#312F2F]">{duration}</span>
                </div>
                {tour.departure && (
                  <div className="flex items-center justify-between">
                    <span>{dict.tour.departure}</span>
                    <span className="font-bold text-[#312F2F]">{tour.departure}</span>
                  </div>
                )}
                {tour.meetTime && (
                  <div className="flex items-center justify-between">
                    <span>{dict.info?.meetLabel ?? "Сбор"}</span>
                    <span className="font-bold text-[#586EFF]">{tour.meetTime}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span>{locale === "ru" ? "Оплата" : "Payment"}</span>
                  <span className="font-bold text-[#312F2F]">{locale === "ru" ? "На месте (без предоплаты)" : "On site (zero prepayment)"}</span>
                </div>
              </div>

              {/* CTA Booking Button */}
              <div className="pt-2">
                <BookButton
                  label={dict.tours.book}
                  message={`${dict.tours.bookMessage} ${tour.title[locale]}`}
                  variant="primary"
                  size="lg"
                />
              </div>

              {/* Direct Telephone */}
              <div className="mt-4 text-center">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#6B6967] hover:text-[#586EFF]"
                >
                  <PhoneIcon className="h-3.5 w-3.5" />
                  <span>{locale === "ru" ? "Или позвоните нам:" : "Or call directly:"} {phone}</span>
                </a>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 border-t border-[#EAE9E0] pt-4 space-y-2 text-[11px] text-[#6B6967]">
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span> {locale === "ru" ? "Моментальное подтверждение в чате" : "Instant chat confirmation"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span> {locale === "ru" ? "Современные комфортабельные авто" : "Premium modern transport"}
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-[#586EFF]">✓</span> {locale === "ru" ? "Бесплатная отмена за 24 часа" : "Free 24h cancellation"}
                </p>
              </div>
            </div>
          </FadeIn>

          {/* Route Stops Card */}
          <FadeIn delay={0.2}>
            <div className="rounded-3xl border border-[#EAE9E0] bg-white p-7 shadow-sm">
              <h3 className="text-base font-black uppercase tracking-tight text-[#312F2F]">
                {dict.tour.route}
              </h3>
              <ol className="mt-4 space-y-3.5">
                {tour.destinations[locale].map((stop, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#586EFF] text-xs font-black text-white">
                      {i + 1}
                    </span>
                    <span className="text-sm font-semibold leading-relaxed text-[#312F2F]">
                      {stop}
                    </span>
                  </li>
                ))}
              </ol>

              {isPackage && (
                <div className="mt-6 border-t border-[#EAE9E0] pt-5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-[#586EFF]">
                    {dict.pkg.includesTitle}
                  </h4>
                  <PackageIncludes dict={dict} className="mt-3 space-y-2.5" />
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

