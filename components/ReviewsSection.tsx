"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/lib/reviews";
import { getReviewText } from "@/lib/reviews";
import type { Guide } from "@/lib/guides";
import { defaultGuides } from "@/lib/guides";

type Props = {
  initialReviews: Review[];
  locale: Locale;
  guides?: Guide[];
};

export default function ReviewsSection({ initialReviews, locale, guides }: Props) {
  const guideList = guides && guides.length ? guides : defaultGuides;
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  // Sync latest reviews from API and client storage
  useEffect(() => {
    // 1. Read any recent reviews submitted by this client from localStorage
    try {
      const stored = localStorage.getItem("amaras_recent_reviews");
      if (stored) {
        const parsed: Review[] = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setReviews((prev) => {
            const map = new Map<string, Review>();
            parsed.forEach((r) => map.set(r.id, r));
            prev.forEach((r) => {
              if (!map.has(r.id)) map.set(r.id, r);
            });
            return Array.from(map.values());
          });
        }
      }
    } catch {}

    // 2. Fetch fresh approved reviews from the server
    fetch("/api/reviews", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setReviews((prev) => {
            const map = new Map<string, Review>();
            data.reviews.forEach((r: Review) => map.set(r.id, r));
            prev.forEach((r) => {
              if (!map.has(r.id)) map.set(r.id, r);
            });
            return Array.from(map.values());
          });
        }
      })
      .catch(() => {});
  }, []);

  // Lock body scroll when modal is open to eliminate background page jitter
  useEffect(() => {
    if (modalOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [modalOpen]);

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  // Form state
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [tourTitle, setTourTitle] = useState("");
  const [guideName, setGuideName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const texts = {
    ru: {
      badge: "5.0 • ОТЗЫВЫ ГОСТЕЙ",
      title: "Что говорят о поездках с AMARAS",
      subtitle:
        "Искренние впечатления путешественников, открывших для себя Армению вместе с нашими гидами и водителями.",
      writeBtn: "Оставить свой отзыв",
      verified: "Проверенный гость",
      justNow: "Только что",
      modalTitle: "Оставить отзыв о поездке",
      modalSub:
        "Поделитесь вашими впечатлениями! Отзыв сразу появится на сайте.",
      nameLabel: "Ваше имя и фамилия *",
      namePlaceholder: "Например: Анна Смирнова",
      cityLabel: "Ваш город или страна",
      cityPlaceholder: "Например: Москва, Сочи, Тбилиси",
      tourLabel: "Какой тур или места вы посетили?",
      tourPlaceholder: "Например: Озеро Севан и Дилижан / Джип-тур",
      guideLabel: "Имя вашего гида (если хотите отметить)",
      guidePlaceholder: "Например: Армен, Давид, Ашот",
      guideBadge: "Гид",
      ratingLabel: "Ваша оценка",
      textLabel: "Ваш отзыв *",
      textPlaceholder:
        "Расскажите о впечатлениях: как прошла поездка, работа гида и водителя, что больше всего запомнилось...",
      cancel: "Отмена",
      submit: "Отправить отзыв",
      submitting: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successMsg:
        "Ваш отзыв опубликован и уже доступен на сайте! Благодарим за доверие к AMARAS.",
      close: "Понятно",
      swipeHint: "← Листайте отзывы →",
      reviewsCount: "отзывов гостей",
    },
    hy: {
      badge: "5.0 • ՀՅՈՒՐԵՐԻ ԿԱՐԾԻՔՆԵՐԸ",
      title: "Ի՞նչ են ասում AMARAS-ի մասին",
      subtitle:
        "Անկեղծ տպավորություններ ճամփորդներից, ովքեր բացահայտել են Հայաստանը մեր գիդերի և վարորդների հետ։",
      writeBtn: "Գրել կարծիք",
      verified: "Հաստատված հյուր",
      justNow: "Հենց նոր",
      modalTitle: "Գրել կարծիք ճամփորդության մասին",
      modalSub:
        "Կիսվեք ձեր տպավորություններով։ Կարծիքն անմիջապես կհրապարակվի կայքում։",
      nameLabel: "Ձեր անունը *",
      namePlaceholder: "Օրինակ՝ Արմեն Կ.",
      cityLabel: "Ձեր քաղաքը կամ երկիրը",
      cityPlaceholder: "Օրինակ՝ Երևան, Գլենդել, Մոսկվա",
      tourLabel: "Ո՞ր տուրն եք այցելել",
      tourPlaceholder: "Օրինակ՝ Սևան և Դիլիջան / Ջիպ-տուր",
      guideLabel: "Ձեր գիդի անունը (ըստ ցանկության)",
      guidePlaceholder: "Օրինակ՝ Արմեն, Դավիթ, Աշոտ",
      guideBadge: "Գիդ",
      ratingLabel: "Ձեր գնահատականը",
      textLabel: "Ձեր կարծիքը *",
      textPlaceholder:
        "Պատմեք տպավորությունների մասին՝ ինչպե՞ս անցավ ուղևորությունը, ինչն ամենաշատը դուր եկավ...",
      cancel: "Չեղարկել",
      submit: "Ուղարկել կարծիքը",
      submitting: "Ուղարկվում է...",
      successTitle: "Շնորհակալությո՛ւն կարծիքի համար",
      successMsg:
        "Ձեր կարծիքը հրապարակված է և արդեն հասանելի է կայքում։ Շնորհակալություն AMARAS-ին վստահելու համար։",
      close: "Փակել",
      swipeHint: "← Թերթեք կարծիքները →",
      reviewsCount: "հյուրերի կարծիք",
    },
    en: {
      badge: "5.0 • TRAVELER REVIEWS",
      title: "What Travelers Say About AMARAS",
      subtitle:
        "Genuine reviews and stories from guests who explored Armenia with our professional team.",
      writeBtn: "Write a Review",
      verified: "Verified Traveler",
      justNow: "Just now",
      modalTitle: "Leave a Review",
      modalSub:
        "Share your experience! Your review will immediately appear on the site.",
      nameLabel: "Your Name *",
      namePlaceholder: "e.g. John Doe",
      cityLabel: "Your City or Country",
      cityPlaceholder: "e.g. London, New York, Berlin",
      tourLabel: "Tour or destinations visited",
      tourPlaceholder: "e.g. Lake Sevan & Dilijan / 4x4 Jeep Expedition",
      guideLabel: "Your guide's name (optional)",
      guidePlaceholder: "e.g. Armen, David, Ashot",
      guideBadge: "Guide",
      ratingLabel: "Your Rating",
      textLabel: "Your Review *",
      textPlaceholder:
        "Tell us about your experience: the guide, driver, scenic spots, and trip highlights...",
      cancel: "Cancel",
      submit: "Submit Review",
      submitting: "Submitting...",
      successTitle: "Thank you for your review!",
      successMsg:
        "Your review is published and now live on the site! Thank you for choosing AMARAS.",
      close: "Got it",
      swipeHint: "← Swipe reviews →",
      reviewsCount: "traveler reviews",
    },
  }[locale];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author,
          location,
          tourTitle,
          guideName,
          rating,
          text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      const createdReview: Review = data.review || {
        id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        author: author.trim(),
        location: location.trim(),
        tourTitle: tourTitle.trim(),
        guideName: guideName.trim(),
        rating,
        text: text.trim(),
        date: new Date().toISOString().split("T")[0],
        approved: true,
        createdAt: new Date().toISOString(),
      };

      // 1. Immediately prepend to local state so user sees it right away
      setReviews((prev) => [
        createdReview,
        ...prev.filter((r) => r.id !== createdReview.id),
      ]);

      // 2. Persist in localStorage so it remains visible even if user reloads
      try {
        const stored = localStorage.getItem("amaras_recent_reviews");
        const list: Review[] = stored ? JSON.parse(stored) : [];
        localStorage.setItem(
          "amaras_recent_reviews",
          JSON.stringify([
            createdReview,
            ...list.filter((r) => r.id !== createdReview.id),
          ].slice(0, 10))
        );
      } catch {}

      setSuccess(true);
      // Reset form fields
      setAuthor("");
      setLocation("");
      setTourTitle("");
      setGuideName("");
      setRating(5);
      setText("");

      // Smooth scroll carousel to beginning to showcase the new review
      setTimeout(() => {
        if (sliderRef.current) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        }
      }, 300);
    } catch (err: any) {
      setErrorMsg(err.message || "Error submitting review");
    } finally {
      setSubmitting(false);
    }
  }

  function handleCloseModal() {
    setModalOpen(false);
    setSuccess(false);
    setErrorMsg("");
  }

  return (
    <section className="bg-[#312F2F] py-12 sm:py-20 text-[#FCFCF7] overflow-hidden" id="reviews">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
              {texts.badge}
            </span>
            <h2 className="mt-3 font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FCFCF7]">
              {texts.title}
            </h2>
            <p className="mt-2.5 sm:mt-3 max-w-2xl text-xs sm:text-base leading-relaxed text-[#FCFCF7]/80">
              {texts.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#C7FF32] px-5 py-3 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 transition-all hover:bg-[#bbf028] hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{texts.writeBtn}</span>
            </button>

            {/* Left / Right Carousel Controls (desktop only) */}
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={scrollLeft}
                aria-label="Previous reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F] active:scale-95 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollRight}
                aria-label="Next reviews"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F] active:scale-95 cursor-pointer"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Horizontal Slider: No scroll-smooth on container to eliminate touch/snap jitter */}
        <div
          ref={sliderRef}
          className="mt-8 sm:mt-10 flex gap-4 sm:gap-5 overflow-x-auto snap-x snap-mandatory pb-4 pt-2 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:px-0 overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden items-stretch"
        >
          {reviews.map((rev) => {
            const reviewContent = getReviewText(rev.text, locale);
            return (
              <div
                key={rev.id}
                className="group relative flex w-[85vw] sm:w-[360px] md:w-[380px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-white/10 bg-[#242323] p-5 sm:p-7 shadow-lg transition-colors duration-200 hover:border-[#C7FF32]/40 hover:bg-[#282727] select-none min-h-[300px] sm:min-h-[320px]"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3 sm:pb-4">
                    <div className="flex items-center gap-1 text-[#C7FF32]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-base ${
                            star <= rev.rating ? "opacity-100" : "opacity-30 text-white/40"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1 text-xs font-bold text-white/80">
                        {rev.rating}.0
                      </span>
                    </div>

                    <span className="flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-[#C7FF32]/90 border border-white/10">
                      <span>✓</span>
                      <span>{texts.verified}</span>
                    </span>
                  </div>

                  {/* Tour visited and Guide pills if present */}
                  {(rev.tourTitle || rev.guideName) && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      {rev.tourTitle && (
                        <span className="inline-block rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#586EFF] max-w-full truncate">
                          {rev.tourTitle}
                        </span>
                      )}
                      {rev.guideName && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-2.5 py-1 text-xs font-bold text-[#C7FF32]">
                          <span className="text-white/60 font-normal">{texts.guideBadge}:</span>
                          <span>{rev.guideName}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="mt-3.5 sm:mt-4 text-xs sm:text-sm leading-relaxed text-[#FCFCF7]/90 font-normal break-words line-clamp-6">
                    “{reviewContent}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-5 sm:mt-6 flex items-center justify-between border-t border-white/10 pt-3.5 sm:pt-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF] font-black text-xs sm:text-sm text-white shadow-md">
                      {rev.author ? rev.author.charAt(0).toUpperCase() : "G"}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs sm:text-sm font-bold text-white truncate">
                        {rev.author}
                      </span>
                      {rev.location && (
                        <span className="block text-[11px] sm:text-xs text-white/60 truncate">
                          {rev.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.date && (
                    <span className="text-[10px] sm:text-[11px] font-medium text-white/40 shrink-0 ml-2">
                      {rev.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel swipe guidance indicator */}
        <div className="mt-4 flex items-center justify-between text-xs text-[#FCFCF7]/50 px-1">
          <span>{texts.swipeHint}</span>
          <span>{reviews.length} {texts.reviewsCount}</span>
        </div>
      </div>

      {/* Review Submission Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#242323] p-5 sm:p-7 text-[#FCFCF7] shadow-2xl overscroll-contain"
            >
              {success ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#C7FF32]/20 text-3xl text-[#C7FF32]">
                    ✓
                  </div>
                  <h3 className="mt-4 text-xl sm:text-2xl font-black text-white">
                    {texts.successTitle}
                  </h3>
                  <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[#FCFCF7]/80">
                    {texts.successMsg}
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-6 inline-flex rounded-full bg-[#586EFF] px-8 py-3 text-xs sm:text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#475be6] cursor-pointer"
                  >
                    {texts.close}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-black text-white">
                        {texts.modalTitle}
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-[#FCFCF7]/70">
                        {texts.modalSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      aria-label="Close"
                      className="rounded-full p-1.5 text-white/50 hover:bg-white/10 hover:text-white cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                        {texts.ratingLabel}
                      </label>
                      <div className="mt-1 flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-2xl transition-transform active:scale-110 focus:outline-none cursor-pointer"
                          >
                            <span
                              className={
                                star <= rating
                                  ? "text-[#C7FF32]"
                                  : "text-white/20 hover:text-[#C7FF32]/60"
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="ml-2 text-xs sm:text-sm font-bold text-[#C7FF32]">
                          {rating} / 5
                        </span>
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80">
                        {texts.nameLabel}
                      </label>
                      <input
                        type="text"
                        required
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder={texts.namePlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Location */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80">
                        {texts.cityLabel}
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={texts.cityPlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Tour title */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80">
                        {texts.tourLabel}
                      </label>
                      <input
                        type="text"
                        value={tourTitle}
                        onChange={(e) => setTourTitle(e.target.value)}
                        placeholder={texts.tourPlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Guide Name */}
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-semibold text-white/80">
                          {texts.guideLabel}
                        </label>
                        {guideList.length > 0 && (
                          <span className="text-[10px] text-white/50">
                            {locale === "ru" ? "выберите или напишите" : locale === "hy" ? "ընտրեք կամ գրեք" : "select or type"}
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        list="home-review-guides-list"
                        value={guideName}
                        onChange={(e) => setGuideName(e.target.value)}
                        placeholder={texts.guidePlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                      {guideList.length > 0 && (
                        <>
                          <datalist id="home-review-guides-list">
                            {guideList.map((g) => (
                              <option key={g.id || g.name} value={g.name} />
                            ))}
                          </datalist>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {guideList.map((g) => (
                              <button
                                key={g.id || g.name}
                                type="button"
                                onClick={() => setGuideName(guideName === g.name ? "" : g.name)}
                                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all cursor-pointer ${
                                  guideName === g.name
                                    ? "bg-[#C7FF32] text-[#312F2F] font-bold shadow-sm"
                                    : "bg-white/10 text-white/80 hover:bg-white/20 hover:text-white"
                                }`}
                              >
                                {g.name}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80">
                        {texts.textLabel}
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={texts.textPlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:bg-white/10 cursor-pointer"
                      >
                        {texts.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[#C7FF32] px-6 py-2.5 text-xs font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-all hover:bg-[#bbf028] disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? texts.submitting : texts.submit}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
