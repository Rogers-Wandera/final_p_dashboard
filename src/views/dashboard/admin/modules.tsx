// import { useMemo } from "react";

//MRT Imports
// import {
//   MaterialReactTable,
//   useMaterialReactTable,
//   type MRT_ColumnDef,
//   MRT_GlobalFilterTextField,
//   MRT_ToggleFiltersButton,
// } from "material-react-table";

//Material UI Imports
// import {
//   Box,
//   Button,
//   ListItemIcon,
//   MenuItem,
//   Typography,
//   lighten,
// } from "@mui/material";

//Icons Imports
// import { AccountCircle, Send } from "@mui/icons-material";
import withAuthentication from "../../../hoc/withUserAuth";
import withRouteRole from "../../../hoc/withRouteRole";

const Modules = () => {
  return <div></div>;
};
export default withAuthentication(withRouteRole(Modules));
