import React, { createContext, useContext } from "react";
import { useSelector, useDispatch } from "react-redux";
import { store } from "../store";
import { loguserout, useGetUserQuery } from "../store/services/auth";
import { useAppState } from "./sharedcontexts";

interface AuthContextState {
  isLoggedIn: boolean;
  token: string;
  user: any;
}

export type RootState = ReturnType<typeof store.getState>;

const AuthUserContext = createContext<AuthContextState>({
  isLoggedIn: false,
  token: "",
  user: {},
});

const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const appState = useAppState();
  const isLoggedIn = useSelector(
    (state: RootState) => state.appState.authuser.isLoggedIn
  );
  const token = useSelector(
    (state: RootState) => state.appState.authuser.token
  );

  const { data, error, isError } = useGetUserQuery({});
  const user =
    useSelector((state: RootState) => state.appState.authuser.user) ||
    data ||
    {};
  React.useEffect(() => {
    if (isError) {
      if ("status" in error) {
        const status = error.status as number;
        if (status === 403) {
          appState?.setSnackBarOpen({
            message: "Your session has expired. Please login again",
            open: true,
            severity: "error",
            timer: 6000,
            position: "top-right",
          });
          dispatch(loguserout({ token: "", isLoggedIn: false, user: {} }));
        }
      }
    }
  }, [isError]);

  return (
    <AuthUserContext.Provider value={{ isLoggedIn, token, user }}>
      {children}
    </AuthUserContext.Provider>
  );
};

export const useAuthUser = () => {
  const context = useContext(AuthUserContext);
  if (context === undefined) {
    throw new Error("useAuthUser must be used within a AuthUserProvider");
  }
  return context;
};

export default AuthUserProvider;
