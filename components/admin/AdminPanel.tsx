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
import { defaultHomepageImages, type HomepageImages, type SiteInfo } from "@/lib/site";
import type { Content, ContentKey } from "@/lib/content";
import type { Review } from "@/lib/reviews";
import type { SpecialOffer } from "@/lib/offers";
import type { GuestMedia } from "@/lib/guests";
import type { Guide } from "@/lib/guides";
import type { Attraction, RegionCategory } from "@/lib/attractions";

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
  offers: "Спецпредложения",
  guests: "Гости",
  guides: "Гиды",
  attractions: "Что посмотреть",
};

const TABS = ["Tours", "Packages", "Attractions", "Offers", "Guests", "Guides", "Images", "Categories", "Reviews", "Texts", "Contacts", "Password"] as const;
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
    offers: content.offers || [],
    guests: content.guests || [],
    guides: content.guides || [],
    attractions: content.attractions || [],
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
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="text-xs sm:text-sm text-white/80 hover:text-accent">
              View site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-full border border-white/25 px-2.5 sm:px-3 py-1 text-xs sm:text-sm font-semibold hover:border-accent hover:text-accent"
            >
              Log out
            </button>
          </div>
        </div>
        <nav className="mx-auto flex max-w-[1100px] gap-1 px-3 sm:px-6 overflow-x-auto whitespace-nowrap scrollbar-none py-1">
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
                className={`flex shrink-0 items-center gap-1.5 rounded-t-lg px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold transition-colors ${
                  tab === t ? "bg-bg text-ink" : "text-white/70 hover:text-accent"
                }`}
              >
                <span>
                  {t === "Reviews"
                    ? "Отзывы"
                    : t === "Offers"
                    ? "Спецпредложения"
                    : t === "Guests"
                    ? "Гости"
                    : t === "Guides"
                    ? "Гиды"
                    : t === "Attractions"
                    ? "Что посмотреть"
                    : t}
                </span>
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
          <div className="mx-auto flex max-w-[1100px] flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-4 px-4 py-2.5 sm:px-6 sm:py-3">
            <p className="text-xs sm:text-sm font-semibold">
              Unpublished changes in{" "}
              <b>{dirty.map((k) => sectionNames[k]).join(", ")}</b>
              <span className="hidden sm:inline ml-2 font-normal text-muted">
                Not live until you publish.
              </span>
            </p>
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="shrink-0 rounded-full bg-primary px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-bold text-white transition-colors hover:bg-primary-dark disabled:opacity-50 text-center"
            >
              {busy ? "Publishing…" : "Publish all changes"}
            </button>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-[1100px] px-3 sm:px-6 py-4 sm:py-8 pb-28 sm:pb-12">
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
        {tab === "Attractions" && (
          <AttractionsTab
            attractions={content.attractions || []}
            onChange={(attractions) => setContent({ ...content, attractions })}
            onSave={publish}
          />
        )}
        {tab === "Offers" && (
          <OffersTab
            offers={content.offers || []}
            onChange={(offers) => setContent({ ...content, offers })}
            onSave={publish}
          />
        )}
        {tab === "Guests" && (
          <GuestsTab
            guests={content.guests || []}
            guides={content.guides || []}
            onChange={(guests) => setContent({ ...content, guests })}
            onSave={publish}
          />
        )}
        {tab === "Guides" && (
          <GuidesTab
            guides={content.guides || []}
            onChange={(guides) => setContent({ ...content, guides })}
            onSave={publish}
          />
        )}
        {tab === "Images" && (
          <ImagesTab
            images={content.hero.images}
            site={content.site}
            onChange={(images) => setContent({ ...content, hero: { images } })}
            onChangeSite={(site) => setContent({ ...content, site })}
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
  const [isDragging, setIsDragging] = useState(false);
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

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const ext = item.type.split("/")[1]?.replace("jpeg", "jpg") || "png";
          const named = new File([file], `clipboard-${Date.now()}.${ext}`, { type: file.type });
          upload(named);
          return;
        }
      }
    }
  }

  async function pasteFromClipboard() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.read) {
        const items = await navigator.clipboard.read();
        for (const item of items) {
          const imageType = item.types.find((t) => t.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const ext = imageType.split("/")[1]?.replace("jpeg", "jpg") || "png";
            const file = new File([blob], `clipboard-${Date.now()}.${ext}`, { type: imageType });
            await upload(file);
            return;
          }
        }
        setError("В буфере обмена нет изображения. Скопируйте картинку и нажмите Paste (или Ctrl+V).");
        return;
      }
      setError("Нажмите на поле ввода и используйте Ctrl+V для вставки картинки.");
    } catch {
      setError("Нажмите на поле ввода и нажмите Ctrl+V для вставки картинки.");
    }
  }

  return (
    <div
      onPaste={handlePaste}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith("image/")) upload(f);
      }}
      className={`mt-1 flex flex-wrap items-center gap-3 rounded-xl p-1.5 transition-colors ${
        isDragging ? "bg-primary/10 ring-2 ring-primary ring-dashed" : ""
      }`}
    >
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        title="Кликните для выбора файла или перетащите сюда картинку"
        className="group relative cursor-pointer focus:outline-none"
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pending?.url === value ? pending.preview : value}
            alt=""
            className="h-14 w-20 rounded-lg border border-black/10 object-cover transition-opacity group-hover:opacity-80"
          />
        ) : (
          <span className="flex h-14 w-20 flex-col items-center justify-center rounded-lg border border-dashed border-black/20 text-[11px] text-muted transition-colors group-hover:border-primary group-hover:text-primary">
            <span>📷</span>
            <span>no image</span>
          </span>
        )}
      </button>

      <div className="flex-1 min-w-[200px]">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={handlePaste}
          placeholder="/images/… или Ctrl+V (вставить)"
          className={inputCls.replace("mt-1 ", "")}
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={pasteFromClipboard}
          title="Вставить картинку из буфера обмена (Ctrl+V)"
          className="rounded-full border border-black/15 bg-white px-3.5 py-2 text-xs font-bold text-[#312F2F] hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 transition-all flex items-center gap-1.5"
        >
          <span>📋</span>
          <span>{busy ? "..." : "Paste"}</span>
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={() => fileRef.current?.click()}
          className="rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-bold text-[#312F2F] hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-50 transition-all"
        >
          {busy ? "Uploading…" : "Upload"}
        </button>
      </div>

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
        (tour.code && tour.code.toLowerCase().includes(needle)) ||
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
                  className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-2 py-3.5 pr-3 text-left"
                >
                  <span className="font-bold text-sm sm:text-base flex items-center flex-wrap gap-2">
                    <span className="inline-block rounded bg-primary/10 border border-primary/20 px-2 py-0.5 text-xs font-mono font-black text-primary">
                      #{tour.code || "---"}
                    </span>
                    <span>{tour.title.ru || tour.title.en || tour.slug}</span>
                    <span className="text-xs font-semibold text-muted">
                      {tour.categories?.includes("individual") || tour.priceFromAmd === 0
                        ? "по запросу"
                        : `${tour.priceFromAmd.toLocaleString("ru-RU")} ֏`}
                    </span>
                  </span>
                  <span className="flex flex-wrap items-center gap-1.5 sm:gap-2">
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
                    <span className="text-muted ml-auto sm:ml-0 font-bold">{open ? "–" : "+"}</span>
                  </span>
                </button>
              </div>

              {open && (
                <div className="border-t border-black/5 px-3.5 sm:px-5 py-4 sm:py-5">
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

                  <div className="mt-5 grid gap-4 sm:grid-cols-3">
                    <Field label="Код тура (цифры: 101, 201, 301...)">
                      <TextInput
                        value={tour.code ?? ""}
                        placeholder="101"
                        onChange={(v) => update(i, { code: v.trim() })}
                      />
                    </Field>
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

/* ---------- Homepage & Site Images ---------- */

function ImagesTab({
  images,
  site,
  onChange,
  onChangeSite,
  onSave,
}: {
  images: string[];
  site: SiteInfo;
  onChange: (images: string[]) => void;
  onChangeSite: (site: SiteInfo) => void;
  onSave: () => void;
}) {
  const [subTab, setSubTab] = useState<
    "hero" | "quick" | "bento" | "tours" | "resorts" | "banners" | "articles" | "branding"
  >("hero");

  const hpImages: HomepageImages = {
    ...defaultHomepageImages,
    ...(site.homepageImages || {}),
  };

  function updateHpImage(key: keyof HomepageImages, url: string) {
    onChangeSite({
      ...site,
      homepageImages: {
        ...hpImages,
        [key]: url,
      },
    });
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const next = [...images];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  const sections = [
    { id: "hero", label: "Слайдер шапки", icon: "🖼️" },
    { id: "quick", label: "Карточки первого экрана", icon: "⚡" },
    { id: "bento", label: "Бенто-сетка", icon: "📐" },
    { id: "tours", label: "Топ-туры", icon: "⭐" },
    { id: "resorts", label: "Курорты и СПА", icon: "🏨" },
    { id: "banners", label: "Панорамные баннеры", icon: "🌄" },
    { id: "articles", label: "Статьи и гид", icon: "📖" },
    { id: "branding", label: "О нас и логотип", icon: "ℹ️" },
  ] as const;

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-black text-ink">Управление всеми изображениями сайта</h2>
        <p className="mt-1 text-sm text-muted">
          Редактируйте любые фотографии, баннеры, карточки направлений и обложки статей.
        </p>
      </div>

      {/* Sub-tabs selector */}
      <div className="flex flex-wrap gap-2 border-b border-black/10 pb-3">
        {sections.map((sec) => (
          <button
            key={sec.id}
            type="button"
            onClick={() => setSubTab(sec.id)}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
              subTab === sec.id
                ? "bg-[#312F2F] text-white shadow-sm"
                : "bg-white text-ink/70 hover:bg-black/5 hover:text-ink border border-black/5"
            }`}
          >
            <span>{sec.icon}</span>
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* 1. Hero Slideshow */}
      {subTab === "hero" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Слайдер главного экрана (Hero Slideshow)</h3>
            <p className="mt-1 text-xs text-muted">
              Большие фоновые фотографии в шапке сайта. Они автоматически сменяются при просмотре.
            </p>
          </div>

          <div className="space-y-3">
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
                    label="Удалить"
                    onDelete={() => onChange(images.filter((_, j) => j !== i))}
                  />
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => onChange([...images, ""])}
            className="rounded-full border border-black/15 bg-white px-4 py-2 text-sm font-bold hover:border-primary hover:text-primary"
          >
            + Добавить фото в слайдер
          </button>
        </div>
      )}

      {/* 2. Hero Quick Cards */}
      {subTab === "quick" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Карточки быстрого выбора направлений (Hero Cards)</h3>
            <p className="mt-1 text-xs text-muted">
              6 карточек популярных локаций в блоке под главным поиском на первом экране.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">1. Озеро Севан (Голубая жемчужина)</span>
              <ImagePicker
                value={hpImages.heroSevan}
                onChange={(url) => updateHpImage("heroSevan", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">2. Хор Вирап & Арарат</span>
              <ImagePicker
                value={hpImages.heroKhorVirap}
                onChange={(url) => updateHpImage("heroKhorVirap", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">3. Храм Гарни & Гегард</span>
              <ImagePicker
                value={hpImages.heroGarni}
                onChange={(url) => updateHpImage("heroGarni", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">4. Крылья Татева</span>
              <ImagePicker
                value={hpImages.heroTatev}
                onChange={(url) => updateHpImage("heroTatev", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">5. Красный Нораванк</span>
              <ImagePicker
                value={hpImages.heroNoravank}
                onChange={(url) => updateHpImage("heroNoravank", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">6. Вулкан Аждаак (4x4)</span>
              <ImagePicker
                value={hpImages.heroAzhdahak}
                onChange={(url) => updateHpImage("heroAzhdahak", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 3. Bento Grid */}
      {subTab === "bento" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Трендовые направления (Бенто-сетка)</h3>
            <p className="mt-1 text-xs text-muted">
              Блок «Туры по Армении — это тренд» с 4 карточками разного размера.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Карточка 1 (Вертикальная): Горная сказка / Севан</span>
              <ImagePicker
                value={hpImages.bentoCard1}
                onChange={(url) => updateHpImage("bentoCard1", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Карточка 2 (Широкая вверху): Популярные направления / Хор Вирап</span>
              <ImagePicker
                value={hpImages.bentoCard2}
                onChange={(url) => updateHpImage("bentoCard2", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Карточка 3 (Слева внизу): Премиум-отели / Дилижан</span>
              <ImagePicker
                value={hpImages.bentoCard3}
                onChange={(url) => updateHpImage("bentoCard3", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Карточка 4 (Справа внизу): Экскурсионные туры / Гарни</span>
              <ImagePicker
                value={hpImages.bentoCard4}
                onChange={(url) => updateHpImage("bentoCard4", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 4. Top Tours Showcase */}
      {subTab === "tours" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Топ-туры и авторские маршруты</h3>
            <p className="mt-1 text-xs text-muted">
              3 визитные карточки туров, в каждой из которых отображаются два фото: основное и дополнительное.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-ink">Тур 1: Хор Вирап, Арени и Нораванк</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted block mb-1">Левое фото (Хор Вирап & Арарат):</span>
                  <ImagePicker
                    value={hpImages.topTour1Left}
                    onChange={(url) => updateHpImage("topTour1Left", url)}
                  />
                </div>
                <div>
                  <span className="text-xs text-muted block mb-1">Правое фото (Каньон Нораванк):</span>
                  <ImagePicker
                    value={hpImages.topTour1Right}
                    onChange={(url) => updateHpImage("topTour1Right", url)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-ink">Тур 2: Гарни, Гегард и Симфония Камней</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted block mb-1">Левое фото (Храм Гарни):</span>
                  <ImagePicker
                    value={hpImages.topTour2Left}
                    onChange={(url) => updateHpImage("topTour2Left", url)}
                  />
                </div>
                <div>
                  <span className="text-xs text-muted block mb-1">Правое фото (Лазурный Севан):</span>
                  <ImagePicker
                    value={hpImages.topTour2Right}
                    onChange={(url) => updateHpImage("topTour2Right", url)}
                  />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-3">
              <h4 className="text-sm font-bold text-ink">Тур 3: Крылья Татева, Водопад Шаки и Джермук</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <span className="text-xs text-muted block mb-1">Левое фото (Крылья Татева):</span>
                  <ImagePicker
                    value={hpImages.topTour3Left}
                    onChange={(url) => updateHpImage("topTour3Left", url)}
                  />
                </div>
                <div>
                  <span className="text-xs text-muted block mb-1">Правое фото (Горные перевалы):</span>
                  <ImagePicker
                    value={hpImages.topTour3Right}
                    onChange={(url) => updateHpImage("topTour3Right", url)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Luxury Resorts */}
      {subTab === "resorts" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Премиум-курорты и отели (Слайдер)</h3>
            <p className="mt-1 text-xs text-muted">
              3 слайда с курортами и СПА-отелями Армении.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Слайд 1: SEVAN RESORT & SPA</span>
              <ImagePicker
                value={hpImages.resortSevan}
                onChange={(url) => updateHpImage("resortSevan", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Слайд 2: DILIJAN FOREST CHALET</span>
              <ImagePicker
                value={hpImages.resortDilijan}
                onChange={(url) => updateHpImage("resortDilijan", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Слайд 3: GRAND JERMUK SPRINGS</span>
              <ImagePicker
                value={hpImages.resortJermuk}
                onChange={(url) => updateHpImage("resortJermuk", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 6. Banners */}
      {subTab === "banners" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Широкоформатные панорамные баннеры</h3>
            <p className="mt-1 text-xs text-muted">
              Фоновые изображения для панорамных разделителей на главной странице.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Панорамный горный баннер («Отдых без мелкого шрифта»)</span>
              <ImagePicker
                value={hpImages.panoramicBanner}
                onChange={(url) => updateHpImage("panoramicBanner", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Полноэкранный баннер курортов («THE BEST BEACH & MOUNTAIN RESORTS»)</span>
              <ImagePicker
                value={hpImages.featuredBanner}
                onChange={(url) => updateHpImage("featuredBanner", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 7. Travel Articles */}
      {subTab === "articles" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Статьи и гид путешественника (Travel Stories)</h3>
            <p className="mt-1 text-xs text-muted">
              Обложки 3 статей и путеводителей на главной странице.
            </p>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Статья 1: «Джип-тур на вулкан Аждаак»</span>
              <ImagePicker
                value={hpImages.article1}
                onChange={(url) => updateHpImage("article1", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Статья 2: «Симфония камней и скальный Гегард»</span>
              <ImagePicker
                value={hpImages.article2}
                onChange={(url) => updateHpImage("article2", url)}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Статья 3: «Как выбрать многодневный тур по Армении»</span>
              <ImagePicker
                value={hpImages.article3}
                onChange={(url) => updateHpImage("article3", url)}
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. Branding & About */}
      {subTab === "branding" && (
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-extrabold text-ink">Страница «О нас» и Логотип</h3>
            <p className="mt-1 text-xs text-muted">
              Основное фото на странице компании и логотип.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Фотография на странице «О нас»</span>
              <ImagePicker
                value={site.aboutImage}
                onChange={(url) => onChangeSite({ ...site, aboutImage: url })}
              />
            </div>

            <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm space-y-2">
              <span className="text-xs font-bold text-ink">Логотип сайта (Иконка / Круглый знак)</span>
              <ImagePicker
                value={site.logo}
                onChange={(url) => onChangeSite({ ...site, logo: url })}
              />
            </div>
          </div>
        </div>
      )}

      <SaveBar onSave={onSave} label="Опубликовать изменения изображений" />
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-xl font-extrabold">Tour categories</h2>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
  type ContactKey = "name" | "phone" | "whatsapp" | "telegram" | "instagram" | "email";
  const fields: { key: ContactKey; label: string; hint?: string }[] = [
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
  const [newGuide, setNewGuide] = useState("");
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
      guideName: newGuide.trim(),
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
    setNewGuide("");
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
          className="rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:p-6 space-y-4"
        >
          <h3 className="text-sm font-bold text-ink">Новый отзыв (будет опубликован сразу)</h3>
          <div className="grid gap-4 sm:grid-cols-4">
            <Field label="Имя автора *">
              <TextInput value={newAuthor} onChange={setNewAuthor} placeholder="Анна С." />
            </Field>
            <Field label="Город / страна">
              <TextInput value={newLocation} onChange={setNewLocation} placeholder="Москва" />
            </Field>
            <Field label="Название тура">
              <TextInput value={newTour} onChange={setNewTour} placeholder="Озеро Севан" />
            </Field>
            <Field label="Имя гида">
              <TextInput value={newGuide} onChange={setNewGuide} placeholder="Армен" />
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
                        Тур: {rev.tourTitle}
                      </span>
                    )}

                    {rev.guideName && (
                      <span className="block text-xs font-semibold text-emerald-600">
                        Гид: {rev.guideName}
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

/* ---------- Special Offers Tab ---------- */

function OffersTab({
  offers,
  onChange,
  onSave,
}: {
  offers: SpecialOffer[];
  onChange: (offers: SpecialOffer[]) => void;
  onSave: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(offers[0]?.id ?? null);

  const activeOffer = offers.find((o) => o.id === editingId) || offers[0];

  function updateActiveOffer(patch: Partial<SpecialOffer>) {
    if (!activeOffer) return;
    onChange(
      offers.map((o) => (o.id === activeOffer.id ? { ...o, ...patch } : o))
    );
  }

  function addOffer() {
    const newId = `offer-${Date.now()}`;
    const newOffer: SpecialOffer = {
      id: newId,
      active: true,
      badge: {
        ru: "−15% СПЕЦПРЕДЛОЖЕНИЕ",
        hy: "−15% ՀԱՏՈՒԿ ԱՌԱՋԱՐԿ",
        en: "−15% SPECIAL DEAL",
      },
      title: {
        ru: "Новое специальное предложение",
        hy: "Նոր հատուկ առաջարկ",
        en: "New Special Offer",
      },
      subtitle: {
        ru: "Описание специального предложения, что включено и почему это выгодно.",
        hy: "Հատուկ առաջարկի նկարագրություն, ինչ է ներառված։",
        en: "Special offer description, inclusions and advantages.",
      },
      priceFromAmd: 100000,
      priceOldAmd: 125000,
      linkHref: "/#tours",
      image: "/images/tatev.jpg",
      validUntil: {
        ru: "Предложение ограничено",
        hy: "Առաջարկը սահմանափակ է",
        en: "Limited Availability",
      },
      highlightFeatures: {
        ru: ["Комфортный трансфер", "Гид включен"],
        hy: ["Հարմարավետ տրանսֆեր", "Գիդը ներառված է"],
        en: ["Comfortable transfer", "Guide included"],
      },
    };
    onChange([...offers, newOffer]);
    setEditingId(newId);
  }

  function deleteOffer(id: string) {
    if (offers.length <= 1) {
      alert("Нельзя удалить последнее предложение. Вы можете отключить его переключателем.");
      return;
    }
    if (!window.confirm("Удалить это спецпредложение?")) return;
    const remaining = offers.filter((o) => o.id !== id);
    onChange(remaining);
    if (editingId === id) {
      setEditingId(remaining[0]?.id ?? null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink">Спецпредложения (Special Offers)</h2>
          <p className="mt-1 text-sm text-muted">
            Управляйте спецпредложениями на главной: скидки, баннеры, цены и ссылки.
          </p>
        </div>
        <button
          type="button"
          onClick={addOffer}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-primary-dark transition-colors"
        >
          + Добавить спецпредложение
        </button>
      </div>

      {/* Offers Cards Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {offers.map((item) => (
          <div
            key={item.id}
            onClick={() => setEditingId(item.id)}
            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
              activeOffer?.id === item.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                : "border-black/10 bg-white hover:border-black/20"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span
                className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                  item.active ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-700"
                }`}
              >
                {item.active ? "✓ Активно на сайте" : "Отключено"}
              </span>
              <span className="text-xs font-bold text-primary">
                {item.priceFromAmd ? `${item.priceFromAmd.toLocaleString()} ֏` : ""}
              </span>
            </div>
            <h3 className="mt-2 text-sm font-bold text-ink line-clamp-1">
              {item.title.ru || item.title.en || item.id}
            </h3>
            <p className="mt-1 text-xs text-muted line-clamp-1">
              {item.badge.ru || item.badge.en}
            </p>
          </div>
        ))}
      </div>

      {/* Offer Editor Card */}
      {activeOffer && (
        <div className="rounded-2xl sm:rounded-3xl border border-black/10 bg-white p-4 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-ink">Редактирование предложения</h3>
              <label className="flex items-center gap-2 cursor-pointer rounded-full bg-bg px-3 py-1 border border-black/10 text-xs font-bold">
                <input
                  type="checkbox"
                  checked={activeOffer.active}
                  onChange={(e) => updateActiveOffer({ active: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <span>{activeOffer.active ? "Показывать на сайте" : "Скрыто"}</span>
              </label>
            </div>

            <button
              type="button"
              onClick={() => deleteOffer(activeOffer.id)}
              className="text-xs font-bold text-red-600 hover:text-red-800"
            >
              Удалить это предложение
            </button>
          </div>

          {/* Pricing & Link */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Новая цена со скидкой (֏ AMD)">
              <input
                type="number"
                value={activeOffer.priceFromAmd || ""}
                onChange={(e) => updateActiveOffer({ priceFromAmd: Number(e.target.value) || undefined })}
                className={inputCls}
                placeholder="39900"
              />
            </Field>

            <Field label="Старая зачёркнутая цена (֏ AMD)">
              <input
                type="number"
                value={activeOffer.priceOldAmd || ""}
                onChange={(e) => updateActiveOffer({ priceOldAmd: Number(e.target.value) || undefined })}
                className={inputCls}
                placeholder="55000"
              />
            </Field>

            <Field label="Ссылка бронирования (WhatsApp / URL)">
              <input
                type="text"
                value={activeOffer.linkHref}
                onChange={(e) => updateActiveOffer({ linkHref: e.target.value })}
                className={inputCls}
                placeholder="https://wa.me/..."
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Изображение постера спецпредложения">
              <ImagePicker
                value={activeOffer.bannerImage || activeOffer.image || ""}
                onChange={(url) =>
                  updateActiveOffer({ bannerImage: url, image: url })
                }
              />
            </Field>

            <Field label="Ссылка второй кнопки 'Подробнее'">
              <input
                type="text"
                value={activeOffer.secondaryLinkHref || ""}
                onChange={(e) => updateActiveOffer({ secondaryLinkHref: e.target.value })}
                className={inputCls}
                placeholder="/#tours"
              />
            </Field>
          </div>

          {/* Multilingual Titles & Badges */}
          <div className="space-y-4 pt-2 border-t border-black/10">
            <h4 className="text-sm font-bold uppercase tracking-wider text-muted">Языковые версии</h4>

            {locales.map((loc) => (
              <div key={loc} className="rounded-2xl border border-black/5 bg-bg/50 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-black/10 px-2 py-0.5 text-xs font-black uppercase text-ink">
                    {localeNames[loc]} ({loc.toUpperCase()})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Текст бейджа (Badge)">
                    <input
                      type="text"
                      value={activeOffer.badge[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          badge: { ...activeOffer.badge, [loc]: e.target.value },
                        })
                      }
                      className={inputCls}
                      placeholder="−20% СПЕЦПРЕДЛОЖЕНИЕ"
                    />
                  </Field>

                  <Field label="Пометка срока (Valid Until)">
                    <input
                      type="text"
                      value={activeOffer.validUntil?.[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          validUntil: {
                            ...(activeOffer.validUntil || { ru: "", hy: "", en: "" }),
                            [loc]: e.target.value,
                          },
                        })
                      }
                      className={inputCls}
                      placeholder="Предложение ограничено • Сезон 2026"
                    />
                  </Field>
                </div>

                <Field label="Заголовок (Title)">
                  <input
                    type="text"
                    value={activeOffer.title[loc] || ""}
                    onChange={(e) =>
                      updateActiveOffer({
                        title: { ...activeOffer.title, [loc]: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="Путешествуй больше — плати меньше"
                  />
                </Field>

                <Field label="Текст акцентной плашки цены (Price Highlight)">
                  <input
                    type="text"
                    value={activeOffer.priceHighlightText?.[loc] || ""}
                    onChange={(e) =>
                      updateActiveOffer({
                        priceHighlightText: {
                          ...(activeOffer.priceHighlightText || { ru: "", hy: "", en: "" }),
                          [loc]: e.target.value,
                        },
                      })
                    }
                    className={inputCls}
                    placeholder="2 экскурсии — всего 39 900 драм с человека"
                  />
                </Field>

                <Field label="Подзаголовок / описание (Subtitle)">
                  <textarea
                    rows={2}
                    value={activeOffer.subtitle[loc] || ""}
                    onChange={(e) =>
                      updateActiveOffer({
                        subtitle: { ...activeOffer.subtitle, [loc]: e.target.value },
                      })
                    }
                    className={inputCls}
                    placeholder="Два насыщенных путешествия по Армении по одной специальной цене."
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Название левого маршрута">
                    <input
                      type="text"
                      value={activeOffer.leftRouteTitle?.[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          leftRouteTitle: {
                            ...(activeOffer.leftRouteTitle || { ru: "", hy: "", en: "" }),
                            [loc]: e.target.value,
                          },
                        })
                      }
                      className={inputCls}
                      placeholder="ОТ АРАРАТА ДО ДЖЕРМУКА"
                    />
                  </Field>

                  <Field label="Название правого маршрута">
                    <input
                      type="text"
                      value={activeOffer.rightRouteTitle?.[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          rightRouteTitle: {
                            ...(activeOffer.rightRouteTitle || { ru: "", hy: "", en: "" }),
                            [loc]: e.target.value,
                          },
                        })
                      }
                      className={inputCls}
                      placeholder="ОТ ГАРНИ ДО СЕВАНА"
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field label="Текст главной кнопки (WhatsApp)">
                    <input
                      type="text"
                      value={activeOffer.primaryButtonText?.[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          primaryButtonText: {
                            ...(activeOffer.primaryButtonText || { ru: "", hy: "", en: "" }),
                            [loc]: e.target.value,
                          },
                        })
                      }
                      className={inputCls}
                      placeholder="ЗАБРОНИРОВАТЬ СЕЙЧАС"
                    />
                  </Field>

                  <Field label="Текст второй кнопки">
                    <input
                      type="text"
                      value={activeOffer.secondaryLinkText?.[loc] || ""}
                      onChange={(e) =>
                        updateActiveOffer({
                          secondaryLinkText: {
                            ...(activeOffer.secondaryLinkText || { ru: "", hy: "", en: "" }),
                            [loc]: e.target.value,
                          },
                        })
                      }
                      className={inputCls}
                      placeholder="ПОДРОБНЕЕ"
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>

          <SaveBar onSave={onSave} label="Опубликовать спецпредложения на сайте" />
        </div>
      )}
    </div>
  );
}

/* ---------- Guests Photo & Video Tab ---------- */

function GuestsTab({
  guests,
  guides,
  onChange,
  onSave,
}: {
  guests: GuestMedia[];
  guides: Guide[];
  onChange: (guests: GuestMedia[]) => void;
  onSave: () => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(guests[0]?.id ?? null);

  const activeGuest = guests.find((g) => g.id === editingId) || guests[0];

  function updateActiveGuest(patch: Partial<GuestMedia>) {
    if (!activeGuest) return;
    onChange(
      guests.map((g) => (g.id === activeGuest.id ? { ...g, ...patch } : g))
    );
  }

  function addGuest() {
    const newId = `guest-${Date.now()}`;
    const newGuest: GuestMedia = {
      id: newId,
      type: "photo",
      url: "/images/hero-travellers.jpg",
      title: "Новый момент с гостями",
      location: "Армения",
      guideName: "Армен",
      date: "2026",
      caption: "Описание поездки, эмоции гостей и яркие моменты путешествия.",
    };
    onChange([newGuest, ...guests]);
    setEditingId(newId);
  }

  function deleteGuest(id: string) {
    if (!window.confirm("Удалить этот материал из раздела Гости?")) return;
    const remaining = guests.filter((g) => g.id !== id);
    onChange(remaining);
    if (editingId === id) {
      setEditingId(remaining[0]?.id ?? null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-ink">Гости (Guests Photo & Video)</h2>
          <p className="mt-1 text-sm text-muted">
            Управляйте фотографиями, видеороликами и историями гостей на странице /guests.
          </p>
        </div>
        <button
          type="button"
          onClick={addGuest}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white shadow hover:bg-primary-dark transition-colors"
        >
          + Добавить фото/видео гостя
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {guests.map((item) => (
          <div
            key={item.id}
            onClick={() => setEditingId(item.id)}
            className={`cursor-pointer rounded-xl border p-2 text-left transition-all ${
              activeGuest?.id === item.id
                ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                : "border-border bg-white hover:border-gray-400"
            }`}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-100">
              {item.url && (
                <Image
                  src={item.url}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              )}
              <span className="absolute top-1 right-1 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white uppercase">
                {item.type}
              </span>
            </div>
            <p className="mt-1.5 text-xs font-bold text-ink truncate">{item.title}</p>
            <p className="text-[10px] text-muted truncate">
              {item.location} {item.guideName ? `• Гид: ${item.guideName}` : ""}
            </p>
          </div>
        ))}
      </div>

      {activeGuest && (
        <div className="rounded-2xl border border-border bg-white p-4 sm:p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <div>
              <h3 className="text-lg font-bold text-ink">Редактирование: {activeGuest.title}</h3>
              <p className="text-xs text-muted">ID: {activeGuest.id}</p>
            </div>
            <button
              type="button"
              onClick={() => deleteGuest(activeGuest.id)}
              className="text-xs font-bold text-red-600 hover:text-red-800"
            >
              Удалить этот материал
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Field label="Тип материала">
              <select
                value={activeGuest.type}
                onChange={(e) =>
                  updateActiveGuest({ type: e.target.value as "photo" | "video" })
                }
                className={inputCls}
              >
                <option value="photo">Фотография</option>
                <option value="video">Видео</option>
              </select>
            </Field>

            <Field label="Имя гида">
              <input
                type="text"
                list="admin-guest-guides-list"
                value={activeGuest.guideName || ""}
                onChange={(e) => updateActiveGuest({ guideName: e.target.value })}
                className={inputCls}
                placeholder="Выберите или введите имя гида"
              />
              <datalist id="admin-guest-guides-list">
                {guides.map((g) => (
                  <option key={g.id || g.name} value={g.name} />
                ))}
              </datalist>
            </Field>

            <Field label="Локация / Достопримечательность">
              <input
                type="text"
                value={activeGuest.location}
                onChange={(e) => updateActiveGuest({ location: e.target.value })}
                className={inputCls}
                placeholder="Например: Хор Вирап, Севан, Гарни"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Заголовок момента">
              <input
                type="text"
                value={activeGuest.title}
                onChange={(e) => updateActiveGuest({ title: e.target.value })}
                className={inputCls}
                placeholder="Например: Поездка в монастырь Татев"
              />
            </Field>

            <Field label="Дата / Сезон">
              <input
                type="text"
                value={activeGuest.date || ""}
                onChange={(e) => updateActiveGuest({ date: e.target.value })}
                className={inputCls}
                placeholder="2026"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Фотография / Обложка видео">
              <ImagePicker
                value={activeGuest.url}
                onChange={(url) => updateActiveGuest({ url })}
              />
            </Field>

            {activeGuest.type === "video" && (
              <Field label="Ссылка на видео (YouTube embed или MP4)">
                <input
                  type="text"
                  value={activeGuest.videoUrl || ""}
                  onChange={(e) => updateActiveGuest({ videoUrl: e.target.value })}
                  className={inputCls}
                  placeholder="https://www.youtube.com/embed/..."
                />
              </Field>
            )}
          </div>

          <Field label="Описание / Отзыв к моменту">
            <textarea
              rows={3}
              value={activeGuest.caption || ""}
              onChange={(e) => updateActiveGuest({ caption: e.target.value })}
              className={inputCls}
              placeholder="Расскажите о том, как прошёл день..."
            />
          </Field>

          <SaveBar onSave={onSave} label="Опубликовать изменения раздела Гости" />
        </div>
      )}
    </div>
  );
}

/* ---------- Guides Management Tab ---------- */

function GuidesTab({
  guides,
  onChange,
  onSave,
}: {
  guides: Guide[];
  onChange: (guides: Guide[]) => void;
  onSave: () => void;
}) {
  const [newName, setNewName] = useState("");

  function addGuide(e?: React.FormEvent) {
    if (e) e.preventDefault();
    const trimmed = newName.trim();
    if (!trimmed) return;

    if (guides.some((g) => g.name.toLowerCase() === trimmed.toLowerCase())) {
      alert("Гид с таким именем уже есть в списке!");
      return;
    }

    const newGuide: Guide = {
      id: `guide-${Date.now()}`,
      name: trimmed,
      active: true,
    };
    onChange([...guides, newGuide]);
    setNewName("");
  }

  function updateGuide(id: string, name: string) {
    onChange(guides.map((g) => (g.id === id ? { ...g, name } : g)));
  }

  function deleteGuide(id: string, name: string) {
    if (!window.confirm(`Вы уверены, что хотите удалить гида «${name}»?`)) return;
    onChange(guides.filter((g) => g.id !== id));
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-ink">Гиды компании (Guides)</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Всего: {guides.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Управляйте списком гидов. Они используются в отзывах, фото-моментах и фильтрах на странице «Гости».
          </p>
        </div>
      </div>

      {/* Add Guide Form */}
      <form
        onSubmit={addGuide}
        className="rounded-2xl border border-border bg-white p-5 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-end gap-3"
      >
        <div className="flex-1">
          <label className="block text-xs font-bold text-ink mb-1.5">
            Добавить нового гида
          </label>
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Введите имя гида (например: Карен)"
            className={inputCls}
          />
        </div>
        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-2.5 font-bold text-white transition-colors hover:bg-primary-dark cursor-pointer text-sm whitespace-nowrap shadow-sm"
        >
          + Добавить гида
        </button>
      </form>

      {/* Guides Grid / List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {guides.map((guide, idx) => (
          <div
            key={guide.id || idx}
            className="rounded-2xl border border-border bg-white p-4 shadow-sm hover:border-gray-400 transition-all flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center font-black text-primary text-sm shrink-0">
                {guide.name ? guide.name.charAt(0).toUpperCase() : "G"}
              </div>
              <div className="flex-1 min-w-0">
                <input
                  type="text"
                  value={guide.name}
                  onChange={(e) => updateGuide(guide.id, e.target.value)}
                  className="w-full font-bold text-sm text-ink bg-transparent border-b border-transparent hover:border-gray-300 focus:border-primary focus:outline-none px-1 py-0.5 rounded transition-colors"
                  title="Нажмите, чтобы отредактировать имя"
                />
                <span className="block text-[10px] text-muted px-1">Лицензированный гид</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => deleteGuide(guide.id, guide.name)}
              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors cursor-pointer shrink-0"
              title={`Удалить ${guide.name}`}
              aria-label={`Удалить ${guide.name}`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <SaveBar onSave={onSave} label="Опубликовать список гидов на сайте" />
    </div>
  );
}

/* ---------- Attractions Tab ---------- */

const REGION_OPTIONS: { id: RegionCategory; label: string }[] = [
  { id: "near_yerevan", label: "Рядом с Ереваном" },
  { id: "sevan_dilijan", label: "Севан & Дилижан" },
  { id: "south", label: "Юг (Вайоц Дзор & Сюник)" },
  { id: "north_lori", label: "Север и Лори" },
];

function AttractionsTab({
  attractions,
  onChange,
  onSave,
}: {
  attractions: Attraction[];
  onChange: (attractions: Attraction[]) => void;
  onSave: () => void;
}) {
  const [openId, setOpenId] = useState<string | null>(null);
  const [loc, setLoc] = useState<Locale>("ru");
  const [filterRegion, setFilterRegion] = useState<"all" | RegionCategory>("all");
  const [query, setQuery] = useState("");

  const needle = query.trim().toLocaleLowerCase();
  const visible = attractions.filter((a) => {
    if (filterRegion !== "all" && a.regionCategory !== filterRegion) return false;
    if (!needle) return true;
    return (["ru", "hy", "en"] as const).some((l) =>
      (a.name?.[l] ?? "").toLocaleLowerCase().includes(needle) ||
      (a.tagline?.[l] ?? "").toLocaleLowerCase().includes(needle) ||
      (a.id ?? "").toLocaleLowerCase().includes(needle)
    );
  });

  function update(index: number, patch: Partial<Attraction>) {
    onChange(attractions.map((a, i) => (i === index ? { ...a, ...patch } : a)));
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= attractions.length) return;
    const next = [...attractions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addAttraction() {
    const id = `attraction-${Date.now()}`;
    const empty = { ru: "", hy: "", en: "" };
    const newAttraction: Attraction = {
      id,
      name: { ru: "Новое место", hy: "Նոր վայր", en: "New Place" },
      tagline: { ...empty },
      regionCategory: "near_yerevan",
      region: { ...empty },
      distance: { ru: "0 км от Еревана", hy: "0 կմ Երևանից", en: "0 km from Yerevan" },
      travelTime: { ru: "0 минут", hy: "0 րոպե", en: "0 mins" },
      image: "/images/hero-mountain-road.jpg",
      unesco: false,
      highlights: { ru: [], hy: [], en: [] },
      shortDescription: { ...empty },
      fullStory: { ...empty },
      tourQuery: "",
    };
    onChange([newAttraction, ...attractions]);
    setOpenId(id);
  }

  function removeAttraction(id: string) {
    onChange(attractions.filter((a) => a.id !== id));
    if (openId === id) setOpenId(null);
  }

  return (
    <div className="space-y-6">
      {/* Header and Add button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-black text-ink">Что посмотреть в Армении</h2>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
              Всего: {attractions.length}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted">
            Управляйте путеводителем по достопримечательностям и историческим местам. Добавляйте описания, историю, фото и время в пути.
          </p>
        </div>

        <button
          type="button"
          onClick={addAttraction}
          className="shrink-0 rounded-full bg-primary px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark cursor-pointer shadow-sm"
        >
          + Добавить новое место
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 rounded-2xl border border-border bg-white p-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setFilterRegion("all")}
            className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
              filterRegion === "all" ? "bg-primary text-white" : "text-muted hover:bg-gray-100"
            }`}
          >
            Все ({attractions.length})
          </button>
          {REGION_OPTIONS.map((r) => {
            const count = attractions.filter((a) => a.regionCategory === r.id).length;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setFilterRegion(r.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                  filterRegion === r.id ? "bg-primary text-white" : "text-muted hover:bg-gray-100"
                }`}
              >
                {r.label} ({count})
              </button>
            );
          })}
        </div>

        <div className="w-full md:w-64">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Поиск по названию…"
            className="w-full rounded-full border border-black/10 bg-gray-50 px-3.5 py-1.5 text-xs outline-none focus:border-primary focus:bg-white"
          />
        </div>
      </div>

      {/* Attractions List */}
      <div className="space-y-3">
        {visible.map((attraction) => {
          const actualIndex = attractions.findIndex((a) => a.id === attraction.id);
          const isOpen = openId === attraction.id;

          return (
            <div
              key={attraction.id}
              className={`rounded-2xl border bg-white transition-all shadow-sm ${
                isOpen ? "border-primary ring-1 ring-primary/20" : "border-border hover:border-gray-400"
              }`}
            >
              {/* Row Summary Card */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4">
                <div
                  className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer"
                  onClick={() => setOpenId(isOpen ? null : attraction.id)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 border border-black/5">
                    {attraction.image ? (
                      <Image
                        src={attraction.image}
                        alt={attraction.name.ru || "Attraction"}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] text-muted">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-ink truncate">
                        {attraction.name.ru || attraction.name.en || attraction.id}
                      </h4>
                      {attraction.unesco && (
                        <span className="shrink-0 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-200">
                          UNESCO
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted truncate mt-0.5">
                      {attraction.tagline.ru || attraction.tagline.en || "—"}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-muted/80 mt-1">
                      <span>{attraction.region.ru || "Армения"}</span>
                      <span>•</span>
                      <span>{attraction.distance.ru || "—"}</span>
                      <span>•</span>
                      <span>{attraction.travelTime.ru || "—"}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-black/5">
                  {/* Reorder Buttons */}
                  <div className="flex items-center rounded-lg border border-black/10 bg-gray-50 p-0.5">
                    <button
                      type="button"
                      disabled={actualIndex === 0}
                      onClick={() => move(actualIndex, -1)}
                      title="Поднять выше"
                      className="rounded p-1 text-xs text-muted hover:bg-white hover:text-ink disabled:opacity-30 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={actualIndex === attractions.length - 1}
                      onClick={() => move(actualIndex, 1)}
                      title="Опустить ниже"
                      className="rounded p-1 text-xs text-muted hover:bg-white hover:text-ink disabled:opacity-30 cursor-pointer"
                    >
                      ▼
                    </button>
                  </div>

                  {/* Edit Toggle */}
                  <button
                    type="button"
                    onClick={() => setOpenId(isOpen ? null : attraction.id)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      isOpen
                        ? "bg-primary text-white"
                        : "border border-black/15 bg-white text-ink hover:border-primary hover:text-primary"
                    }`}
                  >
                    {isOpen ? "Свернуть" : "Редактировать"}
                  </button>

                  {/* Delete */}
                  <DeleteButton
                    label="Удалить"
                    onDelete={() => removeAttraction(attraction.id)}
                  />
                </div>
              </div>

              {/* Expanded Edit Form */}
              {isOpen && (
                <div className="border-t border-border bg-[#FAFAF8] p-5 sm:p-6 rounded-b-2xl space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/10 pb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-muted">Язык для редактирования:</span>
                      <LocaleTabs active={loc} onChange={setLoc} />
                    </div>
                    <div className="text-xs text-muted">
                      ID: <code className="bg-black/5 px-2 py-0.5 rounded font-mono">{attraction.id}</code>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label={`Название места (${localeNames[loc]})`}>
                      <TextInput
                        value={attraction.name[loc] ?? ""}
                        onChange={(v) =>
                          update(actualIndex, {
                            name: { ...attraction.name, [loc]: v },
                          })
                        }
                        placeholder="Например: Хор Вирап"
                      />
                    </Field>

                    <Field label={`Слоган / Короткое описание (${localeNames[loc]})`}>
                      <TextInput
                        value={attraction.tagline[loc] ?? ""}
                        onChange={(v) =>
                          update(actualIndex, {
                            tagline: { ...attraction.tagline, [loc]: v },
                          })
                        }
                        placeholder="Например: Святыня у подножия Арарата"
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Категория региона">
                      <select
                        value={attraction.regionCategory}
                        onChange={(e) =>
                          update(actualIndex, {
                            regionCategory: e.target.value as RegionCategory,
                          })
                        }
                        className={inputCls}
                      >
                        {REGION_OPTIONS.map((r) => (
                          <option key={r.id} value={r.id}>
                            {r.label}
                          </option>
                        ))}
                      </select>
                    </Field>

                    <Field label={`Область / Регион (${localeNames[loc]})`}>
                      <TextInput
                        value={attraction.region[loc] ?? ""}
                        onChange={(v) =>
                          update(actualIndex, {
                            region: { ...attraction.region, [loc]: v },
                          })
                        }
                        placeholder="Например: Араратская область, Армения"
                      />
                    </Field>

                    <Field label="Статус ЮНЕСКО">
                      <label className="mt-2.5 flex items-center gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={attraction.unesco}
                          onChange={(e) =>
                            update(actualIndex, { unesco: e.target.checked })
                          }
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-xs font-bold text-ink">
                          Объект всемирного наследия ЮНЕСКО
                        </span>
                      </label>
                    </Field>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label={`Расстояние от Еревана (${localeNames[loc]})`}>
                      <TextInput
                        value={attraction.distance[loc] ?? ""}
                        onChange={(v) =>
                          update(actualIndex, {
                            distance: { ...attraction.distance, [loc]: v },
                          })
                        }
                        placeholder="Например: около 40 км"
                      />
                    </Field>

                    <Field label={`Время в пути (${localeNames[loc]})`}>
                      <TextInput
                        value={attraction.travelTime[loc] ?? ""}
                        onChange={(v) =>
                          update(actualIndex, {
                            travelTime: { ...attraction.travelTime, [loc]: v },
                          })
                        }
                        placeholder="Например: около 45–50 минут"
                      />
                    </Field>

                    <Field label="Поиск для бронирования экскурсии (tourQuery)">
                      <TextInput
                        value={attraction.tourQuery ?? ""}
                        onChange={(v) => update(actualIndex, { tourQuery: v })}
                        placeholder="Например: Хор Вирап"
                      />
                    </Field>
                  </div>

                  <Field label="Фотография места">
                    <ImagePicker
                      value={attraction.image}
                      onChange={(url) => update(actualIndex, { image: url })}
                    />
                  </Field>

                  <Field label={`Краткое описание для карточки (${localeNames[loc]})`}>
                    <AutoTextarea
                      value={attraction.shortDescription[loc] ?? ""}
                      onChange={(v) =>
                        update(actualIndex, {
                          shortDescription: { ...attraction.shortDescription, [loc]: v },
                        })
                      }
                    />
                  </Field>

                  <Field label={`Ключевые особенности / Highlights (${localeNames[loc]}) — по одной на строку`}>
                    <AutoTextarea
                      value={(attraction.highlights[loc] ?? []).join("\n")}
                      onChange={(v) =>
                        update(actualIndex, {
                          highlights: {
                            ...attraction.highlights,
                            [loc]: v.split("\n").map((s) => s.trim()).filter(Boolean),
                          },
                        })
                      }
                    />
                  </Field>

                  <Field label={`Полная история и факты для модального окна (${localeNames[loc]})`}>
                    <AutoTextarea
                      value={attraction.fullStory[loc] ?? ""}
                      onChange={(v) =>
                        update(actualIndex, {
                          fullStory: { ...attraction.fullStory, [loc]: v },
                        })
                      }
                    />
                  </Field>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <SaveBar onSave={onSave} label="Опубликовать изменения мест на сайте" />
    </div>
  );
}



