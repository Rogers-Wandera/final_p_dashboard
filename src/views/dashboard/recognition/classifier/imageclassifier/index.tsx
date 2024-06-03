import { Col, Row, Tab } from "react-bootstrap";
import ImageClassifierLeftSide from "./leftside";
import { useState } from "react";
import ImageRecognition from "./imagerecognition";
import LiveRecognition from "./liverecognition";
import { recognizedperson } from "../../../../../app/types";
import { FileWithPath } from "@mantine/dropzone";
import { usePostDataMutation } from "../../../../../store/services/apislice";
import { handleError } from "../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../contexts/sharedcontexts";

type dataprops = {
  image?: Record<string, unknown>;
  url?: string;
  type: "url_image" | "local_image";
  userId: string;
  predictionType: "Audio" | "Image";
};
const ImagesClassifier = () => {
  const [eventKey, setEventKey] = useState("image-recognition");
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>("");
  const [showcapture, setShowCapture] = useState(false);
  const [people, setPeople] = useState<recognizedperson[]>([]);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [postImage] = usePostDataMutation({});
  const appState = useAppState();

  const HandlePredictions = async (postdata: dataprops) => {
    try {
      const data = await postImage({ url: "/classifier", data: postdata });
      if ("error" in data) {
        throw data.error;
      }
      const resdata = data.data.data as recognizedperson[];
      return resdata;
    } catch (error) {
      handleError(error, appState, enqueueSnackbar);
      return [];
    }
  };

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
                people={people}
                setPeople={setPeople}
                setFiles={setFiles}
                files={files}
                HandlePredictions={HandlePredictions}
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
