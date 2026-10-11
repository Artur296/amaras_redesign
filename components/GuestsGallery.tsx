"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import type { GuestMedia } from "@/lib/guests";
import type { Review } from "@/lib/reviews";
import { getReviewText } from "@/lib/reviews";
import { StarIcon } from "@/components/icons";

type Props = {
  guests: GuestMedia[];
  reviews: Review[];
  locale: Locale;
};

export default function GuestsGallery({ guests, reviews, locale }: Props) {
  const [activeTab, setActiveTab] = useState<"all" | "photo" | "video" | "reviews">("all");
  const [selectedGuide, setSelectedGuide] = useState<string>("all");
  const [activeItem, setActiveItem] = useState<GuestMedia | null>(null);

  // Review modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [tourTitle, setTourTitle] = useState("");
  const [guideName, setGuideName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");

  const t = {
    ru: {
      tabs: {
        all: "Все моменты",
        photo: "Фотографии",
        video: "Видео",
        reviews: "Отзывы гостей",
      },
      guides: {
        all: "Все гиды",
      },
      guideLabel: "Гид",
      reviewGuide: "Гид",
      verified: "Проверенный гость",
      leaveReview: "Оставить отзыв",
      leaveReviewSub: "Расскажите о вашей поездке и вашем гиде",
      emptyMedia: "В этой категории пока нет материалов.",
      close: "Закрыть",
      watchVideo: "Смотреть видео",
      ratingLabel: "Оценка",
      nameLabel: "Ваше имя и фамилия *",
      namePlaceholder: "Например: Анна Смирнова",
      cityLabel: "Город или страна",
      cityPlaceholder: "Например: Москва, Сочи, Тбилиси",
      tourLabel: "Какой тур вы посетили?",
      tourPlaceholder: "Например: Озеро Севан и Дилижан",
      guideInputLabel: "Имя гида (если хотите отметить)",
      guideInputPlaceholder: "Например: Армен, Давид, Тигран",
      textLabel: "Ваш отзыв *",
      textPlaceholder: "Расскажите о поездке, работе гида, впечатлениях...",
      submit: "Отправить отзыв",
      submitting: "Отправка...",
      successTitle: "Спасибо за ваш отзыв!",
      successMsg: "Мы получили ваш отзыв. После проверки он появится на сайте.",
      modalTitle: "Оставить отзыв о поездке",
      modalSubtitle: "Поделитесь впечатлениями и отметьте работу вашего гида",
      cancel: "Отмена",
    },
    hy: {
      tabs: {
        all: "Բոլորը",
        photo: "Լուսանկարներ",
        video: "Տեսանյութեր",
        reviews: "Կարծիքներ",
      },
      guides: {
        all: "Բոլոր գիդերը",
      },
      guideLabel: "Գիդ",
      reviewGuide: "Գիդ",
      verified: "Ստուգված հյուր",
      leaveReview: "Թողնել կարծիք",
      leaveReviewSub: "Կիսվեք ձեր տպավորություններով և նշեք ձեր գիդին",
      emptyMedia: "Այս բաժնում դեռ նյութեր չկան։",
      close: "Փակել",
      watchVideo: "Դիտել տեսանյութը",
      ratingLabel: "Գնահատական",
      nameLabel: "Ձեր անունը և ազգանունը *",
      namePlaceholder: "Օրինակ՝ Աննա Սմբատյան",
      cityLabel: "Քաղաքը կամ երկիրը",
      cityPlaceholder: "Օրինակ՝ Երևան, Մոսկվա",
      tourLabel: "Ո՞ր տուրին եք մասնակցել",
      tourPlaceholder: "Օրինակ՝ Սևան և Դիլիջան",
      guideInputLabel: "Գիդի անունը (եթե ցանկանում եք նշել)",
      guideInputPlaceholder: "Օրինակ՝ Արմեն, Դավիթ, Տիգրան",
      textLabel: "Ձեր կարծիքը *",
      textPlaceholder: "Պատմեք ճամփորդության, գիդի աշխատանքի և տպավորությունների մասին...",
      submit: "Ուղարկել կարծիքը",
      submitting: "Ուղարկվում է...",
      successTitle: "Շնորհակալություն կարծիքի համար",
      successMsg: "Մենք ստացանք ձեր կարծիքը։ Ստուգումից հետո այն կհրապարակվի։",
      modalTitle: "Թողնել կարծիք ճամփորդության մասին",
      modalSubtitle: "Կիսվեք տպավորություններով և նշեք ձեր գիդի աշխատանքը",
      cancel: "Չեղարկել",
    },
    en: {
      tabs: {
        all: "All Moments",
        photo: "Photos",
        video: "Videos",
        reviews: "Guest Reviews",
      },
      guides: {
        all: "All Guides",
      },
      guideLabel: "Guide",
      reviewGuide: "Guide",
      verified: "Verified guest",
      leaveReview: "Leave a Review",
      leaveReviewSub: "Share your travel story and mention your guide",
      emptyMedia: "No media items in this category yet.",
      close: "Close",
      watchVideo: "Watch Video",
      ratingLabel: "Rating",
      nameLabel: "Your Name *",
      namePlaceholder: "e.g. Anna Smith",
      cityLabel: "City or Country",
      cityPlaceholder: "e.g. London, Berlin, Dubai",
      tourLabel: "Which tour did you take?",
      tourPlaceholder: "e.g. Lake Sevan & Dilijan",
      guideInputLabel: "Guide's Name (if you'd like to mention)",
      guideInputPlaceholder: "e.g. Armen, David, Tigran",
      textLabel: "Your Review *",
      textPlaceholder: "Tell us about your trip, your guide and favourite moments...",
      submit: "Submit Review",
      submitting: "Submitting...",
      successTitle: "Thank you for your review!",
      successMsg: "We have received your review. It will appear on the site once approved.",
      modalTitle: "Leave a Review",
      modalSubtitle: "Share your experience and praise your tour guide",
      cancel: "Cancel",
    },
  }[locale];

  // Distinct guides across guests and reviews
  const allGuides = Array.from(
    new Set([
      ...guests.map((g) => g.guideName).filter(Boolean),
      ...reviews.map((r) => r.guideName).filter(Boolean),
    ])
  ) as string[];

  // Filtered media
  const filteredGuests = guests.filter((g) => {
    if (activeTab === "photo" && g.type !== "photo") return false;
    if (activeTab === "video" && g.type !== "video") return false;
    if (selectedGuide !== "all" && g.guideName !== selectedGuide) return false;
    return true;
  });

  // Filtered reviews
  const filteredReviews = reviews.filter((r) => {
    if (selectedGuide !== "all" && r.guideName !== selectedGuide) return false;
    return true;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !text.trim()) return;

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim(),
          location: location.trim() || undefined,
          tourTitle: tourTitle.trim() || undefined,
          guideName: guideName.trim() || undefined,
          rating,
          text: text.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit review");
      }

      setSuccess(true);
    } catch {
      setErrorMsg(
        locale === "ru"
          ? "Произошла ошибка при отправке. Пожалуйста, попробуйте позже."
          : locale === "hy"
          ? "Սխալ տեղի ունեցավ: Խնդրում ենք փորձել մի փոքր ուշ:"
          : "An error occurred while sending. Please try again later."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    if (success) {
      setSuccess(false);
      setAuthor("");
      setLocation("");
      setTourTitle("");
      setGuideName("");
      setText("");
      setRating(5);
    }
  };

  return (
    <section className="py-8 sm:py-12">
      {/* Top Filter Controls */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b border-[#454343] pb-6 mb-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
          {(["all", "photo", "video", "reviews"] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-[#C7FF32] text-[#312F2F] shadow-md shadow-[#C7FF32]/20 font-bold"
                    : "bg-[#242323] text-[#FCFCF7]/75 hover:bg-[#363535] hover:text-[#FCFCF7] border border-[#454343]"
                }`}
              >
                {t.tabs[tab]}
                {tab === "reviews" && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[10px] ${isActive ? "bg-[#312F2F]/20 text-[#312F2F]" : "bg-white/10 text-white/80"}`}>
                    {filteredReviews.length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA Button: Leave a Review */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#C7FF32] text-[#312F2F] font-bold text-xs sm:text-sm hover:bg-[#b8f226] active:scale-95 transition-all shadow-md shadow-[#C7FF32]/25 cursor-pointer uppercase tracking-wider"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{t.leaveReview}</span>
          </button>
        </div>
      </div>

      {/* Guide Filter Chips */}
      {allGuides.length > 0 && (
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs uppercase tracking-wider text-white/40 mr-1 whitespace-nowrap">
            {t.guideLabel}:
          </span>
          <button
            onClick={() => setSelectedGuide("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
              selectedGuide === "all"
                ? "bg-white/20 text-white border border-white/40"
                : "bg-[#2A2929] text-white/60 hover:text-white border border-[#454343]"
            }`}
          >
            {t.guides.all}
          </button>
          {allGuides.map((guide) => (
            <button
              key={guide}
              onClick={() => setSelectedGuide(guide)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedGuide === guide
                  ? "bg-[#C7FF32]/15 text-[#C7FF32] border border-[#C7FF32]/50 font-bold"
                  : "bg-[#242323] text-white/60 hover:text-white border border-[#454343]"
              }`}
            >
              {guide}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid (when activeTab !== "reviews") */}
      {activeTab !== "reviews" && (
        <div className="mb-14">
          {filteredGuests.length === 0 ? (
            <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-[#454343] bg-[#242323]">
              <p className="text-sm text-white/60">{t.emptyMedia}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredGuests.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  onClick={() => setActiveItem(item)}
                  className="group relative rounded-2xl overflow-hidden bg-[#242323] border border-[#454343] hover:border-[#C7FF32]/50 transition-all duration-300 hover:shadow-xl hover:shadow-black/40 cursor-pointer flex flex-col"
                >
                  {/* Media Preview Container */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1C1B1B]">
                    <Image
                      src={item.url}
                      alt={item.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Type Badge (Video vs Photo) */}
                    {item.type === "video" ? (
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-[#C7FF32]">
                        <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    ) : (
                      <div className="absolute top-3 right-3 px-2 py-1 rounded-md bg-black/50 backdrop-blur-md border border-white/10 text-[10px] text-white/70">
                        {item.date || "2026"}
                      </div>
                    )}

                    {/* Location Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-white/90">
                      {item.location}
                    </div>

                    {/* Guide Badge */}
                    {item.guideName && (
                      <div className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#242323]/90 backdrop-blur-md border border-[#C7FF32]/40 text-[11px] text-[#C7FF32] font-semibold">
                        <span className="text-white/60 text-[10px] font-normal">{t.guideLabel}:</span>
                        <span>{item.guideName}</span>
                      </div>
                    )}
                  </div>

                  {/* Card Info */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-sm sm:text-base text-[#FCFCF7] line-clamp-1 group-hover:text-[#C7FF32] transition-colors">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="mt-1.5 text-xs text-white/70 line-clamp-2 leading-relaxed">
                        {item.caption}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Guest Reviews Section (shown when activeTab === "all" or activeTab === "reviews") */}
      {(activeTab === "all" || activeTab === "reviews") && (
        <div className="mt-8 pt-8 border-t border-[#454343]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#FCFCF7] tracking-tight">
                {t.tabs.reviews}
              </h2>
              <p className="text-xs sm:text-sm text-white/60 mt-1">
                {t.leaveReviewSub}
              </p>
            </div>
            <button
              onClick={() => setModalOpen(true)}
              className="text-xs sm:text-sm text-[#C7FF32] hover:underline font-bold cursor-pointer"
            >
              + {t.leaveReview}
            </button>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[#454343] bg-[#242323]">
              <p className="text-sm text-white/60">
                {selectedGuide !== "all"
                  ? `${t.emptyMedia} (Гид: ${selectedGuide})`
                  : t.emptyMedia}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredReviews.map((rev, idx) => (
                <motion.div
                  key={rev.id || idx}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.04 }}
                  className="rounded-2xl p-5 bg-[#242323] border border-[#454343] hover:border-[#C7FF32]/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Header: Author & Rating */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div>
                        <h4 className="font-semibold text-sm sm:text-base text-[#FCFCF7]">
                          {rev.author}
                        </h4>
                        {rev.location && (
                          <p className="text-xs text-white/50">{rev.location}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[#C7FF32]">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating
                                ? "text-[#C7FF32] fill-current"
                                : "text-white/20"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Tour & Guide Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {rev.tourTitle && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[#586EFF] font-semibold">
                          {rev.tourTitle}
                        </span>
                      )}
                      {rev.guideName && (
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#C7FF32]/10 border border-[#C7FF32]/30 text-[#C7FF32] font-semibold">
                          <span className="text-white/50 mr-1 font-normal">{t.reviewGuide}:</span>
                          {rev.guideName}
                        </span>
                      )}
                    </div>

                    {/* Review Content */}
                    <p className="text-xs sm:text-sm text-white/80 leading-relaxed italic">
                      "{getReviewText(rev.text, locale)}"
                    </p>
                  </div>

                  {/* Footer Date & Status */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-white/40">
                    <span>{rev.date}</span>
                    <span className="text-[#C7FF32]/90 font-medium">{t.verified}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Lightbox / Video Modal */}
      <AnimatePresence>
        {activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActiveItem(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-[#1C1B1B] border border-[#454343] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveItem(null)}
                className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/60 border border-white/20 text-white hover:text-[#C7FF32] flex items-center justify-center transition-colors cursor-pointer"
                aria-label={t.close}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Media Player / Image */}
              <div className="relative aspect-video w-full bg-black">
                {activeItem.type === "video" && activeItem.videoUrl ? (
                  activeItem.videoUrl.includes("youtube") || activeItem.videoUrl.includes("vimeo") ? (
                    <iframe
                      src={activeItem.videoUrl}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={activeItem.videoUrl}
                      poster={activeItem.url}
                      controls
                      autoPlay
                      className="w-full h-full object-contain"
                    />
                  )
                ) : (
                  <Image
                    src={activeItem.url}
                    alt={activeItem.title}
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              {/* Media Info Details */}
              <div className="p-5 sm:p-6 bg-[#242323] border-t border-[#454343] flex flex-col gap-2 overflow-y-auto">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {activeItem.title}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-md bg-white/10 text-white/90">
                      {activeItem.location}
                    </span>
                    {activeItem.guideName && (
                      <span className="text-xs px-2.5 py-1 rounded-md bg-[#C7FF32]/10 border border-[#C7FF32]/30 text-[#C7FF32] font-semibold">
                        {t.guideLabel}: {activeItem.guideName}
                      </span>
                    )}
                  </div>
                </div>
                {activeItem.caption && (
                  <p className="text-sm text-white/80 leading-relaxed mt-1">
                    {activeItem.caption}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Submission Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-[#242323] border border-[#454343] rounded-2xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors cursor-pointer"
                aria-label={t.cancel}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {success ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-[#C7FF32]/20 text-[#C7FF32] border border-[#C7FF32]/40 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-[#FCFCF7] mb-2">{t.successTitle}</h3>
                  <p className="text-sm text-white/70 mb-6 leading-relaxed">{t.successMsg}</p>
                  <button
                    onClick={handleCloseModal}
                    className="w-full py-2.5 rounded-full bg-[#C7FF32] text-[#312F2F] font-bold text-sm hover:bg-[#b8f226] cursor-pointer"
                  >
                    {t.close}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                      {t.modalTitle}
                    </h3>
                    <p className="text-xs text-white/60 mt-1">
                      {t.modalSubtitle}
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-lg bg-red-950/60 border border-red-500/40 text-xs text-red-200">
                      {errorMsg}
                    </div>
                  )}

                  {/* Rating Selector */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1.5">
                      {t.ratingLabel}
                    </label>
                    <div className="flex items-center gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <StarIcon
                            className={`w-6 h-6 ${
                              star <= rating
                                ? "text-[#C7FF32] fill-current"
                                : "text-white/20"
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Author Name */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      {t.nameLabel}
                    </label>
                    <input
                      type="text"
                      required
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      placeholder={t.namePlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1B1B] border border-[#454343] text-sm text-[#FCFCF7] placeholder:text-white/30 focus:outline-none focus:border-[#C7FF32]"
                    />
                  </div>

                  {/* Location & Tour */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        {t.cityLabel}
                      </label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder={t.cityPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1B1B] border border-[#454343] text-sm text-[#FCFCF7] placeholder:text-white/30 focus:outline-none focus:border-[#C7FF32]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-white/80 mb-1">
                        {t.tourLabel}
                      </label>
                      <input
                        type="text"
                        value={tourTitle}
                        onChange={(e) => setTourTitle(e.target.value)}
                        placeholder={t.tourPlaceholder}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1B1B] border border-[#454343] text-sm text-[#FCFCF7] placeholder:text-white/30 focus:outline-none focus:border-[#C7FF32]"
                      />
                    </div>
                  </div>

                  {/* Tour Guide Name input */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      {t.guideInputLabel}
                    </label>
                    <input
                      type="text"
                      value={guideName}
                      onChange={(e) => setGuideName(e.target.value)}
                      placeholder={t.guideInputPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1B1B] border border-[#454343] text-sm text-[#FCFCF7] placeholder:text-white/30 focus:outline-none focus:border-[#C7FF32]"
                    />
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="block text-xs font-medium text-white/80 mb-1">
                      {t.textLabel}
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder={t.textPlaceholder}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#1C1B1B] border border-[#454343] text-sm text-[#FCFCF7] placeholder:text-white/30 focus:outline-none focus:border-[#C7FF32] resize-none"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={handleCloseModal}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-white/70 hover:text-white cursor-pointer"
                    >
                      {t.cancel}
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-full bg-[#C7FF32] text-[#312F2F] font-bold text-xs sm:text-sm hover:bg-[#b8f226] disabled:opacity-50 cursor-pointer shadow-md shadow-[#C7FF32]/25 uppercase tracking-wider"
                    >
                      {submitting ? t.submitting : t.submit}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
