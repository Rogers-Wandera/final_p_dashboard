import React, { createContext, useContext } from "react";
import { useSelector } from "react-redux";
import { store } from "../store";
import { ModulesType } from "../store/services/auth";

export interface UserState {
  firstname?: string;
  lastname?: string;
  isLocked?: number;
  verified?: number;
}

interface AuthContextState {
  isLoggedIn: boolean;
  token: string;
  user: UserState;
  modules: ModulesType;
  loading: boolean;
}

export type RootState = ReturnType<typeof store.getState>;

const AuthUserContext = createContext<AuthContextState>({
  isLoggedIn: false,
  token: "",
  user: {} as UserState,
  modules: {} as ModulesType,
  loading: false,
});

const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isLoggedIn = useSelector(
    (state: RootState) => state.appState.authuser.isLoggedIn
  );
  const token = useSelector(
    (state: RootState) => state.appState.authuser.token
  );
  const user = useSelector((state: RootState) => state.appState.authuser.user);

  const modules = useSelector(
    (state: RootState) => state.appState.authuser.modules
  );

  const loading = useSelector(
    (state: RootState) => state.appState.authuser.loading
  );

  return (
    <AuthUserContext.Provider
      value={{ isLoggedIn, token, user, modules, loading }}
    >
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
