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
import { useDispatch } from "react-redux";

// import state selectors
import { setSetting } from "./store/setting/actions";

// imports
import { useCheckServerStatusQuery } from "./store/services/auth";
import Error500 from "./views/dashboard/errors/error500";
import SnackBar from "./components/snackbar";
import { Outlet } from "react-router-dom";
import { useAppState } from "./contexts/sharedcontexts";

function App() {
  const { isError, isLoading } = useCheckServerStatusQuery();
  const dispatch = useDispatch();
  const appState = useAppState();

  React.useEffect(() => {
    dispatch(setSetting());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
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
