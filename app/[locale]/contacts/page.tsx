import type { Metadata } from "next";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import BookButton from "@/components/BookButton";
import {
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/icons";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { buildLinks } from "@/lib/site";
import { getContent } from "@/lib/content";
import { generateTravelAgencySchema, generateBreadcrumbSchema } from "@/lib/schema";

type Props = { params: Promise<{ locale: Locale }> };

export const revalidate = 300;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { dicts } = await getContent();
  const dict = dicts[locale];
  return pageMetadata(
    locale,
    "contacts",
    dict.meta.contacts.title,
    dict.meta.contacts.description
  );
}

export default async function ContactsPage({ params }: Props) {
  const { locale } = await params;
  const { dicts, site } = await getContent();
  const dict = dicts[locale];
  const links = buildLinks(site);

  const contactChannels = [
    {
      href: links.whatsapp,
      label: "WhatsApp",
      subtitle: locale === "ru" ? "Быстрый ответ" : locale === "hy" ? "Արագ պատասխան" : "Fast reply",
      value: site.phone,
      icon: WhatsAppIcon,
      badge: locale === "ru" ? "Рекомендуем" : locale === "hy" ? "Խորհուրդ ենք տալիս" : "Recommended",
      accent: "#C7FF32",
      textColor: "text-[#312F2F]",
      btnBg: "bg-[#25D366] text-white hover:bg-[#20ba59]",
      external: true,
    },
    {
      href: links.telegram,
      label: "Telegram",
      subtitle: locale === "ru" ? "Консультация и бронь" : locale === "hy" ? "Խորհրդատվություն և ամրագրում" : "Consultation & booking",
      value: `@${site.telegram}`,
      icon: TelegramIcon,
      badge: locale === "ru" ? "Онлайн" : locale === "hy" ? "Օնլայն" : "Online",
      accent: "#586EFF",
      textColor: "text-white",
      btnBg: "bg-[#586EFF] text-white hover:bg-[#475ce6]",
      external: true,
    },
    {
      href: links.phone,
      label: dict.contacts.phone,
      subtitle: locale === "ru" ? "Прямой звонок гиду" : locale === "hy" ? "Ուղիղ զանգ գիդին" : "Direct call to guide",
      value: site.phone,
      icon: PhoneIcon,
      accent: "#FCFCF7",
      textColor: "text-[#FCFCF7]",
      btnBg: "bg-[#FCFCF7]/10 text-[#FCFCF7] hover:bg-[#FCFCF7]/20 border border-[#FCFCF7]/20",
      external: false,
    },
    {
      href: links.instagram,
      label: "Instagram",
      subtitle: locale === "ru" ? "Фото и отзывы путешествий" : locale === "hy" ? "Լուսանկարներ և կարծիքներ" : "Travel photos & reviews",
      value: `@${site.instagram}`,
      icon: InstagramIcon,
      accent: "#E1306C",
      textColor: "text-white",
      btnBg: "bg-[#E1306C]/20 text-[#FCFCF7] hover:bg-[#E1306C]/30 border border-[#E1306C]/30",
      external: true,
    },
    {
      href: links.email,
      label: dict.contacts.email,
      subtitle: locale === "ru" ? "Для партнерств и агентств" : locale === "hy" ? "Գործընկերների համար" : "For partners & agencies",
      value: site.email,
      icon: MailIcon,
      accent: "#FCFCF7",
      textColor: "text-[#FCFCF7]",
      btnBg: "bg-[#FCFCF7]/10 text-[#FCFCF7] hover:bg-[#FCFCF7]/20 border border-[#FCFCF7]/20",
      external: false,
    },
  ];

  const agencySchema = generateTravelAgencySchema(site, locale);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: dict.nav.home, url: `/${locale}` },
    { name: dict.nav.contacts, url: `/${locale}/contacts` },
  ]);

  return (
    <div className="min-h-screen bg-[#312F2F] text-[#FCFCF7]">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agencySchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Editorial Header */}
      <div className="border-b border-[#FCFCF7]/10 bg-[#312F2F]">
        <div className="mx-auto max-w-[1240px] px-4 py-8 sm:px-6 md:py-12">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs font-medium text-[#FCFCF7]/50">
            <Link href={`/${locale}`} className="transition-colors hover:text-[#C7FF32]">
              {dict.nav.home}
            </Link>
            <span>/</span>
            <span className="text-[#FCFCF7]">{dict.contacts.title}</span>
          </nav>

          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
              {locale === "ru" ? "24/7 ПОДДЕРЖКА И БРОНИРОВАНИЕ" : locale === "hy" ? "24/7 ԱՋԱԿՑՈՒԹՅՈՒՆ ԵՎ ԱՄՐԱԳՐՈՒՄ" : "24/7 SUPPORT & BOOKING"}
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#FCFCF7] sm:text-5xl md:text-6xl">
              {dict.contacts.title}
            </h1>
            <p className="mt-4 max-w-xl text-base text-[#FCFCF7]/70 sm:text-lg">
              {dict.contacts.subtitle}
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="mx-auto max-w-[1240px] px-4 py-12 sm:px-6 md:py-16">
        {/* Main Grid: Contact Channels (left) + Meeting Point & Hours (right) */}
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Contact Channels Cards */}
          <div className="space-y-4 lg:col-span-7">
            <FadeIn>
              <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-[#C7FF32]">
                {locale === "ru" ? "Прямая связь" : locale === "hy" ? "Ուղիղ կապ" : "Direct Channels"}
              </h2>
            </FadeIn>

            <div className="grid gap-4 sm:grid-cols-2">
              {contactChannels.map((item, i) => (
                <FadeIn key={item.label} delay={i * 0.05} className="min-w-0">
                  <a
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#FCFCF7]/10 bg-[#FCFCF7]/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#586EFF]/50 hover:bg-[#FCFCF7]/10 hover:shadow-xl"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#586EFF]/15 text-[#586EFF] transition-colors group-hover:bg-[#586EFF] group-hover:text-white">
                          <item.icon className="h-6 w-6" />
                        </span>
                        {item.badge && (
                          <span className="rounded-full bg-[#C7FF32]/10 px-2.5 py-0.5 text-[11px] font-bold text-[#C7FF32]">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-4">
                        <span className="block text-xs font-semibold uppercase tracking-wider text-[#FCFCF7]/60">
                          {item.label}
                        </span>
                        <span className="mt-1 block break-words text-lg font-bold text-[#FCFCF7] transition-colors group-hover:text-[#C7FF32]">
                          {item.value}
                        </span>
                        <span className="mt-1 block text-xs text-[#FCFCF7]/50">
                          {item.subtitle}
                        </span>
                      </div>
                    </div>

                    <div className="mt-5">
                      <span className={`inline-flex w-full items-center justify-center rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${item.btnBg}`}>
                        {locale === "ru" ? "Написать / Открыть →" : locale === "hy" ? "Գրել / Բացել →" : "Contact / Open →"}
                      </span>
                    </div>
                  </a>
                </FadeIn>
              ))}
            </div>
          </div>

          {/* Meeting Point & Office Information */}
          <div className="space-y-6 lg:col-span-5">
            <FadeIn delay={0.1}>
              <h2 className="mb-6 text-xl font-bold uppercase tracking-wider text-[#586EFF]">
                {locale === "ru" ? "Локация и сбор" : locale === "hy" ? "Տեղադրություն և հավաքատեղի" : "Location & Meeting Point"}
              </h2>

              {/* Yerevan Office / Address Card */}
              <div className="rounded-3xl border border-[#FCFCF7]/10 bg-[#FCFCF7]/5 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#586EFF] text-white">
                    <PinIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#FCFCF7]">
                      {dict.contacts.address}
                    </h3>
                    <p className="mt-1 text-sm text-[#FCFCF7]/70">
                      {locale === "ru"
                        ? "Главный офис и координация экскурсий"
                        : locale === "hy"
                        ? "Գլխավոր գրասենյակ և էքսկուրսիաների համակարգում"
                        : "Head office & tour coordination"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-[#FCFCF7]/10 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                    {locale === "ru"
                      ? "Точка сбора групповых туров:"
                      : locale === "hy"
                      ? "Խմբային տուրերի հավաքատեղի՝"
                      : "Group tour meeting point:"}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-[#FCFCF7]/80">
                    {locale === "ru"
                      ? "Ереван, пр. Месропа Маштоца 51 (нижняя площадка Матенадарана, остановка Bus Voyage, на пересечении с ул. Корюна)."
                      : locale === "hy"
                      ? "Երևան, Մեսրոպ Մաշտոցի պող. 51 (Մատենադարանի ստորին հարթակ, Bus Voyage կանգառ, Կորյունի փողոցի խաչմերուկում)։"
                      : "Yerevan, 51 Mesrop Mashtots Ave (lower Matenadaran terrace, Bus Voyage stop, junction with Koryun St)."}
                  </p>
                  <p className="mt-2 text-xs text-[#FCFCF7]/50">
                    {locale === "ru"
                      ? "Рекомендуем подходить за 10–15 минут до времени выезда."
                      : locale === "hy"
                      ? "Խորհուրդ ենք տալիս մոտենալ մեկնումից 10–15 րոպե առաջ։"
                      : "We recommend arriving 10–15 minutes before departure."}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#FCFCF7]/10 pt-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#586EFF]">
                    {locale === "ru"
                      ? "График работы:"
                      : locale === "hy"
                      ? "Աշխատանքային ժամեր՝"
                      : "Working hours:"}
                  </h4>
                  <div className="mt-2 flex items-center justify-between text-sm text-[#FCFCF7]/80">
                    <span>
                      {locale === "ru"
                        ? "Поддержка и бронирование:"
                        : locale === "hy"
                        ? "Աջակցություն և ամրագրում՝"
                        : "Support & booking:"}
                    </span>
                    <span className="font-bold text-[#C7FF32]">
                      {locale === "ru" ? "24/7 онлайн" : locale === "hy" ? "24/7 օնլայն" : "24/7 online"}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-sm text-[#FCFCF7]/80">
                    <span>
                      {locale === "ru"
                        ? "Выезды туров:"
                        : locale === "hy"
                        ? "Տուրերի մեկնումներ՝"
                        : "Tour departures:"}
                    </span>
                    <span className="font-bold text-[#FCFCF7]">
                      {locale === "ru" ? "Ежедневно с 05:30" : locale === "hy" ? "Ամեն օր 05:30-ից" : "Daily from 05:30"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Booking Helper */}
              <div className="mt-6 rounded-3xl border border-[#C7FF32]/30 bg-gradient-to-br from-[#312F2F] to-[#C7FF32]/10 p-6 sm:p-8">
                <h3 className="text-xl font-bold text-[#FCFCF7]">
                  {dict.cta.title}
                </h3>
                <p className="mt-2 text-sm text-[#FCFCF7]/70">
                  {dict.cta.subtitle}
                </p>
                <div className="mt-5">
                  <BookButton
                    label={dict.tours.book}
                    variant="accent"
                    className="w-full"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
