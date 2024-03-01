import React from "react";
//router
// import IndexRouters from "./router/index"

//scss
import "./assets/scss/hope-ui.scss";
import "./assets/scss/custom.scss";
import "./assets/scss/dark.scss";
import "./assets/scss/rtl.scss";
import "./assets/scss/customizer.scss";

// Redux Selector / Action
import { useDispatch, useSelector } from "react-redux";

// import state selectors
import { setSetting } from "./store/setting/actions";

// imports
import { loguserout, useCheckServerStatusQuery } from "./store/services/auth";
import Error500 from "./views/dashboard/errors/error500";
import SnackBar from "./components/snackbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useAppState } from "./contexts/sharedcontexts";
import { LoadingScreen } from "./components/Loading";

// decoder
import { jwtDecode } from "jwt-decode";
import { useAuthUser } from "./contexts/authcontext";
import VerifyEmail from "./views/auth/verifyemail";

function App() {
  const { isError, isLoading } = useCheckServerStatusQuery();
  const dispatch = useDispatch();
  const appState = useAppState();
  const navigate = useNavigate();
  const [isTokenExpired, setIsTokenExpired] = React.useState(false);
  // const token = useSelector((state) => state.appState.authuser.token);
  // const loading = useSelector((state) => state.appState.authuser.loading);
  const { token, user, loading } = useAuthUser();

  React.useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);

  React.useEffect(() => {
    const checkTokenExpiration = () => {
      if (token) {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds
        setIsTokenExpired(decoded.exp < currentTime);
      }
    };

    checkTokenExpiration(); // Initial check

    const interval = setInterval(checkTokenExpiration, 60000); // Check every minute

    return () => clearInterval(interval); // Cleanup
  }, [token]);

  React.useEffect(() => {
    if (isTokenExpired) {
      appState?.setSnackBarOpen({
        message: "Your session has expired. Please login again",
        open: true,
        severity: "error",
        timer: 6000,
        position: "top-right",
      });
      dispatch(loguserout({ token: "", isLoggedIn: false, user: {} }));
      navigate("/");
    }
  }, [isTokenExpired, loading]);

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
      <Outlet />
    </div>
  );
}

export default App;
