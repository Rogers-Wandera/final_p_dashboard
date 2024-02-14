import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

export type SnackProps = {
  message: string;
  severity?: "success" | "error" | "info" | "warning";
  variant?: "filled" | "outlined" | "standard";
  timer?: number;
  open: boolean;
  position?:
    | "top"
    | "bottom"
    | "left"
    | "right"
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center"
    | "top-center"
    | "bottom-center";
};
export type SnackBarProps = {
  open: SnackProps;
  setOpen: React.Dispatch<React.SetStateAction<SnackProps>>;
};

export default function SnackBar({ open, setOpen }: SnackBarProps) {
  const handleClose = () => {
    setOpen((prevstate) => ({ ...prevstate, open: false, message: "" }));
  };
  const pos = open.position || "top-left";
  const horizontal = pos.split("-")[1] as "left" | "center" | "right";
  const vertical = pos.split("-")[0] as "top" | "bottom";
  return (
    <div>
      {/* <Button onClick={handleClick}>Open Snackbar</Button> */}
      <Snackbar
        open={open.open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={open.timer || 6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={open.severity || "success"}
          variant={open.variant || "filled"}
          sx={{ width: "100%" }}
        >
          {open.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
