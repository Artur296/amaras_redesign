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
    { href: `/${locale}/what-to-see`, label: locale === "ru" ? "Что посмотреть в Армении" : locale === "hy" ? "Ինչ տեսնել Հայաստանում" : "What to See in Armenia" },
    { href: `/${locale}/tour-packages`, label: dict.nav.packages },
    { href: `/${locale}/guests`, label: dict.nav.guests },
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  const categories = [
    { href: `/${locale}/tours/group`, label: locale === "ru" ? "Групповые туры" : locale === "hy" ? "Խմբային տուրեր" : "Group Tours" },
    { href: `/${locale}/tours/individual`, label: locale === "ru" ? "Индивидуальные туры" : locale === "hy" ? "Անհատական տուրեր" : "Private Tours" },
    { href: `/${locale}/tours/jeep`, label: locale === "ru" ? "Джип-туры" : locale === "hy" ? "Ջիպ-տուրեր" : "4x4 Jeep Tours" },
    { href: `/${locale}/tour-packages`, label: locale === "ru" ? "Тур-пакеты" : locale === "hy" ? "Տուր փաթեթներ" : "Tour Packages" },
  ];

  return (
    <footer className="mt-12 sm:mt-20 border-t border-[#454343] bg-[#242323] text-[#FCFCF7]">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {/* Column 1: Brand matching logo */}
          <div className="space-y-4">
            <Link href={`/${locale}`} className="inline-block transition-transform hover:scale-105" aria-label="AMARAS Home">
              <Image
                src="/images/amaras-logo-white.svg"
                alt="AMARAS Tour"
                width={260}
                height={36}
                className="h-8 sm:h-9 w-auto object-contain transition-opacity hover:opacity-90"
              />
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
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#161616]"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
              <a
                href={links.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Telegram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition-all hover:border-[#586EFF] hover:bg-[#586EFF] hover:text-white"
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

          {/* Column 2: Address & Direct Contacts (Exact match to mockup Column 2) */}
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
            <div className="pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#C7FF32]/30 bg-[#C7FF32]/10 px-3 py-1 text-xs font-bold text-[#C7FF32]">
                <span className="h-2 w-2 rounded-full bg-[#C7FF32] animate-pulse" />
                {locale === "ru" ? "Ежедневно 09:00 – 21:00" : locale === "hy" ? "Ամեն օր 09:00 – 21:00" : "Daily 09:00 – 21:00"}
              </span>
            </div>
          </div>

          {/* Column 3: Navigation (About Us, Tours, Contacts) */}
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

          {/* Column 4: Work Inquiries / Partnership (Exact match to mockup Column 4) */}
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.18em] text-[#C7FF32]">
              {locale === "ru" ? "Сотрудничество" : locale === "hy" ? "Համագործակցություն" : "Work Inquiries"}
            </h3>
            <p className="text-sm leading-relaxed text-[#FCFCF7]/80">
              {locale === "ru"
                ? "Заинтересованы в партнерстве или организации корпоративного тура?"
                : locale === "hy"
                ? "Հետաքրքրվա՞ծ եք համագործակցությամբ կամ կորպորատիվ տուրերով:"
                : "Interested in partnership or corporate travel bookings?"}
            </p>
            <div className="pt-2">
              <a
                href={links.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white underline underline-offset-4 decoration-[#C7FF32] hover:text-[#C7FF32]"
              >
                <span>{locale === "ru" ? "Связаться с нами →" : locale === "hy" ? "Կապ մեզ հետ →" : "Contact team →"}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 sm:mt-14 flex flex-col items-center justify-between gap-3 border-t border-[#454343] pt-6 text-xs text-[#FCFCF7]/60 sm:flex-row text-center sm:text-left">
          <p>© {new Date().getFullYear()} {site.name}. {dict.footer.rights}</p>
          <div className="flex gap-4">
            <span className="text-[#C7FF32]/90">Armenia • Artsakh Spirit • Authentic Travel</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

