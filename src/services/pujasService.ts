import jsonServerInstance from "../api/jsonServerInstance";
import type { Puja } from "../interfaces/Pujas";
import { sseInstance } from "../api/sseInstance";

export const getPujasByProducto = async (productoId: string)=> {
  try {
    const response = await jsonServerInstance.get<Puja[]>(`/pujas?idProducto=${productoId}&_sort=monto&_order=asc`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching pujas for productoId ${productoId}:`, error);
    throw error;
  }
};



export const getPujas = async ()=> {
  const response = await jsonServerInstance.get<Puja[]>("/pujas");
  return response.data;
};

export const postPuja = async (puja: Puja) => {
  const pujas = await getPujas();
  const maxId = pujas.reduce((max, p) => (p.id > max ? p.id : max), 0);

  const pujaConId = { ...puja, id: maxId + 1 };

  const response = await jsonServerInstance.post<Puja>("/pujas", pujaConId);
  await sseInstance.post("/pujas", pujaConId);

  return response.data;
};
