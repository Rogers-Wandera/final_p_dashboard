import { Tab } from "react-bootstrap";
import LayOut from "./layout";

const AudioRecognition = () => {
  return (
    <Tab.Pane eventKey="audio-recognition" id="audio-recognition">
      <LayOut />
    </Tab.Pane>
  );
};

export default AudioRecognition;
