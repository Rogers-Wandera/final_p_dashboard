import { useEffect } from "react";
import {
  ServerSideTable,
  tableCols,
} from "../../../../components/tables/serverside";
import { useApiQuery } from "../../../../helpers/apiquery";
import { useTableContext } from "../../../../contexts/tablecontext";
import { evaluationtype } from "./trainertypes";
import {
  GenericApiResponse,
  usePostDataMutation,
} from "../../../../store/services/apislice";
import { Col } from "react-bootstrap";
import { format } from "date-fns";
import ImageIcon from "@mui/icons-material/Image";
import SpatialTrackingIcon from "@mui/icons-material/SpatialTracking";
import { handleError } from "../../../../helpers/utils";
import { enqueueSnackbar } from "notistack";
import { useAppState } from "../../../../contexts/sharedcontexts";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useDisclosure } from "@mantine/hooks";
import { Box, Loader, LoadingOverlay, Title } from "@mantine/core";
import ImageTrainerModal from "./imagetrainermodal";

type trainertableprops = {
  type: "Audio" | "Image";
  token: string;
  setReload: React.Dispatch<React.SetStateAction<boolean>>;
  reload: boolean;
};

function TrainerTable({ type, token, setReload, reload }: trainertableprops) {
  const { manual, setManual } = useTableContext();
  const [trainModel] = usePostDataMutation({});
  const [visible, { close, open }] = useDisclosure(false);
  const [opened, { close: closed, open: opener }] = useDisclosure(false);
  const appState = useAppState();
  const { id } = useAuthUser();
  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<evaluationtype>
  >({
    url: "/modeleval/" + type,
    headers: { Authorization: `Bearer ${token}` },
    manual: manual,
  });

  const columnConfigs: tableCols<evaluationtype>[] = [
    { accessorKey: "userName", Edit: () => null, header: "Trainer" },
    {
      accessorKey: "trainAccuracy",
      Edit: () => null,
      header: "Train Accuracy",
    },
    { accessorKey: "trainLoss", Edit: () => null, header: "Loss" },
    { accessorKey: "testAccuracy", Edit: () => null, header: "Test Accuracy" },
    { accessorKey: "testLoss", Edit: () => null, header: "Loss" },
    { accessorKey: "status", Edit: () => null, header: "Status" },
    {
      accessorKey: "creationDate",
      Edit: () => null,
      Cell: ({ cell }) => {
        let formatted = null;
        if (cell.getValue()) {
          formatted = format(cell.getValue<string>(), "yyyy-MM-dd HH:mm:ss");
        }
        return `${formatted}`;
      },
    },
  ];

  const HandleTrain = async () => {
    try {
      open();
      if (type === "Audio") {
        const response = await trainModel({
          url: "/recognition",
          data: { userId: id, type: type },
        });
        if ("error" in response) {
          throw response.error;
        }
        enqueueSnackbar(response.data.msg, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
        setReload(!reload);
      } else {
        opener();
      }
      close();
    } catch (error) {
      close();
      handleError(error, appState, enqueueSnackbar);
    }
  };

  useEffect(() => {
    if (data?.data.docs) {
      setManual(false);
    }
  }, [manual, data]);

  useEffect(() => {
    refetch();
  }, [type]);

  if (visible) {
    return (
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
        h="100%"
        title="Uploading..."
        overlayProps={{ radius: "sm", blur: 2 }}
        loaderProps={{
          children: (
            <Box>
              <Loader color="Blue" type="bars" />
              <Title order={3}>Processing.... This might Take a while</Title>
            </Box>
          ),
        }}
      />
    );
  }
  return (
    <Col lg="8" className="col-g-8">
      <ImageTrainerModal
        opened={opened}
        close={closed}
        openloader={open}
        closeloader={close}
        setReload={setReload}
        reload={reload}
      />
      <ServerSideTable<evaluationtype>
        refetch={refetch}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        title={`${type}`}
        data={data?.data.docs || []}
        totalDocs={data?.data.totalDocs || 0}
        error={error}
        tablecolumns={[
          { name: "userName", type: "text" },
          { name: "trainAccuracy", type: "text" },
          { name: "trainLoss", type: "text" },
          { name: "testAccuracy", type: "text" },
          { name: "testLoss", type: "text" },
          { name: "status", type: "text" },
          { name: "creationDate", type: "text" },
        ]}
        enableEditing={false}
        columnConfigs={columnConfigs}
        moreConfigs={{ createDisplayMode: "custom" }}
        showCreateBtn={false}
        additiontopactions={[
          {
            icon: type === "Audio" ? <SpatialTrackingIcon /> : <ImageIcon />,
            label: `Train ${type} Classifier`,
            onClick: () => HandleTrain(),
            show: "text",
          },
        ]}
      />
    </Col>
  );
}

export default TrainerTable;
