import jsonServerInstance from "../api/jsonServerInstance";
import type { Product } from "../interfaces/Product";

export const getProducts = async () => {
  try {
    const response = await jsonServerInstance.get("/productos");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const getProductById = async (id: string) => {
  try {
    const response = await jsonServerInstance.get(`/productos`, {
      params: { id },
    });
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

export const createProduct = async (product: Product) => {
  const productos = await getProducts();

  const maxId = productos.length > 0 ? Math.max(...productos.map((p: Product) => p.id)) : 0;

  const nuevoProducto = { ...product, id: maxId + 1 };

  const response = await jsonServerInstance.post("/productos", nuevoProducto);
  return response.data;
};

export const updateProduct = async (id: number, product: Product) => {
  try {
    const response = await jsonServerInstance.put(`/productos/${id}`, product);
    return response.data;
  } catch (error) {
    console.error(`Error updating product with id ${id}:`, error);
    throw error;
  }
};

export const deleteProduct = async (id: number) => {
  try {
        const existingProduct = await getProductById(id.toString());
    console.log(existingProduct);
    await jsonServerInstance.delete(`/productos/${id}`);
  } catch (error) {
    console.error(`Error deleting product with id ${id}:`, error);
    throw error;
  }
};
