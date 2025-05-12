import React from "react";
import { AdvancedMarker, useMap } from "@vis.gl/react-google-maps";

export default function UserLocationMarker() {
  const [position, setPosition] = React.useState<any>(null);
  const map = useMap();

  React.useEffect(() => {
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
