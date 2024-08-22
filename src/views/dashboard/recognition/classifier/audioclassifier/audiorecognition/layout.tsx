import { Badge, Box, Button, Flex, Grid } from "@mantine/core";
import Dropzone, { IFileWithMeta, StatusValue } from "react-dropzone-uploader";
import AudioView from "../../../../admin/people/manage/audio";
import { IconFileUpload } from "@tabler/icons-react";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { recognizedperson } from "../../../../../../app/types";
import { Carousel } from "@mantine/carousel";
import RecognitionsDisplay from "../../peopledisplay";
import FsLightbox from "fslightbox-react";

type props = {
  setPeople: React.Dispatch<React.SetStateAction<recognizedperson[]>>;
  people: recognizedperson[];
  setPredictedSources: React.Dispatch<
    React.SetStateAction<{
      imgs: string[];
    }>
  >;
  predictedsources: {
    imgs: string[];
  };
  setFile: React.Dispatch<React.SetStateAction<IFileWithMeta | null>>;
  file: IFileWithMeta | null;
  setShow: React.Dispatch<
    React.SetStateAction<{
      toggler: boolean;
      slide: number;
    }>
  >;
  show: {
    toggler: boolean;
    slide: number;
  };
  handleChangeStatus: (file: IFileWithMeta, status: StatusValue) => void;
  open: () => void;
  close: () => void;
};

const LayOut = ({
  file,
  people,
  setPeople,
  setPredictedSources,
  predictedsources,
  setShow,
  show,
  handleChangeStatus,
  open,
  close,
}: props) => {
  const appState = useAppState();
  const [uploadAudio] = usePostDataMutation();

  const HandleProcessAudio = async () => {
    try {
      open();
      if (!file) return;
      const formdata = new FormData();
      formdata.append("audio", file?.file);
      const response = await uploadAudio({
        url: "/classifier/audio",
        data: formdata,
      });
      if ("error" in response) {
        throw response.error;
      }
      const resdata = response.data.data as recognizedperson[];
      setPeople(resdata);
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  const updateMatch = async (
    classifierId: number,
    found: 1 | 0,
    personId: string
  ) => {
    try {
      open();
      const response = await uploadAudio({
        url: `/classifier/${personId}/${classifierId}/${found}`,
        data: {},
        method: "PATCH",
      });
      if ("error" in response) {
        throw response.error;
      }
      const resdata = response.data.data as recognizedperson[];
      setPeople(resdata);
      enqueueSnackbar(response.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };
  return (
    <Grid>
      <FsLightbox
        toggler={show.toggler}
        slide={show.slide}
        type="image"
        loadOnlyCurrentSource={true}
        sources={predictedsources.imgs}
        onClose={(instance) => {
          instance.setState({ toggler: false, sources: [] });
          setPredictedSources({ imgs: [] });
        }}
      />
      <Grid.Col span={12}>
        {file && (
          <Box>
            <Flex justify="space-between">
              <AudioView
                title={file.meta.name}
                type="file"
                id={file.meta.id}
                file={file.file}
                Removed={file.remove}
              />
              <div>
                <Button
                  leftSection={<IconFileUpload />}
                  mt={20}
                  onClick={HandleProcessAudio}
                >
                  Process
                </Button>
                {people.length > 0 && (
                  <Grid.Col span={4} mt={10}>
                    <Badge color="green">{people.length} Results Found</Badge>
                  </Grid.Col>
                )}
              </div>
            </Flex>
          </Box>
        )}
        {!file && (
          <Dropzone
            onChangeStatus={handleChangeStatus}
            accept="audio/*"
            maxFiles={1}
            autoUpload={false}
            submitButtonContent="Upload Audios"
            inputContent="Drop Audio Files"
          />
        )}
      </Grid.Col>
      <Grid mt={10}>
        <Grid.Col span={12}>
          {people.length > 0 && (
            <Carousel>
              {people.map((person) => {
                return (
                  <Carousel.Slide key={person.id}>
                    <RecognitionsDisplay
                      person={person}
                      show={show}
                      setShow={setShow}
                      setPredictedSources={setPredictedSources}
                      updateMatch={updateMatch}
                      people={people}
                    />
                  </Carousel.Slide>
                );
              })}
            </Carousel>
          )}
        </Grid.Col>
      </Grid>
    </Grid>
  );
};

export default LayOut;
