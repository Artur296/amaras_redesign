export const locales = ["ru", "hy", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const ogLocales: Record<Locale, string> = {
  ru: "ru_RU",
  hy: "hy_AM",
  en: "en_US",
};

const ru = {
  nav: {
    home: "Главная",
    about: "О нас",
    tours: "Туры",
    contacts: "Контакты",
  },
  hero: {
    title: "Откройте для себя Армению",
    subtitle:
      "Тур-пакеты, индивидуальные и групповые экскурсии по самым красивым уголкам Армении с местными гидами",
    ctaTours: "Смотреть туры",
    ctaWrite: "Написать нам",
    imageAlt: "Монастырь Хор Вирап на фоне горы Арарат",
  },
  stats: [
    { value: "9", label: "маршрутов по Армении" },
    { value: "10+", label: "лет опыта" },
    { value: "24/7", label: "на связи с вами" },
  ],
  categories: {
    title: "Категории туров",
  },
  featured: { title: "Популярные туры", all: "Все туры" },
  why: {
    title: "Почему Amaras Tour",
    items: [
      {
        title: "Местные гиды",
        desc: "Наши гиды родились и выросли в Армении и знают её как никто другой.",
      },
      {
        title: "Комфортный транспорт",
        desc: "Современные внедорожники и минивэны с кондиционером.",
      },
      {
        title: "Прозрачные цены",
        desc: "Никаких скрытых доплат — всё включено в стоимость тура.",
      },
    ],
  },
  cta: {
    title: "Готовы к путешествию?",
    subtitle: "Напишите нам — подберём тур под ваши даты и пожелания.",
  },
  tours: {
    title: "Наши туры",
    from: "от",
    hours: "ч",
    days: "дн.",
    nights: "ноч.",
    viewAll: "Смотреть туры",
    book: "Забронировать",
    bookMessage: "Здравствуйте! Меня интересует тур:",
  },
  tour: {
    route: "Маршрут",
    duration: "Длительность",
    departure: "Выезд",
    itinerary: "Программа по дням",
    day: "День",
    accommodation: "Проживание",
    perPerson: "с человека",
    back: "Все туры",
  },
  // Wording used everywhere a multi-day package is shown, so it never reads
  // like a one-day excursion.
  pkg: {
    badge: "Тур-пакет",
    allInclusive: "Всё включено",
    perPerson: "с человека",
    program: "Программа",
    intro:
      "Это не однодневная экскурсия, а готовое путешествие на несколько дней: проживание, трансферы, гид и все экскурсии уже включены в стоимость.",
    includesTitle: "Уже включено в цену пакета",
    includes: {
      hotel: "Отель и завтраки",
      transfers: "Все трансферы",
      guide: "Гид на весь маршрут",
      tickets: "Входные билеты",
    },
    viewProgram: "Смотреть программу",
  },
  about: {
    title: "О нас",
    paragraphs: [
      "Amaras Tour — местная туристическая компания, которая показывает Армению так, как здесь принято принимать гостей: с теплом, уважением и искренней заботой.",
      "Мы создаём путешествия для разных запросов — от доступных и продуманных маршрутов до индивидуальных и премиальных туров с повышенным уровнем сервиса. При этом для нас неизменно важны качество, комфорт и человеческое отношение к каждому гостю.",
      "Более 10 лет опыта, профессиональная команда гидов и водителей, надёжный транспорт и внимание к деталям позволяют нам создавать поездки, которые запоминаются не только красивыми местами, но и атмосферой.",
    ],
  },
  contacts: {
    title: "Контакты",
    subtitle: "Напишите нам в WhatsApp или Telegram — ответим быстро.",
    phone: "Телефон",
    email: "Эл. почта",
    follow: "Мы в соцсетях",
    address: "Ереван, Армения",
  },
  footer: {
    tagline: "Путешествия по Армении",
    rights: "Все права защищены.",
  },
  meta: {
    home: {
      title: "Amaras Tour — туры и экскурсии по Армении",
      description:
        "Тур-пакеты, индивидуальные и групповые экскурсии по Армении: Хор Вирап, Татев, Севан, Гарни. Местные гиды, комфортный транспорт, честные цены.",
    },
    about: {
      title: "О нас",
      description:
        "Amaras Tour — команда местных гидов и водителей. Организуем туры по всей Армении.",
    },
    tours: {
      title: "Туры по Армении",
      description:
        "Все туры Amaras Tour: тур-пакеты, индивидуальные и групповые экскурсии по Армении с ценами.",
    },
    contacts: {
      title: "Контакты",
      description:
        "Свяжитесь с Amaras Tour: WhatsApp, Telegram, Instagram, телефон. Подберём тур под ваши даты.",
    },
  },
};

export type Dict = typeof ru;

const hy: Dict = {
  nav: {
    home: "Գլխավոր",
    about: "Մեր մասին",
    tours: "Տուրեր",
    contacts: "Կապ",
  },
  hero: {
    title: "Բացահայտեք Հայաստանը",
    subtitle:
      "Տուր փաթեթներ, անհատական և խմբային էքսկուրսիաներ Հայաստանի ամենագեղեցիկ վայրերով՝ տեղացի գիդերի հետ",
    ctaTours: "Դիտել տուրերը",
    ctaWrite: "Գրել մեզ",
    imageAlt: "Խոր Վիրապ վանքը Արարատ լեռան ֆոնին",
  },
  stats: [
    { value: "9", label: "երթուղի Հայաստանով" },
    { value: "10+", label: "տարվա փորձ" },
    { value: "24/7", label: "կապի մեջ ենք" },
  ],
  categories: {
    title: "Տուրերի տեսակները",
  },
  featured: { title: "Հանրաճանաչ տուրեր", all: "Բոլոր տուրերը" },
  why: {
    title: "Ինչու՞ Amaras Tour",
    items: [
      {
        title: "Տեղացի գիդեր",
        desc: "Մեր գիդերը ծնվել և մեծացել են Հայաստանում և գիտեն այն ինչպես ոչ ոք։",
      },
      {
        title: "Հարմարավետ տրանսպորտ",
        desc: "Ժամանակակից ամենագնացներ և մինիվեններ՝ օդորակիչով։",
      },
      {
        title: "Թափանցիկ գներ",
        desc: "Ոչ մի թաքնված վճար՝ ամեն ինչ ներառված է տուրի արժեքում։",
      },
    ],
  },
  cta: {
    title: "Պատրա՞ստ եք ճամփորդության",
    subtitle: "Գրեք մեզ՝ կընտրենք տուր ձեր օրերի և ցանկությունների համար։",
  },
  tours: {
    title: "Մեր տուրերը",
    from: "սկսած",
    hours: "ժ",
    days: "օր",
    nights: "գիշեր",
    viewAll: "Դիտել տուրերը",
    book: "Ամրագրել",
    bookMessage: "Բարև ձեզ, ինձ հետաքրքրում է այս տուրը՝",
  },
  tour: {
    route: "Երթուղի",
    duration: "Տևողություն",
    departure: "Մեկնում",
    itinerary: "Ծրագիր ըստ օրերի",
    day: "Օր",
    accommodation: "Կեցություն",
    perPerson: "մեկ անձի համար",
    back: "Բոլոր տուրերը",
  },
  pkg: {
    badge: "Տուր փաթեթ",
    allInclusive: "Ամեն ինչ ներառված է",
    perPerson: "մեկ անձի համար",
    program: "Ծրագիր",
    intro:
      "Սա մեկօրյա էքսկուրսիա չէ, այլ պատրաստի բազմօրյա ճամփորդություն՝ կեցությունը, տրանսֆերները, գիդը և բոլոր էքսկուրսիաներն արդեն ներառված են արժեքի մեջ։",
    includesTitle: "Փաթեթի գնի մեջ արդեն ներառված է",
    includes: {
      hotel: "Հյուրանոց և նախաճաշեր",
      transfers: "Բոլոր տրանսֆերները",
      guide: "Գիդ ամբողջ երթուղու ընթացքում",
      tickets: "Մուտքի տոմսեր",
    },
    viewProgram: "Դիտել ծրագիրը",
  },
  about: {
    title: "Մեր մասին",
    paragraphs: [
      "Amaras Tour-ը տեղական տուրիստական ընկերություն է, որը ցույց է տալիս Հայաստանն այնպես, ինչպես այստեղ ընդունված է հյուրեր ընդունել՝ ջերմությամբ, հարգանքով և անկեղծ հոգատարությամբ։",
      "Մենք ստեղծում ենք ճամփորդություններ տարբեր պահանջների համար՝ մատչելի և մտածված երթուղիներից մինչև անհատական ու պրեմիում տուրեր՝ սպասարկման բարձր մակարդակով։ Մեզ համար միշտ կարևոր են որակը, հարմարավետությունը և մարդկային վերաբերմունքը յուրաքանչյուր հյուրի նկատմամբ։",
      "Ավելի քան 10 տարվա փորձը, գիդերի և վարորդների պրոֆեսիոնալ թիմը, հուսալի տրանսպորտը և ուշադրությունը մանրուքներին թույլ են տալիս ստեղծել ուղևորություններ, որոնք հիշվում են ոչ միայն գեղեցիկ վայրերով, այլև մթնոլորտով։",
    ],
  },
  contacts: {
    title: "Կապ",
    subtitle: "Գրեք մեզ WhatsApp-ում կամ Telegram-ում՝ կպատասխանենք արագ։",
    phone: "Հեռախոս",
    email: "Էլ. փոստ",
    follow: "Մենք սոցցանցերում",
    address: "Երևան, Հայաստան",
  },
  footer: {
    tagline: "Ճամփորդություններ Հայաստանով",
    rights: "Բոլոր իրավունքները պաշտպանված են։",
  },
  meta: {
    home: {
      title: "Amaras Tour — տուրեր և էքսկուրսիաներ Հայաստանով",
      description:
        "Տուր փաթեթներ, անհատական և խմբային էքսկուրսիաներ Հայաստանով՝ Խոր Վիրապ, Տաթև, Սևան, Գառնի։ Տեղացի գիդեր, հարմարավետ տրանսպորտ, ազնիվ գներ։",
    },
    about: {
      title: "Մեր մասին",
      description:
        "Amaras Tour-ը տեղացի գիդերի և վարորդների թիմ է։ Կազմակերպում ենք տուրեր ամբողջ Հայաստանով։",
    },
    tours: {
      title: "Տուրեր Հայաստանով",
      description:
        "Amaras Tour-ի բոլոր տուրերը՝ տուր փաթեթներ, անհատական և խմբային էքսկուրսիաներ՝ գներով։",
    },
    contacts: {
      title: "Կապ",
      description:
        "Կապվեք Amaras Tour-ի հետ՝ WhatsApp, Telegram, Instagram, հեռախոս։",
    },
  },
};

const en: Dict = {
  nav: {
    home: "Home",
    about: "About Us",
    tours: "Tours",
    contacts: "Contacts",
  },
  hero: {
    title: "Discover Armenia",
    subtitle:
      "Tour packages, private and group excursions to the most beautiful corners of Armenia with local guides",
    ctaTours: "Browse tours",
    ctaWrite: "Message us",
    imageAlt: "Khor Virap monastery with Mount Ararat in the background",
  },
  stats: [
    { value: "9", label: "routes across Armenia" },
    { value: "10+", label: "years of experience" },
    { value: "24/7", label: "always in touch" },
  ],
  categories: {
    title: "Tour categories",
  },
  featured: { title: "Popular tours", all: "All tours" },
  why: {
    title: "Why Amaras Tour",
    items: [
      {
        title: "Local guides",
        desc: "Our guides were born and raised in Armenia and know it like no one else.",
      },
      {
        title: "Comfortable transport",
        desc: "Modern 4x4s and air-conditioned minivans.",
      },
      {
        title: "Transparent prices",
        desc: "No hidden extras — everything is included in the tour price.",
      },
    ],
  },
  cta: {
    title: "Ready for an adventure?",
    subtitle: "Message us — we'll match a tour to your dates and wishes.",
  },
  tours: {
    title: "Our tours",
    from: "from",
    hours: "h",
    days: "days",
    nights: "nights",
    viewAll: "View tours",
    book: "Book now",
    bookMessage: "Hello! I'm interested in this tour:",
  },
  tour: {
    route: "Route",
    duration: "Duration",
    departure: "Departure",
    itinerary: "Day-by-day programme",
    day: "Day",
    accommodation: "Accommodation",
    perPerson: "per person",
    back: "All tours",
  },
  pkg: {
    badge: "Tour package",
    allInclusive: "All-inclusive",
    perPerson: "per person",
    program: "Programme",
    intro:
      "This is not a day trip but a ready-made multi-day journey: accommodation, transfers, a guide and every excursion are already included in the price.",
    includesTitle: "Already included in the package price",
    includes: {
      hotel: "Hotel & breakfasts",
      transfers: "All transfers",
      guide: "Guide for the whole route",
      tickets: "Entrance tickets",
    },
    viewProgram: "See the programme",
  },
  about: {
    title: "About Us",
    paragraphs: [
      "Amaras Tour is a local travel company that shows Armenia the way guests are welcomed here: with warmth, respect and genuine care.",
      "We create journeys for every kind of traveller — from affordable, well-planned routes to private and premium tours with an elevated level of service. Quality, comfort and a human attitude to every guest always come first.",
      "More than 10 years of experience, a professional team of guides and drivers, reliable transport and attention to detail let us craft trips remembered not only for beautiful places, but for their atmosphere.",
    ],
  },
  contacts: {
    title: "Contacts",
    subtitle: "Message us on WhatsApp or Telegram — we reply fast.",
    phone: "Phone",
    email: "Email",
    follow: "Follow us",
    address: "Yerevan, Armenia",
  },
  footer: {
    tagline: "Travel across Armenia",
    rights: "All rights reserved.",
  },
  meta: {
    home: {
      title: "Amaras Tour — Tours & Excursions in Armenia",
      description:
        "Tour packages, private and group excursions across Armenia: Khor Virap, Tatev, Sevan, Garni. Local guides, comfortable transport, honest prices.",
    },
    about: {
      title: "About Us",
      description:
        "Amaras Tour is a team of local guides and drivers running tours across all of Armenia.",
    },
    tours: {
      title: "Tours in Armenia",
      description:
        "All Amaras Tour trips: tour packages, private and group excursions across Armenia with prices.",
    },
    contacts: {
      title: "Contacts",
      description:
        "Get in touch with Amaras Tour via WhatsApp, Telegram, Instagram or phone.",
    },
  },
};

// Built-in defaults; live text comes from getContent() in lib/content.ts,
// which overlays what was edited in /admin on top of these.
export const dictionaries: Record<Locale, Dict> = { ru, hy, en };
