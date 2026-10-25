"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import type { Locale } from "@/lib/i18n";
import type { Attraction } from "@/lib/attractions";
import type { Vehicle } from "@/lib/fleet";
import type { SiteInfo } from "@/lib/site";
import { WhatsAppIcon, TelegramIcon, InstagramIcon, RouteIcon, StarIcon, ShieldIcon } from "@/components/icons";

type Props = {
  locale: Locale;
  attractions: Attraction[];
  fleet: Vehicle[];
  site: SiteInfo;
};

type CarOption = {
  id: "standard" | "comfort" | "premium";
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  seats: string;
  image: string;
  desc: Record<Locale, string>;
};

const CAR_OPTIONS: CarOption[] = [
  {
    id: "standard",
    title: { ru: "Standard Седан", hy: "Standard Սեդան", en: "Standard Sedan" },
    subtitle: { ru: "Toyota Camry / Comfort+", hy: "Toyota Camry / Կոմֆորտ", en: "Toyota Camry / Comfort+" },
    seats: "1–3/4 пассажира",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=800&q=80",
    desc: {
      ru: "Мягкий тихий седан с климат-контролем. Идеально для пар, соло-путешественников и поездок по асфальтированным трассам.",
      hy: "Հարմարավետ և անաղմուկ սեդան կլիմատ-կոնտրոլով։ Կատարյալ է զույգերի և անհատ ճանապարհորդների համար։",
      en: "Smooth and quiet sedan with climate control. Ideal for couples, solo travelers, and classic paved routes.",
    },
  },
  {
    id: "comfort",
    title: { ru: "Comfort Минивэн", hy: "Comfort Մինիվեն", en: "Comfort Minivan" },
    subtitle: { ru: "Toyota Alphard / Mercedes V-Class", hy: "Toyota Alphard / Mercedes V-Class", en: "Toyota Alphard / Mercedes V-Class" },
    seats: "5–7 пассажиров",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80",
    desc: {
      ru: "Просторный салон с капитанскими креслами, двухзонный кондиционер, большой багажник. Лучший выбор для семей и малых групп.",
      hy: "Ընդարձակ սրահ հարմարավետ նստատեղերով, երկգոտի օդորակիչով և մեծ բեռնախցիկով ընտանիքների համար։",
      en: "Spacious luxury cabin with captain chairs, dual-zone AC, and generous luggage capacity for families and groups.",
    },
  },
  {
    id: "premium",
    title: { ru: "Premium 4x4 SUV", hy: "Premium 4x4 Ամենագնաց", en: "Premium 4x4 SUV" },
    subtitle: { ru: "Toyota Land Cruiser Prado 4x4", hy: "Toyota Land Cruiser Prado 4x4", en: "Toyota Land Cruiser Prado 4x4" },
    seats: "3–4 пассажира",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80",
    desc: {
      ru: "Мощный рамный внедорожник с полным приводом для горных перевалов, каньонов, вулканических озер и труднодоступных крепостей.",
      hy: "Հզոր լիաքարշ ամենագնաց լեռնային արշավների, կիրճերի և բարձրադիր տեսարժան վայրերի համար։",
      en: "High-clearance full 4WD vehicle built for mountain trails, volcanic crater lakes, and remote monastic citadels.",
    },
  },
];

const EXTRA_SERVICES = [
  {
    id: "photographer",
    icon: "📸",
    title: { ru: "Профессиональный фотограф", hy: "Պրոֆեսիոնալ լուսանկարիչ", en: "Professional Photographer" },
    desc: {
      ru: "Съемка на лучших панорамных точках Армении и 50+ обработанных фото.",
      hy: "Նկարահանում լավագույն դիտակետերում և 50+ մշակված լուսանկարներ։",
      en: "High-end photography at iconic viewpoints with 50+ edited portraits.",
    },
  },
  {
    id: "drone",
    icon: "🚁",
    title: { ru: "Аэросъемка с квадрокоптера (дрон)", hy: "Անօդաչու թռչող սարք (դրոն)", en: "Drone 4K Aerial Videography" },
    desc: {
      ru: "Кинематографичные видео монастырей над ущельями и горных серпантинов.",
      hy: "Կինեմատոգրաֆիկ տեսանյութեր կիրճերի վրա վեր խոյացող վանքերից։",
      en: "Cinematic 4K aerial reels of mountain gorges and cliffside monasteries.",
    },
  },
  {
    id: "costumes",
    icon: "👗",
    title: { ru: "Подбор одежды / Тараз для фотосессии", hy: "Տարազ / Հագուստի ընտրություն", en: "Traditional Taraz & Dress Styling" },
    desc: {
      ru: "Армянский национальный костюм Тараз или стильные вечерние платья.",
      hy: "Ավանդական հայկական տարազ կամ նրբագեղ զգեստներ ֆոտոշարքի համար։",
      en: "Authentic Armenian historic Taraz garments or elegant styling attire.",
    },
  },
  {
    id: "lunch",
    icon: "🍽️",
    title: { ru: "Традиционный армянский обед / Гастро-тур", hy: "Ավանդական հայկական ճաշ", en: "Traditional Armenian Feast / Wine Tasting" },
    desc: {
      ru: "Шашлык в тондыре, свежевыпеченный лаваш, домашние сыры и дегустация вин Арени.",
      hy: "Թոնրի խորոված, տաք լավաշ, տնական պանիրներ և արենի գինու համտես։",
      en: "Tonir barbecue, fresh lavash baking, artisan cheeses, and Areni winery pairing.",
    },
  },
  {
    id: "tickets",
    icon: "🎟️",
    title: { ru: "Входные билеты и канатные дороги", hy: "Մուտքի տոմսեր և ճոպանուղի", en: "All Entry Tickets & Cable Cars" },
    desc: {
      ru: "Крылья Татева, Гарни, Звартноц, музеи — без очередей и ожидания.",
      hy: "ՏաԹևեր ճոպանուղի, Գառնի, Զվարթնոց, թանգարաններ՝ առանց հերթերի։",
      en: "Wings of Tatev ropeway, Garni temple, Zvartnots, and museum priority passes.",
    },
  },
  {
    id: "overnight",
    icon: "🏨",
    title: { ru: "Тур с ночевкой в горах / Бутик-отель", hy: "Գիշերակացով տուր / Բուտիկ հյուրանոց", en: "Overnight Mountain Lodge / Glamping" },
    desc: {
      ru: "Уютный отдых в Дилижане, Горисе или на берегу Севана при многодневном туре.",
      hy: "Հարմարավետ հանգիստ Դիլիջանում, Գորիսում կամ Սևանի ափին։",
      en: "Atmospheric boutique hotel or luxury glamping for multi-day itineraries.",
    },
  },
];

export default function IndividualTourBuilder({
  locale,
  attractions = [],
  fleet = [],
  site,
}: Props) {
  // Step 1: Customer details
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);

  // Step 2: Format
  const [withGuide, setWithGuide] = useState(true);
  const [withDriver, setWithDriver] = useState(true);

  // Step 3: Car category
  const [carCategory, setCarCategory] = useState<"standard" | "comfort" | "premium">("comfort");

  // Step 4: Locations
  const [selectedLocations, setSelectedLocations] = useState<string[]>([
    "Храм Гарни и Симфония камней",
    "Монастырь Гегард",
  ]);
  const [locationSearch, setLocationSearch] = useState("");
  const [activeRegion, setActiveRegion] = useState<string>("all");
  const [customLocationInput, setCustomLocationInput] = useState("");

  // Step 5: Extra services
  const [selectedServices, setSelectedServices] = useState<string[]>(["lunch"]);

  // Step 6: Wishes & Notes
  const [wishes, setWishes] = useState("");

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submittedBookingId, setSubmittedBookingId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedNotice, setCopiedNotice] = useState<string | null>(null);

  const todayIso = new Date().toISOString().split("T")[0];

  // Regions filter for attractions
  const regions: { id: string; label: Record<Locale, string> }[] = [
    { id: "all", label: { ru: "Все локации", hy: "Բոլորը", en: "All Locations" } },
    { id: "near_yerevan", label: { ru: "Рядом с Ереваном", hy: "Երևանի մոտ", en: "Near Yerevan" } },
    { id: "sevan_dilijan", label: { ru: "Севан & Дилижан", hy: "Սևան և Դիլիջան", en: "Sevan & Dilijan" } },
    { id: "south", label: { ru: "Юг (Нораванк, Татев)", hy: "Հարավ (Տաթև)", en: "South & Tatev" } },
    { id: "north_lori", label: { ru: "Север & Лори", hy: "Հյուսիս և Լոռի", en: "North & Lori" } },
  ];

  const filteredAttractions = useMemo(() => {
    return attractions.filter((a) => {
      const matchRegion = activeRegion === "all" || a.regionCategory === activeRegion;
      const title = a.name[locale] || a.name.ru;
      const matchSearch = !locationSearch || title.toLowerCase().includes(locationSearch.toLowerCase());
      return matchRegion && matchSearch;
    });
  }, [attractions, activeRegion, locationSearch, locale]);

  function toggleLocation(locName: string) {
    if (selectedLocations.includes(locName)) {
      setSelectedLocations(selectedLocations.filter((l) => l !== locName));
    } else {
      setSelectedLocations([...selectedLocations, locName]);
    }
  }

  function moveLocation(index: number, dir: -1 | 1) {
    const target = index + dir;
    if (target < 0 || target >= selectedLocations.length) return;
    const next = [...selectedLocations];
    const [moved] = next.splice(index, 1);
    next.splice(target, 0, moved);
    setSelectedLocations(next);
  }

  function removeLocation(index: number) {
    setSelectedLocations(selectedLocations.filter((_, i) => i !== index));
  }

  function addCustomLocation() {
    const val = customLocationInput.trim();
    if (!val) return;
    if (!selectedLocations.includes(val)) {
      setSelectedLocations([...selectedLocations, val]);
    }
    setCustomLocationInput("");
  }

  function toggleService(serviceId: string) {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((s) => s !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  }

  // Format strings for submission & preview
  const formatLabel = useMemo(() => {
    const parts = [];
    if (withGuide) parts.push(locale === "ru" ? "С гидом" : locale === "hy" ? "Գիդով" : "With Guide");
    if (withDriver) parts.push(locale === "ru" ? "С водителем" : locale === "hy" ? "Վարորդով" : "With Driver");
    return parts.length ? parts.join(" + ") : (locale === "ru" ? "По запросу" : "On request");
  }, [withGuide, withDriver, locale]);

  const carLabel = useMemo(() => {
    const car = CAR_OPTIONS.find((c) => c.id === carCategory);
    return car ? `${car.title[locale]} (${car.subtitle[locale]})` : carCategory;
  }, [carCategory, locale]);

  const servicesLabels = useMemo(() => {
    return selectedServices.map((id) => {
      const s = EXTRA_SERVICES.find((x) => x.id === id);
      return s ? s.title[locale] : id;
    });
  }, [selectedServices, locale]);

  // Handle Form Submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg(locale === "ru" ? "Пожалуйста, укажите ваше имя и фамилию." : "Please enter your name.");
      return;
    }

    if (!phone.trim() || phone.trim().length < 5) {
      setErrorMsg(locale === "ru" ? "Пожалуйста, укажите номер телефона или WhatsApp для связи." : "Please provide a contact phone number.");
      return;
    }

    if (!date) {
      setErrorMsg(locale === "ru" ? "Пожалуйста, выберите желаемую дату поездки." : "Please pick a tour date.");
      return;
    }

    if (selectedLocations.length === 0 && !wishes.trim()) {
      setErrorMsg(
        locale === "ru"
          ? "Пожалуйста, выберите хотя бы одну достопримечательность или укажите пожелание в поле деталей."
          : "Please select at least one attraction or write your custom route wishes."
      );
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        tourTitle: "Индивидуальный конструктор тура",
        name: name.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        telegram: telegram.trim(),
        email: email.trim(),
        date,
        adults,
        children,
        tourFormat: formatLabel,
        carCategory: carLabel,
        locations: selectedLocations,
        services: servicesLabels,
        wishes: wishes.trim(),
      };

      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data.error || (locale === "ru" ? "Ошибка отправки. Попробуйте снова." : "Submission failed."));
      }

      setSubmittedBookingId(data.bookingId || `AMR-${Date.now().toString().slice(-6)}`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      setErrorMsg(err.message || (locale === "ru" ? "Произошла ошибка при отправке заявки." : "An error occurred."));
    } finally {
      setSubmitting(false);
    }
  }

  // Pre-filled Messenger links and text
  const cleanPhone = (site.phone || "").replace(/[^\d+]/g, "");
  const telegramUsername = (site.telegram || "amaras_tour_armenia").replace(/^@/, "");
  const instagramUsername = (site.instagram || "amarastourarmenia").replace(/^@/, "");

  const plainSummaryText =
    `Здравствуйте, Amaras Tour! Хочу заказать индивидуальный тур (Заявка #${submittedBookingId || ""}):\n` +
    `👤 Заказчик: ${name}\n` +
    `📞 Телефон: ${phone}\n` +
    (telegram.trim() ? `✈️ Telegram: ${telegram.trim()}\n` : "") +
    (whatsapp.trim() ? `💬 WhatsApp: ${whatsapp.trim()}\n` : "") +
    `📅 Дата: ${date}\n` +
    `👥 Гости: ${adults} взр. ${children ? `+ ${children} дет.` : ""}\n` +
    `🧭 Формат: ${formatLabel}\n` +
    `🚗 Автомобиль: ${carLabel}\n` +
    `🗺 Маршрут:\n${selectedLocations.map((l, i) => `${i + 1}. ${l}`).join("\n")}\n` +
    (servicesLabels.length ? `✨ Доп. услуги: ${servicesLabels.join(", ")}\n` : "") +
    (wishes.trim() ? `💬 Пожелания: ${wishes.trim()}\n` : "");

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(plainSummaryText)}`;
  const telegramUrl = `https://t.me/${telegramUsername}`;
  const instagramUrl = `https://instagram.com/${instagramUsername}`;

  function copyAndNotify(platformName: string) {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(plainSummaryText).catch(() => {});
      setCopiedNotice(
        locale === "ru"
          ? `Текст заявки скопирован! Открываем ${platformName} — вставьте его в диалог.`
          : `Itinerary copied! Opening ${platformName} — paste it in the chat.`
      );
      setTimeout(() => setCopiedNotice(null), 5000);
    }
  }

  // Success Screen
  if (submittedBookingId) {
    return (
      <div className="mx-auto max-w-[860px] px-4 py-12 sm:py-16 text-center">
        <div className="rounded-3xl border border-[#C7FF32]/30 bg-[#242323] p-6 sm:p-12 shadow-2xl">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-[#C7FF32]/20 text-4xl mb-6">
            🎉
          </div>
          <span className="rounded-full bg-[#C7FF32]/10 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[#C7FF32]">
            {locale === "ru" ? "Заявка успешно принята" : locale === "hy" ? "Հայտը հաջողությամբ ընդունված է" : "Request Received"}
          </span>
          <h2 className="mt-4 font-serif text-2xl sm:text-4xl font-bold text-[#FCFCF7]">
            {locale === "ru"
              ? `Спасибо, ${name}! Номер заявки: ${submittedBookingId}`
              : `Thank you, ${name}! Request #${submittedBookingId}`}
          </h2>
          <p className="mt-3 text-xs sm:text-base leading-relaxed text-[#FCFCF7]/80 max-w-xl mx-auto">
            {locale === "ru"
              ? "Мы уже получили ваши пожелания по индивидуальному маршруту и автомобилю. Наш оператор свяжется с вами в течение 10–15 минут для согласования программы и деталей."
              : "We have received your custom tour itinerary. Our tour specialist will contact you within 10–15 minutes to confirm all details."}
          </p>

          {/* Duplication to Messengers */}
          <div className="mt-8 rounded-2xl bg-[#1C1B1B]/80 border border-white/10 p-5 sm:p-6 text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-[#C7FF32] text-center mb-4">
              {locale === "ru"
                ? "Хотите быстрый ответ прямо сейчас? Продублируйте заявку в удобный мессенджер:"
                : locale === "hy"
                ? "Ցանկանու՞մ եք ակնթարթային պատասխան․ կրկնօրինակեք հայտը ձեզ հարմար մեսենջերում՝"
                : "Want an instant response? Duplicate your request to your preferred messenger:"}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
              {/* 1. WhatsApp */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-4 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{locale === "ru" ? "В WhatsApp" : "WhatsApp"}</span>
              </a>

              {/* 2. Telegram */}
              <a
                href={telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyAndNotify("Telegram")}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-[#229ED9] px-4 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <TelegramIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{locale === "ru" ? "В Telegram" : "Telegram"}</span>
              </a>

              {/* 3. Instagram */}
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => copyAndNotify("Instagram Direct")}
                className="inline-flex items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-[#f09433] via-[#dc2743] to-[#bc1888] px-4 py-3.5 text-xs sm:text-sm font-black uppercase tracking-wider text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
              >
                <InstagramIcon className="h-5 w-5 shrink-0" />
                <span className="truncate">{locale === "ru" ? "В Instagram" : "Instagram"}</span>
              </a>
            </div>

            {copiedNotice && (
              <div className="mt-4 p-2.5 rounded-xl bg-[#C7FF32]/15 border border-[#C7FF32]/30 text-xs text-center font-bold text-[#C7FF32]">
                📋 {copiedNotice}
              </div>
            )}
          </div>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => {
                setSubmittedBookingId(null);
                window.location.reload();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-[#FCFCF7] hover:bg-white/10 transition-colors"
            >
              <span>{locale === "ru" ? "Создать новый маршрут" : "Build Another Tour"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Builder Steps (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* STEP 1: Traveler Details */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7FF32] text-xs font-black text-[#312F2F]">
                  1
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {locale === "ru" ? "Информация о вас и дате тура" : locale === "hy" ? "Տեղեկություններ ձեր և ամսաթվի մասին" : "Guest & Date Details"}
                  </h3>
                  <p className="text-xs text-[#FCFCF7]/60">
                    {locale === "ru" ? "Укажите контактные данные для согласования маршрута" : "Provide contact information for trip coordination"}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#FCFCF7]/80 mb-1.5">
                    {locale === "ru" ? "Имя и Фамилия *" : "Full Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={locale === "ru" ? "Артур Петросян" : "Artur Petrosyan"}
                    className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3 text-sm text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FCFCF7]/80 mb-1.5">
                      {locale === "ru" ? "Номер телефона *" : "Phone Number *"}
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+374 91 000000"
                      className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3 text-sm text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FCFCF7]/80 mb-1.5">
                      WhatsApp {locale === "ru" ? "(если отличается)" : "(if different)"}
                    </label>
                    <input
                      type="tel"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="+7 999 000-00-00"
                      className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3 text-sm text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FCFCF7]/80 mb-1.5">
                      Telegram (username)
                    </label>
                    <input
                      type="text"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      placeholder="@username"
                      className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3 text-sm text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#FCFCF7]/80 mb-1.5">
                      {locale === "ru" ? "Желаемая дата поездки *" : "Preferred Tour Date *"}
                    </label>
                    <input
                      type="date"
                      required
                      min={todayIso}
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3 text-sm text-[#FCFCF7] focus:border-[#C7FF32] focus:outline-none [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Counters for Adults & Children */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3">
                    <span className="text-xs sm:text-sm font-bold text-[#FCFCF7]">
                      {locale === "ru" ? "Взрослые" : locale === "hy" ? "Մեծահասակներ" : "Adults"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setAdults(Math.max(1, adults - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-[#FCFCF7] hover:bg-white/20 active:scale-95"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-black text-[#C7FF32]">
                        {adults}
                      </span>
                      <button
                        type="button"
                        onClick={() => setAdults(adults + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-[#FCFCF7] hover:bg-white/20 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-2xl border border-white/15 bg-[#1C1B1B] px-4 py-3">
                    <span className="text-xs sm:text-sm font-bold text-[#FCFCF7]">
                      {locale === "ru" ? "Дети (до 12 лет)" : locale === "hy" ? "Երեխաներ" : "Children"}
                    </span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setChildren(Math.max(0, children - 1))}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-[#FCFCF7] hover:bg-white/20 active:scale-95"
                      >
                        −
                      </button>
                      <span className="w-5 text-center text-sm font-black text-[#C7FF32]">
                        {children}
                      </span>
                      <button
                        type="button"
                        onClick={() => setChildren(children + 1)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-base font-bold text-[#FCFCF7] hover:bg-white/20 active:scale-95"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* STEP 2: Travel Format */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7FF32] text-xs font-black text-[#312F2F]">
                  2
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {locale === "ru" ? "Формат путешествия" : locale === "hy" ? "Ճամփորդության ձևաչափը" : "Travel Format"}
                  </h3>
                  <p className="text-xs text-[#FCFCF7]/60">
                    {locale === "ru" ? "Выберите нужные опции сопровождения (можно обе)" : "Select desired travel options (one or both)"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setWithGuide(!withGuide)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    withGuide
                      ? "border-[#C7FF32] bg-[#C7FF32]/10 shadow-md"
                      : "border-white/15 bg-[#1C1B1B] hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🎙️</span>
                    <span
                      className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs font-black ${
                        withGuide
                          ? "border-[#C7FF32] bg-[#C7FF32] text-[#312F2F]"
                          : "border-white/30"
                      }`}
                    >
                      {withGuide ? "✓" : ""}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
                    {locale === "ru" ? "Тур с гидом-экскурсоводом" : locale === "hy" ? "Տուր պրոֆեսիոնալ գիդով" : "Tour with Private Guide"}
                  </h4>
                  <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
                    {locale === "ru"
                      ? "Глубокое погружение в историю, культуру, легенды и обычаи Армении."
                      : "Engaging storytelling, history, and cultural context at every landmark."}
                  </p>
                </div>

                <div
                  onClick={() => setWithDriver(!withDriver)}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    withDriver
                      ? "border-[#C7FF32] bg-[#C7FF32]/10 shadow-md"
                      : "border-white/15 bg-[#1C1B1B] hover:border-white/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">🚗</span>
                    <span
                      className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs font-black ${
                        withDriver
                          ? "border-[#C7FF32] bg-[#C7FF32] text-[#312F2F]"
                          : "border-white/30"
                      }`}
                    >
                      {withDriver ? "✓" : ""}
                    </span>
                  </div>
                  <h4 className="font-bold text-[#FCFCF7] text-sm sm:text-base">
                    {locale === "ru" ? "Тур с опытным водителем" : locale === "hy" ? "Տուր փորձառու վարորդով" : "Tour with Chauffeur"}
                  </h4>
                  <p className="mt-1 text-xs text-[#FCFCF7]/70 leading-relaxed">
                    {locale === "ru"
                      ? "Свободное путешествие в своём темпе без спешки и строгих таймингов."
                      : "Carefree private transport at your own comfortable pace with photo stops."}
                  </p>
                </div>
              </div>
            </div>

            {/* STEP 3: Vehicle Selection */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7FF32] text-xs font-black text-[#312F2F]">
                  3
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {locale === "ru" ? "Выбор категории автомобиля" : locale === "hy" ? "Ավտոմեքենայի դասի ընտրություն" : "Vehicle Category Selection"}
                  </h3>
                  <p className="text-xs text-[#FCFCF7]/60">
                    {locale === "ru" ? "Все автомобили оснащены климат-контролем и чистым салоном" : "All vehicles feature full AC and pristine interior"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {CAR_OPTIONS.map((car) => {
                  const isSelected = carCategory === car.id;
                  return (
                    <div
                      key={car.id}
                      onClick={() => setCarCategory(car.id)}
                      className={`cursor-pointer overflow-hidden rounded-2xl border transition-all ${
                        isSelected
                          ? "border-[#C7FF32] ring-2 ring-[#C7FF32]/50 bg-[#1C1B1B] shadow-lg scale-[1.02]"
                          : "border-white/15 bg-[#1C1B1B] hover:border-white/30 opacity-80 hover:opacity-100"
                      }`}
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-black/40">
                        <Image
                          src={car.image}
                          alt={car.title[locale]}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                          unoptimized
                        />
                        <span className="absolute top-2 left-2 rounded-full bg-black/70 backdrop-blur-md px-2 py-0.5 text-[10px] font-black text-[#C7FF32]">
                          {car.seats}
                        </span>
                        {isSelected && (
                          <span className="absolute top-2 right-2 rounded-full bg-[#C7FF32] px-2 py-0.5 text-[10px] font-black text-[#312F2F]">
                            ✓ Выбрано
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h4 className="font-bold text-[#FCFCF7] text-sm">
                          {car.title[locale]}
                        </h4>
                        <p className="text-[11px] font-semibold text-[#C7FF32] mt-0.5">
                          {car.subtitle[locale]}
                        </p>
                        <p className="mt-2 text-xs text-[#FCFCF7]/70 leading-relaxed line-clamp-3">
                          {car.desc[locale]}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 4: Locations & Route Planner */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7FF32] text-xs font-black text-[#312F2F]">
                  4
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {locale === "ru" ? "Выбор локаций и маршрута" : locale === "hy" ? "Երթուղու և վայրերի ընտրություն" : "Locations & Itinerary Planner"}
                  </h3>
                  <p className="text-xs text-[#FCFCF7]/60">
                    {locale === "ru" ? "Нажимайте на достопримечательности, чтобы добавить их в тур" : "Click attractions to add them to your custom journey"}
                  </p>
                </div>
              </div>

              {/* Selected Route Order */}
              <div className="mb-6 rounded-2xl border border-white/15 bg-[#1C1B1B] p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-black uppercase tracking-wider text-[#C7FF32]">
                    {locale === "ru" ? "Ваш текущий маршрут:" : "Your Selected Route:"} ({selectedLocations.length})
                  </span>
                  {selectedLocations.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSelectedLocations([])}
                      className="text-[11px] text-[#FCFCF7]/50 hover:text-red-400 cursor-pointer"
                    >
                      {locale === "ru" ? "Очистить список" : "Clear all"}
                    </button>
                  )}
                </div>

                {selectedLocations.length === 0 ? (
                  <p className="py-4 text-center text-xs text-[#FCFCF7]/40">
                    {locale === "ru" ? "Пока не выбрано ни одной точки. Выберите из каталога ниже или впишите своё место." : "No locations selected yet. Choose from below."}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {selectedLocations.map((locName, index) => (
                      <div
                        key={`${locName}-${index}`}
                        className="flex items-center justify-between gap-2 rounded-xl bg-white/5 border border-white/10 p-2.5 sm:px-3.5"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#C7FF32] text-[10px] font-black text-[#312F2F]">
                            {index + 1}
                          </span>
                          <span className="text-xs sm:text-sm font-bold text-[#FCFCF7] truncate">
                            {locName}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveLocation(index, -1)}
                            className="p-1 text-xs text-[#FCFCF7]/60 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Выше"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={index === selectedLocations.length - 1}
                            onClick={() => moveLocation(index, 1)}
                            className="p-1 text-xs text-[#FCFCF7]/60 hover:text-white disabled:opacity-20 cursor-pointer"
                            title="Ниже"
                          >
                            ▼
                          </button>
                          <button
                            type="button"
                            onClick={() => removeLocation(index)}
                            className="p-1 text-xs text-red-400 hover:text-red-300 cursor-pointer ml-1"
                            title="Удалить"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add Custom Location Input */}
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addCustomLocation();
                      }
                    }}
                    placeholder={locale === "ru" ? "Вписать своё место (например, Винодельня в Арени)..." : "Add custom destination..."}
                    className="flex-1 rounded-xl border border-white/15 bg-black/40 px-3.5 py-2 text-xs text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={addCustomLocation}
                    className="shrink-0 rounded-xl bg-[#C7FF32] px-4 py-2 text-xs font-black text-[#312F2F] hover:bg-[#b5eb2a]"
                  >
                    + Добавить
                  </button>
                </div>
              </div>

              {/* Regions Filter & Search */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2 justify-between">
                  <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {regions.map((reg) => (
                      <button
                        key={reg.id}
                        type="button"
                        onClick={() => setActiveRegion(reg.id)}
                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-colors cursor-pointer ${
                          activeRegion === reg.id
                            ? "bg-[#C7FF32] text-[#312F2F]"
                            : "bg-[#1C1B1B] text-[#FCFCF7]/70 hover:text-white border border-white/10"
                        }`}
                      >
                        {reg.label[locale]}
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    placeholder={locale === "ru" ? "Поиск места..." : "Search landmark..."}
                    className="rounded-full border border-white/15 bg-[#1C1B1B] px-3.5 py-1 text-xs text-[#FCFCF7] placeholder-[#FCFCF7]/40 focus:border-[#C7FF32] focus:outline-none"
                  />
                </div>

                {/* Available Attractions Pills / Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[360px] overflow-y-auto pr-1 scrollbar-thin">
                  {filteredAttractions.map((attraction) => {
                    const title = attraction.name[locale] || attraction.name.ru;
                    const isAdded = selectedLocations.includes(title);

                    return (
                      <div
                        key={attraction.id}
                        onClick={() => toggleLocation(title)}
                        className={`cursor-pointer flex items-center justify-between gap-3 p-3 rounded-2xl border transition-all ${
                          isAdded
                            ? "border-[#C7FF32] bg-[#C7FF32]/10"
                            : "border-white/10 bg-[#1C1B1B] hover:border-white/25 hover:bg-white/[0.04]"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/30">
                            <Image
                              src={attraction.image}
                              alt={title}
                              fill
                              className="object-cover"
                              sizes="48px"
                              unoptimized={attraction.image.startsWith("http")}
                            />
                          </div>
                          <div className="min-w-0">
                            <h5 className="font-bold text-xs sm:text-sm text-[#FCFCF7] truncate">
                              {title}
                            </h5>
                            <span className="text-[10px] text-[#FCFCF7]/60 block truncate">
                              {attraction.region?.[locale] || attraction.region?.ru}
                            </span>
                          </div>
                        </div>

                        <span
                          className={`shrink-0 flex h-6 w-6 items-center justify-center rounded-full text-xs font-black ${
                            isAdded
                              ? "bg-[#C7FF32] text-[#312F2F]"
                              : "border border-white/30 text-[#FCFCF7]/60"
                          }`}
                        >
                          {isAdded ? "✓" : "+"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* STEP 5: Additional Services */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C7FF32] text-xs font-black text-[#312F2F]">
                  5
                </span>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-[#FCFCF7]">
                    {locale === "ru" ? "Дополнительные услуги" : locale === "hy" ? "Լրացուցիչ ծառայություններ" : "Extra Tour Services"}
                  </h3>
                  <p className="text-xs text-[#FCFCF7]/60">
                    {locale === "ru" ? "Сделайте поездку еще более яркой и комфортной" : "Enhance your journey with photo, dining, or experiences"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EXTRA_SERVICES.map((srv) => {
                  const isChecked = selectedServices.includes(srv.id);
                  return (
                    <div
                      key={srv.id}
                      onClick={() => toggleService(srv.id)}
                      className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                        isChecked
                          ? "border-[#C7FF32] bg-[#C7FF32]/10"
                          : "border-white/15 bg-[#1C1B1B] hover:border-white/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xl">{srv.icon}</span>
                        <span
                          className={`h-5 w-5 rounded-md border flex items-center justify-center text-xs font-black ${
                            isChecked
                              ? "border-[#C7FF32] bg-[#C7FF32] text-[#312F2F]"
                              : "border-white/30"
                          }`}
                        >
                          {isChecked ? "✓" : ""}
                        </span>
                      </div>
                      <h4 className="font-bold text-[#FCFCF7] text-xs sm:text-sm">
                        {srv.title[locale]}
                      </h4>
                      <p className="mt-1 text-[11px] text-[#FCFCF7]/70 leading-relaxed">
                        {srv.desc[locale]}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 6: Custom Wishes / Notes */}
            <div className="rounded-3xl border border-white/10 bg-[#242323] p-6 sm:p-8 shadow-sm">
              <label className="block text-sm font-bold text-[#FCFCF7] mb-2">
                {locale === "ru" ? "Особые пожелания или вопросы" : "Special Requests or Questions"}
              </label>
              <textarea
                rows={3}
                value={wishes}
                onChange={(e) => setWishes(e.target.value)}
                placeholder={
                  locale === "ru"
                    ? "Например: хотим заехать на закат в Хор Вирап, нужно детское кресло на 3 года, предпочитаем рыбный ресторан на Севане..."
                    : "E.g. We want to catch the sunset at Khor Virap, need a child seat for 3yo, prefer a lakeside trout lunch..."
                }
                className="w-full rounded-2xl border border-white/15 bg-[#1C1B1B] p-4 text-xs sm:text-sm text-[#FCFCF7] placeholder-[#FCFCF7]/30 focus:border-[#C7FF32] focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Live Summary / "Your Tour Request" (5 Cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-3xl border-2 border-[#C7FF32]/40 bg-gradient-to-b from-[#282727] to-[#1E1D1D] p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-28 h-28 bg-[#C7FF32]/10 rounded-full blur-2xl pointer-events-none" />

              <span className="rounded-full bg-[#C7FF32]/15 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-[#C7FF32] border border-[#C7FF32]/30">
                {locale === "ru" ? "Живой предпросмотр" : "Live Preview"}
              </span>

              <h3 className="mt-2 font-serif text-2xl font-bold text-[#FCFCF7]">
                {locale === "ru" ? "Ваша заявка на тур" : locale === "hy" ? "Ձեր տուրի հայտը" : "Your Tour Request"}
              </h3>
              <p className="text-xs text-[#FCFCF7]/60 mt-1">
                {locale === "ru" ? "Проверьте все параметры перед отправкой оператору" : "Review your selections before dispatching to operator"}
              </p>

              {/* Summary Items */}
              <div className="mt-6 space-y-4 text-xs border-t border-white/10 pt-5">
                {/* Guest */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#FCFCF7]/60 shrink-0">{locale === "ru" ? "Заказчик:" : "Client:"}</span>
                  <span className="font-bold text-[#FCFCF7] text-right truncate">
                    {name.trim() || <span className="text-[#FCFCF7]/30">Не указано</span>}
                  </span>
                </div>

                {/* Contacts */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#FCFCF7]/60 shrink-0">{locale === "ru" ? "Связь:" : "Contact:"}</span>
                  <span className="font-bold text-[#FCFCF7] text-right truncate">
                    {phone.trim() || <span className="text-[#FCFCF7]/30">Укажите телефон</span>}
                    {telegram.trim() && ` (${telegram.trim()})`}
                  </span>
                </div>

                {/* Date & Guests */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#FCFCF7]/60 shrink-0">{locale === "ru" ? "Дата и гости:" : "Date & Guests:"}</span>
                  <span className="font-bold text-[#FCFCF7] text-right">
                    {date || <span className="text-[#FCFCF7]/30">Дата не выбрана</span>} • {adults} взр.
                    {children > 0 && ` + ${children} дет.`}
                  </span>
                </div>

                {/* Format */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#FCFCF7]/60 shrink-0">{locale === "ru" ? "Формат:" : "Format:"}</span>
                  <span className="font-bold text-[#C7FF32] text-right">{formatLabel}</span>
                </div>

                {/* Car */}
                <div className="flex items-start justify-between gap-3">
                  <span className="text-[#FCFCF7]/60 shrink-0">{locale === "ru" ? "Автомобиль:" : "Vehicle:"}</span>
                  <span className="font-bold text-[#FCFCF7] text-right">{carLabel}</span>
                </div>

                {/* Route Itinerary */}
                <div className="border-t border-white/10 pt-3">
                  <span className="text-[#C7FF32] font-black uppercase tracking-wider text-[11px] block mb-2">
                    {locale === "ru" ? "Маршрут тура:" : "Itinerary:"} ({selectedLocations.length})
                  </span>
                  {selectedLocations.length === 0 ? (
                    <span className="text-[#FCFCF7]/30 italic">Локации не выбраны</span>
                  ) : (
                    <ol className="space-y-1.5 pl-4 list-decimal text-[#FCFCF7]">
                      {selectedLocations.map((l, i) => (
                        <li key={i} className="font-medium text-xs leading-tight">
                          {l}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>

                {/* Extra Services */}
                {servicesLabels.length > 0 && (
                  <div className="border-t border-white/10 pt-3">
                    <span className="text-[#C7FF32] font-black uppercase tracking-wider text-[11px] block mb-1.5">
                      {locale === "ru" ? "Доп. услуги:" : "Extra Services:"}
                    </span>
                    <ul className="space-y-1 text-[#FCFCF7]/90">
                      {servicesLabels.map((s, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-[#C7FF32]">✓</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Custom Notes */}
                {wishes.trim() && (
                  <div className="border-t border-white/10 pt-3">
                    <span className="text-[#FCFCF7]/60 block mb-1">{locale === "ru" ? "Пожелания:" : "Notes:"}</span>
                    <p className="text-xs text-[#FCFCF7]/90 italic bg-black/20 p-2.5 rounded-xl border border-white/5">
                      {wishes.trim()}
                    </p>
                  </div>
                )}
              </div>

              {/* Error feedback */}
              {errorMsg && (
                <div className="mt-5 rounded-2xl bg-red-500/20 border border-red-500/40 p-3 text-xs text-red-200">
                  ⚠️ {errorMsg}
                </div>
              )}

              {/* Submit CTA */}
              <div className="mt-6 space-y-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#C7FF32] px-6 py-4 text-xs sm:text-sm font-black uppercase tracking-wider text-[#312F2F] shadow-xl transition-all hover:bg-[#b5eb2a] hover:scale-[1.02] active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    <span>{locale === "ru" ? "Отправка заявки…" : "Sending Request…"}</span>
                  ) : (
                    <>
                      <span>{locale === "ru" ? "Отправить заявку оператору" : "Send Tour Request"}</span>
                      <span className="text-base font-black">→</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-[#FCFCF7]/50">
                  {locale === "ru"
                    ? "Нажимая кнопку, вы отправляете заявку напрямую туроператору Amaras Tour. Ответ в течение 10–15 минут."
                    : "No payment required now. Our tour specialist will respond within 10-15 minutes."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
