import { Grid } from "@mantine/core";
import { Tab } from "react-bootstrap";
import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import TakeImage from "./takeimage";
import ImageLayout from "./layout";

interface imageprops {
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
  showcapture: boolean;
}
const ImageRecognition = ({ setShowCapture, showcapture }: imageprops) => {
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [resource, setResource] = useState("Upload Image");
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<null | boolean>(null);

  useEffect(() => {
    if (showcapture) {
      setResource("");
    } else {
      if (resource == "") {
        setResource("Upload Image");
      } else {
        setResource(resource);
      }
    }
  }, [showcapture]);
  return (
    <Tab.Pane eventKey="image-recognition" id="image-recognition">
      <ImageLayout
        setFiles={setFiles}
        isValid={isValid}
        setIsValid={setIsValid}
        imgSrc={imgSrc}
        showcapture={showcapture}
        setShowCapture={setShowCapture}
        resource={resource}
        setResource={setResource}
        setImgSrc={setImgSrc}
        webcamRef={webcamRef}
        setUrl={setUrl}
      />
      <Grid>
        {
          <Grid.Col span={12}>
            {showcapture && <TakeImage imgSrc={imgSrc} webcamRef={webcamRef} />}
          </Grid.Col>
        }
      </Grid>
    </Tab.Pane>
  );
};

export default ImageRecognition;
