import { Col, Row, Tab } from "react-bootstrap";
import AudioClassifierLeftSide from "./leftside";
import { useState } from "react";
import AudioRecognition from "./audiorecognition";
import LiveRecognition from "./liverecognition";

const AudioClassifier = () => {
  const [eventKey, setEventKey] = useState("audio-recognition");
  const [checked, setChecked] = useState(true);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<null | boolean>(null);
  return (
    <Col lg="12">
      <Tab.Container defaultActiveKey={eventKey}>
        <Row>
          <AudioClassifierLeftSide
            setEventKey={setEventKey}
            eventKey={eventKey}
          />
          <Col lg="8">
            <Tab.Content>
              <AudioRecognition />
              <LiveRecognition
                checked={checked}
                setChecked={setChecked}
                setIsValid={setIsValid}
                isValid={isValid}
                setUrl={setUrl}
                url={url}
              />
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Col>
  );
};

export default AudioClassifier;
