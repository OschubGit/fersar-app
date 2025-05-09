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
import ComponentPoiMarkers from "./components/PoiMarkers";
import { Button, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";

function PanToCurrentLocationButton() {
  const map = useMap(); // accede al mapa actual

  const handleClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map?.setCenter(pos);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        }
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  };

  return (
    <Button
      style={{ position: "absolute", top: 10, left: 10, zIndex: 1000 }}
      onClick={handleClick}
    >
      Pan to Current Location
    </Button>
  );
}

function UserLocationMarker() {
  const [position, setPosition] = useState<any>(null);
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(coords);
          /* map?.setCenter(coords); */ // opcional: centra el mapa cada vez
        },
        (err) => {
          alert(`Geolocation error: ${err}`);
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      alert(`Your browser doesn't support geolocation.`);
      console.error("Your browser doesn't support geolocation.");
    }
  }, [map]);

  if (!position) return null;

  return (
    <AdvancedMarker position={position}>
      <svg width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="#4285f4" opacity="0.6" />
        <circle cx="12" cy="12" r="6" fill="#4285f4" opacity="1" />
        <circle cx="12" cy="12" r="2" fill="#72a6f9" />
      </svg>
    </AdvancedMarker>
  );
}

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
            id="map"
            defaultZoom={13}
            defaultCenter={{ lng: -1.073496, lat: 38.45369 }}
            onCameraChanged={(ev: MapCameraChangedEvent) => null}
            mapId="da37f3254c6a6d1c"
          >
            <UserLocationMarker />
            {/* <PanToCurrentLocationButton /> */}
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
