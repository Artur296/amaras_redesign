"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { Locale } from "@/lib/i18n";
import { useLinks, useSite } from "@/components/SiteProvider";
import { defaultPaymentCard } from "@/lib/site";
import { TelegramIcon, WhatsAppIcon } from "@/components/icons";

export type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
  tourTitle?: string;
  defaultDate?: string;
};

const I18N = {
  ru: {
    badge: "Бронирование тура",
    title: "Оформить бронирование",
    subtitle: "Заполните данные для поездки. Мы подтвердим бронь и свяжемся с вами в течение 10–15 минут.",
    tourLabel: "Выбранный тур / Направление",
    dateLabel: "Желаемая дата поездки",
    datePlaceholder: "Выберите дату",
    adultsLabel: "Взрослые (12+ лет)",
    childrenLabel: "Дети (до 11 лет)",
    nameLabel: "Ваше имя и фамилия *",
    namePlaceholder: "Например: Анна Смирнова",
    phoneLabel: "Телефон / WhatsApp / Telegram *",
    phonePlaceholder: "+374 .. / +7 ..",
    emailLabel: "Email (для подтверждения)",
    emailPlaceholder: "example@mail.com",
    wishesLabel: "Пожелания (отель, трансфер, особое меню)",
    wishesPlaceholder: "Укажите адрес отеля или любые пожелания...",
    paymentCardBadge: "Реквизиты для оплаты",
    cardNumberLabel: "Номер карты для перевода:",
    cardHolderLabel: "Получатель:",
    phonePayLabel: "По номеру телефона (Idram / Telcell):",
    copyBtn: "Скопировать",
    copiedBtn: "Скопировано! ✓",
    receiptLabel: "Чек оплаты (скриншот или PDF)",
    receiptHint: "Прикрепите скриншот перевода или квитанцию в формате JPG, PNG или PDF (до 10 МБ)",
    receiptUploadBtn: "Загрузить чек оплаты",
    receiptChangeBtn: "Заменить файл",
    receiptRemoveBtn: "Удалить",
    submitBtn: "Подтвердить и забронировать",
    submitting: "Отправка заявки...",
    noPaymentBadge: "100% предоплата перед поездкой",
    noPaymentNotice: "Оплата полной стоимости производится заранее (до выезда). После отправки заявки наш менеджер проверит наличие мест и предоставит удобный способ оплаты всей суммы.",
    directContact: "Или напишите нам напрямую:",
    successTitle: "Бронирование принято!",
    successSubtitle: "Спасибо за выбор AMARAS Tours. Мы проверили детали и свяжемся с вами для подтверждения.",
    successBookingCode: "Номер заявки",
    successClose: "Отлично, понятно",
  },
  hy: {
    badge: "Տուրի ամրագրում",
    title: "Ամրագրել ուղևորությունը",
    subtitle: "Լրացրեք տվյալները։ Մենք կհաստատենք ամրագրումը և կկապվենք ձեզ հետ 10–15 րոպեի ընթացքում։",
    tourLabel: "Ընտրված տուր / Ուղղություն",
    dateLabel: "Ցանկալի ամսաթիվ",
    datePlaceholder: "Ընտրեք ամսաթիվը",
    adultsLabel: "Մեծահասակներ (12+ տարեկան)",
    childrenLabel: "Երեխաներ (մինչև 11 տարեկան)",
    nameLabel: "Ձեր անունը և ազգանունը *",
    namePlaceholder: "Օրինակ՝ Արմեն Կարապետյան",
    phoneLabel: "Հեռախոս / WhatsApp / Telegram *",
    phonePlaceholder: "+374 .. / +7 ..",
    emailLabel: "Էլ. հասցե (ըստ ցանկության)",
    emailPlaceholder: "example@mail.com",
    wishesLabel: "Լրացուցիչ ցանկություններ (հյուրանոց, տրանսֆեր)",
    wishesPlaceholder: "Նշեք հյուրանոցի հասցեն կամ նախասիրությունները...",
    paymentCardBadge: "Վճարման տվյալներ",
    cardNumberLabel: "Քարտի համարը փոխանցման համար՝",
    cardHolderLabel: "Ստացող՝",
    phonePayLabel: "Հեռախոսահամարով (Idram / Telcell)՝",
    copyBtn: "Պատճենել",
    copiedBtn: "Պատճենվա՛ծ է ✓",
    receiptLabel: "Վճարման անդորրագիր (սքրինշոթ կամ PDF)",
    receiptHint: "Կցեք փոխանցման սքրինշոթը կամ անդորրագիրը JPG, PNG կամ PDF ձևաչափով (մինչև 10 ՄԲ)",
    receiptUploadBtn: "Կցել անդորրագիրը",
    receiptChangeBtn: "Փոխել ֆայլը",
    receiptRemoveBtn: "Ջնջել",
    submitBtn: "Հաստատել և ամրագրել",
    submitting: "Ուղարկվում է...",
    noPaymentBadge: "100% կանխավճար ուղևորությունից առաջ",
    noPaymentNotice: "Ամբողջ գումարի վճարումը կատարվում է նախապես (մինչև մեկնումը)։ Հայտը ուղարկելուց հետո մեր մենեջերը կհաստատի ազատ տեղերը և կտրամադրի ամբողջ գումարի վճարման հարմար եղանակը:",
    directContact: "Կամ գրեք մեզ անմիջապես՝",
    successTitle: "Ամրագրումն ընդունվա՛ծ է",
    successSubtitle: "Շնորհակալություն AMARAS Tours-ն ընտրելու համար։ Մենք շուտով կկապվենք ձեզ հետ։",
    successBookingCode: "Հայտի համարը",
    successClose: "Հասկանալի է",
  },
  en: {
    badge: "Tour Booking",
    title: "Book Your Journey",
    subtitle: "Fill in the details below. Our tour coordinator will confirm arrangements within 10–15 minutes.",
    tourLabel: "Selected Tour / Destination",
    dateLabel: "Preferred Date",
    datePlaceholder: "Select date",
    adultsLabel: "Adults (12+ yrs)",
    childrenLabel: "Children (under 11 yrs)",
    nameLabel: "Full Name *",
    namePlaceholder: "e.g. John Smith",
    phoneLabel: "Phone / WhatsApp / Telegram *",
    phonePlaceholder: "+374 .. / +1 ..",
    emailLabel: "Email (for confirmation)",
    emailPlaceholder: "example@mail.com",
    wishesLabel: "Special Requests (hotel pickup, dietary)",
    wishesPlaceholder: "Mention hotel address or any specific wishes...",
    paymentCardBadge: "Payment Details",
    cardNumberLabel: "Card number for transfer:",
    cardHolderLabel: "Cardholder:",
    phonePayLabel: "Via phone number (Idram / Telcell):",
    copyBtn: "Copy",
    copiedBtn: "Copied! ✓",
    receiptLabel: "Payment Receipt (Screenshot or PDF)",
    receiptHint: "Attach transfer receipt or screenshot in JPG, PNG, or PDF format (up to 10 MB)",
    receiptUploadBtn: "Upload Receipt",
    receiptChangeBtn: "Change File",
    receiptRemoveBtn: "Remove",
    submitBtn: "Confirm & Book Tour",
    submitting: "Submitting...",
    noPaymentBadge: "100% Upfront Payment",
    noPaymentNotice: "Full payment is required in advance prior to departure. After submitting your request, our manager will confirm seat availability and provide convenient details to complete the full payment.",
    directContact: "Or contact us directly:",
    successTitle: "Booking Confirmed!",
    successSubtitle: "Thank you for choosing AMARAS Tours. We will review your request and contact you shortly.",
    successBookingCode: "Booking Ref",
    successClose: "Done",
  },
};

export default function BookingModal({
  isOpen,
  onClose,
  locale = "ru",
  tourTitle = "Индивидуальный тур",
  defaultDate = "",
}: BookingModalProps) {
  const t = I18N[locale] || I18N.ru;
  const links = useLinks();
  const site = useSite();
  const paymentCard = site?.paymentCard || defaultPaymentCard;

  const [mounted, setMounted] = useState(false);
  const [copiedCard, setCopiedCard] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [title, setTitle] = useState(tourTitle);
  const [date, setDate] = useState(defaultDate);
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [wishes, setWishes] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingResult, setBookingResult] = useState<{ id: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync title whenever prop changes
  useEffect(() => {
    if (tourTitle) setTitle(tourTitle);
  }, [tourTitle]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [isOpen]);

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg(locale === "ru" ? "Файл слишком большой (максимум 10 МБ)." : "File is too large (max 10MB).");
      return;
    }

    setReceiptFile(file);
    setErrorMsg("");

    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const removeFile = () => {
    setReceiptFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleCopyCard = (cardNum: string) => {
    const clean = cardNum.replace(/\s+/g, "");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(clean);
    }
    setCopiedCard(true);
    setTimeout(() => setCopiedCard(false), 2500);
  };

  const handleCopyPhone = (phoneNum: string) => {
    const clean = phoneNum.replace(/[^\d+]/g, "");
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(clean);
    }
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      setErrorMsg(locale === "ru" ? "Пожалуйста, заполните имя и телефон." : "Please fill in your name and phone.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("tourTitle", title);
      fd.append("name", name);
      fd.append("phone", phone);
      fd.append("email", email);
      fd.append("date", date);
      fd.append("adults", adults.toString());
      fd.append("children", children.toString());
      fd.append("wishes", wishes);

      if (receiptFile) {
        fd.append("receipt", receiptFile);
      }

      const res = await fetch("/api/booking", {
        method: "POST",
        body: fd,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Ошибка при оформлении бронирования");
      }

      setBookingResult({ id: data.bookingId || "AMR-OK" });
    } catch (err: any) {
      setErrorMsg(err.message || "Произошла ошибка. Пожалуйста, напишите нам в WhatsApp.");
    } finally {
      setLoading(false);
    }
  };

  const resetAndClose = () => {
    setBookingResult(null);
    removeFile();
    setErrorMsg("");
    onClose();
  };

  if (!isOpen) return null;
  if (!mounted || typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex flex-col justify-end sm:justify-center sm:items-center p-0 sm:p-4 overflow-y-auto" role="dialog" aria-modal="true">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer z-0"
        />

        {/* Modal Window: App bottom sheet on mobile, centered modal on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-[620px] max-h-[92dvh] sm:max-h-[90vh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] border border-white/15 bg-[#242323] text-[#FCFCF7] shadow-2xl p-4 sm:p-8 overscroll-contain flex flex-col"
        >
          {/* Close button */}
          <button
            type="button"
            onClick={resetAndClose}
            className="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95 cursor-pointer z-20"
            aria-label="Close"
          >
            ✕
          </button>

          {/* SUCCESS STATE */}
          {bookingResult ? (
            <div className="py-6 sm:py-8 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#C7FF32]/20 border-2 border-[#C7FF32] text-[#C7FF32] text-4xl shadow-[0_0_30px_rgba(199,255,50,0.3)]">
                ✓
              </div>

              <span className="mt-5 inline-block text-xs font-black uppercase tracking-[0.25em] text-[#C7FF32]">
                {t.successBookingCode}: {bookingResult.id}
              </span>

              <h3 className="mt-2 text-2xl sm:text-4xl font-serif font-normal text-white">
                {t.successTitle}
              </h3>

              <p className="mt-3 text-sm sm:text-base leading-relaxed text-white/80 max-w-md mx-auto">
                {t.successSubtitle}
              </p>

              {/* Direct messengers in case they want instant confirmation */}
              <div className="mt-8 rounded-2xl bg-white/5 border border-white/10 p-4 sm:p-5">
                <p className="text-xs sm:text-sm font-semibold text-white/70 mb-3">
                  {t.directContact}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white hover:bg-[#20ba59] transition-all shadow-md active:scale-95"
                  >
                    <WhatsAppIcon className="w-5 h-5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={links.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#229ED9] px-5 py-3 text-sm font-bold text-white hover:bg-[#1f8fc4] transition-all shadow-md active:scale-95"
                  >
                    <TelegramIcon className="w-5 h-5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>

              <button
                type="button"
                onClick={resetAndClose}
                className="mt-6 w-full rounded-full bg-[#C7FF32] py-3.5 text-sm sm:text-base font-black uppercase tracking-wider text-[#312F2F] hover:bg-[#b8f226] transition-all cursor-pointer"
              >
                {t.successClose}
              </button>
            </div>
          ) : (
            /* FORM STATE */
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#C7FF32]/40 bg-[#C7FF32]/10 px-3 py-0.5 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                  {t.badge}
                </span>
                <h3 className="mt-2 text-2xl sm:text-3xl font-serif font-normal text-white tracking-wide">
                  {t.title}
                </h3>
                <p className="mt-1 text-xs sm:text-sm text-white/75 leading-relaxed">
                  {t.subtitle}
                </p>
              </div>

              {/* Honeypot field (hidden from humans) */}
              <input
                type="text"
                name="website_hp"
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              {/* 1. Tour Title */}
              <div>
                <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                  {t.tourLabel}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/40 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                  required
                />
              </div>

              {/* 2. Date + Adults & Children */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                    {t.dateLabel}
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                  />
                </div>

                {/* Guest Steppers */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white mb-1.5 truncate">
                      {t.adultsLabel}
                    </label>
                    <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1">
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                        className="h-11 w-11 rounded-lg bg-white/10 text-white text-lg font-black hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-base sm:text-lg text-white">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults((prev) => prev + 1)}
                        className="h-11 w-11 rounded-lg bg-[#C7FF32] text-[#312F2F] text-lg font-black hover:bg-[#b8f226] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-bold text-white mb-1.5 truncate">
                      {t.childrenLabel}
                    </label>
                    <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1">
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                        className="h-11 w-11 rounded-lg bg-white/10 text-white text-lg font-black hover:bg-white/20 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        -
                      </button>
                      <span className="flex-1 text-center font-black text-base sm:text-lg text-white">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren((prev) => prev + 1)}
                        className="h-11 w-11 rounded-lg bg-[#C7FF32] text-[#312F2F] text-lg font-black hover:bg-[#b8f226] transition-colors flex items-center justify-center cursor-pointer active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                    {t.nameLabel}
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                    {t.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.phonePlaceholder}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                    required
                  />
                </div>
              </div>

              {/* 4. Email & Wishes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                    {t.emailLabel}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t.emailPlaceholder}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm sm:text-base font-bold text-white mb-1.5">
                    {t.wishesLabel}
                  </label>
                  <input
                    type="text"
                    value={wishes}
                    onChange={(e) => setWishes(e.target.value)}
                    placeholder={t.wishesPlaceholder}
                    className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm sm:text-base text-white placeholder-white/30 focus:border-[#C7FF32] focus:bg-white/10 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* 5 & 6. Payment Card Details & Receipt Upload (Only shown when payment card is enabled with card number) */}
              {paymentCard?.enabled && paymentCard?.cardNumber ? (
                <>
                  <div className="rounded-2xl border border-[#C7FF32]/40 bg-gradient-to-br from-[#1c1d22] to-[#121215] p-4 sm:p-5 shadow-xl shadow-black/50 space-y-3.5 relative overflow-hidden">
                    <div className="absolute -top-10 -right-10 w-28 h-28 bg-[#C7FF32]/10 rounded-full blur-2xl pointer-events-none" />

                    {/* Header with badge & bank */}
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#C7FF32] text-sm font-black text-[#312F2F] shrink-0">
                          💳
                        </span>
                        <span className="text-sm sm:text-base font-black text-white tracking-wide">
                          {t.paymentCardBadge}
                        </span>
                      </div>
                      {paymentCard.bankName && (
                        <span className="rounded-full bg-[#C7FF32]/15 border border-[#C7FF32]/35 px-3 py-1 text-xs font-black text-[#C7FF32] truncate max-w-[200px]">
                          {paymentCard.bankName}
                        </span>
                      )}
                    </div>

                    {/* Card Number & Copy Button */}
                    <div className="rounded-xl border border-white/15 bg-black/60 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="min-w-0">
                        <span className="block text-xs uppercase font-bold text-white/70 tracking-wider">
                          {t.cardNumberLabel}
                        </span>
                        <span className="font-mono text-lg sm:text-2xl font-black tracking-wider text-[#C7FF32] select-all break-all mt-0.5 block">
                          {paymentCard.cardNumber}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopyCard(paymentCard.cardNumber)}
                        className={`self-start sm:self-auto inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-black transition-all active:scale-95 cursor-pointer shrink-0 ${
                          copiedCard
                            ? "bg-[#C7FF32] text-[#312F2F] shadow-[0_0_12px_rgba(199,255,50,0.4)]"
                            : "bg-white/10 hover:bg-[#C7FF32] hover:text-[#312F2F] text-white"
                        }`}
                      >
                        {copiedCard ? (
                          <>
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{t.copiedBtn}</span>
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span>{t.copyBtn}</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Card Holder & Phone Payment */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {paymentCard.cardHolder && (
                        <div className="rounded-lg bg-white/5 px-2.5 py-1.5 border border-white/5">
                          <span className="text-white/50 block text-[10px] uppercase font-bold">
                            {t.cardHolderLabel}
                          </span>
                          <span className="font-bold text-white/90 truncate block">
                            {paymentCard.cardHolder}
                          </span>
                        </div>
                      )}
                      {paymentCard.phonePay && (
                        <div className="rounded-lg bg-white/5 px-3 py-2 border border-white/5 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-white/60 block text-[11px] uppercase font-bold">
                              {t.phonePayLabel}
                            </span>
                            <span className="font-mono font-bold text-[#C7FF32] text-sm truncate block mt-0.5">
                              {paymentCard.phonePay}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleCopyPhone(paymentCard.phonePay)}
                            className="shrink-0 text-xs font-bold text-white/90 hover:text-white px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 transition-colors"
                          >
                            {copiedPhone ? "✓" : t.copyBtn}
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Instruction */}
                    {paymentCard.instruction?.[locale] && (
                      <p className="text-xs text-white/80 leading-relaxed italic border-t border-white/10 pt-2.5">
                        ℹ️ {paymentCard.instruction[locale]}
                      </p>
                    )}
                  </div>

                  {/* 6. Payment Check Attachment (PDF or Image) */}
                  <div className="rounded-2xl border border-white/15 bg-black/20 p-4 sm:p-5">
                    <div className="flex items-center justify-between">
                      <label className="text-sm sm:text-base font-bold text-[#C7FF32] flex items-center gap-2">
                        <span className="text-lg">🧾</span>
                        <span>{t.receiptLabel}</span>
                      </label>
                      <span className="text-xs text-white/60 font-medium">JPG, PNG, PDF (макс. 10MB)</span>
                    </div>

                    <p className="mt-1.5 text-xs sm:text-sm text-white/70 leading-relaxed">
                      {t.receiptHint}
                    </p>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp,application/pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />

                    {receiptFile ? (
                      <div className="mt-3.5 flex items-center justify-between gap-3 rounded-xl border border-[#C7FF32]/40 bg-[#C7FF32]/10 p-3 sm:p-4">
                        <div className="flex items-center gap-3 overflow-hidden">
                          {previewUrl ? (
                            <img
                              src={previewUrl}
                              alt="Receipt Preview"
                              className="h-14 w-14 rounded-lg object-cover border border-white/20 shrink-0"
                            />
                          ) : (
                            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-red-500/20 text-red-300 font-black text-sm shrink-0 border border-red-500/30">
                              PDF
                            </div>
                          )}
                          <div className="overflow-hidden">
                            <p className="text-sm sm:text-base font-bold text-white truncate">
                              {receiptFile.name}
                            </p>
                            <p className="text-xs text-white/80">
                              {(receiptFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="rounded-lg bg-white/10 px-3 py-1.5 text-xs sm:text-sm font-semibold text-white hover:bg-white/20 transition-colors"
                          >
                            {t.receiptChangeBtn}
                          </button>
                          <button
                            type="button"
                            onClick={removeFile}
                            className="rounded-lg bg-red-500/20 px-3 py-1.5 text-xs sm:text-sm font-semibold text-red-300 hover:bg-red-500/30 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-3.5 flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-dashed border-white/25 bg-white/5 py-4 text-sm sm:text-base font-bold text-white hover:border-[#C7FF32] hover:bg-[#C7FF32]/5 transition-all cursor-pointer"
                      >
                        <svg className="w-5 h-5 text-[#C7FF32]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span>{t.receiptUploadBtn}</span>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:p-5 flex items-start gap-3.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#C7FF32]/15 border border-[#C7FF32]/30 text-base shrink-0">
                    💳
                  </span>
                  <div className="space-y-1 min-w-0">
                    <p className="text-sm sm:text-base font-bold text-white">
                      {t.noPaymentBadge}
                    </p>
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                      {t.noPaymentNotice}
                    </p>
                  </div>
                </div>
              )}

              {/* Error message if any */}
              {errorMsg && (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 p-3.5 text-sm text-red-300 font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-[#C7FF32] py-4 text-base sm:text-lg font-black uppercase tracking-wider text-[#312F2F] shadow-lg shadow-[#C7FF32]/25 transition-all hover:bg-[#b8f226] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-[#312F2F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                    </svg>
                    <span>{t.submitting}</span>
                  </>
                ) : (
                  <span>{t.submitBtn} →</span>
                )}
              </button>

              {/* Messengers bar */}
              <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs sm:text-sm text-white/70">
                <span>{t.directContact}</span>
                <div className="flex items-center gap-2">
                  <a
                    href={links.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#25D366] hover:underline font-bold"
                  >
                    <WhatsAppIcon className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <span>•</span>
                  <a
                    href={links.telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[#229ED9] hover:underline font-bold"
                  >
                    <TelegramIcon className="w-3.5 h-3.5" />
                    <span>Telegram</span>
                  </a>
                </div>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
