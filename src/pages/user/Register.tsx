import {
  Button,
  ButtonGroup,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useCallback, useState } from "react";
import { RegisterForm } from "../../features/user/userTypes";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../features/user/userAPIs";
import { setMessage } from "../../features/message/messagSlice";
import { useAppDispatch } from "../../hooks/useAppDispatch";

const isValidEmail = (email: string): boolean =>
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

export default function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
  });

  const [error, setError] = useState<Partial<RegisterForm>>({});

  const validateRegisterForm = (): boolean => {
    const newErrors: Partial<RegisterForm> = Object.entries(form).reduce(
      (acc, [key, value]) => {
        if (!value)
          acc[key as keyof RegisterForm] = `${key.replace(
            "_",
            " "
          )} is required`;
        if (key === "name" && value.length < 3)
          acc.name = "Name must be at least 3 characters";
        if (key === "email" && !isValidEmail(value))
          acc.email = "Invalid email";
        if (key === "password" && value.length < 3)
          acc.password = "Password must be at least 3 characters";
        if (key === "password_confirm" && value !== form.password)
          acc.password_confirm = "Passwords do not match";
        return acc;
      },
      {} as Partial<RegisterForm>
    );

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: "" })); // Clear error for the field
  };

  const handleRegister = useCallback(async () => {
    if (!validateRegisterForm()) return;
    setIsRegistering(true);
    try {
      await registerUser(form);
      dispatch(
        setMessage({ type: "success", message: "Registered successfully." })
      );
      navigate("/login");
    } catch (error: any) {
      dispatch(
        setMessage({
          type: "warning",
          message: error?.message || "Registration failed.",
        })
      );
      setIsRegistering(false);
    }
  }, [form]);

  const formFields = [
    { name: "name", label: "Name", type: "text" },
    { name: "email", label: "Email", type: "email" },
    { name: "password", label: "Password", type: "password" },
    { name: "password_confirm", label: "Confirm Password", type: "password" },
  ];

  return (
    <Container maxWidth="sm">
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
          Register
        </Typography>

        {formFields.map(({ name, label, type }) => (
          <TextField
            key={name}
            sx={{ width: "100%", mb: 2 }}
            label={label}
            type={type}
            name={name}
            value={form[name as keyof RegisterForm]}
            onChange={handleInputChange}
            error={!!error[name as keyof RegisterForm]}
            helperText={error[name as keyof RegisterForm]}
          />
        ))}

        <ButtonGroup fullWidth sx={{ mt: 2 }}>
          <Button
            variant="contained"
            color="success"
            onClick={handleRegister}
            disabled={isRegistering}
          >
            Register
          </Button>
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/login")}
          >
            Cancel
          </Button>
        </ButtonGroup>
      </Paper>
    </Container>
  );
}
