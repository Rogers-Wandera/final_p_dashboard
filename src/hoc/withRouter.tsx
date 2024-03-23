import React from "react";
import { Params, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppState } from "../contexts/sharedcontexts";

export interface RouterContextType {
  location: ReturnType<typeof useLocation>;
  navigate: ReturnType<typeof useNavigate>;
  params: Readonly<Params<string>>;
  appState: ReturnType<typeof useAppState>;
}

const withRouter = <P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> => {
  const WrapperComponent: React.FC<P> = (props) => {
    let location = useLocation();
    const appState = useAppState();
    let navigate = useNavigate();
    let params = useParams();

    return (
      <Component {...props} router={{ location, navigate, params, appState }} />
    );
  };

  return WrapperComponent;
};

export default withRouter;
