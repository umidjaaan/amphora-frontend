// Состояние категорий импорта: фильтр по дате начала, список для плитки,
// категория ленты и черновик. Все запросы к домену import_categories —
// через redux-thunk и сгенерированный из Swagger код (api.importCategories.*).
import { createAsyncThunk, createSlice, isFulfilled, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { api } from "../api";
import { feedFromMock, listFromMock } from "../modules/mock";
import type { DataSource, Draft, FeedItem, ImportCategory } from "../modules/types";
import type { RootState } from "../store";

export interface ImportCategoriesState {
  dateStart: string; // фильтр «дата начала — не позднее» (ГГГГ-ММ-ДД)
  list: ImportCategory[];
  listSource: DataSource;
  feedItem: FeedItem | null;
  feedSource: DataSource;
  draft: Draft | null;
  loading: boolean; // идёт запрос — кнопки блокируются
  error: string | null;
}

const initialState: ImportCategoriesState = {
  dateStart: "",
  list: [],
  listSource: "server",
  feedItem: null,
  feedSource: "server",
  draft: null,
  loading: false,
  error: null,
};

// Текст ошибки из ответа веб-сервиса {status, message}.
const messageOf = (error: unknown, fallback: string): string =>
  (axios.isAxiosError(error) && (error.response?.data as { message?: string } | undefined)?.message) || fallback;

// Список опубликованных категорий с фильтром из Redux.
// Гостю при недоступном бэкенде отдаются mock-объекты.
export const fetchImportCategories = createAsyncThunk<
  { items: ImportCategory[]; source: DataSource },
  void,
  { state: RootState; rejectValue: string }
>("importCategories/fetchImportCategories", async (_, { getState, rejectWithValue }) => {
  const { importCategories, user } = getState();
  const dateStart = importCategories.dateStart;
  try {
    const response = await api.importCategories.getImportCategories(dateStart ? { date_start: dateStart } : {});
    return { items: response.data.data as unknown as ImportCategory[], source: "server" };
  } catch (error) {
    if (user.isAuthenticated) return rejectWithValue(messageOf(error, "Веб-сервис недоступен"));
    return { items: listFromMock(dateStart), source: "mock" };
  }
});

// Одна категория ленты: первая (id не задан) или по ид.
export const fetchFeedItem = createAsyncThunk<
  { item: FeedItem; source: DataSource },
  number | undefined,
  { state: RootState; rejectValue: string }
>("importCategories/fetchFeedItem", async (id, { getState, rejectWithValue }) => {
  try {
    const response = await api.importCategories.getFeed(id ? { id } : {});
    return { item: response.data.data as unknown as FeedItem, source: "server" };
  } catch (error) {
    if (getState().user.isAuthenticated) return rejectWithValue(messageOf(error, "Веб-сервис недоступен"));
    return { item: feedFromMock(id), source: "mock" };
  }
});

// Черновик текущего пользователя (404 — черновика нет).
export const fetchDraft = createAsyncThunk<Draft | null, void, { rejectValue: string }>(
  "importCategories/fetchDraft",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.importCategories.getDraft();
      return response.data.data as unknown as Draft;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) return null;
      return rejectWithValue(messageOf(error, "Не удалось загрузить черновик"));
    }
  },
);

// Шаг «Далее»: создание черновика с названием, фото и видео.
export const createImportCategory = createAsyncThunk<
  Draft,
  { title: string; image?: File; video?: File },
  { rejectValue: string }
>("importCategories/createImportCategory", async ({ title, image, video }, { rejectWithValue }) => {
  try {
    const response = await api.importCategories.createImportCategory({
      title,
      ...(image ? { image } : {}),
      ...(video ? { video } : {}),
    });
    return response.data.data as unknown as Draft;
  } catch (error) {
    return rejectWithValue(messageOf(error, "Не удалось создать черновик"));
  }
});

// Публикация черновика: даты начала и конца бытования и описание.
export const publishImportCategory = createAsyncThunk<
  ImportCategory,
  { id: number; date_start: string; date_end: string; description: string },
  { rejectValue: string }
>("importCategories/publishImportCategory", async ({ id, ...fields }, { rejectWithValue }) => {
  try {
    const response = await api.importCategories.publishImportCategory(id, fields);
    return response.data.data as unknown as ImportCategory;
  } catch (error) {
    return rejectWithValue(messageOf(error, "Не удалось опубликовать категорию"));
  }
});

// Удаление своей категории (или черновика).
export const deleteImportCategory = createAsyncThunk<number, number, { rejectValue: string }>(
  "importCategories/deleteImportCategory",
  async (id, { rejectWithValue }) => {
    try {
      await api.importCategories.deleteImportCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(messageOf(error, "Не удалось удалить категорию"));
    }
  },
);

// Лайк и отмена лайка категории в ленте.
export const likeImportCategory = createAsyncThunk<
  { import_category_id: number; is_liked: number; likes: number },
  { id: number; like: 0 | 1 },
  { rejectValue: string }
>("importCategories/likeImportCategory", async ({ id, like }, { rejectWithValue }) => {
  try {
    const response = await api.importCategories.likeImportCategory(id, { like });
    return response.data.data as unknown as { import_category_id: number; is_liked: number; likes: number };
  } catch (error) {
    return rejectWithValue(messageOf(error, "Не удалось поставить лайк"));
  }
});

const thunks = [
  fetchImportCategories,
  fetchFeedItem,
  fetchDraft,
  createImportCategory,
  publishImportCategory,
  deleteImportCategory,
  likeImportCategory,
] as const;

const importCategoriesSlice = createSlice({
  name: "importCategories",
  initialState,
  reducers: {
    setDateStart(state, action: PayloadAction<string>) {
      state.dateStart = action.payload;
    },
    // при выходе пользователя фильтр и его данные сбрасываются
    resetImportCategories() {
      return initialState;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchImportCategories.fulfilled, (state, action) => {
        state.list = action.payload.items;
        state.listSource = action.payload.source;
      })
      .addCase(fetchFeedItem.fulfilled, (state, action) => {
        state.feedItem = action.payload.item;
        state.feedSource = action.payload.source;
      })
      .addCase(fetchDraft.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(createImportCategory.fulfilled, (state, action) => {
        state.draft = action.payload;
      })
      .addCase(publishImportCategory.fulfilled, (state) => {
        state.draft = null;
      })
      .addCase(deleteImportCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((item) => item.id !== action.payload);
        if (state.draft?.id === action.payload) state.draft = null;
      })
      .addCase(likeImportCategory.fulfilled, (state, action) => {
        if (state.feedItem && state.feedItem.id === action.payload.import_category_id) {
          state.feedItem.likes = action.payload.likes;
          state.feedItem.is_liked = action.payload.is_liked;
        }
      })
      // общая анимация загрузки и текст ошибки для всех запросов
      .addMatcher(isPending(...thunks), (state) => {
        state.loading = true;
        state.error = null;
      })
      .addMatcher(isFulfilled(...thunks), (state) => {
        state.loading = false;
      })
      .addMatcher(isRejected(...thunks), (state, action) => {
        state.loading = false;
        state.error = (action.payload as string | undefined) ?? "Ошибка запроса";
      });
  },
});

export const { setDateStart, resetImportCategories, clearError } = importCategoriesSlice.actions;
export default importCategoriesSlice.reducer;
