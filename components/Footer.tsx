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
    { href: `/${locale}/about`, label: dict.nav.about },
    { href: `/${locale}/tours`, label: dict.nav.tours },
    { href: `/${locale}/contacts`, label: dict.nav.contacts },
  ];

  return (
    <footer className="mt-20 bg-deep text-white">
      <div className="mx-auto grid max-w-[1200px] gap-10 px-6 py-12 md:grid-cols-3">
        <div>
          <p className="text-lg font-extrabold">
            Amaras<span className="text-accent"> Tour</span>
          </p>
          <p className="mt-2 text-sm text-white/70">{dict.footer.tagline}</p>
          <div className="mt-4 flex gap-4">
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="text-white/85 transition-colors hover:text-accent">
              <WhatsAppIcon className="h-5 w-5" />
            </a>
            <a href={links.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="text-white/85 transition-colors hover:text-accent">
              <TelegramIcon className="h-5 w-5" />
            </a>
            <a href={links.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/85 transition-colors hover:text-accent">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        <nav aria-label="Footer">
          <ul className="flex flex-col gap-2">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sm text-white/70 transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="text-sm text-white/70">
          <p className="flex items-center gap-2">
            <PinIcon className="h-4 w-4 shrink-0" />
            {dict.contacts.address}
          </p>
          <p className="mt-2">
            <a href={links.phone} className="flex items-center gap-2 transition-colors hover:text-accent">
              <PhoneIcon className="h-4 w-4 shrink-0" />
              {site.phone}
            </a>
          </p>
          <p className="mt-2">
            <a href={links.email} className="flex items-center gap-2 break-all transition-colors hover:text-accent">
              <MailIcon className="h-4 w-4 shrink-0" />
              {site.email}
            </a>
          </p>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} {site.name}. {dict.footer.rights}
      </div>
    </footer>
  );
}
