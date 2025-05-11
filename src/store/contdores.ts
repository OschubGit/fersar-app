import { create } from "zustand";
import { Contador, Contadores, FetchContadores, UltimaLectura } from "./types";
import { persist } from "zustand/middleware";

interface State {
  contadores: FetchContadores[];
  fetchContadores: () => Promise<void>;
  postLectureById: (
    id: number,
    lectura: number,
    consumo: number,
  ) => Promise<void>;
  checkCounter: (id: number) => Promise<void>;
  selectedCounter?: Contador;
  selectCounter: (counter: Contador) => void;
  errorsCounters: FetchContadores[];
  clearErrorsCounter: () => void;
}

const url = "https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores";
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
        contadores: [],
        errorsCounters: [],
        fetchContadores: async () => {
          const res = await fetch(url, options);
          const contadores = await res.json();

          set({
            contadores: contadores.map((item: Contador, index) => ({
              ...item,
              position: {
                lat: Number(item.longitud),
                lng: Number(item.latitud),
              },
            })),
          });
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
            },
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
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${String(id)}/revisado`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization:
                  "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
              },
            },
          );
        },
        selectCounter: (counter) => {
          set({ selectedCounter: counter });
        },
        clearErrorsCounter: () => {
          set({ errorsCounters: [] });
        },
      };
    },
    {
      name: "contadores",
    },
  ),
);
