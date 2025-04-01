export interface User {
  id: number;
  name: string;
  email: string;
  calorie: number;
  level: "Admin" | "Customer";
}

export interface Profile {
  id: number;
  name: string;
  calorie: number | string;
  password: string;
  password_confirm: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface RegisterError {
  name: string;
  email: string;
  password: string;
  password_confirm: string;
}

export interface UserState {
  user: User | null;
  isLoggedin: boolean;
  loading: boolean;
  users: User[];
}

export interface LoginForm {
  email: string;
  password: string;
}

/** ✅ Removed `loginData`:
 * - `password_confirm` is not typically required in a login form.
 * - `LoginForm` already covers the necessary fields.
 */
