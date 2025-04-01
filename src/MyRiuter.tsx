import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { useAppSelector } from "./hooks/useAppSelector";
import LoginPage from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profiles from "./pages/user/Profiles";
import Meal from "./pages/meal/Meal";
import Navbar from "./pages/layout/NavBar";
import ProfileSelf from "./pages/user/ProfileSelf";

export default function MyRouter() {
  const user = useAppSelector((state) => state.user);

  return (
    <Router>
      {user.isLoggedin && <Navbar />}
      <Routes>
        {user.isLoggedin ? (
          <>
            <Route path="/user" element={<ProfileSelf />} />
            {user.user?.level === "Admin" && (
              <Route path="/admin/user" element={<Profiles />} />
            )}
            <Route path="/meal" element={<Meal />} />
            {user.user?.level === "Admin" && (
              <Route path="admin/meal" element={<Meal />} />
            )}
            <Route path="*" element={<Navigate to="/meal" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}
