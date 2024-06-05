import {
  Badge,
  Button,
  Grid,
  Image,
  Select,
  Text,
  TextInput,
} from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconLink } from "@tabler/icons-react";
import SaveIcon from "@mui/icons-material/Save";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Webcam from "react-webcam";
import { useCallback, useEffect, useState } from "react";
import SendIcon from "@mui/icons-material/Send";
import FsLightbox from "fslightbox-react";
import { handleError } from "../../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../../contexts/sharedcontexts";
import { usePostDataMutation } from "../../../../../../store/services/apislice";
import { useAuthUser } from "../../../../../../contexts/authcontext";
import { recognizedperson } from "../../../../../../app/types";
import RecognitionsDisplay from "../../peopledisplay";
import { Carousel } from "@mantine/carousel";

type dataprops = {
  image?: Record<string, unknown>;
  url?: string;
  type: "url_image" | "local_image" | "blob";
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
  url: string;
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
  url,
  people,
}: layout) => {
  const [toggler, setToggler] = useState<boolean>(false);
  const [previews, setPreviews] = useState<JSX.Element[]>([]);
  const [show, setShow] = useState<{ toggler: boolean; slide: number }>({
    toggler: false,
    slide: 1,
  });
  const [sources, setSources] = useState<string[]>([]);
  const [predictedsources, setPredictedSources] = useState<{
    imgs: string[];
  }>({ imgs: [] });
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
      const imageSrc: string = webcamRef.current.getScreenshot() as string;
      setImgSrc(imageSrc);
      setFiles([]);
      setUrl("");
      setResource("");
      setPeople([]);
      const previews = [
        <Grid.Col span={3} key={imageSrc}>
          <Image
            onClick={() => {
              setToggler(!toggler);
              setSources([imageSrc]);
            }}
            src={imageSrc}
          />
        </Grid.Col>,
      ];
      setPreviews(previews);
    }
  }, [webcamRef]);

  const retake = () => {
    setImgSrc(null);
    setPreviews([]);
    setPeople([]);
    setResource("");
  };
  const handleImagePrediction = async (
    type: "url_image" | "local_image" | "blob"
  ) => {
    try {
      open();
      if (type === "local_image") {
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
      } else if (type === "blob") {
        const res = await HandlePredictions({
          image: {},
          type: "blob",
          url: imgSrc as string,
          userId: id,
          predictionType: "Image",
        });
        setPeople(res);
      } else {
        const res = await HandlePredictions({
          image: {},
          type: "url_image",
          url: url,
          userId: id,
          predictionType: "Image",
        });
        setPeople(res);
      }
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
      const response = await upload({
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

  const HandleShowPreviews = (files: FileWithPath[] | string) => {
    let previews: JSX.Element[] = [];
    if (Array.isArray(files)) {
      previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        const imageUrl2 = URL.createObjectURL(file);
        return (
          <Grid.Col span={3} key={index}>
            <Image
              onClick={() => {
                setToggler(!toggler);
                setSources([imageUrl2]);
              }}
              src={imageUrl}
              onLoad={() => URL.revokeObjectURL(imageUrl)}
            />
          </Grid.Col>
        );
      });
    } else {
      previews = [
        <Grid.Col span={3} key={files}>
          <Image
            onClick={() => {
              setToggler(!toggler);
              setSources([files]);
            }}
            src={files}
          />
        </Grid.Col>,
      ];
    }
    setPreviews(previews);
  };

  useEffect(() => {
    if (resource === "Image Url") {
      if (isValid === true) {
        HandleShowPreviews(url);
      }
    }
  }, [resource, url]);
  return (
    <Grid>
      <FsLightbox
        toggler={toggler}
        type="image"
        sources={sources}
        onClose={() => {
          if (resource === "Image Url") {
            HandleShowPreviews(url);
          } else if (resource === "Upload Image") {
            HandleShowPreviews(files);
          } else {
            HandleShowPreviews(imgSrc as string);
          }
        }}
      />
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
              setFiles([]);
              setPeople([]);
              setImgSrc(null);
              setUrl("");
              setPreviews([]);
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
            setFiles([]);
            setPeople([]);
            setPreviews([]);
            setResource("");
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
                HandleShowPreviews(files);
                setUrl("");
                setImgSrc("");
                setPeople([]);
              }}
              maxSize={5 * 1024 ** 2}
              multiple={false}
            >
              <Text ta="center">Drop images here</Text>
            </Dropzone>
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
        <div>
          {previews.length > 0 && (
            <Grid>
              <Grid.Col span={8}>
                <Button
                  onClick={async () => {
                    console.log(resource);
                    if (resource === "Upload Image") {
                      await handleImagePrediction("local_image");
                    } else if (resource === "Image Url") {
                      await handleImagePrediction("url_image");
                    } else {
                      await handleImagePrediction("blob");
                    }
                  }}
                  mt={10}
                  leftSection={<SendIcon />}
                >
                  Process
                </Button>
              </Grid.Col>
              {people.length > 0 && (
                <Grid.Col span={4} mt={10}>
                  <Badge color="green">{people.length} Results Found</Badge>
                </Grid.Col>
              )}
            </Grid>
          )}
          <Grid mt={10}>
            {previews}
            <Grid.Col span={9}>
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
        </div>
      </Grid.Col>
    </Grid>
  );
};

export default ImageLayout;
