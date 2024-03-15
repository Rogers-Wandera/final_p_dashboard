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
import { MRT_VisibilityState, MaterialReactTable } from "material-react-table";
import { useApiQuery } from "../../../../helpers/apiquery";
import { format } from "date-fns";
import { Visibility } from "@mui/icons-material";

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

const moreMenuItems: menuitemsProps<modulesType>[] = [
  {
    label: "View",
    icon: <Visibility sx={{ color: "#1976d2" }} />,
    onClick(row, _, closeMenu) {
      closeMenu && closeMenu();
      console.log(row.original.creationDate);
    },
    render: true,
  },
];
export const validateRequired = (value: string) => !!value.length;
export function validateData(data: modulesType) {
  return {
    name: !validateRequired(data.name) ? "Module name is required" : "",
    position: !validateRequired(data.position.toString())
      ? "Position is required"
      : "",
  };
}

const Modules = () => {
  const { manual, setManual } = useTableContext();
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
    }
  );
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
      muiEditTextFieldProps: {
        required: true,
        error: !!validationErrors?.position,
        helperText: validationErrors?.position,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            position: undefined,
          }),
      },
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

  const response = data?.data?.docs;
  const table = ServerSideTable<modulesType>({
    refetch,
    title: "Module",
    data: response ?? [],
    isError,
    isLoading,
    totalDocs: data?.data?.totalDocs ?? 0,
    tablecolumns: [
      { name: "id", type: "text" },
      { name: "name", type: "text" },
      { name: "position", type: "text" },
      { name: "creationDate", type: "date" },
    ],
    columnConfigs: otherconfigs,
    isFetching,
    error,
    enableEditing: true,
    deleteUrl: "modules",
    setManual,
    moreConfigs: otherConfigs,
    addeditprops: addeditconfig,
    moreMenuItems: moreMenuItems,
    validateData,
    setValidationErrors,
    validationErrors,
    postDataProps: {
      addurl: "/modules",
      dataFields: ["name", "position"],
      editurl: (row) => `modules/${row.id}`,
    },
    columnVisibility,
    setColumnVisibility,
  });
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
export default Modules;
