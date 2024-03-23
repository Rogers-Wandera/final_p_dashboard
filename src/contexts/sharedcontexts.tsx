import React, { createContext, useContext, useState } from "react";
import { SnackProps } from "../components/snackbar";
import { SnackbarKey } from "notistack";
import { useSnackbar } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";
import { IconButton } from "@mui/material";

export interface SharedStateContextType {
  snackBarOpen: SnackProps;
  setSnackBarOpen: React.Dispatch<React.SetStateAction<SnackProps>>;
  action: (key: SnackbarKey) => React.ReactNode;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  message: string;
}

export interface sharedstateprops {
  children: React.ReactNode;
}

const AppState = createContext<SharedStateContextType | null>(null);

const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [message, setMessage] = useState("");
  const [snackBarOpen, setSnackBarOpen] = useState<SnackProps>({
    open: false,
    severity: "success",
    message: "",
    variant: "filled",
    timer: 6000,
  });
  const { closeSnackbar } = useSnackbar();

  const action = (key: SnackbarKey): React.ReactNode => {
    return (
      <>
        <IconButton
          aria-label="delete"
          onClick={() => {
            closeSnackbar(key);
          }}
        >
          <CancelIcon sx={{ color: "white" }} />
        </IconButton>
      </>
    );
  };

  return (
    <AppState.Provider
      value={{ setSnackBarOpen, snackBarOpen, action, message, setMessage }}
    >
      {children}
    </AppState.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppState);
  if (context === undefined) {
    throw new Error("useAppState must be used within a AppStateProvider");
  }
  return context;
};

export default AppStateProvider;
