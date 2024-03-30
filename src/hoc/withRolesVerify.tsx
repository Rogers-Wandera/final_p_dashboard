import React from "react";
import { useAuthUser } from "../contexts/authcontext";
import { Navigate } from "react-router-dom";

interface WithRolesProps {
  acceptedroles: number[];
}
const withRolesVerify = <P extends WithRolesProps>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const { acceptedroles, ...rest } = props as WithRolesProps;
    const { roles } = useAuthUser();
    const results = roles.map((role) => acceptedroles.includes(role));
    const checkResults = results.find((result) => result === true);
    if (!checkResults) {
      return <Navigate to="/unauthorized" />;
    }
    return <Component {...(rest as P)} />;
  };

  return WrapperComponent;
};

export default withRolesVerify;
