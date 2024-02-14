import { EnqueueSnackbar } from "notistack";
import { SharedStateContextType } from "../contexts/sharedcontexts";
import { ErrorResponse } from "../store/services/auth";

export const handleError = (
  error: any,
  appstate: SharedStateContextType | null,
  enqueueSnackbar: EnqueueSnackbar
) => {
  const action = appstate?.action;
  if ("errors" in error) {
    const errors = error.errors as ErrorResponse[];
    errors.forEach((err) => {
      enqueueSnackbar(err.message, {
        variant: "error",
        action: action,
        anchorOrigin: { horizontal: "right", vertical: "top" },
        hideIconVariant: true,
      });
    });
  } else {
    if ("msg" in error) {
      const msg = error.msg as string;
      appstate?.setSnackBarOpen({
        open: true,
        message: msg,
        severity: "error",
        position: "top-right",
      });
    } else {
      let msgerr: string;
      if ("error" in error) {
        msgerr = error.error;
      } else if ("message" in error) {
        msgerr = error.message;
      } else {
        msgerr = "Something went wrong";
      }
      appstate?.setSnackBarOpen({
        open: true,
        message: msgerr,
        severity: "error",
        position: "top-right",
        timer: 6000,
      });
    }
  }
};
