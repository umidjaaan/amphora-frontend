// Кодогенерация клиента API из Swagger веб-сервиса (бэкенд должен быть запущен).
// Запуск: npm run generate-api → src/api/Api.ts
import { resolve } from "path";
import { generateApi } from "swagger-typescript-api";

await generateApi({
  fileName: "Api.ts",
  output: resolve(process.cwd(), "./src/api"),
  url: "http://localhost:8080/swagger/doc.json",
  httpClientType: "axios",
  // методы группируются по тегам Swagger: api.importCategories.*, api.users.*
  moduleNameFirstTag: true,
});
