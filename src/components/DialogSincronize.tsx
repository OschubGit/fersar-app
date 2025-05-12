import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useContadoresSotre } from "../store/contdores";

export default function DialogSincronizeData({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const syncData = useContadoresSotre((state) => state.syncData);
  const isLoading = useContadoresSotre((state) => state.isLoading);
  const isSuccess = useContadoresSotre((state) => state.isSuccess);

  const handleAction = async () => {
    await syncData();
    onClose();
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Sincronizar datos"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Al sincronizar se actualizará el mapa con los datos más recientes.
            ¿Estás seguro?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button disabled={isLoading} onClick={onClose}>
            Cancelar
          </Button>
          <Button disabled={isLoading} onClick={handleAction} autoFocus>
            Sincronizar ahora
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
