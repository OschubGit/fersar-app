import { useMap } from "@vis.gl/react-google-maps";
import { useState, useCallback, useEffect } from "react";

interface Location {
  lat: number;
  lng: number;
}

interface GeolocationOptions extends PositionOptions {}

export function useCurrentLocation(options?: GeolocationOptions) {
  const map = useMap();
  const [location, setLocation] = useState<Location | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          // map?.setCenter(pos);
          // map?.panTo(pos);
          setLocation(pos);
        },
        () => {
          alert("Error: The Geolocation service failed.");
        },
      );
    } else {
      alert("Error: Your browser doesn't support geolocation.");
    }
  }, []);

  const getLocation = () => {
    console.log("entra");
    if (location) {
      map?.setCenter(location);
      map?.panTo(location);
      console.log("location", location);
    }
  };

  return { location, error, loading, getLocation };
}
