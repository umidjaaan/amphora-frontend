// Типы данных веб-сервиса «Амфора» (поля как в ответах API).

// Категория импорта (услуга) в списке — GET /api/import_categories.
export interface ImportCategory {
  id: number;
  title: string;
  image_url: string | null;
  date_start: string | null; // ГГГГ-ММ-ДД, год до н. э.
  date_end: string | null;
  period: string | null; // «620–480 гг. до н. э.»
  likes: number;
  is_creator: number; // 1 — категория текущего пользователя
}

// Создатель категории (вложенный объект в ленте).
export interface Creator {
  id: number;
  login: string;
  is_moderator: boolean;
}

// Категория в ленте — GET /api/import_categories/feed.
export interface FeedItem {
  id: number;
  title: string;
  image_url: string | null;
  video_url: string | null;
  date_start: string | null;
  date_end: string | null;
  period: string | null;
  description: string | null;
  likes: number;
  is_liked: number;
  creator: Creator;
  position: number; // номер категории в ленте
  total: number; // всего категорий в ленте
  next_id: number; // ид следующей категории
}

// Черновик — GET /api/import_categories/draft и ответ POST /api/import_categories.
export interface Draft {
  id: number;
  title: string;
  image_url: string | null;
  video_url: string | null;
  created_at: string;
  status: string;
}

// Откуда пришли данные: с веб-сервиса или из mock-объектов.
export type DataSource = "server" | "mock";
