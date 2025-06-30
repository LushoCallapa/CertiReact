import jsonServerInstance from "../api/jsonServerInstance";
import { v4 as uuidv4 } from "uuid";
import type { User } from "../interfaces/User";

export const login = async (nombre: string, password: string) => {
  const res = await jsonServerInstance.get(`/usuarios?nombre=${nombre}&password=${password}`);
  if (res.data.length > 0) return res.data[0];
  throw new Error("Credenciales incorrectas");
};

export const register = async ( nombre: string, password: string, rol: string ) => {
  const check = await jsonServerInstance.get(`/usuarios?nombre=${nombre}`);
  if (check.data.length > 0) {
    throw new Error("Nombre de usuario ya existe");
  }

  const nuevoUsuario = {
    id: uuidv4(),
    nombre,
    password,
    rol
  };

  await jsonServerInstance.post("/usuarios", nuevoUsuario);
  return nuevoUsuario;
};

export const getUsuarios = async () => {
  const response = await jsonServerInstance.get<User[]>(`/usuarios`);
  return response.data;
};