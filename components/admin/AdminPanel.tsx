"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { locales, type Dict, type Locale } from "@/lib/i18n";
import {
  discountPercent,
  isPackageTour,
  PACKAGES_CATEGORY_ID,
  type Category,
  type Tour,
} from "@/lib/tours";
import type { SiteInfo } from "@/lib/site";
import type { Content, ContentKey } from "@/lib/content";
import type { Review } from "@/lib/reviews";

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

const sectionNames: Record<ContentKey, string> = {
  tours: "Tours",
  categories: "Categories",
  i18n: "Texts",
  site: "Contacts",
  hero: "Images",
  reviews: "Reviews",
};

const TABS = ["Tours", "Packages", "Images", "Categories", "Reviews", "Texts", "Contacts", "Password"] as const;
type Tab = (typeof TABS)[number];

// The stored keys, read off the editing state. Tabs edit different
// parts of the same object, so this is what "everything you changed" means.
function keyValues(content: Content): Record<ContentKey, unknown> {
  return {
    i18n: content.dicts,
    tours: content.tours,
    categories: content.categories,
    site: content.site,
    hero: content.hero,
    reviews: content.reviews || [],
  };
}

export default function AdminPanel() {
  const [content, setContent] = useState<Content | null>(null);
  // What is currently live. Everything that differs from it is unpublished.
  const [live, setLive] = useState<Content | null>(null);
  const [tab, setTab] = useState<Tab>("Tours");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch("/api/admin/content").then(async (res) => {
      if (res.status === 401) {
        window.location.href = "/admin/login";
        return;
      }
      const loaded = await res.json();
      setContent(loaded);
      setLive(loaded);
    });
  }, []);

  const dirty: ContentKey[] =
    content && live
      ? (Object.keys(keyValues(content)) as ContentKey[]).filter(
          (key) =>
            JSON.stringify(keyValues(content)[key]) !==
            JSON.stringify(keyValues(live)[key])
        )
      : [];

  // Editing across tabs and losing it to a stray refresh is the one way to
  // throw away real work here, since nothing is stored until it is published.
  useEffect(() => {
    if (!dirty.length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty.length]);

  // Publishing commits the edit to the repository, which is what makes
  // Vercel rebuild. It always sends everything that changed, in any tab, as
  // one commit: a save costs one deploy however many fields it touched, and
  // no edit is left behind in a tab the editor happened not to end on.
  async function publish() {
    if (!content || !dirty.length || busy) return;
    const snapshot = content;
    const values = Object.fromEntries(
      dirty.map((key) => [key, keyValues(snapshot)[key]])
    );
    setBusy(true);
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
      } else {
        setLive(snapshot);
        setStatus(
          body?.changed === false
            ? "Nothing to publish — this is already live"
            : "Published ✓ — the site updates in about a minute"
        );
      }
    } catch {
      setStatus("Publish failed — check your connection and try again.");
    } finally {
      setBusy(false);
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
          <div className="flex items-center gap-3">
            <Image
              src="/images/amaras-logo.svg"
              alt="AMARAS Tour"
              width={180}
              height={32}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="rounded-full bg-[#C7FF32]/20 border border-[#C7FF32]/40 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#C7FF32]">
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
          {TABS.map((t) => {
            const pendingCount =
              t === "Reviews"
                ? (content.reviews || []).filter((r) => !r.approved).length
                : 0;

            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex items-center gap-1.5 rounded-t-lg px-4 py-2 text-sm font-bold transition-colors ${
                  tab === t ? "bg-bg text-ink" : "text-white/70 hover:text-accent"
                }`}
              >
                <span>{t === "Reviews" ? "Отзывы" : t}</span>
                {pendingCount > 0 && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-amber-400 px-1 text-[10px] font-black text-black shadow-sm">
                    {pendingCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </header>

      {status && (
        <div
          className={`fixed left-1/2 z-40 -translate-x-1/2 rounded-full bg-deep px-5 py-2.5 text-sm font-bold text-white shadow-lg ${
            dirty.length ? "bottom-24" : "bottom-5"
          }`}
        >
          {status}
        </div>
      )}

      {/* Edits live only in this page until they are published, and they
          survive moving between tabs — so the count has to be visible from
          every tab, not just the one the last edit happened in. */}
      {dirty.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-black/10 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1100px] items-center justify-between gap-4 px-6 py-3">
            <p className="text-sm font-semibold">
              Unpublished changes in{" "}
              <b>{dirty.map((k) => sectionNames[k]).join(", ")}</b>
              <span className="ml-2 font-normal text-muted">
                Not live until you publish.
              </span>
            </p>
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="shrink-0 rounded-full bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
            >
              {busy ? "Publishing…" : "Publish all changes"}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-6 py-8">
        {tab === "Tours" && (
          <ToursTab
            tours={content.tours}
            categories={content.categories}
            onChange={(tours) => setContent({ ...content, tours })}
            onSave={publish}
          />
        )}
        {tab === "Packages" && (
          <PackagesTab
            content={content}
            setContent={setContent}
            onSaveTours={publish}
            onSaveCategories={publish}
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
            onSave={publish}
          />
        )}
        {tab === "Categories" && (
          <CategoriesTab
            categories={content.categories}
            onChange={(categories) => setContent({ ...content, categories })}
            onSave={publish}
          />
        )}
        {tab === "Reviews" && (
          <ReviewsTab
            reviews={content.reviews || []}
            onChange={(reviews) => setContent({ ...content, reviews })}
            onSave={publish}
          />
        )}
        {tab === "Texts" && (
          <TextsTab
            dicts={content.dicts}
            onChange={(dicts) => setContent({ ...content, dicts })}
            onSave={publish}
          />
        )}
        {tab === "Contacts" && (
          <ContactsTab
            site={content.site}
            onChange={(site) => setContent({ ...content, site })}
            onSave={publish}
          />
        )}
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
                      {tour.categories?.includes("individual") || tour.priceFromAmd === 0
                        ? "по запросу"
                        : `${tour.priceFromAmd.toLocaleString("ru-RU")} ֏`}
                    </span>
                  </span>
                  <span className="flex items-center gap-2">
                    {tour.bookingDisabled && (
                      <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-[11px] font-bold text-red-700">
                        ⛔ Бронь закрыта
                      </span>
                    )}
                    {(tour.featured ?? true) && (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[11px] font-bold text-accent-dark">
                        ⭐ популярный
                      </span>
                    )}
                    {tour.categories?.includes("individual") && (
                      <span className="rounded-full bg-purple-100 px-2 py-0.5 text-[11px] font-bold text-purple-700">
                        индивидуальный
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
                      {tour.categories?.includes("individual") && (
                        <p className="mt-1 text-[11px] font-semibold text-purple-700">
                          🔒 Для индивидуальных туров цена на сайте не показывается (По запросу)
                        </p>
                      )}
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

                  {/* Tour Photos / Slideshow */}
                  <div className="mt-4 rounded-2xl border border-black/10 bg-[#F7F7F0]/60 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <span className="text-sm font-bold text-ink">
                          Фотографии тура / Слайдер ({((tour.images && tour.images.length > 0 ? tour.images : [tour.image || ""]).filter(Boolean)).length})
                        </span>
                        <p className="text-xs text-muted">
                          Первое фото является главной обложкой. Добавьте остальные фото для слайдера тура.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const current = tour.images && tour.images.length > 0 ? tour.images : [tour.image || ""];
                          const next = [...current, ""];
                          update(i, { images: next, image: next[0] || tour.image });
                        }}
                        className="rounded-full bg-primary px-3.5 py-1.5 text-xs font-bold text-white hover:bg-primary-dark self-start sm:self-auto"
                      >
                        + Добавить фото в слайдер
                      </button>
                    </div>

                    <div className="mt-3 space-y-3">
                      {(tour.images && tour.images.length > 0 ? tour.images : [tour.image || ""]).map((img, imgIndex, arr) => (
                        <div key={imgIndex} className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 shadow-xs">
                          <div className="flex flex-col">
                            <button
                              type="button"
                              aria-label="Move up"
                              disabled={imgIndex === 0}
                              onClick={() => {
                                const next = [...arr];
                                [next[imgIndex], next[imgIndex - 1]] = [next[imgIndex - 1], next[imgIndex]];
                                update(i, { images: next, image: next[0] || "" });
                              }}
                              className="px-1 text-xs text-muted hover:text-primary disabled:opacity-30"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              aria-label="Move down"
                              disabled={imgIndex === arr.length - 1}
                              onClick={() => {
                                const next = [...arr];
                                [next[imgIndex], next[imgIndex + 1]] = [next[imgIndex + 1], next[imgIndex]];
                                update(i, { images: next, image: next[0] || "" });
                              }}
                              className="px-1 text-xs text-muted hover:text-primary disabled:opacity-30"
                            >
                              ▼
                            </button>
                          </div>
                          <span className="w-16 shrink-0 text-xs font-bold text-muted">
                            {imgIndex === 0 ? "Обложка" : `Слайд ${imgIndex + 1}`}
                          </span>
                          <div className="flex-1">
                            <ImagePicker
                              value={img}
                              onChange={(url) => {
                                const next = [...arr];
                                next[imgIndex] = url;
                                update(i, { images: next, image: next[0] || url });
                              }}
                            />
                          </div>
                          {arr.length > 1 && (
                            <DeleteButton
                              label="Удалить"
                              onDelete={() => {
                                const next = arr.filter((_, k) => k !== imgIndex);
                                update(i, { images: next, image: next[0] || "" });
                              }}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Categories picker */}
                  {!isPkg && (
                    <div className="mt-5 rounded-2xl border border-black/5 bg-black/[.02] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-ink">Категории тура</span>
                        <span className="text-xs text-muted">Тур может входить сразу в несколько категорий</span>
                      </div>
                      <div className="mt-3 flex flex-wrap gap-2.5">
                        {categories
                          .filter((c) => c.id !== PACKAGE_CATEGORY)
                          .map((c) => {
                            const isSelected = tour.categories.includes(c.id);
                            return (
                              <label
                                key={c.id}
                                className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold cursor-pointer transition-all ${
                                  isSelected
                                    ? "border-primary bg-primary/10 text-primary shadow-xs"
                                    : "border-black/10 bg-white text-ink hover:border-black/25"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const nextCats = isChecked
                                      ? Array.from(new Set([...tour.categories, c.id]))
                                      : tour.categories.filter((x) => x !== c.id);
                                    const patch: Partial<Tour> = { categories: nextCats };
                                    if (c.id === "popular") {
                                      patch.featured = isChecked;
                                    }
                                    update(i, patch);
                                  }}
                                  className="h-3.5 w-3.5 rounded text-primary focus:ring-primary"
                                />
                                <span>{c.title.ru || c.title.en || c.id}</span>
                                <span className="text-[10px] text-muted">({c.id})</span>
                              </label>
                            );
                          })}
                      </div>

                      <div className="mt-3 space-y-1.5 pt-2 border-t border-black/5 text-xs">
                        <label className="flex items-center gap-2 font-medium text-ink cursor-pointer">
                          <input
                            type="checkbox"
                            checked={tour.featured ?? true}
                            onChange={(e) => {
                              const isChecked = e.target.checked;
                              const nextCats = isChecked
                                ? Array.from(new Set([...tour.categories, "popular"]))
                                : tour.categories.filter((x) => x !== "popular");
                              update(i, { featured: isChecked, categories: nextCats });
                            }}
                            className="h-3.5 w-3.5 rounded text-primary focus:ring-primary"
                          />
                          <span>Отображать в блоке «Популярные туры» на главной странице</span>
                        </label>

                        {tour.categories.includes("individual") && (
                          <p className="flex items-center gap-1.5 text-purple-700 bg-purple-50 px-2.5 py-1 rounded-lg font-medium">
                            <span>✨</span>
                            <span>Выбрана категория «Индивидуальный»: на сайте фиксированная цена будет скрыта и тур отобразится «По запросу».</span>
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Приостановка / Отмена бронирования тура */}
                  <div className="mt-4 rounded-2xl border border-red-200/80 bg-red-50/70 p-4 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <label className="flex items-center gap-2.5 text-sm font-bold text-red-950 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(tour.bookingDisabled)}
                          onChange={(e) => {
                            const disabled = e.target.checked;
                            update(i, {
                              bookingDisabled: disabled,
                              bookingNotice: disabled
                                ? tour.bookingNotice || {
                                    ru: "Места временно закончились. Ближайшие доступные даты уточняйте у менеджера.",
                                    en: "Bookings temporarily paused. Please contact us for the next available dates.",
                                    hy: "Ամրագրումը ժամանակավորապես դադարեցված է: Հաջորդ հասանելի օրերի համար կապվեք մեզ հետ:",
                                  }
                                : tour.bookingNotice,
                            });
                          }}
                          className="h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
                        />
                        <span>⛔ Приостановить / отменить бронирование этого тура</span>
                      </label>
                      {tour.bookingDisabled && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-200/80 px-2.5 py-0.5 text-xs font-bold text-red-900">
                          Бронь закрыта на сайте
                        </span>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-red-800 leading-relaxed">
                      При включении кнопка онлайн-бронирования меняется на запрос в WhatsApp, а на карточке и на странице тура выводится сообщение о доступности (например, когда освободятся места).
                    </p>

                    {tour.bookingDisabled && (
                      <div className="mt-3.5 pt-3 border-t border-red-200/70">
                        <Field label={`Сообщение для клиентов (${loc.toUpperCase()}): когда тур снова доступен, даты или причина`}>
                          <TextInput
                            placeholder={
                              loc === "ru"
                                ? "Например: Места на эту неделю закончились. Ближайшие свободные даты — с 15 числа."
                                : loc === "en"
                                ? "E.g. Fully booked this week. Next available dates start on the 15th."
                                : "Օրինակ՝ Այս շաբաթվա տեղերը սպառված են: Հաջորդ հասանելի օրերը՝ ամսի 15-ից:"
                            }
                            value={tour.bookingNotice?.[loc] || ""}
                            onChange={(v) =>
                              update(i, {
                                bookingNotice: {
                                  ru: tour.bookingNotice?.ru || "",
                                  en: tour.bookingNotice?.en || "",
                                  hy: tour.bookingNotice?.hy || "",
                                  [loc]: v,
                                },
                              })
                            }
                          />
                        </Field>
                        <p className="mt-1 text-[11px] text-red-700">
                          Вы можете ввести текст для каждого языка, переключая вкладки RU / HY / EN ниже в разделе «Texts».
                        </p>
                      </div>
                    )}
                  </div>

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
                  </div>

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
      <SaveBar onSave={onSave} label="Publish all changes" />
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

      <SaveBar onSave={onSave} label="Publish all changes" />
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
      <SaveBar onSave={onSave} label="Publish all changes" />
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
            <SaveBar onSave={onSaveCategories} label="Publish all changes" />
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
      <SaveBar onSave={onSave} label="Publish all changes" />
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
      <SaveBar onSave={onSave} label="Publish all changes" />
    </section>
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

/* ---------- Reviews Tab ---------- */

function ReviewsTab({
  reviews,
  onChange,
  onSave,
}: {
  reviews: Review[];
  onChange: (reviews: Review[]) => void;
  onSave: () => void;
}) {
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [addingNew, setAddingNew] = useState(false);

  // New review form
  const [newAuthor, setNewAuthor] = useState("");
  const [newLocation, setNewLocation] = useState("");
  const [newTour, setNewTour] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newText, setNewText] = useState("");

  const pendingList = reviews.filter((r) => !r.approved);
  const approvedList = reviews.filter((r) => r.approved);

  const displayed =
    filter === "pending"
      ? pendingList
      : filter === "approved"
      ? approvedList
      : reviews;

  function toggleApproval(id: string) {
    onChange(
      reviews.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r))
    );
  }

  function deleteReview(id: string) {
    if (!window.confirm("Удалить этот отзыв?")) return;
    onChange(reviews.filter((r) => r.id !== id));
  }

  function handleCreateReview(e: React.FormEvent) {
    e.preventDefault();
    if (!newAuthor.trim() || !newText.trim()) return;

    const item: Review = {
      id: `rev-${Date.now()}`,
      author: newAuthor.trim(),
      location: newLocation.trim(),
      tourTitle: newTour.trim(),
      rating: newRating,
      text: newText.trim(),
      date: new Date().toISOString().split("T")[0],
      approved: true, // admin created reviews are approved by default
      createdAt: new Date().toISOString(),
    };

    onChange([item, ...reviews]);
    setAddingNew(false);
    setNewAuthor("");
    setNewLocation("");
    setNewTour("");
    setNewRating(5);
    setNewText("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-xl font-black text-ink">Управление отзывами</h2>
          <p className="text-xs text-muted">
            Модерация отзывов гостей. Новые отзывы с сайта требуют проверки перед публикацией.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setAddingNew(!addingNew)}
          className="rounded-full bg-primary px-5 py-2 text-xs font-bold text-white transition-colors hover:bg-primary-dark"
        >
          {addingNew ? "✕ Закрыть форму" : "+ Добавить отзыв вручную"}
        </button>
      </div>

      {/* Manual Add Form */}
      {addingNew && (
        <form
          onSubmit={handleCreateReview}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-6 space-y-4"
        >
          <h3 className="text-sm font-bold text-ink">Новый отзыв (будет опубликован сразу)</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Имя автора *">
              <TextInput value={newAuthor} onChange={setNewAuthor} placeholder="Анна С." />
            </Field>
            <Field label="Город / страна">
              <TextInput value={newLocation} onChange={setNewLocation} placeholder="Москва" />
            </Field>
            <Field label="Название тура">
              <TextInput value={newTour} onChange={setNewTour} placeholder="Озеро Севан" />
            </Field>
          </div>

          <div>
            <span className="block text-sm font-semibold text-ink">Оценка</span>
            <div className="mt-1 flex gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setNewRating(s)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                    newRating === s ? "bg-primary text-white" : "bg-white border text-ink"
                  }`}
                >
                  {s} ★
                </button>
              ))}
            </div>
          </div>

          <Field label="Текст отзыва *">
            <textarea
              required
              rows={3}
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              className={inputCls}
              placeholder="Текст отзыва..."
            />
          </Field>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setAddingNew(false)}
              className="rounded-full border px-4 py-2 text-xs font-bold text-muted"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="rounded-full bg-primary px-6 py-2 text-xs font-bold text-white hover:bg-primary-dark"
            >
              Сохранить отзыв
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-black/10 pb-3">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            filter === "all" ? "bg-deep text-white" : "bg-white border text-muted"
          }`}
        >
          Все ({reviews.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("pending")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            filter === "pending"
              ? "bg-amber-500 text-white shadow-sm"
              : "bg-white border text-amber-700"
          }`}
        >
          Ожидают проверки ({pendingList.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("approved")}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            filter === "approved" ? "bg-green-600 text-white" : "bg-white border text-green-700"
          }`}
        >
          Опубликованные ({approvedList.length})
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {displayed.length === 0 ? (
          <div className="rounded-2xl border border-black/10 bg-white p-8 text-center text-sm text-muted">
            Нет отзывов в этой категории.
          </div>
        ) : (
          displayed.map((rev) => {
            const rawText =
              typeof rev.text === "string"
                ? rev.text
                : rev.text?.ru || rev.text?.en || rev.text?.hy || "";

            return (
              <div
                key={rev.id}
                className={`rounded-2xl border p-5 transition-all ${
                  rev.approved
                    ? "border-black/10 bg-white"
                    : "border-amber-400 bg-amber-50/50 shadow-sm"
                }`}
              >
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-ink">{rev.author}</span>
                      {rev.location && (
                        <span className="text-xs text-muted">({rev.location})</span>
                      )}
                      <span className="text-xs font-bold text-amber-600">
                        {"★".repeat(rev.rating)} ({rev.rating}/5)
                      </span>
                      {rev.approved ? (
                        <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-[10px] font-bold text-green-800">
                          ✓ Опубликован
                        </span>
                      ) : (
                        <span className="rounded-full bg-amber-200 px-2.5 py-0.5 text-[10px] font-bold text-amber-900">
                          ⏳ На проверке
                        </span>
                      )}
                    </div>

                    {rev.tourTitle && (
                      <span className="block text-xs font-semibold text-primary">
                        📍 Тур: {rev.tourTitle}
                      </span>
                    )}

                    <p className="pt-1 text-sm text-ink leading-relaxed whitespace-pre-line">
                      {rawText}
                    </p>

                    <span className="block text-[11px] text-muted">
                      Дата: {rev.date}
                    </span>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleApproval(rev.id)}
                      className={`rounded-full px-4 py-1.5 text-xs font-bold transition-colors ${
                        rev.approved
                          ? "border border-black/15 bg-white text-muted hover:border-amber-600 hover:text-amber-600"
                          : "bg-green-600 text-white hover:bg-green-700 shadow-sm"
                      }`}
                    >
                      {rev.approved ? "Скрыть с сайта" : "✓ Одобрить"}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteReview(rev.id)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                    >
                      Удалить
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <SaveBar onSave={onSave} label="Опубликовать изменения на сайте" />
    </div>
  );
}
