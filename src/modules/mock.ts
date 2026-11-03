// Mock-объекты: те же 14 опубликованных категорий импорта, что и в базе
// веб-сервиса (seed.go). Поля совпадают с ответами API, поэтому страницы
// не различают, откуда пришли данные.
//
// У категорий 13 и 14 нет фото и видео (null) — на них видно
// изображение и видео по умолчанию.
import type { FeedItem, ImportCategory } from "./api";

interface MockCategory {
  id: number;
  title: string;
  image_url: string | null;
  video_url: string | null;
  date_start: string; // год до н. э.: 0620-01-01 — 620 г. до н. э.
  date_end: string;
  description: string;
  likes: number;
}

export const IMPORT_CATEGORIES_MOCK: MockCategory[] = [
  {
    id: 1,
    title: "Аттическая чернофигурная керамика",
    image_url: "/img/attic-black-figure.jpg",
    video_url: "/video/attic-black-figure.mp4",
    date_start: "0620-01-01",
    date_end: "0480-01-01",
    description: "Массовый показатель прямых связей с Афинами в архаический период. Столовая посуда, попадавшая на периферию вместе с вином и маслом; по формам (килики «типа В», лекифы) датируется с точностью до четверти века, поэтому служит опорной категорией при построении хронологии слоя.",
    likes: 14,
  },
  {
    id: 2,
    title: "Аттическая краснофигурная керамика",
    image_url: "/img/attic-red-figure.jpg",
    video_url: "/video/attic-red-figure.mp4",
    date_start: "0530-01-01",
    date_end: "0320-01-01",
    description: "Сменяет чернофигурную технику и удерживает рынок до конца IV в. до н. э. Поздние «керченские» пелики и кратеры составляют характерный набор северопричерноморского импорта и маркируют пик афинской торговли.",
    likes: 12,
  },
  {
    id: 3,
    title: "Этрусское буккеро (bucchero nero)",
    image_url: "/img/etruscan-bucchero.jpg",
    video_url: "/video/etruscan-bucchero.mp4",
    date_start: "0675-01-01",
    date_end: "0500-01-01",
    description: "Опознаваемая по излому «чёрная» этрусская посуда — та самая «чернощёковая керамика» вариантов задания. Её появление на памятнике фиксирует тирренское направление связей, обычно опосредованное греческими эмпориями, поэтому единичные фрагменты весят в реконструкции больше, чем их доля в массе.",
    likes: 9,
  },
  {
    id: 4,
    title: "Хиосские амфоры",
    image_url: "/img/chian-amphora.jpg",
    video_url: "/video/chian-amphora.mp4",
    date_start: "0600-01-01",
    date_end: "0300-01-01",
    description: "Тара знаменитого хиосского вина — одна из самых ранних массовых импортных категорий в Причерноморье. Эволюция формы горла (пухлое — прямое — колпачковая ножка) даёт независимую шкалу датировок внутри VI–IV вв. до н. э.",
    likes: 10,
  },
  {
    id: 5,
    title: "Фасосские амфоры",
    image_url: "/img/thasian-amphora.jpg",
    video_url: "/video/thasian-amphora.mp4",
    date_start: "0420-01-01",
    date_end: "0210-01-01",
    description: "Клеймёная тара делает Фасос эталонной категорией: по именам магистратов сводка находок переводится в узкие хронологические интервалы, а доля фасосского вина показывает вес северноэгейского направления.",
    likes: 9,
  },
  {
    id: 6,
    title: "Гераклейские амфоры",
    image_url: "/img/heraclean-amphora.jpg",
    video_url: "/video/heraclean-amphora.mp4",
    date_start: "0410-01-01",
    date_end: "0200-01-01",
    description: "Ближайший к Понту крупный поставщик вина. Обычно даёт наибольшую долю в массе амфорного материала IV в. до н. э., поэтому именно от неё отсчитывается «фон», на котором видны дальние направления импорта.",
    likes: 11,
  },
  {
    id: 7,
    title: "Синопские амфоры",
    image_url: "/img/sinopean-amphora.jpg",
    video_url: "/video/sinopean-amphora.mp4",
    date_start: "0400-01-01",
    date_end: "0100-01-01",
    description: "Вино и оливковое масло Синопы вытесняют гераклейские поставки в III в. до н. э. Пироксеновые включения различимы даже в мелком фрагменте, что делает категорию удобной для количественного учёта.",
    likes: 9,
  },
  {
    id: 8,
    title: "Родосские амфоры",
    image_url: "/img/rhodian-amphora.jpg",
    video_url: "/video/rhodian-amphora.mp4",
    date_start: "0300-01-01",
    date_end: "0040-01-01",
    description: "Эллинистический маркёр дальней средиземноморской торговли. Родосские клейма датируются по периодам эпонимов, что позволяет привязывать верхние слои памятника к абсолютной хронологии.",
    likes: 7,
  },
  {
    id: 9,
    title: "Косские амфоры",
    image_url: "/img/koan-amphora.jpg",
    video_url: "/video/koan-amphora.mp4",
    date_start: "0300-01-01",
    date_end: "0030-01-01",
    description: "Тара косского вина с морской водой. Форма ручки настолько специфична, что категория надёжно выделяется даже в сильно фрагментированном материале, и потому включена в сводку отдельной позицией.",
    likes: 6,
  },
  {
    id: 10,
    title: "Мегарские рельефные чаши",
    image_url: "/img/megarian-bowl.jpg",
    video_url: "/video/megarian-bowl.mp4",
    date_start: "0225-01-01",
    date_end: "0075-01-01",
    description: "Эллинистическая имитация металлической посуды. Оттиски одной матрицы связывают находки с конкретной мастерской, поэтому категория используется для различения пергамского и ионийского направлений внутри одного региона.",
    likes: 5,
  },
  {
    id: 11,
    title: "Арретинская терра сигиллата",
    image_url: "/img/arretine-sigillata.jpg",
    video_url: "/video/arretine-sigillata.mp4",
    date_start: "0040-01-01",
    date_end: "0010-01-01",
    description: "Италийская столовая посуда раннеримского времени. Даже единичные фрагменты фиксируют включение памятника в средиземноморскую систему обмена эпохи Августа и датируются по форме клейма с точностью до десятилетий.",
    likes: 4,
  },
  {
    id: 12,
    title: "Восточная сигиллата А (ESA)",
    image_url: "/img/eastern-sigillata-a.jpg",
    video_url: "/video/eastern-sigillata-a.mp4",
    date_start: "0150-01-01",
    date_end: "0010-01-01",
    description: "Основная краснолаковая столовая серия Восточного Средиземноморья. Отделяется от италийской сигиллаты по цвету теста, что позволяет разделить в сводке западное и восточное направления импорта.",
    likes: 5,
  },
  {
    id: 13,
    title: "Египетский фаянс: скарабеи и бусы",
    image_url: null,
    video_url: null,
    date_start: "0650-01-01",
    date_end: "0525-01-01",
    description: "Мелкий престижный импорт, расходившийся по Средиземноморью через греческий эмпорий в Навкратисе. В массе находок доля ничтожна, но категория важна как индикатор дальних, «цепочечных» связей.",
    likes: 5,
  },
  {
    id: 14,
    title: "Финикийское сердечниковое стекло",
    image_url: null,
    video_url: null,
    date_start: "0550-01-01",
    date_end: "0250-01-01",
    description: "Сосудики для благовоний, изготовленные до изобретения стеклодувной трубки на песчано-глиняном сердечнике. Дорогой штучный товар: единичные фрагменты указывают на присутствие торговцев, а не на регулярный поток.",
    likes: 3,
  },
];

const MOCK_CREATOR = { id: 1, login: "umid", is_moderator: true };

// year — год до н. э. из даты «0620-01-01».
const year = (date: string): number => Number(date.slice(0, 4));

// periodLabel — «620–480 гг. до н. э.», как поле period в ответе API.
const periodLabel = (c: MockCategory): string =>
  `${year(c.date_start)}–${year(c.date_end)} гг. до н. э.`;

// Порядок как на бэкенде: date_start DESC, id ASC — сначала более ранние
// (для лет до н. э. большее число — более ранний год).
const ordered = (): MockCategory[] =>
  [...IMPORT_CATEGORIES_MOCK].sort(
    (a, b) => b.date_start.localeCompare(a.date_start) || a.id - b.id,
  );

// listFromMock — список с фильтром «тип появился не позднее даты»:
// для годов до н. э. это date_start >= выбранной даты.
export function listFromMock(dateStart: string): ImportCategory[] {
  return ordered()
    .filter((c) => !dateStart || c.date_start >= dateStart)
    .map((c) => ({
      id: c.id,
      title: c.title,
      image_url: c.image_url,
      date_start: c.date_start,
      date_end: c.date_end,
      period: periodLabel(c),
      likes: c.likes,
      is_creator: 0, // гость: своих услуг нет
    }));
}

// feedFromMock — услуга ленты по ид (или первая) с позицией и следующей.
export function feedFromMock(id?: number): FeedItem {
  const list = ordered();
  let pos = list.findIndex((c) => c.id === id);
  if (pos < 0) pos = 0;
  const c = list[pos];
  const next = list[(pos + 1) % list.length];
  return {
    id: c.id,
    title: c.title,
    image_url: c.image_url,
    video_url: c.video_url,
    date_start: c.date_start,
    date_end: c.date_end,
    period: periodLabel(c),
    description: c.description,
    likes: c.likes,
    is_liked: 0,
    creator: MOCK_CREATOR,
    position: pos + 1,
    total: list.length,
    next_id: next.id,
  };
}
