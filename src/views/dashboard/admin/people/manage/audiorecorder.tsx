import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import {
  ApiResponse,
  PostPatchPayLoad,
  usePostDataMutation,
} from "../../../../../store/services/apislice";
import {
  SharedStateContextType,
  useAppState,
} from "../../../../../contexts/sharedcontexts";
import { handleError } from "../../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { MutationTrigger } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FetchArgs, MutationDefinition } from "@reduxjs/toolkit/query";
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { FetchBaseQueryMeta } from "@reduxjs/toolkit/query";
import { GetAudioFile } from "./personapi";
import { useAuthUser } from "../../../../../contexts/authcontext";
import AudioView from "./audio";
import { Button, Grid, Text, Tooltip } from "@mantine/core";
import { useAppDispatch } from "../../../../../hooks/hook";
import { deleteDataApi } from "../../../../../store/services/thunks";
import { modals } from "@mantine/modals";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export type AudioRecorderProps = {
  personId: string;
  reload: boolean;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  open: () => void;
  close: () => void;
};

export type audioreturntype = {
  path: string;
  defaultEncoding: number;
  flags: number;
  original: string;
};

type audioactions = {
  postFunction: MutationTrigger<
    MutationDefinition<
      PostPatchPayLoad<any>,
      BaseQueryFn<
        string | FetchArgs,
        unknown,
        FetchBaseQueryError,
        {},
        FetchBaseQueryMeta
      >,
      never,
      ApiResponse,
      "apislice"
    >
  >;
  personId: string;
  show?: boolean;
  appState: SharedStateContextType | null;
};

const AudioRecorderComponent = ({
  personId,
  reload,
  setReload,
  open,
  close,
}: AudioRecorderProps) => {
  const [postFunction] = usePostDataMutation();
  const [title, setTitle] = useState("Unsaved Record");
  const [audiofile, setAudioFle] = useState<audioreturntype>(
    {} as audioreturntype
  );
  const { token } = useAuthUser();
  const dispatch = useAppDispatch();
  const appState = useAppState();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const addAudioElement = async () => {
    await StopAudioRecord({ personId, postFunction, appState, show: false });
    const audiofile = await GetAudioFile({ personId, token });
    setAudioFle(audiofile);
    setTitle("New Recording");
  };

  const HandleGetInitialAudio = async () => {
    const audiofile = await GetAudioFile({ personId, token });
    setAudioFle(audiofile);
  };

  const HandlePauseResume = async () => {
    togglePauseResume();
    if (mediaRecorder) {
      if (mediaRecorder.state === "paused") {
        await PauseAudioRecord({
          personId,
          postFunction,
          appState,
        });
      } else if (mediaRecorder.state === "recording") {
        await ResumeAudioRecord({
          personId,
          postFunction,
          appState,
        });
      }
    }
  };

  const HandleStopRecording = async () => {
    if (mediaRecorder) {
      stopRecording();
      await StopAudioRecord({
        personId,
        postFunction,
        appState,
      });
    }
  };

  const HandleStartRecording = async () => {
    if (audiofile.path !== "" && audiofile.path) {
      setAudioFle({ path: "", defaultEncoding: 0, flags: 0, original: "" });
    }
    startRecording();
    await StartAudioRecord({
      personId,
      postFunction,
      appState,
    });
  };

  const HandleDeleteRecorded = async (url: string, reloadtrigger = false) => {
    try {
      const response: any = await dispatch(
        deleteDataApi({
          url: url,
        })
      );
      if (response.payload?.error) {
        throw response.payload.error;
      }
      const message = response.payload?.data?.msg || "Deleted successfully";
      setAudioFle({ path: "", defaultEncoding: 0, flags: 0, original: "" });
      setTitle("");
      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      if (reloadtrigger === true) {
        setReload(!reload);
      }
    } catch (error) {
      handleError(error, appState, enqueueSnackbar);
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
        await HandleDeleteRecorded(`/person/audio/${id}`);
      },
    });
  };

  const HandleUploadAudio = async () => {
    try {
      open();
      const uploads = await postFunction({
        url: "/person/audio/uploadaudio/" + personId,
        data: {
          audio: {
            path: audiofile.original,
            flags: audiofile.flags,
            defaultEncoding: audiofile.defaultEncoding,
          },
          recorded: "true",
        },
      });
      if ("error" in uploads) {
        throw uploads.error;
      }
      const message = uploads.data?.msg || "Deleted successfully";
      setAudioFle({
        path: "",
        defaultEncoding: 0,
        flags: 0,
        original: "",
      });
      setTitle("");
      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      close();
      setReload(!reload);
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  useEffect(() => {
    HandleGetInitialAudio();
  }, []);

  useEffect(() => {
    // check if the recording is past 1 minute
    if (recordingTime >= 60) {
      HandleStopRecording();
    }
  }, [recordingTime]);

  useEffect(() => {
    if (!recordingBlob) return;
    addAudioElement();
  }, [recordingBlob]);
  return (
    <div>
      <AudioRecorder
        recorderControls={{
          startRecording: HandleStartRecording,
          stopRecording: HandleStopRecording,
          togglePauseResume: HandlePauseResume,
          isRecording,
          isPaused,
          recordingTime,
        }}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
      />
      {audiofile.path !== "" && audiofile.path && (
        <Grid mt={10}>
          <Grid.Col span={4}>
            <Tooltip label="Upload audio">
              <Button variant="filled" onClick={() => HandleUploadAudio()}>
                <CloudUploadIcon />
              </Button>
            </Tooltip>
          </Grid.Col>
          <AudioView
            title={title}
            url={audiofile.path}
            type="url"
            id={personId}
            col={8}
            Removed={HandleDelete}
          />
        </Grid>
      )}
    </div>
  );
};

const StartAudioRecord = async ({
  personId,
  postFunction,
  appState,
}: audioactions) => {
  try {
    const Recording = await postFunction({
      url: "/person/audio/startrecord/" + personId,
      data: {},
    });
    if ("error" in Recording) {
      throw Recording.error;
    }
    enqueueSnackbar("Recording started", {
      variant: "success",
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
  } catch (error) {
    handleError(error, appState, enqueueSnackbar);
  }
};

const StopAudioRecord = async ({
  personId,
  postFunction,
  appState,
  show = true,
}: audioactions) => {
  try {
    const Recording = await postFunction({
      url: "/person/audio/stoprecord/" + personId,
      data: {},
    });
    if ("error" in Recording) {
      throw Recording.error;
    }
    if (show) {
      enqueueSnackbar("Recording Ended", {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
    }
  } catch (error) {
    handleError(error, appState, enqueueSnackbar);
  }
};

const PauseAudioRecord = async ({
  personId,
  postFunction,
  appState,
}: audioactions) => {
  try {
    const Recording = await postFunction({
      url: "/person/audio/pauserecord/" + personId,
      data: {},
    });
    if ("error" in Recording) {
      throw Recording.error;
    }
    enqueueSnackbar("Recording Paused", {
      variant: "success",
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
  } catch (error) {
    handleError(error, appState, enqueueSnackbar);
  }
};

const ResumeAudioRecord = async ({
  personId,
  postFunction,
  appState,
}: audioactions) => {
  try {
    const Recording = await postFunction({
      url: "/person/audio/resumerecord/" + personId,
      data: {},
    });
    if ("error" in Recording) {
      throw Recording.error;
    }
    enqueueSnackbar("Recording Resumed", {
      variant: "success",
      anchorOrigin: { horizontal: "right", vertical: "top" },
    });
  } catch (error) {
    handleError(error, appState, enqueueSnackbar);
  }
};
export default AudioRecorderComponent;
