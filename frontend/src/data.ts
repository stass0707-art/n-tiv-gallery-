import type { Work, GalleryEvent, Workshop, PageTexts, Character, Post, Exhibition } from "./types";
const pankinPortrait = { url: "/gallery-demo/pankin-portrait.png" };
const pankinWork1 = { url: "/gallery-demo/pankin-work-1.png" };
const pankinWork2 = { url: "/gallery-demo/pankin-work-2.png" };
const pankinPoster = { url: "/gallery-demo/pankin-poster.png" };

const wm = (file: string, width = 1024) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`;


export const SEED_WORKS: Work[] = [
  {
    id: "w1", slug: "poceluy-klimt",
    title: "Поцелуй", author: "Густав Климт", year: "1908",
    technique: "Холст, масло, сусальное золото", size: "180 × 180 см", price: 890000, genre: "painting",
    image: wm("Gustav Klimt 016.jpg", 900),
    featured: true, available: true,
    description: "Икона венского модерна — золотой период Климта. Работа из собрания галереи Бельведер, представлена в каталоге «Нарратив».",
    authorBio: "Густав Климт (1862–1918) — австрийский художник, основатель Венского сецессиона. Известен «золотым периодом» — работами с использованием сусального золота.",
  },
  {
    id: "w2", slug: "zvezdnaya-noch",
    title: "Звёздная ночь", author: "Винсент ван Гог", year: "1889",
    technique: "Холст, масло", size: "73 × 92 см", price: 890000, genre: "painting",
    image: wm("Van Gogh - Starry Night - Google Art Project.jpg"),
    featured: true, available: true,
    description: "Ночной пейзаж с турбулентным небом — одна из главных работ постимпрессионизма.",
    authorBio: "Винсент ван Гог (1853–1890) — нидерландский художник-постимпрессионист. За десять лет создал около 2100 произведений.",
  },
  {
    id: "w3", slug: "devyatiy-val",
    title: "Девятый вал", author: "Иван Айвазовский", year: "1850",
    technique: "Холст, масло", size: "221 × 332 см", price: 650000, genre: "painting",
    image: wm("Hovhannes Aivazovsky - The Ninth Wave - Google Art Project.jpg"),
    featured: true, available: true,
    description: "Символ борьбы со стихией — рассвет после ночного шторма.",
    authorBio: "Иван Айвазовский (1817–1900) — русский художник-маринист. Автор более 6000 работ, посвящённых морю.",
  },
  {
    id: "w4", slug: "vpechatlenie-voshodyashchee-solnce",
    title: "Впечатление. Восходящее солнце", author: "Клод Моне", year: "1872",
    technique: "Холст, масло", size: "48 × 63 см", price: 320000, genre: "painting",
    image: wm("Monet - Impression, Sunrise.jpg"),
    featured: true, available: true,
    description: "Работа, давшая имя целому направлению — импрессионизму.",
  },
  {
    id: "w5", slug: "chernyy-kvadrat",
    title: "Чёрный квадрат", author: "Казимир Малевич", year: "1915",
    technique: "Холст, масло", size: "79,5 × 79,5 см", price: 540000, genre: "painting",
    image: wm("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg", 800),
    featured: false, available: true,
    description: "Программное произведение супрематизма и точка отсчёта беспредметного искусства.",
  },
  {
    id: "w6", slug: "kompoziciya-viii",
    title: "Композиция VIII", author: "Василий Кандинский", year: "1923",
    technique: "Холст, масло", size: "140 × 201 см", price: 420000, genre: "painting",
    image: wm("Vassily Kandinsky, 1923 - Composition 8, huile sur toile, 140 cm x 201 cm, Musée Guggenheim, New York.jpg"),
    featured: false, available: true,
    description: "Геометрическая абстракция периода Баухауса.",
  },
  {
    id: "w7", slug: "devushka-s-zhemchuzhnoy-serezhkoy",
    title: "Девушка с жемчужной серёжкой", author: "Ян Вермеер", year: "1665",
    technique: "Холст, масло", size: "44,5 × 39 см", price: 780000, genre: "painting",
    image: wm("1665 Girl with a Pearl Earring.jpg", 800),
    featured: false, available: true,
    description: "«Северная Мона Лиза» — жемчужина коллекции Маурицхёйс.",
  },
  {
    id: "w8", slug: "kompoziciya-mondrian",
    title: "Композиция с красным, синим и жёлтым", author: "Пит Мондриан", year: "1930",
    technique: "Холст, масло", size: "46 × 46 см", price: 610000, genre: "painting",
    image: wm("Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg", 800),
    featured: false, available: true,
    description: "Программная работа неопластицизма — чистая геометрия и три первичных цвета.",
  },
  {
    id: "w9", slug: "tanec-matiss",
    title: "Танец", author: "Анри Матисс", year: "1910",
    technique: "Холст, масло", size: "260 × 391 см", price: 495000, genre: "painting",
    image: wm("La danse (I) by Matisse.jpg"),
    featured: false, available: true,
    description: "Один из ключевых образов раннего модернизма.",
  },
  {
    id: "w10", slug: "krik",
    title: "Крик", author: "Эдвард Мунк", year: "1893",
    technique: "Картон, темпера, пастель", size: "91 × 73,5 см", price: 720000, genre: "graphic",
    image: wm("The Scream.jpg", 800),
    featured: false, available: true,
    description: "Икона экспрессионизма и универсальный образ тревоги XX века.",
  },
  {
    id: "w11", slug: "bolshaya-volna",
    title: "Большая волна в Канагаве", author: "Кацусика Хокусай", year: "1831",
    technique: "Гравюра на дереве", size: "25,7 × 37,9 см", price: 180000, genre: "graphic",
    image: wm("The Great Wave off Kanagawa.jpg"),
    featured: true, available: true,
    description: "Знаменитая гравюра из серии «36 видов Фудзи».",
  },
  {
    id: "w12", slug: "myslitel",
    title: "Мыслитель", author: "Огюст Роден", year: "1904",
    technique: "Бронза", size: "186 см", price: 950000, genre: "sculpture",
    image: wm("The Thinker, Rodin.jpg", 800),
    featured: false, available: true,
    description: "Хрестоматийная скульптура — фрагмент композиции «Врата ада».",
  },
  {
    id: "w13", slug: "podsolnuhi",
    title: "Подсолнухи", author: "Винсент ван Гог", year: "1888",
    technique: "Холст, масло", size: "92 × 73 см", price: 610000, genre: "painting",
    image: wm("Vincent Willem van Gogh 127.jpg", 800),
    featured: false, available: true,
    description: "Одна из знаменитой серии натюрмортов арльского периода.",
  },
  {
    id: "w14", slug: "moulin-de-la-galette",
    title: "Бал в Мулен де ла Галетт", author: "Пьер Огюст Ренуар", year: "1876",
    technique: "Холст, масло", size: "131 × 175 см", price: 540000, genre: "painting",
    image: wm("Auguste Renoir - Dance at Le Moulin de la Galette - Musée d'Orsay RF 2739 (derivative work - AutoContrast edit in LCH space).jpg"),
    featured: false, available: true,
    description: "Программная работа импрессионизма — воскресный день на Монмартре.",
  },
  {
    id: "w15", slug: "pankin-metaabstrakciya-1974",
    title: "Метаабстракция", author: "Александр Панкин", year: "1974",
    technique: "Бумага, тушь, темпера", size: "42 × 34 см", price: 480000, genre: "painting",
    image: pankinWork1.url,
    featured: true, available: true,
    description: "Работа периода поиска: пятно как расчётная форма, вычисленная через пропорции и ряды чисел. Одна из самых чувственных работ мастера.",
    authorBio: "Александр Панкин (р. 1938) — художник, классик метаабстракции. Учился в МАрхИ и студии Элия Белютина «Новая реальность». Продолжает линию супрематизма языком математики. Работы в Третьяковской галерее, Русском музее, ГЦСИ, частных собраниях США и Европы.",
  },
  {
    id: "w16", slug: "pankin-kompoziciya-1965",
    title: "Композиция", author: "Александр Панкин", year: "1965",
    technique: "Бумага, масло", size: "50 × 40 см", price: 520000, genre: "graphic",
    image: pankinWork2.url,
    featured: true, available: true,
    description: "Ранняя работа — линия как формула. Плетение чёрного, красного и охры, выстроенное по числовой сетке.",
    authorBio: "Александр Панкин (р. 1938) — художник, классик метаабстракции. Учился в МАрхИ и студии Элия Белютина «Новая реальность». Работы в Третьяковской галерее, Русском музее, ГЦСИ.",
  },
];

export const SEED_EVENTS: GalleryEvent[] = [
  {

    id: "e1",
    title: "Александр Панкин. Метаабстракция",
    date: "до 30 ноября 2026",
    cover: pankinPoster.url,
    description: "Персональная выставка классика отечественного современного искусства. В центре экспозиции — пожалуй, самая чувственная работа мастера. Панкин строит картину как математическое доказательство: в основе — числа, ряды Фибоначчи и вычисленные пропорции.",
    status: "current",
  },

  {
    id: "e2",
    title: "Русский авангард. Групповая выставка",
    date: "1–28 сентября 2026",
    cover: wm("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg", 800),
    description: "Малевич, Кандинский, Гончарова. Работы из частных собраний и запасников музеев-партнёров.",
    status: "past",
  },
];

export const SEED_WORKSHOPS: Workshop[] = [
  {
    id: "ws1",
    title: "Акварель для начинающих",
    date: "Каждую субботу, 12:00",
    teacher: "Мария Соколова",
    price: 3500,
    cover: wm("The Great Wave off Kanagawa.jpg"),
    description: "Четыре занятия по три часа. Материалы включены в стоимость. Группа до восьми человек.",
  },
  {
    id: "ws2",
    title: "Графика. Работа с углём и сангиной",
    date: "Воскресенье, 15:00",
    teacher: "Артём Белов",
    price: 4200,
    cover: wm("The Scream.jpg", 800),
    description: "Классический академический подход: постановка руки, штрих, светотень.",
  },
];

export const SEED_TEXTS: PageTexts = {
  about:
    "Арт-центр «Нарратив» открыт в Наро-Фоминске в бывшем купеческом доме — в шаге от старой шёлковой фабрики и дачи Якунчиковой. Мы соединяем локальную историю ткацкого края с большим разговором о мировом искусстве.\n\nЕжемесячные выставки, мастер-классы для взрослых и подростков, встречи с художниками и коллекционерами.",
  payment:
    "Оплата — наличными и картой в галерее, безналичным расчётом по счёту для юридических лиц.\n\nДоставка — транспортными компаниями по России. Крупноформатные работы отправляем в деревянной обрешётке.",
  contacts:
    "г. Наро-Фоминск, пл. Свободы, д. 4, к. 1, ЖК «Воскресенский», вход со стороны набережной\nПн–Вс: 11:00–20:00\n\nТелефон: 8 (915) 198-66-01\nE-mail: narrativ_centre@mail.ru",
  aboutHero:
    "Пространство, где живёт искусство. Связь микромира Наро-Фоминска с макромиром мирового искусства.",
  collectorsIntro:
    "Мы сопровождаем частные и корпоративные собрания: от первой работы до системной коллекции. Консультируем по выбору, оформлению, атрибуции и хранению. Работаем как с современными художниками галереи, так и с работами из проверенных вторичных источников.",
};

export const SEED_CHARACTERS: Character[] = [
  {
    id: "c1",
    name: "Александр Панкин",
    role: "Художник, классик метаабстракции",
    bio: "Учился на архитектора в МАрхИ, затем в легендарной студии Элия Белютина «Новая реальность». Продолжает линию Малевича языком математики: в основе работ — числа, ряды Фибоначчи и вычисленные пропорции. Работы в Третьяковской галерее, Русском музее, ГЦСИ, частных собраниях США и Европы. В 2019 году — персональная выставка в Московском музее современного искусства. Третьяковка называет Панкина классиком отечественного современного искусства.",
    thumb: pankinPortrait.url,
  },

  {
    id: "c2",
    name: "Мария Соколова",
    role: "Куратор, мастер акварели",
    bio: "Ведёт мастер-классы по акварели и курирует программу «Разговоры об искусстве». Училась в РГХПУ им. С. Г. Строганова.",
    thumb: wm("The Great Wave off Kanagawa.jpg", 600),
  },
  {
    id: "c3",
    name: "Артём Белов",
    role: "График, преподаватель",
    bio: "Классическая академическая школа рисунка. Работает с углём, сангиной, литографией. Ведёт студию для подростков.",
    thumb: wm("The Scream.jpg", 600),
  },
];

export const SEED_POSTS: Post[] = [
  {
    id: "p1",
    title: "Что если картину можно построить как математическое доказательство?",
    date: "12 ноября 2026",
    excerpt: "Александр Панкин не выбирал цвет и форму интуитивно. В основе его работ — числа, ряды Фибоначчи и строгие структуры.",
    body: "«Я занимаюсь метаабстракцией — абстракцией об абстрактном. В основе — числа. Это суперабстракция», — говорил художник.\n\nПанкин учился на архитектора в МАрхИ, а затем в легендарной студии Элия Белютина «Новая реальность», через которую прошло целое поколение нонконформистов. Свою программу он выстраивал вокруг идей Малевича, искал способ продолжить супрематизм языком математики и науки.\n\nЕго работы — в самых именитых собраниях мира: Третьяковская галерея, Русский музей, ГЦСИ, частные коллекции США и Европы. В 2019 году в Московском музее современного искусства прошла его персональная выставка. Третьяковка называет Панкина классиком отечественного современного искусства.\n\nНа выставке в нашем Арт-центре можно увидеть, пожалуй, самую чувственную работу мастера. Ждём вас!",
    cover: pankinPoster.url,
    category: "character",
    characterId: "c1",
  },

  {
    id: "p2",
    title: "Как смотреть акварель",
    date: "5 ноября 2026",
    excerpt: "Мария Соколова — короткий разговор о технике, которая кажется простой, но требует наибольшей точности.",
    body: "Акварель — самая честная техника. Она не прощает лишнего движения и не даёт возможности переписать. Разговор о том, как смотреть акварель, чтобы увидеть в ней главное.",
    cover: wm("The Great Wave off Kanagawa.jpg", 900),
    category: "character",
    characterId: "c2",
  },
  {
    id: "p3",
    title: "Уголь: инструмент, который старше живописи",
    date: "28 октября 2026",
    excerpt: "Артём Белов — о материале, с которого начинается любой рисунок.",
    body: "Уголь появился раньше, чем красочный слой. Разговор о том, как классическая штудия учит видеть форму, а не запоминать её.",
    cover: wm("The Scream.jpg", 900),
    category: "character",
    characterId: "c3",
  },
  {
    id: "p4",
    title: "Русский авангард возвращается в частные коллекции",
    date: "20 октября 2026",
    excerpt: "Обзор осенних торгов: что покупают и почему.",
    body: "Отчёт по итогам осенних торгов — что покупают, кто покупает и как это меняет карту русского авангарда в частных собраниях.",
    cover: wm("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg", 900),
    category: "news",
  },
  {
    id: "p5",
    title: "Пять выставок сезона, которые нельзя пропустить",
    date: "10 октября 2026",
    excerpt: "Гид «Нарратива» по московским и подмосковным выставкам осени.",
    body: "Наш редакторский выбор: пять выставок, ради которых стоит проехать всё Подмосковье.",
    cover: wm("Monet - Impression, Sunrise.jpg", 900),
    category: "news",
  },
];

export const SEED_EXHIBITIONS: Exhibition[] = [
  {
    id: "x1",
    title: "Метаабстракция",
    date: "октябрь — ноябрь 2026",
    cover: pankinPoster.url,
    concept: "Персональная выставка Александра Панкина. Художник строит картину как математическое доказательство: в основе — числа, ряды Фибоначчи и вычисленные пропорции. Продолжение супрематизма Малевича языком науки.",
    type: "exhibition",
    participants: ["Александр Панкин"],
    photos: [
      pankinWork1.url,
      pankinWork2.url,
      pankinPortrait.url,
    ],
    thematic: "Число как первооснова формы. Абстракция об абстрактном — суперабстракция.",
  },

  {
    id: "x2",
    title: "Русский авангард",
    date: "1–28 сентября 2026",
    cover: wm("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg", 900),
    concept: "Групповая выставка. Малевич, Кандинский, Гончарова из частных собраний и запасников музеев-партнёров.",
    type: "exhibition",
    participants: ["Казимир Малевич", "Василий Кандинский", "Пит Мондриан"],
    photos: [
      wm("Kazimir Malevich, 1915, Black Suprematic Square, oil on linen canvas, 79.5 x 79.5 cm, Tretyakov Gallery, Moscow.jpg", 700),
      wm("Vassily Kandinsky, 1923 - Composition 8, huile sur toile, 140 cm x 201 cm, Musée Guggenheim, New York.jpg", 700),
      wm("Piet Mondriaan, 1930 - Mondrian Composition II in Red, Blue, and Yellow.jpg", 700),
    ],
    thematic: "Программные работы супрематизма и неопластицизма — точка, из которой выросло всё послевоенное искусство.",
  },
  {
    id: "x3",
    title: "Акварельный weekend",
    date: "июль 2026",
    cover: wm("The Great Wave off Kanagawa.jpg", 900),
    concept: "Двухдневный интенсив с Марией Соколовой. Тридцать участников, три сессии по три часа, финальная развеска.",
    type: "masterclass",
    participants: ["Мария Соколова"],
    photos: [wm("The Great Wave off Kanagawa.jpg", 700)],
    thematic: "Основы техники, работа с бумагой, композиционные упражнения.",
  },
  {
    id: "x4",
    title: "Молодая графика — 2026",
    date: "май 2026",
    cover: wm("The Scream.jpg", 900),
    concept: "Открытый конкурс графических работ. 84 участника из 12 городов, приз — персональная выставка в «Нарративе».",
    type: "competition",
    participants: ["Артём Белов (жюри)"],
    photos: [wm("The Scream.jpg", 700)],
    thematic: "Итоги: пять победителей и три специальных упоминания жюри.",
  },
];
