import React, { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Divider, TextField } from "@mui/material";
import { useContadoresSotre } from "../store/contdores";
import CloseIcon from "@mui/icons-material/Close";

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
    width: "85.33%",
    minWidth: "85.33%",
    p: 2,
  },
};

const styleClose = {
  position: "absolute",
  top: "1rem",
  right: "1rem",
  cursor: "pointer",
  color: "black",
};

export default function BasicModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { selectedCounter, postLectureById, checkCounter } = useContadoresSotre(
    (store) => store,
  );
  const [value, setValue] = useState<string>("");

  const handlePostLecture = () => {
    postLectureById(Number(selectedCounter?.id), Number(value), Number(value));
    setValue("");
    onClose();
  };
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
          <CloseIcon onClick={onClose} sx={styleClose} />
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
            onChange={(e) => setValue(e.target.value)}
            sx={{ mt: 2, mb: 5 }}
          />
          <Button variant="contained" onClick={() => handlePostLecture()}>
            Revisar Contador {selectedCounter?.id}
          </Button>
          <Divider sx={{ my: 4 }} />
          <Typography variant="h6" color="textPrimary">
            Últimas lecturas:
          </Typography>
          {selectedCounter?.ultima_lectura?.map((item, index) => (
            <Typography key={index} variant="body1" color="textPrimary">
              <strong>{index}</strong>: {item?.lectura}
            </Typography>
          ))}
          <Divider sx={{ my: 4 }} />
          {/* {selectedCounter && (
            <Button
              disabled={selectedCounter?.estado === "POR_REVISAR"}
              color="error"
              onClick={() => checkCounter(selectedCounter?.id)}
            >
              Cambiar a no revisado
            </Button>
          )} */}
        </Box>
      </Modal>
    </div>
  );
}
