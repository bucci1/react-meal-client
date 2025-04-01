import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Meal, MealId } from "./mealTypes";

const initialState: Meal[] = [];

const mealSlice = createSlice({
  name: "meal",
  initialState,
  reducers: {
    bookMeal: (state, action: PayloadAction<Meal>) => {
      state = [...state, action.payload];
    },
    getMeals: (state, action: PayloadAction<Meal[]>) => {
      state = action.payload;
    },
    getMealByUser: (state, action: PayloadAction<Meal[]>) => {
      state = action.payload;
    },
    updateMeal: (state, action: PayloadAction<Meal>) => {
      state = state.map((meal) => {
        if (action.payload.id != meal.id) {
          return meal;
        } else {
          return action.payload;
        }
      });
    },
    deleteMeal: (state, action: PayloadAction<Meal>) => {
      state = state.filter((meal) => meal.id != action.payload.id);
    },
  },
});

export const {
  bookMeal,
  getMeals,
  getMealByUser,
  updateMeal,
  deleteMeal,
} = mealSlice.actions;
export default mealSlice.reducer;
