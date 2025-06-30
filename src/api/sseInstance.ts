import axios from "axios";

export const sseInstance = axios.create({
  baseURL: "http://localhost:3001", // SSE backend
});