"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { Review } from "@/lib/reviews";
import { getReviewText } from "@/lib/reviews";
import { StarIcon } from "@/components/icons";

type Props = {
  initialReviews: Review[];
  locale: Locale;
};

export default function ReviewsSection({ initialReviews, locale }: Props) {
  const [reviews] = useState<Review[]>(initialReviews);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Form state
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [tourTitle, setTourTitle] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const texts = {
    ru: {
      badge: "★ 5.0 • ОТЗЫВЫ ГОСТЕЙ",
      title: "Что говорят о поездках с AMARAS",
      subtitle:
        "Искренние впечатления путешественников, открывших для себя Армению вместе с нашими гидами и водителями.",
      writeBtn: "Оставить свой отзыв",
      verified: "Проверенный гость",
      modalTitle: "Оставить отзыв о поездке",
      modalSub:
        "Поделитесь вашими впечатлениями! Отзыв появится на сайте после быстрой проверки администратором.",
      nameLabel: "Ваше имя и фамилия *",
      namePlaceholder: "Например: Анна Смирнова",
      cityLabel: "Ваш город или страна",
      cityPlaceholder: "Например: Москва, Сочи, Тбилиси",
      tourLabel: "Какой тур или места вы посетили?",
      tourPlaceholder: "Например: Озеро Севан и Дилижан / Джип-тур",
      ratingLabel: "Ваша оценка",
      textLabel: "Ваш отзыв *",
      textPlaceholder:
        "Расскажите о впечатлениях: как прошла поездка, работа гида и водителя, что больше всего запомнилось...",
      cancel: "Отмена",
      submit: "Отправить отзыв",
      submitting: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successMsg:
        "Мы получили ваш отзыв. После быстрой проверки администратором он будет опубликован на сайте.",
      close: "Понятно",
    },
    hy: {
      badge: "★ 5.0 • ՀՅՈՒՐԵՐԻ ԿԱՐԾԻՔՆԵՐԸ",
      title: "Ի՞նչ են ասում AMARAS-ի մասին",
      subtitle:
        "Անկեղծ տպավորություններ ճամփորդներից, ովքեր բացահայտել են Հայաստանը մեր գիդերի և վարորդների հետ։",
      writeBtn: "Գրել կարծիք",
      verified: "Հաստատված հյուր",
      modalTitle: "Գրել կարծիք ճամփորդության մասին",
      modalSub:
        "Կիսվեք ձեր տպավորություններով։ Կարծիքը կհրապարակվի կայքում ադմինիստրատորի ստուգումից հետո։",
      nameLabel: "Ձեր անունը *",
      namePlaceholder: "Օրինակ՝ Արմեն Կ.",
      cityLabel: "Ձեր քաղաքը կամ երկիրը",
      cityPlaceholder: "Օրինակ՝ Երևան, Գլենդել, Մոսկվա",
      tourLabel: "Ո՞ր տուրն եք այցելել",
      tourPlaceholder: "Օրինակ՝ Սևան և Դիլիջան / Ջիպ-տուր",
      ratingLabel: "Ձեր գնահատականը",
      textLabel: "Ձեր կարծիքը *",
      textPlaceholder:
        "Պատմեք տպավորությունների մասին՝ ինչպե՞ս անցավ ուղևորությունը, ինչն ամենաշատը դուր եկավ...",
      cancel: "Չեղարկել",
      submit: "Ուղարկել կարծիքը",
      submitting: "Ուղարկվում է...",
      successTitle: "Շնորհակալությո՛ւն կարծիքի համար",
      successMsg:
        "Մենք ստացել ենք ձեր կարծիքը։ Ադմինիստրատորի ստուգումից հետո այն կհրապարակվի կայքում։",
      close: "Փակել",
    },
    en: {
      badge: "★ 5.0 • TRAVELER REVIEWS",
      title: "What Travelers Say About AMARAS",
      subtitle:
        "Genuine reviews and stories from guests who explored Armenia with our professional team.",
      writeBtn: "Write a Review",
      verified: "Verified Traveler",
      modalTitle: "Leave a Review",
      modalSub:
        "Share your experience! Your review will be published on the site after brief administrator approval.",
      nameLabel: "Your Name *",
      namePlaceholder: "e.g. John Doe",
      cityLabel: "Your City or Country",
      cityPlaceholder: "e.g. London, New York, Berlin",
      tourLabel: "Tour or destinations visited",
      tourPlaceholder: "e.g. Lake Sevan & Dilijan / 4x4 Jeep Expedition",
      ratingLabel: "Your Rating",
      textLabel: "Your Review *",
      textPlaceholder:
        "Tell us about your experience: the guide, driver, scenic spots, and trip highlights...",
      cancel: "Cancel",
      submit: "Submit Review",
      submitting: "Submitting...",
      successTitle: "Thank you for your review!",
      successMsg:
        "We have received your review. It will appear on the website shortly after brief moderation.",
      close: "Got it",
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
          rating,
          text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setSuccess(true);
      // Reset form
      setAuthor("");
      setLocation("");
      setTourTitle("");
      setRating(5);
      setText("");
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
    <section className="bg-[#312F2F] py-20 text-[#FCFCF7]" id="reviews">
      <div className="mx-auto max-w-[1240px] px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3.5 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#C7FF32]">
              {texts.badge}
            </span>
            <h2 className="mt-3 font-serif text-3xl font-normal tracking-tight text-[#FCFCF7] sm:text-4xl lg:text-5xl">
              {texts.title}
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#FCFCF7]/80">
              {texts.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex shrink-0 items-center gap-2.5 rounded-full bg-[#C7FF32] px-6 py-3.5 text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/20 transition-all hover:bg-[#bbf028] hover:scale-105 active:scale-95"
          >
            <span>✍️</span>
            <span>{texts.writeBtn}</span>
          </button>
        </div>

        {/* Reviews Grid */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reviews.map((rev) => {
            const reviewContent = getReviewText(rev.text, locale);
            return (
              <div
                key={rev.id}
                className="group relative flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-[#242323] p-7 shadow-lg transition-all duration-300 hover:border-[#C7FF32]/40 hover:bg-[#282727] hover:shadow-2xl"
              >
                <div>
                  {/* Top Bar: Stars + Verified Badge */}
                  <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-4">
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

                  {/* Tour visited pill if present */}
                  {rev.tourTitle && (
                    <div className="mt-3.5 inline-block rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#586EFF]">
                      📍 {rev.tourTitle}
                    </div>
                  )}

                  {/* Review Text */}
                  <p className="mt-4 text-sm leading-relaxed text-[#FCFCF7]/90 font-normal">
                    “{reviewContent}”
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#586EFF] font-black text-white shadow-md">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <span className="block text-sm font-bold text-white">
                        {rev.author}
                      </span>
                      {rev.location && (
                        <span className="block text-xs text-white/60">
                          {rev.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {rev.date && (
                    <span className="text-[11px] font-medium text-white/40">
                      {rev.date}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
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
              onClick={handleCloseModal}
              className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative z-10 w-full max-w-lg overflow-hidden rounded-3xl border border-white/15 bg-[#242323] p-6 text-[#FCFCF7] shadow-2xl sm:p-8"
            >
              {success ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C7FF32]/20 text-3xl text-[#C7FF32]">
                    ✓
                  </div>
                  <h3 className="mt-5 text-2xl font-black text-white">
                    {texts.successTitle}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#FCFCF7]/80">
                    {texts.successMsg}
                  </p>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="mt-6 inline-flex rounded-full bg-[#586EFF] px-8 py-3 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#475be6]"
                  >
                    {texts.close}
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-black text-white sm:text-2xl">
                        {texts.modalTitle}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-[#FCFCF7]/70">
                        {texts.modalSub}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      aria-label="Close"
                      className="rounded-full p-1 text-white/50 hover:bg-white/10 hover:text-white"
                    >
                      ✕
                    </button>
                  </div>

                  {errorMsg && (
                    <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    {/* Star Rating Picker */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#C7FF32]">
                        {texts.ratingLabel}
                      </label>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
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
                        <span className="ml-2 text-sm font-bold text-[#C7FF32]">
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
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
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
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
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
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Review text */}
                    <div>
                      <label className="block text-xs font-semibold text-white/80">
                        {texts.textLabel}
                      </label>
                      <textarea
                        required
                        rows={4}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={texts.textPlaceholder}
                        className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-white/30 focus:border-[#C7FF32] focus:outline-none"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleCloseModal}
                        className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white/80 hover:bg-white/10"
                      >
                        {texts.cancel}
                      </button>
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-[#C7FF32] px-7 py-2.5 text-xs font-black uppercase tracking-wider text-[#312F2F] shadow-lg transition-all hover:bg-[#bbf028] disabled:opacity-50"
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
