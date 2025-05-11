import React, { useEffect, useState } from "react";
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
import { useContadoresSotre } from "./store/contdores";
import SimpleBottomNavigation from "./components/BottomNavigation";
import { Button } from "@mui/material";

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
        },
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
          // map?.setCenter(coords); // opcional: centra el mapa cada vez
        },
        (err) => {
          alert(`Geolocation error: ${err}`);
          console.error("Geolocation error:", err);
        },
        { enableHighAccuracy: true },
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
  const contadores = useContadoresSotre((store) => store.contadores);
  const fetchContadores = useContadoresSotre((store) => store.fetchContadores);

  useEffect(() => {
    if (contadores.length > 0) {
      null;
    } else {
      fetchContadores();
    }
  }, []);

  return (
    <APIProvider
      apiKey={"AIzaSyDby5GH_GFSCa7arcAO8nl_VJz37kd_S1w"}
      onLoad={() => console.log("Maps API has loaded.")}
    >
      <div style={{ height: "100dvh" }}>
        <Map
          id="map"
          defaultZoom={13}
          defaultCenter={{ lng: -1.073496, lat: 38.45369 }}
          onCameraChanged={(ev: MapCameraChangedEvent) => null}
          mapId="da37f3254c6a6d1c"
        >
          {/* <PanToCurrentLocationButton /> */}
          <UserLocationMarker />
          <ComponentPoiMarkers contadores={contadores} />
          <SimpleBottomNavigation />
        </Map>
      </div>
    </APIProvider>
  );
}

export default App;
