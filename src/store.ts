// Хранилище Redux Toolkit: пользователь и категории импорта.
import { configureStore } from "@reduxjs/toolkit";
import importCategoriesReducer from "./slices/importCategoriesSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    importCategories: importCategoriesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
