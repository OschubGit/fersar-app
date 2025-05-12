import React, { useEffect, useState } from "react";
import "./App.css";
import ComponentPoiMarkers from "./components/PoiMarkers";
import { useContadoresSotre } from "./store/contdores";
import { Button } from "@mui/material";
import LoadingComponent from "./components/LoadingComponent";
import UserLocationMarker from "./components/UserLocationMaker";
import MainLayout from "./layouts/MainLayout";

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

function App() {
  const contadores = useContadoresSotre((store) => store.contadores);
  const fetchContadores = useContadoresSotre((store) => store.fetchContadores);
  const { isLoading } = useContadoresSotre((store) => store);

  useEffect(() => {
    if (contadores.length > 0) {
      null;
    } else {
      fetchContadores();
    }
  }, []);

  return (
    <MainLayout>
      {isLoading && <LoadingComponent />}
      <UserLocationMarker />
      <ComponentPoiMarkers contadores={contadores} />
    </MainLayout>
  );
}

export default App;
