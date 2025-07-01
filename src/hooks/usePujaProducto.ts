import { useEffect, useRef, useState } from "react";
import { getProductById, updateProduct } from "../services/productService";
import { getUsuarios } from "../services/authService";
import { usePujasStore } from "../store/pujasStore";
import type { Product } from "../interfaces/Product";
import type { User } from "../interfaces/User";

export const usePujaProducto = (idProducto?: string) => {
  const [producto, setProducto] = useState<Product | null>(null);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [tiempoVisible, setTiempoVisible] = useState<number>(0);
  const tiempoRef = useRef<number>(0);
  const sseRef = useRef<EventSource | null>(null);

  const {
    pujas,
    loading,
    fetchPujas,
    setPuja: setPujaStore,
    createPuja,
  } = usePujasStore();

  const fetchProduct = async (id: string) => {
    try {
      const p = await getProductById(id);
      await fetchPujas(id);
      const u = await getUsuarios();
      setUsuarios(u);
      setProducto(p);
      tiempoRef.current = p.duracion > 0 ? p.duracion : 0;
      setTiempoVisible(tiempoRef.current);
    } catch (err) {
      console.error("Error al obtener producto:", err);
    }
  };

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
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const updatedProduct = async (tiempo: number) => {
    if (!producto || !idProducto) return;
    try {
      await updateProduct(Number(idProducto), {
        ...producto,
        duracion: tiempo,
      });
    } catch (err) {
      console.error("Error al decrementar tiempo:", err);
    }
  };

  const getNombreUsuario = (id: string) =>
    usuarios.find((u) => u.id === id)?.nombre || "Usuario desconocido";

  useEffect(() => {
    if (!idProducto) return;
    fetchProduct(idProducto);
  }, [idProducto]);

  useEffect(() => {
    if (!producto || producto.estado !== "actual") return;

    const interval = setInterval(() => {
      if (tiempoRef.current <= 0) {
        clearInterval(interval);
        updateProductStatus();
        return;
      }

      tiempoRef.current -= 1;
      setTiempoVisible(tiempoRef.current);
      updatedProduct(tiempoRef.current);
    }, 1000);

    return () => clearInterval(interval);
  }, [producto]);

  useEffect(() => {
    if (!idProducto) return;

    if (sseRef.current) {
      sseRef.current.close();
    }

    sseRef.current = new EventSource("http://localhost:3001/events");

    sseRef.current.onopen = () => {console.log("Conexión SSE abierta");};

    sseRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Nueva puja recibida:", data);
        if (
          data.tipo === "nueva_puja" &&
          data.puja?.productoId === Number(idProducto)
        ) {
            console.log("Puja recibida:", data.puja);
          setPujaStore(data.puja);
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

  return {
    producto,
    usuarios,
    tiempoRestante: tiempoVisible,
    pujas,
    loading,
    createPuja,
    getNombreUsuario,
    setProducto,
  };
};
