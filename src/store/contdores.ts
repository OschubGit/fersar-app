import { create } from "zustand";
import { Contador, Contadores, FetchContadores, UltimaLectura } from "./types";
import { persist } from "zustand/middleware";

interface Params {
  zona_numero?: string;
  estado?: string;
}

interface State {
  isLoading: boolean;
  setLoading: (value: boolean) => void;
  isSuccess: boolean;
  setSuccess: (value: boolean) => void;
  contadores: FetchContadores[];
  fetchContadores: (params?: Params) => Promise<void>;
  postLectureById: (
    id: number,
    lectura: number,
    consumo: number
  ) => Promise<void>;
  checkCounter: (id: number) => Promise<void>;
  selectedCounter?: Contador;
  selectCounter: (counter: Contador) => void;
  errorsCounters: FetchContadores[];
  clearErrorsCounter: () => void;
  syncData: () => Promise<void>;
  downloadData: (params?: Params) => Promise<void>;
}

const options = {
  method: "GET",
  headers: {
    authorization: "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
  },
};

export const useContadoresSotre = create<State>()(
  persist(
    (set, get) => {
      return {
        isLoading: false,
        setLoading: (value) => set({ isLoading: value }),
        isSuccess: false,
        setSuccess: (value) => set({ isLoading: value }),
        contadores: [],
        errorsCounters: [],
        fetchContadores: async (params) => {
          const { setLoading, setSuccess } = get();
          const query = new URLSearchParams();

          if (params?.estado) query.append("estado", params.estado);
          if (params?.zona_numero)
            query.append("zona_numero", params.zona_numero);

          setLoading(true);
          const res = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores?${query.toString()}`,
            options
          );
          const contadores = await res.json();

          if (res.ok) {
            set({
              contadores: contadores.map((item: Contador, index) => ({
                ...item,
                position: {
                  lat: Number(item.latitud),
                  lng: Number(item.longitud),
                },
              })),
            });
            setSuccess(true);
            setLoading(false);
          } else {
            setSuccess(false);
            setLoading(false);
          }
        },
        postLectureById: async (id, lectura, consumo) => {
          const { contadores, checkCounter, errorsCounters } = get();

          const res = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${id}/lecturas`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization:
                  "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
              },
              body: new URLSearchParams({
                lectura: String(lectura),
                consumo: String(consumo),
              }),
            }
          );

          if (res.ok) {
            const newsContadores = structuredClone(contadores);
            const contadorIndex = newsContadores.findIndex((c) => c.id === id);

            if (contadorIndex !== -1) {
              // Si necesitas cambiar algo, hazlo aquí, por ejemplo:
              newsContadores[contadorIndex].estado = "REVISADO";

              set({
                contadores: newsContadores,
              });
              checkCounter(id);
            }
          } else {
            const errorContador = contadores.find((c) => c.id === id);
            const alreadyInErrors = errorsCounters.some((e) => e.id === id);

            if (errorContador && !alreadyInErrors) {
              const nuevaLectura: UltimaLectura = {
                id: id,
                contador_id: id,
                fecha: new Date().toISOString(),
                lectura,
                consumo,
              };

              // Añadir la lectura a la propiedad `ultima_lectura`
              const contadorConLectura = {
                ...errorContador,
                err_ultima_lectura: nuevaLectura,
              };
              console.log(contadorConLectura);
              set({
                errorsCounters: [...errorsCounters, contadorConLectura],
              });
            }
            console.log("error");
          }
        },
        checkCounter: async (id) => {
          const res = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${String(
              id
            )}/revisado`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization:
                  "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
              },
            }
          );
        },
        selectCounter: (counter) => {
          set({ selectedCounter: counter });
        },
        clearErrorsCounter: () => {
          set({ errorsCounters: [] });
        },
        syncData: async () => {
          set({ contadores: [] });
          await get().fetchContadores();
        },
        downloadData: async (params) => {
          const { setLoading, setSuccess } = get();
          const query = new URLSearchParams();

          if (params?.estado) query.append("estado", params.estado);
          if (params?.zona_numero)
            query.append("zona_numero", params.zona_numero);

          setLoading(true);
          const res = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores?${query.toString()}`,
            options
          );
          const data = await res.json();
          if (res.ok) {
            setSuccess(true);
            setLoading(false);
            return data;
          } else {
            setSuccess(false);
            setLoading(false);
          }
        },
      };
    },
    {
      name: "contadores",
    }
  )
);
