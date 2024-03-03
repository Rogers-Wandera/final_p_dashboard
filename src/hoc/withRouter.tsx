import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

const withRouter = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();

    return <Component {...props} router={{ location, navigate, params }} />;
  };

  return WrapperComponent;
};

export default withRouter;
