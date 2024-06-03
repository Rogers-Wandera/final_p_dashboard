import { Grid } from "@mantine/core";
import Dropzone from "react-dropzone-uploader";

const LayOut = () => {
  return (
    <Grid>
      <Grid.Col span={12}>
        <Dropzone />
      </Grid.Col>
    </Grid>
  );
};

export default LayOut;
