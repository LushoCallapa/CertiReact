import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import type { Product } from "../../../interfaces/Product";

const validationSchema = yup.object({
  titulo: yup.string().required("Título es requerido"),
  descripcion: yup.string().required("Descripción es requerida"),
  imagen: yup.string().url("Debe ser una URL válida").required("Imagen es requerida"),
  precioBase: yup.number().min(1, "Precio base debe ser mayor que 0").required("Precio base es requerido"),
  duracion: yup.number().min(1, "Duración debe ser mayor que 0").required("Duración es requerida"),
});

type Props = {
  open: boolean;
  onClose: () => void;
  productToEdit: Product | null;
  onSave: (values) => void;
};

const ProductDialog= ({ open, onClose, productToEdit, onSave }: Props) => {
  const formik = useFormik({
    initialValues: {
      titulo: productToEdit?.titulo ?? "",
      descripcion: productToEdit?.descripcion ?? "",
      imagen: productToEdit?.imagen ?? "",
      precioBase: productToEdit?.precioBase ?? 0,
      duracion: productToEdit?.duracion ?? 0,
    },
    validationSchema,
    onSubmit: async (values) => {
      await onSave(values);
      onClose();
    },
    enableReinitialize: true,
  });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{productToEdit ? "Editar Producto" : "Crear Producto"}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            id="titulo"
            name="titulo"
            label="Título"
            value={formik.values.titulo}
            onChange={formik.handleChange}
            error={formik.touched.titulo && Boolean(formik.errors.titulo)}
            helperText={formik.touched.titulo && formik.errors.titulo}
          />
          <TextField
            margin="normal"
            fullWidth
            id="descripcion"
            name="descripcion"
            label="Descripción"
            value={formik.values.descripcion}
            onChange={formik.handleChange}
            error={formik.touched.descripcion && Boolean(formik.errors.descripcion)}
            helperText={formik.touched.descripcion && formik.errors.descripcion}
          />
          <TextField
            margin="normal"
            fullWidth
            id="imagen"
            name="imagen"
            label="URL de Imagen"
            value={formik.values.imagen}
            onChange={formik.handleChange}
            error={formik.touched.imagen && Boolean(formik.errors.imagen)}
            helperText={formik.touched.imagen && formik.errors.imagen}
          />
          <TextField
            margin="normal"
            fullWidth
            type="number"
            id="precioBase"
            name="precioBase"
            label="Precio Base"
            value={formik.values.precioBase}
            onChange={formik.handleChange}
            error={formik.touched.precioBase && Boolean(formik.errors.precioBase)}
            helperText={formik.touched.precioBase && formik.errors.precioBase}
          />
          <TextField
            margin="normal"
            fullWidth
            type="number"
            id="duracion"
            name="duracion"
            label="Duración (segundos)"
            value={formik.values.duracion}
            onChange={formik.handleChange}
            error={formik.touched.duracion && Boolean(formik.errors.duracion)}
            helperText={formik.touched.duracion && formik.errors.duracion}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => formik.handleSubmit()} variant="contained">
          {productToEdit ? "Guardar Cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProductDialog;
