import React from "react";
import logo from "./logo.svg";
import "./App.css";
import LoginPage from "./pages/user/Login";
import Profile from "./pages/user/Profile";
import { Provider } from "react-redux";
import { store } from "./store/store";
import MyAlert from "./pages/MyAlert";
import MyRouter from "./MyRiuter";
import axios from "axios";
import { getAuthTokenFromLocalStorage } from "./utils/localStorageManager";

function App() {
  axios.defaults.headers.common["Authorization"] =
    getAuthTokenFromLocalStorage();
  return (
    <Provider store={store}>
      <div className="App">
        <MyRouter />
        <MyAlert />
      </div>
    </Provider>
  );
}

export default App;
