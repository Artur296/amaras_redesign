import type { Locale } from "@/lib/i18n";

export type FaqItem = {
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
};

export const faqs: FaqItem[] = [
  {
    question: {
      ru: "Как забронировать тур и нужна ли предоплата?",
      hy: "Ինչպե՞ս ամրագրել տուրը և արդյո՞ք պահանջվում է կանխավճար։",
      en: "How do I book a tour and is prepayment required?",
    },
    answer: {
      ru: "Забронировать поездку можно в 1 клик прямо через WhatsApp или Telegram. Для большинства однодневных и групповых туров предоплата не требуется — оплата производится в день поездки в драмах (AMD), рублях или картой.",
      hy: "Դուք կարող եք ամրագրել տուրը 1 քայլով՝ WhatsApp-ով կամ Telegram-ով։ Օրական էքսկուրսիաների մեծ մասի համար կանխավճար չի պահանջվում՝ վճարումը կատարվում է ուղևորության օրը։",
      en: "You can book instantly via WhatsApp or Telegram. For most day tours, no advance deposit is required — payment is made on the day of the tour in cash (AMD) or card transfer.",
    },
  },
  {
    question: {
      ru: "На каком транспорте проходят поездки и экскурсии?",
      hy: "Ի՞նչ տրանսպորտային միջոցներով են իրականացվում ուղևորությունները։",
      en: "What vehicles are used for tours and expeditions?",
    },
    answer: {
      ru: "Мы используем современные микроавтобусы Mercedes-Benz Sprinter повышенной комфортности с панорамными окнами и кондиционером, а для горных экспедиций — подготовленные японские внедорожники 4x4 (Toyota Land Cruiser, Nissan Patrol).",
      hy: "Մենք օգտագործում ենք ժամանակակից, բարձր հարմարավետության Mercedes-Benz Sprinter միկրոավտոբուսներ օդորակիչով, իսկ լեռնային արշավների համար՝ պատրաստված 4x4 ամենագնացներ։",
      en: "We operate modern, air-conditioned Mercedes-Benz Sprinter vans with panoramic windows, and for rugged mountain routes — fully equipped 4x4 expedition SUVs (Toyota, Nissan).",
    },
  },
  {
    question: {
      ru: "На каких языках проводятся экскурсии?",
      hy: "Ո՞ր լեզուներով են անցկացվում էքսկուրսիաները։",
      en: "What languages do your tour guides speak?",
    },
    answer: {
      ru: "Все наши гиды профессионально владеют русским, армянским и английским языками. По запросу для индивидуальных групп возможен тур на других европейских языках.",
      hy: "Մեր բոլոր գիդերը տիրապետում են հայերեն, ռուսերեն և անգլերեն լեզուներին։ Անհատական տուրերի դեպքում հնարավոր է նաև այլ լեզուներով սպասարկում։",
      en: "Our certified guides are fluent in Russian, Armenian, and English. Private custom tours can also be arranged in other European languages upon request.",
    },
  },
  {
    question: {
      ru: "Что включено в стоимость тура?",
      hy: "Ի՞նչ է ներառված տուրի արժեքի մեջ։",
      en: "What is included in the tour price?",
    },
    answer: {
      ru: "В стоимость всегда включены комфортный трансфер по всему маршруту, услуги профессионального гида и опытного водителя, питьевая вода в салоне и транспортная страховка. Входные билеты и дегустации указываются в программе каждого тура.",
      hy: "Արժեքը ներառում է հարմարավետ տրանսֆեր ամբողջ երթուղով, պրոֆեսիոնալ գիդի և վարորդի ծառայություններ, խմելու ջուր և ապահովագրություն։ Մուտքավճարները նշված են յուրաքանչյուր տուրի ծրագրում։",
      en: "The price includes full-day transport, licensed guide and driver services, complimentary bottled water, and passenger insurance. Entrance tickets or wine tastings are specified in each tour itinerary.",
    },
  },
  {
    question: {
      ru: "Можно ли составить индивидуальный маршрут под наши пожелания?",
      hy: "Հնարավո՞ր է կազմել անհատական երթուղի մեր ցանկությամբ։",
      en: "Can you create a custom private itinerary for our group?",
    },
    answer: {
      ru: "Да! Мы с радостью составим индивидуальный маршрут на 1 или несколько дней с учетом ваших предпочтений: монастыри, винные дегустации, горы, треккинг или отдых на Севане. Просто напишите нам в мессенджер.",
      hy: "Այո՛, մենք մեծ սիրով կմշակենք անհատական երթուղի 1 կամ մի քանի օրով՝ ըստ ձեր նախասիրությունների (գինեգործարաններ, վանքեր, բնություն, հանգիստ Սևանում)։ Պարզապես գրեք մեզ։",
      en: "Yes! We specialize in crafting tailor-made 1-day and multi-day private itineraries based on your schedule, interests, and preferred rhythm across Armenia and Georgia.",
    },
  },
];
