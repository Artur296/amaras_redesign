import type { Locale } from "@/lib/i18n";

export type VehicleCategory = string;

export type FleetCategory = {
  id: string;
  name: Record<Locale, string>;
  order?: number;
};

export const defaultFleetCategories: FleetCategory[] = [
  {
    id: "minivan",
    name: {
      ru: "Минивэн",
      hy: "Մինիվեն",
      en: "Minivan",
    },
    order: 1,
  },
  {
    id: "vip",
    name: {
      ru: "VIP / Бизнес",
      hy: "VIP / Բիզնես",
      en: "VIP / Business",
    },
    order: 2,
  },
  {
    id: "suv",
    name: {
      ru: "Внедорожник 4x4",
      hy: "Ամենագնաց 4x4",
      en: "Off-Road 4x4 SUV",
    },
    order: 3,
  },
  {
    id: "minibus",
    name: {
      ru: "Микроавтобус",
      hy: "Միկրոավտոբուս",
      en: "Minibus",
    },
    order: 4,
  },
  {
    id: "sedan",
    name: {
      ru: "Седан",
      hy: "Սեդան",
      en: "Sedan",
    },
    order: 5,
  },
];

export type Vehicle = {
  id: string;
  name: string;
  category: VehicleCategory;
  categoryName: Record<Locale, string>;
  passengers: number;
  luggage: number;
  image: string;
  images?: string[];
  description: Record<Locale, string>;
  features: Record<Locale, string[]>;
  order?: number;
};

export const defaultVehicles: Vehicle[] = [
  {
    id: "toyota-alphard-luxury",
    name: "Toyota Alphard Luxury",
    category: "minivan",
    categoryName: {
      ru: "Минивэн Люкс",
      hy: "Մինիվեն Լյուքս",
      en: "Luxury Minivan",
    },
    passengers: 6,
    luggage: 5,
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80",
    ],
    description: {
      ru: "Флагманский японский минивэн с капитанскими креслами Ottoman, превосходной шумоизоляцией и плавным ходом. Идеальный выбор для семей и малых групп, ценящих максимальный комфорт в дальних поездках по Армении.",
      hy: "Ճապոնական պրեմիում դասի մինիվեն՝ առանձնացված հարմարավետ նստատեղերով, անաղմուկ սրահով և սահուն ընթացքով։ Կատարյալ ընտրություն ընտանիքների և փոքր խմբերի համար։",
      en: "Flagship Japanese luxury minivan with Ottoman captain chairs, supreme soundproofing, and plush ride quality. The finest choice for families and small groups touring Armenia in supreme comfort.",
    },
    features: {
      ru: [
        "Раздельные капитанские кресла",
        "Двухзонный климат-контроль",
        "Wi-Fi и USB-порты для каждого пассажира",
        "Бутилированная вода в салоне",
        "Детское кресло (по запросу)",
      ],
      hy: [
        "Առանձին կապիտանական նստատեղեր",
        "Երկգոտի կլիմատ-կոնտրոլ",
        "Wi-Fi և USB լիցքավորիչներ",
        "Շշալցված ջուր սրահում",
        "Մանկական նստատեղ (ըստ ցանկության)",
      ],
      en: [
        "Separate captain chairs with leg rests",
        "Dual-zone climate control",
        "Wi-Fi & USB fast chargers for every seat",
        "Complimentary bottled water",
        "Child safety seat upon request",
      ],
    },
    order: 1,
  },
  {
    id: "mercedes-v-class-vip",
    name: "Mercedes-Benz V-Class",
    category: "vip",
    categoryName: {
      ru: "VIP / Бизнес Минивэн",
      hy: "VIP / Բիզնես Մինիվեն",
      en: "VIP / Business Minivan",
    },
    passengers: 7,
    luggage: 6,
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80",
    ],
    description: {
      ru: "Премиальный немецкий минивэн бизнес-класса. Просторный кожаный салон с возможностью трансформации кресел лицом к лицу, панорамная крыша и идеальный микроклимат для представительских туров и трансферов.",
      hy: "Գերմանական բիզնես դասի մինիվեն։ Ընդարձակ կաշվե սրահ, պանորամային տանիք և բացառիկ հարմարավետություն VIP հյուրերի և գործնական շրջագայությունների համար։",
      en: "Prestige German business-class minivan. Spacious leather cabin with face-to-face conference seating capability, panoramic roof, and executive comfort for demanding travelers.",
    },
    features: {
      ru: [
        "Премиальный кожаный салон",
        "Конференц-расположение кресел",
        "Многозонный климат-контроль",
        "Скоростной Wi-Fi на борту",
        "Большой багажный отсек",
      ],
      hy: [
        "Պրեմիում կաշվե ինտերիեր",
        "Նստատեղերի դեմ առ դեմ դասավորություն",
        "Բազմագոտի կլիմատ-կոնտրոլ",
        "Արագագործ Wi-Fi սրահում",
        "Տարողունակ բեռնախցիկ",
      ],
      en: [
        "Executive leather upholstery",
        "Face-to-face conference seating layout",
        "Multi-zone automatic climate control",
        "High-speed onboard Wi-Fi",
        "Extra-large luggage capacity",
      ],
    },
    order: 2,
  },
  {
    id: "toyota-land-cruiser-prado",
    name: "Toyota Land Cruiser Prado 4x4",
    category: "suv",
    categoryName: {
      ru: "Внедорожник 4x4",
      hy: "Ամենագնաց 4x4",
      en: "Off-Road 4x4 SUV",
    },
    passengers: 4,
    luggage: 4,
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
    ],
    description: {
      ru: "Легендарный рамный внедорожник с постоянным полным приводом. Незаменим для джип-туров, поездок к высокогорным крепостям, каньонам, вулкану Аждаак и озеру Кари Ли на склонах Арагаца в любую погоду.",
      hy: "Հուսալի ամենագնաց մշտական 4x4 քարշակով։ Անփոխարինելի է լեռնային արշավների, կիրճերի և բարձրադիր տեսարժան վայրերի համար ցանկացած եղանակին։",
      en: "Legendary full-time 4WD body-on-frame SUV. Engineered to conquer rugged mountain passes, volcanic crater lakes, and remote monastic citadels with total safety and poise.",
    },
    features: {
      ru: [
        "Настоящий полный привод 4x4 с понижающей передачей",
        "Высокий клиренс для горных перевалов",
        "Климат-контроль и анатомические кресла",
        "Опытный водитель-экспедитор горной категории",
        "Бутилированная вода и аптечка",
      ],
      hy: [
        "Լիարժեք 4x4 լեռնային ռեժիմներով",
        "Բարձր կլիրենս լեռնային ճանապարհների համար",
        "Կլիմատ-կոնտրոլ և հարմարավետ նստատեղեր",
        "Փորձառու լեռնային վարորդ",
        "Խմելու ջուր և առաջին օգնության պարագաներ",
      ],
      en: [
        "True 4x4 system with low-range transfer case",
        "High ground clearance for rough terrain",
        "Climate control & bolstered seating",
        "Experienced mountain-route chauffeur",
        "Drinking water & expedition first-aid kit",
      ],
    },
    order: 3,
  },
  {
    id: "mercedes-sprinter-lux",
    name: "Mercedes-Benz Sprinter Lux",
    category: "minibus",
    categoryName: {
      ru: "Микроавтобус Турист",
      hy: "Միկրոավտոբուս Տուրիստ",
      en: "Touring Minibus",
    },
    passengers: 18,
    luggage: 18,
    image: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?auto=format&fit=crop&w=1200&q=80",
    ],
    description: {
      ru: "Специализированный туристический микроавтобус с панорамным остеклением, микрофоном для гида, индивидуальным обдувом и освещением каждого пассажирского места. Оптимален для комфортных групповых туров.",
      hy: "Մասնագիտացված տուրիստական միկրոավտոբուս՝ պանորամային պատուհաններով, գիդի խոսափողով և անհատական օդափոխությամբ։ Իդեալական է խմբային շրջագայությունների համար։",
      en: "Customized touring minibus featuring oversized panoramic sightseeing windows, dedicated guide microphone audio system, and reclining passenger seats for comfortable group voyages.",
    },
    features: {
      ru: [
        "Панорамные тонированные окна для фото",
        "Аудиосистема с микрофоном гида",
        "Анатомические кресла с регулировкой наклона",
        "Мощный салонный кондиционер",
        "Вместительное багажное отделение",
      ],
      hy: [
        "Պանորամային պատուհաններ լուսանկարների համար",
        "Աուդիոհամակարգ գիդի խոսափողով",
        "Կարգավորվող անատոմիական նստատեղեր",
        "Հզոր օդորակիչ ամբողջ սրահի համար",
        "Տարողունակ բեռնախցիկ",
      ],
      en: [
        "Oversized tinted panoramic windows",
        "PA audio system with guide microphone",
        "Ergonomic reclining seats with seatbelts",
        "High-capacity roof-mounted air conditioning",
        "Spacious luggage compartment",
      ],
    },
    order: 4,
  },
  {
    id: "toyota-camry-comfort",
    name: "Toyota Camry Comfort+",
    category: "sedan",
    categoryName: {
      ru: "Комфорт Седан",
      hy: "Կոմֆորտ Սեդան",
      en: "Comfort Sedan",
    },
    passengers: 4,
    luggage: 3,
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1200&q=80",
    ],
    description: {
      ru: "Классический седан повышенной комфортности для пар и индивидуальных путешественников. Тихий ход, современный климат-контроль и мягкая подвеска для неутомительных экскурсий по достопримечательностям Армении.",
      hy: "Հարմարավետ դասական սեդան զույգերի և անհատ ճանապարհորդների համար։ Անաղմուկ ընթացք, ժամանակակից կլիմատ-կոնտրոլ և փափուկ կախոց։",
      en: "Classic comfort-plus sedan for couples and solo explorers. Quiet ride, gentle suspension, and modern dual-zone AC for relaxing personal excursions across Armenia.",
    },
    features: {
      ru: [
        "Мягкая энергоёмкая подвеска",
        "Климат-контроль с очисткой воздуха",
        "Wi-Fi и зарядные устройства",
        "Идеально для 1-3 пассажиров",
        "Чистый ухоженный салон без запахов",
      ],
      hy: [
        "Փափուկ և հարմարավետ ընթացք",
        "Կլիմատ-կոնտրոլ օդի մաքրմամբ",
        "Wi-Fi և լիցքավորիչներ",
        "Հարմար է 1-3 ուղևորի համար",
        "Մաքուր և խնամված սրահ",
      ],
      en: [
        "Pliant, smooth-riding suspension",
        "Automatic dual-zone climate control",
        "Wi-Fi hotspot & charging cables",
        "Optimal for 1-3 travelers",
        "Spotless non-smoking cabin",
      ],
    },
    order: 5,
  },
];
