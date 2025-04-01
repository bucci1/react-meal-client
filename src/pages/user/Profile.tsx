import { Paper } from "@mui/material";
import MyTable from "../utils/MyTable";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useEffect } from "react";
import { getUserApi } from "../../features/user/userAPIs";
import { getUser } from "../../features/user/userSlice";
import { User } from "../../features/user/userTypes";



export default function Profile() {
  const userlist = useAppSelector((state) => state.user.users);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUserApi();
        const users: User[] = response.data; // Extract data correctly

        dispatch(getUser(users));
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers(); // Call the function inside useEffect
  }, []);

  const handleSave = (user: User) => {};

  const handleDelete = (user: User) => {};
  return (
    <Paper
      elevation={24}
      sx={{
        m: 4,
        p: 1,
      }}
    >
      <MyTable/>
    </Paper>
  );
}
