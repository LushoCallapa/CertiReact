import { useEffect, useState } from "react";
import type { Product } from "../../interfaces/Product";
import { getProducts } from "../../services/productService";
import { Box, Grid, Typography } from "@mui/material";
import ProductCard from "../../component/ProductCard";

const Subasta = () => {
  const [productos, setProductos] = useState<Product[]>([]);

  const fetchProductos = async () => {
    try {
      const response = await getProducts();
      setProductos(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const actualizarProducto = (productoActualizado: Product) => {
    setProductos((prev) =>
      prev.map((p) =>
        p.id === productoActualizado.id ? productoActualizado : p
      )
    );
  };

  const renderProductos = (estado: Product["estado"]) => (
    <Grid container spacing={2}>
      {productos
        .filter((p) => p.estado === estado)
        .map((p) => (
          <Grid key={p.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ProductCard product={p} onUpdate={actualizarProducto} />
          </Grid>
        ))}
    </Grid>
  );

  return (
    <Box sx={{ px: 4, py: 6 }}>
      <Typography variant="h4" gutterBottom textAlign="center">
        Subastas
      </Typography>

      <Typography variant="h5" mt={4} mb={2}>
        Subastas Actuales
      </Typography>
      {renderProductos("actual")}

      <Typography variant="h5" mt={4} mb={2}>
        Subastas Próximas
      </Typography>
      {renderProductos("proxima")}

      <Typography variant="h5" mt={4} mb={2}>
        Subastas Pasadas
      </Typography>
      {renderProductos("pasada")}
    </Box>
  );
};

export default Subasta;
