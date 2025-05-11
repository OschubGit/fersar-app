import React, { useRef, useState } from "react";
import { useMap, AdvancedMarker, Pin } from "@vis.gl/react-google-maps";
import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { Marker, MarkerClusterer } from "@googlemaps/markerclusterer";
import { useContadoresSotre } from "../store/contdores";
import { Contador, ContadorData, FetchContadores } from "../store/types";
import BasicModal from "./Modal";
import { TextField } from "@mui/material";

const ComponentPoiMarkers = ({
  contadores,
}: {
  contadores: FetchContadores[];
}): React.ReactNode => {
  const selectCounter = useContadoresSotre((state) => state.selectCounter);
  const map = useMap();
  const [open, setOpen] = React.useState(false);
  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});
  const clusterer = useRef<MarkerClusterer | null>(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleClick = useCallback(
    (poi: Contador, ev: google.maps.MapMouseEvent | null = null) => {
      selectCounter(poi);
      handleOpen();
    },
    [],
  );

  const handleSearch = useCallback(
    (id) => {
      map?.setZoom(13); // Aquí defines el nivel de zoom al buscar
      const getById = contadores?.find((f) => Number(f.id) === Number(id));
      console.log(getById);
      if (!getById) return;

      map?.panTo({
        lat: Number(getById.longitud),
        lng: Number(getById.latitud),
      });
      map?.setZoom(20); // Aquí defines el nivel de zoom al buscar
    },
    [contadores, map],
  );

  // Debounce de 500ms
  const debouncedHandleSearch = useMemo(
    () => debounce(handleSearch, 1000),
    [handleSearch],
  );

  // No olvides cancelar el debounce al desmontar el componente
  useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  const createGlyphElement = (poi) => {
    const div = document.createElement("div");
    div.innerHTML = `<strong style="color:white;font-size:8px">${poi?.id}</strong>`;
    return div;
  };

  // Initialize MarkerClusterer, if the map has changed
  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return (
    <>
      <TextField
        name="search"
        placeholder="Buscar por número de contador"
        sx={{
          position: "absolute",
          top: "70px",
          left: "12px",
          right: "12px",
          zIndex: 100,
          backgroundColor: "#fff",
          opacity: 1,
        }}
        variant="filled"
        type="text"
        onChange={(e) => debouncedHandleSearch(e.target.value)}
      />
      {contadores.map((poi: Contador) => (
        <AdvancedMarker
          key={poi.id}
          ref={(marker) => setMarkerRef(marker, String(poi.id))}
          position={{ lat: poi.position.lat, lng: poi.position.lng }}
          clickable={true}
          title={String(poi.id)}
          onClick={(ev) => handleClick(poi, ev)}
          /* onClick={() => selectCounter(poi)} */
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
      <BasicModal open={open} onClose={handleClose} />
    </>
  );
};

export default ComponentPoiMarkers;
