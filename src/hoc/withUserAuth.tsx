import React, { useEffect } from "react";
import { useAuthUser } from "../contexts/authcontext";
import { Navigate, useNavigate } from "react-router-dom";

const withAuthentication = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    const history = useNavigate();
    const { isLoggedIn, token, user } = useAuthUser();

    useEffect(() => {
      if (isLoggedIn && token !== "") {
        if (user.adminCreated === 1) {
          history("/changepword");
        }
      }
    }, []);

    if (isLoggedIn === false && token === "") {
      return <Navigate to="/" />;
    }

    return <Component {...props} />;
  };

  return WrapperComponent;
};

export default withAuthentication;
