import { Tab } from "react-bootstrap";
import LayOut from "./layout";
type liveprops = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  url: string;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  isValid: boolean | null;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
};
const LiveRecognition = ({
  checked,
  setChecked,
  setUrl,
  isValid,
  setIsValid,
}: liveprops) => {
  return (
    <Tab.Pane eventKey="liveaudio-recognition" id="liveaudio-recognition">
      <LayOut
        checked={checked}
        setChecked={setChecked}
        isValid={isValid}
        setIsValid={setIsValid}
        setUrl={setUrl}
      />
    </Tab.Pane>
  );
};

export default LiveRecognition;
