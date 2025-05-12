import React, { useState } from "react";
import { Button, ListItem, ListItemButton } from "@mui/material";
import { useContadoresSotre } from "../store/contdores";

export const Filters = () => {
  const fetchContadores = useContadoresSotre((store) => store.fetchContadores);
  const [isRevised, setIsRevised] = useState(false);

  return (
    <>
      <ListItem>
        <ListItemButton>
          <Button variant="outlined" onClick={() => fetchContadores()}>
            Limpiar Filtros
          </Button>
        </ListItemButton>
      </ListItem>

      <ListItem>
        <ListItemButton>
          <Button
            variant="outlined"
            onClick={() => fetchContadores({ zona_numero: "1" })}
          >
            Zona numero 1
          </Button>
        </ListItemButton>
      </ListItem>
    </>
  );
};
