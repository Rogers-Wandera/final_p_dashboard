import { Col, Row, Tab } from "react-bootstrap";
import ImageClassifierLeftSide from "./leftside";
import { useState } from "react";
import ImageRecognition from "./imagerecognition";
import LiveRecognition from "./liverecognition";

const ImagesClassifier = () => {
  const [eventKey, setEventKey] = useState("image-recognition");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>("");
  const [showcapture, setShowCapture] = useState(false);
  return (
    <Col lg="12">
      <Tab.Container defaultActiveKey={eventKey}>
        <Row>
          <ImageClassifierLeftSide
            setEventKey={setEventKey}
            eventKey={eventKey}
            setSelectedDeviceId={setSelectedDeviceId}
            setShowCapture={setShowCapture}
          />
          <Col lg="8">
            <Tab.Content>
              <ImageRecognition
                setShowCapture={setShowCapture}
                showcapture={showcapture}
              />
              <LiveRecognition
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
              />
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Col>
  );
};

export default ImagesClassifier;
