import { useEffect, useState } from "react";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRouter from "../../../../hoc/withRouter";
import withAuthentication from "../../../../hoc/withUserAuth";
import HeaderClassifier from "./header";
import { Box } from "@mantine/core";
import { Tab } from "react-bootstrap";
import ImagesClassifier from "./imageclassifier";
import AudioClassifier from "./audioclassifier";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";

const MainClassifier = () => {
  const [type, setType] = useState<"Image" | "Audio">("Image");
  const [eventKey, setEventKey] = useState("first");
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setHeaderText("Classifier"));
  }, []);
  return (
    <Box>
      <Tab.Container defaultActiveKey={eventKey}>
        <HeaderClassifier setType={setType} setEventKey={setEventKey} />
        <Tab.Content>
          <Tab.Pane eventKey="first" id="image-classifier">
            <ImagesClassifier />
          </Tab.Pane>
          <Tab.Pane eventKey="second" id="audio-classifier">
            <AudioClassifier />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Box>
  );
};

const AuthenticatedClassifier = withAuthentication(
  withRouter(withRouteRole(MainClassifier))
);

export default AuthenticatedClassifier;
