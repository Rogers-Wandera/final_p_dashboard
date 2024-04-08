import { useEffect, useState } from "react";
import {
  ColumnVisibility,
  ServerSideTable,
  tableCols,
} from "../../../components/tables/serverside";
import { useTableContext } from "../../../contexts/tablecontext";
import { useApiQuery } from "../../../helpers/apiquery";
import withRolesVerify from "../../../hoc/withRolesVerify";
import withRouteRole from "../../../hoc/withRouteRole";
import withRouter, { RouterContextType } from "../../../hoc/withRouter";
import withAuthentication, { userauthprops } from "../../../hoc/withUserAuth";
import { GenericApiResponse } from "../../../store/services/apislice";
import { format } from "date-fns";
import { setHeaderText } from "../../../store/services/defaults";
import { useAppDispatch } from "../../../hooks/hook";
import { MRT_VisibilityState } from "material-react-table";
import { validateRequired } from "../../dashboard/admin/modules/modules";

type rolesprops = {
  acceptedroles: number[];
  router?: RouterContextType;
  auth?: userauthprops;
};

export type rolesresponse = {
  id: number;
  rolename: string;
  value: number;
  description: string;
  released: number;
  creationDate: number;
};

export function validateData(data: rolesresponse) {
  return {
    rolename: !validateRequired(data.rolename) ? "Role name is required" : "",
    value: !validateRequired(data.value.toString()) ? "Value is required" : "",
    description: !validateRequired(data.description)
      ? "Description is required"
      : "",
    released: !validateRequired(data.released.toString())
      ? "Released is required"
      : "",
  };
}

const Roles = ({ auth }: rolesprops) => {
  const { manual, setManual } = useTableContext();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const dispatch = useAppDispatch();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  useEffect(() => {
    dispatch(setHeaderText("Manage Modules"));
  }, []);
  const otherconfigs: tableCols<rolesresponse>[] = [
    {
      accessorKey: "id",
      header: "Id",
      enableEditing: false,
      enableSorting: false,
      Edit: () => null,
    },
    {
      accessorKey: "creationDate",
      header: "Date",
      enableEditing: false,
      Edit: () => null,
      Cell: ({ cell }) => {
        return <>{format(cell.getValue<Date>(), "yyyy-MM-dd hh:mm a")}</>;
      },
    },
    {
      accessorKey: "rolename",
      header: "Role",
      muiEditTextFieldProps: ({}) => ({
        required: true,
        error: !!validationErrors?.rolename || undefined,
        helperText: validationErrors?.rolename,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            rolename: undefined,
          }),
      }),
    },
    {
      accessorKey: "value",
      header: "Value",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.value,
        helperText: validationErrors?.value,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            value: undefined,
          }),
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      muiEditTextFieldProps: {
        required: true,
        multiline: true,
        error: !!validationErrors?.description,
        helperText: validationErrors?.description,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            description: undefined,
          }),
      },
    },
    {
      accessorKey: "released",
      header: "Released",
      editVariant: "select",
      editSelectOptions: [
        { label: "Yes", value: "1" },
        { label: "No", value: "0" },
      ],
      Cell: ({ cell }) => {
        const render = cell.getValue<number>() === 1 ? "Yes" : "No";
        return <>{render}</>;
      },
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.released,
        helperText: validationErrors?.released,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            released: undefined,
          }),
      },
    },
  ];
  const { data, isLoading, isError, isFetching, refetch, error } = useApiQuery<
    GenericApiResponse<rolesresponse>
  >({
    url: "/sysroles",
    headers: {
      Authorization: "Bearer " + auth?.token,
    },
    manual: manual,
  });
  useEffect(() => {
    if (data?.data?.docs) {
      setManual(false);
    }
  }, [data, manual]);
  return (
    <ServerSideTable<rolesresponse>
      data={data?.data?.docs ?? []}
      title="Role"
      totalDocs={data?.data?.totalDocs ?? 0}
      setManual={setManual}
      tablecolumns={[
        { name: "rolename", type: "text" },
        { name: "value", type: "text" },
        { name: "description", type: "text" },
        { name: "released", type: "text" },
        { name: "creationDate", type: "text" },
      ]}
      isError={isError}
      isLoading={isLoading}
      isFetching={isFetching}
      refetch={refetch}
      error={error}
      enableEditing={true}
      deleteUrl="sysroles"
      setValidationErrors={setValidationErrors}
      validationErrors={validationErrors}
      columnConfigs={otherconfigs}
      columnVisibility={columnVisibility}
      setColumnVisibility={setColumnVisibility}
      validateData={validateData}
      postDataProps={{
        addurl: "/sysroles",
        dataFields: ["rolename", "value", "description", "released"],
        editurl: (row) => `sysroles/${row.id}`,
      }}
    />
  );
};

const RolesVerified = withAuthentication(withRouter(withRouteRole(Roles)));
const RolesAcceptedRoles = withRolesVerify(RolesVerified);

export default RolesAcceptedRoles;
