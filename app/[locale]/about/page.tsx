import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import { GuideIcon, VanIcon, TicketIcon, PinIcon, ShieldIcon, StarIcon, RouteIcon } from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";
import { generateBreadcrumbSchema } from "@/lib/schema";
import { aboutData } from "@/lib/about";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { dicts } = await getContent();
  const dict = dicts[locale];
  const metaTitle = `${aboutData.title[locale]} — ${aboutData.kicker[locale]} | ${aboutData.subtitle[locale]}`;
  const metaDesc = aboutData.story[locale][0] + " " + aboutData.story[locale][2];
  return pageMetadata(
    locale,
    "about",
    metaTitle,
    dict.meta?.about?.description || metaDesc
  );
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, site } = await getContent();
  const dict = dicts[locale];

  const valueIcons = [ShieldIcon, StarIcon, GuideIcon, VanIcon, RouteIcon];
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: aboutData.title[locale], url: `/${locale}/about` },
  ]);

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Editorial Header & Breadcrumb */}
      <div className="border-b border-[#FCFCF7]/10 bg-gradient-to-b from-[#242323] to-[#312F2F]">
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">{aboutData.title[locale]}</span>
          </nav>

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
              {aboutData.kicker[locale]}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#FCFCF7] sm:text-5xl md:text-6xl">
              {aboutData.title[locale]}
            </h1>
            <p className="mt-3 max-w-2xl text-lg font-medium text-[#C7FF32] sm:text-2xl">
              {aboutData.subtitle[locale]}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 md:py-20 space-y-20 sm:space-y-24 md:space-y-28">
        {/* Story Section: Heartfelt Narrative + Sticky Photography Card */}
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-14">
          <FadeIn className="space-y-6 lg:col-span-7">
            <div className="space-y-5 text-base leading-relaxed text-[#FCFCF7]/85 sm:text-lg">
              {aboutData.story[locale].map((p, idx) => (
                <p
                  key={idx}
                  className={
                    idx === 0
                      ? "text-xl font-medium leading-relaxed text-[#FCFCF7] sm:text-2xl border-l-2 border-[#C7FF32] pl-4"
                      : idx === 1 || idx === 6
                      ? "text-[#FCFCF7]/95 font-medium"
                      : ""
                  }
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

          <FadeIn delay={0.15} className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-3xl border border-[#FCFCF7]/15 bg-black/40 shadow-2xl">
              <Image
                src={site.aboutImage}
                alt={aboutData.title[locale]}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#312F2F] via-[#312F2F]/20 to-transparent opacity-90" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-[#FCFCF7]/20 bg-[#242323]/90 p-4 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#586EFF] text-white">
                    <PinIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-[#C7FF32]">
                      Yerevan, Armenia
                    </div>
                    <div className="text-sm font-bold text-[#FCFCF7]">
                      {site.name} — {aboutData.subtitle[locale]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Vision & Mission Bento Grid */}
        <div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Vision Card */}
            <FadeIn>
              <div className="h-full rounded-3xl border border-[#586EFF]/30 bg-gradient-to-br from-[#242323] to-[#312F2F] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#586EFF]/10 blur-3xl pointer-events-none" />
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#586EFF]/40 bg-[#586EFF]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#586EFF]">
                    VISION
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-[#FCFCF7] sm:text-3xl">
                    {aboutData.vision.title[locale]}
                  </h2>
                  <div className="mt-6 space-y-4 text-base leading-relaxed text-[#FCFCF7]/80">
                    {aboutData.vision.paragraphs[locale].map((p, i) => (
                      <p key={i} className={i === 0 ? "text-lg font-medium text-[#FCFCF7]" : ""}>
                        {p}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>

            {/* Mission Card */}
            <FadeIn delay={0.1}>
              <div className="h-full rounded-3xl border border-[#C7FF32]/30 bg-gradient-to-br from-[#242323] to-[#312F2F] p-8 sm:p-10 shadow-xl relative overflow-hidden flex flex-col justify-between">
                <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-[#C7FF32]/10 blur-3xl pointer-events-none" />
                <div>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/15 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                    MISSION
                  </div>
                  <h2 className="mt-4 text-2xl font-black text-[#FCFCF7] sm:text-3xl">
                    {aboutData.mission.title[locale]}
                  </h2>
                  <div className="mt-5 rounded-2xl border border-[#C7FF32]/25 bg-[#C7FF32]/5 p-4 text-lg font-semibold text-[#C7FF32]">
                    «{aboutData.mission.highlight[locale]}»
                  </div>
                  <div className="mt-5 space-y-3.5 text-base leading-relaxed text-[#FCFCF7]/80">
                    {aboutData.mission.paragraphs[locale].map((p, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#C7FF32]" />
                        <p>{p}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Values Section: 5 Values */}
        <div>
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                AMARAS STANDARDS
              </div>
              <h2 className="mt-3 text-2xl font-black text-[#FCFCF7] sm:text-4xl">
                {aboutData.values.title[locale]}
              </h2>
            </div>
          </FadeIn>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {aboutData.values.items.map((item, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <FadeIn key={i} delay={0.07 * i}>
                  <div className="group relative h-full rounded-2xl border border-[#FCFCF7]/10 bg-[#FCFCF7]/5 p-7 transition-all duration-300 hover:border-[#C7FF32]/50 hover:bg-[#FCFCF7]/10 flex flex-col justify-between">
                    <div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#586EFF]/15 text-[#586EFF] transition-colors group-hover:bg-[#C7FF32] group-hover:text-[#242323]">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="mt-5 text-xl font-bold text-[#FCFCF7]">
                        {item.title[locale]}
                      </h3>
                      <p className="mt-2.5 text-sm leading-relaxed text-[#FCFCF7]/75">
                        {item.desc[locale]}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>

        {/* Heartfelt Note Card ("И ещё немного от души…") */}
        <FadeIn delay={0.15}>
          <div className="relative overflow-hidden rounded-3xl border border-[#C7FF32]/35 bg-gradient-to-br from-[#242323] via-[#312F2F] to-[#1F1E1E] p-8 sm:p-14 shadow-2xl">
            <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-[#C7FF32]/10 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-[#586EFF]/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                {aboutData.heartfelt.title[locale]}
              </div>

              <div className="mt-6 space-y-4 text-base sm:text-xl font-medium leading-relaxed text-[#FCFCF7]/95">
                {aboutData.heartfelt.paragraphs[locale].map((p, idx) => (
                  <p key={idx} className="leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-0.5 w-8 bg-[#C7FF32]" />
                  <span className="text-base sm:text-lg font-black uppercase tracking-wider text-white">
                    {aboutData.heartfelt.signature[locale]}
                  </span>
                </div>
                <div className="text-sm sm:text-base font-serif italic text-[#C7FF32] font-semibold">
                  «{aboutData.heartfelt.motto[locale]}»
                </div>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Stats Row */}
        <FadeIn delay={0.2}>
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

        {/* Booking CTA Banner */}
        <FadeIn delay={0.25}>
          <div className="relative overflow-hidden rounded-3xl border border-[#586EFF]/30 bg-gradient-to-br from-[#242323] via-[#312F2F] to-[#586EFF]/20 p-8 sm:p-12">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block rounded-full bg-[#C7FF32] px-3.5 py-1 text-xs font-black uppercase tracking-wider text-[#312F2F]">
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
