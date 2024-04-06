import { createTheme } from "@mui/material";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../contexts/authcontext";

export const useTableTheme = () => {
  const settings = useSelector((state: RootState) => state.setting.setting);
  const tableTheme = useMemo(() => {
    return createTheme({
      palette: {
        mode: settings.theme_scheme.value as "light" | "dark",
        background: {
          default:
            settings.theme_scheme.value === "light" ? "#ffffff" : "#222738",
        },
      },
    });
  }, [settings]);
  return tableTheme;
};
