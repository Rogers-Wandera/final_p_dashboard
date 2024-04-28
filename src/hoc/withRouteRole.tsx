import React from "react";
import { useAuthUser } from "../contexts/authcontext";
import { Navigate } from "react-router-dom";
import { hasRouteRole } from "../helpers/routesroles";
import { useBasePath } from "../helpers/utils";
import { urlexcludes } from "../assets/defaults/modules";

const withRouteRole = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const actualpath = useBasePath();
    const { modules } = useAuthUser();
    if (!modules && !urlexcludes.includes(actualpath)) {
      return <Navigate to="/unauthorized" />;
    }
    if (!hasRouteRole(modules, actualpath)) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...props} />;
  };

  return WrapperComponent;
};

export default withRouteRole;
