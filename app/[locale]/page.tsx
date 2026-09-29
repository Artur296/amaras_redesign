import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import Hero from "@/components/Hero";
import HomeTourFilter from "@/components/HomeTourFilter";
import PackageCard from "@/components/PackageCard";
import JeepExpeditionWidget from "@/components/JeepExpeditionWidget";
import { CalendarIcon, WhatsAppIcon, TelegramIcon, RouteIcon, ShieldIcon, StarIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import {
  findPackagesCategory,
  isPackageTour,
  packageDayRange,
  publicCategories,
} from "@/lib/tours";
import { buildLinks } from "@/lib/site";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const { dicts, tours, categories: allCategories, site, hero } = await getContent();

  const categories = publicCategories(allCategories);
  const dict = dicts[locale];
  const links = buildLinks(site);

  const featured = tours.filter((t) => t.featured ?? true);
  const featuredPackages = featured.filter(isPackageTour).slice(0, 3);
  const packageCategory = findPackagesCategory(allCategories);

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

  // Trust pillars (Reference "Book with confidence")
  const trustPillars = [
    {
      icon: "🗺️",
      title: locale === "ru" ? "Авторские маршруты" : locale === "hy" ? "Հեղինակային երթուղիներ" : "Handcrafted Routes",
      desc: locale === "ru" ? "Каждый тур выверен по таймингу, локациям и видам: от главных святынь до тайных ущелий." : locale === "hy" ? "Յուրաքանչյուր տուր մշակված է մանրակրկիտ՝ լավագույն տպավորությունների համար:" : "Every itinerary is optimized for pacing, comfort, and breathtaking viewpoints.",
    },
    {
      icon: "🎙️",
      title: locale === "ru" ? "Опытные гиды" : locale === "hy" ? "Փորձառու գիդեր" : "Expert Local Storytellers",
      desc: locale === "ru" ? "Истории, легенды и культура оживают на трех языках: русском, армянском и английском." : locale === "hy" ? "Պատմությունն ու մշակույթը կենդանանում են երեք լեզուներով:" : "History and local lore come alive in Russian, Armenian, and English.",
    },
    {
      icon: "🛡️",
      title: locale === "ru" ? "Честная цена без сюрпризов" : locale === "hy" ? "Ազնիվ գներ" : "Transparent Pricing",
      desc: locale === "ru" ? "Никаких скрытых доплат. Транспорт высокого класса, питьевая вода и забота в пути." : locale === "hy" ? "Ոչ մի թաքնված վճար: Բարձրակարգ տրանսպորտ և հոգատար սպասարկում:" : "No surprise fees. Modern Mercedes Sprinters & 4x4 vehicles, bottled water included.",
    },
    {
      icon: "⚡",
      title: locale === "ru" ? "Бронь за 1 минуту" : locale === "hy" ? "Արագ ամրագրում" : "Instant 1-Click Booking",
      desc: locale === "ru" ? "Быстрая связь в WhatsApp и Telegram. Мгновенно подтверждаем места и отправляем детали." : locale === "hy" ? "Արագ կապ WhatsApp-ով և Telegram-ով՝ առանց ավելորդ բարդությունների:" : "Instant confirmation via WhatsApp & Telegram directly with your coordinator.",
    },
  ];

  // Travel Stories / Insights
  const travelArticles = [
    {
      title: locale === "ru" ? "Джип-тур на вулкан Аждаак: марсианские пейзажи и ледяное озеро" : locale === "hy" ? "Ջիպ-տուր դեպի Աժդահակ հրաբուխ" : "4x4 Expedition to Mount Azhdahak",
      category: locale === "ru" ? "Приключения" : locale === "hy" ? "Արկածներ" : "Adventure",
      readTime: "5 min",
      image: "/images/jeep.jpg",
      slug: "tours/jeep",
    },
    {
      title: locale === "ru" ? "Симфония камней и скальный Гегард: чудеса Гарнийского ущелья" : locale === "hy" ? "Քարերի սիմֆոնիա և Գեղարդ" : "Symphony of Stones & Geghard Cave Monastery",
      category: locale === "ru" ? "Культура" : locale === "hy" ? "Մշակույթ" : "Heritage",
      readTime: "4 min",
      image: "/images/garni.jpg",
      slug: "tours/individual/garni-geghard-symphony",
    },
    {
      title: locale === "ru" ? "Как выбрать многодневный тур по Армении: отели, гиды и маршруты" : locale === "hy" ? "Ինչպես ընտրել բազմօրյա տուր փաթեթ" : "Choosing the Perfect Multi-Day Armenia Journey",
      category: locale === "ru" ? "Советы" : locale === "hy" ? "Խորհուրդներ" : "Travel Guide",
      readTime: "6 min",
      image: "/images/noravank.jpg",
      slug: "tour-packages",
    },
  ];

  // Testimonials
  const testimonials = [
    {
      quote: locale === "ru"
        ? "Поездка на Севан и в Дилижан превзошла все ожидания! Водитель очень аккуратный, гид рассказывал потрясающие истории. Организация на высоте!"
        : locale === "hy"
        ? "Սևան և Դիլիջան ուղևորությունը գերազանցեց բոլոր սպասելիքները: Շնորհակալություն հիանալի կազմակերպման համար:"
        : "The tour to Sevan and Dilijan exceeded all expectations. Extremely professional driver, knowledgeable guide, and seamless booking!",
      author: "Anna & Mikhail S.",
      location: "Moscow",
      rating: 5,
    },
    {
      quote: locale === "ru"
        ? "Джип-тур к водопадам — это чистый восторг! Проехали туда, куда на обычной машине и не сунешься. Мощные внедорожники и море адреналина."
        : locale === "hy"
        ? "Ջիպ-տուրը պարզապես հիանալի էր: Հզոր մեքենաներ և անմոռանալի տպավորություններ:"
        : "The 4x4 Jeep tour was breathtaking! Reached remote spots impossible with regular cars. Incredible adrenaline and mountain vistas.",
      author: "David K.",
      location: "Yerevan / Los Angeles",
      rating: 5,
    },
    {
      quote: locale === "ru"
        ? "Брали 5-дневный тур-пакет. Отели отличные, трансферы минута в минуту, программа насыщенная. Ни о чем не беспокоились, только наслаждались Арменией!"
        : locale === "hy"
        ? "5-օրյա փաթեթը շատ հարմարավետ էր: Բոլոր հյուրանոցներն ու էքսկուրսիաները բարձր մակարդակի վրա էին:"
        : "Booked a 5-day package. Premium hotels, punctual transfers, rich cultural programme. Truly stress-free vacation!",
      author: "Elena V.",
      location: "Saint Petersburg",
      rating: 5,
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO with integrated Trip Discovery Search */}
      <Hero locale={locale} dict={dict} images={hero.images} />

      {/* 2. FEATURED TOURS & BEST HOLIDAY DEALS (Black Tomato / Luxury Travel style) */}
      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <FadeIn>
          <div className="flex flex-col gap-2">
            <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
              {locale === "ru" ? "Кураторская подборка" : locale === "hy" ? "Ընտրված տուրեր" : "Curated Journeys"}
            </span>
            <h2 className="font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl lg:text-5xl">
              {dict.featured.title}
            </h2>
          </div>
        </FadeIn>

        {/* Client Interactive Filter Tabs + Tour Grid */}
        <div className="mt-8">
          <HomeTourFilter
            tours={featured}
            categories={categories}
            locale={locale}
            dict={dict}
          />
        </div>
      </section>

      {/* 3. PROMOTIONAL SEASONAL BANNER */}
      <section className="mx-auto max-w-[1240px] px-6 pb-12">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#312F2F] via-[#242323] to-[#312F2F] p-8 text-[#FCFCF7] shadow-xl sm:p-12 border border-[#454343]">
            {/* Ambient accent flare */}
            <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[#C7FF32]/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-[#586EFF]/15 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-[#C7FF32] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#312F2F]">
                  ⚡ {locale === "ru" ? "Скидка до 25% на раннее бронирование" : locale === "hy" ? "Մինչև 25% զեղչ վաղ ամրագրման դեպքում" : "Up to 25% Off Early Bookings"}
                </span>
                <h3 className="mt-4 font-serif text-2xl font-normal tracking-tight sm:text-3xl lg:text-4xl text-[#FCFCF7]">
                  {locale === "ru" ? "Откройте настоящую Армению с AMARAS" : locale === "hy" ? "Բացահայտեք իրական Հայաստանը" : "Experience Authentic Armenia With AMARAS"}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#FCFCF7]/80 sm:text-base">
                  {locale === "ru"
                    ? "Бронируйте групповые и джип-туры заранее по специальным фиксированным ценам. Без предоплаты — бронируйте прямо в WhatsApp."
                    : locale === "hy"
                    ? "Ամրագրեք խմբային և ջիպ-տուրերը նախապես հատուկ շահավետ գներով: Առանց կանխավճարի:"
                    : "Book group & 4x4 jeep tours in advance at special promotional rates with zero prepayment."}
                </p>
              </div>

              <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-full bg-[#C7FF32] px-7 py-3.5 text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-all hover:bg-[#b8f226] hover:scale-105"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
                <Link
                  href={`/${locale}/tours`}
                  className="flex items-center justify-center rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:border-[#C7FF32] hover:text-[#C7FF32]"
                >
                  {dict.tours.viewAll} →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* 3.5 4x4 OFF-ROAD ARMENIA EXPEDITION WIDGET WITH INTERACTIVE JEEP CAR ANIMATION */}
      <section className="mx-auto max-w-[1240px] px-6 pb-20">
        <FadeIn>
          <JeepExpeditionWidget locale={locale} />
        </FadeIn>
      </section>

      {/* 4. DESTINATIONS BENTO GALLERY (TripMate "Popular Cities" pattern) */}
      <section className="bg-[#312F2F] py-20 text-[#FCFCF7]">
        <div className="mx-auto max-w-[1240px] px-6">
          <FadeIn>
            <div className="flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                  {locale === "ru" ? "Направления Армении" : locale === "hy" ? "Հայաստանի ուղղությունները" : "Armenian Destinations"}
                </span>
                <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight sm:text-4xl lg:text-5xl text-[#FCFCF7]">
                  {locale === "ru" ? "Легендарные места" : locale === "hy" ? "Հայտնի վայրեր" : "Iconic Landmarks"}
                </h2>
              </div>
              <Link
                href={`/${locale}/tours`}
                className="rounded-full border border-white/20 px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-[#FCFCF7] transition-all hover:border-[#C7FF32] hover:text-[#C7FF32]"
              >
                {dict.tours.viewAll} →
              </Link>
            </div>
          </FadeIn>

          {/* Bento Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
            {destinations.map((dest, i) => (
              <FadeIn key={dest.name} delay={i * 0.08} className={dest.span}>
                <Link
                  href={dest.href}
                  className="group relative block h-full w-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition-all duration-300 hover:border-[#C7FF32]/50 hover:shadow-2xl"
                >
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                  <span className="absolute left-4 top-4 rounded-full bg-[#312F2F]/80 px-3 py-1 text-xs font-bold text-[#C7FF32] backdrop-blur-md">
                    {dest.tag}
                  </span>

                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-serif text-2xl font-normal text-white transition-colors group-hover:text-[#C7FF32]">
                      {dest.name}
                    </h3>
                    <p className="mt-1.5 text-xs font-medium text-white/80 line-clamp-2">
                      {dest.subtitle}
                    </p>
                  </div>
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MULTI-DAY TOUR PACKAGES (All Inclusive Showcase) */}
      {featuredPackages.length > 0 && packageCategory && (
        <section className="mx-auto max-w-[1240px] px-6 py-20">
          <FadeIn>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
                  {dict.pkg.badge}
                </span>
                <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl lg:text-5xl">
                  {packageCategory.title[locale]}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#6B6967]">
                  {packageCategory.desc[locale]}
                </p>
              </div>
              <Link
                href={`/${locale}/tour-packages`}
                className="inline-flex items-center gap-2 text-sm font-bold text-[#586EFF] hover:underline"
              >
                <span>{dict.tours.viewAll}</span>
                <span className="text-base font-black">→</span>
              </Link>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((tour, i) => (
              <FadeIn key={tour.slug} delay={i * 0.08} className="h-full">
                <PackageCard
                  tour={tour}
                  locale={locale}
                  dict={dict}
                />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* 6. TRUST SECTION ("Book With Confidence" - TripMate pattern) */}
      <section className="bg-[#FCFCF7] border-y border-[#EAE9E0] py-20">
        <div className="mx-auto max-w-[1240px] px-6">
          <FadeIn>
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
                {locale === "ru" ? "Надежность и опыт" : locale === "hy" ? "Վստահություն և փորձ" : "Travel with Confidence"}
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl lg:text-5xl">
                {dict.why.title}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustPillars.map((pillar, i) => (
              <FadeIn key={pillar.title} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col rounded-3xl border border-[#EAE9E0] bg-white p-7 shadow-sm transition-all duration-300 hover:border-[#586EFF]/40 hover:shadow-lg">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#586EFF]/10 text-2xl">
                    {pillar.icon}
                  </span>
                  <h3 className="mt-5 text-lg font-black text-[#312F2F]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6B6967]">
                    {pillar.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 7. TRAVEL STORIES / CULTURAL GUIDES (TripMate "Latest Travel Libraries") */}
      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <FadeIn>
          <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#586EFF]">
                {locale === "ru" ? "Заметки путешественника" : locale === "hy" ? "Ճանապարհորդական նոթեր" : "Travel Stories & Guides"}
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#312F2F] sm:text-4xl lg:text-5xl">
                {locale === "ru" ? "Вдохновение для поездки" : locale === "hy" ? "Ոգեշնչում ճամփորդության համար" : "Inspiration for Armenia"}
              </h2>
            </div>
            <Link
              href={`/${locale}/about`}
              className="text-sm font-bold text-[#586EFF] hover:underline"
            >
              {dict.nav.about} →
            </Link>
          </div>
        </FadeIn>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {travelArticles.map((art, i) => (
            <FadeIn key={art.title} delay={i * 0.08} className="h-full">
              <Link
                href={`/${locale}/${art.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#EAE9E0] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-black/5">
                  <Image
                    src={art.image}
                    alt={art.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-[#312F2F]/85 px-3 py-1 text-xs font-bold text-[#C7FF32] backdrop-blur-md">
                    {art.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <span className="text-xs font-semibold text-muted">
                    {art.readTime} {locale === "ru" ? "чтения" : "read"}
                  </span>
                  <h3 className="mt-2 text-lg font-black leading-snug text-[#312F2F] transition-colors group-hover:text-[#586EFF]">
                    {art.title}
                  </h3>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#586EFF]">
                    {locale === "ru" ? "Читать подробнее" : locale === "hy" ? "Կարդալ ավելին" : "Read more"} →
                  </span>
                </div>
              </Link>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS (TripMate "What customers say about us") */}
      <section className="bg-[#312F2F] py-20 text-[#FCFCF7]">
        <div className="mx-auto max-w-[1240px] px-6">
          <FadeIn>
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                {locale === "ru" ? "Отзывы наших гостей" : locale === "hy" ? "Մեր հյուրերի կարծիքները" : "Traveler Testimonials"}
              </span>
              <h2 className="mt-2 font-serif text-3xl font-normal tracking-tight text-[#FCFCF7] sm:text-4xl lg:text-5xl">
                {locale === "ru" ? "Что говорят о поездках с AMARAS" : locale === "hy" ? "Ինչ են ասում AMARAS-ի մասին" : "What Travelers Say About AMARAS"}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((test, i) => (
              <FadeIn key={test.author} delay={i * 0.08} className="h-full">
                <div className="flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                  <div>
                    <div className="flex gap-1 text-sm text-[#C7FF32]">
                      {"★".repeat(test.rating)}
                    </div>
                    <p className="mt-4 font-serif text-base leading-relaxed text-[#FCFCF7]/95 italic">
                      “{test.quote}”
                    </p>
                  </div>
                  <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C7FF32] font-black text-[#312F2F]">
                      {test.author.charAt(0)}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">
                        {test.author}
                      </span>
                      <span className="block text-xs text-white/60">
                        {test.location}
                      </span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FINAL CALL TO ACTION */}
      <section className="mx-auto max-w-[1240px] px-6 py-20">
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-[#586EFF] px-8 py-16 text-center text-white shadow-2xl sm:px-12">
            {/* Background design elements */}
            <div className="absolute -left-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -right-12 -bottom-12 h-64 w-64 rounded-full bg-[#C7FF32]/20 blur-2xl" />

            <div className="relative z-10 mx-auto max-w-2xl">
              <span className="inline-block rounded-full bg-white/20 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-white">
                {locale === "ru" ? "Готовы к путешествию?" : locale === "hy" ? "Պատրա՞ստ եք ճամփորդության" : "Ready for your journey?"}
              </span>
              <h2 className="mt-4 font-serif text-3xl font-normal tracking-tight sm:text-5xl lg:text-6xl">
                {dict.cta.title}
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/90 sm:text-lg">
                {dict.cta.subtitle}
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <a
                  href={links.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-8 py-4 font-black uppercase tracking-wider text-white shadow-xl transition-transform hover:scale-105"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  <span>WhatsApp</span>
                </a>
                <a
                  href={links.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2.5 rounded-full bg-white px-8 py-4 font-black uppercase tracking-wider text-[#312F2F] shadow-xl transition-transform hover:scale-105"
                >
                  <TelegramIcon className="h-5 w-5 text-[#229ED9]" />
                  <span>Telegram</span>
                </a>
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

