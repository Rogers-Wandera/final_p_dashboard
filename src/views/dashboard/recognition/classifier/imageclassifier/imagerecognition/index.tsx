import { Box, Grid, Loader, LoadingOverlay } from "@mantine/core";
import { Tab } from "react-bootstrap";
import { FileWithPath } from "@mantine/dropzone";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import TakeImage from "./takeimage";
import ImageLayout from "./layout";
import { recognizedperson } from "../../../../../../app/types";
import { useDisclosure } from "@mantine/hooks";

type dataprops = {
  image?: Record<string, unknown>;
  url?: string;
  type: "url_image" | "local_image";
  userId: string;
  predictionType: "Audio" | "Image";
};

interface imageprops {
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
  showcapture: boolean;
  people: recognizedperson[];
  setPeople: React.Dispatch<React.SetStateAction<recognizedperson[]>>;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  files: FileWithPath[];
  HandlePredictions: (postdata: dataprops) => Promise<recognizedperson[]>;
}
const ImageRecognition = ({
  setShowCapture,
  showcapture,
  setPeople,
  people,
  setFiles,
  files,
  HandlePredictions,
}: imageprops) => {
  const webcamRef = useRef<Webcam>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [resource, setResource] = useState("Upload Image");
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<null | boolean>(null);
  const [visible, { open, close }] = useDisclosure(false);

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
    <Box pos="relative" p={2}>
      <LoadingOverlay
        visible={visible}
        loaderProps={{
          children: (
            <div>
              <Loader color="blue" type="bars" />
              <p>processing.... please wait</p>
            </div>
          ),
        }}
      />
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
          HandlePredictions={HandlePredictions}
          people={people}
          setPeople={setPeople}
          setUrl={setUrl}
          files={files}
          open={open}
          close={close}
        />
        <Grid>
          {
            <Grid.Col span={12}>
              {showcapture && (
                <TakeImage imgSrc={imgSrc} webcamRef={webcamRef} />
              )}
            </Grid.Col>
          }
        </Grid>
      </Tab.Pane>
    </Box>
  );
};

export default ImageRecognition;
