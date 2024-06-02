import EntryApp from "./Entryapp";
//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./views/auth/login";
import RecoverPassword from "./views/auth/recoverpw";
// import { IndexRouters } from "./router/index";
import { DefaultRouter } from "./router/default-router";
import AppStateProvider from "./contexts/sharedcontexts";
import { SnackbarProvider } from "notistack";
import AuthUserProvider from "./contexts/authcontext";
import Error404 from "./views/dashboard/errors/error404";
import Error401 from "./views/dashboard/errors/error401";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import TableContextProvider from "./contexts/tablecontext";
import { Loader, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import ChangePassword from "./views/auth/changepassword";
import { useTableTheme } from "./helpers/tabletheme";

const queryClient = new QueryClient({
  // queryCache: new QueryCache({
  //   onError: (error, query) => {
  //     console.log(error["response"]);
  //   },
  // }),
});
const router = createBrowserRouter(
  [
    {
      element: <EntryApp />,
      children: [
        {
          path: "/",
          element: <Login />,
        },
        {
          path: "/pwreset",
          element: <RecoverPassword />,
        },
        {
          path: "/changepword",
          element: <ChangePassword />,
        },
        ...DefaultRouter,
        // ...IndexRouters,
        {
          path: "/unauthorized",
          element: <Error401 />,
        },
        {
          path: "*",
          element: <Error404 />,
        },
        {
          path: "/notfound",
          element: <Error404 />,
        },
      ],
    },
  ],
  { basename: import.meta.env.PUBLIC_URL }
);
function App() {
  const tabletheme = useTableTheme();
  return (
    <QueryClientProvider client={queryClient}>
      <SnackbarProvider>
        <AppStateProvider>
          <AuthUserProvider>
            <ThemeProvider theme={tabletheme}>
              <MantineProvider>
                <ModalsProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <TableContextProvider>
                      <RouterProvider
                        router={router}
                        fallbackElement={<Loader color="blue" type="bars" />}
                        future={{ v7_startTransition: true }}
                      ></RouterProvider>
                    </TableContextProvider>
                  </LocalizationProvider>
                </ModalsProvider>
              </MantineProvider>
            </ThemeProvider>
          </AuthUserProvider>
        </AppStateProvider>
      </SnackbarProvider>
    </QueryClientProvider>
  );
}

export default App;
