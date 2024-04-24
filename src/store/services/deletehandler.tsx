import { modals } from "@mantine/modals";
import { deleteProps } from "./apislice";
import { Text } from "@mantine/core";
import { deleteDataApi } from "./thunks";
import { handleError } from "../../helpers/utils";

export const HandleDelete = ({
  url,
  dispatch,
  appstate,
  enqueueSnackbar,
  data = {},
  title = "Are you sure?",
  text = "You will not be able to reverse this.",
  setManual = () => {},
  onCancelCallback = () => {},
  onConfirmCallback = () => {},
  dialogProps = {},
}: deleteProps) => {
  modals.openConfirmModal({
    title: title,
    centered: true,
    children: <Text size="md">{text}</Text>,
    labels: { confirm: "Yes Delete", cancel: "Cancel" },
    confirmProps: { color: "red" },
    onCancel: onCancelCallback,
    ...dialogProps,
    onConfirm: async () => {
      try {
        const response = await dispatch(deleteDataApi({ url, data }));
        if (response.payload?.error) {
          throw response.payload.error;
        }
        const message = response.payload?.data?.msg || "Deleted successfully";
        enqueueSnackbar(message, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
        setManual(true);
        onConfirmCallback();
      } catch (error) {
        handleError(error, appstate, enqueueSnackbar);
        //   Swal.fire("Error!", error.);
      }
    },
  });
};
