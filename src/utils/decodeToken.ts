import { User } from "../features/user/userTypes";
import { jwtDecode } from "jwt-decode";

export const decodeToken = (token: string): User | null => {
  try {
    // Decode the token
    const decoded: User = jwtDecode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null; // Return null or handle the error accordingly
  }
};
