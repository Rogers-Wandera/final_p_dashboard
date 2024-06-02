import withAuthentication from "../../../../hoc/withUserAuth";
import withRouter from "../../../../hoc/withRouter";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import HeaderTrainer from "./header";
import { GetCurrentModel } from "./trainer.api";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useEffect, useState } from "react";
import { evaluationtype } from "./trainertypes";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import { Tab } from "react-bootstrap";
import AudioTrainer from "./audiotrainer";
import ImageTrainer from "./imagestrainer";
import { useDisclosure } from "@mantine/hooks";

const Trainer = (_: any) => {
  const { token } = useAuthUser();
  const [type, setType] = useState<"Image" | "Audio">("Image");
  const [opened, { close, open }] = useDisclosure(false);
  const [eventKey, setEventKey] = useState("first");
  const [reload, setReload] = useState(false);
  const [current, setCurrent] = useState<evaluationtype>({} as evaluationtype);
  const HandleFetchCurrent = async () => {
    try {
      open();
      const data = await GetCurrentModel(token, type);
      setCurrent(data);
      close();
    } catch (error) {}
  };

  useEffect(() => {
    HandleFetchCurrent();
  }, [type, reload]);

  if (opened) {
    return (
      <LoadingOverlay
        visible={opened}
        zIndex={1500}
        h="100%"
        title="Uploading..."
        loaderProps={{ children: <Loader color="green" type="oval" /> }}
      />
    );
  }
  return (
    <Box>
      <Tab.Container defaultActiveKey={eventKey}>
        <HeaderTrainer setType={setType} setEventKey={setEventKey} />
        <Tab.Content>
          <Tab.Pane eventKey="first" id="image">
            <ImageTrainer
              current={current}
              token={token}
              type={type}
              setReload={setReload}
              reload={reload}
            />
          </Tab.Pane>
          <Tab.Pane eventKey="second" id="audio">
            <AudioTrainer
              current={current}
              token={token}
              type={type}
              setReload={setReload}
              reload={reload}
            />
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Box>
  );
};

const AuthenticatedTrainer = withAuthentication(
  withRouter(withRouteRole(Trainer))
);

export default withRolesVerify(AuthenticatedTrainer);
