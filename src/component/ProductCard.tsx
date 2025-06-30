import { Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import type { Product } from "../interfaces/Product";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }: { product: Product }) => {
      const navigate = useNavigate();
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
    <Card sx={{ display: "flex", flexDirection: "column", height: "100%" }} onClick={() => navigate(`/user/pujas/${product.id}`)}>
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
        {product.estado === "actual" && (
          <Chip
            label={`${formatSecondsToHHMMSS(product.duracion)}`}
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
