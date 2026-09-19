"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { locales, type Dict, type InfoSection, type Locale } from "@/lib/i18n";
import {
  discountPercent,
  isPackageTour,
  PACKAGES_CATEGORY_ID,
  type Category,
  type Tour,
} from "@/lib/tours";
import type { SiteInfo } from "@/lib/site";
import type { Content, ContentKey } from "@/lib/content";

const localeNames: Record<Locale, string> = {
  ru: "Русский",
  hy: "Հայերեն",
  en: "English",
};

// Multi-day packages are their own section of the site, not one category
// among others, so both the section itself and the packages in it are
// edited in the Packages tab. isPackageTour and the id are shared with the
// public pages so the two can never disagree.
const PACKAGE_CATEGORY = PACKAGES_CATEGORY_ID;

const TABS = ["Tours", "Packages", "Images", "Categories", "Texts", "Contacts", "Import", "Password"] as const;
type Tab = (typeof TABS)[number];

export default function AdminPanel() {
  const [content, setContent] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>("Tours");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/admin/content").then(async (res) => {
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      setContent(await res.json());
    });
  }, []);

  // Publishing commits the edit to the repository, which is what makes
  // Vercel rebuild. Every key in one call becomes one commit, so a save
  // costs one deploy however many fields it touched.
  async function publish(values: Partial<Record<ContentKey, unknown>>) {
    setStatus("Publishing…");
    try {
      const res = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setStatus(body?.error ?? `Publish failed (${res.status})`);
      } else if (body?.changed === false) {
        setStatus("Nothing to publish — this is already live");
      } else {
        setStatus("Published ✓ — the site updates in about a minute");
      }
    } catch {
      setStatus("Publish failed — check your connection and try again.");
    }
    setTimeout(() => setStatus(""), 8000);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!content) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-bg text-muted">
        Loading…
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg pb-24">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-deep text-white">
        <div className="mx-auto flex h-14 max-w-[1100px] items-center justify-between px-6">
          <div className="flex items-center gap-2.5 font-extrabold">
            <Image
              src="/images/logo.png"
              alt=""
              width={30}
              height={30}
              className="h-8 w-8 rounded-full"
            />
            Amaras<span className="text-accent"> Tour</span>
            <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs font-semibold">
              admin
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-sm text-white/80 hover:text-accent">
              View site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/25 px-3 py-1 text-sm font-semibold hover:border-accent hover:text-accent"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1100px] gap-1 px-6">
          {TABS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`rounded-t-lg px-4 py-2 text-sm font-bold transition-colors ${
                tab === t ? "bg-bg text-ink" : "text-white/70 hover:text-accent"
              }`}
            >
              {t}
            </button>
          ))}
        </nav>
      </header>

      {status && (
        <div className="fixed bottom-5 left-1/2 z-30 -translate-x-1/2 rounded-full bg-deep px-5 py-2.5 text-sm font-bold text-white shadow-lg">
          {status}
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {tab === "Tours" && (
          <ToursTab
            tours={content.tours}
            categories={content.categories}
            onChange={(tours) => setContent({ ...content, tours })}
            onSave={() => publish({ tours: content.tours })}
          />
        )}
        {tab === "Packages" && (
          <PackagesTab
            content={content}
            setContent={setContent}
            onSaveTours={() => publish({ tours: content.tours })}
            onSaveCategories={() => publish({ categories: content.categories })}
          />
        )}
        {tab === "Images" && (
          <ImagesTab
            images={content.hero.images}
            aboutImage={content.site.aboutImage}
            onChange={(images) => setContent({ ...content, hero: { images } })}
            onChangeAbout={(aboutImage) =>
              setContent({ ...content, site: { ...content.site, aboutImage } })
            }
            onSave={() => publish({ hero: content.hero, site: content.site })}
          />
        )}
        {tab === "Categories" && (
          <CategoriesTab
            categories={content.categories}
            onChange={(categories) => setContent({ ...content, categories })}
            onSave={() => publish({ categories: content.categories })}
          />
        )}
        {tab === "Texts" && (
          <TextsTab
            dicts={content.dicts}
            onChange={(dicts) => setContent({ ...content, dicts })}
            onSave={() => publish({ i18n: content.dicts })}
          />
        )}
        {tab === "Contacts" && (
          <ContactsTab
            site={content.site}
            onChange={(site) => setContent({ ...content, site })}
            onSave={() => publish({ site: content.site })}
          />
        )}
        {tab === "Import" && <ImportTab />}
        {tab === "Password" && <PasswordTab />}
      </div>
    </main>
  );
}

/* ---------- shared bits ---------- */

function SaveBar({ onSave, label = "Publish changes" }: { onSave: () => void; label?: string }) {
  return (
    <div className="mt-6">
      <button
        type="button"
        onClick={onSave}
        className="rounded-full bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark"
      >
        {label}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="font-semibold text-ink">{label}</span>
      {children}
    </label>
  );
}

// Shows what the old price will actually produce on the site, so a value that
// is not above the current price does not silently render nothing.
function SaleHint({ tour }: { tour: Tour }) {
  if (!tour.priceOldAmd) return null;
  const discount = discountPercent(tour);
  return discount === null ? (
    <span className="mt-1 block text-xs font-semibold text-amber-700">
      Must be higher than the current price — no sale is shown.
    </span>
  ) : (
    <span className="mt-1 block text-xs font-semibold text-green-700">
      Shows −{discount}% on the card and tour page.
    </span>
  );
}

const inputCls =
  "mt-1 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-primary";

function TextInput({
  value,
  onChange,
  ...rest
}: {
  value: string;
  onChange: (v: string) => void;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
      {...rest}
    />
  );
}

function AutoTextarea({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const rows = Math.min(14, Math.max(2, Math.ceil(value.length / 80) + value.split("\n").length - 1));
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className={inputCls}
    />
  );
}

function LocaleTabs({
  active,
  onChange,
}: {
  active: Locale;
  onChange: (l: Locale) => void;
}) {
  return (
    <div className="flex gap-1 rounded-full border border-black/10 bg-white p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => onChange(l)}
          className={`rounded-full px-3 py-1 text-xs font-bold ${
            l === active ? "bg-primary text-white" : "text-muted hover:text-ink"
          }`}
        >
          {localeNames[l]}
        </button>
      ))}
    </div>
  );
}

// Two-step delete: no browser confirm() dialogs.
function DeleteButton({ onDelete, label }: { onDelete: () => void; label: string }) {
  const [armed, setArmed] = useState(false);
  return armed ? (
    <span className="flex items-center gap-2 text-xs font-bold">
      <button type="button" onClick={onDelete} className="rounded-full bg-red-600 px-3 py-1 text-white">
        Yes, delete
      </button>
      <button type="button" onClick={() => setArmed(false)} className="rounded-full border border-black/15 px-3 py-1">
        Cancel
      </button>
    </span>
  ) : (
    <button
      type="button"
      onClick={() => setArmed(true)}
      className="rounded-full border border-red-200 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
    >
      {label}
    </button>
  );
}

// Camera and stock photos run to many megabytes, far more than the site ever
// displays, and the upload endpoint rejects anything over 20 MB. Shrink those in
// the browser first; smaller files are sent untouched so PNG transparency and
// already-optimised images survive.
const MAX_EDGE = 1600;
const RESIZE_ABOVE_BYTES = 1_500_000;

async function shrinkIfLarge(file: File): Promise<File> {
  if (file.size <= RESIZE_ABOVE_BYTES) return file;
  // imageOrientation keeps phone photos the right way up.
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", 0.85)
  );
  if (!blob) return file;
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.jpg`, {
    type: "image/jpeg",
  });
}

function ImagePicker({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // A just-uploaded image is committed but not deployed yet, so its real
  // path 404s for another minute. Preview the local file instead.
  const [pending, setPending] = useState<{ url: string; preview: string } | null>(
    null
  );

  useEffect(() => {
    return () => {
      if (pending) URL.revokeObjectURL(pending.preview);
    };
  }, [pending]);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const form = new FormData();
      const shrunk = await shrinkIfLarge(file);
      form.append("file", shrunk);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      if (res.ok) {
        const { url } = await res.json();
        setPending({ url, preview: URL.createObjectURL(shrunk) });
        onChange(url);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? `Upload failed (${res.status})`);
      }
    } catch {
      setError("Upload failed — check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-1 flex flex-wrap items-center gap-3">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={pending?.url === value ? pending.preview : value}
          alt=""
          className="h-14 w-20 rounded-lg border border-black/10 object-cover"
        />
      ) : (
        <span className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-black/20 text-xs text-muted">
          no image
        </span>
      )}
      <div className="flex-1">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/images/… or upload →"
          className={inputCls.replace("mt-1 ", "")}
        />
      </div>
      <button
        type="button"
        disabled={busy}
        onClick={() => fileRef.current?.click()}
        className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold hover:border-primary hover:text-primary disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload"}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
      />
      {error && (
        <p role="alert" className="w-full text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
      {pending?.url === value && !error && (
        <p className="w-full text-xs font-semibold text-muted">
          Uploaded — it goes live with your next publish.
        </p>
      )}
    </div>
  );
}

/* ---------- Tours ---------- */

function ToursTab({
  tours,
  categories,
  onChange,
  onSave,
  mode = "day",
}: {
  tours: Tour[];
  categories: Category[];
  onChange: (tours: Tour[]) => void;
  onSave: () => void;
  mode?: "day" | "package";
}) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [loc, setLoc] = useState<Locale>("ru");
  const isPkg = mode === "package";
  // Each row keeps its real index in the full tours array, so editing,
  // reordering and deleting stay correct while only half the list is shown.
  const rows = tours
    .map((tour, i) => ({ tour, i }))
    .filter(({ tour }) => isPackageTour(tour) === isPkg);
  // Search matches the title in any of the three languages, so the owner can
  // type in whichever script they remember the tour by.
  const [query, setQuery] = useState("");
  const needle = query.trim().toLocaleLowerCase();
  const visible = needle
    ? rows.filter(({ tour }) =>
        (["ru", "hy", "en"] as const).some((l) =>
          (tour.title[l] ?? "").toLocaleLowerCase().includes(needle)
        )
      )
    : rows;

  function update(i: number, patch: Partial<Tour>) {
    onChange(tours.map((t, j) => (j === i ? { ...t, ...patch } : t)));
  }

  // Swap with the nearest neighbour that is visible in this tab.
  function move(i: number, dir: -1 | 1) {
    const pos = rows.findIndex((r) => r.i === i);
    const target = rows[pos + dir];
    if (!target) return;
    const next = [...tours];
    [next[i], next[target.i]] = [next[target.i], next[i]];
    onChange(next);
  }

  function addTour() {
    const slug = `${isPkg ? "new-package" : "new-tour"}-${rows.length + 1}`;
    const empty = { ru: "", hy: "", en: "" };
    const base = {
      slug,
      image: "",
      title: { ...empty },
      description: { ...empty },
      about: { ...empty },
      destinations: { ru: [], hy: [], en: [] },
    };
    const tour: Tour = isPkg
      ? {
          ...base,
          categories: [PACKAGE_CATEGORY],
          priceFromAmd: 95000,
          days: 3,
          nights: 2,
          priceTiers: [
            { stars: 3, amd: 95000 },
            { stars: 4, amd: 120000 },
            { stars: 5, amd: 160000 },
          ],
          itinerary: [],
        }
      : {
          ...base,
          categories: [
            categories.find((c) => c.id !== PACKAGE_CATEGORY)?.id ?? "",
          ].filter(Boolean),
          priceFromAmd: 10000,
          departure: "10:00",
          durationHours: "8",
        };
    onChange([...tours, tour]);
    setOpenSlug(slug);
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">
          {isPkg ? "Tour packages" : "Tours"} ({rows.length})
        </h2>
        <button
          type="button"
          onClick={addTour}
          className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-deep hover:bg-accent-dark hover:text-white"
        >
          + Add {isPkg ? "package" : "tour"}
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title — Русский, Հայերեն or English"
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-2.5 text-sm outline-none focus:border-primary"
        />
        {needle && (
          <span className="shrink-0 text-sm text-muted">
            {visible.length} of {rows.length}
          </span>
        )}
      </div>
      {needle && visible.length === 0 && (
        <p className="mt-4 text-sm text-muted">No tours match “{query.trim()}”.</p>
      )}

      <div className="mt-4 space-y-3">
        {visible.map(({ tour, i }) => {
          // Reordering swaps with the neighbour in the full list, which would be
          // confusing while that neighbour is filtered out, so it is paused.
          const pos = rows.findIndex((r) => r.i === i);
          const open = openSlug === tour.slug;
          return (
            <div key={i} className="rounded-2xl border border-black/5 bg-white shadow-sm">
              <div className="flex items-center gap-1 px-2">
                <div className="flex flex-col">
                  <button
                    type="button"
                    aria-label="Move up"
                    onClick={() => move(i, -1)}
                    disabled={Boolean(needle) || pos === 0}
                    className="px-1.5 text-xs text-muted hover:text-primary disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    aria-label="Move down"
                    onClick={() => move(i, 1)}
                    disabled={Boolean(needle) || pos === rows.length - 1}
                    className="px-1.5 text-xs text-muted hover:text-primary disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setOpenSlug(open ? null : tour.slug)}
                  className="flex w-full items-center justify-between gap-3 py-4 pr-3 text-left"
                >
                  <span className="font-bold">
                    {tour.title.ru || tour.title.en || tour.slug}
                    <span className="ml-2 text-xs font-semibold text-muted">
                      {tour.priceFromAmd > 0
                        ? `${tour.priceFromAmd.toLocaleString("ru-RU")} ֏`
                        : "по запросу"}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    {(tour.featured ?? true) && (
                      <span className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-bold text-accent-dark">
                        popular
                      </span>
                    )}
                    <span className="text-muted">{open ? "–" : "+"}</span>
                  </span>
                </button>
              </div>

              {open && (
                <div className="border-t border-black/5 px-5 py-5">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Field label="Price from (AMD, 0 = on request)">
                      <TextInput
                        type="number"
                        value={String(tour.priceFromAmd)}
                        onChange={(v) => update(i, { priceFromAmd: Number(v) || 0 })}
                      />
                    </Field>
                    <Field label="Sale — old price (optional)">
                      <TextInput
                        type="number"
                        value={tour.priceOldAmd ? String(tour.priceOldAmd) : ""}
                        onChange={(v) =>
                          update(i, { priceOldAmd: Number(v) > 0 ? Number(v) : undefined })
                        }
                      />
                      <SaleHint tour={tour} />
                    </Field>
                    {isPkg ? (
                      <>
                        <Field label="Days">
                          <TextInput
                            type="number"
                            value={String(tour.days ?? "")}
                            onChange={(v) => update(i, { days: Number(v) || undefined })}
                          />
                        </Field>
                        <Field label="Nights">
                          <TextInput
                            type="number"
                            value={String(tour.nights ?? "")}
                            onChange={(v) => update(i, { nights: Number(v) || undefined })}
                          />
                        </Field>
                      </>
                    ) : (
                      <>
                        <Field label="Departure time">
                          <TextInput value={tour.departure ?? ""} onChange={(v) => update(i, { departure: v })} />
                        </Field>
                        <Field label="Duration, hours">
                          <TextInput
                            value={tour.durationHours ?? ""}
                            onChange={(v) => update(i, { durationHours: v })}
                          />
                        </Field>
                        <Field label="Meeting time (shown in Useful information)">
                          <TextInput
                            value={tour.meetTime ?? ""}
                            onChange={(v) => update(i, { meetTime: v || undefined })}
                          />
                        </Field>
                      </>
                    )}
                  </div>

                  {isPkg && (
                    <div className="mt-4">
                      <span className="text-sm font-semibold">
                        Price per person by hotel class (AMD)
                      </span>
                      <div className="mt-1 grid gap-4 sm:grid-cols-3">
                        {([3, 4, 5] as const).map((stars) => (
                          <Field key={stars} label={"★".repeat(stars)}>
                            <TextInput
                              type="number"
                              value={String(
                                tour.priceTiers?.find((t) => t.stars === stars)?.amd ?? ""
                              )}
                              onChange={(v) => {
                                const amd = Number(v) || 0;
                                const others = (tour.priceTiers ?? []).filter(
                                  (t) => t.stars !== stars
                                );
                                const tiers = (amd > 0
                                  ? [...others, { stars, amd }]
                                  : others
                                ).sort((a, b) => a.stars - b.stars);
                                update(i, {
                                  priceTiers: tiers.length ? tiers : undefined,
                                });
                              }}
                            />
                          </Field>
                        ))}
                      </div>
                      <p className="mt-1 text-xs text-muted">
                        “Price from” above is what shows on the card — keep it equal
                        to the cheapest tier.
                      </p>
                    </div>
                  )}

                  <div className="mt-4">
                    <Field label="Photo">
                      <ImagePicker value={tour.image} onChange={(image) => update(i, { image })} />
                    </Field>
                  </div>

                  <div className="mt-4">
                    <label className="flex items-center gap-2 text-sm font-semibold">
                      <input
                        type="checkbox"
                        checked={tour.featured ?? true}
                        onChange={(e) => update(i, { featured: e.target.checked })}
                      />
                      Show in “Popular tours” on the homepage (first 6 shown, in
                      list order — use ▲▼ to reorder)
                    </label>
                  </div>

                  {/* Packages always stay in the fixed "packages" category, so
                      the picker is only shown for ordinary tours. */}
                  {!isPkg && (
                    <div className="mt-4">
                      <span className="text-sm font-semibold">Categories</span>
                      <div className="mt-1 flex flex-wrap gap-3">
                        {categories
                          .filter((c) => c.id !== PACKAGE_CATEGORY)
                          .map((c) => (
                            <label key={c.id} className="flex items-center gap-1.5 text-sm">
                              <input
                                type="checkbox"
                                checked={tour.categories.includes(c.id)}
                                onChange={(e) =>
                                  update(i, {
                                    categories: e.target.checked
                                      ? [...tour.categories, c.id]
                                      : tour.categories.filter((x) => x !== c.id),
                                  })
                                }
                              />
                              {c.title.en || c.id}
                            </label>
                          ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-semibold">Texts</span>
                    <LocaleTabs active={loc} onChange={setLoc} />
                  </div>
                  <div className="mt-3 space-y-4">
                    <Field label="Title">
                      <TextInput
                        value={tour.title[loc]}
                        onChange={(v) => update(i, { title: { ...tour.title, [loc]: v } })}
                      />
                    </Field>
                    <Field label="Short description (card)">
                      <AutoTextarea
                        value={tour.description[loc]}
                        onChange={(v) =>
                          update(i, { description: { ...tour.description, [loc]: v } })
                        }
                      />
                    </Field>
                    <Field label="Full description (empty line = new paragraph)">
                      <AutoTextarea
                        value={tour.about[loc]}
                        onChange={(v) => update(i, { about: { ...tour.about, [loc]: v } })}
                      />
                    </Field>
                    <Field label="Route stops (one per line)">
                      <AutoTextarea
                        value={tour.destinations[loc].join("\n")}
                        onChange={(v) =>
                          update(i, {
                            destinations: {
                              ...tour.destinations,
                              [loc]: v.split("\n").filter((s) => s.trim()),
                            },
                          })
                        }
                      />
                    </Field>
                    {!isPkg && (
                      <Field label="Entrance tickets, paid on site (one per line)">
                        <AutoTextarea
                          value={(tour.tickets?.[loc] ?? []).join("\n")}
                          onChange={(v) => {
                            const lines = v.split("\n").filter((s) => s.trim());
                            const tickets = {
                              ...{ ru: [], hy: [], en: [] },
                              ...tour.tickets,
                              [loc]: lines,
                            };
                            update(i, {
                              tickets: locales.some((l) => tickets[l].length)
                                ? tickets
                                : undefined,
                            });
                          }}
                        />
                      </Field>
                    )}
                  </div>

                  {!isPkg && (
                    <InfoSectionsEditor
                      sections={tour.infoSections?.[loc] ?? []}
                      locale={loc}
                      onChange={(sections) => {
                        const all = {
                          ...{ ru: [], hy: [], en: [] },
                          ...tour.infoSections,
                          [loc]: sections,
                        };
                        update(i, {
                          infoSections: locales.some((l) => all[l].length)
                            ? all
                            : undefined,
                        });
                      }}
                    />
                  )}

                  {isPkg && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          Day-by-day programme ({localeNames[loc]})
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            update(i, {
                              itinerary: [
                                ...(tour.itinerary ?? []),
                                {
                                  day: (tour.itinerary?.length ?? 0) + 1,
                                  title: { ru: "", hy: "", en: "" },
                                  items: { ru: [], hy: [], en: [] },
                                },
                              ],
                            })
                          }
                          className="rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-white hover:bg-primary-dark"
                        >
                          + Add day
                        </button>
                      </div>
                      <div className="mt-3 space-y-3">
                        {(tour.itinerary ?? []).map((entry, d) => {
                          const patchDay = (patch: Partial<typeof entry>) =>
                            update(i, {
                              itinerary: (tour.itinerary ?? []).map((e, k) =>
                                k === d ? { ...e, ...patch } : e
                              ),
                            });
                          return (
                            <div
                              key={d}
                              className="rounded-xl border border-black/5 bg-bg p-4"
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-extrabold text-primary">
                                  Day {entry.day}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    update(i, {
                                      itinerary: (tour.itinerary ?? [])
                                        .filter((_, k) => k !== d)
                                        .map((e, k) => ({ ...e, day: k + 1 })),
                                    })
                                  }
                                  className="text-xs font-semibold text-muted hover:text-red-600"
                                >
                                  Remove day
                                </button>
                              </div>
                              <div className="mt-2 space-y-3">
                                <Field label="Day title">
                                  <TextInput
                                    value={entry.title[loc]}
                                    onChange={(v) =>
                                      patchDay({
                                        title: { ...entry.title, [loc]: v },
                                      })
                                    }
                                  />
                                </Field>
                                <Field label="What happens that day (one per line)">
                                  <AutoTextarea
                                    value={entry.items[loc].join("\n")}
                                    onChange={(v) =>
                                      patchDay({
                                        items: {
                                          ...entry.items,
                                          [loc]: v.split("\n").filter((s) => s.trim()),
                                        },
                                      })
                                    }
                                  />
                                </Field>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <Field label="Link (slug, latin letters and dashes)">
                      <TextInput
                        value={tour.slug}
                        onChange={(v) =>
                          update(i, { slug: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })
                        }
                      />
                    </Field>
                    <div className="flex items-end justify-end">
                      <DeleteButton
                        label={isPkg ? "Delete package" : "Delete tour"}
                        onDelete={() => onChange(tours.filter((_, j) => j !== i))}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <SaveBar onSave={onSave} label="Publish tours" />
    </section>
  );
}

/* ---------- Homepage (hero slideshow) ---------- */

function ImagesTab({
  images,
  aboutImage,
  onChange,
  onChangeAbout,
  onSave,
}: {
  images: string[];
  aboutImage: string;
  onChange: (images: string[]) => void;
  onChangeAbout: (url: string) => void;
  onSave: () => void;
}) {
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <section>
      <h2 className="text-xl font-extrabold">Homepage slideshow</h2>
      <p className="mt-2 text-sm text-muted">
        The big photos at the top of the main page. They rotate automatically;
        the first one is shown first. The “Popular tours” section below the
        slideshow is managed in the Tours tab (the “Show in Popular tours”
        checkbox and the ▲▼ order).
      </p>

      <div className="mt-5 space-y-3">
        {images.map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
          >
            <div className="flex flex-col">
              <button
                type="button"
                aria-label="Move up"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                className="px-1.5 text-xs text-muted hover:text-primary disabled:opacity-30"
              >
                ▲
              </button>
              <button
                type="button"
                aria-label="Move down"
                onClick={() => move(i, 1)}
                disabled={i === images.length - 1}
                className="px-1.5 text-xs text-muted hover:text-primary disabled:opacity-30"
              >
                ▼
              </button>
            </div>
            <div className="flex-1">
              <ImagePicker
                value={src}
                onChange={(url) =>
                  onChange(images.map((x, j) => (j === i ? url : x)))
                }
              />
            </div>
            {images.length > 1 && (
              <DeleteButton
                label="Remove"
                onDelete={() => onChange(images.filter((_, j) => j !== i))}
              />
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => onChange([...images, ""])}
        className="mt-4 rounded-full border border-black/15 px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
      >
        + Add photo
      </button>

      <h2 className="mt-10 border-t border-black/5 pt-8 text-xl font-extrabold">
        About page photo
      </h2>
      <p className="mt-2 text-sm text-muted">
        The photo shown next to the text on the “About us” page.
      </p>
      <div className="mt-4 max-w-xl">
        <ImagePicker value={aboutImage} onChange={onChangeAbout} />
      </div>

      <SaveBar onSave={onSave} label="Publish images" />
    </section>
  );
}

/* ---------- Categories ---------- */

function CategoriesTab({
  categories,
  onChange,
  onSave,
}: {
  categories: Category[];
  onChange: (categories: Category[]) => void;
  onSave: () => void;
}) {
  const [loc, setLoc] = useState<Locale>("ru");
  // Tour packages are edited in their own tab, so that category is not
  // listed here. Rows keep their real index so editing and deleting stay
  // correct while only part of the list shows.
  const rows = categories
    .map((cat, i) => ({ cat, i }))
    .filter(({ cat }) => cat.id !== PACKAGES_CATEGORY_ID);

  function update(i: number, patch: Partial<Category>) {
    onChange(categories.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">Tour categories</h2>
        <div className="flex items-center gap-3">
          <LocaleTabs active={loc} onChange={setLoc} />
          <button
            type="button"
            onClick={() =>
              onChange([
                ...categories,
                {
                  id: `category-${categories.length + 1}`,
                  image: "",
                  title: { ru: "", hy: "", en: "" },
                  desc: { ru: "", hy: "", en: "" },
                },
              ])
            }
            className="rounded-full bg-accent px-4 py-2 text-sm font-bold text-deep hover:bg-accent-dark hover:text-white"
          >
            + Add category
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rows.map(({ cat, i }) => (
          <div key={i} className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label={`Name (${localeNames[loc]})`}>
                <TextInput
                  value={cat.title[loc]}
                  onChange={(v) => update(i, { title: { ...cat.title, [loc]: v } })}
                />
              </Field>
              <Field label="Id (latin, used in links)">
                <TextInput
                  value={cat.id}
                  onChange={(v) =>
                    update(i, { id: v.toLowerCase().replace(/[^a-z0-9-]+/g, "-") })
                  }
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label={`Description (${localeNames[loc]})`}>
                <AutoTextarea
                  value={cat.desc[loc]}
                  onChange={(v) => update(i, { desc: { ...cat.desc, [loc]: v } })}
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Photo">
                <ImagePicker value={cat.image} onChange={(image) => update(i, { image })} />
              </Field>
            </div>
            <div className="mt-3 flex justify-end">
              <DeleteButton
                label="Delete category"
                onDelete={() => onChange(categories.filter((_, j) => j !== i))}
              />
            </div>
          </div>
        ))}
      </div>
      <SaveBar onSave={onSave} label="Publish categories" />
    </section>
  );
}

/* ---------- Tour packages (its own section, not a category) ---------- */

// Packages are a separate part of the site rather than one category among
// others, so the section itself (heading, description, photo) and the
// packages inside it are both edited here instead of in the Categories tab.
function PackagesTab({
  content,
  setContent,
  onSaveTours,
  onSaveCategories,
}: {
  content: Content;
  setContent: (c: Content) => void;
  onSaveTours: () => void;
  onSaveCategories: () => void;
}) {
  const [loc, setLoc] = useState<Locale>("ru");
  const index = content.categories.findIndex(
    (c) => c.id === PACKAGES_CATEGORY_ID
  );
  const section = index >= 0 ? content.categories[index] : null;

  function updateSection(patch: Partial<Category>) {
    if (index < 0) return;
    setContent({
      ...content,
      categories: content.categories.map((c, j) =>
        j === index ? { ...c, ...patch } : c
      ),
    });
  }

  return (
    <section className="space-y-8">
      {section && (
        <div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold">Tour packages section</h2>
            <LocaleTabs active={loc} onChange={setLoc} />
          </div>
          <p className="mt-1 text-sm text-muted">
            Shown at the top of the Tour packages page and in the site menu.
          </p>
          <div className="mt-4 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
            <Field label={`Heading (${localeNames[loc]})`}>
              <TextInput
                value={section.title[loc]}
                onChange={(v) =>
                  updateSection({ title: { ...section.title, [loc]: v } })
                }
              />
            </Field>
            <div className="mt-3">
              <Field label={`Description (${localeNames[loc]})`}>
                <AutoTextarea
                  value={section.desc[loc]}
                  onChange={(v) =>
                    updateSection({ desc: { ...section.desc, [loc]: v } })
                  }
                />
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Photo">
                <ImagePicker
                  value={section.image}
                  onChange={(image) => updateSection({ image })}
                />
              </Field>
            </div>
            <SaveBar onSave={onSaveCategories} label="Publish section" />
          </div>
        </div>
      )}

      <ToursTab
        mode="package"
        tours={content.tours}
        categories={content.categories}
        onChange={(tours) => setContent({ ...content, tours })}
        onSave={onSaveTours}
      />
    </section>
  );
}

/* ---------- Texts (recursive editor over the whole dictionary) ---------- */

function prettyKey(key: string): string {
  const words = key.replace(/([A-Z])/g, " $1").toLowerCase();
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/* ---------- Useful information panel, per tour ---------- */

// Most tours carry their own version of this panel because the inclusions,
// weather notes and packing list differ per route. A tour with no sections here
// falls back to the shared text in the Texts tab.
function InfoSectionsEditor({
  sections,
  locale,
  onChange,
}: {
  sections: InfoSection[];
  locale: Locale;
  onChange: (sections: InfoSection[]) => void;
}) {
  function update(i: number, patch: Partial<InfoSection>) {
    onChange(sections.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  }

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">
          Useful information ({localeNames[locale]})
        </span>
        <button
          type="button"
          onClick={() =>
            onChange([
              ...sections,
              { id: "", heading: "", paragraphs: [], items: [], note: "" },
            ])
          }
          className="rounded-full border border-black/15 px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary"
        >
          + Add section
        </button>
      </div>
      <p className="mt-1 text-xs text-muted">
        Leave empty to use the shared text from the Texts tab. The phone number
        and the departure times are added automatically, so do not type them.
      </p>

      <div className="mt-3 space-y-4">
        {sections.map((section, i) => (
          <div
            key={i}
            className="rounded-xl border border-black/5 bg-black/[.02] p-4"
          >
            <div className="flex items-start gap-2">
              <div className="flex-1 space-y-3">
                <Field label="Heading">
                  <TextInput
                    value={section.heading}
                    onChange={(v) => update(i, { heading: v })}
                  />
                </Field>
                <Field label="Text (empty line = new paragraph)">
                  <AutoTextarea
                    value={section.paragraphs.join("\n\n")}
                    onChange={(v) =>
                      update(i, {
                        paragraphs: v.split("\n\n").filter((s) => s.trim()),
                      })
                    }
                  />
                </Field>
                <Field label="Bullet list (one per line)">
                  <AutoTextarea
                    value={section.items.join("\n")}
                    onChange={(v) =>
                      update(i, { items: v.split("\n").filter((s) => s.trim()) })
                    }
                  />
                </Field>
                <Field label="Closing note (bold line under the list)">
                  <TextInput
                    value={section.note}
                    onChange={(v) => update(i, { note: v })}
                  />
                </Field>
                <Field label="Auto-fill (booking, meeting or tickets — leave empty otherwise)">
                  <TextInput
                    value={section.id}
                    onChange={(v) => update(i, { id: v.trim() })}
                  />
                </Field>
              </div>
              <button
                type="button"
                aria-label="Remove section"
                onClick={() => onChange(sections.filter((_, j) => j !== i))}
                className="rounded-full border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function blankLike(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (Array.isArray(value)) return [];
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([k, v]) => [k, blankLike(v)])
    );
  }
  return value;
}

function JsonEditor({
  value,
  onChange,
  depth = 0,
}: {
  value: unknown;
  onChange: (v: unknown) => void;
  depth?: number;
}) {
  if (typeof value === "string") {
    return value.length > 60 ? (
      <AutoTextarea value={value} onChange={onChange} />
    ) : (
      <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
    );
  }
  if (Array.isArray(value)) {
    return (
      <div className="space-y-3">
        {value.map((item, i) => (
          <div key={i} className="flex items-start gap-2">
            <div className="flex-1">
              <JsonEditor
                value={item}
                depth={depth + 1}
                onChange={(v) => onChange(value.map((x, j) => (j === i ? v : x)))}
              />
            </div>
            <button
              type="button"
              aria-label="Remove item"
              onClick={() => onChange(value.filter((_, j) => j !== i))}
              className="mt-1 rounded-full border border-red-200 px-2.5 py-1 text-xs font-bold text-red-600 hover:bg-red-50"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...value, blankLike(value[0] ?? "")])}
          className="rounded-full border border-black/15 px-3 py-1 text-xs font-bold hover:border-primary hover:text-primary"
        >
          + Add item
        </button>
      </div>
    );
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    return (
      <div
        className={
          depth === 0
            ? "space-y-6"
            : "space-y-4 rounded-xl border border-black/5 bg-black/[.02] p-4"
        }
      >
        {entries.map(([k, v]) => (
          <div key={k}>
            {depth === 0 ? (
              <h3 className="mb-3 text-base font-extrabold">{prettyKey(k)}</h3>
            ) : (
              <span className="text-sm font-semibold text-ink">{prettyKey(k)}</span>
            )}
            <JsonEditor
              value={v}
              depth={depth + 1}
              onChange={(nv) =>
                onChange({ ...(value as Record<string, unknown>), [k]: nv })
              }
            />
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function TextsTab({
  dicts,
  onChange,
  onSave,
}: {
  dicts: Record<Locale, Dict>;
  onChange: (dicts: Record<Locale, Dict>) => void;
  onSave: () => void;
}) {
  const [loc, setLoc] = useState<Locale>("ru");
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold">All site texts</h2>
        <LocaleTabs active={loc} onChange={setLoc} />
      </div>
      <p className="mt-2 text-sm text-muted">
        Every text on the site: menu, hero, numbers block, about page, buttons and
        SEO titles. Edit each language separately.
      </p>
      <div className="mt-6">
        <JsonEditor
          value={dicts[loc]}
          onChange={(v) => onChange({ ...dicts, [loc]: v as Dict })}
        />
      </div>
      <SaveBar onSave={onSave} label="Publish texts" />
    </section>
  );
}

/* ---------- Contacts ---------- */

function ContactsTab({
  site,
  onChange,
  onSave,
}: {
  site: SiteInfo;
  onChange: (site: SiteInfo) => void;
  onSave: () => void;
}) {
  const fields: { key: keyof SiteInfo; label: string; hint?: string }[] = [
    { key: "name", label: "Company name" },
    { key: "phone", label: "Phone" },
    { key: "whatsapp", label: "WhatsApp number", hint: "digits only, e.g. 37499250525" },
    { key: "telegram", label: "Telegram username", hint: "without @" },
    { key: "instagram", label: "Instagram username", hint: "without @" },
    { key: "email", label: "Email" },
  ];
  return (
    <section>
      <h2 className="text-xl font-extrabold">Contacts & social links</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {fields.map((f) => (
          <Field key={f.key} label={f.hint ? `${f.label} (${f.hint})` : f.label}>
            <TextInput
              value={site[f.key]}
              onChange={(v) => onChange({ ...site, [f.key]: v })}
            />
          </Field>
        ))}
      </div>
      <SaveBar onSave={onSave} label="Publish contacts" />
    </section>
  );
}

/* ---------- Import ---------- */

type ImportPlan = {
  available: boolean;
  reason?: string;
  error?: string;
  keys?: string[];
  images?: string[];
  alreadyImported?: boolean;
  counts?: { tours: number; categories: number };
};

// Images are copied a few at a time: one request carrying every image of a
// photo-heavy site would outlast the serverless function.
const IMAGE_BATCH = 3;

function ImportTab() {
  const [plan, setPlan] = useState<ImportPlan | null>(null);
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState("");
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/import")
      .then((res) => res.json())
      .then(setPlan)
      .catch(() => setPlan({ available: false, reason: "unreachable" }));
  }, []);

  async function run() {
    if (!plan?.images) return;
    setRunning(true);
    setError("");
    const copied: string[] = [];

    try {
      for (let i = 0; i < plan.images.length; i += IMAGE_BATCH) {
        const names = plan.images.slice(i, i + IMAGE_BATCH);
        setProgress(
          `Copying images ${i + 1}–${Math.min(i + IMAGE_BATCH, plan.images.length)} of ${plan.images.length}…`
        );
        const res = await fetch("/api/admin/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ step: "images", names }),
        });
        const body = await res.json();
        if (!res.ok) throw new Error(body.error || "Copying images failed");
        copied.push(...body.copied);
      }

      setProgress("Publishing the content…");
      const res = await fetch("/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ step: "content", copied }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Publishing failed");

      setProgress("");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Import failed");
      setProgress("");
    } finally {
      setRunning(false);
    }
  }

  if (!plan) return <p className="text-muted">Checking the old database…</p>;

  if (!plan.available) {
    return (
      <div className="max-w-xl">
        <h2 className="text-xl font-extrabold">Import from the old database</h2>
        <p className="mt-3 text-sm text-muted">
          {plan.reason === "no-database"
            ? "No old database is configured — there is nothing to import. You can remove DATABASE_URL from Vercel."
            : `The old database could not be read${plan.error ? `: ${plan.error}` : ""}. If its free-plan limit is reached, this works again once the limit resets.`}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-extrabold">Import from the old database</h2>
      <p className="mt-3 text-sm text-muted">
        Copies everything saved before the site moved to storing content in
        GitHub. Run it once; it is safe to run again if it stops partway.
      </p>

      <ul className="mt-4 space-y-1 text-sm">
        <li>
          <b>{plan.counts?.tours ?? 0}</b> tours
        </li>
        <li>
          <b>{plan.counts?.categories ?? 0}</b> categories
        </li>
        <li>
          <b>{plan.images?.length ?? 0}</b> images
        </li>
      </ul>

      {done ? (
        <p className="mt-5 rounded-2xl border border-black/10 bg-white p-4 text-sm font-bold">
          Imported ✓ — the site rebuilds with everything in about a minute.
          Afterwards you can delete the old database and its DATABASE_URL.
        </p>
      ) : (
        <button
          type="button"
          onClick={run}
          disabled={running}
          className="mt-5 rounded-full bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          {running ? "Importing…" : "Import everything"}
        </button>
      )}

      {progress && <p className="mt-3 text-sm font-semibold">{progress}</p>}
      {running && (
        <p className="mt-1 text-xs text-muted">
          Keep this tab open until it finishes.
        </p>
      )}
      {error && (
        <p role="alert" className="mt-3 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------- Password ---------- */

function PasswordTab() {
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");
  const [hash, setHash] = useState("");
  const [copied, setCopied] = useState(false);
  const [info, setInfo] = useState<{ username: string; mode: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/password")
      .then((res) => (res.ok ? res.json() : null))
      .then(setInfo)
      .catch(() => setInfo(null));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setCopied(false);
    if (next !== confirm) {
      setMsg("New passwords do not match");
      setHash("");
      return;
    }
    const res = await fetch("/api/admin/password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ next }),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setHash(data.hash);
      setMsg("");
      setNext("");
      setConfirm("");
    } else {
      setHash("");
      setMsg(data.error || "Failed");
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(hash);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-extrabold">Change admin password</h2>
      <p className="mt-2 text-sm text-muted">
        The password is a Vercel environment variable, and the site cannot
        rewrite its own environment. So this generates the new value and you
        paste it into Vercel — from a phone if you like.
      </p>
      {info && (
        <p className="mt-2 text-sm text-muted">
          Username <b className="text-ink">{info.username}</b>
          {info.mode === "plain" && " · currently set as plain text (ADMIN_PASSWORD)"}
          {info.mode === "hash" && " · currently set as a hash (ADMIN_PASSWORD_HASH)"}
          {info.mode === "unset" && " · no password configured"}
        </p>
      )}

      <form onSubmit={submit} className="mt-5 max-w-sm space-y-4">
        <Field label="New password (min 8 characters)">
          <TextInput type="password" value={next} onChange={setNext} />
        </Field>
        <Field label="Repeat new password">
          <TextInput type="password" value={confirm} onChange={setConfirm} />
        </Field>
        {msg && <p className="text-sm font-semibold text-red-600">{msg}</p>}
        <button
          type="submit"
          disabled={next.length < 8}
          className="rounded-full bg-primary px-6 py-2.5 font-bold text-white hover:bg-primary-dark disabled:opacity-50"
        >
          Generate new value
        </button>
      </form>

      {hash && (
        <div className="mt-6 rounded-2xl border border-black/10 bg-white p-5">
          <p className="text-sm font-bold">
            In Vercel → Settings → Environment Variables, set{" "}
            <code className="rounded bg-black/5 px-1">ADMIN_PASSWORD_HASH</code> to:
          </p>
          <code className="mt-3 block break-all rounded-lg bg-black/5 p-3 text-xs">
            {hash}
          </code>
          <div className="mt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={copy}
              className="rounded-full border border-black/15 px-4 py-2 text-xs font-bold hover:border-primary hover:text-primary"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
            <span className="text-xs text-muted">
              Then redeploy. The hash wins over ADMIN_PASSWORD, so you can
              delete that variable afterwards.
            </span>
          </div>
          <p className="mt-3 text-xs font-semibold text-muted">
            The new password only works after the redeploy finishes, and it
            signs you out of this session.
          </p>
        </div>
      )}
    </div>
  );
}
