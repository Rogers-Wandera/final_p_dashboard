import { FormEvent, useEffect, useState } from "react";
import withRouter from "../../../../hoc/withRouter";
import withAuthentication from "../../../../hoc/withUserAuth";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";
import { useDisclosure } from "@mantine/hooks";
import FormModal, {
  formcomponentsprops,
  globalconfigs,
  selectdataprops,
} from "../../../../components/modals/formmodal/formmodal";
import joi from "joi";
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
  TableColumns,
  moreConfigsTypes,
  tableCols,
} from "../../../../components/tables/serverside";
import { MRT_VisibilityState } from "material-react-table";
import { enqueueSnackbar } from "notistack";
import { UseFormReturnType } from "@mantine/form";
import { withoutuppercase } from "../../../../assets/defaults/passwordrequirements";
import { handleError } from "../../../../helpers/utils";
import { useAppState } from "../../../../contexts/sharedcontexts";

const validation = joi.object({
  firstname: joi.string().required(),
  lastname: joi.string().required(),
  gender: joi.string().required(),
  position: joi.string().required(),
  tel: joi.string().required(),
  email: joi.string().required(),
  password: joi.string().required(),
  confirmpassword: joi.string().required(),
});

type user = {
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
};

type positionresponse = {
  value: string;
  label: string;
};

const modalconfigs: moreConfigsTypes = {
  createDisplayMode: "custom",
  editDisplayMode: "custom",
};

const tablecolumns: TableColumns[] = [
  { name: "id", type: "text" },
  { name: "userName", type: "text" },
  { name: "gender", type: "text" },
  { name: "position", type: "text" },
  { name: "verified", type: "text" },
  { name: "tel", type: "text" },
];

const forminputs: formcomponentsprops[] = [
  {
    inputtype: "text",
    label: "First Name",
    name: "firstname",
    required: true,
    initialvalue: "",
  },
  {
    inputtype: "text",
    label: "Last Name",
    name: "lastname",
    required: true,
    initialvalue: "",
  },
  {
    inputtype: "text",
    label: "Email",
    name: "email",
    initialvalue: "",
    required: true,
  },
  {
    inputtype: "password",
    label: "Password",
    name: "password",
    initialvalue: "",
    required: true,
  },
  {
    inputtype: "password",
    label: "Confirm Password",
    name: "confirmpassword",
    initialvalue: "",
    required: true,
  },
  {
    inputtype: "select",
    label: "Choose Gender",
    name: "gender",
    initialvalue: "",
    required: true,
  },
  {
    inputtype: "select",
    label: "Position",
    name: "position",
    initialvalue: "",
    required: true,
  },
  {
    inputtype: "text",
    label: "Tel",
    name: "tel",
    initialvalue: "",
    required: true,
  },
];

const otherconfigs: tableCols<user>[] = [
  {
    accessorKey: "id",
    Edit: () => null,
  },
  {
    accessorKey: "userName",
    header: "Name",
    Edit: () => null,
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "position",
    header: "Position",
  },
  {
    accessorKey: "verified",
    header: "Verified",
    Edit: () => null,
    Cell: ({ cell }) => {
      const show = cell.getValue<number>() === 1 ? "Yes" : "No";
      return <span>{show}</span>;
    },
  },
  {
    accessorKey: "tel",
    header: "Tel",
  },
];

const selectdata: selectdataprops = {
  name: "gender",
  data: [
    { label: "Male", value: "Male" },
    { label: "Female", value: "Female" },
  ],
};

const moremodalconfigs: globalconfigs = {
  paswordvalidator: {
    pwlength: 8,
    check: true,
    requirements: withoutuppercase,
    morechecks: (form) => {
      const checks = {
        name: "confirmpassword",
        label: "Matches Password",
        checks:
          form.getInputProps("password").value ===
          form.getInputProps("confirmpassword").value,
      };
      return [checks];
    },
  },
};
const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;
const Users = (_: any) => {
  const { manual, setManual } = useTableContext();
  const [positions, setPositions] = useState<selectdataprops>({
    name: "position",
    data: [],
  });
  const [selectoptions, setSelectOptions] = useState<selectdataprops[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  const [opened, { open, close }] = useDisclosure(false);
  const dispatch = useAppDispatch();
  const { token } = useAuthUser();
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
      setPositions({ ...positions, data: response?.data });
    } catch (error) {}
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

  const handleFormSubmit = async (
    event: FormEvent<HTMLFormElement>,
    form: UseFormReturnType<
      Record<string, unknown>,
      (values: Record<string, unknown>) => Record<string, unknown>
    >
  ) => {
    event.preventDefault();
    console.log("1234");
    try {
      form.validate();
      if (form.validate()) {
        const values = form.values;
        values["adminCreated"] = 1;
        const response = await postUser({ url: "/register", data: values });
        if ("error" in response) {
          throw response.error;
        }
        //  table.setCreatingRow(null);
        refetch();
        enqueueSnackbar(response.data.msg, {
          variant: "success",
          anchorOrigin: { horizontal: "right", vertical: "top" },
        });
      }
    } catch (error) {
      handleError(error, appState, enqueueSnackbar);
    }
  };
  useEffect(() => {
    handleFetchPositions();
  }, []);
  useEffect(() => {
    if (positions.data.length > 0) {
      setSelectOptions([selectdata, positions]);
    }
  }, [positions]);
  useEffect(() => {
    dispatch(setHeaderText("Manage Users"));
  }, []);
  useEffect(() => {
    if (data?.data?.docs) {
      setManual(false);
    }
  }, [data, manual]);
  const response = data?.data?.docs || [];
  return (
    <div>
      <FormModal
        opened={opened}
        close={close}
        title="Add User"
        elements={forminputs}
        size="xl"
        selectdata={selectoptions}
        formvalidation={validation}
        buttonconfigs={{ handleSubmit: handleFormSubmit }}
        globalconfigs={moremodalconfigs}
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
      />
    </div>
  );
};

const UserWithVerified = withAuthentication(withRouter(withRouteRole(Users)));
const UserWithAcceptedRoles = withRolesVerify(UserWithVerified);

export default UserWithAcceptedRoles;
