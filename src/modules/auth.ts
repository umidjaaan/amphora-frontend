// Авторизация и деавторизация — только axios, без кодогенерации и thunk.
// Результат компонент сам передаёт в Redux (setUser / clearUser).
import axios from "axios";
import { getAuthToken } from "./token";

export interface AuthUser {
  id: number;
  login: string;
  is_moderator: boolean;
}

export interface LoginResult {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: AuthUser;
}

// Текст ошибки из ответа веб-сервиса {status, message}.
export const errorMessage = (error: unknown, fallback: string): string =>
  (axios.isAxiosError(error) && (error.response?.data as { message?: string } | undefined)?.message) || fallback;

export async function loginRequest(login: string, password: string): Promise<LoginResult> {
  const response = await axios.post("/api/users/login", { login, password });
  return response.data.data as LoginResult;
}

export async function registerRequest(login: string, password: string): Promise<AuthUser> {
  const response = await axios.post("/api/users/register", { login, password });
  return response.data.data as AuthUser;
}

// Деавторизация: веб-сервис кладёт токен в чёрный список Redis.
export async function logoutRequest(): Promise<void> {
  const token = getAuthToken();
  if (!token) return;
  await axios.post("/api/users/logout", null, { headers: { Authorization: `Bearer ${token}` } });
}
