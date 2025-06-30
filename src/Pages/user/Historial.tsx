import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

import type { Puja } from "../../interfaces/Pujas";
import type { Product } from "../../interfaces/Product";
import { getPujas } from "../../services/pujasService";
import { getProducts } from "../../services/productService";
import { useUser } from "../../context/UserContext";

const HistorialPage = () => {
  const [pujas, setPujas] = useState<Puja[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const allPujas = await getPujas();
      const allProductos = await getProducts();

      setPujas(allPujas);
      setProductos(allProductos);
    };
    fetchData();
  }, []);

  const getProductoNombre = (idProducto: number) => {
    const producto = productos.find((p) => p.id === idProducto);
    return producto ? producto.titulo : "Producto desconocido";
  };

  const pujasUsuario = pujas.filter((puja) => puja.usuarioId === user?.id);

  const pujasAgrupadas = productos
    .map((producto) => {
      const pujasProducto = pujas.filter((p) => p.productoId === producto.id);
      if (pujasProducto.length === 0) return null;

      const ganador = pujasProducto.reduce(
        (max, p) => (p.monto > max.monto ? p : max),
        pujasProducto[0]
      );
      const usuarioGano = ganador.usuarioId === user?.id;

      return {
        producto,
        pujas: pujasProducto,
        ganador,
        usuarioGano,
      };
    })
    .filter(Boolean) as {
    producto: Product;
    pujas: Puja[];
    ganador: Puja;
    usuarioGano: boolean;
  }[];

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Historial de Subastas
      </Typography>

      {pujasAgrupadas.map(({ producto, pujas, ganador, usuarioGano }) => (
        <Card key={producto.id} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6">{producto.titulo}</Typography>
            <Typography color="text.secondary">
              <strong>Ganador:</strong> Usuario {ganador.usuarioId} con ${ganador.monto}
            </Typography>
            <Typography color="text.secondary">
              <strong>¿Ganaste?</strong> {usuarioGano ? "Sí" : "No"}
            </Typography>

            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Usuario</strong></TableCell>
                  <TableCell><strong>Monto</strong></TableCell>
                  <TableCell><strong>Fecha</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pujas.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.usuarioId}</TableCell>
                    <TableCell>${p.monto}</TableCell>
                    <TableCell>{new Date(p.fecha).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}

      <Typography variant="h5" gutterBottom sx={{ mt: 4 }}>
        Mis Ofertas Realizadas
      </Typography>
      <List>
        {pujasUsuario.map((p) => (
          <div key={p.id}>
            <ListItem>
              <ListItemText
                primary={`${getProductoNombre(p.productoId)} - $${p.monto}`}
                secondary={new Date(p.fecha).toLocaleString()}
              />
            </ListItem>
            <Divider />
          </div>
        ))}
      </List>
    </Box>
  );
};

export default HistorialPage;
