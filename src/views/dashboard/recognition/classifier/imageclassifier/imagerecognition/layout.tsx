import { Button, Grid, Select, Text, TextInput } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconLink } from "@tabler/icons-react";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Webcam from "react-webcam";
import { useCallback } from "react";

type layout = {
  showcapture: boolean;
  setResource: React.Dispatch<React.SetStateAction<string>>;
  resource: string;
  setFiles: React.Dispatch<React.SetStateAction<FileWithPath[]>>;
  setIsValid: React.Dispatch<React.SetStateAction<boolean | null>>;
  setShowCapture: React.Dispatch<React.SetStateAction<boolean>>;
  imgSrc: string | null;
  isValid: boolean | null;
  webcamRef: React.RefObject<Webcam>;
  setUrl: React.Dispatch<React.SetStateAction<string>>;
  setImgSrc: React.Dispatch<React.SetStateAction<string | null>>;
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
}: layout) => {
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

  return (
    <Grid>
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
          <Dropzone
            accept={IMAGE_MIME_TYPE}
            onDrop={(files) => {
              setFiles(files);
              setShowCapture(false);
            }}
            maxSize={5 * 1024 ** 2}
            multiple={false}
          >
            <Text ta="center">Drop images here</Text>
          </Dropzone>
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
