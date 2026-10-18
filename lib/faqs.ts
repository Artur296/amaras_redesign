import type { Locale } from "@/lib/i18n";

export type FaqCategoryKey =
  | "booking"
  | "cancellation"
  | "organization"
  | "safety"
  | "individual";

export type FaqItem = {
  id: number;
  categoryKey: FaqCategoryKey;
  category: Record<Locale, string>;
  question: Record<Locale, string>;
  answer: Record<Locale, string>;
};

export const faqCategories: { key: FaqCategoryKey; title: Record<Locale, string> }[] = [
  {
    key: "booking",
    title: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
  },
  {
    key: "cancellation",
    title: {
      ru: "Отмена и изменение планов",
      hy: "Չեղարկում և փոփոխություններ",
      en: "Cancellations & Rescheduling",
    },
  },
  {
    key: "organization",
    title: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
  },
  {
    key: "safety",
    title: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
  },
  {
    key: "individual",
    title: {
      ru: "Индивидуальные путешествия",
      hy: "Անհատական ճամփորդություններ",
      en: "Private & Custom Tours",
    },
  },
];

export const faqs: FaqItem[] = [
  // 1. Бронирование и оплата
  {
    id: 1,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Как забронировать экскурсию и узнать, есть ли свободные места?",
      hy: "Ինչպե՞ս ամրագրել էքսկուրսիան և իմանալ՝ արդյոք կան ազատ տեղեր։",
      en: "How do I book a tour and check seat availability?",
    },
    answer: {
      ru: "Выберите интересующую экскурсию на сайте, укажите желаемую дату и количество участников, затем нажмите «Забронировать».\n\nВ открывшейся форме заполните контактные данные и выберите удобный способ связи — WhatsApp или Telegram. Наша команда проверит наличие мест и сообщит вам результат.\n\nОбратите внимание: количество свободных мест может изменяться в течение дня. Отправка заявки сама по себе не резервирует места.",
      hy: "Ընտրեք ձեզ հետաքրքրող էքսկուրսիան կայքում, նշեք ցանկալի ամսաթիվը և մասնակիցների քանակը, ապա սեղմեք «Ամրագրել»:\n\nԲացված ձևում լրացրեք կոնտակտային տվյալները: Մեր թիմը կստուգի տեղերի առկայությունը և կտեղեկացնի ձեզ արդյունքի մասին: Ուշադրություն. հայտ ուղարկելն ինքնին տեղերը չի ամրագրում, անհրաժեշտ է հաստատում:",
      en: "Select your desired tour on the website, specify preferred date and number of participants, then click 'Book'.\n\nFill in your contact details and message us via WhatsApp or Telegram. Our team will verify availability and confirm.\n\nPlease note: available seats change dynamically throughout the day. Submitting an inquiry alone does not reserve seats.",
    },
  },
  {
    id: 2,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Когда моё бронирование считается подтверждённым?",
      hy: "Ե՞րբ է իմ ամրագրումը համարվում հաստատված։",
      en: "When is my booking considered confirmed?",
    },
    answer: {
      ru: "Бронирование считается подтверждённым после поступления полной оплаты и получения вами письменного подтверждения от Amaras Tour.\n\nДо этого момента заявка остаётся предварительной, даже если свободные места были доступны во время обращения.\n\nПосле подтверждения выбранные места закрепляются за вами.",
      hy: "Ամրագրումը համարվում է հաստատված ամբողջական վճարումը ստանալուց և Amaras Tour-ից գրավոր հաստատում ստանալուց հետո:\n\nՄինչ այդ հայտը համարվում է նախնական: Հաստատումից հետո ընտրված տեղերն ամրագրվում են ձեզ համար:",
      en: "A booking is considered confirmed once full payment is received and you receive written confirmation from Amaras Tour.\n\nUntil that point, inquiries remain preliminary even if seats were open at the time of inquiry.\n\nUpon confirmation, your seats are guaranteed.",
    },
  },
  {
    id: 3,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Нужно ли оплачивать экскурсию полностью или достаточно предоплаты?",
      hy: "Արդյո՞ք անհրաժեշտ է վճարել ամբողջ գումարը, թե՞ բավարար է կանխավճարը։",
      en: "Do I need to pay in full or is a deposit sufficient?",
    },
    answer: {
      ru: "Для бронирования экскурсий Amaras Tour предусмотрена 100% предварительная оплата.\n\nМы принимаем оплату после проверки доступности выбранной экскурсии и согласования стоимости.\n\nТакой порядок позволяет заранее организовать транспорт, работу гидов и другие необходимые услуги. Перед оплатой вы сможете ознакомиться с условиями бронирования и отмены.",
      hy: "Amaras Tour-ի էքսկուրսիաների ամրագրման համար նախատեսված է 100% նախնական վճարում:\n\nՎճարումն ընդունվում է տեղերի առկայությունը ստուգելուց և արժեքը համաձայնեցնելուց հետո: Դա թույլ է տալիս նախօրոք երաշխավորել տրանսպորտը և պրոֆեսիոնալ գիդի աշխատանքը:",
      en: "Amaras Tour operates on a 100% prepayment basis for tour bookings.\n\nPayment is accepted after confirming tour availability and final pricing.\n\nThis ensures dedicated vehicle reservations, certified guide assignments, and all itinerary logistics in advance.",
    },
  },
  {
    id: 4,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Какие способы оплаты доступны? Можно ли оплатить российской или иностранной банковской картой?",
      hy: "Վճարման ի՞նչ եղանակներ են հասանելի։ Հնարավո՞ր է վճարել ռուսական կամ արտասահմանյան քարտով։",
      en: "What payment methods are available? Can I pay with foreign or Russian cards?",
    },
    answer: {
      ru: "Доступные способы оплаты зависят от страны, банка и действующих ограничений платёжных систем.\n\nМы принимаем оплату согласованными банковскими переводами и другими доступными способами. Возможность использования конкретной российской или иностранной карты необходимо уточнять заранее.\n\nПосле проверки доступности экскурсии наш менеджер предоставит актуальные реквизиты и инструкции по оплате.",
      hy: "Հասանելի վճարման եղանակները կախված են երկրից, բանկից և վճարային համակարգերից:\n\nԸնդունում ենք բանկային փոխանցումներ և այլ հարմար եղանակներ: Կոնկրետ քարտի օգտագործման հնարավորությունը խնդրում ենք ճշտել նախապես. մենեջերը կտրամադրի բոլոր հարմար ռեկվիզիտները:",
      en: "Available payment methods depend on the country, bank, and active payment gateway processing.\n\nWe accept bank transfers, online invoicing, and alternative digital payment options. Specific foreign or Russian card options can be confirmed directly with our manager prior to payment.",
    },
  },
  {
    id: 5,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Что входит в стоимость экскурсии и какие расходы оплачиваются отдельно?",
      hy: "Ի՞նչ է ներառված էքսկուրսիայի արժեքում և ո՞ր ծախսերն են վճարվում առանձին։",
      en: "What is included in the tour price and what costs are extra?",
    },
    answer: {
      ru: "В стоимость стандартных групповых экскурсий входят комфортабельный транспорт по маршруту, услуги профессионального гида, бутилированная вода и традиционное армянское угощение.\n\nОтдельно оплачиваются входные билеты на платные объекты, питание в кафе и ресторанах, личные покупки и дополнительные услуги, не включённые в программу.\n\nТочный перечень услуг и дополнительных расходов представлен в описании каждой экскурсии.",
      hy: "Ստանդարտ խմբային էքսկուրսիաների արժեքում ներառված են հարմարավետ տրանսպորտը երթուղով, պրոֆեսիոնալ գիդի ծառայությունները, շշալցված ջուրը և ավանդական հայկական հյուրասիրությունը:\n\nԱռանձին վճարվում են վճարովի օբյեկտների տոմսերը, սնունդը ռեստորաններում և անձնական գնումները:",
      en: "Standard group tours include comfortable transport along the itinerary, certified professional guide, complimentary bottled water, and traditional Armenian treats.\n\nMuseum/attraction entrance tickets, meals at restaurants, and personal expenses are paid separately on site.",
    },
  },
  {
    id: 6,
    categoryKey: "booking",
    category: {
      ru: "Бронирование и оплата",
      hy: "Ամրագրում և վճարում",
      en: "Booking & Payment",
    },
    question: {
      ru: "Получу ли я подтверждение бронирования и всю необходимую информацию перед поездкой?",
      hy: "Կստանա՞մ արդյոք ամրագրման հաստատումը և բոլոր անհրաժեշտ տեղեկությունները ճամփորդությունից առաջ։",
      en: "Will I receive booking confirmation and complete pre-trip instructions?",
    },
    answer: {
      ru: "Да. После оформления бронирования мы отправим вам сообщение с названием экскурсии, датой, количеством участников, временем отправления и точным местом встречи.\n\nВы также получите необходимые рекомендации по подготовке к поездке и контакт для связи с нашей командой.\n\nПри необходимости мы дополнительно отправим геолокацию места сбора.",
      hy: "Այո՛: Ամրագրումից հետո մենք ձեզ կուղարկենք հաղորդագրություն՝ տուրի անվանումով, ամսաթվով, մեկնման ժամով և հավաքատեղիի հստակ հասցեով (կցելով նաև տեղադրությունը քարտեզի վրա):",
      en: "Yes. Once booked, we send you a confirmation message with the tour name, date, group size, exact meeting point, departure time, and live Google Maps geolocation, plus packing advice.",
    },
  },

  // 2. Отмена и изменение планов
  {
    id: 7,
    categoryKey: "cancellation",
    category: {
      ru: "Отмена и изменение планов",
      hy: "Չեղարկում և փոփոխություններ",
      en: "Cancellations & Rescheduling",
    },
    question: {
      ru: "Можно ли отменить бронирование и вернуть деньги?",
      hy: "Հնարավո՞ր է չեղարկել ամրագրումը և ետ ստանալ գումարը։",
      en: "Can I cancel my booking and receive a refund?",
    },
    answer: {
      ru: "Да. Если ваши планы изменились, сообщите нам об отмене как можно раньше.\n\nРазмер возврата зависит от типа экскурсии, времени обращения, фактически понесённых организационных расходов и применимых требований законодательства.\n\nПри отмене менее чем за 24 часа до отправления часть оплаченной суммы может не подлежать возврату, если к этому моменту компания уже понесла соответствующие расходы. Для многодневных туристических пакетов предусмотрены отдельные правила.",
      hy: "Այո: Եթե ձեր ծրագրերը փոխվել են, խնդրում ենք հնարավորինս շուտ տեղեկացնել:\n\nՎերադարձի չափը կախված է դիմելու ժամկետից և փաստացի կատարված ծախսերից: 24 ժամից պակաս ժամկետում չեղարկելիս գումարի մի մասը կարող է չվերադարձվել:",
      en: "Yes. If your plans change, please notify us as early as possible.\n\nRefund amounts depend on notice timing and incurred organizational expenses. Notice less than 24 hours prior to departure may carry non-refundable fees. Multi-day packages have distinct policy terms.",
    },
  },
  {
    id: 8,
    categoryKey: "cancellation",
    category: {
      ru: "Отмена и изменение планов",
      hy: "Չեղարկում և փոփոխություններ",
      en: "Cancellations & Rescheduling",
    },
    question: {
      ru: "Можно ли перенести экскурсию на другую дату?",
      hy: "Հնարավո՞ր է տեղափոխել էքսկուրսիան այլ ամսաթվի։",
      en: "Can I reschedule my tour to another date?",
    },
    answer: {
      ru: "Перенос возможен при наличии свободных мест и после согласования с нашей командой.\n\nПросим обращаться заранее: ближе к дате отправления транспорт, гиды и другие услуги могут быть уже окончательно согласованы.\n\nНовая дата считается подтверждённой только после письменного согласования с Amaras Tour.",
      hy: "Տեղափոխումը հնարավոր է ազատ տեղերի առկայության դեպքում և մեր թիմի հետ նախնական համաձայնեցմամբ:\n\nԽնդրում ենք դիմել նախապես: Նոր ամսաթիվը համարվում է հաստատված Amaras Tour-ի գրավոր համաձայնությունից հետո:",
      en: "Rescheduling is possible subject to seat availability and advance coordination.\n\nPlease contact us as early as possible. A new date is officially confirmed once you receive written notice from Amaras Tour.",
    },
  },
  {
    id: 9,
    categoryKey: "cancellation",
    category: {
      ru: "Отмена и изменение планов",
      hy: "Չեղարկում և փոփոխություններ",
      en: "Cancellations & Rescheduling",
    },
    question: {
      ru: "Что делать, если я опоздаю к отправлению или не смогу приехать?",
      hy: "Ի՞նչ անել, եթե ուշանամ մեկնումից կամ չկարողանամ գալ։",
      en: "What happens if I arrive late or cannot make it to departure?",
    },
    answer: {
      ru: "Пожалуйста, приходите на место встречи за 10–15 минут до отправления.\n\nГрупповые экскурсии проходят по установленному расписанию, поэтому ожидание опаздывающих участников не гарантируется.\n\nЕсли вы задерживаетесь, сразу свяжитесь с нами. Мы проверим, возможно ли присоединиться к группе позднее, но не можем гарантировать такую возможность.",
      hy: "Խնդրում ենք հավաքատեղի գալ մեկնումից 10–15 րոպե առաջ:\n\nԽմբային տուրերն իրականացվում են հստակ ժամանակացույցով, ուստի ուշացողների երկար սպասել հնարավոր չէ: Եթե ուշանում եք, անմիջապես զանգահարեք մեզ:",
      en: "Please arrive at the meeting point 10–15 minutes before scheduled departure.\n\nGroup tours follow a strict timetable, so long waiting times cannot be guaranteed. Contact us immediately if delayed so we can evaluate options.",
    },
  },
  {
    id: 10,
    categoryKey: "cancellation",
    category: {
      ru: "Отмена и изменение планов",
      hy: "Չեղարկում և փոփոխություններ",
      en: "Cancellations & Rescheduling",
    },
    question: {
      ru: "Что произойдёт, если экскурсия отменится из-за погоды или по инициативе компании?",
      hy: "Ի՞նչ տեղի կունենա, եթե էքսկուրսիան չեղարկվի եղանակի կամ ընկերության նախաձեռնությամբ։",
      en: "What happens if a tour is canceled due to weather or by the company?",
    },
    answer: {
      ru: "Если проведение экскурсии становится невозможным из-за неблагоприятной погоды, закрытия дорог или других обстоятельств, мы уведомим вас и объясним ситуацию.\n\nВ зависимости от обстоятельств мы предложим другую дату, альтернативную программу либо возврат денежных средств в предусмотренном законом порядке. Безопасность путешественников всегда на первом месте.",
      hy: "Եթե եղանակային անբարենպաստ պայմանների կամ փակ ճանապարհների պատճառով տուրն անհնար է դառնում, մենք կտեղեկացնենք ձեզ:\n\nԿառաջարկենք այլ ամսաթիվ, այլընտրանքային երթուղի կամ գումարի ամբողջական վերադարձ: Ճամփորդների անվտանգությունը մեզ համար առաջնահերթ է:",
      en: "If adverse mountain weather or road closures make the route unsafe, we will notify you promptly.\n\nWe offer rescheduling to another date, an alternative route, or a full refund. Guest safety always takes precedence over itineraries.",
    },
  },

  // 3. Организация экскурсии
  {
    id: 11,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "Где находится место встречи и как найти транспорт Amaras Tour?",
      hy: "Որտե՞ղ է գտնվում հանդիպման վայրը և ինչպե՞ս գտնել Amaras Tour-ի տրանսպորտը։",
      en: "Where is the departure meeting point and how do I spot the vehicle?",
    },
    answer: {
      ru: "Основная точка отправления групповых экскурсий находится в центре Еревана: проспект Месропа Маштоца, 51, у Матенадарана, рядом с остановкой Bus Voyage.\n\nНаш транспорт можно узнать по фирменной табличке Amaras Tour.\n\nЕсли для выбранной программы предусмотрено другое место встречи, его точный адрес будет указан в вашем подтверждении.",
      hy: "Խմբային տուրերի հիմնական մեկնման վայրը գտնվում է Երևանի կենտրոնում՝ Մեսրոպ Մաշտոցի պողոտա 51, Մատենադարանի մոտ (Bus Voyage կանգառի հարևանությամբ):\n\nՄեր տրանսպորտը հեշտությամբ կճանաչեք Amaras Tour ցուցանակով:",
      en: "Our primary departure hub in central Yerevan is at 51 Mesrop Mashtots Avenue, near the Matenadaran and Bus Voyage stop.\n\nOur vehicles display the distinctive Amaras Tour sign. Precise address and GPS coordinates are included in your confirmation.",
    },
  },
  {
    id: 12,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "Можно ли заказать трансфер из отеля или начать экскурсию с удобного адреса?",
      hy: "Հնարավո՞ր է պատվիրել տրանսֆեր հյուրանոցից կամ սկսել տուրը ցանկալի հասցեից։",
      en: "Can I request hotel pickup or start from a custom address?",
    },
    answer: {
      ru: "Для индивидуальных экскурсий мы организуем подачу автомобиля по заранее согласованному адресу в Ереване — например, к вашему отелю или апартаментам.\n\nГрупповые экскурсии начинаются из установленной точки сбора. Индивидуальный трансфер из отеля в стандартную стоимость не входит, но может быть организован по отдельному запросу.",
      hy: "Անհատական տուրերի դեպքում մենք մեքենան մոտեցնում ենք Երևանի ցանկացած հասցեով՝ ձեր հյուրանոց կամ բնակարան:\n\nԽմբային տուրերը մեկնարկում են հավաքատեղիից: Անհատական հյուրանոցային տրանսֆեր կարելի է պատվիրել հավելավճարով:",
      en: "For private custom tours, hotel pickup and drop-off anywhere in Yerevan is included.\n\nRegular group tours depart from the central meeting hub. Private hotel transfer for group departures can be arranged upon prior request.",
    },
  },
  {
    id: 13,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "Сколько человек участвует в групповых экскурсиях?",
      hy: "Քանի՞ մարդ է մասնակցում խմբային էքսկուրսիաներին։",
      en: "How many guests participate in group tours?",
    },
    answer: {
      ru: "В Amaras Tour предусмотрены два основных формата групповых путешествий:\n\n• Мини-группы — до 8 человек (камерная атмосфера и максимум внимания гида).\n• Стандартные группы — до 19–20 человек (насыщенная программа и выгодная стоимость).\n\nМаксимальное количество участников всегда указано в описании каждого тура.",
      hy: "Amaras Tour-ում գործում են խմբային տուրերի երկու հիմնական ձևաչափեր.\n\n• Մինի խմբեր՝ մինչև 8 հոգի (ավելի ջերմ միջավայր և անհատական ուշադրություն):\n• Ստանդարտ խմբեր՝ մինչև 19–20 հոգի:\n\nՄասնակիցների առավելագույն թիվը նշված է տուրի նկարագրության մեջ:",
      en: "Amaras Tour offers two distinct group travel formats:\n\n• Small mini-groups — up to 8 travelers (intimate, agile, personalized).\n• Standard groups — up to 19–20 travelers.\n\nExact group capacities are clearly listed in every tour itinerary.",
    },
  },
  {
    id: 14,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "На каком транспорте проводятся экскурсии?",
      hy: "Ի՞նչ տրանսպորտային միջոցներով են անցկացվում էքսկուրսիաները։",
      en: "What vehicle fleet is used for tours?",
    },
    answer: {
      ru: "Мы используем комфортабельные минивэны, микроавтобусы, современные кроссоверы и автомобили премиум-класса.\n\nДля горных маршрутов и поездок по бездорожью предусмотрены подготовленные внедорожники 4×4.\n\nТранспорт подбирается в соответствии с количеством участников, особенностями маршрута и дорожными условиями.",
      hy: "Մենք օգտագործում ենք բարձրակարգ մինիվեներ, միկրոավտոբուսներ, ժամանակակից քրոսովերներ և պրեմիում դասի ավտոմեքենաներ:\n\nԼեռնային և արտաճանապարհային ուղղությունների համար տրամադրվում են 4×4 ամենագնացներ:",
      en: "Our fleet features premium minivans, Mercedes Sprinter vans, modern crossovers, and luxury executive cars.\n\nFor off-road highland and volcano trails, we deploy specialized 4×4 expedition SUVs (Toyota Land Cruiser, Nissan).",
    },
  },
  {
    id: 15,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "На каких языках проводятся экскурсии и сопровождает ли группу профессиональный гид?",
      hy: "Ո՞ր լեզուներով են անցկացվում էքսկուրսիաները և արդյո՞ք խմբին ուղեկցում է պրոֆեսիոնալ գիդ։",
      en: "What languages are available and are tours accompanied by certified guides?",
    },
    answer: {
      ru: "Основные языки экскурсий Amaras Tour — армянский, русский и английский.\n\nДля индивидуальных путешествий и организованных групп по предварительному запросу мы также организуем сопровождение на немецком, французском, итальянском, испанском, арабском, китайском и других языках.",
      hy: "Amaras Tour-ի հիմնական լեզուներն են՝ հայերեն, ռուսերեն և անգլերեն:\n\nԱնհատական պատվերով կարող ենք ապահովել պրոֆեսիոնալ գիդ նաև գերմաներեն, ֆրանսերեն, իտալերեն, իսպաներեն, արաբերեն և այլ լեզուներով:",
      en: "Primary languages are Armenian, Russian, and English.\n\nUpon advance request for private groups, we provide licensed guides fluent in German, French, Italian, Spanish, Arabic, Chinese, and other languages.",
    },
  },
  {
    id: 16,
    categoryKey: "organization",
    category: {
      ru: "Организация экскурсии",
      hy: "Էքսկուրսիայի կազմակերպում",
      en: "Tour Organization",
    },
    question: {
      ru: "Предусмотрены ли остановки на обед, отдых и фотографии?",
      hy: "Նախատեսվա՞ծ են արդյոք կանգառներ ճաշի, հանգստի և լուսանկարվելու համար։",
      en: "Are stops planned for lunch, rest, and photography?",
    },
    answer: {
      ru: "На продолжительных экскурсиях всегда предусмотрена остановка в колоритном кафе или ресторане, где гости самостоятельно выбирают и оплачивают блюда по меню.\n\nПо маршруту также планируются остановки на самых живописных панорамах для фото, отдыха и посещения удобств.",
      hy: "Երկարատև տուրերի ժամանակ անպայման նախատեսված է կանգառ ռեստորանում, որտեղ հյուրերը կարող են ճաշել:\n\nԵրթուղու ընթացքում կատարվում են նաև կանգառներ գեղատեսիլ վայրերում՝ լուսանկարվելու և հանգստի համար:",
      en: "Full-day tours include comfortable stops at authentic local taverns where guests order à la carte.\n\nWe also pause at scenic viewpoints for photos, coffee breaks, and restroom facilities.",
    },
  },

  // 4. Подготовка, комфорт и безопасность
  {
    id: 17,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Нужно ли брать с собой паспорт или другие документы на экскурсию?",
      hy: "Արդյո՞ք անհրաժեշտ է վերցնել անձնագիր կամ այլ փաստաթղթեր։",
      en: "Do I need to bring a passport or ID documents on the tour?",
    },
    answer: {
      ru: "Для посещения большинства достопримечательностей отдельное предъявление паспорта не требуется.\n\nОднако иностранным гостям всегда рекомендуем иметь при себе оригинал или чёткую копию документа, удостоверяющего личность.\n\nНа отдельных приграничных или специальных маршрутах могут действовать контрольно-пропускные требования, о которых мы предупреждаем заранее.",
      hy: "Տեսարժան վայրերի մեծ մասի համար անձնագիր ներկայացնել պետք չէ:\n\nՍակայն արտասահմանցի հյուրերին խորհուրդ ենք տալիս իրենց մոտ ունենալ անձը հաստատող փաստաթուղթ:",
      en: "While entry to most monuments does not require passports, foreign visitors should carry valid photo ID or passport copies.\n\nSpecific border routes may require passport checks, which we advise in advance.",
    },
  },
  {
    id: 18,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Что рекомендуется взять с собой и как правильно одеться?",
      hy: "Ի՞նչ է խորհուրդ տրվում վերցնել և ինչպե՞ս հագնվել։",
      en: "What should I wear and pack for the trip?",
    },
    answer: {
      ru: "Рекомендуем удобную нескользящую обувь и одежду по сезону. В горах даже летом бывает прохладно, поэтому лёгкая куртка или ветровка не будет лишней.\n\nПри посещении монастырей и действующих храмов желательно выбирать сдержанную одежду, прикрывающую плечи и колени.\n\nТакже пригодятся головной убор, солнцезащитные очки, крем и немного наличных драмов на сувениры и обед.",
      hy: "Խորհուրդ ենք տալիս կրել հարմարավետ կոշիկներ: Լեռներում ամռանն էլ կարող է զով լինել, ուստի թեթև բաճկոնը պետք կգա:\n\nՎանքեր այցելելիս ցանկալի է կրել համեստ հագուստ (ծածկված ուսերով և ծնկներով): Վերցրեք գլխարկ, արևապաշտպան քսուք և կանխիկ դրամ:",
      en: "Wear comfortable walking shoes with good grip. Highland areas can be breezy even in summer, so pack a light windbreaker or layer.\n\nFor monastery visits, modest attire covering shoulders and knees is courteous. Sunglasses, sunscreen, and cash in AMD are helpful.",
    },
  },
  {
    id: 19,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Можно ли путешествовать с детьми и предоставляются ли детские автокресла?",
      hy: "Կարո՞ղ ենք ճամփորդել երեխաների հետ և տրամադրվո՞ւմ են մանկական նստատեղեր։",
      en: "Can I travel with children and are child car seats provided?",
    },
    answer: {
      ru: "Да, мы с радостью организуем поездки для семей с детьми и поможем выбрать подходящий маршрут.\n\nДля групповых экскурсий действуют специальные детские тарифы со скидкой.\n\nЕсли вам необходимо детское автокресло, сообщите возраст и вес ребёнка при бронировании — мы предоставим сертифицированное удерживающее устройство.",
      hy: "Այո, մենք սիրով կազմակերպում ենք ընտանեկան ուղևորություններ: Երեխաների համար գործում են զեղչված սակագներ:\n\nԵթե մանկական ավտոնստատեղ է հարկավոր, տեղեկացրեք նախօրոք՝ նշելով երեխայի տարիքն ու քաշը:",
      en: "Yes, our family-friendly tours cater to travelers with children, offering discounted child pricing.\n\nChild safety seats can be provided free of charge upon prior notification of age and weight during booking.",
    },
  },
  {
    id: 20,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Подходят ли экскурсии для пожилых людей и гостей с ограниченной мобильностью?",
      hy: "Արդյո՞ք էքսկուրսիաները հարմար են տարեցների և սահմանափակ շարժունակությամբ հյուրերի համար։",
      en: "Are tours suitable for seniors and guests with limited mobility?",
    },
    answer: {
      ru: "Большинство наших маршрутов не требуют специальной физической подготовки. Однако некоторые древние монастыри имеют каменные ступени и подъёмы.\n\nСообщите нам о ваших пожеланиях до бронирования — мы порекомендуем наиболее комфортные маршруты с минимальной пешей нагрузкой либо подберём индивидуальную программу в спокойном темпе.",
      hy: "Տուրերի մեծ մասը ֆիզիկական հատուկ պատրաստվածություն չի պահանջում:\n\nԵթե ունեք շարժման սահմանափակումներ, տեղեկացրեք մեզ. մենք կընտրենք առավել հարմարավետ երթուղի կամ անհատական հանգիստ տեմպով ծրագիր:",
      en: "Most itineraries require no special fitness. For travelers with mobility concerns, we recommend gentle routes with flat surfaces, or customized private itineraries at a relaxed pace.",
    },
  },
  {
    id: 21,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Можно ли взять с собой чемодан или другой багаж?",
      hy: "Կարո՞ղ եմ վերցնել ճամպրուկ կամ այլ ուղեբեռ։",
      en: "Can I bring luggage or suitcases on the tour?",
    },
    answer: {
      ru: "Рюкзаки и ручную кладь можно брать свободно.\n\nЕсли вы едете с большими чемоданами (например, сразу направляетесь в аэропорт или другой отель), сообщите об этом заранее. Мы проверим вместимость багажного отделения выбранного транспорта.",
      hy: "Ձեռքի պայուսակները կարելի է վերցնել ազատորեն:\n\nԵթե ճամփորդում եք մեծ ճամպրուկներով, խնդրում ենք տեղեկացնել նախապես, որպեսզի ստուգենք բեռնախցիկի ծավալը:",
      en: "Daypacks and personal bags are always welcome.\n\nIf you have bulky suitcases or airport luggage, notify us in advance so we allocate dedicated luggage space in the vehicle.",
    },
  },
  {
    id: 22,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "Что происходит, если во время экскурсии меняются погодные или дорожные условия?",
      hy: "Ի՞նչ է տեղի ունենում, եթե տուրի ընթացքում եղանակային պայմանները փոխվում են։",
      en: "What happens if weather or road conditions change during the tour?",
    },
    answer: {
      ru: "Погода в горах Армении бывает переменчивой. Если дальнейшее движение по маршруту становится небезопасным, опытный гид и водитель оперативно корректируют порядок остановок либо предлагают безопасную альтернативу.\n\nБезопасность каждого гостя — безусловный приоритет Amaras Tour.",
      hy: "Եթե ճանապարհին եղանակը վատանում է կամ ճանապարհը դառնում է անանցանելի, փորձառու գիդն ու վարորդը փոխում են այցելությունների հերթականությունը կամ առաջարկում անվտանգ այլընտրանք:",
      en: "Mountain weather can shift rapidly. If route conditions deteriorate, our certified guide and driver adjust sequence or offer safe scenic alternatives, placing passenger safety first.",
    },
  },
  {
    id: 23,
    categoryKey: "safety",
    category: {
      ru: "Подготовка, комфорт и безопасность",
      hy: "Հարմարավետություն և անվտանգություն",
      en: "Comfort & Safety",
    },
    question: {
      ru: "К кому обратиться, если во время поездки возникнет вопрос или понадобится помощь?",
      hy: "Ո՞ւմ դիմել, եթե ուղևորության ընթացքում հարց առաջանա կամ օգնություն պետք լինի։",
      en: "Who should I contact if I need assistance during the trip?",
    },
    answer: {
      ru: "По любым вопросам во время поездки обращайтесь напрямую к вашему гиду или водителю.\n\nКроме того, наша служба заботы о клиентах всегда на связи в WhatsApp и Telegram по номеру +374 99 250 525.",
      hy: "Ցանկացած հարցով կարող եք դիմել ձեր գիդին կամ վարորդին:\n\nԻնչպես նաև մեր աջակցման թիմը միշտ հասանելի է WhatsApp-ում և Telegram-ում՝ +374 99 250 525 հեռախոսահամարով:",
      en: "For immediate assistance during the trip, speak with your guide or driver.\n\nOur client coordinator hotline is also active 24/7 on WhatsApp & Telegram at +374 99 250 525.",
    },
  },

  // 5. Индивидуальные путешествия
  {
    id: 24,
    categoryKey: "individual",
    category: {
      ru: "Индивидуальные путешествия",
      hy: "Անհատական ճամփորդություններ",
      en: "Private & Custom Tours",
    },
    question: {
      ru: "Чем индивидуальная экскурсия отличается от групповой?",
      hy: "Ինչո՞վ է անհատական էքսկուրսիան տարբերվում խմբայինից։",
      en: "How does a private tour differ from a group tour?",
    },
    answer: {
      ru: "Групповая экскурсия проходит по строгому графику вместе с другими участниками.\n\nИндивидуальная экскурсия создаётся исключительно для вас и вашей компании. Вы сами выбираете время выезда, продолжительность остановок, класс автомобиля и можете менять темп поездки в любой момент.",
      hy: "Խմբային տուրն անցնում է նախապես սահմանված գրաֆիկով այլ մասնակիցների հետ:\n\nԱնհատական տուրը կազմակերպվում է միայն ձեր ընտանիքի կամ ընկերների համար՝ ձեր ընտրած ժամին, ավտոմեքենայի նախընտրած դասով և տեմպով:",
      en: "Group tours follow a fixed route and timetable. Private tours are organized exclusively for your party, allowing complete control over departure time, duration of stops, vehicle class, and pacing.",
    },
  },
  {
    id: 25,
    categoryKey: "individual",
    category: {
      ru: "Индивидуальные путешествия",
      hy: "Անհատական ճամփորդություններ",
      en: "Private & Custom Tours",
    },
    question: {
      ru: "Можно ли составить собственный маршрут и выбрать места, которые хочется посетить?",
      hy: "Հնարավո՞ր է կազմել սեփական երթուղին և ընտրել այցելության վայրերը։",
      en: "Can I customize the itinerary and choose places to visit?",
    },
    answer: {
      ru: "Да! Вы можете назвать любые локации Армении, которые хотите увидеть, а наши эксперты выстроят логистически идеальный и комфортный маршрут без лишней усталости.",
      hy: "Այո՛: Կարող եք նշել ցանկացած վայր Հայաստանում, և մենք կկազմենք լավագույն, հարմարավետ երթուղին՝ հաշվի առնելով հեռավորությունները:",
      en: "Absolutely! Mention any destinations or landmarks across Armenia, and our travel specialists will craft a seamless, unhurried custom itinerary.",
    },
  },
  {
    id: 26,
    categoryKey: "individual",
    category: {
      ru: "Индивидуальные путешествия",
      hy: "Անհատական ճամփորդություններ",
      en: "Private & Custom Tours",
    },
    question: {
      ru: "Можно ли выбрать автомобиль и заказать экскурсию с персональным гидом или только с водителем?",
      hy: "Կարո՞ղ եմ ընտրել մեքենան և պատվիրել տուր անձնական գիդով կամ միայն վարորդով։",
      en: "Can I choose the vehicle and book with a guide or driver only?",
    },
    answer: {
      ru: "Да, доступны оба формата:\n\n• С профессиональным гидом — для глубокого погружения в историю, культуру и легенды Армении.\n• С опытным водителем — комфортный персональный трансфер для тех, кто предпочитает самостоятельные прогулки.\n\nКласс автомобиля подбирается под ваш вкус: от седанов бизнес-класса до премиум-минивэнов и внедорожников 4×4.",
      hy: "Այո, հասանելի են երկու տարբերակներն էլ՝ անձնական պրոֆեսիոնալ գիդով կամ միայն փորձառու վարորդով, իսկ մեքենայի դասը ընտրում եք դուք:",
      en: "Yes, both formats are available: with a licensed personal guide for in-depth historical context, or with an experienced driver for independent exploration, in your vehicle class of choice.",
    },
  },
  {
    id: 27,
    categoryKey: "individual",
    category: {
      ru: "Индивидуальные путешествия",
      hy: "Անհատական ճամփորդություններ",
      en: "Private & Custom Tours",
    },
    question: {
      ru: "Организует ли Amaras Tour многодневные путешествия и специальные туры по индивидуальному запросу?",
      hy: "Կազմակերպո՞ւմ է Amaras Tour-ը բազմօրյա և հատուկ տուրեր անհատական պատվերով։",
      en: "Does Amaras Tour organize multi-day journeys and specialty expeditions?",
    },
    answer: {
      ru: "Да. Мы разрабатываем многодневные путешествия «под ключ» по всей Армении, а также винные, гастрономические, джип-экспедиции, фототуры и корпоративные выезды.\n\nМы берём на себя бронирование лучших отелей, трансферы, рестораны и экскурсионную программу высшего класса.",
      hy: "Այո՛: Մենք մշակում ենք բազմօրյա ճամփորդություններ «ամեն ինչ ներառված է» սկզբունքով, ինչպես նաև գինու, գաստրոնոմիական, ջիպ-արշավներ և կորպորատիվ միջոցառումներ:",
      en: "Yes! We design turnkey multi-day expeditions, wine & culinary tours, 4x4 mountain journeys, photography tours, and corporate retreats across Armenia with premium hotels and curated dining.",
    },
  },
];
