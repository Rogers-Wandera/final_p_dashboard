import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { persistor, store } from "./store";
import Login from "./views/auth/login";
import RecoverPassword from "./views/auth/recoverpw";
import { IndexRouters } from "./router/index";
import { SimpleRouter } from "./router/simple-router";
import { DefaultRouter } from "./router/default-router";
import { PersistGate } from "redux-persist/integration/react";
import AppStateProvider from "./contexts/sharedcontexts";
import { SnackbarProvider } from "notistack";
import AuthUserProvider from "./contexts/authcontext";
import { LoadingScreen } from "./components/Loading";
import Error404 from "./views/dashboard/errors/error404";
import Error401 from "./views/dashboard/errors/error401";
import ConnectionProvider from "./contexts/connectioncontext";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { createTheme, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

const queryClient = new QueryClient();
const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/pwreset",
          element: <RecoverPassword />,
        },
        ...DefaultRouter,
        ...IndexRouters,
        ...SimpleRouter,
        {
          path: "/unauthorized",
          element: <Error401 />,
        },
        {
          path: "*",
          element: <Error404 />,
        },
      ],
    },
  ],
  { basename: import.meta.env.PUBLIC_URL }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConnectionProvider>
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={<LoadingScreen />}>
          {/* <App> */}
          <QueryClientProvider client={queryClient}>
            <SnackbarProvider>
              <AppStateProvider>
                <AuthUserProvider>
                  <ThemeProvider theme={createTheme({})}>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <RouterProvider router={router}></RouterProvider>
                    </LocalizationProvider>
                  </ThemeProvider>
                </AuthUserProvider>
              </AppStateProvider>
            </SnackbarProvider>
          </QueryClientProvider>
          {/* </App> */}
        </PersistGate>
      </Provider>
    </ConnectionProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
