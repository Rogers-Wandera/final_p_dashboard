import { useEffect, useState } from "react";
import { TypeToken, loguserout } from "../store/services/auth";
import withRouter from "../hoc/withRouter";
import { useAuthUser } from "../contexts/authcontext";
import { useAppDispatch } from "../hooks/hook";
import { enqueueSnackbar } from "notistack";
import { useInterval } from "@mantine/hooks";

const parseJwt = (token: string): TypeToken => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return {} as TypeToken;
  }
};

const AuthVerify = () => {
  const dispatch = useAppDispatch();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const authUser = useAuthUser();

  const OnLogOutUser = () => {
    if (authUser.token !== "") {
      const jwt = parseJwt(authUser.token);
      if (jwt?.exp * 1000 < Date.now()) {
        dispatch(loguserout({}));
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
    interval.start();
    if (isLoggedOut) {
      interval.toggle;
    }
    return interval.stop();
  }, [isLoggedOut]);
  return <div></div>;
};

export default withRouter(AuthVerify);
