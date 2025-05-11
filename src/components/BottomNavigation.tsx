import * as React from "react";
import Box from "@mui/material/Box";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import RestoreIcon from "@mui/icons-material/Restore";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useCurrentLocation } from "../hooks/useCurrentLocation";
import { useMap } from "@vis.gl/react-google-maps";
import { Badge } from "@mui/material";
import { useContadoresSotre } from "../store/contdores";
import MapIcon from "@mui/icons-material/Map";
import { useNavigate } from "react-router";

const style = {
  position: "fixed",
  bottom: "0",
  minWidth: "100%",
};

export default function SimpleBottomNavigation() {
  const { errorsCounters } = useContadoresSotre((store) => store);
  const [value, setValue] = React.useState(0);
  const { getLocation } = useCurrentLocation();
  let navigate = useNavigate();

  return (
    <Box sx={style}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Errores"
          onClick={() => navigate("/errores")}
          icon={
            <Badge badgeContent={errorsCounters.length} color="error">
              <WarningAmberIcon />
            </Badge>
          }
        />
        <BottomNavigationAction
          onClick={() => navigate("/")}
          label="Mapa"
          icon={<MapIcon />}
        />
        <BottomNavigationAction
          label="Mi ubicación"
          onClick={() => getLocation()}
          icon={<LocationOnIcon />}
        />
      </BottomNavigation>
    </Box>
  );
}
