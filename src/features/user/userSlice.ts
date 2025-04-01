import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState } from "./userTypes";
import { getUserState } from "../../utils/localStorageManager";

const localState = getUserState();

const initialState: UserState = {
  user: localState?.user || null,
  isLoggedin: localState?.isLoggedin || false,
  loading: false,
  users: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isLoggedin = true;
      state.loading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoggedin = false;
      state.loading = false;
    },
    setloadding: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    getUser: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedin = false;
    },
  },
});

export const {
  loginUser,
  logoutUser,
  setloadding,
  getUser,
  logout,
  updateProfile,
} = userSlice.actions;
export default userSlice.reducer;
