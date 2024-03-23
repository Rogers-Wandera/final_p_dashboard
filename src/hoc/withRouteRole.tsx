import React from "react";
import { useAuthUser } from "../contexts/authcontext";
import { Navigate, useLocation } from "react-router-dom";
import { hasRouteRole } from "../helpers/routesroles";

const withRouteRole = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const location = useLocation();
    const { modules } = useAuthUser();
    if (!hasRouteRole(modules, location.pathname)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...props} />;
  };

  return WrapperComponent;
};

export default withRouteRole;
