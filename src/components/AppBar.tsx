import * as React from "react";
import { debounce } from "lodash";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import TemporaryDrawer from "./Drawer";
import { alpha, InputBase, styled } from "@mui/material";
import { useMap } from "@vis.gl/react-google-maps";
import { useContadoresSotre } from "../store/contdores";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
      },
    },
  },
}));

export default function LayoutComponentAppBar() {
  const map = useMap();
  const contadores = useContadoresSotre((store) => store.contadores);

  const handleSearch = React.useCallback(
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
  const debouncedHandleSearch = React.useMemo(
    () => debounce(handleSearch, 1000),
    [handleSearch],
  );

  // No olvides cancelar el debounce al desmontar el componente
  React.useEffect(() => {
    return () => {
      debouncedHandleSearch.cancel();
    };
  }, [debouncedHandleSearch]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="open drawer"
            sx={{ mr: 2 }}
          >
            <TemporaryDrawer />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            MUI
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ "aria-label": "search" }}
              onChange={(e) => debouncedHandleSearch(e.target.value)}
            />
          </Search>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
