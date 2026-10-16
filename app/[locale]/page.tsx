import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import Hero from "@/components/Hero";
import HeroStats from "@/components/HeroStats";
import JeepExpeditionWidget from "@/components/JeepExpeditionWidget";
import ReviewsSection from "@/components/ReviewsSection";
import SpecialOffersSection from "@/components/SpecialOffersSection";
import FaqSection from "@/components/FaqSection";
import TopToursSection from "@/components/TopToursSection";
import FeaturedBannerSection from "@/components/FeaturedBannerSection";
import TrendBentoGrid from "@/components/TrendBentoGrid";
import LuxuryResortCard from "@/components/LuxuryResortCard";
import HeritageBanner from "@/components/HeritageBanner";
import AdvantagesGrid from "@/components/AdvantagesGrid";
import NoFinePrintCards from "@/components/NoFinePrintCards";
import AboutCompanySection from "@/components/AboutCompanySection";

import { faqs } from "@/lib/faqs";
import { CalendarIcon, RouteIcon, ShieldIcon, StarIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { publicCategories } from "@/lib/tours";
import { buildLinks } from "@/lib/site";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const { dicts, categories: allCategories, site, hero, reviews, offers, guides } = await getContent();

  const categories = publicCategories(allCategories);
  const dict = dicts[locale];
  const links = buildLinks(site);
  const approvedReviews = (reviews || []).filter((r) => r.approved !== false);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${site.url}/#website`,
        url: site.url,
        name: site.name,
        alternateName: ["AMARAS", "AMARAS TOUR", "Amaras Tours Armenia"],
        description: dict.meta.home.description,
        inLanguage: ["ru", "hy", "en"],
        potentialAction: {
          "@type": "SearchAction",
          target: `${site.url}/${locale}/tours?q={search_term_string}`,
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "TravelAgency",
        "@id": `${site.url}/#travelagency`,
        name: site.name,
        url: site.url,
        telephone: site.phone,
        email: site.email,
        image: `${site.url}/images/og-amaras.jpg`,
        logo: `${site.url}/images/og-amaras.jpg`,
        priceRange: "֏֏",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Yerevan",
          addressCountry: "AM",
          streetAddress: "Yerevan, Armenia",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: "40.1792",
          longitude: "44.4991",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ],
            opens: "09:00",
            closes: "21:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5.0",
          bestRating: "5",
          worstRating: "1",
          ratingCount: "138",
          reviewCount: "138",
        },
        sameAs: [links.instagram, links.telegram].filter(Boolean),
      },
      {
        "@type": "FAQPage",
        "@id": `${site.url}/${locale}/#faq`,
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question[locale] || f.question.ru,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.answer[locale] || f.answer.ru,
          },
        })),
      },
    ],
  };

  // Curated destinations for Bento Gallery (TripMate reference pattern)
  const destinations = [
    {
      name: locale === "ru" ? "Озеро Севан и Дилижан" : locale === "hy" ? "Սևանա լիճ և Դիլիջան" : "Lake Sevan & Dilijan",
      subtitle: locale === "ru" ? "Лазурное высокогорье и реликтовые леса" : locale === "hy" ? "Բարձրլեռնային լիճ և անտառներ" : "Highland sapphire waters & emerald forests",
      image: "/images/sevan.jpg",
      tag: locale === "ru" ? "12 туров" : locale === "hy" ? "12 տուր" : "12 Tours",
      href: `/${locale}/tours?q=sevan`,
      span: "md:col-span-2 md:row-span-2 aspect-[16/11] md:aspect-auto",
    },
    {
      name: locale === "ru" ? "Храм Гарни и Гегард" : locale === "hy" ? "Գառնի և Գեղարդ" : "Garni & Geghard",
      subtitle: locale === "ru" ? "Античный храм и пещерный монастырь ЮНЕСКО" : locale === "hy" ? "Անտիկ տաճար և ժայռափոր վանք" : "Classical temple & rock monastery",
      image: "/images/garni.jpg",
      tag: locale === "ru" ? "8 туров" : locale === "hy" ? "8 տուր" : "8 Tours",
      href: `/${locale}/tours?q=garni`,
      span: "aspect-[16/10]",
    },
    {
      name: locale === "ru" ? "Монастырь Татев" : locale === "hy" ? "Տաթևի վանք" : "Tatev Monastery",
      subtitle: locale === "ru" ? "Канатная дорога «Крылья Татева» над ущельем" : locale === "hy" ? "«Տաթևի թևեր» ճոպանուղի" : "Wings of Tatev aerial tramway",
      image: "/images/tatev.jpg",
      tag: locale === "ru" ? "Топ выбор" : locale === "hy" ? "Թոփ ընտրություն" : "Top Choice",
      href: `/${locale}/tours?q=tatev`,
      span: "aspect-[16/10]",
    },
    {
      name: locale === "ru" ? "Нораванк и Арени" : locale === "hy" ? "Նորավանք և Արենի" : "Noravank & Areni",
      subtitle: locale === "ru" ? "Красные скалы и древнейшая колыбель виноделия" : locale === "hy" ? "Կարմիր ժայռեր և գինեգործություն" : "Red canyons & ancient wine cradle",
      image: "/images/noravank.jpg",
      tag: locale === "ru" ? "Вино и горы" : locale === "hy" ? "Գինի և լեռներ" : "Wine & Valleys",
      href: `/${locale}/tours?q=noravank`,
      span: "aspect-[16/10]",
    },
    {
      name: locale === "ru" ? "Вулкан Аждаак (Джип 4x4)" : locale === "hy" ? "Աժդահակ հրաբուխ" : "Mount Azhdahak 4x4",
      subtitle: locale === "ru" ? "Внедорожная экспедиция к кратерному озеру" : locale === "hy" ? "Արտաճանապարհային էքսպեդիցիա" : "Off-road crater lake expedition",
      image: "/images/azhdahak.jpg",
      tag: locale === "ru" ? "Экстрим 4x4" : locale === "hy" ? "Էքստրիմ 4x4" : "Extreme 4x4",
      href: `/${locale}/tours/jeep`,
      span: "aspect-[16/10]",
    },
  ];




  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO with integrated Trip Discovery Search */}
      <Hero locale={locale} dict={dict} images={hero.images} cardImages={site.homepageImages} />

      {/* 1.1 "Внутренний туризм — это тренд" Bento Grid (Screenshot 1) */}
      <TrendBentoGrid locale={locale} images={site.homepageImages} />

      {/* 1.3 Signature TOP TOURS 3-Column Showcase */}
      <TopToursSection locale={locale} images={site.homepageImages} />

      {/* 1.4 Luxury Resort & Spa Showcase (Screenshot 1 bottom) */}
      <LuxuryResortCard locale={locale} images={site.homepageImages} />

      {/* 1.5 Signature Full-Width Immersive Banner (Hidden on mobile to reduce page length) */}
      <div className="hidden md:block">
        <FeaturedBannerSection locale={locale} bannerImage={site.homepageImages?.featuredBanner} />
      </div>

      {/* 1.6 Scientific & Heritage Expeditions Banner (Hidden on mobile to reduce page length) */}
      <div className="hidden md:block">
        <HeritageBanner locale={locale} />
      </div>

      {/* 1.7 "Отдых без мелкого шрифта" & Panoramic Escapes */}
      <NoFinePrintCards locale={locale} bannerImage={site.homepageImages?.panoramicBanner} />

      {/* 1.8 "Наши преимущества" 8-Item Grid */}
      <AdvantagesGrid locale={locale} />

      {/* 1.9 Stats & Trust Strip */}
      <HeroStats locale={locale} dict={dict} />

      {/* 1.10 About Amaras Tour Armenia Section */}
      <AboutCompanySection locale={locale} />

      {/* 2. TRAVEL FORMATS (Landing Page Showcase) */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <FadeIn>
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#586EFF]">
                {locale === "ru" ? "Форматы путешествий" : locale === "hy" ? "Տուրերի ձևաչափերը" : "Travel Formats"}
              </span>
              <h2 className="mt-2 sm:mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#312F2F]">
                {locale === "ru" ? "Выберите свой стиль Армении" : locale === "hy" ? "Ընտրեք ձեր ոճը" : "Choose Your Travel Style"}
              </h2>
              <p className="mt-2 sm:mt-3 max-w-2xl text-sm sm:text-lg leading-relaxed text-[#555351]">
                {locale === "ru"
                  ? "От доступных групповых экскурсий до внедорожных экспедиций 4x4 и персональных туров."
                  : locale === "hy"
                  ? "Մատչելի խմբային էքսկուրսիաներից մինչև արտաճանապարհային ջիպ արշավներ և անհատական պրեմիում տուրեր։"
                  : "From friendly group excursions to rugged 4x4 mountain expeditions and private custom tours."}
              </p>
            </div>

            <Link
              href={`/${locale}/tours`}
              className="inline-flex shrink-0 items-center gap-2 sm:gap-3 rounded-full bg-[#312F2F] px-6 sm:px-8 py-3 sm:py-4 text-xs sm:text-base font-black uppercase tracking-wider text-[#C7FF32] shadow-lg transition-all hover:bg-[#242323] hover:scale-105 active:scale-95"
            >
              <span>
                {locale === "ru"
                  ? "Выбирай свой тур"
                  : locale === "hy"
                  ? "Ընտրիր քո տուրը"
                  : "Choose Your Tour"}
              </span>
              <span className="text-base font-black">→</span>
            </Link>
          </div>
        </FadeIn>

        {/* Large Format Cards Grid (3 columns on desktop, horizontal swipe carousel on mobile) */}
        <div className="mt-8 sm:mt-14 flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:gap-8 sm:grid-cols-2 lg:grid-cols-3 scrollbar-none snap-x snap-mandatory">
          {categories.map((cat, i) => (
            <div key={cat.id} className="shrink-0 w-[82vw] max-w-[320px] snap-center sm:w-auto sm:shrink sm:max-w-none h-full">
              <FadeIn delay={i * 0.08} className="h-full">
                <Link
                  href={`/${locale}/tours/${cat.id}`}
                  className={`group flex h-full flex-col overflow-hidden rounded-[2rem] bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${
                    cat.id === "offers"
                      ? "border-2 border-[#C7FF32] shadow-[0_8px_30px_rgba(199,255,50,0.25)]"
                      : "border border-[#EAE9E0] hover:border-[#586EFF]/50"
                  }`}
                >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/10">
                  <Image
                    src={cat.image}
                    alt={cat.title[locale]}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
                  <span className="absolute bottom-4 left-4 rounded-full bg-[#312F2F]/90 px-4 py-1.5 text-xs sm:text-sm font-bold text-[#C7FF32] backdrop-blur-md shadow-md">
                    {cat.id === "offers" && (locale === "ru" ? "Выгода до 30%" : locale === "hy" ? "Մինչև 30% զեղչ" : "Save up to 30%")}
                    {cat.id === "group" && (locale === "ru" ? "от 10 000 ֏" : locale === "hy" ? "10 000 ֏-ից" : "From 10k ֏")}
                    {cat.id === "individual" && (locale === "ru" ? "Личный гид и авто" : locale === "hy" ? "Անձնական գիд" : "Private Guide")}
                    {cat.id === "jeep" && (locale === "ru" ? "Внедорожники 4x4" : locale === "hy" ? "Ամենագնաց 4x4" : "4x4 Off-Road")}
                    {cat.id === "popular" && (locale === "ru" ? "Хиты поездок" : locale === "hy" ? "Թոփ տուրեր" : "Top Picks")}
                    {cat.id === "packages" && (locale === "ru" ? "Все включено" : locale === "hy" ? "Ամեն ինչ ներառված է" : "All-Inclusive")}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-7 sm:p-8">
                  <h3 className="text-2xl sm:text-3xl font-black text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
                    {cat.title[locale]}
                  </h3>
                  <p className="mt-3 line-clamp-3 flex-1 text-base leading-relaxed text-[#555351]">
                    {cat.desc[locale]}
                  </p>
                  <div className="mt-6 flex items-center gap-2 text-sm sm:text-base font-bold uppercase tracking-wider text-[#586EFF]">
                    <span>
                      {locale === "ru"
                        ? "Выбрать направление"
                        : locale === "hy"
                        ? "Դիտել ուղղությունը"
                        : "Explore tours"}
                    </span>
                    <span className="transition-transform group-hover:translate-x-1.5 font-black">→</span>
                  </div>
                </div>
              </Link>
            </FadeIn>
            </div>
          ))}
        </div>
      </section>

      {/* 3. DYNAMIC SPECIAL OFFERS & SEASONAL PROMOTIONS (Customizable in /admin) */}
      <SpecialOffersSection offers={offers} locale={locale} dict={dict} />

      {/* 3.5 4x4 OFF-ROAD ARMENIA EXPEDITION WIDGET WITH INTERACTIVE JEEP CAR ANIMATION */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 py-10 sm:py-20 lg:py-28">
        <FadeIn>
          <JeepExpeditionWidget locale={locale} />
        </FadeIn>
      </section>

      {/* 4. DESTINATIONS BENTO GALLERY (TripMate "Popular Cities" pattern) */}
      <section className="bg-[#312F2F] py-12 sm:py-20 lg:py-32 text-[#FCFCF7]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
          <FadeIn>
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <span className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                  {locale === "ru" ? "Направления Армении" : locale === "hy" ? "Հայաստանի ուղղությունները" : "Armenian Destinations"}
                </span>
                <h2 className="mt-2 sm:mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFCF7]">
                  {locale === "ru" ? "Легендарные места" : locale === "hy" ? "Հայտնի վայրեր" : "Iconic Landmarks"}
                </h2>
              </div>
              <Link
                href={`/${locale}/tours`}
                className="rounded-full border border-white/20 px-6 sm:px-8 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FCFCF7] transition-all hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {dict.tours.viewAll} →
              </Link>
            </div>
          </FadeIn>

          {/* Bento Grid: swipeable carousel on mobile, bento grid on desktop */}
          <div className="mt-8 sm:mt-14 flex gap-4 overflow-x-auto pb-4 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:gap-6 sm:grid-cols-2 md:grid-cols-4 scrollbar-none snap-x snap-mandatory">
            {destinations.map((dest, i) => (
              <div
                key={dest.name}
                className={`shrink-0 w-[80vw] max-w-[300px] snap-center sm:w-auto sm:shrink sm:max-w-none ${dest.span.replace("aspect-[16/11]", "aspect-[16/10]")}`}
              >
                <FadeIn delay={i * 0.08} className="h-full">
                  <Link
                    href={dest.href}
                    className="group relative block h-full w-full overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition-all duration-300 hover:border-[#C7FF32]/50 hover:shadow-2xl"
                  >
                    <Image
                      src={dest.image}
                      alt={dest.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-[#312F2F]/80 px-3.5 py-1 text-xs font-bold text-[#C7FF32] backdrop-blur-md">
                      {dest.tag}
                    </span>

                    <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                      <h3 className="font-serif text-xl sm:text-3xl font-normal text-white transition-colors group-hover:text-[#C7FF32]">
                        {dest.name}
                      </h3>
                      <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium text-white/80 line-clamp-2">
                        {dest.subtitle}
                      </p>
                    </div>
                  </Link>
                </FadeIn>
              </div>
            ))}
          </div>
        </div>
      </section>





      {/* 8. TESTIMONIALS & GUEST REVIEWS (Dynamic with interactive submit) */}
      <ReviewsSection initialReviews={approvedReviews} locale={locale} guides={guides} />

      {/* 8.5 FREQUENTLY ASKED QUESTIONS (Armenia travel tips, payments, vehicles) */}
      <FaqSection locale={locale} />

      {/* 9. FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-[1360px] px-4 sm:px-6 py-14 sm:py-24 lg:py-32">
        <FadeIn>
          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-[#586EFF] px-5 sm:px-14 py-12 sm:py-20 text-center text-white shadow-2xl">
            {/* Background design elements */}
            <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#C7FF32]/20 blur-2xl pointer-events-none" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-3.5 sm:px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                {locale === "ru" ? "Готовы к путешествию?" : locale === "hy" ? "Պատրա՞ստ եք ճամփորդության" : "Ready for your journey?"}
              </span>
              <h2 className="mt-3 sm:mt-4 font-serif text-2xl sm:text-5xl lg:text-6xl font-normal tracking-tight">
                {dict.cta.title}
              </h2>
              <p className="mt-3 sm:mt-4 text-xs sm:text-lg leading-relaxed text-white/90">
                {dict.cta.subtitle}
              </p>

              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3">
                <Link
                  href={`/${locale}/tours`}
                  className="flex items-center justify-center gap-2.5 rounded-full bg-[#C7FF32] px-7 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-base font-black uppercase tracking-wider text-[#312F2F] shadow-xl transition-all hover:bg-[#bbf028] hover:scale-105 active:scale-95 w-full sm:w-auto"
                >
                  <span>
                    {locale === "ru"
                      ? "Выбирай свой тур"
                      : locale === "hy"
                      ? "Ընտրիր քո տուրը"
                      : "Choose Your Tour"}
                  </span>
                  <span className="text-base font-black">→</span>
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>
    </>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

