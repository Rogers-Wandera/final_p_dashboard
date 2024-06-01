import { AuthContextState } from "../contexts/authcontext";
import { enqueueSnackbar } from "notistack";
import { loguserout } from "../store/services/auth";
import { setOnline } from "../store/services/defaults";
import { Socket } from "socket.io-client";

export type authsocketprops = {
  socket: Socket;
  authuser: AuthContextState;
  dispatch: any;
};

const HandleAuthSockets = ({ socket, authuser, dispatch }: authsocketprops) => {
  const { token, id, isLoggedIn } = authuser;
  const handleLogUserOut = (data: { userId: string }) => {
    if (data.userId === id) {
      dispatch(loguserout({}));
      enqueueSnackbar(
        "You have been logged out, some configurations have changed, please login again",
        {
          variant: "info",
          anchorOrigin: { horizontal: "center", vertical: "top" },
          preventDuplicate: true,
          autoHideDuration: 4000,
          hideIconVariant: true,
          disableWindowBlurListener: true,
        }
      );
    }
  };

  const handleOnlineStatus = (data: { userId: string; online: boolean }) => {
    if (isLoggedIn && token !== "") {
      if (data.userId === id) {
        dispatch(setOnline(data.online));
      }
    }
  };

  const OnloginHandle = (data: { userId: string }) => {
    socket.emit("userlogin", { userId: data.userId });
  };
  socket.on("loguserout", handleLogUserOut);
  socket.on("onlinestatus", handleOnlineStatus);
  socket.on("login", OnloginHandle);
  if (token.length > 0 && isLoggedIn) {
    socket.emit("userlogin", { userId: id });
    socket.emit("usertoken", { token: token });
    socket.on("getusertoken", () => {
      socket.emit("usertoken", { token: token });
    });
  }

  const cleanup = () => {
    socket.off("loguserout", handleLogUserOut);
    socket.off("getusertoken", () => {});
    socket.off("usertoken", () => {});
    socket.off("login", OnloginHandle);
    socket.off("onlinestatus", handleOnlineStatus);
  };
  return { cleanup };
};

export default HandleAuthSockets;
