import React, { createContext, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { store } from "../store";
import { ModulesType, TypeToken, setLoading } from "../store/services/auth";
import { jwtDecode } from "jwt-decode";
import { useAppDispatch } from "../hooks/hook";
import { decryptBackData } from "../helpers/utils";

export interface UserState {
  displayName?: string;
  isLocked?: number;
  verified?: number;
  adminCreated?: number;
  position?: string;
  image?: string;
}

export interface AuthContextState {
  isLoggedIn: boolean;
  token: string;
  user: UserState;
  modules: ModulesType;
  loading: boolean;
  roles: number[];
  id: string;
  setRoles: React.Dispatch<React.SetStateAction<number[]>>;
  setId: React.Dispatch<React.SetStateAction<string>>;
  setUser: React.Dispatch<React.SetStateAction<UserState>>;
}
export interface UserRouteRoles {
  roles: string[];
}

export type RootState = ReturnType<typeof store.getState>;

const AuthUserContext = createContext<AuthContextState>({
  isLoggedIn: false,
  token: "",
  user: {} as UserState,
  modules: {} as ModulesType,
  loading: false,
  roles: [],
  id: "",
  setId: () => {},
  setRoles: () => {},
  setUser: () => {},
});

const AuthUserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [roles, setRoles] = useState<number[]>([]);
  const [id, setId] = useState<string>("");
  const [user, setUser] = useState<UserState>({} as UserState);
  const dispatch = useAppDispatch();
  const isLoggedIn = useSelector(
    (state: RootState) => state.appState.authuser.isLoggedIn
  );
  const token = useSelector(
    (state: RootState) => state.appState.authuser.token
  );

  const modules = useSelector(
    (state: RootState) => state.appState.authuser.modules
  );

  const loading = useSelector(
    (state: RootState) => state.appState.authuser.loading
  );

  useEffect(() => {
    dispatch(setLoading(true));
    if (token !== "") {
      const decoded: TypeToken = jwtDecode(token);
      const { user } = decoded;
      setRoles(decoded.user.roles);
      setId(decoded.user.id);
      setUser({
        displayName: user.displayName,
        verified: user.verified,
        isLocked: user.isLocked,
        adminCreated: user.adminCreated,
        position: user.position,
        image: decryptBackData(user.image),
      });
    } else {
      setRoles([]);
      setId("");
    }
    dispatch(setLoading(false));
  }, [token, isLoggedIn]);

  return (
    <AuthUserContext.Provider
      value={{
        isLoggedIn,
        token,
        user,
        modules,
        loading,
        roles,
        id,
        setRoles,
        setId,
        setUser,
      }}
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
