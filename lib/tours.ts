import type { InfoSection, Locale } from "@/lib/i18n";

// Categories are dynamic (editable in /admin); these are the defaults.
export type Category = {
  id: string;
  image: string;
  imagePosition?: string; // tailwind object-position class for the card crop
  title: Record<Locale, string>;
  desc: Record<Locale, string>;
};

export const defaultCategories: Category[] = [
  {
    id: "packages",
    image: "/images/category-packages.jpg",
    imagePosition: "object-center",
    title: { ru: "Тур-пакеты", hy: "Տուր փաթեթներ", en: "Tour Packages" },
    desc: {
      ru: "Готовые многодневные путешествия по Армении: отель, трансферы, гид и экскурсии — всё продумано и организовано.",
      hy: "Պատրաստի բազմօրյա ճամփորդություններ Հայաստանում՝ հյուրանոց, տրանսֆերներ, գիդ և էքսկուրսիաներ՝ ամեն ինչ մտածված և կազմակերպված է։",
      en: "Ready-made multi-day journeys across Armenia: hotel, transfers, guide and excursions — everything planned and organised.",
    },
  },
  {
    id: "individual",
    image: "/images/category-individual.jpg",
    imagePosition: "object-center",
    title: {
      ru: "Индивидуальные туры",
      hy: "Անհատական տուրեր",
      en: "Individual Tours",
    },
    desc: {
      ru: "Личный гид, свой темп и маршрут, собранный под ваши пожелания.",
      hy: "Անձնական գիդ, ձեր տեմպը և երթուղի՝ կազմված ձեր ցանկություններով։",
      en: "A personal guide, your own pace and an itinerary built around your wishes.",
    },
  },
  {
    id: "group",
    image: "/images/category-group.jpg",
    imagePosition: "object-[center_60%]",
    title: { ru: "Групповые туры", hy: "Խմբային տուրեր", en: "Group Tours" },
    desc: {
      ru: "Небольшие дружные группы, насыщенная программа и выгодные цены.",
      hy: "Փոքր ջերմ խմբեր, հագեցած ծրագիր և շահավետ գներ։",
      en: "Small friendly groups, a rich programme and great prices.",
    },
  },
  {
    id: "jeep",
    image: "/images/jeep-tour.jpg",
    imagePosition: "object-center",
    title: { ru: "Джип-туры", hy: "Ջիպ-տուրեր", en: "Jeep Tours" },
    desc: {
      ru: "Внедорожные маршруты к вулканам, водопадам и горным крепостям, куда не доедет обычный транспорт.",
      hy: "Ճանապարհից դուրս երթուղիներ դեպի հրաբուխներ, ջրվեժներ և լեռնային ամրոցներ, ուր սովորական տրանսպորտը չի հասնում։",
      en: "Off-road routes to volcanoes, waterfalls and mountain fortresses that ordinary transport cannot reach.",
    },
  },
];

// Multi-day packages are priced per person by hotel class.
export type PriceTier = { stars: 3 | 4 | 5; amd: number };

export type ItineraryDay = {
  day: number;
  title: Record<Locale, string>;
  items: Record<Locale, string[]>;
};

export type Tour = {
  slug: string;
  featured?: boolean; // show in "Popular tours" on the homepage (default true)
  categories: string[]; // category ids; a tour can be offered in several formats
  image: string;
  // Day tours: a departure time and a length in hours.
  departure?: string; // local departure time, e.g. "10:00"
  durationHours?: string;
  // Multi-day packages: length in days/nights, per-hotel-class prices and a
  // day-by-day programme instead of a single list of stops.
  days?: number;
  nights?: number;
  priceTiers?: PriceTier[];
  itinerary?: ItineraryDay[];
  priceFromAmd: number;
  priceOldAmd?: number; // pre-discount price, shown struck through
  title: Record<Locale, string>;
  description: Record<Locale, string>;
  about: Record<Locale, string>; // paragraphs separated by \n\n
  destinations: Record<Locale, string[]>;
  // The two parts of the "useful information" panel that differ per tour. The
  // rest of that panel is shared text living in the dictionary, so a tour that
  // leaves these empty simply shows the panel without them.
  meetTime?: string; // gathering time at the meeting point, e.g. "09:50"
  tickets?: Record<Locale, string[]>; // entrance fees paid on site
  // A tour that needs more than the shared text — its own inclusions, weather
  // caveats, packing list — carries the whole panel here instead, and the
  // shared sections are not used for it.
  infoSections?: Record<Locale, InfoSection[]>;
};

// Real tours from amarastour.tilda.ws (prices, times, routes and category
// tabs as published there).
export const tours: Tour[] = [
  {
    slug: "tsaghkadzor-sevan-sevanavank",
    categories: ["group"],
    image: "/images/tours/tsaghkadzor-sevan-sevanavank.png",
    departure: "10:00",
    durationHours: "8–9",
    priceFromAmd: 15000,
    priceOldAmd: 18000,
    title: {
      ru: "Цахкадзор — Севан — Севанаванк",
      hy: "Ծաղկաձոր — Սևան — Սևանավանք",
      en: "Tsaghkadzor — Sevan — Sevanavank",
    },
    description: {
      ru: "Канатная дорога, средневековый Кечарис, зиплайн и жемчужина Армении — озеро Севан.",
      hy: "Ճոպանուղի, միջնադարյան Կեչառիս, զիփլայն և Հայաստանի մարգարիտը՝ Սևանա լիճը։",
      en: "A cable-car ride, medieval Kecharis, a zipline and Armenia's pearl — Lake Sevan.",
    },
    about: {
      ru: "Первой остановкой станет Цахкадзор — известный горнолыжный курорт Армении, название которого переводится как «ущелье цветов». Здесь вы подниметесь на канатной дороге, откуда открываются захватывающие панорамные виды на горные хребты и окрестности.\n\nДалее вы посетите монастырь Кечарис — архитектурный комплекс XI–XIII веков, один из важнейших духовных центров средневековой Армении. Каменные церкви и древние хачкары хранят атмосферу тишины, силы и истории веков.\n\nДля любителей адреналина предусмотрена возможность прокатиться на зиплайне — яркие эмоции и незабываемые впечатления на фоне горных пейзажей.\n\nВо второй части путешествия вас ждёт озеро Севан — высокогорная жемчужина Армении, расположенная на высоте около 1900 метров над уровнем моря. На полуострове вы посетите монастырь Севанаванк (IX век), откуда открывается один из самых красивых видов на озеро.\n\nЭтот тур идеально подходит тем, кто хочет за один день увидеть разную Армению — духовную, активную и природную.",
      hy: "Առաջին կանգառը Ծաղկաձորն է՝ Հայաստանի հայտնի լեռնադահուկային հանգստավայրը, որի անունը թարգմանվում է «ծաղիկների ձոր»։ Այստեղ կբարձրանաք ճոպանուղով, որտեղից բացվում են լեռնաշղթաների հիասքանչ համայնապատկերներ։\n\nԱյնուհետև կայցելեք Կեչառիսի վանք՝ XI–XIII դարերի ճարտարապետական համալիր, միջնադարյան Հայաստանի կարևորագույն հոգևոր կենտրոններից մեկը։\n\nԱդրենալինի սիրահարների համար նախատեսված է զիփլայն՝ վառ հույզեր լեռնային բնապատկերների ֆոնին։\n\nՃամփորդության երկրորդ մասում ձեզ սպասում է Սևանա լիճը՝ Հայաստանի բարձրլեռնային մարգարիտը՝ մոտ 1900 մ բարձրության վրա։ Թերակղզու վրա կայցելեք Սևանավանք (IX դար), որտեղից բացվում է լճի ամենագեղեցիկ տեսարաններից մեկը։\n\nԱյս տուրը իդեալական է նրանց համար, ովքեր ուզում են մեկ օրում տեսնել տարբեր Հայաստաններ՝ հոգևոր, ակտիվ և բնական։",
      en: "The first stop is Tsaghkadzor, Armenia's famous ski resort whose name means 'gorge of flowers'. Here you ride the cable car up for sweeping panoramic views of the mountain ridges.\n\nNext you visit Kecharis Monastery, an 11th–13th-century complex and one of the most important spiritual centres of medieval Armenia, with stone churches and ancient khachkars.\n\nFor adrenaline lovers there is an optional zipline ride — vivid emotions against a mountain backdrop.\n\nThe second half of the day is devoted to Lake Sevan, Armenia's high-altitude pearl at about 1,900 metres above sea level. On the peninsula you visit Sevanavank Monastery (9th century) with one of the finest views over the lake.\n\nThis tour is perfect for seeing several Armenias in one day — spiritual, active and natural.",
    },
    destinations: {
      ru: ["Канатная дорога (Цахкадзор)", "Монастырь Кечарис", "Зиплайн", "Озеро Севан", "Монастырь Севанаванк"],
      hy: ["Ճոպանուղի (Ծաղկաձոր)", "Կեչառիսի վանք", "Զիփլայն", "Սևանա լիճ", "Սևանավանք"],
      en: ["Cable car (Tsaghkadzor)", "Kecharis Monastery", "Zipline", "Lake Sevan", "Sevanavank Monastery"],
    },
  },
  {
    slug: "garni-geghard-symphony",
    categories: ["individual"],
    image: "/images/tours/garni-geghard-symphony.png",
    departure: "10:00",
    durationHours: "6–7",
    priceFromAmd: 10000,
    priceOldAmd: 16000,
    title: {
      ru: "Гарни — Гегард — Симфония камней",
      hy: "Գառնի — Գեղարդ — Քարերի սիմֆոնիա",
      en: "Garni — Geghard — Symphony of Stones",
    },
    description: {
      ru: "Идеальное первое знакомство: языческий храм, скальный монастырь и лаваш из тонира.",
      hy: "Իդեալական առաջին ծանոթություն՝ հեթանոսական տաճար, ժայռափոր վանք և թոնրի լավաշ։",
      en: "The perfect first encounter: a pagan temple, a rock-hewn monastery and tonir-baked lavash.",
    },
    about: {
      ru: "Этот маршрут — идеальное первое знакомство с Арменией.\n\nПутешествие начинается у Арки Чаренца — знакового места с одним из лучших видов на гору Арарат. Именно отсюда открывается та самая панорама, которую узнают с первого взгляда.\n\nДалее вы посетите храм Гарни — единственный сохранившийся языческий храм I века на территории Кавказа. Построенный в греко-римском стиле, он поражает своей гармонией и расположением над живописным ущельем.\n\nСледующая остановка — Симфония камней, уникальный природный памятник, где базальтовые колонны образуют фантастические формы, созданные самой природой.\n\nЗатем вас ждёт монастырь Гегард — духовный комплекс IV–XIII веков, частично высеченный в скале и включённый в список Всемирного наследия ЮНЕСКО. Здесь особенно ощущается тишина, сила и глубина веков.\n\nВ завершение тура вы примете участие в настоящем мастер-классе по выпечке армянского лаваша — увидите традиционный процесс и попробуете свежий, горячий хлеб прямо из тонира.\n\nЭтот тур подойдёт тем, кто хочет за один день увидеть историю, природу и живые традиции Армении.",
      hy: "Այս երթուղին իդեալական առաջին ծանոթություն է Հայաստանի հետ։\n\nՃամփորդությունը սկսվում է Չարենցի կամարից՝ Արարատ լեռան լավագույն տեսարաններից մեկով նշանավոր վայրից։\n\nԱյնուհետև կայցելեք Գառնիի տաճար՝ Կովկասում պահպանված միակ հեթանոսական տաճարը (I դար)՝ կառուցված հունահռոմեական ոճով, գեղատեսիլ կիրճի վրա։\n\nՀաջորդ կանգառը Քարերի սիմֆոնիան է՝ եզակի բնական հուշարձան, որտեղ բազալտե սյուները ֆանտաստիկ ձևեր են կազմում։\n\nԱպա՝ Գեղարդի վանք՝ IV–XIII դարերի հոգևոր համալիր՝ մասամբ փորված ժայռի մեջ և ընդգրկված ՅՈՒՆԵՍԿՕ-ի ցանկում։\n\nՏուրի ավարտին կմասնակցեք հայկական լավաշի թխման վարպետաց դասի՝ կտեսնեք ավանդական գործընթացը և կհամտեսեք տաք հացը հենց թոնրից։\n\nԱյս տուրը նրանց համար է, ովքեր ուզում են մեկ օրում տեսնել Հայաստանի պատմությունը, բնությունը և կենդանի ավանդույթները։",
      en: "This route is the perfect first encounter with Armenia.\n\nThe journey starts at Charents Arch, an iconic spot with one of the best views of Mount Ararat — the panorama everyone recognises at first sight.\n\nNext you visit Garni Temple, the only surviving 1st-century pagan temple in the Caucasus, built in Greco-Roman style above a picturesque gorge.\n\nThen comes the Symphony of Stones, a unique natural monument where basalt columns form fantastic shapes created by nature itself.\n\nAfter that — Geghard Monastery, a 4th–13th-century spiritual complex partly carved into the rock and listed as UNESCO World Heritage.\n\nThe tour ends with a genuine Armenian lavash-baking masterclass: watch the traditional process and taste fresh, hot bread straight from the tonir.\n\nFor those who want to see Armenia's history, nature and living traditions in one day.",
    },
    destinations: {
      ru: ["Арка Чаренца", "Храм Гарни", "Симфония камней", "Монастырь Гегард", "Мастер-класс по выпечке лаваша"],
      hy: ["Չարենցի կամար", "Գառնիի տաճար", "Քարերի սիմֆոնիա", "Գեղարդի վանք", "Լավաշի թխման վարպետաց դաս"],
      en: ["Charents Arch", "Garni Temple", "Symphony of Stones", "Geghard Monastery", "Lavash-baking masterclass"],
    },
  },
  {
    slug: "hovhannavank-saghmosavank-alphabet",
    categories: ["individual"],
    image: "/images/tours/hovhannavank-saghmosavank-alphabet.png",
    departure: "10:00",
    durationHours: "9–10",
    priceFromAmd: 15000,
    priceOldAmd: 19000,
    title: {
      ru: "Ованаванк — Сагмосаванк — Памятник алфавиту — Майлер",
      hy: "Հովհաննավանք — Սաղմոսավանք — Այբուբենի հուշարձան — Մայլեր",
      en: "Hovhannavank — Saghmosavank — Alphabet Monument — Myler",
    },
    description: {
      ru: "Монастыри над ущельем Касах, памятник армянскому алфавиту и горный курорт Майлер.",
      hy: "Վանքեր Քասաղի կիրճի վրա, հայոց այբուբենի հուշարձան և Մայլեր լեռնային հանգստավայրը։",
      en: "Monasteries above the Kasagh gorge, the Armenian Alphabet Monument and the Myler mountain resort.",
    },
    about: {
      ru: "Этот маршрут — путешествие через духовное наследие, историю и горные пейзажи Армении.\n\nПервой остановкой станет монастырь Ованаванк — древний духовный комплекс IV–XIII веков, расположенный над живописным ущельем реки Касах. Здесь царит особая тишина и ощущение силы места.\n\nДалее вы посетите монастырь Сагмосаванк — один из самых гармоничных архитектурных ансамблей XIII века, известный своими панорамными видами на каньон. В средние века монастырь был крупным центром книжной культуры и переписывания рукописей.\n\nЗатем — памятник Армянскому алфавиту, символ уникального письма, созданного Месропом Маштоцем в V веке. Это место о языке, культуре и идентичности армянского народа.\n\nЗавершением маршрута станет горнолыжный курорт Майлер, расположенный среди живописных горных пейзажей. Здесь можно прогуляться, отдохнуть и насладиться свежим горным воздухом, а в зимний сезон — покататься на лыжах или сноуборде.\n\nЭтот тур подойдёт тем, кто хочет спокойно и глубоко почувствовать Армению — её духовность, историю и природу.",
      hy: "Այս երթուղին ճամփորդություն է Հայաստանի հոգևոր ժառանգության, պատմության և լեռնային բնապատկերների միջով։\n\nԱռաջին կանգառը Հովհաննավանքն է՝ IV–XIII դարերի հնագույն հոգևոր համալիր՝ Քասաղ գետի գեղատեսիլ կիրճի վրա։\n\nԱյնուհետև կայցելեք Սաղմոսավանք՝ XIII դարի ամենաներդաշնակ ճարտարապետական համալիրներից մեկը՝ կիրճի համայնապատկերային տեսարաններով։ Միջնադարում այն ձեռագրերի ընդօրինակման խոշոր կենտրոն էր։\n\nԱպա՝ Հայոց այբուբենի հուշարձան՝ Մեսրոպ Մաշտոցի V դարում ստեղծած եզակի գրի խորհրդանիշը։\n\nԵրթուղու ավարտը Մայլեր լեռնադահուկային հանգստավայրն է՝ գեղատեսիլ լեռների մեջ. կարելի է զբոսնել, վայելել մաքուր լեռնային օդը, իսկ ձմռանը՝ դահուկ կամ սնոուբորդ քշել։\n\nԱյս տուրը նրանց համար է, ովքեր ուզում են հանգիստ և խորությամբ զգալ Հայաստանը՝ նրա հոգևորությունը, պատմությունը և բնությունը։",
      en: "This route travels through Armenia's spiritual heritage, history and mountain landscapes.\n\nThe first stop is Hovhannavank, an ancient monastic complex of the 4th–13th centuries perched above the scenic gorge of the Kasagh river.\n\nNext is Saghmosavank, one of the most harmonious 13th-century architectural ensembles, famous for its panoramic canyon views. In the Middle Ages it was a major centre of book culture and manuscript copying.\n\nThen comes the Armenian Alphabet Monument — a tribute to the unique script created by Mesrop Mashtots in the 5th century, a place about language, culture and identity.\n\nThe route ends at the Myler mountain resort amid beautiful highland scenery: stroll, relax and enjoy the fresh air, or ski and snowboard in winter.\n\nFor those who want to feel Armenia calmly and deeply — its spirituality, history and nature.",
    },
    destinations: {
      ru: ["Монастырь Ованаванк", "Монастырь Сагмосаванк", "Памятник Армянскому алфавиту", "Горнолыжный курорт Майлер"],
      hy: ["Հովհաննավանք", "Սաղմոսավանք", "Հայոց այբուբենի հուշարձան", "Մայլեր լեռնային հանգստավայր"],
      en: ["Hovhannavank Monastery", "Saghmosavank Monastery", "Armenian Alphabet Monument", "Myler ski resort"],
    },
  },
  {
    slug: "gutanasar-sevan-dilijan",
    categories: ["individual"],
    image: "/images/tours/gutanasar-sevan-dilijan.png",
    departure: "09:00",
    durationHours: "10–11",
    priceFromAmd: 20000,
    priceOldAmd: 24000,
    title: {
      ru: "Гутанасар — Севан — Дилижан",
      hy: "Գութանասար — Սևան — Դիլիջան",
      en: "Gutanasar — Sevan — Dilijan",
    },
    description: {
      ru: "Подъём к потухшему вулкану, озеро Севан и леса Дилижана за один день.",
      hy: "Բարձրացում հանգած հրաբուխ, Սևանա լիճ և Դիլիջանի անտառները մեկ օրում։",
      en: "An extinct volcano ascent, Lake Sevan and the forests of Dilijan in one day.",
    },
    about: {
      ru: "Этот маршрут — путешествие по северной Армении, где природа, история и горные пейзажи переплетаются в одном дне.\n\nЭкскурсия начинается с подъёма к вулкану Гутанасар — древнему потухшему вулкану рядом с селом Фантан. Здесь вы увидите застывшие лавовые поля, чёрные вулканические пески и необычные пейзажи, которые по праву считаются одними из самых инстаграмных мест Армении. Склоны вулкана открывают захватывающие панорамы.\n\nДалее вас ждёт озеро Севан — высокогорная жемчужина Армении, одно из крупнейших пресноводных озёр Кавказа. На полуострове вы посетите монастырь Севанаванк (IX век), откуда открываются потрясающие виды на озеро.\n\nВо второй части маршрута вы отправитесь в Дилижан — зелёный курорт, окружённый густыми лесами. Прогулка по Старому Дилижану позволит почувствовать атмосферу старого города с его ремесленными лавками и уютными улочками.\n\nПродолжением маршрута станет монастырь Агарцин — один из самых живописных монастырских комплексов Армении, спрятанный среди лесов Дилижана и основанный в X–XIII веках.\n\nЗавершением тура станет монастырь Гошаванк — выдающийся памятник XII–XIII веков, связанный с именем Мхитара Гоша, в средние века — важный образовательный и культурный центр.\n\nЭтот маршрут идеально подойдёт тем, кто любит природу, необычные локации для фото, горные виды, леса и древние монастыри.",
      hy: "Այս երթուղին ճամփորդություն է հյուսիսային Հայաստանով, որտեղ բնությունը, պատմությունը և լեռնային բնապատկերները միահյուսվում են մեկ օրում։\n\nԷքսկուրսիան սկսվում է Գութանասար հրաբխի բարձրացումով՝ հնագույն հանգած հրաբուխ Ֆանտան գյուղի մոտ։ Այստեղ կտեսնեք քարացած լավային դաշտեր, սև հրաբխային ավազներ և արտասովոր բնապատկերներ՝ Հայաստանի ամենաֆոտոգենիկ վայրերից։\n\nԱյնուհետև՝ Սևանա լիճ՝ Հայաստանի բարձրլեռնային մարգարիտը։ Թերակղզու վրա կայցելեք Սևանավանք (IX դար)՝ լճի ապշեցուցիչ տեսարաններով։\n\nԵրկրորդ մասում կմեկնեք Դիլիջան՝ խիտ անտառներով շրջապատված կանաչ հանգստավայր։ Զբոսանք Հին Դիլիջանով՝ արհեստավորների կրպակներով ու հարմարավետ փողոցներով։\n\nՇարունակությունը Հաղարծինի վանքն է՝ Հայաստանի ամենագեղատեսիլ վանական համալիրներից մեկը՝ թաքնված Դիլիջանի անտառներում (X–XIII դդ.)։\n\nՏուրի ավարտը Գոշավանքն է՝ XII–XIII դարերի նշանավոր հուշարձան՝ կապված Մխիթար Գոշի անվան հետ։\n\nԻդեալական է նրանց համար, ովքեր սիրում են բնություն, լեռնային տեսարաններ, անտառներ և հին վանքեր։",
      en: "This route explores northern Armenia, where nature, history and mountain scenery interweave in a single day.\n\nThe tour begins with an ascent of Gutanasar, an ancient extinct volcano near the village of Fantan. You'll see frozen lava fields, black volcanic sands and surreal landscapes rightly counted among Armenia's most photogenic spots.\n\nNext comes Lake Sevan, Armenia's high-altitude pearl and one of the largest freshwater lakes in the Caucasus. On the peninsula you visit Sevanavank Monastery (9th century) with stunning lake views.\n\nIn the second half you head to Dilijan, a green resort town surrounded by dense forests. A walk through Old Dilijan reveals craft shops and cosy lanes full of old-town atmosphere.\n\nThe route continues to Haghartsin Monastery — one of Armenia's most picturesque monastic complexes, hidden in the Dilijan forests and founded in the 10th–13th centuries.\n\nThe day ends at Goshavank, an outstanding 12th–13th-century monument linked to Mkhitar Gosh, once a major centre of learning.\n\nPerfect for lovers of nature, unusual photo locations, mountain views, forests and ancient monasteries.",
    },
    destinations: {
      ru: ["Вулкан Гутанасар", "Озеро Севан", "Монастырь Севанаванк", "Старый Дилижан", "Монастырь Агарцин", "Монастырь Гошаванк"],
      hy: ["Գութանասար հրաբուխ", "Սևանա լիճ", "Սևանավանք", "Հին Դիլիջան", "Հաղարծին", "Գոշավանք"],
      en: ["Gutanasar volcano", "Lake Sevan", "Sevanavank Monastery", "Old Dilijan", "Haghartsin Monastery", "Goshavank Monastery"],
    },
  },
  {
    slug: "pervoe-znakomstvo-s-armeniey",
    categories: ["packages"],
    image: "/images/garni.jpg",
    days: 3,
    nights: 2,
    priceFromAmd: 95000,
    priceTiers: [
      { stars: 3, amd: 95000 },
      { stars: 4, amd: 127000 },
      { stars: 5, amd: 170000 },
    ],
    title: {
      ru: "Первое знакомство с Арменией",
      hy: "Առաջին ծանոթություն Հայաստանի հետ",
      en: "First Acquaintance with Armenia",
    },
    description: {
      ru: "Компактное путешествие на 3 дня: Гарни, Гегард, Симфония камней и озеро Севан — без спешки и суеты.",
      hy: "Կոմպակտ 3-օրյա ճամփորդություն՝ Գառնի, Գեղարդ, Քարե սիմֆոնիա և Սևանա լիճ՝ առանց շտապելու։",
      en: "A compact 3-day journey: Garni, Geghard, the Symphony of Stones and Lake Sevan — unhurried and easy.",
    },
    about: {
      ru: "Компактное путешествие для тех, кто приезжает в Армению впервые и хочет увидеть главное — без спешки, усталости и суеты.\n\nЗа три дня вы познакомитесь с самыми узнаваемыми символами страны: языческим храмом Гарни I века, пещерным монастырём Гегард из списка ЮНЕСКО, базальтовой «Симфонией камней» и высокогорным озером Севан с монастырём Севанаванк.\n\nВ стоимость входят проживание с завтраками, все трансферы, экскурсии с профессиональным гидом и входные билеты. Вам остаётся только приехать.",
      hy: "Կոմպակտ ճամփորդություն նրանց համար, ովքեր առաջին անգամ են գալիս Հայաստան և ուզում են տեսնել գլխավորը՝ առանց շտապելու և հոգնության։\n\nԵրեք օրում կծանոթանաք երկրի ամենաճանաչելի խորհրդանիշներին՝ I դարի Գառնու հեթանոսական տաճար, ՅՈՒՆԵՍԿՕ-ի ցանկում ընդգրկված Գեղարդի վանք, բազալտե «Քարե սիմֆոնիա» և Սևանա լիճը՝ Սևանավանքով։\n\nԱրժեքի մեջ ներառված են կեցությունը նախաճաշերով, բոլոր տրանսֆերները, էքսկուրսիաները մասնագիտական գիդով և մուտքի տոմսերը։",
      en: "A compact journey for first-time visitors who want to see the essentials — without rushing or exhaustion.\n\nIn three days you meet the country's most recognisable symbols: the 1st-century pagan temple of Garni, the UNESCO-listed cave monastery of Geghard, the basalt Symphony of Stones, and high-altitude Lake Sevan with Sevanavank Monastery.\n\nThe price includes accommodation with breakfasts, all transfers, excursions with a professional guide and entrance fees. All you have to do is arrive.",
    },
    itinerary: [
      {
        day: 1,
        title: {
          ru: "Прибытие и знакомство с Ереваном",
          hy: "Ժամանում և ծանոթություն Երևանի հետ",
          en: "Arrival and first look at Yerevan",
        },
        items: {
          ru: ["Встреча в аэропорту и трансфер в отель", "Заселение и отдых", "Свободное время в центре Еревана"],
          hy: ["Դիմավորում օդանավակայանում և տրանսֆեր հյուրանոց", "Բնակեցում և հանգիստ", "Ազատ ժամանակ Երևանի կենտրոնում"],
          en: ["Airport pick-up and transfer to the hotel", "Check-in and rest", "Free time in central Yerevan"],
        },
      },
      {
        day: 2,
        title: {
          ru: "Сердце Армении",
          hy: "Հայաստանի սիրտը",
          en: "The heart of Armenia",
        },
        items: {
          ru: ["Монастырь Гегард (ЮНЕСКО)", "Языческий храм Гарни", "Симфония камней", "Азатское водохранилище", "Арка Чаренца с видом на Арарат", "Озеро Севан и монастырь Севанаванк"],
          hy: ["Գեղարդի վանք (ՅՈՒՆԵՍԿՕ)", "Գառնու հեթանոսական տաճար", "Քարե սիմֆոնիա", "Ազատի ջրամբար", "Չարենցի կամար՝ Արարատի տեսարանով", "Սևանա լիճ և Սևանավանք"],
          en: ["Geghard Monastery (UNESCO)", "Garni pagan temple", "Symphony of Stones", "Azat reservoir", "Charents Arch with a view of Ararat", "Lake Sevan and Sevanavank Monastery"],
        },
      },
      {
        day: 3,
        title: {
          ru: "Завершение путешествия",
          hy: "Ճամփորդության ավարտ",
          en: "End of the journey",
        },
        items: {
          ru: ["Завтрак в отеле", "Трансфер в аэропорт"],
          hy: ["Նախաճաշ հյուրանոցում", "Տրանսֆեր օդանավակայան"],
          en: ["Breakfast at the hotel", "Transfer to the airport"],
        },
      },
    ],
    destinations: {
      ru: ["Храм Гарни", "Монастырь Гегард", "Симфония камней", "Арка Чаренца", "Озеро Севан", "Монастырь Севанаванк"],
      hy: ["Գառնու տաճար", "Գեղարդի վանք", "Քարե սիմֆոնիա", "Չարենցի կամար", "Սևանա լիճ", "Սևանավանք"],
      en: ["Garni Temple", "Geghard Monastery", "Symphony of Stones", "Charents Arch", "Lake Sevan", "Sevanavank Monastery"],
    },
  },
  {
    slug: "glubokoe-znakomstvo-s-armeniey",
    categories: ["packages"],
    image: "/images/dilijan.jpg",
    days: 4,
    nights: 3,
    priceFromAmd: 120000,
    priceTiers: [
      { stars: 3, amd: 120000 },
      { stars: 4, amd: 155000 },
      { stars: 5, amd: 230000 },
    ],
    title: {
      ru: "Глубокое знакомство с Арменией",
      hy: "Խորը ծանոթություն Հայաստանի հետ",
      en: "Deep Acquaintance with Armenia",
    },
    description: {
      ru: "4 дня по ключевым символам страны: Гарни и Гегард, Севан, Дилижан и Агарцин, с мастер-классом по лавашу.",
      hy: "4 օր երկրի հիմնական խորհրդանիշներով՝ Գառնի և Գեղարդ, Սևան, Դիլիջան և Հաղարծին՝ լավաշի վարպետաց դասով։",
      en: "4 days through the country's key symbols: Garni and Geghard, Sevan, Dilijan and Haghartsin, with a lavash masterclass.",
    },
    about: {
      ru: "Продуманный тур в небольшой группе для тех, кто хочет узнать Армению вдумчиво, а не галопом.\n\nМаршрут охватывает ключевые символы страны — историю, природу и традиции: храм Гарни, монастырь Гегард, Симфонию камней, озеро Севан, лесной Дилижан и монастырь Агарцин.\n\nОтдельная часть программы — мастер-класс по выпечке лаваша в тонире. В стоимость входят 3 ночи проживания с завтраками, вся программа экскурсий, трансферы, гид и входные билеты.",
      hy: "Մտածված տուր փոքր խմբով նրանց համար, ովքեր ուզում են ճանաչել Հայաստանը խորությամբ, ոչ թե վազքով։\n\nԵրթուղին ընդգրկում է երկրի հիմնական խորհրդանիշները՝ պատմություն, բնություն և ավանդույթներ՝ Գառնու տաճար, Գեղարդի վանք, Քարե սիմֆոնիա, Սևանա լիճ, անտառապատ Դիլիջան և Հաղարծնի վանք։\n\nԾրագրի առանձին մասն է թոնրում լավաշ թխելու վարպետաց դասը։ Արժեքի մեջ ներառված են 3 գիշեր կեցություն նախաճաշերով, էքսկուրսիաների ամբողջ ծրագիրը, տրանսֆերները, գիդը և մուտքի տոմսերը։",
      en: "A thoughtfully paced small-group tour for travellers who want to get to know Armenia properly rather than at a gallop.\n\nThe route covers the country's key symbols — history, nature and tradition: Garni Temple, Geghard Monastery, the Symphony of Stones, Lake Sevan, forested Dilijan and Haghartsin Monastery.\n\nA separate highlight is the lavash-baking masterclass in a tonir. The price includes 3 nights with breakfasts, the full excursion programme, transfers, guide and entrance fees.",
    },
    itinerary: [
      {
        day: 1,
        title: {
          ru: "Встреча и первые впечатления",
          hy: "Դիմավորում և առաջին տպավորություններ",
          en: "Arrival and first impressions",
        },
        items: {
          ru: ["Трансфер из аэропорта и заселение", "Свободное время для прогулки по центру Еревана"],
          hy: ["Տրանսֆեր օդանավակայանից և բնակեցում", "Ազատ ժամանակ Երևանի կենտրոնում զբոսնելու համար"],
          en: ["Airport transfer and hotel check-in", "Free time to explore central Yerevan"],
        },
      },
      {
        day: 2,
        title: {
          ru: "Сердце Армении и традиции",
          hy: "Հայաստանի սիրտը և ավանդույթները",
          en: "The heart of Armenia and its traditions",
        },
        items: {
          ru: ["Монастырь Гегард (ЮНЕСКО)", "Симфония камней", "Языческий храм Гарни", "Азатское водохранилище", "Арка Чаренца с видом на Арарат", "Мастер-класс по выпечке лаваша"],
          hy: ["Գեղարդի վանք (ՅՈՒՆԵՍԿՕ)", "Քարե սիմֆոնիա", "Գառնու հեթանոսական տաճար", "Ազատի ջրամբար", "Չարենցի կամար՝ Արարատի տեսարանով", "Լավաշի թխման վարպետաց դաս"],
          en: ["Geghard Monastery (UNESCO)", "Symphony of Stones", "Garni pagan temple", "Azat reservoir", "Charents Arch with a view of Ararat", "Lavash-baking masterclass"],
        },
      },
      {
        day: 3,
        title: {
          ru: "Севан и Дилижан",
          hy: "Սևան և Դիլիջան",
          en: "Sevan and Dilijan",
        },
        items: {
          ru: ["Озеро Севан и монастырь Севанаванк", "Старый Дилижан", "Монастырь Агарцин"],
          hy: ["Սևանա լիճ և Սևանավանք", "Հին Դիլիջան", "Հաղարծնի վանք"],
          en: ["Lake Sevan and Sevanavank Monastery", "Old Dilijan", "Haghartsin Monastery"],
        },
      },
      {
        day: 4,
        title: {
          ru: "Завершение путешествия",
          hy: "Ճամփորդության ավարտ",
          en: "End of the journey",
        },
        items: {
          ru: ["Завтрак в отеле", "Трансфер в аэропорт"],
          hy: ["Նախաճաշ հյուրանոցում", "Տրանսֆեր օդանավակայան"],
          en: ["Breakfast at the hotel", "Transfer to the airport"],
        },
      },
    ],
    destinations: {
      ru: ["Монастырь Гегард", "Храм Гарни", "Симфония камней", "Озеро Севан", "Старый Дилижан", "Монастырь Агарцин"],
      hy: ["Գեղարդի վանք", "Գառնու տաճար", "Քարե սիմֆոնիա", "Սևանա լիճ", "Հին Դիլիջան", "Հաղարծնի վանք"],
      en: ["Geghard Monastery", "Garni Temple", "Symphony of Stones", "Lake Sevan", "Old Dilijan", "Haghartsin Monastery"],
    },
  },
  {
    slug: "pyat-dney-armenia-v-serdtse",
    categories: ["packages"],
    image: "/images/noravank.jpg",
    days: 5,
    nights: 4,
    priceFromAmd: 165000,
    priceTiers: [
      { stars: 3, amd: 165000 },
      { stars: 4, amd: 205000 },
      { stars: 5, amd: 295000 },
    ],
    title: {
      ru: "5 дней, после которых Армения остаётся в сердце",
      hy: "5 օր, որից հետո Հայաստանը մնում է սրտում",
      en: "5 Days After Which Armenia Stays in Your Heart",
    },
    description: {
      ru: "Ереван, Эчмиадзин, Гарни и Гегард, Севан, Хор Вирап, Нораванк и канатная дорога в Татев за 5 дней.",
      hy: "Երևան, Էջմիածին, Գառնի և Գեղարդ, Սևան, Խոր Վիրապ, Նորավանք և Տաթևի ճոպանուղին՝ 5 օրում։",
      en: "Yerevan, Etchmiadzin, Garni and Geghard, Sevan, Khor Virap, Noravank and the Tatev cableway in 5 days.",
    },
    about: {
      ru: "Тур для тех, кто приезжает впервые и ценит сервис, эмоции и продуманную программу.\n\nЗа пять дней вы увидите главные символы Армении, древние святыни и природные пейзажи: обзорную по Еревану, Эчмиадзинский собор и Звартноц, Гарни и Гегард, озеро Севан, Хор Вирап с видом на Арарат, Нораванк, водопад Шаки и самую длинную канатную дорогу в Татев.\n\nСпокойный темп, малая группа и мастер-класс по лавашу. В стоимость входят 4 ночи с завтраками, все экскурсии, трансферы, гид и входные билеты.",
      hy: "Տուր նրանց համար, ովքեր առաջին անգամ են գալիս և գնահատում են սերվիսը, հույզերը և մտածված ծրագիրը։\n\nՀինգ օրում կտեսնեք Հայաստանի գլխավոր խորհրդանիշները, հին սրբավայրերը և բնական լանդշաֆտները՝ Երևանի շրջայց, Էջմիածնի Մայր տաճար և Զվարթնոց, Գառնի և Գեղարդ, Սևանա լիճ, Խոր Վիրապ՝ Արարատի տեսարանով, Նորավանք, Շաքիի ջրվեժ և Տաթևի ամենաերկար ճոպանուղին։\n\nՀանգիստ տեմպ, փոքր խումբ և լավաշի վարպետաց դաս։ Արժեքի մեջ՝ 4 գիշեր նախաճաշերով, բոլոր էքսկուրսիաները, տրանսֆերները, գիդը և մուտքի տոմսերը։",
      en: "A tour for first-time visitors who value service, emotion and a well-thought-out programme.\n\nOver five days you see Armenia's main symbols, ancient shrines and natural landscapes: a Yerevan city tour, Etchmiadzin Cathedral and Zvartnots, Garni and Geghard, Lake Sevan, Khor Virap with its view of Ararat, Noravank, Shaki waterfall and the longest cableway in the world to Tatev.\n\nA relaxed pace, a small group and a lavash masterclass. The price includes 4 nights with breakfasts, all excursions, transfers, guide and entrance fees.",
    },
    itinerary: [
      {
        day: 1,
        title: {
          ru: "Прибытие в Ереван",
          hy: "Ժամանում Երևան",
          en: "Arrival in Yerevan",
        },
        items: {
          ru: ["Трансфер из аэропорта", "Заселение в отель", "Свободное время в Ереване"],
          hy: ["Տրանսֆեր օդանավակայանից", "Բնակեցում հյուրանոցում", "Ազատ ժամանակ Երևանում"],
          en: ["Airport transfer", "Hotel check-in", "Free time in Yerevan"],
        },
      },
      {
        day: 2,
        title: {
          ru: "Ереван и духовный центр",
          hy: "Երևան և հոգևոր կենտրոն",
          en: "Yerevan and the spiritual centre",
        },
        items: {
          ru: ["Площадь Республики", "Монумент «Мать Армения»", "Каскад и Оперный театр", "Эчмиадзинский кафедральный собор", "Храм Звартноц"],
          hy: ["Հանրապետության հրապարակ", "«Մայր Հայաստան» հուշարձան", "Կասկադ և Օպերայի շենք", "Էջմիածնի Մայր տաճար", "Զվարթնոց տաճար"],
          en: ["Republic Square", "Mother Armenia monument", "The Cascade and the Opera House", "Etchmiadzin Cathedral", "Zvartnots Temple"],
        },
      },
      {
        day: 3,
        title: {
          ru: "Гарни, Гегард и Севан",
          hy: "Գառնի, Գեղարդ և Սևան",
          en: "Garni, Geghard and Sevan",
        },
        items: {
          ru: ["Храм Гарни", "Симфония камней", "Монастырь Гегард", "Мастер-класс по выпечке лаваша", "Озеро Севан и монастырь Севанаванк"],
          hy: ["Գառնու տաճար", "Քարե սիմֆոնիա", "Գեղարդի վանք", "Լավաշի թխման վարպետաց դաս", "Սևանա լիճ և Սևանավանք"],
          en: ["Garni Temple", "Symphony of Stones", "Geghard Monastery", "Lavash-baking masterclass", "Lake Sevan and Sevanavank Monastery"],
        },
      },
      {
        day: 4,
        title: {
          ru: "Юг Армении и Татев",
          hy: "Հայաստանի հարավը և Տաթև",
          en: "Southern Armenia and Tatev",
        },
        items: {
          ru: ["Монастырь Хор Вирап", "Монастырь Нораванк", "Водопад Шаки", "Канатная дорога «Крылья Татева»", "Монастырь Татев"],
          hy: ["Խոր Վիրապ", "Նորավանք", "Շաքիի ջրվեժ", "«Տաթևի թևեր» ճոպանուղի", "Տաթևի վանք"],
          en: ["Khor Virap Monastery", "Noravank Monastery", "Shaki waterfall", "Wings of Tatev cableway", "Tatev Monastery"],
        },
      },
      {
        day: 5,
        title: {
          ru: "Завершение путешествия",
          hy: "Ճամփորդության ավարտ",
          en: "End of the journey",
        },
        items: {
          ru: ["Завтрак в отеле", "Трансфер в аэропорт"],
          hy: ["Նախաճաշ հյուրանոցում", "Տրանսֆեր օդանավակայան"],
          en: ["Breakfast at the hotel", "Transfer to the airport"],
        },
      },
    ],
    destinations: {
      ru: ["Ереван", "Эчмиадзин", "Звартноц", "Храм Гарни", "Монастырь Гегард", "Озеро Севан", "Хор Вирап", "Нораванк", "Монастырь Татев"],
      hy: ["Երևան", "Էջմիածին", "Զվարթնոց", "Գառնու տաճար", "Գեղարդի վանք", "Սևանա լիճ", "Խոր Վիրապ", "Նորավանք", "Տաթևի վանք"],
      en: ["Yerevan", "Etchmiadzin", "Zvartnots", "Garni Temple", "Geghard Monastery", "Lake Sevan", "Khor Virap", "Noravank", "Tatev Monastery"],
    },
  },
  {
    slug: "armenia-s-nochevkoy-v-gorah",
    categories: ["packages"],
    image: "/images/tatev.jpg",
    days: 6,
    nights: 5,
    priceFromAmd: 205000,
    priceTiers: [
      { stars: 3, amd: 205000 },
      { stars: 4, amd: 275000 },
      { stars: 5, amd: 360000 },
    ],
    title: {
      ru: "Армения с ночёвкой в горах",
      hy: "Հայաստան՝ գիշերակացով լեռներում",
      en: "Armenia with a Night in the Mountains",
    },
    description: {
      ru: "6 дней с ночёвкой в горах на юге страны: Татев, канатная дорога, водопад Шаки, дегустация вина и Севан.",
      hy: "6 օր՝ գիշերակացով լեռներում երկրի հարավում՝ Տաթև, ճոպանուղի, Շաքիի ջրվեժ, գինու համտես և Սևան։",
      en: "6 days including a night in the southern mountains: Tatev, the cableway, Shaki waterfall, wine tasting and Sevan.",
    },
    about: {
      ru: "Тур для тех, кто хочет увидеть Армению не поверхностно, а почувствовать её ритм, пространство и атмосферу.\n\nПрограмма сочетает насыщенные экскурсионные дни и дни отдыха: юг страны с ночёвкой в горах, монастырь Татев и знаменитая канатная дорога, водопад Шаки, винный регион с дегустацией, а также классический маршрут Гарни — Гегард — Севан.\n\nВ стоимость входят 5 ночей проживания с завтраками, дегустация вина, все экскурсии, трансферы, профессиональный гид и входные билеты.",
      hy: "Տուր նրանց համար, ովքեր ուզում են Հայաստանը տեսնել ոչ մակերեսային, այլ զգալ նրա ռիթմը, տարածությունը և մթնոլորտը։\n\nԾրագիրը համատեղում է հագեցած էքսկուրսիոն օրերը և հանգստի օրերը՝ երկրի հարավը՝ գիշերակացով լեռներում, Տաթևի վանք և հայտնի ճոպանուղին, Շաքիի ջրվեժ, գինու շրջան՝ համտեսով, ինչպես նաև դասական Գառնի — Գեղարդ — Սևան երթուղին։\n\nԱրժեքի մեջ՝ 5 գիշեր կեցություն նախաճաշերով, գինու համտես, բոլոր էքսկուրսիաները, տրանսֆերները, մասնագիտական գիդը և մուտքի տոմսերը։",
      en: "A tour for travellers who want to feel Armenia's rhythm, space and atmosphere rather than skim the surface.\n\nThe programme balances full excursion days with rest days: the south of the country with a night in the mountains, Tatev Monastery and its famous cableway, Shaki waterfall, the wine region with a tasting, plus the classic Garni — Geghard — Sevan route.\n\nThe price includes 5 nights with breakfasts, a wine tasting, all excursions, transfers, a professional guide and entrance fees.",
    },
    itinerary: [
      {
        day: 1,
        title: {
          ru: "Прибытие и отдых",
          hy: "Ժամանում և հանգիստ",
          en: "Arrival and rest",
        },
        items: {
          ru: ["Трансфер из аэропорта", "Заселение в отель", "Отдых и акклиматизация"],
          hy: ["Տրանսֆեր օդանավակայանից", "Բնակեցում հյուրանոցում", "Հանգիստ և ադապտացիա"],
          en: ["Airport transfer", "Hotel check-in", "Rest and acclimatisation"],
        },
      },
      {
        day: 2,
        title: {
          ru: "Дорога на юг и ночёвка в горах",
          hy: "Ճանապարհ դեպի հարավ և գիշերակաց լեռներում",
          en: "South and a night in the mountains",
        },
        items: {
          ru: ["Маршрут на юг Армении", "Дегустация вина в винном регионе", "Ночёвка в горах"],
          hy: ["Երթուղի դեպի Հայաստանի հարավ", "Գինու համտես գինու շրջանում", "Գիշերակաց լեռներում"],
          en: ["Route to southern Armenia", "Wine tasting in the wine region", "Overnight in the mountains"],
        },
      },
      {
        day: 3,
        title: {
          ru: "Татев и водопад Шаки",
          hy: "Տաթև և Շաքիի ջրվեժ",
          en: "Tatev and Shaki waterfall",
        },
        items: {
          ru: ["Канатная дорога «Крылья Татева»", "Монастырь Татев", "Водопад Шаки", "Возвращение в Ереван"],
          hy: ["«Տաթևի թևեր» ճոպանուղի", "Տաթևի վանք", "Շաքիի ջրվեժ", "Վերադարձ Երևան"],
          en: ["Wings of Tatev cableway", "Tatev Monastery", "Shaki waterfall", "Return to Yerevan"],
        },
      },
      {
        day: 4,
        title: {
          ru: "Свободный день в Ереване",
          hy: "Ազատ օր Երևանում",
          en: "Free day in Yerevan",
        },
        items: {
          ru: ["Свободный день", "Дополнительные экскурсии по желанию"],
          hy: ["Ազատ օր", "Լրացուցիչ էքսկուրսիաներ ըստ ցանկության"],
          en: ["Free day", "Optional extra excursions"],
        },
      },
      {
        day: 5,
        title: {
          ru: "Классическая Армения",
          hy: "Դասական Հայաստան",
          en: "Classical Armenia",
        },
        items: {
          ru: ["Храм Гарни", "Монастырь Гегард", "Арка Чаренца", "Озеро Севан и монастырь Севанаванк"],
          hy: ["Գառնու տաճար", "Գեղարդի վանք", "Չարենցի կամար", "Սևանա լիճ և Սևանավանք"],
          en: ["Garni Temple", "Geghard Monastery", "Charents Arch", "Lake Sevan and Sevanavank Monastery"],
        },
      },
      {
        day: 6,
        title: {
          ru: "Завершение путешествия",
          hy: "Ճամփորդության ավարտ",
          en: "End of the journey",
        },
        items: {
          ru: ["Завтрак и выселение", "Трансфер в аэропорт"],
          hy: ["Նախաճաշ և դուրս գրվել", "Տրանսֆեր օդանավակայան"],
          en: ["Breakfast and check-out", "Transfer to the airport"],
        },
      },
    ],
    destinations: {
      ru: ["Юг Армении", "Монастырь Татев", "Канатная дорога «Крылья Татева»", "Водопад Шаки", "Храм Гарни", "Монастырь Гегард", "Озеро Севан"],
      hy: ["Հայաստանի հարավ", "Տաթևի վանք", "«Տաթևի թևեր» ճոպանուղի", "Շաքիի ջրվեժ", "Գառնու տաճար", "Գեղարդի վանք", "Սևանա լիճ"],
      en: ["Southern Armenia", "Tatev Monastery", "Wings of Tatev cableway", "Shaki waterfall", "Garni Temple", "Geghard Monastery", "Lake Sevan"],
    },
  },
  {
    slug: "armenia-vne-shablonov",
    categories: ["packages"],
    image: "/images/sevan.jpg",
    days: 8,
    nights: 7,
    priceFromAmd: 335000,
    priceTiers: [
      { stars: 3, amd: 335000 },
      { stars: 4, amd: 405000 },
      { stars: 5, amd: 505000 },
    ],
    title: {
      ru: "Армения вне шаблонов",
      hy: "Հայաստանը կաղապարներից դուրս",
      en: "Armenia Beyond the Clichés",
    },
    description: {
      ru: "8 дней по всей стране: север и Лори, Дилижан, Севан, Цахкадзор, монастыри ЮНЕСКО и мастер-класс по лавашу.",
      hy: "8 օր ամբողջ երկրով՝ հյուսիս և Լոռի, Դիլիջան, Սևան, Ծաղկաձոր, ՅՈՒՆԵՍԿՕ-ի վանքեր և լավաշի վարպետաց դաս։",
      en: "8 days across the country: the north and Lori, Dilijan, Sevan, Tsaghkadzor, UNESCO monasteries and a lavash masterclass.",
    },
    about: {
      ru: "Самое полное путешествие для тех, кто хочет увидеть настоящую Армению — не только открыточные места.\n\nМаршрут охватывает духовные монастыри, альпийские пейзажи, северные регионы Лори, озеро Севан и традиционные ремёсла. Программа построена без изматывающих переездов: насыщенные дни чередуются со свободными.\n\nВ стоимость входят 7 ночей проживания с завтраками, все экскурсии и мастер-классы, трансферы, профессиональный гид и входные билеты.",
      hy: "Ամենալիարժեք ճամփորդությունը նրանց համար, ովքեր ուզում են տեսնել իսկական Հայաստանը՝ ոչ միայն բացիկների վայրերը։\n\nԵրթուղին ընդգրկում է հոգևոր վանքեր, ալպիական լանդշաֆտներ, Լոռու հյուսիսային շրջանները, Սևանա լիճը և ավանդական արհեստները։ Ծրագիրը կառուցված է առանց հոգնեցնող տեղափոխությունների՝ հագեցած օրերը հերթափոխվում են ազատներով։\n\nԱրժեքի մեջ՝ 7 գիշեր կեցություն նախաճաշերով, բոլոր էքսկուրսիաներն ու վարպետաց դասերը, տրանսֆերները, մասնագիտական գիդը և մուտքի տոմսերը։",
      en: "The most complete journey, for travellers who want the real Armenia — not just the postcard spots.\n\nThe route takes in spiritual monasteries, alpine landscapes, the northern Lori region, Lake Sevan and traditional crafts. It is built without exhausting transfers: busy days alternate with free ones.\n\nThe price includes 7 nights with breakfasts, all excursions and masterclasses, transfers, a professional guide and entrance fees.",
    },
    itinerary: [
      {
        day: 1,
        title: { ru: "Прибытие в Ереван", hy: "Ժամանում Երևան", en: "Arrival in Yerevan" },
        items: {
          ru: ["Встреча в аэропорту", "Трансфер и заселение в отель"],
          hy: ["Դիմավորում օդանավակայանում", "Տրանսֆեր և բնակեցում հյուրանոցում"],
          en: ["Airport pick-up", "Transfer and hotel check-in"],
        },
      },
      {
        day: 2,
        title: { ru: "Вид на Арарат и духовные центры", hy: "Արարատի տեսարան և հոգևոր կենտրոններ", en: "Ararat views and spiritual centres" },
        items: {
          ru: ["Панорамы Арарата", "Монастырь Сагмосаванк", "Монастырь Ованаванк"],
          hy: ["Արարատի համայնապատկերներ", "Սաղմոսավանք", "Հովհաննավանք"],
          en: ["Ararat panoramas", "Saghmosavank Monastery", "Hovhannavank Monastery"],
        },
      },
      {
        day: 3,
        title: { ru: "Север Армении — Лори", hy: "Հայաստանի հյուսիս — Լոռի", en: "Northern Armenia — Lori" },
        items: {
          ru: ["Монастырь Санаин (ЮНЕСКО)", "Монастырь Ахпат (ЮНЕСКО)", "Крепость Зарни-Парни", "Пещера Мендз-Ер"],
          hy: ["Սանահինի վանք (ՅՈՒՆԵՍԿՕ)", "Հաղպատի վանք (ՅՈՒՆԵՍԿՕ)", "Զառնի-Փառնի ամրոց", "Մենձ-Եր քարանձավ"],
          en: ["Sanahin Monastery (UNESCO)", "Haghpat Monastery (UNESCO)", "Zarni-Parni fortress", "Mendz-Er cave"],
        },
      },
      {
        day: 4,
        title: { ru: "Дилижан и озеро Севан", hy: "Դիլիջան և Սևանա լիճ", en: "Dilijan and Lake Sevan" },
        items: {
          ru: ["Леса Дилижана", "Озеро Парз", "Монастырь Гошаванк", "Переезд на Севан"],
          hy: ["Դիլիջանի անտառներ", "Պարզ լիճ", "Գոշավանք", "Տեղափոխում Սևան"],
          en: ["Dilijan forests", "Lake Parz", "Goshavank Monastery", "Transfer to Lake Sevan"],
        },
      },
      {
        day: 5,
        title: { ru: "Свободный день на Севане", hy: "Ազատ օր Սևանում", en: "Free day at Sevan" },
        items: {
          ru: ["Свободный день у озера", "Дополнительные активности по желанию"],
          hy: ["Ազատ օր լճի մոտ", "Լրացուցիչ ակտիվություններ ըստ ցանկության"],
          en: ["Free day by the lake", "Optional activities"],
        },
      },
      {
        day: 6,
        title: { ru: "Цахкадзор и Гутанасар", hy: "Ծաղկաձոր և Գութանասար", en: "Tsaghkadzor and Gutanasar" },
        items: {
          ru: ["Горный курорт Цахкадзор", "Монастырь Кечарис", "Вулкан Гутанасар"],
          hy: ["Ծաղկաձոր լեռնային հանգստավայր", "Կեչառիսի վանք", "Գութանասար հրաբուխ"],
          en: ["Tsaghkadzor mountain resort", "Kecharis Monastery", "Gutanasar volcano"],
        },
      },
      {
        day: 7,
        title: { ru: "Традиции и наследие ЮНЕСКО", hy: "Ավանդույթներ և ՅՈՒՆԵՍԿՕ-ի ժառանգություն", en: "Traditions and UNESCO heritage" },
        items: {
          ru: ["Мастер-класс по выпечке лаваша", "Монастырь Гегард (ЮНЕСКО)", "Храм Гарни", "Арка Чаренца", "Азатское водохранилище"],
          hy: ["Լավաշի թխման վարպետաց դաս", "Գեղարդի վանք (ՅՈՒՆԵՍԿՕ)", "Գառնու տաճար", "Չարենցի կամար", "Ազատի ջրամբար"],
          en: ["Lavash-baking masterclass", "Geghard Monastery (UNESCO)", "Garni Temple", "Charents Arch", "Azat reservoir"],
        },
      },
      {
        day: 8,
        title: { ru: "Завершение путешествия", hy: "Ճամփորդության ավարտ", en: "End of the journey" },
        items: {
          ru: ["Завтрак в отеле", "Трансфер в аэропорт"],
          hy: ["Նախաճաշ հյուրանոցում", "Տրանսֆեր օդանավակայան"],
          en: ["Breakfast at the hotel", "Transfer to the airport"],
        },
      },
    ],
    destinations: {
      ru: ["Сагмосаванк", "Ованаванк", "Санаин и Ахпат (ЮНЕСКО)", "Дилижан", "Озеро Парз", "Гошаванк", "Озеро Севан", "Цахкадзор", "Монастырь Гегард", "Храм Гарни"],
      hy: ["Սաղմոսավանք", "Հովհաննավանք", "Սանահին և Հաղպատ (ՅՈՒՆԵՍԿՕ)", "Դիլիջան", "Պարզ լիճ", "Գոշավանք", "Սևանա լիճ", "Ծաղկաձոր", "Գեղարդի վանք", "Գառնու տաճար"],
      en: ["Saghmosavank", "Hovhannavank", "Sanahin and Haghpat (UNESCO)", "Dilijan", "Lake Parz", "Goshavank", "Lake Sevan", "Tsaghkadzor", "Geghard Monastery", "Garni Temple"],
    },
  },
];

// A tour is on sale when an old price above the current one is set. Returns the
// rounded saving, or null — an old price at or below the current one is treated
// as no sale rather than rendering a struck-through price that reads as nonsense.
export function discountPercent(tour: Tour): number | null {
  if (!tour.priceOldAmd || tour.priceOldAmd <= tour.priceFromAmd) return null;
  return Math.round((1 - tour.priceFromAmd / tour.priceOldAmd) * 100);
}

// Shortest and longest package in a list, used to label a listing as
// multi-day ("3–7 days"). Null when the list holds no multi-day packages.
export function packageDayRange(list: Tour[]): { min: number; max: number } | null {
  const days = list.map((t) => t.days).filter((d): d is number => Boolean(d));
  if (!days.length) return null;
  return { min: Math.min(...days), max: Math.max(...days) };
}

export function formatPrice(amd: number): string {
  return `${amd.toLocaleString("ru-RU")} ֏`;
}

// Tour packages are no longer one category among others: they have their own
// top-level section at /<locale>/tour-packages. The category object stays in
// the data because it still carries the section heading, description and
// photo — it is just hidden from every public category listing and edited in
// its own admin tab instead of the Categories one.
export const PACKAGES_CATEGORY_ID = "packages";

export function isPackageTour(tour: Tour): boolean {
  return tour.categories.includes(PACKAGES_CATEGORY_ID);
}

// Categories shown to visitors as browsable tiles. Packages are excluded
// because they are reached from the header instead.
export function publicCategories(list: Category[]): Category[] {
  return list.filter((c) => c.id !== PACKAGES_CATEGORY_ID);
}

export function findPackagesCategory(list: Category[]): Category | undefined {
  return list.find((c) => c.id === PACKAGES_CATEGORY_ID);
}

// The canonical path of a tour, without a locale. Packages live outside
// /tours entirely, so every link goes through here rather than assuming
// categories[0].
export function tourPath(tour: Tour): string {
  if (isPackageTour(tour)) return `/tour-packages/${tour.slug}`;
  return `/tours/${tour.categories[0]}/${tour.slug}`;
}

export function tourHref(locale: string, tour: Tour): string {
  return `/${locale}${tourPath(tour)}`;
}
