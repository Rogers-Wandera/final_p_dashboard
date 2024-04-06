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
import { setLoading, useCheckServerStatusQuery } from "./store/services/auth";
import Error500 from "./views/dashboard/errors/error500";
import SnackBar, { SnackProps } from "./components/snackbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppState } from "./contexts/sharedcontexts";
import { LoadingScreen } from "./components/Loading";

import { useAuthUser } from "./contexts/authcontext";
import VerifyEmail from "./views/auth/verifyemail";
import { useAppDispatch } from "./hooks/hook";
import AuthVerify from "./components/authverify";
// import ModulesAuth from "./components/modulesfetch";
import { fetchUserLinks } from "./store/services/thunks";
import { useTableContext } from "./contexts/tablecontext";
import { useLocation } from "react-router-dom";

function EntryApp() {
  const { isError, isLoading } = useCheckServerStatusQuery({});
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const { user, loading, token } = useAuthUser();
  const location = useLocation();
  const {
    setColumnFilters,
    setGlobalFilter,
    setManual,
    setPagination,
    setSorting,
  } = useTableContext();

  useEffect(() => {
    dispatch(setSetting({}));
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLoading(true));
    if (token !== "") {
      dispatch(fetchUserLinks());
    }
    dispatch(setLoading(false));
  }, []);
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
