"use client";

import { useState, useEffect, useRef } from "react";
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
  const [slideState, setSlideState] = useState({ index: 0, direction: 1 });
  const { index: activeIndex, direction } = slideState;

  const scrollNext = () => {
    if (activeIndex < reviews.length - 1) {
      setSlideState({ index: activeIndex + 1, direction: 1 });
    }
  };

  const scrollPrev = () => {
    if (activeIndex > 0) {
      setSlideState({ index: activeIndex - 1, direction: -1 });
    }
  };

  // Touch swipe support (finger flick) without blocking vertical scrolling
  const touchStartXRef = useRef(0);
  const touchStartYRef = useRef(0);
  const touchDeltaXRef = useRef(0);
  const touchDeltaYRef = useRef(0);
  const isTouchingRef = useRef(false);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    if (e.touches.length === 1) {
      isTouchingRef.current = true;
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
      touchDeltaXRef.current = 0;
      touchDeltaYRef.current = 0;
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isTouchingRef.current) return;
    if (e.touches.length === 1) {
      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const dx = currentX - touchStartXRef.current;
      const dy = currentY - touchStartYRef.current;
      touchDeltaXRef.current = dx;
      touchDeltaYRef.current = dy;

      // If predominantly vertical scroll, cancel swipe detection so page scrolls naturally
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 15) {
        isTouchingRef.current = false;
      }
    }
  };

  const handleTouchEnd = () => {
    if (!isTouchingRef.current) return;
    isTouchingRef.current = false;
    const dx = touchDeltaXRef.current;
    const dy = touchDeltaYRef.current;

    // Trigger on deliberate horizontal swipe (35px+)
    if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
    }
  };

  // Mouse drag support for desktop
  const isMouseDownRef = useRef(false);
  const mouseStartXRef = useRef(0);
  const mouseStartYRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    if ((e.target as HTMLElement).closest("button, a, input, textarea")) return;
    isMouseDownRef.current = true;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    isMouseDownRef.current = false;
    const dx = e.clientX - mouseStartXRef.current;
    const dy = e.clientY - mouseStartYRef.current;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        scrollNext();
      } else {
        scrollPrev();
      }
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
      swipeHint: "Листайте отзывы свайпом или стрелками",
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
      swipeHint: "Թերթեք կարծիքները սահեցնելով կամ սլաքներով",
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
      swipeHint: "Swipe or use arrows to browse reviews",
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
    <section className="bg-[#312F2F] py-8 sm:py-16 text-[#FCFCF7] overflow-hidden w-full" id="reviews">
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
                onClick={scrollPrev}
                disabled={activeIndex === 0}
                aria-label="Previous review"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all active:scale-95 cursor-pointer ${
                  activeIndex === 0
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={scrollNext}
                disabled={activeIndex === reviews.length - 1}
                aria-label="Next review"
                className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all active:scale-95 cursor-pointer ${
                  activeIndex === reviews.length - 1
                    ? "opacity-30 cursor-not-allowed"
                    : "hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. FULL-WIDTH SINGLE REVIEW SLIDER */}
      <div className="mx-auto max-w-[1400px] px-3 sm:px-8 lg:px-12 mt-6 sm:mt-10">
        <div className="relative group/slider">
          {/* Desktop Floating Prev / Next Buttons */}
          <button
            type="button"
            onClick={scrollPrev}
            disabled={activeIndex === 0}
            aria-label="Previous review"
            className={`hidden lg:flex absolute -left-5 xl:-left-7 top-1/2 -translate-y-1/2 z-20 h-13 w-13 items-center justify-center rounded-full border border-white/20 bg-[#242323]/95 backdrop-blur-md text-white shadow-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
              activeIndex === 0
                ? "opacity-0 pointer-events-none"
                : "opacity-80 hover:opacity-100 hover:scale-110 hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            type="button"
            onClick={scrollNext}
            disabled={activeIndex === reviews.length - 1}
            aria-label="Next review"
            className={`hidden lg:flex absolute -right-5 xl:-right-7 top-1/2 -translate-y-1/2 z-20 h-13 w-13 items-center justify-center rounded-full border border-white/20 bg-[#242323]/95 backdrop-blur-md text-white shadow-2xl transition-all duration-200 active:scale-90 cursor-pointer ${
              activeIndex === reviews.length - 1
                ? "opacity-0 pointer-events-none"
                : "opacity-80 hover:opacity-100 hover:scale-110 hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
            }`}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Dynamic-height card that perfectly wraps any review length + touch swipe */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            className="w-full select-none cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ touchAction: "pan-y" }}
          >
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {reviews[activeIndex] && (
                <motion.div
                  key={reviews[activeIndex].id || activeIndex}
                  custom={direction}
                  variants={{
                    enter: (dir: number) => ({
                      x: dir > 0 ? 40 : -40,
                      opacity: 0,
                    }),
                    center: {
                      x: 0,
                      opacity: 1,
                      transition: {
                        x: { type: "spring", stiffness: 320, damping: 30 },
                        opacity: { duration: 0.18 },
                      },
                    },
                    exit: (dir: number) => ({
                      x: dir > 0 ? -40 : 40,
                      opacity: 0,
                      transition: {
                        x: { type: "spring", stiffness: 320, damping: 30 },
                        opacity: { duration: 0.14 },
                      },
                    }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="w-full"
                >
                  <div className="relative overflow-hidden rounded-[1.75rem] sm:rounded-[2.25rem] lg:rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#252424] via-[#201F1F] to-[#1A1919] p-5 sm:p-8 lg:p-12 shadow-2xl transition-all duration-300 flex flex-col">
                    {/* Ambient glow accent in background */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#C7FF32]/5 blur-3xl pointer-events-none" />
                    <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-[#586EFF]/5 blur-3xl pointer-events-none" />

                    {/* Watermark Quote Mark */}
                    <div className="absolute right-5 sm:right-10 bottom-6 sm:bottom-10 text-white/[0.03] pointer-events-none select-none font-serif text-[100px] sm:text-[160px] leading-none">
                      ”
                    </div>

                    <div className="relative z-10">
                      {/* Top Bar: Stars, Verified badge, Tour, Guide, and Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-white/10 pb-4 sm:pb-5">
                        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                          {/* Stars + Numeric rating */}
                          <div className="flex items-center gap-1 text-[#C7FF32]">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-base sm:text-xl ${
                                  star <= reviews[activeIndex].rating ? "opacity-100" : "opacity-30 text-white/40"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                            <span className="ml-1 text-sm sm:text-base font-bold text-white/95">
                              {reviews[activeIndex].rating}.0
                            </span>
                          </div>

                          {/* Verified badge */}
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#C7FF32]/10 border border-[#C7FF32]/30 px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-bold text-[#C7FF32]">
                            <span>✓</span>
                            <span>{texts.verified}</span>
                          </span>

                          {/* Tour Visited pill */}
                          {reviews[activeIndex].tourTitle && (
                            <span
                              className="inline-flex items-center gap-1.5 rounded-full bg-[#586EFF]/15 border border-[#586EFF]/30 px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-[#8C9EFF] max-w-[200px] xs:max-w-[280px] sm:max-w-md truncate"
                              title={reviews[activeIndex].tourTitle}
                            >
                              <svg className="w-3 h-3 shrink-0 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{reviews[activeIndex].tourTitle}</span>
                            </span>
                          )}

                          {/* Guide Name pill */}
                          {reviews[activeIndex].guideName && (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/5 border border-white/10 px-3 py-0.5 sm:py-1 text-xs sm:text-sm font-semibold text-white/90">
                              <span className="text-white/60 font-normal">{texts.guideBadge}:</span>
                              <span className="text-[#C7FF32] font-bold">{reviews[activeIndex].guideName}</span>
                            </span>
                          )}
                        </div>

                        {/* Top Right: Date & Counter */}
                        <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 text-xs sm:text-sm text-white/60 font-medium">
                          {reviews[activeIndex].date && (
                            <span className="inline-flex items-center gap-1.5">
                              <svg className="w-3.5 h-3.5 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{reviews[activeIndex].date}</span>
                            </span>
                          )}
                          <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-mono font-bold text-white/80">
                            {activeIndex + 1} / {reviews.length}
                          </span>
                        </div>
                      </div>

                      {/* Middle: The Review Text (Natural height, no artificial empty spaces) */}
                      <div className="my-4 sm:my-6">
                        <p className="text-base sm:text-lg lg:text-xl font-normal leading-relaxed text-[#FCFCF7] break-words whitespace-pre-line tracking-normal">
                          “{getReviewText(reviews[activeIndex].text, locale)}”
                        </p>
                      </div>
                    </div>

                    {/* Bottom: Author Info and Quick Navigation Controls */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10 pt-4 sm:pt-6 mt-2">
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="flex h-11 w-11 sm:h-13 sm:w-13 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#586EFF] to-[#3B4CCA] font-black text-base sm:text-lg text-white shadow-lg ring-2 ring-white/15">
                          {reviews[activeIndex].author ? reviews[activeIndex].author.charAt(0).toUpperCase() : "G"}
                        </div>
                        <div className="min-w-0">
                          <span className="block text-base sm:text-lg lg:text-xl font-bold text-white truncate">
                            {reviews[activeIndex].author}
                          </span>
                          {reviews[activeIndex].location ? (
                            <span className="flex items-center gap-1 text-xs sm:text-sm text-white/70 font-medium truncate mt-0.5">
                              <svg className="w-3.5 h-3.5 text-[#C7FF32] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate">{reviews[activeIndex].location}</span>
                            </span>
                          ) : (
                            <span className="text-xs sm:text-sm text-white/50">{texts.verified}</span>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom-right Navigation Arrows */}
                      <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-white/5">
                        <span className="text-xs sm:text-sm text-white/50 font-mono sm:hidden">
                          {activeIndex + 1} / {reviews.length}
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={scrollPrev}
                            disabled={activeIndex === 0}
                            aria-label="Previous review"
                            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all active:scale-95 cursor-pointer ${
                              activeIndex === 0
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
                            }`}
                          >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={scrollNext}
                            disabled={activeIndex === reviews.length - 1}
                            aria-label="Next review"
                            className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-all active:scale-95 cursor-pointer ${
                              activeIndex === reviews.length - 1
                                ? "opacity-30 cursor-not-allowed"
                                : "hover:border-[#C7FF32] hover:bg-[#C7FF32] hover:text-[#312F2F]"
                            }`}
                          >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Progress & Pagination Bar */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-white/70">
          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <span className="font-mono font-bold text-[#C7FF32]">
              {String(activeIndex + 1).padStart(2, "0")}
            </span>
            <div className="h-1.5 w-full sm:w-52 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-[#C7FF32] transition-all duration-300 rounded-full"
                style={{ width: `${((activeIndex + 1) / Math.max(1, reviews.length)) * 100}%` }}
              />
            </div>
            <span className="font-mono text-white/50">
              {String(reviews.length).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4">
            <span className="text-white/60">{texts.swipeHint}</span>
            <span className="font-bold text-white shrink-0">
              {reviews.length} {texts.reviewsCount}
            </span>
          </div>
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
