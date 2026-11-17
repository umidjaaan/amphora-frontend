// Изображение и видео по умолчанию лежат в самом проекте (папка public/)
// и подставляются, если в услуге поле пустое или файл не загрузился.
export const DEFAULT_IMAGE = "/DefaultImage.jpg";
export const DEFAULT_VIDEO = "/DefaultVideo.mp4";

// viaProxy — ссылки на MinIO (http://localhost:9000/import-categories/...)
// превращаются в относительные (/import-categories/...): их проксирует Vite
// вторым маршрутом, как и запросы /api к веб-сервису.
export const viaProxy = (url: string): string =>
  url.replace(/^https?:\/\/[^/]+(?=\/import-categories\/)/, "");

// imageOrDefault — ссылка на фото услуги или заглушка, если ссылки нет.
export const imageOrDefault = (url?: string | null): string => (url ? viaProxy(url) : DEFAULT_IMAGE);

// videoOrDefault — ссылка на видео услуги или заглушка, если ссылки нет.
export const videoOrDefault = (url?: string | null): string => (url ? viaProxy(url) : DEFAULT_VIDEO);
