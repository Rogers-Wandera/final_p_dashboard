import { Tab } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import {
  Alert,
  Button,
  Checkbox,
  Image,
  Loader,
  LoadingOverlay,
  SimpleGrid,
  Text,
  Tooltip,
} from "@mantine/core";
import { Gallery } from "react-grid-gallery";
import { format } from "date-fns";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FsLightbox from "fslightbox-react";
import { IconButton } from "@mui/material";
import { useTableTheme } from "../../../../../helpers/tabletheme";
import { modals } from "@mantine/modals";
import { useAppDispatch } from "../../../../../hooks/hook";
import { deleteDataApi } from "../../../../../store/services/thunks";
import { enqueueSnackbar } from "notistack";
import { handleError } from "../../../../../helpers/utils";
import { useAppState } from "../../../../../contexts/sharedcontexts";
import { useDisclosure } from "@mantine/hooks";
import { usePostDataMutation } from "../../../../../store/services/apislice";
import { customImage } from "../manageperson";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoIcon from "@mui/icons-material/Info";

export type personimageprops = {
  personId: string;
  images: personimagestypes[];
  setImages: React.Dispatch<React.SetStateAction<personimagestypes[]>>;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
};

export type personimagestypes = {
  id: number;
  personId: string;
  imageUrl: string;
  timestamp: string;
  publicId: string;
};
const PersonImages = ({
  personId,
  images,
  reload,
  setReload,
}: personimageprops) => {
  const [showimages, setShowImages] = useState<customImage[]>([]);
  const [files, setFiles] = useState<FileWithPath[]>([]);
  const [uploadimage] = usePostDataMutation();
  const [loading, setLoading] = useState<boolean>(false);
  const [toggler, setToggler] = useState<boolean>(false);
  const [sources, setSources] = useState<string[]>([]);
  const [selected, setSelected] = useState<customImage[]>([]);
  const [checked, setChecked] = useState<boolean>(false);
  const theme = useTableTheme();
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const [visible, { open, close }] = useDisclosure();

  const previews = files.map((file, index) => {
    const imageUrl = URL.createObjectURL(file);
    return (
      <div key={index}>
        <Image src={imageUrl} onLoad={() => URL.revokeObjectURL(imageUrl)} />
        <Button
          onClick={() => handleDeleteFile(index)}
          size="sm"
          variant="light"
          style={{ marginTop: "10px" }}
        >
          <DeleteForeverIcon
            color={theme.palette.mode === "dark" ? "secondary" : "error"}
          />
        </Button>
      </div>
    );
  });

  const handleDeleteFile = (index: number) => {
    const removeFile = files.filter((_, i) => i !== index);
    setFiles(removeFile);
  };

  const handleDeleteImages = () => {
    return modals.openConfirmModal({
      title: "Delete Images",
      centered: true,
      children: (
        <Text size="md">
          Are you sure, you want to delete these images? <br />
          <b>This action cannot be undone</b>
        </Text>
      ),
      labels: { confirm: "Yes Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          open();
          const data: { publicId: string; imageId: string }[] = selected.map(
            (img) => {
              return { publicId: img.publicId, imageId: img.id.toString() };
            }
          );
          const response: any = await dispatch(
            deleteDataApi({
              url: `/person/images/multiple/delete/${personId}`,
              data: { data: data },
            })
          );
          if (response.payload?.error) {
            throw response.payload.error;
          }
          const message = response.payload?.data?.msg || "Deleted successfully";
          enqueueSnackbar(message, {
            variant: "success",
            anchorOrigin: { horizontal: "right", vertical: "top" },
          });
          close();
          setReload(!reload);
        } catch (error) {
          close();
          handleError(error, appState, enqueueSnackbar);
          setReload(!reload);
        }
      },
    });
  };
  const HandleFormatShowImages = () => {
    if (images.length > 0) {
      const previews: customImage[] = images.map((image) => {
        return {
          src: image.imageUrl,
          width: 400,
          height: 500,
          caption: format(new Date(image.timestamp), "yyyy-MM-dd hh:mm a"),
          publicId: image.publicId,
          id: image.id,
        };
      });
      setSources([...images.map((img) => img.imageUrl)]);
      setShowImages(previews);
    }
  };

  const HandleSelect = (index: number) => {
    const nextImages = showimages.map((image, i) =>
      i === index ? { ...image, isSelected: !image.isSelected } : image
    );
    setShowImages(nextImages);
    setSelected(nextImages.filter((image) => image.isSelected));
  };
  const HandleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextImages = showimages.map((image) => {
      return { ...image, isSelected: e.target.checked };
    });
    setShowImages(nextImages);
    setSelected(() => (e.target.checked ? nextImages : []));
  };

  const UploadImages = async () => {
    try {
      setLoading(true);
      open();
      const formdata = new FormData();
      files.forEach((file) => {
        formdata.append("image", file);
      });
      const response: any = await uploadimage({
        url: "/admin/upload",
        data: formdata,
      });
      if ("error" in response) {
        throw response.error;
      }
      let message = "Something went wrong";
      console.log(response);
      if (response?.data?.images) {
        const uploads = await uploadimage({
          url: "/person/images/" + personId,
          data: response?.data,
        });
        if ("error" in uploads) {
          throw uploads.error;
        }
        message = uploads.data?.msg || "Uploaded successfully";
      }
      setLoading(false);
      close();
      enqueueSnackbar(message, {
        variant: "info",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      close();
      setFiles([]);
      setReload(!reload);
    } catch (error) {
      setLoading(false);
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };
  useEffect(() => {
    HandleFormatShowImages();
  }, [images]);

  if (visible) {
    return (
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
        title="Uploading..."
        loaderProps={{ children: <Loader color="green" type="oval" /> }}
      />
    );
  }
  return (
    <Tab.Pane eventKey="second" id="person-images">
      <FsLightbox toggler={toggler} type="image" sources={sources} />
      <div>
        <Dropzone
          accept={IMAGE_MIME_TYPE}
          onDrop={setFiles}
          maxSize={5 * 1024 ** 2}
          multiple={true}
        >
          <Text ta="center">Drop images here</Text>
        </Dropzone>

        <div>
          {previews.length > 0 && (
            <Button m={"md"} onClick={UploadImages} loading={loading}>
              Upload <CloudUploadIcon sx={{ ml: 1 }} />
            </Button>
          )}
          <SimpleGrid
            cols={{ base: 1, sm: 4 }}
            mt={previews.length > 0 ? "xl" : 0}
          >
            {previews}
          </SimpleGrid>
        </div>
      </div>

      <div>
        <div className="mx-4 my-4 d-flex justify-content-between">
          <div>
            {showimages.length > 0 && (
              <Checkbox
                checked={checked}
                onChange={(e) => {
                  setChecked((prevChecked) => !prevChecked);
                  HandleSelectAll(e);
                }}
                label="Select All"
              />
            )}
          </div>
          {selected.length > 0 && (
            <div>
              <Tooltip label="Delete">
                <IconButton onClick={() => handleDeleteImages()}>
                  <DeleteForeverIcon
                    color={
                      theme.palette.mode === "dark" ? "secondary" : "error"
                    }
                  />
                </IconButton>
              </Tooltip>
            </div>
          )}
        </div>
        {showimages.length <= 0 && (
          <Alert
            variant={theme.palette.mode === "dark" ? "filled" : "light"}
            color="blue"
            title="No images"
            icon={<InfoIcon />}
          >
            No images for the person found, please upload images
          </Alert>
        )}
        {showimages.length > 0 && (
          <Gallery
            images={showimages}
            enableImageSelection={true}
            onClick={() => {
              setToggler(!toggler);
            }}
            onSelect={HandleSelect}
          />
        )}
      </div>
    </Tab.Pane>
  );
};

export default PersonImages;
