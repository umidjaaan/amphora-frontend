// Экземпляр сгенерированного API (src/api/Api.ts создаётся командой npm run generate-api).
import { Api } from "./Api";
import { getAuthToken } from "../modules/token";

// Запросы идут на тот же адрес, что и страница: dev-сервер Vite проксирует /api
// на веб-сервис (localhost:8080) — так обходится CORS.
export const api = new Api({ baseURL: window.location.origin });

// JWT добавляется в заголовок Authorization, только пока пользователь вошёл
// (в состоянии Redux). После F5 приложение снова в режиме гостя.
api.instance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
