# Амфора — фронтенд

Одностраничное приложение (SPA) на **React + TypeScript** для системы
«Оценка торговых связей по статистике импортных находок»: просмотр категорий
импорта в виде **ленты** и **плитки** (гость), вход, добавление и публикация
категорий, удаление своих категорий и лайки (создатель).

Бэкенд (веб-сервис на Go) — репозиторий
[web-app-development-2026](https://github.com/umidjaaan/web-app-development-2026).

| ЛР | Ветка | Что сделано |
|---|---|---|
| ЛР5 | `lab5` | лента и плитка для гостя, mock-данные, изображение и видео по умолчанию |
| ЛР6 | `lab6` | Redux Toolkit, redux-thunk, кодогенерация API (axios), вход/выход, добавление, удаление, лайки |

## Стек

| Что | Зачем |
|---|---|
| React 18, TypeScript | компоненты и типизация |
| Vite | dev-сервер на порту 3000 и прокси: `/api` → веб-сервис `localhost:8080`, `/import-categories` → MinIO `localhost:9000` |
| React Router 6 | маршруты страниц |
| React-Bootstrap 2, Bootstrap 5 | `Card`, `Form`, `Button`, `Navbar`, `Nav`, `Row/Col`, `Badge`, `Spinner`, `Alert` |
| Redux Toolkit, react-redux | состояние пользователя, фильтр, список, лента, черновик |
| redux-thunk (`createAsyncThunk`) | запросы к домену `import_categories` |
| axios | HTTP-клиент; вход и выход — напрямую через axios |
| swagger-typescript-api | кодогенерация клиента API из Swagger веб-сервиса → `src/api/Api.ts` |

React Context не используется.

## Запуск

```shell
npm install
npm run generate-api   # нужен запущенный веб-сервис: берёт http://localhost:8080/swagger/doc.json
npm run dev            # http://localhost:3000
```

* **Без веб-сервиса** гость видит карточки из mock-объектов (`src/modules/mock.ts`),
  в шапке — метка «mock-данные».
* **С веб-сервисом** данные приходят из PostgreSQL, фото и видео — из MinIO через
  прокси `/import-categories`; метка «веб-сервис».

## Страницы

### Лента — `/import_categories/feed`, `/import_categories/feed/:id`

| Элемент | Что делает |
|---|---|
| Видео на фоне, фото под ним | нет видео/фото — видео/изображение по умолчанию (`public/DefaultVideo.mp4`, `public/DefaultImage.jpg`) |
| Счётчик `2 / 14` | позиция категории в ленте |
| Название, период, автор, описание + **«Ещё»** | описание в 2 строки, по кнопке — полностью |
| Кнопка с **сердцем** | лайк / отмена лайка (только после входа), число лайков |
| Кнопка **«След.»** | следующая категория ленты |

Thunk: `fetchFeedItem`, `likeImportCategory`.

### Плитка — `/import_categories`

| Элемент | Что делает |
|---|---|
| Поле **«Дата начала — не позднее»** | фильтр по дате начала бытования (год до н. э.) |
| Кнопки **«Показать»** и **«сбросить фильтр»** | применить / сбросить фильтр (хранится в Redux, сбрасывается при выходе) |
| Карточка | фото, название, лайки, период; нажатие — категория в ленте |
| Кнопка **«Удалить»** | только у своих категорий создателя (`is_creator = 1`) |

Thunk: `fetchImportCategories`, `deleteImportCategory`.

### Аутентификация — `/login`

Поля **«Логин»**, **«Пароль»**, кнопки **«Войти»** и **«Зарегистрироваться»**.
Запросы — через axios (`src/modules/auth.ts`), результат вручную передаётся в
Redux действием `setUser`. JWT хранится в памяти и копией в `localStorage`
(`amphora_jwt`). После **F5** Redux снова в состоянии гостя, а токен остаётся
во вкладке Application.

### Добавление категории — `/import_categories/add` (только создателю)

| Шаг | Поля и кнопки | Thunk |
|---|---|---|
| 1 | **«Название»**, **«Фото»**, **«Видео»**, кнопка **«Далее»** — создаётся черновик | `createImportCategory` |
| 2 | **«Дата начала»**, **«Дата конца»**, **«Описание»**, кнопки **«Опубликовать»** и **«Удалить черновик»** | `publishImportCategory`, `deleteImportCategory` |

При открытии загружается черновик (`fetchDraft`): если он есть — сразу шаг 2.

### Нижняя панель

`Navbar` из 4 пунктов: **Лента**, **Добавление**, **Плитка**, **Вход**. Гостю
недоступно «Добавление». После входа пункт «Вход» становится **«Выход»**:
запрос деавторизации (axios), сброс пользователя и фильтра в Redux.

Во время любого запроса страницу перекрывает анимация загрузки (`LoadingOverlay`),
кнопки недоступны.

## Состояние Redux

| Слайс | Поля |
|---|---|
| `user` | `isAuthenticated`, `id`, `login`, `isModerator` |
| `importCategories` | `dateStart` (фильтр), `list`, `listSource`, `feedItem`, `feedSource`, `draft`, `loading`, `error` |

Thunk в `src/slices/importCategoriesSlice.ts` вызывают сгенерированные методы
`api.importCategories.getImportCategories`, `getFeed`, `getDraft`,
`createImportCategory`, `publishImportCategory`, `deleteImportCategory`,
`likeImportCategory` (имена — `operationId` из Swagger веб-сервиса).

## Структура

```
scripts/generate-api.mjs   кодогенерация API (swagger-typescript-api, axios)
src/
  api/Api.ts               сгенерированный клиент (npm run generate-api)
  api/index.ts             экземпляр api + заголовок Authorization
  store.ts, hooks.ts       хранилище Redux и типизированные хуки
  slices/userSlice.ts      пользователь
  slices/importCategoriesSlice.ts  фильтр, список, лента, черновик + thunk
  pages/                   FeedPage, TilesPage, LoginPage, AddCategoryPage
  components/              TabBar, CategoryCard, DateFilter, SourceBadge, LoadingOverlay
  modules/                 auth.ts (axios), token.ts (JWT), mock.ts, types.ts, defaults.ts
```

## Хуки

| Хук | Где | Зачем |
|---|---|---|
| `useAppSelector` (`useSelector`) | страницы, `TabBar` | чтение состояния Redux |
| `useAppDispatch` (`useDispatch`) | страницы, `TabBar` | запуск thunk и действий |
| `useState` | страницы | поля форм, раскрытие описания |
| `useEffect` | страницы | загрузка данных при открытии и при смене фильтра, ид, пользователя |
| `useNavigate`, `useParams`, `useLocation` | страницы, `TabBar` | переходы, ид из адреса, активный пункт панели |
