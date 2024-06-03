import {
  Button,
  Grid,
  Image,
  Select,
  SimpleGrid,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconLink } from "@tabler/icons-react";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Webcam from "react-webcam";
import { useCallback, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import FsLightbox from "fslightbox-react";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { useAuthUser } from "../../../../../../contexts/authcontext";
import { recognizedperson } from "../../../../../../app/types";
import RecognitionsDisplay from "../../peopledisplay";

type dataprops = {
  image?: Record<string, unknown>;
  url?: string;
  type: "url_image" | "local_image";
  userId: string;
  predictionType: "Audio" | "Image";
};

type layout = {
  showcapture: boolean;
  setResource: React.Dispatch<React.SetStateAction<string>>;
  resource: string;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  files: FileWithPath[];
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
  imgSrc: string | null;
  isValid: boolean | null;
  webcamRef: React.RefObject<Webcam>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setImgSrc: React.Dispatch<React.SetStateAction<string | null>>;
  HandlePredictions: (data: dataprops) => Promise<recognizedperson[]>;
  people: recognizedperson[];
  setPeople: React.Dispatch<React.SetStateAction<recognizedperson[]>>;
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

const ImageLayout = ({
  showcapture,
  setResource,
  resource,
  setFiles,
  setIsValid,
  setShowCapture,
  imgSrc,
  isValid,
  setUrl,
  setImgSrc,
  webcamRef,
  HandlePredictions,
  files,
  setPeople,
  open,
  close,
  people,
}: layout) => {
  const [toggler, setToggler] = useState<boolean>(false);
  const [sources, setSources] = useState<string[]>([]);
  const appState = useAppState();
  const [upload] = usePostDataMutation({});
  const { id } = useAuthUser();
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setUrl(value);
    setIsValid(validateUrl(value));
    setShowCapture(false);
  };

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setImgSrc(imageSrc);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
  };

  const handleImagePrediction = async () => {
    try {
      open();
      const formdata = new FormData();
      formdata.append("image", files[0]);
      const response: any = await upload({
        url: "/admin/upload",
        data: formdata,
      });
      if ("error" in response) {
        throw response.error;
      }
      const imagetopredict = response.data.images[0];
      const res = await HandlePredictions({
        image: imagetopredict,
        type: "local_image",
        url: "",
        userId: id,
        predictionType: "Image",
      });
      setPeople(res);
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };
  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index}>
        <Image
          onClick={() => {
            setToggler(!toggler);
          }}
          src={imageUrl}
          onLoad={() => URL.revokeObjectURL(imageUrl)}
        />
      </div>
    );
  });

  return (
    <Grid>
      <FsLightbox toggler={toggler} type="image" sources={sources} />
      <Grid.Col span={8}>
        {!showcapture && (
          <Select
            placeholder="choose another resource type"
            searchable
            defaultValue={resource}
            allowDeselect={false}
            onChange={(value) => {
              setResource(value as string);
              setIsValid(null);
              setShowCapture(false);
            }}
            data={["Upload Image", "Image Url"]}
          />
        )}
        {showcapture && (
          <div>
            {imgSrc && (
              <Button
                w="50%"
                leftSection={<PhotoCameraIcon />}
                onClick={retake}
              >
                Retake
              </Button>
            )}
            {!imgSrc && (
              <Button
                w="30%"
                leftSection={<SaveIcon />}
                onClick={capture}
                variant="gradient"
              >
                Capture
              </Button>
            )}
          </div>
        )}
      </Grid.Col>
      <Grid.Col span={4}>
        <Button
          w="100%"
          leftSection={<PhotoCameraIcon />}
          onClick={() => {
            setShowCapture(!showcapture);
          }}
        >
          {showcapture ? "Close" : " Take Photo"}
        </Button>
      </Grid.Col>
      <Grid.Col span={12}>
        {resource === "Upload Image" && (
          <div>
            <Dropzone
              accept={IMAGE_MIME_TYPE}
              onDrop={async (files) => {
                setFiles(files);
                setShowCapture(false);
                const imagfiles = files.map((file) =>
                  URL.createObjectURL(file)
                );
                setSources(imagfiles);
              }}
              maxSize={5 * 1024 ** 2}
              multiple={false}
            >
              <Text ta="center">Drop images here</Text>
            </Dropzone>
            <div>
              {previews.length > 0 && (
                <Button
                  onClick={() => handleImagePrediction()}
                  mt={2}
                  leftSection={<SendIcon />}
                >
                  Process
                </Button>
              )}
              <SimpleGrid
                cols={{ base: 1, sm: 4 }}
                mt={previews.length > 0 ? "xl" : 0}
              >
                {previews}
                {people.length > 0 && (
                  <Grid>
                    <RecognitionsDisplay people={people} />
                  </Grid>
                )}
              </SimpleGrid>
            </div>
          </div>
        )}
        {resource === "Image Url" && (
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
    </Grid>
  );
};

export default ImageLayout;
