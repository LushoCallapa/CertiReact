import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { login } from "../services/authService";
import { useUser } from "../context/UserContext";

interface LoginFormValues {
  nombre: string;
  password: string;
}

const LoginSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "Muy corto")
    .max(50, "Muy largo")
    .required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
});

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      nombre: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        const user = await login(values.nombre, values.password);
        setUser(user);
        setSubmitting(false);
        if (user.rol === "admin") {
          navigate("/admin/productos");
        } else {
          navigate("/user/subasta");
        }
      } catch (err) {
        setError("Nombre de usuario o contraseña incorrectos");
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        p: 4,
        border: "1px solid #ddd",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h5" component="h2" mb={3} textAlign="center">
        Iniciar Sesión
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <form onSubmit={formik.handleSubmit} noValidate>
        <TextField
          fullWidth
          label="Nombre"
          name="nombre"
          value={formik.values.nombre}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.nombre && Boolean(formik.errors.nombre)}
          helperText={formik.touched.nombre && formik.errors.nombre}
          margin="normal"
          required
        />

        <TextField
          fullWidth
          label="Contraseña"
          type="password"
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
          margin="normal"
          required
        />

        <Stack spacing={2} mt={3}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Ingresando..." : "Ingresar"}
          </Button>

          <Button
            variant="text"
            fullWidth
            sx={{ mt: 2 }}
            onClick={() => navigate("/register")}
          >
            ¿No tienes cuenta? Regístrate
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginPage;
