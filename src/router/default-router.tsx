import Index from "../views/dashboard/index";
// import { Switch, Route } from 'react-router-dom'
// user
import UserProfile from "../views/dashboard/app/user-profile";
// import userProfileEdit from '../views/dashboard/app/user-privacy-setting';
// widget
import Widgetbasic from "../views/dashboard/widget/widgetbasic";
import Widgetcard from "../views/dashboard/widget/widgetcard";
import Widgetchart from "../views/dashboard/widget/widgetchart";
// Form
import FormWizard from "../views/dashboard/from/form-wizard";
// // table
// import BootstrapTable from "../views/dashboard/table/bootstrap-table";
// import TableData from "../views/dashboard/table/table-data";

// // map
// import Vector from "../views/dashboard/maps/vector";
// import Google from "../views/dashboard/maps/google";

//extra
// import PrivacyPolicy from '../views/dashboard/extra/privacy-policy';
// import TermsofService from '../views/dashboard/extra/terms-of-service';

//TransitionGroup
// import { TransitionGroup, CSSTransition } from "react-transition-group";
//Special Pages
// import Billing from "../views/dashboard/special-pages/billing";
// import Kanban from "../views/dashboard/special-pages/kanban";
// import Pricing from "../views/dashboard/special-pages/pricing";
// import Timeline from "../views/dashboard/special-pages/timeline";
// import Calender from "../views/dashboard/special-pages/calender";
// import RtlSupport from "../views/dashboard/special-pages/RtlSupport";

//admin
import Admin from "../views/dashboard/admin/admin";
import Default from "../layouts/dashboard/default";
import Modules from "../views/dashboard/admin/modules/modules";
import ModulesLinks from "../views/dashboard/admin/modules/modulelinks";
import Users from "../views/dashboard/admin/users/users";
import Positions from "../views/dashboard/admin/users/positions";
import ManageUser from "../views/dashboard/admin/users/manageuser";
import Roles from "../views/configurations/roles/roles";
import Person from "../views/dashboard/admin/people/person";
import ManagePerson from "../views/dashboard/admin/people/manageperson";

export const DefaultRouter = [
  {
    path: "/",
    element: <Default />,
    children: [
      {
        path: "dashboard",
        element: <Index />,
      },
      {
        path: "dashboard/modules",
        element: <Modules acceptedroles={[5150, 1982]} />,
      },
      {
        path: "dashboard/modules/:id",
        element: <ModulesLinks acceptedroles={[5150, 1982]} />,
      },
      {
        path: "dashboard/users",
        element: <Users acceptedroles={[5150, 1982]} />,
      },
      {
        path: "dashboard/positions",
        element: <Positions />,
      },
      {
        path: "dashboard/users/manage/:id",
        element: <ManageUser />,
      },
      {
        path: "dashboard/configs/roles",
        element: <Roles acceptedroles={[5150, 1982]} />,
      },
      {
        path: "dashboard/admin/persons",
        element: <Person />,
      },
      {
        path: "dashboard/admin/persons/manage/:personId",
        element: <ManagePerson />,
      },
      {
        path: "dashboard/app/user-profile",
        element: <UserProfile />,
      },
      // {
      //   path: "dashboard/app/user-add",
      //   element: <UserAdd />,
      // },
      {
        path: "dashboard/admin/admin",
        element: <Admin />,
      },
      // Widget
      {
        path: "dashboard/widget/widgetbasic",
        element: <Widgetbasic />,
      },
      {
        path: "dashboard/widget/widgetchart",
        element: <Widgetchart />,
      },
      {
        path: "dashboard/widget/widgetcard",
        element: <Widgetcard />,
      },
      {
        path: "dashboard/form/form-wizard",
        element: <FormWizard />,
      },
    ],
  },
];

// {
//   path: "dashboard/special-pages/calender",
//   element: <Calender />,
// },
// {
//   path: "dashboard/special-pages/kanban",
//   element: <Kanban />,
// },
// {
//   path: "dashboard/special-pages/pricing",
//   element: <Pricing />,
// },
// {
//   path: "dashboard/special-pages/timeline",
//   element: <Timeline />,
// },
// {
//   path: "dashboard/special-pages/rtl-support",
//   element: <RtlSupport />,
// },

// Table
// {
//   path: "dashboard/table/bootstrap-table",
//   element: <BootstrapTable />,
// },
// {
//   path: "dashboard/table/table-data",
//   element: <TableData />,
// },
// // Icon
// {
//   path: "dashboard/icon/solid",
//   element: <Solid />,
// },
// {
//   path: "dashboard/icon/outline",
//   element: <Outline />,
// },
// {
//   path: "dashboard/icon/dual-tone",
//   element: <DualTone />,
// },

// Map
// {
//   path: "dashboard/map/google",
//   element: <Google />,
// },
// {
//   path: "dashboard/map/vector",
//   element: <Vector />,
// },
