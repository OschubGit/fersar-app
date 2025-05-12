import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContadoresSotre } from "../store/contdores";

export default function DialogDownloadData({
  open,
  onClose,
  handleAction,
}: {
  open: boolean;
  onClose: () => void;
  handleAction: (value: boolean) => void;
}) {
  const isLoading = useContadoresSotre((state) => state.isLoading);

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Descargar datos"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            ¿Quieres descargar todos los datos o solo los revisados?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={() => handleAction(false)}>
            Descargar todos
          </Button>
          <Button
            disabled={isLoading}
            onClick={() => handleAction(true)}
            autoFocus
          >
            Descargar revisados
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
