import jsonServerInstance from "../api/jsonServerInstance";

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
    const response = await jsonServerInstance.get(`/productos`,{
      params: {
        id: id
      }
    });
    return response.data[0];
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};