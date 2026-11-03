// Обращение к веб-сервису «Амфора» (бэкенд на Go, ЛР3–ЛР4).
//
// Запросы идут на /api/... — dev-сервер Vite проксирует их на
// http://localhost:8080 (см. vite.config.ts). Если веб-сервис недоступен
// (не запущен, ошибка, пустой ответ), данные берутся из mock-объектов —
// в ЛР5 страницы работают без бэкенда.
import { feedFromMock, listFromMock } from "./mock";

// Услуга в списке — как ответ GET /api/import_categories.
export interface ImportCategory {
  id: number;
  title: string;
  image_url: string | null;
  date_start: string | null; // ГГГГ-ММ-ДД, год до н. э.
  date_end: string | null;
  period: string | null; // «620–480 гг. до н. э.»
  likes: number;
  is_creator: number; // 1 — услуга текущего пользователя
}

// Создатель услуги (вложенный объект в ленте).
export interface Creator {
  id: number;
  login: string;
  is_moderator: boolean;
}

// Услуга в ленте — как ответ GET /api/import_categories/feed.
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
  position: number; // номер услуги в ленте
  total: number; // всего услуг в ленте
  next_id: number; // ид следующей услуги
}

// Откуда пришли данные: с веб-сервиса или из mock-объектов.
export type DataSource = "server" | "mock";

export interface Loaded<T> {
  data: T;
  source: DataSource;
}

// Общий вид ответа веб-сервиса: {status, data, message}.
interface ApiResponse<T> {
  status: "success" | "fail";
  data: T;
  message?: string;
}

const API_PREFIX = "/api";

async function request<T>(url: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const body = (await response.json()) as ApiResponse<T>;
  if (body.status !== "success" || body.data == null) {
    throw new Error(body.message || "пустой ответ");
  }
  return body.data;
}

// getImportCategories — список опубликованных услуг с фильтром по дате начала.
export async function getImportCategories(
  dateStart: string,
  signal?: AbortSignal,
): Promise<Loaded<ImportCategory[]>> {
  const query = dateStart ? `?date_start=${encodeURIComponent(dateStart)}` : "";
  try {
    const data = await request<ImportCategory[]>(`${API_PREFIX}/import_categories${query}`, signal);
    return { data, source: "server" };
  } catch (error) {
    if (signal?.aborted) throw error; // страница уже закрыта — ответ не нужен
    return { data: listFromMock(dateStart), source: "mock" };
  }
}

// getFeedItem — одна услуга ленты: первая (id не задан) или по ид.
export async function getFeedItem(
  id: number | undefined,
  signal?: AbortSignal,
): Promise<Loaded<FeedItem>> {
  const query = id ? `?id=${id}` : "";
  try {
    const data = await request<FeedItem>(`${API_PREFIX}/import_categories/feed${query}`, signal);
    return { data, source: "server" };
  } catch (error) {
    if (signal?.aborted) throw error;
    return { data: feedFromMock(id), source: "mock" };
  }
}
