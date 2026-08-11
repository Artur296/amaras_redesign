import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
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

  const items = [
    {
      href: links.whatsapp,
      label: "WhatsApp",
      value: site.phone,
      icon: WhatsAppIcon,
      external: true,
    },
    {
      href: links.telegram,
      label: "Telegram",
      value: `@${site.telegram}`,
      icon: TelegramIcon,
      external: true,
    },
    {
      href: links.instagram,
      label: "Instagram",
      value: `@${site.instagram}`,
      icon: InstagramIcon,
      external: true,
    },
    {
      href: links.phone,
      label: dict.contacts.phone,
      value: site.phone,
      icon: PhoneIcon,
      external: false,
    },
    {
      href: links.email,
      label: dict.contacts.email,
      value: site.email,
      icon: MailIcon,
      external: false,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
      <FadeIn>
        <h1 className="text-4xl font-extrabold md:text-5xl">
          {dict.contacts.title}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-muted">
          {dict.contacts.subtitle}
        </p>
      </FadeIn>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, i) => (
          <FadeIn key={item.href} delay={i * 0.06}>
            <a
              href={item.href}
              {...(item.external
                ? { target: "_blank", rel: "noopener noreferrer" }
                : {})}
              className="group flex items-center gap-4 rounded-2xl border border-black/5 bg-surface p-5 shadow-[0_1px_3px_rgba(16,24,40,.08)] transition-colors hover:border-accent/50"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block text-sm text-muted">{item.label}</span>
                <span className="block font-bold transition-colors group-hover:text-primary">
                  {item.value}
                </span>
              </span>
            </a>
          </FadeIn>
        ))}
      </div>

      <FadeIn delay={0.2}>
        <p className="mt-10 flex items-center gap-2 text-muted">
          <PinIcon className="h-5 w-5" />
          {dict.contacts.address}
        </p>
      </FadeIn>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
