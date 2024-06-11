import ReactPlayer from "react-player";
import { Box, Button, Grid } from "@mantine/core";
import { Typography } from "@mui/material";

type layout = {
  devices: MediaDeviceInfo[];
  selectedDeviceId: string | null;
  url: string;
  isValid: boolean | null;
  capturing: boolean;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  HandleStartVideoCapture: () => void;
  HandleStopVideoCapture: () => void;
};

const StreamLayOut = ({
  devices,
  selectedDeviceId,
  canvasRef,
  isValid,
  url,
  capturing,
  HandleStartVideoCapture,
  HandleStopVideoCapture,
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
        {selectedDeviceId && (
          <div style={{ margin: "1rem 1rem" }}>
            {capturing ? (
              <Button onClick={HandleStopVideoCapture} variant="gradient">
                End Live Stream
              </Button>
            ) : (
              <Button variant="light" onClick={HandleStartVideoCapture}>
                Start Live Stream
              </Button>
            )}
            {capturing && (
              <div>
                {selectedDeviceId === "All" ? (
                  devices.map((device) => (
                    <Grid.Col span={12} key={device.deviceId}>
                      <Typography>
                        {device.label || `Camera ${device.deviceId}`}
                      </Typography>
                      <canvas ref={canvasRef} width={400} height={400} />
                    </Grid.Col>
                  ))
                ) : (
                  <Grid.Col span={12}>
                    {devices
                      .filter((device) => device.deviceId === selectedDeviceId)
                      .map((device) => (
                        <div key={device.deviceId}>
                          <h2>{device.label || `Camera ${device.deviceId}`}</h2>
                          <canvas ref={canvasRef} width={400} height={400} />
                        </div>
                      ))}
                  </Grid.Col>
                )}
              </div>
            )}
          </div>
        )}
      </Grid>
    </Box>
  );
};

export default StreamLayOut;
