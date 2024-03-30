import { useEffect, useState } from "react";
import { useAuthUser } from "../../../../contexts/authcontext";
import {
  ColumnVisibility,
  ServerSideTable,
  addeditprops,
  menuitemsProps,
  moreConfigsTypes,
  tableCols,
} from "../../../../components/tables/serverside";
import { useTableContext } from "../../../../contexts/tablecontext";
import { MRT_TableInstance, MRT_VisibilityState } from "material-react-table";
import { useApiQuery } from "../../../../helpers/apiquery";
import { format } from "date-fns";
import { Visibility } from "@mui/icons-material";
import { encryptUrl } from "../../../../helpers/utils";
import withAuthentication from "../../../../hoc/withUserAuth";
import withRouter, { RouterContextType } from "../../../../hoc/withRouter";
import { useAppDispatch } from "../../../../hooks/hook";
import { setHeaderText } from "../../../../store/services/defaults";

export interface modulesType {
  id: number;
  name: string;
  position: number;
  creationDate: string;
  isActive: 1;
}

export interface modulesApiResponse {
  docs: Array<modulesType>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

const otherConfigs: moreConfigsTypes = {
  createDisplayMode: "modal",
  editDisplayMode: "modal",
};

const addeditconfig: addeditprops = {
  addtitle: "Add Module",
  edittitle: "Edit Module",
  variant: "h5",
};
export const validateRequired = (value: string) => !!value.length;
export function validateData(
  data: modulesType,
  table: MRT_TableInstance<modulesType>
) {
  let position = !validateRequired(data.position.toString())
    ? "Position is required"
    : "";
  if (table.getState().creatingRow) {
    position = "";
  }
  return {
    name: !validateRequired(data.name) ? "Module name is required" : "",
    position,
  };
}

const Modules = (props: any) => {
  const { manual, setManual } = useTableContext();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const { navigate } = props.router as RouterContextType;
  const dispatch = useAppDispatch();
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
  useEffect(() => {
    dispatch(setHeaderText("Manage Modules"));
  }, []);
  const moreMenuItems: menuitemsProps<modulesType>[] = [
    {
      label: "View",
      icon: <Visibility sx={{ color: "#1976d2" }} />,
      onClick(row, _, closeMenu) {
        closeMenu && closeMenu();
        const id = encryptUrl(row.original.id.toString());
        navigate(`/dashboard/modules/${id}`);
      },
      render: true,
    },
  ];
  const otherconfigs: tableCols<modulesType>[] = [
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
      accessorKey: "position",
      header: "Position",
      muiEditTextFieldProps: ({ table }) => ({
        required: table.getState().creatingRow ? true : false,
        hidden: table.getState().creatingRow ? true : false,
        disabled: table.getState().creatingRow != undefined ? true : false,
        error:
          (table.getState().creatingRow && !!validationErrors?.position) ||
          undefined,
        helperText: table.getState().creatingRow && validationErrors?.position,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            position: undefined,
          }),
      }),
    },
    {
      accessorKey: "name",
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.name,
        helperText: validationErrors?.name,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            name: undefined,
          }),
      },
    },
  ];
  const { token } = useAuthUser();
  const { data, refetch, isLoading, isError, isFetching, error } =
    useApiQuery<modulesApiResponse>({
      url: "/modules",
      headers: {
        Authorization: "Bearer " + token,
      },
      manual: manual,
    });

  useEffect(() => {
    if (data?.data?.docs) {
      setManual(false);
    }
  }, [data, manual]);

  const response = data?.data?.docs || [];
  return (
    <div>
      <ServerSideTable<modulesType>
        data={response}
        refetch={refetch}
        title="Module"
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        totalDocs={data?.data?.totalDocs ?? 0}
        tablecolumns={[
          { name: "id", type: "text" },
          { name: "name", type: "text" },
          { name: "position", type: "text" },
          { name: "creationDate", type: "date" },
        ]}
        columnConfigs={otherconfigs}
        error={error}
        enableEditing={true}
        deleteUrl="modules"
        setManual={setManual}
        moreConfigs={otherConfigs}
        addeditprops={addeditconfig}
        moreMenuItems={moreMenuItems}
        validateData={validateData}
        setValidationErrors={setValidationErrors}
        validationErrors={validationErrors}
        postDataProps={{
          addurl: "/modules",
          dataFields: ["name", "position"],
          editurl: (row) => `modules/${row.id}`,
        }}
        columnVisibility={columnVisibility}
        setColumnVisibility={setColumnVisibility}
        createCallback={(values) => {
          let newvalues = values;
          newvalues["position"] = 0;
          return newvalues;
        }}
      />
    </div>
  );
};
export default withAuthentication(withRouter(Modules));
