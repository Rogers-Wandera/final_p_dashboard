import { Button, Group, Modal, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useTableTheme } from "../../../../helpers/tabletheme";
import { handleError } from "../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../contexts/sharedcontexts";
import { useAuthUser } from "../../../../contexts/authcontext";
import { usePostDataMutation } from "../../../../store/services/apislice";
import { useTableContext } from "../../../../contexts/tablecontext";

type modalprops = {
  opened: boolean;
  close: () => void;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
  openloader: () => void;
  closeloader: () => void;
};
function ImageTrainerModal({
  opened,
  close,
  setReload,
  reload,
  openloader,
  closeloader,
}: modalprops) {
  const theme = useTableTheme();
  const { manual, setManual } = useTableContext();
  const [TrainModel] = usePostDataMutation({});
  const appstate = useAppState();
  const { id } = useAuthUser();
  const form = useForm({
    name: "ImageForm",
    initialValues: {
      version: "",
      activation: "",
    },
    validate: {
      version: (value) =>
        value.length < 1 ? "Version can not be empty" : null,
      activation: (value) =>
        value.length < 1 ? "Activation can not be empty" : null,
    },
  });

  const HandleSubmit = async (values: {
    version: string;
    activation: string;
  }) => {
    try {
      openloader();
      const data = {
        userId: id,
        type: "Image",
        trainerOptions: values,
      };
      const response = await TrainModel({ url: "/recognition/", data: data });
      if ("error" in response) {
        throw response.error;
      }
      enqueueSnackbar(response.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      form.reset();
      close();
      setManual(!manual);
      setReload(!reload);
      closeloader();
    } catch (error) {
      closeloader();
      handleError(error, appstate, enqueueSnackbar);
    }
  };
  return (
    <div>
      <Modal
        opened={opened}
        onClose={close}
        title="Train Image Model"
        centered
        styles={{
          content: { backgroundColor: theme.palette.background.default },
          header: { backgroundColor: theme.palette.background.default },
          title: { fontSize: "1.3rem", fontWeight: "bold" },
        }}
      >
        <form onSubmit={form.onSubmit((values) => HandleSubmit(values))}>
          <Select
            label="Version"
            placeholder="Pick a version"
            name="version"
            data={["v1", "v2", "v3"]}
            clearable
            {...form.getInputProps("version")}
          />
          <Select
            label="Activation"
            placeholder="Choose activation"
            name="activation"
            data={[
              { value: "sigmoid", label: "Sigmoid" },
              { value: "relu", label: "Relu" },
            ]}
            clearable
            {...form.getInputProps("activation")}
          />
          <Group justify="flex-end" mt="md">
            <Button type="submit">Train</Button>
          </Group>
        </form>
      </Modal>
    </div>
  );
}

export default ImageTrainerModal;
