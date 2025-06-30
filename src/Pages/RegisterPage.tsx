import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import { register } from "../services/authService";

interface RegisterFormValues {
  nombre: string;
  password: string;
  rol: "usuario" | "admin";
}

const RegisterSchema = Yup.object().shape({
  nombre: Yup.string()
    .min(2, "Muy corto")
    .max(50, "Muy largo")
    .required("Requerido"),
  password: Yup.string().min(6, "Mínimo 6 caracteres").required("Requerido"),
  rol: Yup.string()
    .oneOf(["usuario", "admin"], "Rol inválido")
    .required("Requerido"),
});

const RegisterPage = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik<RegisterFormValues>({
    initialValues: {
      nombre: "",
      password: "",
      rol: "usuario",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setError(null);
      try {
        await register(values.nombre, values.password, values.rol);
        setSubmitting(false);
        navigate("/login");
      } catch (e: any) {
        setError(
          e.message || "Error al registrar usuario. Intenta nuevamente."
        );
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
        Registro
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

        <FormControl
          fullWidth
          margin="normal"
          error={formik.touched.rol && Boolean(formik.errors.rol)}
          required
        >
          <InputLabel id="rol-label">Rol</InputLabel>
          <Select
            labelId="rol-label"
            id="rol"
            name="rol"
            value={formik.values.rol}
            label="Rol"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <MenuItem value="usuario">Usuario</MenuItem>
            <MenuItem value="admin">Administrador</MenuItem>
          </Select>
          <FormHelperText>
            {formik.touched.rol && formik.errors.rol}
          </FormHelperText>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
          sx={{ mt: 3 }}
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Registrando..." : "Registrarse"}
        </Button>
      </form>
      <Button
        variant="text"
        fullWidth
        sx={{ mt: 2 }}
        onClick={() => navigate("/login")}
      >
        ¿Ya tienes una cuenta? Inicia sesión
      </Button>
    </Box>
  );
};

export default RegisterPage;
