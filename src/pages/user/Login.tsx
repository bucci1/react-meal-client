import React, { useState, useCallback } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../hooks/useAppSelector";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { LoginForm } from "../../features/user/userTypes";
import { loginUserApi } from "../../features/user/userAPIs";
import { decodeToken } from "../../utils/decodeToken";
import { loginUser } from "../../features/user/userSlice";
import { saveAuthtoken, saveUserState } from "../../utils/localStorageManager";
import { setMessage } from "../../features/message/messagSlice";

const isValidEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

const validateLoginForm = (form: LoginForm) => {
  const errors = Object.entries(form).reduce((acc, [key, value]) => {
    if (!value)
      acc[key as keyof LoginForm] = `${
        key.charAt(0).toUpperCase() + key.slice(1)
      } is required`;
    if (key === "email" && !isValidEmail(value))
      acc.email = "Invalid email format";
    if (key === "password" && value.length < 3)
      acc.password = "Password must be at least 3 characters";
    return acc;
  }, {} as Partial<LoginForm>);

  return Object.keys(errors).length ? errors : null;
};

const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [error, setError] = useState<Partial<LoginForm>>({});

  const handleLogin = useCallback(async () => {
    const errors = validateLoginForm(form);
    if (errors) return setError(errors);

    try {
      const loginRes = await loginUserApi(form);
      saveAuthtoken(loginRes?.token);
      const user = decodeToken(loginRes?.token);
      saveUserState({ user, isLoggedin: true, loading: false, users: [] });

      dispatch(loginUser(user));
      dispatch(
        setMessage({ type: "success", message: "Logged in successfully." })
      );
      navigate("/meal");
    } catch (error: any) {
      dispatch(
        setMessage({
          type: "warning",
          message: error.message || error,
        })
      );
    }
  }, [form, dispatch, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const formFields = [
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
  ];

  return (
    <Container maxWidth="xs">
      <Paper
        elevation={6}
        sx={{
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: 6,
          borderRadius: 2,
        }}
      >
        <Typography variant="h4" fontWeight={600} gutterBottom>
          Login
        </Typography>

        {formFields.map(({ name, label, type }) => (
          <TextField
            key={name}
            fullWidth
            margin="normal"
            label={label}
            type={type}
            name={name}
            value={form[name as keyof LoginForm]}
            onChange={handleInputChange}
            error={!!error[name as keyof LoginForm]}
            helperText={error[name as keyof LoginForm]}
          />
        ))}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleLogin}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          sx={{ mt: 1 }}
          onClick={() => navigate("/register")}
        >
          Register
        </Button>
      </Paper>
    </Container>
  );
};

export default LoginPage;
