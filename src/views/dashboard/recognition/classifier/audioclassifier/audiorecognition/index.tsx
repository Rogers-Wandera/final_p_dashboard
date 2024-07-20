import { Tab } from "react-bootstrap";
import LayOut from "./layout";
import { useState } from "react";
import { IFileWithMeta, StatusValue } from "react-dropzone-uploader";
import { recognizedperson } from "../../../../../../app/types";

type props = {
  open: () => void;
  close: () => void;
};

const AudioRecognition = ({ open, close }: props) => {
  const [file, setFile] = useState<IFileWithMeta | null>(null);
  const [people, setPeople] = useState<recognizedperson[]>([]);
  const [show, setShow] = useState<{ toggler: boolean; slide: number }>({
    toggler: false,
    slide: 1,
  });
  const [predictedsources, setPredictedSources] = useState<{
    imgs: string[];
  }>({ imgs: [] });

  const handleChangeStatus = (file: IFileWithMeta, status: StatusValue) => {
    open();
    setPeople([]);
    if (status === "done") {
      setFile(file);
    } else {
      setFile(null);
    }
    close();
  };
  return (
    <Tab.Pane eventKey="audio-recognition" id="audio-recognition">
      <LayOut
        setFile={setFile}
        setPeople={setPeople}
        setPredictedSources={setPredictedSources}
        setShow={setShow}
        people={people}
        predictedsources={predictedsources}
        handleChangeStatus={handleChangeStatus}
        file={file}
        show={show}
        open={open}
        close={close}
      />
    </Tab.Pane>
  );
};

export default AudioRecognition;
