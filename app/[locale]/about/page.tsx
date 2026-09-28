import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import { GuideIcon, VanIcon, TicketIcon, PinIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { dicts } = await getContent();
  const dict = dicts[locale];
  return pageMetadata(
    locale,
    "about",
    dict.meta.about.title,
    dict.meta.about.description
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, site } = await getContent();
  const dict = dicts[locale];

  const valueIcons = [GuideIcon, VanIcon, TicketIcon];
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.about.title, url: `/${locale}/about` },
  ]);

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {/* Editorial Header & Breadcrumb */}
      <div className="border-b border-[#FCFCF7]/10 bg-[#312F2F]">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 md:py-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">{dict.about.title}</span>
          </nav>

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
              AMARAS TOURS
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#FCFCF7] sm:text-5xl md:text-6xl">
              {dict.about.title}
            </h1>
            <p className="mt-4 max-w-2xl text-base text-[#FCFCF7]/70 sm:text-lg">
              {dict.hero.subtitle}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 md:py-16">
        {/* Story Section: Text + Photography */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <FadeIn className="space-y-6 lg:col-span-7">
            <div className="space-y-5 text-base leading-relaxed text-[#FCFCF7]/80 sm:text-lg">
              {dict.about.paragraphs.map((p, idx) => (
                <p
                  key={idx}
                  className={idx === 0 ? "text-lg font-medium text-[#FCFCF7] sm:text-xl" : ""}
                >
                  {p}
                </p>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <BookButton
                label={dict.tours.book}
                variant="accent"
              />
              <Link
                href={`/${locale}/tours`}
                className="inline-flex h-11 items-center justify-center rounded-xl border border-[#FCFCF7]/20 bg-[#FCFCF7]/5 px-6 text-sm font-bold text-[#FCFCF7] transition-all hover:border-[#586EFF] hover:bg-[#586EFF]/10 hover:text-white"
              >
                {dict.hero.ctaTours}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={0.15} className="lg:col-span-5">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-[#FCFCF7]/15 bg-black/40 shadow-2xl">
              <Image
                src={site.aboutImage}
                alt={dict.about.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#312F2F] via-transparent to-transparent opacity-80" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#FCFCF7]/20 bg-[#312F2F]/80 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#586EFF] text-white">
                    <PinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C7FF32]">
                      Yerevan, Armenia
                    </div>
                    <div className="text-sm font-bold text-[#FCFCF7]">
                      {site.name}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Stats Row */}
        <FadeIn delay={0.2} className="mt-16 sm:mt-20">
          <div className="grid grid-cols-1 gap-4 rounded-3xl border border-[#FCFCF7]/10 bg-[#FCFCF7]/5 p-6 backdrop-blur-sm sm:grid-cols-3 sm:p-8">
            {dict.stats.map((stat, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center border-b border-[#FCFCF7]/10 p-4 text-center last:border-0 sm:border-b-0 sm:border-r"
              >
                <div className="text-4xl font-black tracking-tight text-[#C7FF32] sm:text-5xl">
                  {stat.value}
                </div>
                <div className="mt-2 text-sm font-semibold uppercase tracking-wider text-[#FCFCF7]/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* Brand Values / Why Amaras */}
        <div className="mt-20 sm:mt-24">
          <FadeIn>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#586EFF]/30 bg-[#586EFF]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#586EFF]">
                AMARAS STANDARDS
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#FCFCF7] sm:text-4xl">
                {dict.why.title}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {dict.why.items.map((item, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <FadeIn key={i} delay={0.08 * i}>
                  <div className="group relative h-full rounded-2xl border border-[#FCFCF7]/10 bg-[#FCFCF7]/5 p-7 transition-all duration-300 hover:border-[#586EFF]/50 hover:bg-[#FCFCF7]/10">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#586EFF]/15 text-[#586EFF] transition-colors group-hover:bg-[#586EFF] group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-[#FCFCF7]">
                      {item.title}
                    </h3>
                    <p className="mt-2.5 text-sm leading-relaxed text-[#FCFCF7]/70">
                      {item.desc}
                    </p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Booking CTA Banner */}
        <FadeIn delay={0.25} className="mt-20">
          <div className="relative overflow-hidden rounded-3xl border border-[#586EFF]/30 bg-gradient-to-br from-[#312F2F] via-[#312F2F] to-[#586EFF]/20 p-8 sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block rounded-full bg-[#C7FF32] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#312F2F]">
                24/7 RESERVATIONS
              </span>
              <h3 className="mt-4 text-2xl font-black text-[#FCFCF7] sm:text-4xl">
                {dict.cta.title}
              </h3>
              <p className="mt-3 text-base text-[#FCFCF7]/80 sm:text-lg">
                {dict.cta.subtitle}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <BookButton
                  label={dict.tours.book}
                  variant="accent"
                />
                <Link
                  href={`/${locale}/contacts`}
                  className="inline-flex h-11 items-center justify-center rounded-xl border border-[#FCFCF7]/20 bg-[#FCFCF7]/10 px-6 text-sm font-bold text-[#FCFCF7] transition-all hover:border-[#C7FF32] hover:text-[#C7FF32]"
                >
                  {dict.nav.contacts}
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
