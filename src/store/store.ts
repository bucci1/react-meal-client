// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import mealReducer from "../features/meal/mealSlice";
import messageReducer from "../features/message/messagSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    meal: mealReducer,
    message: messageReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools only in development
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
