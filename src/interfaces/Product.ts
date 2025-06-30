export interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  precioBase: number;
  duracion: number;
  estado: "actual" | "proxima" | "pasada";
}