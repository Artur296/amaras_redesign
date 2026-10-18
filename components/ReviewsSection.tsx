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
  const [reviews, setReviews] = useState<Review[]>(() =>
    (initialReviews || []).filter((r) => r.approved === true)
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  // Sync latest approved reviews from API
  useEffect(() => {
    let active = true;

    async function syncReviews() {
      try {
        localStorage.removeItem("amaras_recent_reviews");
      } catch {}

      try {
        const res = await fetch("/api/reviews", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (data && Array.isArray(data.reviews) && active) {
            const list = data.reviews.filter((r: Review) => r.approved === true);
            list.sort((a: Review, b: Review) => {
              const tA = a.createdAt ? new Date(a.createdAt).getTime() : new Date(a.date || 0).getTime();
              const tB = b.createdAt ? new Date(b.createdAt).getTime() : new Date(b.date || 0).getTime();
              return tB - tA;
            });
            setReviews(list);
          }
        }
      } catch {}
    }

    syncReviews();
    return () => {
      active = false;
    };
  }, []);

  // Lock body scroll when modal is open
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
      sliderRef.current.scrollBy({ left: -440, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 440, behavior: "smooth" });
    }
  };

  // Mouse drag scrolling handlers for desktop
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;
    isDraggingRef.current = true;
    startXRef.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeftRef.current = sliderRef.current.scrollLeft;
  };

  const handleMouseLeaveOrUp = () => {
    isDraggingRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeftRef.current - walk;
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
        "Поделитесь вашими впечатлениями! Отзыв появится на сайте после быстрой проверки администратором.",
      nameLabel: "Ваше имя *",
      namePlaceholder: "Например: Михаил С.",
      cityLabel: "Город или страна",
      cityPlaceholder: "Например: Москва, Санкт-Петербург, Сочи",
      tourLabel: "Какой тур вы посетили?",
      tourPlaceholder: "Например: Севан и Дилижан / Джип-тур на Аждаак",
      guideLabel: "Имя вашего гида (если запомнили)",
      guidePlaceholder: "Например: Армен, Давид, Ашот",
      guideBadge: "Гид",
      ratingLabel: "Ваша оценка",
      textLabel: "Ваш отзыв *",
      textPlaceholder:
        "Расскажите, как прошла поездка: работа гида, пунктуальность, комфорт машины и самые яркие моменты...",
      cancel: "Отмена",
      submit: "Отправить отзыв на модерацию",
      submitting: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successMsg:
        "Ваш отзыв успешно отправлен на проверку и появится на сайте после одобрения администратором. Благодарим за доверие к AMARAS!",
      close: "Понятно",
      swipeHint: "← Листайте отзывы вправо и влево →",
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
        "Կիսվեք ձեր տպավորություններով։ Կարծիքը կհրապարակվի կայքում ադմինիստրատորի հաստատումից հետո։",
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
        "Ձեր կարծիքն ուղարկվել է ստուգման և կհրապարակվի ադմինիստրատորի հաստատումից հետո։ Շնորհակալություն AMARAS-ին վստահելու համար:",
      close: "Փակել",
      swipeHint: "← Թերթեք կարծիքները աջ և ձախ →",
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
        "Share your experience! Your review will appear on the site once approved by an admin.",
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
        "Your review has been submitted for moderation and will appear on the site after admin approval. Thank you for choosing AMARAS!",
      close: "Got it",
      swipeHint: "← Swipe reviews left and right →",
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

      setSuccess(true);
      setAuthor("");
      setLocation("");
      setTourTitle("");
      setGuideName("");
      setRating(5);
      setText("");
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit review");
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
    <section className="bg-[#312F2F] py-12 sm:py-20 text-[#FCFCF7] overflow-hidden w-full" id="reviews">
      {/* 1. Header Container (Constrained for neat layout) */}
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
              {texts.badge}
            </span>
            <h2 className="mt-3 font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#FCFCF7]">
              {texts.title}
            </h2>
            <p className="mt-2.5 sm:mt-3 max-w-2xl text-sm sm:text-base lg:text-lg leading-relaxed text-[#FCFCF7]/85">
              {texts.subtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-[#C7FF32] px-6 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 transition-all hover:bg-[#bbf028] hover:scale-105 active:scale-95 w-full sm:w-auto cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              <span>{texts.writeBtn}</span>
            </button>

            {/* Left / Right Carousel Controls */}
            <div className="flex items-center justify-end gap-2">
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
      </div>

      {/* 2. FULL-WIDTH SCREEN SLIDER (Edge-to-edge scrollable / swipeable track with safe padding) */}
      <div className="w-full mt-8 sm:mt-12 overflow-hidden">
        <div
          ref={sliderRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeaveOrUp}
          onMouseUp={handleMouseLeaveOrUp}
          onMouseMove={handleMouseMove}
          className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth px-5 sm:px-8 lg:px-12 xl:px-16 pb-6 pt-2 overscroll-x-contain touch-pan-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden items-stretch cursor-grab active:cursor-grabbing select-none"
        >
          {reviews.map((rev) => {
            const reviewContent = getReviewText(rev.text, locale);
            return (
              <div
                key={rev.id}
                className="group relative flex w-[calc(100vw-56px)] max-w-[340px] sm:max-w-none sm:w-[420px] md:w-[460px] lg:w-[480px] shrink-0 snap-start flex-col justify-between rounded-3xl border border-white/10 bg-[#242323] p-5 sm:p-8 shadow-xl transition-all duration-200 hover:border-[#C7FF32]/40 hover:bg-[#282727] min-h-[320px] sm:min-h-[340px]"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-1.5 text-[#C7FF32]">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          className={`text-lg sm:text-xl ${
                            star <= rev.rating ? "opacity-100" : "opacity-30 text-white/40"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="ml-1.5 text-sm sm:text-base font-bold text-white/90">
                        {rev.rating}.0
                      </span>
                    </div>

                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1 text-xs sm:text-sm font-bold text-[#C7FF32] border border-white/10">
                      <span>✓</span>
                      <span>{texts.verified}</span>
                    </span>
                  </div>

                  {/* Tour visited and Guide pills */}
                  {(rev.tourTitle || rev.guideName) && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {rev.tourTitle && (
                        <span className="inline-block rounded-lg bg-white/5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#586EFF] max-w-full truncate border border-white/5">
                          {rev.tourTitle}
                        </span>
                      )}
                      {rev.guideName && (
                        <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-3 py-1.5 text-xs sm:text-sm font-bold text-[#C7FF32]">
                          <span className="text-white/60 font-normal">{texts.guideBadge}:</span>
                          <span>{rev.guideName}</span>
                        </span>
                      )}
                    </div>
                  )}

                  {/* Review Text: Full review display with large high-contrast readable font */}
                  <p className="mt-4 text-base sm:text-lg leading-relaxed text-white font-normal break-words whitespace-pre-line">
                    “{reviewContent}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#586EFF] font-black text-base text-white shadow-md">
                      {rev.author ? rev.author.charAt(0).toUpperCase() : "G"}
                    </div>
                    <div className="min-w-0">
                      <span className="block text-base sm:text-lg font-bold text-white truncate">
                        {rev.author}
                      </span>
                      {rev.location && (
                        <span className="block text-xs sm:text-sm text-white/80 font-medium truncate">
                          {rev.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.date && (
                    <span className="text-xs sm:text-sm font-medium text-white/60 shrink-0 ml-2">
                      {rev.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Carousel swipe guidance indicator */}
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12 mt-4 flex items-center justify-between text-sm sm:text-base text-[#FCFCF7]/75">
          <span>{texts.swipeHint}</span>
          <span className="font-bold text-white">{reviews.length} {texts.reviewsCount}</span>
        </div>
      </div>

      {/* Review Submission Modal Dialog */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="relative z-10 w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border border-white/15 bg-[#242323] p-5 sm:p-8 text-[#FCFCF7] shadow-2xl overscroll-contain"
            >
              {success ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C7FF32]/20 text-3xl text-[#C7FF32] border border-[#C7FF32]/40">
                    ✓
                  </div>
                  <h3 className="mt-4 text-2xl sm:text-3xl font-black text-white">
                    {texts.successTitle}
                  </h3>
                  <p className="mt-3 text-sm sm:text-base leading-relaxed text-[#FCFCF7]/85">
                    {texts.successMsg}
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-6 w-full rounded-full bg-[#C7FF32] px-6 py-3.5 text-sm sm:text-base font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-all hover:bg-[#bbf028] cursor-pointer"
                  >
                    {texts.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        {texts.modalTitle}
                      </h3>
                      <p className="mt-1 text-xs sm:text-sm text-[#FCFCF7]/70">
                        {texts.modalSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-full bg-white/5 p-2 text-white/60 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                      aria-label="Close"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1.5">
                      {texts.ratingLabel}
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`text-2xl sm:text-3xl transition-transform hover:scale-120 cursor-pointer ${
                            star <= rating ? "text-[#C7FF32]" : "text-white/20"
                          }`}
                        >
                          ★
                        </button>
                      ))}
                      <span className="ml-2 text-sm sm:text-base font-bold text-[#C7FF32]">
                        {rating}.0
                      </span>
                    </div>
                  </div>

                  {/* Author Name */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">
                      {texts.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder={texts.namePlaceholder}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* City or Country */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">
                      {texts.cityLabel}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={texts.cityPlaceholder}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Tour Visited */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">
                      {texts.tourLabel}
                    </label>
                    <input
                      type="text"
                      value={tourTitle}
                      onChange={(e) => setTourTitle(e.target.value)}
                      placeholder={texts.tourPlaceholder}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                    />
                  </div>

                  {/* Guide Selection */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">
                      {texts.guideLabel}
                    </label>
                    <select
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      className="w-full rounded-xl border border-white/15 bg-[#1F1E1E] px-4 py-3 text-sm sm:text-base text-white focus:border-[#C7FF32] focus:outline-none transition-colors"
                    >
                      <option value="">-- Выберите гида (или пропустите) --</option>
                      {guideList.map((g) => (
                        <option key={g.name} value={g.name}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white/90 mb-1">
                      {texts.textLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={texts.textPlaceholder}
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  {errorMsg && (
                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs sm:text-sm text-red-300">
                      {errorMsg}
                    </div>
                  )}

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="rounded-full border border-white/20 px-5 py-2.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {texts.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="rounded-full bg-[#C7FF32] px-6 py-2.5 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg hover:bg-[#bbf028] disabled:opacity-50 transition-all cursor-pointer"
                    >
                      {submitting ? texts.submitting : texts.submit}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
