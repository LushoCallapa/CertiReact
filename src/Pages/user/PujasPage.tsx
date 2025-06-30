import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import type { Product } from "../../interfaces/Product";
import type { Puja } from "../../interfaces/Pujas";
import type { User } from "../../interfaces/User";
import { getProductById } from "../../services/productService";
import { getPujasByProducto, postPuja } from "../../services/pujasService";
import { getUsuarios } from "../../services/authService";
import { useUser } from "../../context/UserContext";

const formatTime = (totalSeconds: number) => {
  const h = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const m = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (totalSeconds % 60).toString().padStart(2, "0");
  return `${h}:${m}:${s}`;
};

const PujasPage = () => {
  const { idProducto } = useParams<{ idProducto: string }>();
  const [producto, setProducto] = useState<Product>({
    id: 0,
    duracion: 0,
    titulo: "",
    descripcion: "",
    estado: "actual",
    precioBase: 0,
    imagen: "",
  });
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [oferta, setOferta] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const { user } = useUser();
  const sseRef = useRef<EventSource | null>(null);

  const fetchProduct = async (id: string) => {
    try {
      const productos = await getProductById(id);
      const pujas = await getPujasByProducto(id);
      const usuarios = await getUsuarios();
      setProducto(productos);
      setPujas(pujas);
      setUsuarios(usuarios);
      let tiempo = productos.duracion;
      setTiempoRestante(tiempo > 0 ? tiempo : 0);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (!idProducto) return;
    fetchProduct(idProducto);
  }, [idProducto]);

  useEffect(() => {
    if (tiempoRestante <= 0) return;

    const timer = setInterval(() => {
      setTiempoRestante((t) => (t > 0 ? t - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante]);

  const getNombreUsuario = (usuarioId: string) => {
    const user = usuarios.find((u) => u.id === usuarioId);
    return user ? user.nombre : "Usuario desconocido";
  };

  const montoActual =
    pujas.length > 0
      ? Math.max(...pujas.map((p) => p.monto))
      : producto?.precioBase || 0;

  const handleOferta = async () => {
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

    setLoading(true);

    try {
      const productoId = parseInt(idProducto || "0", 10);
      await postPuja({
        id: 0,
        productoId: productoId,
        usuarioId: user.id,
        monto: ofertaNum,
        fecha: new Date().toISOString(),
      });

      setExito("Oferta realizada con éxito!");
      setOferta("");
    } catch (e: any) {
      setError("Error al realizar la oferta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!idProducto) return;

    if (sseRef.current) {
      sseRef.current.close();
    }

    sseRef.current = new EventSource("http://localhost:3001/events");

    sseRef.current.onopen = () => {
      console.log("Conexión SSE abierta");
    };

    sseRef.current.onmessage = (event) => {
      console.log("Evento SSE recibido:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (
          data.tipo === "nueva_puja" &&
          data.puja?.productoId === Number(idProducto)
        ) {
          console.log("Actualizando pujas con:", data.puja);
          setPujas((prev) => [data.puja, ...prev]);
        }
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };

    sseRef.current.onerror = (error) => {
      console.error("Error en SSE:", error);
      sseRef.current?.close();
      sseRef.current = null;
    };

    return () => {
      console.log("Cerrando conexión SSE");
      sseRef.current?.close();
      sseRef.current = null;
    };
  }, [idProducto]);

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
      {producto ? (
        <>
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
                  Ganador:{" "}
                  <strong>{getNombreUsuario(pujas[0].usuarioId)}</strong> con
                  oferta de <strong>${pujas[0].monto}</strong>
                </>
              ) : (
                <>No hubo ofertas.</>
              )}
            </Alert>
          )}

          {tiempoRestante > 0 && (
            <>
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

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  mb: 3,
                  justifyContent: "center",
                }}
              >
                <TextField
                  label="Tu oferta"
                  type="number"
                  value={oferta}
                  onChange={(e) => setOferta(e.target.value)}
                  fullWidth
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOferta}
                  disabled={loading}
                >
                  {loading ? "Ofertando..." : "Ofertar"}
                </Button>
              </Box>
            </>
          )}

          <Typography variant="h6" mb={1}>
            Pujas
          </Typography>

          <List>
            {pujas.length === 0 && <Typography>No hay pujas aún.</Typography>}
            {pujas.map((puja) => (
              <ListItem key={puja.id} divider>
                <ListItemText
                  primary={`Usuario: ${getNombreUsuario(puja.usuarioId)}`}
                  secondary={`Monto: $${puja.monto} - Fecha: ${new Date(
                    puja.fecha
                  ).toLocaleString()}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Typography>No se encontró el producto.</Typography>
      )}
    </Box>
  );
};

export default PujasPage;
