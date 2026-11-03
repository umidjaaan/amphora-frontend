import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Проксирование запросов к веб-сервису (обход CORS):
    // фронтенд -> dev-сервер Vite -> бэкенд на Go (порт 8080).
    // Адреса бэкенда уже начинаются с /api, поэтому путь не переписываем.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
