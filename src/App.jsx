import React, { useEffect } from "react";
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
import SnackBar from "./components/snackbar";
import { Outlet } from "react-router-dom";
import { useAppState } from "./contexts/sharedcontexts";
import { LoadingScreen } from "./components/Loading";

import { useAuthUser } from "./contexts/authcontext";
import VerifyEmail from "./views/auth/verifyemail";
import { useAppDispatch } from "./hooks/hook";
import AuthVerify from "./components/authverify";
import ModulesAuth from "./components/modulesfetch";
import { fetchUserLinks } from "./store/services/thunks";

function App() {
  const { isError, isLoading } = useCheckServerStatusQuery();

  const dispatch = useAppDispatch();
  const appState = useAppState();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);

  useEffect(() => {
    dispatch(setLoading(true));
    dispatch(fetchUserLinks());
    dispatch(setLoading(false));
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (loading) {
    return <LoadingScreen />;
  }

  if (user.verified === 0) {
    return <VerifyEmail />;
  }
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
        open={appState.snackBarOpen}
        setOpen={appState.setSnackBarOpen}
      />
      <AuthVerify />
      <ModulesAuth />
      <Outlet />
    </div>
  );
}

export default App;
