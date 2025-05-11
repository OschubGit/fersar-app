import React from "react";
import { useContadoresSotre } from "./store/contdores";
import dayjs from "dayjs";
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import SimpleBottomNavigation from "./components/BottomNavigation";

function Errores() {
  const errorsCounters = useContadoresSotre((store) => store.errorsCounters);
  const clearErrorsCounter = useContadoresSotre(
    (store) => store.clearErrorsCounter,
  );

  if (!errorsCounters || errorsCounters.length === 0) {
    return (
      <>
        <Box p={2}>
          <p>No hay errores</p>
        </Box>
        <SimpleBottomNavigation />
      </>
    );
  }

  return (
    <>
      <Box p={2}>
        <Typography variant="h3">Errores de lectua</Typography>
        <Typography variant="body1">
          Esto es un registro de los errores que no se han guardado en base de
          datos.
        </Typography>
        <Button variant="contained" onClick={clearErrorsCounter}>
          Limpiar errores
        </Button>
        <TableContainer component={Paper} sx={{ mt: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Número de contador</TableCell>
                <TableCell>Fecha del error</TableCell>
                <TableCell align="right">Lectura</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {errorsCounters?.length > 0 ? (
                errorsCounters.map((row) => (
                  <TableRow
                    key={row.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.id}
                    </TableCell>
                    <TableCell>
                      {row.err_ultima_lectura?.fecha
                        ? dayjs(row.err_ultima_lectura.fecha).format(
                            "DD/MM/YYYY",
                          )
                        : "-"}
                    </TableCell>
                    <TableCell align="right">
                      {row.err_ultima_lectura?.lectura ?? "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No hay errores
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <SimpleBottomNavigation />
    </>
  );
}

export default Errores;
