import { Alert, Badge, Button, Grid, Switch, TextInput } from "@mantine/core";
import { AudioRecorder } from "react-audio-voice-recorder";
import { IconFileUpload, IconInfoCircle, IconLink } from "@tabler/icons-react";
import AudioView from "../../../../admin/people/manage/audio";
import { recognizedperson } from "../../../../../../app/types";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { enqueueSnackbar } from "notistack";
import { handleError } from "../../../../../../helpers/utils";
import { useState } from "react";
import FsLightbox from "fslightbox-react";
import { Carousel } from "@mantine/carousel";
import RecognitionsDisplay from "../../peopledisplay";

type layout = {
  checked: boolean;
  setChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  isValid: boolean | null;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  url: string;
  setPeople: React.Dispatch<React.SetStateAction<recognizedperson[]>>;
  people: recognizedperson[];
  open: () => void;
  close: () => void;
};

const validateUrl = (value: string) => {
  try {
    new URL(value);
    return true;
  } catch (e) {
    return false;
  }
};

const LayOut = ({
  checked,
  setChecked,
  isValid,
  setIsValid,
  setUrl,
  url,
  setPeople,
  people,
  close,
  open,
}: layout) => {
  const appState = useAppState();
  const [uploadAudio] = usePostDataMutation();
  const [show, setShow] = useState<{ toggler: boolean; slide: number }>({
    toggler: false,
    slide: 1,
  });
  const [predictedsources, setPredictedSources] = useState<{
    imgs: string[];
  }>({ imgs: [] });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
    setIsValid(validateUrl(value));
    setPeople([]);
  };
  const HandleProcessAudio = async () => {
    try {
      open();
      if (!url) return;
      const response = await uploadAudio({
        url: "/classifier/audio?type=url  ",
        data: { url: url },
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
      <Grid.Col span={8}>
        {!checked && (
          <div>
            {/* <AudioRecorder /> */}
            <Alert
              variant="light"
              color="cyan"
              title="Feature coming soon!"
              icon={<IconInfoCircle />}
            >
              The live audio Feature is coming soon.
            </Alert>
          </div>
        )}
        {checked && (
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
            {isValid && <AudioView type="url" url={url} id={url} col={12} />}
          </div>
        )}
      </Grid.Col>
      <Grid.Col span={4}>
        <Switch
          label={checked ? "Switch to devices" : "Switch to url"}
          onLabel="Devices"
          offLabel="Url"
          checked={checked}
          size="lg"
          onClick={(event) => setChecked(event.currentTarget.checked)}
        />
        {checked && isValid && (
          <Button
            leftSection={<IconFileUpload />}
            mt={20}
            onClick={HandleProcessAudio}
          >
            Process
          </Button>
        )}
        {people.length > 0 && (
          <Grid.Col span={4} mt={10}>
            <Badge color="green">{people.length} Results Found</Badge>
          </Grid.Col>
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
