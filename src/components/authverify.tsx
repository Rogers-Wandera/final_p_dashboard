import { useEffect } from "react";
import { TypeToken, loguserout } from "../store/services/auth";
import withRouter from "../hoc/withRouter";
import { useAuthUser } from "../contexts/authcontext";
import { useAppDispatch } from "../hooks/hook";
import { enqueueSnackbar } from "notistack";

const parseJwt = (token: string): TypeToken => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return {} as TypeToken;
  }
};

const AuthVerify = (props: any) => {
  const authUser = useAuthUser();
  const dispatch = useAppDispatch();
  const location = props.router.location;
  useEffect(() => {
    if (authUser.token !== "") {
      const jwt = parseJwt(authUser.token);
      if (jwt?.exp * 1000 < Date.now()) {
        dispatch(loguserout({}));
        authUser.setId("");
        authUser.setRoles([]);
        enqueueSnackbar("Your session has expired please login", {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
          hideIconVariant: true,
        });
      }
    }
  }, [location]);
  return <div></div>;
};

export default withRouter(AuthVerify);
