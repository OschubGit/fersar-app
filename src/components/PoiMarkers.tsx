import React, { useState } from "react";
import { useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { MantineModal } from "./MantineModal";
import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Drawer,
  Input,
  Loader,
  NumberInput,
  Stack,
  Text,
} from "@mantine/core";
import { MantineDrawer } from "./MantineDrawer";
import useNetworkInfo from "../hooks/useIntensity";

type Poi = {
  key: string;
  location: google.maps.LatLngLiteral;
  estado: "POR_REVISAR" | "REVISADO";
};
const ComponentPoiMarkers = ({
  data,
  action,
}: {
  data: Poi[];
  action: (val: boolean) => void;
}): React.ReactNode => {
  const [lectures, setLectures] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<number | null>();
  const options = {
    method: "GET",
    headers: {
      authorization:
        "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
    },
  };
  const optionsPostLecture = {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
      authorization:
        "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
    },
    body: JSON.stringify({ lectura: Number(value), consumo: Number(value) }),
  };
  const map = useMap();
  const [opened, { open, close }] = useDisclosure(false);
  const [currentCounter, setCurrentCounter] = useState<any>();

  const handleClick = useCallback(
    (poi: Poi, ev: google.maps.MapMouseEvent | null = null) => {
      const getLecture = async () => {
        try {
          const response = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${poi.key}/lecturas`,
            options
          );
          const rawData = await response.json();
          setLectures(rawData);
          if (!map) return;
          const latLng =
            ev?.latLng ||
            new google.maps.LatLng(poi.location.lat, poi.location.lng);
          map.panTo(latLng);
          map?.setZoom(16); // Aquí defines el nivel de zoom al buscar
          open();
        } catch (error) {
          console.log(error);
        }
      };
      getLecture();
    },
    []
  );

  const handleSearch = useCallback(
    (id) => {
      map?.setZoom(13); // Aquí defines el nivel de zoom al buscar
      const getById = data?.find((f) => Number(f.key) === Number(id));
      if (!getById) return;

      const latLng = new google.maps.LatLng(
        Number(getById.location.lat),
        Number(getById.location.lng)
      );

      map?.panTo(latLng);
      map?.setZoom(20); // Aquí defines el nivel de zoom al buscar
    },
    [data, map]
  );

  const handleSaveLecture = () => {
    setLoading(true);
    if (value) {
      const postLecture = async () => {
        try {
          const res = await fetch(
            `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${String(
              lectures?.[0].contador_id
            )}/lecturas`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                authorization:
                  "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
              },
              body: new URLSearchParams({
                lectura: Number(value),
                consumo: Number(value),
              }),
            }
          );
          const contador = await res.json();
          if (res.ok) {
            setCurrentCounter(contador);
            setValue(null);
            setLoading(false);
          }
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      };
      postLecture();
    }
  };

  // Debounce de 500ms
  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 1000),
    [handleSearch]
  );

  // No olvides cancelar el debounce al desmontar el componente
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const createGlyphElement = (poi) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong style="color:white;font-size:8px">${poi?.key}</strong>`;
    return div;
  };

  const handleChecked = async () => {
    if (currentCounter) {
      try {
        const res2 = await fetch(
          `https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores/${String(
            currentCounter.contador_id
          )}/revisado`,
          {
            method: "POST",
            headers: {
              authorization:
                "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
            },
          }
        );
        if (res2.ok) {
          // Obtener los datos del localStorage
          const storedData = JSON.parse(
            window.localStorage.getItem("data") || "[]"
          );

          // Buscar el item que tenga el mismo id
          const updatedData = storedData.map((item) => {
            if (item.key === currentCounter.contador_id) {
              return {
                ...item,
                estado: item.estado === "REVISADO" ? "POR_REVISAR" : "REVISADO",
              };
            }
            return item;
          });

          window.localStorage.setItem("data", JSON.stringify(updatedData));
          setLoading(false);
          close();
          action(true);
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
  };

  // In your component:
  const networkInfo = useNetworkInfo();

  return (
    <>
      <Input
        name="search"
        placeholder="Buscar por número de contador"
        style={{
          position: "absolute",
          top: "70px",
          left: "12px",
          right: "12px",
          zIndex: 100,
        }}
        type="text"
        onChange={(e) => debouncedHandleSearch(e.target.value)}
      />
      {data?.map((poi: Poi) => (
        <AdvancedMarker
          key={poi.key}
          position={poi.location}
          clickable={true}
          title={String(poi.key)}
          onClick={(ev) => handleClick(poi, ev)}
        >
          <Pin
            background={poi.estado === "REVISADO" ? "#82b36b" : "#0c0078"}
            glyph={createGlyphElement(poi)}
            glyphColor={"#fff"}
            borderColor={"#000000"}
            scale={1}
          />
        </AdvancedMarker>
      ))}
      <MantineDrawer open={opened} close={close}>
        <Stack
          bg="var(--mantine-color-body)"
          align="stretch"
          justify="center"
          gap="md"
        >
          <NumberInput
            value={value ?? undefined}
            onChange={setValue}
            disabled={loading}
          />
          <Button onClick={() => handleSaveLecture()} disabled={loading}>
            {loading ? <Loader color="#0c0078" /> : "Guardar lectura"}
          </Button>
          <Text size="md">Ultimas lecturas:</Text>
          <ul>
            {lectures?.map((m, index) => (
              <li key={index}>
                {m.fecha}: {m.consumo ?? "Sin consumo establecido"}
              </li>
            ))}
          </ul>
          {currentCounter && (
            <Button onClick={() => handleChecked()} disabled={!currentCounter}>
              {dayjs(currentCounter.fecha).isSame(dayjs(), "day")
                ? "Cambiar a No revisado"
                : "Cambiar a revisado"}
            </Button>
          )}
        </Stack>
      </MantineDrawer>
    </>
  );
};

export default ComponentPoiMarkers;
