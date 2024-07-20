import { Tab } from "react-bootstrap";
import LayOut from "./layout";
import { recognizedperson } from "../../../../../../app/types";
type liveprops = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isValid: boolean | null;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  setPeople: React.Dispatch<React.SetStateAction<recognizedperson[]>>;
  people: recognizedperson[];
  open: () => void;
  close: () => void;
};
const LiveRecognition = ({
  checked,
  setChecked,
  setUrl,
  isValid,
  setIsValid,
  url,
  setPeople,
  people,
  open,
  close,
}: liveprops) => {
  return (
    <Tab.Pane eventKey="liveaudio-recognition" id="liveaudio-recognition">
      <LayOut
        checked={checked}
        setChecked={setChecked}
        isValid={isValid}
        setIsValid={setIsValid}
        setUrl={setUrl}
        url={url}
        people={people}
        setPeople={setPeople}
        open={open}
        close={close}
      />
    </Tab.Pane>
  );
};

export default LiveRecognition;
