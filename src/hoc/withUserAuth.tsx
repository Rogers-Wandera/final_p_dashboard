import React from "react";
import { useAuthUser } from "../contexts/authcontext";
import { Navigate } from "react-router-dom";

const withAuthentication = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const { isLoggedIn, token } = useAuthUser();
    console.log(isLoggedIn);
    if (isLoggedIn === false && token === "") {
      return <Navigate to="/" />;
    }

    return <Component {...props} />;
  };

  return WrapperComponent;
};

export default withAuthentication;
