import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    // Проксирование (обход CORS): фронтенд -> dev-сервер Vite -> бэкенд на Go
    // (порт 8080) и MinIO (порт 9000). Пути не переписываются: адреса
    // веб-сервиса начинаются с /api, адреса файлов — с /import-categories.
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // второй маршрут — объектное хранилище MinIO (S3) с фото и видео
      "/import-categories": {
        target: "http://localhost:9000",
        changeOrigin: true,
      },
    },
  },
});
