import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useAppSelector } from "../hooks/useAppSelector";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { initMessage, setMessage } from "../features/message/messagSlice";

export default function CustomizedSnackbars() {
  const message = useAppSelector((state) => state.message);
  const dispatch = useAppDispatch();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
    dispatch(initMessage());
  };

  React.useEffect(() => {
    if (message.message) {
      setOpen(true);
    }
  }, [message]);

  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={message.type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
