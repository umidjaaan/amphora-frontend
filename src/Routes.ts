// Адреса страниц приложения и подписи пунктов нижней панели.
// Совпадают с адресами страниц из ЛР1 (шаблоны Go).
export const ROUTES = {
  FEED: "/import_categories/feed",
  ADD: "/import_categories/add",
  TILES: "/import_categories",
  LOGIN: "/login",
} as const;

export type RouteKey = keyof typeof ROUTES;

export const ROUTE_LABELS: { [key in RouteKey]: string } = {
  FEED: "Лента",
  ADD: "Добавление",
  TILES: "Плитка",
  LOGIN: "Вход",
};
