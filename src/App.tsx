import React, { useEffect, useState, useMemo, useCallback } from "react";
import "./App.css";

import {
  APIProvider,
  Map,
  useMap,
  AdvancedMarker,
  MapCameraChangedEvent,
  Pin,
} from "@vis.gl/react-google-maps";
import type { Marker } from "@googlemaps/markerclusterer";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import ComponentPoiMarkers from "./components/PoiMarkers";
import { CustomModal } from "./components/Modal";
import { MantineModal } from "./components/MantineModal";
import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

function App() {
  const [updateData, setUpdateData] = useState(false);
  const [data, setData] = useState([]);
  const url = "https://ouhy3iu4hy34y34hy3hy.rubenrc.dev/api/contadores";
  const options = {
    method: "GET",
    headers: {
      authorization:
        "Bearer 2|QbbPfKjLHwTMOixGeMdn8Vkwpg7Ke0iXEG954tENe60b5370",
    },
  };

  const fetchurl = async () => {
    try {
      const response = await fetch(url, options);
      const rawData = await response.json();
      const setResult = rawData
        .filter((f) => f.latitud !== null)
        .map((m) => ({
          key: m.id,
          location: { lat: Number(m.longitud), lng: Number(m.latitud) },
          data: {
            nombre_completo: m.nombre_completo,
            parcela: m.parcela,
            poligono: m.poligono,
            zona: m.zona,
            zona_numero: m.zona_numero,
            estado: m.estado,
          },
          estado: m.estado,
        }));

      setData(setResult);
      window?.localStorage.setItem("data", JSON.stringify(setResult));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const isDataInLocalStorage = window?.localStorage.getItem("data");
    if (isDataInLocalStorage) {
      setData(JSON.parse(isDataInLocalStorage));
    } else {
      fetchurl();
    }
  }, [updateData]);

  useEffect(() => {
    const handleStorageChange = () => {
      const updated = window.localStorage.getItem("data");
      if (updated) {
        setData(JSON.parse(updated));
      }
    };

    window.addEventListener("localStorageUpdated", handleStorageChange);
    return () =>
      window.removeEventListener("localStorageUpdated", handleStorageChange);
  }, []);

  return (
    <APIProvider
      apiKey={"AIzaSyDby5GH_GFSCa7arcAO8nl_VJz37kd_S1w"}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <MantineProvider>
        <div style={{ height: "100vh" }}>
          <Map
            defaultZoom={13}
            defaultCenter={{ lng: -1.073496, lat: 38.45369 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => null}
            mapId="da37f3254c6a6d1c"
          >
            <ComponentPoiMarkers
              action={() => setUpdateData(!updateData)}
              data={data}
            />
          </Map>
        </div>
      </MantineProvider>
    </APIProvider>
  );
}

export default App;
