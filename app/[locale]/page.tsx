import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import FadeIn from "@/components/FadeIn";
import Hero from "@/components/Hero";
import TourCard from "@/components/TourCard";
import { CalendarIcon, WhatsAppIcon, TelegramIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { packageDayRange } from "@/lib/tours";
import { buildLinks } from "@/lib/site";
import { getContent } from "@/lib/content";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();
  const { dicts, tours, categories, site, hero } = await getContent();
  const dict = dicts[locale];
  const links = buildLinks(site);
  // Day tours and multi-day packages are shown in separate rows: their cards
  // carry different amounts of content, so mixing them in one grid stretches
  // the shorter card to the taller one's height.
  const featured = tours.filter((t) => t.featured ?? true);
  const featuredTours = featured.filter((t) => !t.days).slice(0, 3);
  const featuredPackages = featured.filter((t) => t.days).slice(0, 3);
  const packageCategory = categories.find((c) =>
    tours.some((t) => t.days && t.categories.includes(c.id))
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: site.name,
    url: site.url,
    telephone: site.phone,
    email: site.email,
    image: `${site.url}/images/hero-khor-virap.jpg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Yerevan",
      addressCountry: "AM",
    },
    sameAs: [links.instagram, links.telegram],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — slideshow with stats bar */}
      <Hero locale={locale} dict={dict} images={hero.images} />

      {/* Featured tours */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <FadeIn>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              {dict.featured.title}
            </h2>
            <Link
              href={`/${locale}/tours`}
              className="font-bold text-primary hover:underline"
            >
              {dict.featured.all} →
            </Link>
          </div>
        </FadeIn>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTours.map((tour, i) => (
            <FadeIn key={tour.slug} delay={i * 0.06} className="h-full">
              <TourCard
                tour={tour}
                locale={locale}
                dict={dict}
                categories={categories}
              />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Tour packages — their own row, see featuredPackages above */}
      {featuredPackages.length > 0 && packageCategory && (
        <section className="mx-auto max-w-[1200px] px-6 pb-16 md:pb-20">
          <FadeIn>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-3xl font-extrabold md:text-4xl">
                {packageCategory.title[locale]}
              </h2>
              <Link
                href={`/${locale}/tours/${packageCategory.id}`}
                className="font-bold text-primary hover:underline"
              >
                {dict.tours.viewAll} →
              </Link>
            </div>
          </FadeIn>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPackages.map((tour, i) => (
              <FadeIn key={tour.slug} delay={i * 0.06} className="h-full">
                <TourCard
                  tour={tour}
                  locale={locale}
                  dict={dict}
                  categories={categories}
                />
              </FadeIn>
            ))}
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="bg-deep py-16 text-white md:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <FadeIn>
            <h2 className="text-3xl font-extrabold md:text-4xl">
              {dict.categories.title}
            </h2>
          </FadeIn>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {categories.map((category, i) => {
              // Multi-day package categories are labelled on the tile so they
              // are not taken for another set of day trips.
              const range = packageDayRange(
                tours.filter((t) => t.categories.includes(category.id))
              );
              return (
              <FadeIn key={category.id} delay={i * 0.06} className="h-full">
                <Link
                  href={`/${locale}/tours/${category.id}`}
                  className="group block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-colors hover:border-accent/40"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={category.image}
                      alt={category.title[locale]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className={`object-cover transition-transform duration-500 group-hover:scale-105 ${category.imagePosition ?? "object-center"}`}
                    />
                    {range && (
                      <span className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                        <span className="flex items-center gap-1.5 rounded-full bg-deep/90 px-3 py-1 text-xs font-extrabold text-white backdrop-blur">
                          <CalendarIcon className="h-3.5 w-3.5 text-accent" />
                          {range.min === range.max
                            ? `${range.min} ${dict.tours.days}`
                            : `${range.min}–${range.max} ${dict.tours.days}`}
                        </span>
                        <span className="rounded-full bg-accent px-3 py-1 text-xs font-extrabold text-deep">
                          {dict.pkg.allInclusive}
                        </span>
                      </span>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold transition-colors group-hover:text-accent">
                      {category.title[locale]}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/70">
                      {category.desc[locale]}
                    </p>
                  </div>
                </Link>
              </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <FadeIn>
          <h2 className="text-3xl font-extrabold md:text-4xl">
            {dict.why.title}
          </h2>
        </FadeIn>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {dict.why.items.map((item, i) => (
            <FadeIn key={item.title} delay={i * 0.08} className="h-full">
              <div className="h-full rounded-2xl border border-black/5 bg-surface p-6 shadow-[0_1px_3px_rgba(16,24,40,.08)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 font-extrabold text-accent-dark">
                  {i + 1}
                </span>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1200px] px-6">
        <FadeIn>
          <div className="rounded-3xl bg-gradient-to-br from-primary to-deep px-6 py-12 text-center text-white md:py-16">
            <h2 className="text-3xl font-extrabold md:text-4xl">
              {dict.cta.title}
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-white/85">
              {dict.cta.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-6 py-3 font-bold text-deep transition-colors hover:bg-white sm:w-auto"
              >
                <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
                WhatsApp
              </a>
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-full bg-white/95 px-6 py-3 font-bold text-deep transition-colors hover:bg-white sm:w-auto"
              >
                <TelegramIcon className="h-5 w-5 text-[#229ED9]" />
                Telegram
              </a>
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
