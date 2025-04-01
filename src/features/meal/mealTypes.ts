export type MealId = number

export interface Meal {
  id: MealId,
  title: string;
  time: string;
  date: string;
  calorie: number;
}
