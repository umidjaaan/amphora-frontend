// Состояние пользователя: гость или авторизованный создатель.
// Вход и выход выполняются через axios (modules/auth.ts) без thunk,
// а результат вручную передаётся сюда действиями setUser / clearUser.
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AuthUser } from "../modules/auth";

export interface UserState {
  isAuthenticated: boolean; // false — интерфейс гостя, true — создателя
  id: number | null;
  login: string;
  isModerator: boolean;
}

const initialState: UserState = {
  isAuthenticated: false,
  id: null,
  login: "",
  isModerator: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AuthUser>) {
      state.isAuthenticated = true;
      state.id = action.payload.id;
      state.login = action.payload.login;
      state.isModerator = action.payload.is_moderator;
    },
    clearUser() {
      return initialState;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
