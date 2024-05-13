import { useState } from "react";
import { Col, Row, Tab } from "react-bootstrap";
import Dropzone, {
  IDropzoneProps,
  IFileWithMeta,
  ILayoutProps,
  IPreviewProps,
  StatusValue,
} from "react-dropzone-uploader";
import AudioView from "./audio";
import { Grid, Loader, LoadingOverlay, Text } from "@mantine/core";
import { usePostDataMutation } from "../../../../../store/services/apislice";
import { handleError } from "../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../../contexts/sharedcontexts";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { useAppDispatch } from "../../../../../hooks/hook";
import { deleteDataApi } from "../../../../../store/services/thunks";
import AudioRecorder from "./audiorecorder";

export type personaudiotype = {
  id: number;
  personId: string;
  audioUrl: string;
  creationDate: string;
  publicId: string;
};

export type personaudioprops = {
  personId: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  audios: personaudiotype[];
};

const Layout = ({
  input,
  submitButton,
  previews,
  dropzoneProps,
  files,
  extra: { maxFiles },
}: ILayoutProps) => {
  return (
    <div>
      <Grid style={{ width: "100%" }}>{previews}</Grid>

      <div {...dropzoneProps}>{files.length < maxFiles && input}</div>

      {files.length > 0 && submitButton}
    </div>
  );
};
const CustomPreview = ({ meta, fileWithMeta }: IPreviewProps) => {
  return (
    <AudioView
      title={meta.name}
      type="file"
      id={meta.id}
      file={fileWithMeta.file}
      Removed={fileWithMeta.remove}
    />
  );
};

const PersonAudio = ({
  personId,
  reload,
  setReload,
  audios,
}: personaudioprops) => {
  const [removed, setRemoved] = useState<boolean>(false);
  const [uploadAudio] = usePostDataMutation();
  const [visible, { open, close }] = useDisclosure(false);
  const appState = useAppState();
  const dispatch = useAppDispatch();
  const handleSubmit: IDropzoneProps["onSubmit"] = async (_, allFiles) => {
    try {
      open();
      const toUpload = allFiles.map((file) => file.file);
      const formdata = new FormData();
      toUpload.forEach((file) => {
        formdata.append("audio", file);
      });
      let message = "Something went wrong";
      const uploads = await uploadAudio({
        url: "/person/audio/uploadlocalmultiple?personId=" + personId,
        data: formdata,
      });
      if ("error" in uploads) {
        throw uploads.error;
      }
      if (uploads.data) {
        const cloudupload = uploads.data;
        const res = await uploadAudio({
          url: "/person/audio/multiple/" + personId,
          data: { audios: cloudupload },
        });
        if ("error" in res) {
          throw res.error;
        }
        message = res?.data.msg;
        allFiles.forEach((f) => f.remove());
      }
      close();
      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      setReload(!reload);
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  const handleChangeStatus = (_: IFileWithMeta, status: StatusValue) => {
    setRemoved(!removed);
    if (status === "removed") {
      setRemoved(!removed);
    }
  };

  const HandleDelete = async (id: string) => {
    return modals.openConfirmModal({
      title: "Delete Audio",
      centered: true,
      children: (
        <Text size="md">
          Are you sure, you want to delete this Audio? <br />
          <b>This action cannot be undone</b>
        </Text>
      ),
      labels: { confirm: "Yes Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onConfirm: async () => {
        try {
          open();
          const response: any = await dispatch(
            deleteDataApi({
              url: `/person/audio/cloudaudio/${personId}/?audioId=${id}`,
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

  // useEffect(() => {}, [status, removed]);
  return (
    <Tab.Pane eventKey="third" id="person-audios">
      <Row>
        <Col>
          <Dropzone
            onChangeStatus={handleChangeStatus}
            onSubmit={handleSubmit}
            accept="audio/*"
            maxFiles={5}
            submitButtonContent="Upload Audios"
            LayoutComponent={Layout}
            PreviewComponent={(props) => <CustomPreview {...props} />}
            inputContent="Drop Audio Files"
          />
        </Col>
        <Col>
          <AudioRecorder
            personId={personId}
            reload={reload}
            setReload={setReload}
            open={open}
            close={close}
          />
        </Col>
      </Row>

      {audios.length > 0 && (
        <Grid mt="xs">
          {audios.map((file) => (
            <AudioView
              key={file.id}
              type="url"
              url={file.audioUrl}
              id={file.id.toString()}
              Removed={HandleDelete}
            />
          ))}
        </Grid>
      )}
    </Tab.Pane>
  );
};

export default PersonAudio;
