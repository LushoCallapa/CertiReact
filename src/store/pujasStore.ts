import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Puja } from "../interfaces/Pujas";
import { getPujasByProducto, postPuja } from "../services/pujasService";

interface PujasStore {
  pujas: Puja[];
  loading: boolean;
  error: string | null;

  fetchPujas: (productoId: string) => void;
  createPuja: (puja: Puja) => void;
  setPuja: (puja: Puja) => void;
  setPujas: (pujas: Puja[]) => void;
}

export const usePujasStore = create<PujasStore>()(
  persist(
    (set) => ({
      pujas: [],
      loading: false,
      error: null,

      fetchPujas: async (productoId) => {
        set({ loading: true, error: null });
        try {
          const pujas = await getPujasByProducto(productoId);
          const pujasOrdenadas = pujas.sort((a, b) => b.monto - a.monto);
          set({ pujas: pujasOrdenadas, loading: false });
        } catch (error: any) {
          set({
            error: error.message || "Error fetching pujas",
            loading: false,
          });
        }
      },

      createPuja: async (puja) => {
        set({ loading: true, error: null });
        try {
          await postPuja(puja);
          set(() => ({
            loading: false,
          }));
        } catch (error: any) {
          set({
            error: error.message || "Error creating puja",
            loading: false,
          });
        }
      },

      setPujas: (pujas) => set({ pujas }),
      setPuja: (nuevaPuja) => {
        set((state) => {
          const yaExiste = state.pujas.some((p) => p.id === nuevaPuja.id);
          if (yaExiste) return state;
          return {
            pujas: [nuevaPuja, ...state.pujas],
          };
        });
      },
    }),
    {
      name: "pujas-storage",
    }
  )
);
