import { Dispatch, SetStateAction, useEffect } from "react";
//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/hope-ui.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/dark.scss";
import "./assets/scss/rtl.scss";
import "./assets/scss/customizer.scss";

// import state selectors
import { setSetting } from "./store/setting/actions";

// imports
import { setModules, useCheckServerStatusQuery } from "./store/services/auth";
import Error500 from "./views/dashboard/errors/error500";
import SnackBar, { SnackProps } from "./components/snackbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppState } from "./contexts/sharedcontexts";
import { LoadingScreen } from "./components/Loading";

import { RootState, useAuthUser } from "./contexts/authcontext";
import VerifyEmail from "./views/auth/verifyemail";
import { useAppDispatch } from "./hooks/hook";
import AuthVerify from "./components/authverify";
import { useTableContext } from "./contexts/tablecontext";
import { useLocation } from "react-router-dom";
import { useConnection } from "./contexts/connectioncontext";
import { useSelector } from "react-redux";
import { setManual, setSession } from "./store/services/defaults";
import { GetUserLinks } from "./helpers/utils";
import { fetchUserLinks } from "./store/services/thunks";
import HandleAuthSockets from "./sockets/authsockets";
import { isTokenExpired } from "./app/utils";
import { enqueueSnackbar } from "notistack";

function EntryApp() {
  const { isError, isLoading } = useCheckServerStatusQuery({});
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const { user, loading, token } = useAuthUser();
  const authuser = useAuthUser();
  const manual = useSelector(
    (state: RootState) => state.appState.defaultstate.manual
  );
  const isLoggedIn = useSelector(
    (state: RootState) => state.appState.authuser.isLoggedIn
  );

  const location = useLocation();
  const socket = useConnection();
  const { setColumnFilters, setGlobalFilter, setPagination, setSorting } =
    useTableContext();

  useEffect(() => {
    dispatch(setSetting({}));
  }, [dispatch]);

  useEffect(() => {
    if (token !== "") {
      dispatch(fetchUserLinks());
    }
  }, []);

  useEffect(() => {
    if (manual === true) {
      GetUserLinks(token).then((data) => {
        if (Object.keys(data).length > 0) {
          dispatch(setModules(data));
          dispatch(setManual(false));
        } else {
          dispatch(setManual(false));
        }
      });
    }
  }, [manual]);
  useEffect(() => {
    if (user.adminCreated === 1) {
      history("/changepword");
    }
  }, []);
  useEffect(() => {
    setGlobalFilter("");
    setPagination({ pageIndex: 0, pageSize: 5 });
    setSorting([]);
    setColumnFilters([]);
    setManual(true);
  }, [location.pathname]);

  useEffect(() => {
    if (socket == null) return;
    const { cleanup } = HandleAuthSockets({ socket, dispatch, authuser });
    return cleanup;
  }, [socket]);

  useEffect(() => {
    const checkTokenExpiration = () => {
      if (isTokenExpired(token) && isLoggedIn) {
        dispatch(setSession(true));
        enqueueSnackbar(
          `Your session is about to expire, please update your session`,
          {
            variant: "info",
            anchorOrigin: { horizontal: "center", vertical: "top" },
            preventDuplicate: true,
            autoHideDuration: 2000,
            hideIconVariant: true,
            disableWindowBlurListener: true,
          }
        );
      }
    };
    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(intervalId);
  }, [token]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (loading) {
    return <LoadingScreen />;
  }

  if (user.verified === 0) {
    return <VerifyEmail />;
  }

  // console.log(import.meta.env.VITE_PUBLIC_URL);
  if (isError) {
    return (
      <Error500
        heading="Oops! The connection to the server has been lost"
        subtitle="Check your internet connection or Contact Admin for help"
        linkText="Contact"
      />
    );
  }
  return (
    <div className="App">
      <SnackBar
        open={appState?.snackBarOpen as SnackProps}
        setOpen={
          appState?.setSnackBarOpen as Dispatch<SetStateAction<SnackProps>>
        }
      />
      <AuthVerify />
      {/* <ModulesAuth /> */}
      <Outlet />
    </div>
  );
}

export default EntryApp;
