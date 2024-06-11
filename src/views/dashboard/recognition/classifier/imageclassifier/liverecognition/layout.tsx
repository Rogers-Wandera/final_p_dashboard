import { Grid, Select, Switch, TextInput } from "@mantine/core";
import { IconLink } from "@tabler/icons-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import StreamLayOut from "./streamlayout";
import { useConnection } from "../../../../../../contexts/connectioncontext";
import { RootState, useAuthUser } from "../../../../../../contexts/authcontext";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { useSelector } from "react-redux";

type layout = {
  setSelectedDeviceId: React.Dispatch<React.SetStateAction<string | null>>;
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  isValid: boolean | null;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
};

const validateUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

const LiveLayout = ({
  devices,
  setSelectedDeviceId,
  setChecked,
  setIsValid,
  setUrl,
  isValid,
  checked,
  selectedDeviceId,
  url,
}: layout) => {
  const [capturing, setCapturing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const socket = useConnection();
  const { token } = useSelector((state: RootState) => state.appState.authuser);
  const appstate = useAppState();
  const { id } = useAuthUser();
  const [postData] = usePostDataMutation();
  const [data, setData] = React.useState<{ label: string; value: string }[]>(
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
    setIsValid(validateUrl(value));
    setCapturing(false);
  };

  const HandleStartVideoCapture = useCallback(async () => {
    try {
      if (selectedDeviceId) {
        const response = await postData({
          url: "/classifier/live/start",
          data: {},
        });
        if ("error" in response) {
          throw response.error;
        }
        const user: { id: string } = response.data.data;
        socket?.emit("startstream", {
          userId: user.id,
          stream: true,
          token,
        });
      }
    } catch (error) {
      handleError(error, appstate, enqueueSnackbar);
    }
  }, [selectedDeviceId, capturing]);

  const HandleStopVideoCapture = async () => {
    try {
      if (capturing) {
        const response = await postData({
          url: "/classifier/live/stop",
          data: {},
        });
        if ("error" in response) {
          throw response.error;
        }
        const user: { id: string } = response.data.data;
        socket?.emit("stopstream", {
          userId: user.id,
          token,
        });
        setSelectedDeviceId(null);
        setCapturing(false);
      }
    } catch (error) {
      handleError(error, appstate, enqueueSnackbar);
    }
  };

  const handleStreamError = (data: any) => {
    enqueueSnackbar(data.message || data, {
      variant: "error",
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
  };

  const handleStreamedVideo = (data: any) => {
    enqueueSnackbar(data, {
      variant: "success",
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
    setCapturing(true);
  };

  const handleVideoStreamData = (data: { userId: string; frame: string }) => {
    if (id === data.userId) {
      const image = new Image();
      image.src = `data:image/jpeg;base64,${data.frame}`;
      if (canvasRef.current) {
        const context = canvasRef.current?.getContext("2d");
        image.onload = () => {
          context?.drawImage(image, 0, 0);
        };
      }
    }
  };

  useEffect(() => {
    const dt = [{ label: "All devices", value: "All" }];
    devices.forEach((device) => {
      dt.push({ label: device.label, value: device.deviceId });
    });
    setData(dt);
  }, [devices, selectedDeviceId]);

  useEffect(() => {
    if (socket) {
      socket.on("stream_error", handleStreamError);
      socket.on("streaminfo", handleStreamedVideo);
      socket.on("videostream", handleVideoStreamData);
    }
    return () => {
      if (socket) {
        socket.off("stream_error", handleStreamError);
        socket.off("streaminfo", handleStreamedVideo);
      }
    };
  }, [socket]);
  return (
    <Grid>
      <Grid.Col span={8}>
        {checked && (
          <Select
            placeholder="choose connected resource"
            searchable
            clearable
            value={selectedDeviceId}
            nothingFoundMessage="No options"
            data={data}
            onChange={(value) => {
              setSelectedDeviceId(value);
              setCapturing(false);
            }}
            onClear={() => {
              canvasRef.current = null;
              if (capturing) {
                HandleStopVideoCapture();
              }
            }}
            // onClear={() => HandleStopVideoCapture()}
          />
        )}
        {!checked && (
          <div>
            <TextInput
              placeholder="Enter url here"
              error={isValid === false}
              onChange={handleChange}
              rightSection={<IconLink />}
            />
            {isValid === false && (
              <p style={{ color: "red" }}>Please enter a valid URL.</p>
            )}
          </div>
        )}
      </Grid.Col>
      <Grid.Col span={4}>
        <Switch
          checked={checked}
          size="md"
          label={checked ? "Switch to url" : "Switch to connected devices"}
          onLabel="Camera"
          offLabel="Url"
          onChange={(event) => setChecked(event.currentTarget.checked)}
        />
      </Grid.Col>
      <StreamLayOut
        canvasRef={canvasRef}
        url={url}
        isValid={isValid}
        devices={devices}
        capturing={capturing}
        selectedDeviceId={selectedDeviceId}
        HandleStartVideoCapture={HandleStartVideoCapture}
        HandleStopVideoCapture={HandleStopVideoCapture}
      />
    </Grid>
  );
};

export default LiveLayout;
