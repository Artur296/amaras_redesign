import type { Dict, InfoSection, Locale } from "@/lib/i18n";
import type { Tour } from "@/lib/tours";

// The "useful information" panel: everything a customer asks after deciding
// they want the tour. A tour that carries its own sections uses them — most
// tours describe their own inclusions, weather caveats and packing list — and
// anything without them falls back to the shared text in dict.info. Either way
// the phone number and the times are injected rather than typed, so they have
// one source of truth.
//
// Built on a native <details> rather than React state so it opens before the
// page has hydrated, works without JavaScript, is keyboard accessible, and
// keeps its text in the HTML where search engines can read it.
export default function TourInfo({
  tour,
  locale,
  dict,
  phone,
}: {
  tour: Tour;
  locale: Locale;
  dict: Dict;
  phone: string;
}) {
  const info = dict.info;
  if (!info) return null;
  const own = tour.infoSections?.[locale] ?? [];
  const source = own.length ? own : info.sections;
  if (!source?.length) return null;

  // Lines this tour contributes to a shared section. A section whose id is not
  // listed here renders exactly as written, so renaming or blanking an id in
  // /admin can only cost the extra lines, never the section.
  const extras: Record<string, string[]> = {
    booking: [`${info.contactLabel}: ${phone}`],
    meeting: [
      tour.meetTime ? `${info.meetLabel}: ${tour.meetTime}` : "",
      tour.departure ? `${dict.tour.departure}: ${tour.departure}` : "",
    ].filter(Boolean),
    tickets: tour.tickets?.[locale] ?? [],
  };

  // A section that carries nothing of its own and gets nothing from the tour
  // would render as a bare heading, so drop it. That is what keeps a section
  // emptied out in /admin from leaving a stray title behind.
  const sections = source.filter(
    (s) =>
      s.paragraphs.length ||
      s.items.length ||
      s.note ||
      (extras[s.id]?.length ?? 0)
  );
  if (!sections.length) return null;

  return (
    <details className="group mt-10 overflow-hidden rounded-2xl border border-black/5 bg-surface">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-lg font-extrabold marker:content-none hover:text-primary">
        {info.title}
        <span
          aria-hidden
          className="shrink-0 text-primary transition-transform group-open:rotate-180"
        >
          ▾
        </span>
      </summary>
      <div className="space-y-7 border-t border-black/5 p-5 pt-6">
        {sections.map((section, i) => (
          <Section
            key={i}
            section={section}
            extra={extras[section.id] ?? []}
          />
        ))}
      </div>
    </details>
  );
}

function Section({
  section,
  extra,
}: {
  section: InfoSection;
  extra: string[];
}) {
  return (
    <section>
      <h3 className="text-sm font-extrabold uppercase tracking-wide text-deep">
        {section.heading}
      </h3>
      <div className="mt-2.5 space-y-2.5 text-sm leading-relaxed text-muted">
        {section.paragraphs.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}

        {/* The tour's own lines sit with the list, above the closing note. */}
        {(section.items.length > 0 || extra.length > 0) && (
          <ul className="space-y-2">
            {[...section.items, ...extra].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}

        {section.note && <p className="font-semibold text-deep">{section.note}</p>}
      </div>
    </section>
  );
}
