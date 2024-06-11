import { useEffect, useState } from "react";
import { Tab } from "react-bootstrap";
import LiveLayout from "./layout";

type liveprops = {
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  selectedDeviceId: string | null;
};
const LiveRecognition = ({
  selectedDeviceId,
  setSelectedDeviceId,
}: liveprops) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [checked, setChecked] = useState(true);
  const [url, setUrl] = useState("");
  const [isValid, setIsValid] = useState<null | boolean>(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setDevices(videoDevices);
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    };

    getDevices();
  }, []);

  useEffect(() => {
    if (checked) {
      setUrl("");
      setIsValid(null);
    }
  }, [checked]);

  return (
    <Tab.Pane eventKey="live-recognition" id="live-recognition">
      <LiveLayout
        devices={devices}
        setSelectedDeviceId={setSelectedDeviceId}
        selectedDeviceId={selectedDeviceId}
        setChecked={setChecked}
        checked={checked}
        setIsValid={setIsValid}
        isValid={isValid}
        setUrl={setUrl}
        url={url}
      />
    </Tab.Pane>
  );
};

export default LiveRecognition;
