import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//router
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { persistor, store } from "./store";
import Login from "./views/auth/login";
import { IndexRouters } from "./router/index";
import { SimpleRouter } from "./router/simple-router";
import { DefaultRouter } from "./router/default-router";
import { PersistGate } from "redux-persist/integration/react";
import AppStateProvider from "./contexts/sharedcontexts";
import { SnackbarProvider } from "notistack";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token != null;
};

const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        ...DefaultRouter.map((route) => ({
          ...route,
          element: isAuthenticated() ? route.element : <Navigate to="/" />,
        })),
        ...IndexRouters.map((route) => ({
          ...route,
          element: isAuthenticated() ? route.element : <Navigate to="/" />,
        })),
        ...SimpleRouter.map((route) => ({
          ...route,
          element: isAuthenticated() ? route.element : <Navigate to="/" />,
        })),
      ],
    },
  ],
  { basename: import.meta.env.PUBLIC_URL }
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={<p>Loading...</p>}>
        {/* <App> */}
        <SnackbarProvider>
          <AppStateProvider>
            <RouterProvider router={router}></RouterProvider>
          </AppStateProvider>
        </SnackbarProvider>
        {/* </App> */}
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
