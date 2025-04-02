import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { Profile, User } from "../../features/user/userTypes";
import { useNavigate } from "react-router-dom";
import { updateProile } from "../../features/user/userAPIs";
import { setMessage } from "../../features/message/messagSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { updateProfile } from "../../features/user/userSlice";

const tvalid = (profileForm: Profile) => {
  const error: any = {};
  if (!profileForm.name) error.name = "Name is Required";
  if (Number(profileForm.calorie) < 1)
    error.calorie = "Calorie must be at least 1";

  if (profileForm.password_confirm !== profileForm.password)
    error.password_confirm = "Password does not match";
  if (profileForm.password.length > 0 && profileForm.password.length < 3)
    error.password = "Password must be at least 3 charactors";
  if (profileForm.name.length < 3) error.name = "Name must be 3 charactors";

  return Object.keys(error).length ? error : null;
};

export default function ProfileSelf() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const [form, setForm] = useState<Profile>({
    id: user?.id || 0,
    name: user?.name || "",
    calorie: user?.calorie || 0,
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState<Profile>({
    id: 0,
    name: "",
    calorie: "",
    password: "",
    password_confirm: "",
  });

  const navigate = useNavigate();

  const handleInputForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError((prev) => ({ ...prev, [e.target.name]: "" }));
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = useCallback(async () => {
    const error = tvalid(form);
    if (error) return setError(error);
    try {
      const response = await updateProile(form);
      console.log(response.data.user);
      dispatch(updateProfile(response.data.user as User));

      dispatch(
        setMessage({
          type: "success",
          message: "Profile updated successfully.",
        })
      );
      navigate("/login");
    } catch (error: any) {
      dispatch(
        setMessage({
          type: "warning",
          message: error,
        })
      );
    }
  }, [error]);

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={24}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        <Typography variant="h6" gutterBottom>
          {user?.email}
        </Typography>
        <TextField
          sx={{ width: "100%", margin: 2 }}
          label="Name"
          name="name"
          value={form.name}
          onChange={handleInputForm}
          error={!!error.name}
          helperText={error.name}
        />

        <TextField
          sx={{ width: "100%", margin: 2 }}
          label="Calorie"
          name="calorie"
          type="number"
          value={form.calorie}
          onChange={handleInputForm}
          error={!!error.calorie}
          helperText={error.calorie}
        />

        <TextField
          sx={{ width: "100%", margin: 2 }}
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleInputForm}
          error={!!error.password}
          helperText={error.password}
        />

        <TextField
          sx={{ width: "100%", margin: 2 }}
          label="Confirm"
          type="password"
          name="password_confirm"
          value={form.password_confirm}
          onChange={handleInputForm}
          error={!!error.password_confirm}
          helperText={error.password_confirm}
        />

        <ButtonGroup variant="contained">
          <Button variant="contained" color="success" onClick={handleUpdate}>
            Save
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/meal")}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Paper>
    </Container>
  );
}
