import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import { usePujaProducto } from "../../hooks/usePujaProducto";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
} from "@mui/material";

const PujasPage = () => {
  const { idProducto } = useParams<{ idProducto: string }>();
  const { user } = useUser();

  const {
    producto,
    tiempoRestante,
    pujas,
    loading,
    createPuja,
    getNombreUsuario,
  } = usePujaProducto(idProducto);

  const [oferta, setOferta] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);

  const montoActual =
    pujas.length > 0
      ? Math.max(...pujas.map((p) => p.monto))
      : producto?.precioBase || 0;

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const s = (totalSeconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const handleOferta = useCallback(async () => {
    setError(null);
    setExito(null);

    if (!user) {
      setError("Debes iniciar sesión para ofertar.");
      return;
    }

    const ofertaNum = Number(oferta);

    if (isNaN(ofertaNum) || ofertaNum <= montoActual) {
      setError(`La oferta debe ser un número mayor a $${montoActual}`);
      return;
    }

    if (!producto) {
      setError("Producto no válido");
      return;
    }

    try {
      await createPuja({
        id: 0,
        productoId: Number(producto.id),
        usuarioId: user.id,
        monto: ofertaNum,
        fecha: new Date().toISOString(),
      });
      
      setExito("Oferta realizada con éxito!");
      setOferta("");
    } catch (e) {
      setError("Error al realizar la oferta. Intenta nuevamente.");
    }
  }, [user, oferta, montoActual, producto, createPuja]);

  if (loading || !producto) {
    return (
      <Box display="flex" justifyContent="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 6,
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
        boxShadow: 3,
        backgroundColor: "background.paper",
      }}
    >
      <Typography variant="h4" mb={2} textAlign="center">
        {producto.titulo}
      </Typography>

      <Box
        component="img"
        src={producto.imagen}
        alt={producto.titulo}
        sx={{ width: "100%", maxHeight: 300, objectFit: "contain", mb: 2 }}
      />

      <Typography mb={1}>{producto.descripcion}</Typography>
      <Typography mb={1}>Precio Base: ${producto.precioBase}</Typography>

      <Typography mb={3} variant="h6" textAlign="center">
        Tiempo restante: {formatTime(tiempoRestante)}
      </Typography>

      {tiempoRestante === 0 && (
        <Alert severity="info" sx={{ mb: 2 }}>
          La subasta ha finalizado.{" "}
          {pujas.length > 0 ? (
            <>
              Ganador: <strong>{getNombreUsuario(pujas[0].usuarioId)}</strong> con oferta de{" "}
              <strong>${pujas[0].monto}</strong>
            </>
          ) : (
            <>No hubo ofertas.</>
          )}
        </Alert>
      )}

      {tiempoRestante > 0 && (
        <>
          <Box display="flex" gap={2} mb={2}>
            <TextField
              fullWidth
              label="Tu oferta"
              type="number"
              value={oferta}
              onChange={(e) => setOferta(e.target.value)}
            />
            <Button variant="contained" onClick={handleOferta}>
              Ofertar
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {exito && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {exito}
            </Alert>
          )}
        </>
      )}

      <Typography variant="h6" mt={4}>
        Historial de Pujas
      </Typography>

      {pujas.length === 0 ? (
        <Typography>No hay pujas aún.</Typography>
      ) : (
        <List>
          {pujas.map((puja) => (
            <ListItem key={puja.id} divider>
              <ListItemText
                primary={`$${puja.monto}`}
                secondary={`${getNombreUsuario(puja.usuarioId)} - ${new Date(
                  puja.fecha
                ).toLocaleString()}`}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default PujasPage;
