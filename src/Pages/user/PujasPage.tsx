import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { usePujasStore } from "../../store/pujasStore";
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
import type { User } from "../../interfaces/User";
import { getProductById, updateProduct } from "../../services/productService";
import { getUsuarios } from "../../services/authService";
import { useUser } from "../../context/UserContext";

const PujasPage = () => {
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

  const { pujas = [], loading, createPuja, fetchPujas, setPuja } = usePujasStore();
  const [montoActual, setMontoActual] = useState<number>(0);
  const { idProducto } = useParams<{ idProducto: string }>();
  const [producto, setProducto] = useState<Product | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [oferta, setOferta] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [exito, setExito] = useState<string | null>(null);
  const [tiempoRestante, setTiempoRestante] = useState<number>(0);
  const { user } = useUser();
  const sseRef = useRef<EventSource | null>(null);

  const fetchProduct = async (id: string) => {
    try {
      const productos = await getProductById(id);
      await fetchPujas(id);
      const usuarios = await getUsuarios();
      setUsuarios(usuarios);
      setProducto(productos);
      const tiempo = productos.duracion;
      setTiempoRestante(tiempo > 0 ? tiempo : 0);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    if (pujas && pujas.length > 0) {
      const maxMonto = Math.max(...pujas.map((p) => p.monto));
      setMontoActual(maxMonto);
    } else if (producto) {
      setMontoActual(producto.precioBase);
    }
  }, [pujas, producto]);

  useEffect(() => {
    if (!idProducto) return;
    fetchProduct(idProducto);
  }, [idProducto]);

  const updateProductStatus = async () => {
        if (!producto) return;
        try {
          await updateProduct(producto.id, {
            ...producto,
            duracion: 0,
            estado: "pasada",
          });
          setProducto((prev) =>
            prev ? { ...prev, duracion: 0, estado: "pasada" } : prev
          );
        } catch (error) {
          console.error("Error actualizando producto:", error);
        }
      };

  const updatedProduct = async (tiempo: number, producto: Product) => {
    try{
      await updateProduct(Number(idProducto), {
          ...producto,
          duracion: tiempo - 1,
        });
    }catch (error) {
      console.error("Error actualizando producto:", error);
    }
  }

  useEffect(() => {
    if (!producto || producto.estado !== "actual") return;

    if (tiempoRestante <= 0) {
      updateProductStatus();
      return;
    }

    const timer = setInterval(() => {
      setTiempoRestante((t) => (t > 0 ? t - 1 : 0));
      if (idProducto) {
        updatedProduct(tiempoRestante, producto);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [tiempoRestante, producto]);

  const getNombreUsuario = (usuarioId: string) => {
    const user = usuarios.find((u) => u.id === usuarioId);
    return user ? user.nombre : "Usuario desconocido";
  };

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

    try {
      const productoId = parseInt(idProducto || "0", 10);
      await createPuja({
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
    }
  };

  useEffect(() => {
    if (!idProducto) return;

    if (sseRef.current) {
      sseRef.current.close();
    }

    sseRef.current = new EventSource("http://localhost:3001/events");

    sseRef.current.onopen = () => {};

    sseRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.tipo === "nueva_puja" &&
          data.puja?.productoId === Number(idProducto)
        ) {
          setPuja(data.puja);
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
            {(!pujas || pujas.length === 0) && (
              <Typography>No hay pujas aún.</Typography>
            )}
            {pujas &&
              pujas.map((puja) => (
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
