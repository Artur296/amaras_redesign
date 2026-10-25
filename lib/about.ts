import type { Locale } from "@/lib/i18n";

export type AboutSection = {
  kicker: Record<Locale, string>;
  title: Record<Locale, string>;
  subtitle: Record<Locale, string>;
  story: Record<Locale, string[]>;
  vision: {
    title: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
  };
  mission: {
    title: Record<Locale, string>;
    highlight: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
  };
  values: {
    title: Record<Locale, string>;
    items: {
      title: Record<Locale, string>;
      desc: Record<Locale, string>;
    }[];
  };
  heartfelt: {
    title: Record<Locale, string>;
    paragraphs: Record<Locale, string[]>;
    signature: Record<Locale, string>;
    motto: Record<Locale, string>;
  };
};

export const aboutData: AboutSection = {
  kicker: {
    ru: "AMARAS TOUR",
    hy: "AMARAS TOUR",
    en: "AMARAS TOUR",
  },
  title: {
    ru: "О нас",
    hy: "Մեր մասին",
    en: "About Us",
  },
  subtitle: {
    ru: "Ваш гид и друг в Армении",
    hy: "Ձեր գիդն ու ընկերը Հայաստանում",
    en: "Your Guide & Friend in Armenia",
  },
  story: {
    ru: [
      "Мы показываем Армению не только потому, что это наша работа. Это наша работа потому, что мы любим показывать Армению.",
      "Мы любим её горы и древние монастыри, маленькие деревни и шумные улицы Еревана, её историю, традиции и людей. Любим те места, куда хочется возвращаться снова, даже если бывал там десятки раз. И нам искренне хочется, чтобы наши гости увидели и почувствовали то, за что мы сами так любим эту страну.",
      "Amaras Tour — туристическая компания, за которой стоят более 10 лет опыта в сфере туризма и команда людей, увлечённых своим делом.",
      "Мы организуем групповые, индивидуальные и авторские туры, винные и гастрономические путешествия, кулинарные мастер-классы, джип-туры и экстремальные приключения, фототуры, трансферы и многодневные поездки по Армении.",
      "За каждой экскурсией стоят люди. Менеджеры, которые помогают выбрать подходящий маршрут и отвечают на вопросы. Водители, которые заботятся о спокойной и комфортной дороге. Гиды, которые знают и любят свою страну и умеют делиться этой любовью с другими.",
      "У каждого своя работа, но всех нас объединяет одно — желание, чтобы гости провели с нами действительно хороший день.",
      "Мы знаем, как долго иногда ждут отпуска, как тщательно выбирают страну, планируют поездку и мечтают увидеть новые места. И когда вы доверяете нам часть своего путешествия, мы понимаем, насколько это важно.",
      "Поэтому мы стараемся продумывать всё: от первого общения и выбора маршрута до возвращения после экскурсии. Для нас важны не только красивые места, но и комфорт, безопасность, интересные рассказы, честные условия и простое человеческое внимание.",
      "Мы не хотим убеждать вас, что мы лучше других. Мы хотим, чтобы вы сами почувствовали разницу в отношении к своему делу.",
      "Мы открыто рассказываем о стоимости, программе и дополнительных расходах. Не обещаем того, чего не можем выполнить, и не предлагаем лишнего ради продажи. Мы считаем, что доверие нельзя получить красивыми словами — его можно только заслужить.",
      "И знаете, что для нас особенно ценно? Когда после экскурсии гости пишут, что прекрасно провели день. Когда возвращаются, чтобы отправиться с нами по другому маршруту. Когда рекомендуют нас друзьям и близким.",
      "В такие моменты мы понимаем, что наша работа — это гораздо больше, чем организация поездок.",
    ],
    hy: [
      "Մենք ցույց ենք տալիս Հայաստանը ոչ միայն այն պատճառով, որ դա մեր աշխատանքն է։ Դա մեր աշխատանքն է, որովհետև մենք սիրում ենք ցույց տալ Հայաստանը։",
      "Մենք սիրում ենք նրա լեռներն ու հնագույն վանքերը, փոքրիկ գյուղերն ու Երևանի աշխույժ փողոցները, նրա պատմությունը, ավանդույթներն ու մարդկանց։ Սիրում ենք այն վայրերը, որտեղ ցանկանում ես վերադառնալ նորից ու նորից։ Եվ մենք անկեղծորեն ցանկանում ենք, որ մեր հյուրերը տեսնեն և զգան այն, ինչի համար մենք ինքներս այդքան սիրում ենք այս երկիրը։",
      "Amaras Tour-ը տուրիստական ընկերություն է, որի հետևում կանգնած են ավելի քան 10 տարվա փորձ զբոսաշրջության ոլորտում և իրենց գործին նվիրված մարդկանց թիմ։",
      "Մենք կազմակերպում ենք խմբային, անհատական և հեղինակային տուրեր, գինու և գաստրոնոմիական ճամփորդություններ, խոհարարական վարպետության դասեր, ջիպ-արշավներ և էքստրեմալ արկածներ, ֆոտոտուրեր, տրանսֆերներ և բազմօրյա ճամփորդություններ Հայաստանով։",
      "Յուրաքանչյուր էքսկուրսիայի հետևում կանգնած են մարդիկ։ Մենեջերները, ովքեր օգնում են ընտրել համապատասխան երթուղին և պատասխանում հարցերին։ Վարորդները, ովքեր հոգ են տանում հանգիստ և հարմարավետ ճանապարհի մասին։ Գիդերը, ովքեր գիտեն ու սիրում են իրենց երկիրը և կարողանում են այդ սերը փոխանցել ուրիշներին։",
      "Յուրաքանչյուրն ունի իր աշխատանքը, բայց բոլորիս միավորում է մեկ նպատակ՝ որ հյուրերը մեզ հետ անցկացնեն իսկապես հիանալի օր։",
      "Մենք գիտենք, թե երբեմն որքան երկար են սպասում արձակուրդին, որքան մանրակրկիտ են ընտրում երկիրը, պլանավորում ճամփորդությունը և երազում տեսնել նոր վայրեր։ Եվ երբ դուք վստահում եք մեզ ձեր ճանապարհորդության մի մասը, մենք հասկանում ենք, թե որքան կարևոր է դա։",
      "Այդ իսկ պատճառով մենք ձգտում ենք մտածել ամեն ինչ՝ առաջին շփումից և երթուղու ընտրությունից մինչև էքսկուրսիայից հետո վերադարձը։ Մեզ համար կարևոր են ոչ միայն գեղեցիկ վայրերը, այլև հարմարավետությունը, անվտանգությունը, հետաքրքիր պատմությունները, ազնիվ պայմանները և պարզ մարդկային ուշադրությունը։",
      "Մենք չենք ուզում ձեզ համոզել, որ ավելի լավն ենք, քան մյուսները։ Մենք ուզում ենք, որ դուք ինքներդ զգաք տարբերությունը գործի հանդեպ մեր վերաբերմունքում։",
      "Մենք բացահայտ խոսում ենք արժեքի, ծրագրի և լրացուցիչ ծախսերի մասին։ Չենք խոստանում այն, ինչ չենք կարող կատարել, և չենք առաջարկում ավելորդ բաներ միայն վաճառքի համար։ Մենք հավատում ենք, որ վստահությունը չի կարելի ձեռք բերել գեղեցիկ խոսքերով. այն կարելի է միայն վաստակել։",
      "Եվ գիտե՞ք՝ ինչն է մեզ համար հատկապես արժեքավոր։ Երբ էքսկուրսիայից հետո հյուրերը գրում են, որ հիանալի օր են անցկացրել։ Երբ վերադառնում են՝ մեզ հետ մեկ այլ երթուղով ճանապարհ ընկնելու։ Երբ մեզ խորհուրդ են տալիս ընկերներին և հարազատներին։",
      "Այդպիսի պահերին մենք հասկանում ենք, որ մեր աշխատանքը շատ ավելին է, քան պարզապես ուղևորությունների կազմակերպումը։",
    ],
    en: [
      "We show Armenia not just because it is our job. It is our job because we genuinely love showing Armenia.",
      "We love its majestic mountains, ancient monasteries, tucked-away villages, and vibrant Yerevan streets; its deep history, traditions, and welcoming people. We love the places you yearn to return to again and again, even if you have visited them dozens of times. And we wholeheartedly want our guests to see and feel what makes us love this country so deeply.",
      "Amaras Tour is a travel company built upon more than 10 years of professional tourism experience and a close-knit team deeply passionate about their craft.",
      "We organize group, private, and bespoke author tours, wine and culinary journeys, cooking masterclasses, 4x4 off-road expeditions, photo journeys, private transfers, and multi-day packages across Armenia.",
      "Behind every single excursion are real, dedicated people. Coordinators who guide you toward the ideal itinerary and answer every question. Drivers who guarantee a smooth, safe, and restful road. Guides who know and cherish their homeland and know how to share that love with others.",
      "Everyone has their own role, but we are all united by a single wish — for every guest to have a truly wonderful, memorable day with us.",
      "We understand how long people anticipate a holiday, how carefully they choose their destination, plan their days, and dream of discovering new horizons. When you entrust a part of your journey to us, we know how deeply that matters.",
      "That is why we think through every single detail: from our very first greeting and itinerary planning to your safe return. To us, stunning landmarks matter just as much as comfort, safety, captivating stories, honest conditions, and heartfelt personal attention.",
      "We do not seek to convince you that we are better than others. We want you to feel the difference for yourself through our dedication and care.",
      "We are completely transparent about pricing, itineraries, and any extra costs. We never promise what we cannot fulfill, nor do we push unneeded extras just to make a sale. We believe genuine trust cannot be earned with polished words — it can only be proven through deeds.",
      "And do you know what we treasure most? When guests write to us after a tour saying they had a magnificent day. When they return to explore another route with us. When they recommend us with confidence to their dearest family and friends.",
      "In those moments, we know our work is so much more than simply organizing trips.",
    ],
  },
  vision: {
    title: {
      ru: "Наше видение",
      hy: "Մեր տեսլականը",
      en: "Our Vision",
    },
    paragraphs: {
      ru: [
        "Мы хотим, чтобы Amaras Tour стала компанией, о которой вспоминают с теплом и которую рекомендуют с уверенностью.",
        "Мы стремимся развивать новые направления, совершенствовать качество наших услуг и создавать путешествия, в которых каждая деталь имеет значение.",
        "Но, становясь больше, мы хотим сохранить самое главное — искренность, ответственность и личное отношение к людям.",
        "Для нас важно не только то, сколько гостей путешествует с Amaras Tour, но и то, с какими впечатлениями они возвращаются домой.",
      ],
      hy: [
        "Մենք ցանկանում ենք, որ Amaras Tour-ը դառնա ընկերություն, որին հիշում են ջերմությամբ և վստահությամբ երաշխավորում։",
        "Մենք ձգտում ենք զարգացնել նոր ուղղություններ, կատարելագործել մեր ծառայությունների որակը և ստեղծել ճամփորդություններ, որտեղ յուրաքանչյուր մանրուք կարևոր է։",
        "Բայց, մեծանալով, մենք ցանկանում ենք պահպանել ամենակարևորը՝ անկեղծությունը, պատասխանատվությունը և անձնական վերաբերմունքը մարդկանց նկատմամբ։",
        "Մեզ համար կարևոր է ոչ միայն այն, թե քանի հյուր է ճամփորդում Amaras Tour-ի հետ, այլև այն, թե ինչպիսի տպավորություններով են նրանք վերադառնում տուն։",
      ],
      en: [
        "We want Amaras Tour to be a company remembered with warmth and recommended with confidence.",
        "We strive to develop new destinations, elevate the quality of our service, and design journeys where every single detail matters.",
        "Yet as we grow, we remain committed to what matters most — sincerity, responsibility, and a genuinely personal touch.",
        "What matters to us isn't simply how many travellers journey with Amaras Tour, but what impressions and memories they take back home.",
      ],
    },
  },
  mission: {
    title: {
      ru: "Наша миссия",
      hy: "Մեր առաքելությունը",
      en: "Our Mission",
    },
    highlight: {
      ru: "Помогать людям открывать Армению так, чтобы она оставалась в их сердце.",
      hy: "Օգնել մարդկանց բացահայտել Հայաստանն այնպես, որ այն մնա նրանց սրտում։",
      en: "Helping travellers discover Armenia in a way that forever stays in their heart.",
    },
    paragraphs: {
      ru: [
        "Не просто показывать достопримечательности, а знакомить с историей, культурой, природой, традициями и людьми нашей страны.",
        "Создавать путешествия, в которых есть место новым знаниям, ярким впечатлениям, отдыху и живому общению.",
        "Мы хотим, чтобы каждый наш гость почувствовал себя в Армении не чужим туристом, а желанным гостем.",
      ],
      hy: [
        "Ոչ միայն ցույց տալ տեսարժան վայրերը, այլև ծանոթացնել մեր երկրի պատմությանը, մշակույթին, բնությանը, ավանդույթներին և մարդկանց։",
        "Ստեղծել ճամփորդություններ, որտեղ տեղ կա նոր գիտելիքների, վառ տպավորությունների, հանգստի և կենդանի շփման համար։",
        "Մենք ցանկանում ենք, որ յուրաքանչյուր մեր հյուր Հայաստանում իրեն զգա ոչ թե օտար զբոսաշրջիկ, այլ սպասված հյուր։",
      ],
      en: [
        "Not merely showing sights, but introducing the deep history, culture, nature, traditions, and generous people of our homeland.",
        "Crafting journeys with room for inspiring discoveries, unforgettable impressions, restful moments, and authentic connection.",
        "We want every guest to feel in Armenia not like an ordinary tourist, but like a genuinely cherished guest.",
      ],
    },
  },
  values: {
    title: {
      ru: "Наши ценности",
      hy: "Մեր արժեքները",
      en: "Our Values",
    },
    items: [
      {
        title: {
          ru: "Честность и доверие",
          hy: "Ազնվություն և վստահություն",
          en: "Honesty & Trust",
        },
        desc: {
          ru: "Мы открыто говорим о стоимости, условиях и особенностях путешествия. Для нас важно, чтобы гости точно знали, чего ожидать.",
          hy: "Մենք բացահայտ խոսում ենք արժեքի, պայմանների և ճամփորդության առանձնահատկությունների մասին։ Մեզ համար կարևոր է, որ հյուրերը հստակ իմանան, թե ինչ սպասել։",
          en: "We speak transparently about prices, conditions, and tour details. It is vital to us that guests know exactly what to expect.",
        },
      },
      {
        title: {
          ru: "Ответственность",
          hy: "Պատասխանատվություն",
          en: "Responsibility",
        },
        desc: {
          ru: "Мы ценим ваше время и доверие. Поэтому серьёзно относимся к каждому бронированию и каждому обещанию.",
          hy: "Մենք գնահատում ենք ձեր ժամանակն ու վստահությունը։ Այդ պատճառով լրջորեն ենք վերաբերվում յուրաքանչյուր ամրագրմանը և յուրաքանչյուր խոստմանը։",
          en: "We value your time and confidence. That is why we treat every booking and every commitment with paramount seriousness.",
        },
      },
      {
        title: {
          ru: "Профессионализм",
          hy: "Պրոֆեսիոնալիզմ",
          en: "Professionalism",
        },
        desc: {
          ru: "Мы верим, что опыт, знания и любовь к своему делу должны чувствоваться не в рекламе, а в самой экскурсии.",
          hy: "Մենք հավատում ենք, որ փորձը, գիտելիքները և սերը գործի հանդեպ պետք է զգացվեն ոչ թե գովազդում, այլ բուն էքսկուրսիայի ընթացքում։",
          en: "We believe expertise, deep knowledge, and passion for our craft must be felt during the tour itself, not just in marketing.",
        },
      },
      {
        title: {
          ru: "Забота о людях",
          hy: "Հոգատարություն մարդկանց հանդեպ",
          en: "Care for People",
        },
        desc: {
          ru: "Для нас важен каждый гость, его комфорт, пожелания и впечатления, независимо от выбранного маршрута.",
          hy: "Մեզ համար կարևոր է յուրաքանչյուր հյուր, նրա հարմարավետությունը, ցանկություններն ու տպավորությունները՝ անկախ ընտրված երթուղուց։",
          en: "Every single guest matters to us — their comfort, personal wishes, and impressions, regardless of the chosen route.",
        },
      },
      {
        title: {
          ru: "Любовь к Армении",
          hy: "Սեր Հայաստանի հանդեպ",
          en: "Love for Armenia",
        },
        desc: {
          ru: "Мы гордимся своей страной и хотим делиться её красотой, историей и гостеприимством с людьми со всего мира.",
          hy: "Մենք հպարտանում ենք մեր երկրով և ցանկանում ենք կիսվել նրա գեղեցկությամբ, պատմությամբ ու հյուրընկալությամբ ամբողջ աշխարհի մարդկանց հետ։",
          en: "We take immense pride in our country and wish to share its majesty, rich history, and genuine hospitality with the entire world.",
        },
      },
    ],
  },
  heartfelt: {
    title: {
      ru: "И ещё немного от души…",
      hy: "Եվ մի փոքր էլ սրտից…",
      en: "A Word from the Heart…",
    },
    paragraphs: {
      ru: [
        "Мы не можем обещать, что во время путешествия всегда будет солнечно, что дороги будут свободными или что всё сложится идеально.",
        "Но мы можем обещать, что будем относиться к вашему путешествию с той же ответственностью, с какой хотели бы, чтобы другие относились к нашему собственному отдыху.",
        "Нам хочется, чтобы после поездки вы вспоминали не только горы, монастыри и красивые фотографии, но и людей, с которыми провели этот день.",
        "И если, возвращаясь домой, вы увезёте с собой хотя бы частичку нашей любви к Армении, значит, мы не зря делаем свою работу.",
      ],
      hy: [
        "Մենք չենք կարող խոստանալ, որ ճամփորդության ընթացքում միշտ արև կլինի, ճանապարհները կլինեն ազատ կամ ամեն ինչ կդասավորվի կատարյալ։",
        "Բայց մենք կարող ենք խոստանալ, որ ձեր ճամփորդությանը կվերաբերվենք նույն պատասխանատվությամբ, ինչպես կցանկանայինք, որ ուրիշները վերաբերվեին մեր սեփական հանգստին։",
        "Մենք ցանկանում ենք, որ ուղևորությունից հետո դուք հիշեք ոչ միայն սարերը, վանքերն ու գեղեցիկ լուսանկարները, այլև այն մարդկանց, ում հետ անցկացրել եք այդ օրը։",
        "Եվ եթե, տուն վերադառնալով, ձեզ հետ տանեք մեր՝ Հայաստանի հանդեպ ունեցած սիրո գոնե մի մասնիկը, ուրեմն մենք իզուր չենք անում մեր գործը։",
      ],
      en: [
        "We cannot promise that every travel day will be bathed in sunshine, that the mountain roads will always be clear, or that everything will unfold effortlessly.",
        "But we can promise to treat your journey with the exact same care and responsibility we would hope for on our own holidays.",
        "We want you to look back on your trip remembering not just the majestic mountains, ancient monasteries, and beautiful photos, but the people who shared this day with you.",
        "And if, when returning home, you take with you even a small part of our love for Armenia, then our work has truly been worthwhile.",
      ],
    },
    signature: {
      ru: "Amaras Tour",
      hy: "Amaras Tour",
      en: "Amaras Tour",
    },
    motto: {
      ru: "Приезжайте как гости — уезжайте как друзья.",
      hy: "Եկեք որպես հյուր — հեռացեք որպես ընկեր։",
      en: "Come as guests — leave as friends.",
    },
  },
};
