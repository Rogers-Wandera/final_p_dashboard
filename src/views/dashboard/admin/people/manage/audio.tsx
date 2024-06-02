import { Grid, Card, Text, Group, Tooltip } from "@mantine/core";
import { Cancel } from "@mui/icons-material";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useTableTheme } from "../../../../../helpers/tabletheme";

export type audiocomponent = {
  type: "file" | "url";
  url?: string;
  file?: File;
  title?: string;
  id: string;
  Removed?: (id: string) => void;
  col?: number;
};
const AudioView = ({
  url = "",
  id = "",
  type = "url",
  file = undefined,
  title = "",
  col = 6,
  Removed = () => {},
}: audiocomponent) => {
  const theme = useTableTheme();
  return (
    <Grid.Col span={col} mb="xs">
      <Card
        shadow="sm"
        padding="lg"
        radius="md"
        withBorder
        styles={{
          root: {
            backgroundColor: theme.palette.background.default,
            color: theme.palette.mode === "dark" ? "white" : "black",
          },
        }}
      >
        <Group justify="space-between" mb="xs">
          <Tooltip label={title}>
            <Text fw={400}>{title?.substring(0, 20)} </Text>
          </Tooltip>
          <Cancel
            color="error"
            sx={{ cursor: "pointer" }}
            onClick={() => Removed(id)}
          />
        </Group>
        <Card.Section component="div">
          {type === "url" && (
            <AudioPlayer
              autoPlayAfterSrcChange={false}
              src={url}
              autoPlay={false}
              muted={true}
            />
          )}
          {type === "file" && (
            <AudioPlayer
              style={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.mode === "dark" ? "white" : "black",
              }}
              muted={true}
              autoPlayAfterSrcChange={false}
              src={URL.createObjectURL(file as File)}
              autoPlay={false}
            />
          )}
        </Card.Section>
      </Card>
    </Grid.Col>
  );
};

export default AudioView;
