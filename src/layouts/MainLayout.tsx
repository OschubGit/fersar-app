import React from "react";
import {
  APIProvider,
  Map,
  MapCameraChangedEvent,
} from "@vis.gl/react-google-maps";
import { Outlet } from "react-router";
import SimpleBottomNavigation from "../components/BottomNavigation";
import LayoutComponentAppBar from "../components/AppBar";

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
        >
          <LayoutComponentAppBar />
          {children}
          <SimpleBottomNavigation />
        </Map>
      </div>
    </APIProvider>
  );
}
