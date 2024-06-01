import { useEffect, useState } from "react";
import withRouter from "../../../../hoc/withRouter";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";
import { useDisclosure } from "@mantine/hooks";
import withRouteRole from "../../../../hoc/withRouteRole";
import withRolesVerify from "../../../../hoc/withRolesVerify";
import { fetchApi, useApiQuery } from "../../../../helpers/apiquery";
import {
  GenericApiResponse,
  usePostDataMutation,
} from "../../../../store/services/apislice";
import { useAuthUser } from "../../../../contexts/authcontext";
import { useTableContext } from "../../../../contexts/tablecontext";
import {
  ServerSideTable,
  moreConfigsTypes,
} from "../../../../components/tables/serverside";
import { MRT_VisibilityState } from "material-react-table";
import { enqueueSnackbar } from "notistack";
import { handleError } from "../../../../helpers/utils";
import { useAppState } from "../../../../contexts/sharedcontexts";
import { Box, Loader, LoadingOverlay } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { userconfigs, userformtype } from "./configs/user";
import { useConnection } from "../../../../contexts/connectioncontext";
import UserModal from "./usermodal";

export type user = {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  verified: number;
  createdAt: string;
  lastloginDate: string;
  isLocked: number;
  gender: string;
  tel: string;
  position: string;
  userName: string;
  image: string | null;
  online: boolean;
};

type positionresponse = {
  value: string;
  label: string;
};

const modalconfigs: moreConfigsTypes = {
  createDisplayMode: "custom",
  editDisplayMode: "custom",
};
const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;
const Users = (_: any) => {
  const navigate = useNavigate();
  const { manual, setManual, rowSelection, setRowSelection } =
    useTableContext();
  const { otherconfigs, tablecolumns, toptoolbaractions } = userconfigs(
    navigate,
    setManual,
    setRowSelection
  );
  const [showactions, setShowAction] = useState(false);
  const socket = useConnection();
  const [visible, { open: openloader, close: closeloader }] =
    useDisclosure(false);
  const [positions, setPositions] = useState<positionresponse[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const { token, isLoggedIn, modules } = useAuthUser();
  const childmodules = Object.keys(modules)
    .map((key) => modules[key])
    .reduce((a, b) => a.concat(b), [])
    .map((key) => key.route);
  const appState = useAppState();
  const [postUser] = usePostDataMutation<user>({});

  const handleFetchPositions = async () => {
    try {
      const response = await fetchApi<positionresponse[]>(
        `${baseqry}/positions/selects/view`,
        "GET",
        {
          Authorization: `Bearer ${token}`,
        }
      );
      setPositions(response?.data);
    } catch (error) {
      closeloader();
    }
  };
  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<user>
  >({
    url: `/user/users/`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    manual,
  });

  const handleFormSubmit = async (values: userformtype) => {
    try {
      openloader();
      const postdata = { ...values, adminCreated: 1 };
      const response = await postUser({
        url: "/register/admin",
        data: postdata,
      });
      if ("error" in response) {
        throw response.error;
      }
      await refetch();
      close();
      enqueueSnackbar(response.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      closeloader();
    } catch (error) {
      closeloader();
      handleError(error, appState, enqueueSnackbar);
    }
  };
  useEffect(() => {
    handleFetchPositions();
  }, []);
  useEffect(() => {
    dispatch(setHeaderText("Manage Users"));
  }, []);
  useEffect(() => {
    if (data?.data?.docs) {
      setManual(false);
    }
  }, [data, manual]);

  useEffect(() => {
    if (Object.keys(rowSelection).length > 0) {
      setShowAction(true);
    } else {
      setShowAction(false);
    }
  }, [rowSelection]);

  useEffect(() => {
    if (socket) {
      if (
        isLoggedIn &&
        token !== "" &&
        Object.values(modules).length > 0 &&
        childmodules.includes("/users")
      ) {
        socket.on("refreshusers", () => {
          refetch();
        });
      }
    }
  }, []);
  const response = data?.data?.docs || [];
  return (
    <Box>
      <LoadingOverlay
        visible={visible}
        zIndex={1500}
        loaderProps={{ children: <Loader color="blue" type="bars" /> }}
      />
      <UserModal
        opened={opened}
        close={close}
        positions={positions}
        handleSubmit={handleFormSubmit}
      />
      <ServerSideTable<user>
        data={response}
        title="User"
        totalDocs={data?.data?.totalDocs ?? 0}
        tablecolumns={tablecolumns}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        error={error}
        refetch={refetch}
        setManual={setManual}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        columnConfigs={otherconfigs}
        moreConfigs={modalconfigs}
        customCallback={(table) => {
          table.setCreatingRow(true);
          open();
        }}
        setRowSelection={setRowSelection}
        rowSelection={rowSelection}
        enableRowSelection={true}
        enableSelectAll={false}
        enableMultiRowSelection={false}
        additiontopactions={toptoolbaractions}
        showadditionaltopactions={showactions}
      />
    </Box>
  );
};

const UserWithVerified = withAuthentication(withRouter(withRouteRole(Users)));
const UserWithAcceptedRoles = withRolesVerify(UserWithVerified);

export default UserWithAcceptedRoles;
