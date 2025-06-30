import type { User } from "./User";

export interface Product {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  precioBase: number;
  duracion: number;
  estado: "actual" | "proxima" | "pasada";
  pujas?: {
    id: number;
    usuario: User;
    monto: number;
    fecha: string;
  }[];
}