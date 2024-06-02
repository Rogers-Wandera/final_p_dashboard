import Webcam from "react-webcam";
import ReactPlayer from "react-player";
import { Box, Grid } from "@mantine/core";
import { Typography } from "@mui/material";

type layout = {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  webcamRef: React.RefObject<Webcam>;
  url: string;
  isValid: boolean | null;
};

const StreamLayOut = ({
  devices,
  selectedDeviceId,
  webcamRef,
  isValid,
  url,
}: layout) => {
  return (
    <Box>
      <Grid>
        {isValid && (
          <Grid.Col span={12}>
            <Typography variant="h6">Streaming from {url}</Typography>
            <ReactPlayer url={url} style={{ margin: "1rem 0" }} />
          </Grid.Col>
        )}
        {selectedDeviceId === "All" ? (
          devices.map((device) => (
            <Grid.Col span={12} key={device.deviceId}>
              <Typography>
                {device.label || `Camera ${device.deviceId}`}
              </Typography>
              <Webcam
                audio={false}
                ref={webcamRef}
                videoConstraints={{ deviceId: device.deviceId }}
              />
            </Grid.Col>
          ))
        ) : (
          <Grid.Col span={12}>
            {devices
              .filter((device) => device.deviceId === selectedDeviceId)
              .map((device) => (
                <div key={device.deviceId}>
                  <h2>{device.label || `Camera ${device.deviceId}`}</h2>
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    videoConstraints={{ deviceId: device.deviceId }}
                  />
                </div>
              ))}
          </Grid.Col>
        )}
      </Grid>
    </Box>
  );
};

export default StreamLayOut;
