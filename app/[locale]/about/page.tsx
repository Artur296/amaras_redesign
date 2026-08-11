import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { locales, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/lib/content";

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
  const { dicts } = await getContent();
  const dict = dicts[locale];

  return (
    <div className="mx-auto max-w-[1200px] px-6 py-12 md:py-16">
      <FadeIn>
        <h1 className="text-4xl font-extrabold md:text-5xl">
          {dict.about.title}
        </h1>
      </FadeIn>
      <div className="mt-10 grid items-start gap-10 md:grid-cols-2">
        <FadeIn>
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            {dict.about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src="/images/noravank.jpg"
              alt="Noravank"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </FadeIn>
      </div>
    </div>
  );
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
