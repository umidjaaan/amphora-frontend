// Изображение и видео по умолчанию лежат в самом проекте (папка public/)
// и подставляются, если в услуге поле пустое или файл не загрузился.
export const DEFAULT_IMAGE = "/DefaultImage.jpg";
export const DEFAULT_VIDEO = "/DefaultVideo.mp4";

// imageOrDefault — ссылка на фото услуги или заглушка, если ссылки нет.
export const imageOrDefault = (url?: string | null): string => url || DEFAULT_IMAGE;

// videoOrDefault — ссылка на видео услуги или заглушка, если ссылки нет.
export const videoOrDefault = (url?: string | null): string => url || DEFAULT_VIDEO;
