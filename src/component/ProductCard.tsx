import { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import type { Product } from "../interfaces/Product";
import { useNavigate } from "react-router-dom";

import { updateProduct } from "../services/productService";

const ProductCard = ({
  product,
  onUpdate,
}: {
  product: Product;
  onUpdate: (producto: Product) => void;
}) => {
  const navigate = useNavigate();

  const [tiempoRestante, setTiempoRestante] = useState(product.duracion);
  const [estado, setEstado] = useState(product.estado);

  const updateProductStatus = async () => {
    try {
      await updateProduct(product.id, {
        ...product,
        duracion: 0,
        estado: "pasada",
      });
      const updatedProduct = { ...product, duracion: 0, estado: "pasada" as "pasada" };
      setEstado("pasada");
      onUpdate(updatedProduct);
    } catch (error) {
      console.error("Error actualizando producto:", error);
    }
  };

  const updatedProduct = async (tiempo: number, producto: Product) => {
    try{
      await updateProduct(Number(product.id), {
          ...producto,
          duracion: tiempo - 1,
        });
    }catch (error) {
      console.error("Error actualizando producto:", error);
    }
  }

  useEffect(() => {
    if (estado !== "actual") return;

    if (tiempoRestante <= 0) {
      updateProductStatus();
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((t) => (t > 0 ? t - 1 : 0));
      if (product.id) {
        updatedProduct(tiempoRestante, product);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const formatSecondsToHHMMSS = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };


  return (
    <Card
      sx={{ display: "flex", flexDirection: "column", height: "100%" }}
      onClick={() => navigate(`/user/pujas/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="180"
        image={product.imagen}
        alt={product.titulo}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6">{product.titulo}</Typography>
        <Typography variant="body2" color="text.secondary">
          {product.descripcion}
        </Typography>
        <Typography variant="body1" mt={1}>
          precio: ${product.precioBase}
        </Typography>
        {estado === "actual" && (
          <Chip
            label={formatSecondsToHHMMSS(tiempoRestante)}
            color="primary"
            variant="outlined"
            sx={{ mt: 1 }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCard;
