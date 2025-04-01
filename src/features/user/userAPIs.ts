import axios, { AxiosError } from "axios";
import { LoginForm, Profile, RegisterForm, User } from "./userTypes";
import { getAuthTokenFromLocalStorage } from "../../utils/localStorageManager";

const API_URL = "http://192.168.11.174:5000/auth/";

interface LoginRes {
  message: string;
  token: string;
}
axios.defaults.headers.common["Authorization"] = getAuthTokenFromLocalStorage();
// ✅ Register User API
export const registerUser = async (registerFrom: RegisterForm) => {
  try {
    const response = await axios.post(API_URL, { user: registerFrom });
    return response.data; // Extract the actual data
  } catch (error: any) {
    throw error?.response.data.errors;
  }
};

// ✅ Login User API
export const loginUserApi = async (loginData: LoginForm) => {
  try {
    const response = await axios.post<LoginRes>(`${API_URL}login`, loginData);
    return response.data; // Extract `data` from response
  } catch (error: any) {
    throw error?.response?.data.errors;
  }
};

export const getUserApi = async () => {
  try {
    const response = await axios.get(`${API_URL}`);
    return response;
  } catch (error: any) {
    throw error?.response.data.errors;
  }
};

export const deleteUser = async (userDataId: number) => {
  try {
    const response = await axios.delete(`${API_URL}${userDataId}`);
    return response;
  } catch (error: any) {
    throw error?.response.data.errors;
  }
};

export const updateUser = async (userData: User) => {
  try {
    const response = await axios.put(
      `${API_URL}admin/${userData.id}`,
      userData
    );
    return response;
  } catch (error: any) {
    throw error?.response.data.errors;
  }
};

export const updateProile = async (profile: Profile) => {
  try {
    const response = await axios.put(`${API_URL}`, profile);
    return response;
  } catch (error: any) {
    throw error?.response.data.errors;
  }
};
