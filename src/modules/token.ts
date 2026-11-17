// JWT текущего сеанса. В переменной — пока пользователь вошёл (после F5 она
// пустая, приложение снова в режиме гостя); в localStorage — копия токена,
// которая остаётся после F5 (её видно во вкладке Application).
const STORAGE_KEY = "amphora_jwt";

let authToken: string | null = null;

export const getAuthToken = (): string | null => authToken;

export function setAuthToken(token: string): void {
  authToken = token;
  try {
    localStorage.setItem(STORAGE_KEY, token);
  } catch {
    // localStorage недоступен (приватный режим) — работаем без копии
  }
}

export function clearAuthToken(): void {
  authToken = null;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ничего не делаем
  }
}
