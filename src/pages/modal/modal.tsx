import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { ButtonGroup, Paper } from "@mui/material";

interface TransitionsModalProps {
  open: boolean;
  title: string;
  text: string;
  handleOk: () => void;
  handleCancel: () => void;
}

export default function MyModal({
  open,
  title,
  text,
  handleOk,
  handleCancel,
}: TransitionsModalProps) {
  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      open={open}
      onClose={handleCancel}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          timeout: 500,
        },
      }}
    >
      <Fade in={open}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh", // Full viewport height
          }}
        >
          <Paper
            sx={{
              p: 4,
              width: 400,
              textAlign: "center",
              bgcolor: "white",
            }}
          >
            <Typography variant="h4" gutterBottom>
              {title}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 1 }}>
              {text}
            </Typography>

            <ButtonGroup variant="contained">
              <Button variant="contained" color="success" onClick={handleOk}>
                Ok
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </Paper>
        </Box>
      </Fade>
    </Modal>
  );
}
