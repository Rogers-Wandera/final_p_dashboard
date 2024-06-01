import { useEffect, useState } from "react";
import { TypeToken, loguserout } from "../store/services/auth";
import withRouter, { RouterContextType } from "../hoc/withRouter";
import { useAuthUser } from "../contexts/authcontext";
import { useAppDispatch } from "../hooks/hook";
import { enqueueSnackbar } from "notistack";
import { useInterval } from "@mantine/hooks";
import { useConnection } from "../contexts/connectioncontext";
import { setSession } from "../store/services/defaults";

const parseJwt = (token: string): TypeToken => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return {} as TypeToken;
  }
};

const AuthVerify = (props: any) => {
  const dispatch = useAppDispatch();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const authUser = useAuthUser();
  const { location } = props.router as RouterContextType;
  const socket = useConnection();

  const OnLogOutUser = () => {
    if (authUser.token !== "") {
      const jwt = parseJwt(authUser.token);
      if (jwt?.exp * 1000 < Date.now()) {
        dispatch(loguserout({}));
        dispatch(setSession(false));
        socket?.emit("userloggedout", { userId: authUser.id });
        authUser.setId("");
        authUser.setRoles([]);
        authUser.token = "";
        setIsLoggedOut(true);
        enqueueSnackbar("Your session has expired please login", {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
          hideIconVariant: true,
        });
      }
    }
  };

  const interval = useInterval(OnLogOutUser, 600000);
  useEffect(() => {
    const jwt = parseJwt(authUser.token);
    if (authUser.token.length > 0) {
      interval.start();
      if (isLoggedOut) {
        interval.toggle;
      }
      if (jwt?.exp * 1000 < Date.now()) {
        OnLogOutUser();
        interval.stop();
        setIsLoggedOut(false);
      }
      return interval.stop();
    }
  }, [isLoggedOut, location.pathname, authUser.token, interval]);
  return <div></div>;
};

export default withRouter(AuthVerify);
