import axios from "axios";
import { Meal } from "./mealTypes";
import { getAuthTokenFromLocalStorage } from "../../utils/localStorageManager";

const API_URL = "http://192.168.11.174:5000/meal";


axios.defaults.headers.common["Authorization"] = getAuthTokenFromLocalStorage();
export const getMealsApi = async () => {
  try {
    const meals = await axios.get(`${API_URL}/`);
    return meals;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const bookMealApi = async (mealData: Meal) => {
  try {
    const meal = await axios.post(`${API_URL}/`, mealData);
    return meal.data;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const getMealByUserApi = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/admin/${id}`);
    return response;
  } catch (error: any) {
    return error?.response?.data;
  }
};

export const updateMealApi = async (mealData: Meal) => {
  try {
    const response = await axios.put(`${API_URL}/${mealData.id}`, mealData);
    return response;
  } catch (error: any) {
    return typeof error?.response?.data == "object"
      ? error?.response?.data[0]
      : error?.response?.data;
  }
};

export const deleteMealApi = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response;
  } catch (error: any) {
    return error?.response?.data;
  }
};
