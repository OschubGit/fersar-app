import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useContadoresSotre } from "../store/contdores";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  minWidth: 600,
  bgcolor: "background.paper",
  border: "1px solid #d8d8d8",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
  // Media query con breakpoints de MUI
  "@media (max-width:768px)": {
    minWidth: "93.33%",
    p: 2,
  },
};

const styleClose = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  cursor: "pointer",
};

export default function BasicModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selectedCounter, postLectureById } = useContadoresSotre(
    (store) => store,
  );
  const [value, setValue] = useState<number>("");
  return (
    <div>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            color="textPrimary"
            variant="h6"
            component="h2"
          >
            {selectedCounter?.id} - {selectedCounter?.nombre_completo}
          </Typography>
          <Typography
            variant="body2"
            color="error"
            sx={styleClose}
            onClick={onClose}
          >
            X Cerrar
          </Typography>
          <Box>
            <Typography
              variant="body1"
              id="modal-modal-description"
              sx={{ mt: 2 }}
              color="textPrimary"
            >
              Introduce el valor correspondiente a este contador.
            </Typography>
          </Box>
          <TextField
            type="number"
            size="medium"
            variant="filled"
            fullWidth
            placeholder="Escribe la lectura del contador"
            onChange={(e) => setValue(Number(e.target.value))}
            sx={{ mt: 2, mb: 5 }}
          />
          <Button
            variant="contained"
            onClick={() =>
              postLectureById(Number(selectedCounter?.id), value, value)
            }
          >
            Revisar Contador {selectedCounter?.id}
          </Button>
        </Box>
      </Modal>
    </div>
  );
}
