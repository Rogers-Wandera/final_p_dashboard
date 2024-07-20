import { Col, Row, Tab } from "react-bootstrap";
import AudioClassifierLeftSide from "./leftside";
import { useState } from "react";
import AudioRecognition from "./audiorecognition";
import LiveRecognition from "./liverecognition";
import { useDisclosure } from "@mantine/hooks";
import { Loader, LoadingOverlay } from "@mantine/core";
import { recognizedperson } from "../../../../../app/types";

const AudioClassifier = () => {
  const [eventKey, setEventKey] = useState("audio-recognition");
  const [checked, setChecked] = useState(true);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [visible, { open, close }] = useDisclosure(false);
  const [people, setPeople] = useState<recognizedperson[]>([]);
  return (
    <Col lg="12">
      <LoadingOverlay
        visible={visible}
        loaderProps={{ children: <Loader color="green" type="bars" /> }}
      />
      <Tab.Container defaultActiveKey={eventKey}>
        <Row>
          <AudioClassifierLeftSide
            setEventKey={setEventKey}
            eventKey={eventKey}
          />
          <Col lg="8">
            <Tab.Content>
              <AudioRecognition open={open} close={close} />
              <LiveRecognition
                checked={checked}
                setChecked={setChecked}
                setIsValid={setIsValid}
                isValid={isValid}
                setUrl={setUrl}
                url={url}
                people={people}
                setPeople={setPeople}
                open={open}
                close={close}
              />
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Col>
  );
};

export default AudioClassifier;
