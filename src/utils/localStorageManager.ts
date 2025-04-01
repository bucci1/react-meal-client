import { UserState } from "../features/user/userTypes";

export const saveAuthtoken = (token: string) => {
  localStorage.setItem("token", token);
};

export const getAuthTokenFromLocalStorage = () => {
  return localStorage.getItem("token") || "";
};

export const saveUserState = (userState: UserState) => {
  localStorage.setItem(
    "userState",
    JSON.stringify({
      user: userState.user,
      isLoggedin: userState.isLoggedin,
    })
  );
};

export const getUserState = () => {
  const storedUserState = localStorage.getItem("userState");
  return storedUserState ? JSON.parse(storedUserState) : null;
};

export const cleanState = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userState");
};
