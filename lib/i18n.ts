export const locales = ["ru", "hy", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "ru";

export const ogLocales: Record<Locale, string> = {
  ru: "ru_RU",
  hy: "hy_AM",
  en: "en_US",
};

// One block of the "useful information" panel shown on day-tour pages.
// `id` lets the renderer drop live values into the right block: the contact
// line into "booking", the times into "meeting", the tour's own ticket prices
// into "tickets". An unrecognised or blank id just renders the text as written,
// so editing these in /admin can never break the panel.
export type InfoSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  items: string[];
  note: string;
};

export type InfoPanel = {
  title: string;
  meetLabel: string;
  contactLabel: string;
  sections: InfoSection[];
};

const ruInfo: InfoPanel = {
  title: "Полезная информация",
  meetLabel: "Время сбора",
  contactLabel: "WhatsApp / Telegram",
  sections: [
    {
      id: "booking",
      heading: "Бронирование обязательно",
      paragraphs: [
        "Участие в экскурсии возможно только по предварительному бронированию. Пожалуйста, не приходите к месту сбора без подтверждённой записи: наличие свободных мест в день экскурсии не гарантируется.",
        "Для бронирования заранее свяжитесь с Amaras Tour и сообщите выбранный тур, дату поездки и количество участников. После подтверждения наличия мест мы отправим вам всю необходимую информацию для оформления бронирования.",
      ],
      items: [],
      note: "После подтверждения бронирования ваше место в группе будет закреплено за вами.",
    },
    {
      id: "meeting",
      heading: "Место и время сбора",
      paragraphs: [
        "Место встречи: Ереван, проспект Месропа Маштоца, 51 — нижняя часть Матенадарана, рядом с остановкой Bus Voyage, на пересечении улицы Корюна и проспекта Маштоца.",
        "Рекомендуем подойти за 10–15 минут до отправления, чтобы спокойно найти транспорт и занять место. Экскурсия отправляется по расписанию.",
      ],
      items: [],
      note: "",
    },
    {
      id: "transport",
      heading: "Как найти наш транспорт",
      paragraphs: [
        "В месте сбора будет находиться транспорт Amaras Tour. На лобовом стекле автомобиля будет табличка AMARAS TOUR — по ней вы легко узнаете наш транспорт.",
      ],
      items: [],
      note: "",
    },
    {
      id: "included",
      heading: "Что входит в стоимость",
      paragraphs: [],
      items: [
        "Комфортабельный транспорт на протяжении всего маршрута",
        "Услуги профессионального гида",
        "Экскурсионное сопровождение на армянском, русском или английском языке",
        "Бутилированная вода",
        "Армянское угощение от Amaras Tour",
      ],
      note: "",
    },
    {
      id: "excluded",
      heading: "Что не входит в стоимость",
      paragraphs: [],
      items: ["Входные билеты", "Обед и питание", "Личные расходы"],
      note: "",
    },
    {
      id: "tickets",
      heading: "Входные билеты",
      paragraphs: [],
      items: [],
      note: "Входные билеты приобретаются и оплачиваются отдельно на месте.",
    },
    {
      id: "meals",
      heading: "Питание",
      paragraphs: [
        "Обед не входит в стоимость экскурсии. Во время тура предусмотрено время для питания: гид подскажет подходящее место в соответствии с программой и временем поездки.",
        "При желании можно взять с собой небольшой перекус.",
      ],
      items: [],
      note: "",
    },
    {
      id: "temples",
      heading: "Посещение храмов и монастырей",
      paragraphs: [
        "Во время экскурсии мы посещаем действующие религиозные объекты, поэтому просим соблюдать уважительный стиль одежды и правила поведения.",
        "Рекомендуем одежду, закрывающую плечи и колени. Внутри храмов следует соблюдать тишину и учитывать, что во время посещения могут проходить богослужения, венчания и другие религиозные церемонии.",
      ],
      items: [],
      note: "",
    },
    {
      id: "bring",
      heading: "Что взять с собой",
      paragraphs: ["Рекомендуем взять:"],
      items: [
        "удобную обувь",
        "головной убор в жаркую погоду",
        "лёгкую кофту или ветровку в прохладное время года",
        "небольшой перекус при необходимости",
      ],
      note: "Бутилированная вода предоставляется компанией во время экскурсии.",
    },
    {
      id: "duration",
      heading: "Продолжительность и программа",
      paragraphs: [
        "Ориентировочная продолжительность экскурсии указана в описании тура. Фактическое время возвращения может немного меняться в зависимости от дорожной ситуации, погодных условий и времени пребывания группы на объектах.",
        "Порядок посещения достопримечательностей может быть изменён по организационным причинам, при этом основные точки заявленного маршрута сохраняются.",
      ],
      items: [],
      note: "",
    },
  ],
};

const hyInfo: InfoPanel = {
  title: "Օգտակար տեղեկություններ",
  meetLabel: "Հավաքի ժամ",
  contactLabel: "WhatsApp / Telegram",
  sections: [
    {
      id: "booking",
      heading: "Ամրագրումը պարտադիր է",
      paragraphs: [
        "Էքսկուրսիային մասնակցությունը հնարավոր է միայն նախնական ամրագրմամբ։ Խնդրում ենք չգալ հավաքի վայր առանց հաստատված գրանցման․ էքսկուրսիայի օրը ազատ տեղերի առկայությունը երաշխավորված չէ։",
        "Ամրագրման համար նախապես կապվեք Amaras Tour-ի հետ և հաղորդեք ընտրված տուրը, ճամփորդության ամսաթիվը և մասնակիցների թիվը։ Տեղերի առկայությունը հաստատելուց հետո մենք կուղարկենք ամրագրման ձևակերպման համար անհրաժեշտ ողջ տեղեկատվությունը։",
      ],
      items: [],
      note: "Ամրագրումը հաստատվելուց հետո ձեր տեղը խմբում կամրագրվի ձեր անունով։",
    },
    {
      id: "meeting",
      heading: "Հավաքի վայրը և ժամը",
      paragraphs: [
        "Հանդիպման վայրը՝ Երևան, Մեսրոպ Մաշտոցի պողոտա 51, Մատենադարանի ստորին հատված, Bus Voyage կանգառի մոտ, Կորյունի փողոցի և Մաշտոցի պողոտայի հատման մասում։",
        "Խորհուրդ ենք տալիս ներկայանալ մեկնումից 10–15 րոպե առաջ, որպեսզի հանգիստ գտնեք տրանսպորտը և զբաղեցնեք ձեր տեղը։ Էքսկուրսիան մեկնում է ըստ ժամանակացույցի։",
      ],
      items: [],
      note: "",
    },
    {
      id: "transport",
      heading: "Ինչպես գտնել մեր տրանսպորտը",
      paragraphs: [
        "Հավաքի վայրում կլինի Amaras Tour-ի տրանսպորտը։ Ավտոմեքենայի առջևի ապակու վրա կլինի AMARAS TOUR ցուցանակը, որով հեշտությամբ կճանաչեք մեր տրանսպորտը։",
      ],
      items: [],
      note: "",
    },
    {
      id: "included",
      heading: "Ինչ է ներառված արժեքի մեջ",
      paragraphs: [],
      items: [
        "Հարմարավետ տրանսպորտ ամբողջ երթուղու ընթացքում",
        "Մասնագիտական գիդի ծառայություններ",
        "Էքսկուրսիայի ուղեկցում հայերեն, ռուսերեն կամ անգլերեն լեզվով",
        "Շշալցված ջուր",
        "Հայկական հյուրասիրություն Amaras Tour-ից",
      ],
      note: "",
    },
    {
      id: "excluded",
      heading: "Ինչ ներառված չէ արժեքի մեջ",
      paragraphs: [],
      items: ["Մուտքի տոմսեր", "Ճաշ և սնունդ", "Անձնական ծախսեր"],
      note: "",
    },
    {
      id: "tickets",
      heading: "Մուտքի տոմսեր",
      paragraphs: [],
      items: [],
      note: "Մուտքի տոմսերը ձեռք են բերվում և վճարվում են առանձին՝ տեղում։",
    },
    {
      id: "meals",
      heading: "Սնունդ",
      paragraphs: [
        "Ճաշը ներառված չէ էքսկուրսիայի արժեքի մեջ։ Տուրի ընթացքում նախատեսված է ժամանակ սնվելու համար․ գիդը կառաջարկի հարմար վայր՝ ըստ ծրագրի և ճամփորդության ժամանակի։",
        "Ցանկության դեպքում կարող եք ձեզ հետ վերցնել թեթև խորտիկ։",
      ],
      items: [],
      note: "",
    },
    {
      id: "temples",
      heading: "Եկեղեցիների և վանքերի այցելություն",
      paragraphs: [
        "Էքսկուրսիայի ընթացքում այցելում ենք գործող կրոնական վայրեր, ուստի խնդրում ենք պահպանել հարգալից հագուստի ոճը և վարքի կանոնները։",
        "Խորհուրդ ենք տալիս հագուստ, որը ծածկում է ուսերը և ծնկները։ Տաճարների ներսում հետևեք լռությանը և հաշվի առեք, որ այցելության ընթացքում կարող են տեղի ունենալ պատարագներ, պսակադրություններ և այլ կրոնական արարողություններ։",
      ],
      items: [],
      note: "",
    },
    {
      id: "bring",
      heading: "Ինչ վերցնել ձեզ հետ",
      paragraphs: ["Խորհուրդ ենք տալիս վերցնել՝"],
      items: [
        "հարմարավետ կոշիկներ",
        "գլխարկ տաք եղանակին",
        "թեթև բաճկոն կամ հողմակայուն զգեստ զով եղանակին",
        "թեթև խորտիկ՝ անհրաժեշտության դեպքում",
      ],
      note: "Շշալցված ջուրը տրամադրվում է ընկերության կողմից էքսկուրսիայի ընթացքում։",
    },
    {
      id: "duration",
      heading: "Տևողությունը և ծրագիրը",
      paragraphs: [
        "Էքսկուրսիայի մոտավոր տևողությունը նշված է տուրի նկարագրության մեջ։ Վերադարձի փաստացի ժամը կարող է փոքր-ինչ փոփոխվել՝ կախված ճանապարհային իրավիճակից, եղանակային պայմաններից և խմբի օբյեկտներում գտնվելու ժամանակից։",
        "Տեսարժան վայրերի այցելության հերթականությունը կարող է փոփոխվել կազմակերպչական պատճառներով, սակայն հայտարարված երթուղու հիմնական կետերը պահպանվում են։",
      ],
      items: [],
      note: "",
    },
  ],
};

const enInfo: InfoPanel = {
  title: "Useful information",
  meetLabel: "Meeting time",
  contactLabel: "WhatsApp / Telegram",
  sections: [
    {
      id: "booking",
      heading: "Booking is required",
      paragraphs: [
        "You can only join the excursion with a booking made in advance. Please do not come to the meeting point without a confirmed reservation, as seats cannot be guaranteed on the day.",
        "To book, contact Amaras Tour ahead of time with the tour you have chosen, your travel date and the number of people. Once we confirm availability we will send you everything you need to complete the booking.",
      ],
      items: [],
      note: "After your booking is confirmed your seat in the group is held for you.",
    },
    {
      id: "meeting",
      heading: "Meeting point and time",
      paragraphs: [
        "Meeting point: 51 Mesrop Mashtots Avenue, Yerevan, at the lower side of the Matenadaran, next to the Bus Voyage stop, where Koryun Street meets Mashtots Avenue.",
        "Please arrive 10 to 15 minutes before departure so you have time to find the vehicle and take your seat. The excursion leaves on schedule.",
      ],
      items: [],
      note: "",
    },
    {
      id: "transport",
      heading: "Finding our vehicle",
      paragraphs: [
        "The Amaras Tour vehicle will be waiting at the meeting point. It carries an AMARAS TOUR sign in the windscreen, so it is easy to spot.",
      ],
      items: [],
      note: "",
    },
    {
      id: "included",
      heading: "What the price includes",
      paragraphs: [],
      items: [
        "Comfortable transport for the whole route",
        "A professional guide",
        "Commentary in Armenian, Russian or English",
        "Bottled water",
        "An Armenian treat from Amaras Tour",
      ],
      note: "",
    },
    {
      id: "excluded",
      heading: "What the price does not include",
      paragraphs: [],
      items: ["Entrance tickets", "Lunch and other meals", "Personal expenses"],
      note: "",
    },
    {
      id: "tickets",
      heading: "Entrance tickets",
      paragraphs: [],
      items: [],
      note: "Entrance tickets are bought and paid for separately on site.",
    },
    {
      id: "meals",
      heading: "Meals",
      paragraphs: [
        "Lunch is not included in the price. Time is set aside for a meal during the tour, and your guide will suggest a suitable place to fit the programme and the timing.",
        "You are welcome to bring a snack of your own.",
      ],
      items: [],
      note: "",
    },
    {
      id: "temples",
      heading: "Visiting churches and monasteries",
      paragraphs: [
        "The excursion visits working religious sites, so we ask you to dress respectfully and to follow the rules of conduct.",
        "Clothing that covers the shoulders and knees is recommended. Please keep quiet inside the churches and bear in mind that services, weddings and other ceremonies may be taking place during your visit.",
      ],
      items: [],
      note: "",
    },
    {
      id: "bring",
      heading: "What to bring",
      paragraphs: ["We recommend bringing:"],
      items: [
        "comfortable shoes",
        "a hat in hot weather",
        "a light jumper or windbreaker in cooler months",
        "a snack if you would like one",
      ],
      note: "Bottled water is provided by the company during the excursion.",
    },
    {
      id: "duration",
      heading: "Duration and programme",
      paragraphs: [
        "The approximate duration of the excursion is given in the tour description. The actual time of return may shift slightly depending on traffic, the weather and how long the group spends at each site.",
        "The order in which the sights are visited may change for practical reasons, but the main points of the published route are always kept.",
      ],
      items: [],
      note: "",
    },
  ],
};

const ru = {
  nav: {
    home: "Главная",
    about: "О нас",
    tours: "Туры",
    packages: "Тур-пакеты",
    contacts: "Контакты",
  },
  hero: {
    title: "Откройте для себя Армению",
    subtitle:
      "Тур-пакеты, индивидуальные и групповые экскурсии по самым красивым уголкам Армении с местными гидами",
    ctaTours: "Смотреть туры",
    ctaWrite: "Написать нам",
    imageAlt: "Горная дорога среди заснеженных вершин",
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
  info: ruInfo,
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
    packages: {
      title: "Тур-пакеты по Армении",
      description:
        "Готовые многодневные тур-пакеты по Армении: отель, трансферы, гид и экскурсии — всё включено в стоимость.",
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
    packages: "Տուր փաթեթներ",
    contacts: "Կապ",
  },
  hero: {
    title: "Բացահայտեք Հայաստանը",
    subtitle:
      "Տուր փաթեթներ, անհատական և խմբային էքսկուրսիաներ Հայաստանի ամենագեղեցիկ վայրերով՝ տեղացի գիդերի հետ",
    ctaTours: "Դիտել տուրերը",
    ctaWrite: "Գրել մեզ",
    imageAlt: "Լեռնային ճանապարհ ձյունածածկ գագաթների միջով",
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
  info: hyInfo,
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
    packages: {
      title: "Տուր փաթեթներ Հայաստանում",
      description:
        "Պատրաստի բազմօրյա տուր փաթեթներ Հայաստանում՝ հյուրանոց, տրանսֆերներ, գիդ և էքսկուրսիաներ՝ ամեն ինչ ներառված է։",
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
    packages: "Tour Packages",
    contacts: "Contacts",
  },
  hero: {
    title: "Discover Armenia",
    subtitle:
      "Tour packages, private and group excursions to the most beautiful corners of Armenia with local guides",
    ctaTours: "Browse tours",
    ctaWrite: "Message us",
    imageAlt: "A mountain road winding between snow-capped peaks",
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
  info: enInfo,
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
    packages: {
      title: "Tour Packages in Armenia",
      description:
        "Ready-made multi-day tour packages across Armenia: hotel, transfers, guide and excursions, all included.",
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
