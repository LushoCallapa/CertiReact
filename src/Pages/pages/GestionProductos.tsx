import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

import type { Product } from "../../interfaces/Product";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../services/productService";

import ProductDialog from "./product/ProductDialog";

const GestionProductos = () => {
  const [productos, setProductos] = useState<Product[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProductos = async () => {
    const data = await getProducts();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleEdit = (producto: Product) => {
    setEditingProduct(producto);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro que quieres eliminar este producto?")) {
      await deleteProduct(id);
      setProductos((prev) =>
        prev.filter((producto) => producto.id !== id)
      );
    }
  };

  const handleOpen = () => {
    setEditingProduct(null);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSave = async (values) => {
    try {
      if (editingProduct) {
        const response = await updateProduct(editingProduct.id, { ...editingProduct, ...values });
        setProductos((prev) =>
          prev.map((producto) =>
            producto.id === editingProduct.id ? response : producto
          )
        );
      } else {
        const response = await createProduct({ ...values, estado: "actual" });
        setProductos((prev) => [...prev, response]);
      }
    } catch (error) {
      console.error("Error al guardar producto", error);
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Gestión de Productos
      </Typography>

      <Button variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
        Crear Producto
      </Button>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Título</TableCell>
            <TableCell>Descripción</TableCell>
            <TableCell>Imagen</TableCell>
            <TableCell>Precio Base</TableCell>
            <TableCell>Duración (segundos)</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell>{producto.titulo}</TableCell>
              <TableCell>{producto.descripcion}</TableCell>
              <TableCell>
                <img src={producto.imagen} alt={producto.titulo} width={80} />
              </TableCell>
              <TableCell>${producto.precioBase}</TableCell>
              <TableCell>{producto.duracion}</TableCell>
              <TableCell>{producto.estado}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(producto)} disabled={producto.estado === "pasada"}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(producto.id)} disabled={producto.estado === "pasada"}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <ProductDialog
        open={openDialog}
        onClose={handleClose}
        productToEdit={editingProduct}
        onSave={handleSave}
      />
    </Box>
  );
};

export default GestionProductos;
