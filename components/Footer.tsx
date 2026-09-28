import Image from "next/image";
import Link from "next/link";
import type { Dict, Locale } from "@/lib/i18n";
import { buildLinks, type SiteInfo } from "@/lib/site";
import {
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/icons";

export default function Footer({
  locale,
  dict,
  site,
}: {
  locale: Locale;
  dict: Dict;
  site: SiteInfo;
}) {
  const links = buildLinks(site);
  const nav = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/tours`, label: dict.nav.tours },
    { href: `/${locale}/tour-packages`, label: dict.nav.packages },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  const categories = [
    { href: `/${locale}/tours/group`, label: locale === "ru" ? "Групповые туры" : locale === "hy" ? "Խմբային տուրեր" : "Group Tours" },
    { href: `/${locale}/tours/individual`, label: locale === "ru" ? "Индивидуальные туры" : locale === "hy" ? "Անհատական տուրեր" : "Private Tours" },
    { href: `/${locale}/tours/jeep`, label: locale === "ru" ? "Джип-туры" : locale === "hy" ? "Ջիպ տուրեր" : "4x4 Jeep Tours" },
    { href: `/${locale}/tour-packages`, label: locale === "ru" ? "Тур-пакеты" : locale === "hy" ? "Տուր փաթեթներ" : "Tour Packages" },
  ];

  return (
    <footer className="mt-24 border-t border-[#454343] bg-[#242323] text-[#FCFCF7]">
      <div className="mx-auto max-w-[1240px] px-6 py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/amaras-logo.png"
                alt="AMARAS"
                width={175}
                height={35}
                className="h-8 w-auto object-contain"
              />
              <span className="mt-2 block text-[10px] font-bold uppercase tracking-[0.25em] text-[#C7FF32]">
                Armenia Travel Brand
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-[#FCFCF7]/75">
              {dict.footer.tagline}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#25D366] hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#229ED9] hover:bg-[#229ED9] hover:text-white"
              >
                <TelegramIcon className="h-5 w-5" />
              </a>
              <a
                href={links.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#E1306C] hover:bg-[#E1306C] hover:text-white"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Navigation */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#C7FF32]">
              {locale === "ru" ? "Навигация" : locale === "hy" ? "Նավիգացիա" : "Navigation"}
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm font-medium text-[#FCFCF7]/80 transition-colors hover:text-[#C7FF32]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Travel Categories */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#C7FF32]">
              {locale === "ru" ? "Форматы туров" : locale === "hy" ? "Տուրերի ձևաչափեր" : "Tour Formats"}
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((cat) => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-sm font-medium text-[#FCFCF7]/80 transition-colors hover:text-[#C7FF32]"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contacts & Location */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#C7FF32]">
              {dict.nav.contacts}
            </h3>
            <div className="space-y-3 text-sm text-[#FCFCF7]/80">
              <p className="flex items-start gap-3">
                <PinIcon className="mt-0.5 h-4 w-4 shrink-0 text-[#C7FF32]" />
                <span>{dict.contacts.address}</span>
              </p>
              <p>
                <a
                  href={links.phone}
                  className="flex items-center gap-3 transition-colors hover:text-[#C7FF32]"
                >
                  <PhoneIcon className="h-4 w-4 shrink-0 text-[#C7FF32]" />
                  <span className="font-bold">{site.phone}</span>
                </a>
              </p>
              <p>
                <a
                  href={links.email}
                  className="flex items-center gap-3 break-all transition-colors hover:text-[#C7FF32]"
                >
                  <MailIcon className="h-4 w-4 shrink-0 text-[#C7FF32]" />
                  <span>{site.email}</span>
                </a>
              </p>
            </div>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3 py-1 text-xs font-bold text-[#C7FF32]">
                <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
                {locale === "ru" ? "Ежедневно 09:00 – 21:00" : locale === "hy" ? "Ամեն օր 09:00 – 21:00" : "Daily 09:00 – 21:00"}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-[#454343] pt-6 text-xs text-[#FCFCF7]/60 sm:flex-row">
          <p>© {new Date().getFullYear()} {site.name}. {dict.footer.rights}</p>
          <div className="flex gap-4">
            <span className="text-[#C7FF32]/90">Armenia • Artsakh Spirit • Authentic Travel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

