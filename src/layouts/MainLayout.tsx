import React, { useState, useEffect } from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
  useMap,
} from "@vis.gl/react-google-maps";
import { Outlet } from "react-router";
import SimpleBottomNavigation from "../components/BottomNavigation";
import LayoutComponentAppBar from "../components/AppBar";
import { IconButton } from "@mui/material";
import NavigationIcon from "@mui/icons-material/Navigation";

function RotationControl() {
  const map = useMap();
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    if (!map) return;

    let watchId: number;

    if (isRotating) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          if (position.coords.heading !== null) {
            map.setHeading(position.coords.heading);
          }
        },
        (error) => {
          console.error("Error getting heading:", error);
        },
        {
          enableHighAccuracy: true,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [map, isRotating]);

  return (
    <IconButton
      onClick={() => setIsRotating(!isRotating)}
      sx={{
        position: "absolute",
        right: 16,
        bottom: 80,
        backgroundColor: "white",
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.9)",
        },
        zIndex: 1000,
      }}
    >
      <NavigationIcon color={isRotating ? "primary" : "action"} />
    </IconButton>
  );
}

export default function MainLayout({ children }: any) {
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
          gestureHandling="greedy"
          tilt={45}
          rotateControl={true}
          fullscreenControl={false}
          streetViewControl={false}
          mapTypeControl={true}
          zoomControl={true}
          scrollwheel={true}
          draggable={true}
          keyboardShortcuts={true}
          disableDoubleClickZoom={false}
          draggableCursor="grab"
          draggingCursor="grabbing"
          maxZoom={20}
          minZoom={3}
        >
          <LayoutComponentAppBar />
          {children}
          <SimpleBottomNavigation />
          <RotationControl />
        </Map>
      </div>
    </APIProvider>
  );
}
