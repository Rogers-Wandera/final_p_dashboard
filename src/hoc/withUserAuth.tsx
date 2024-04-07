import React, { useEffect } from "react";
import { UserState, useAuthUser } from "../contexts/authcontext";
import { Navigate, useNavigate } from "react-router-dom";

export interface WithUserAuthProps {
  auth: {
    isLoggedIn: boolean;
    token: string;
    user: UserState;
  };
}
export type userauthprops = {
  isLoggedIn: boolean;
  token: string;
  user: UserState;
};
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

    return <Component {...props} auth={{ isLoggedIn, token, user }} />;
  };

  return WrapperComponent;
};

export default withAuthentication;
