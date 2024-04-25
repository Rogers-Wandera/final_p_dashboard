import { Modal, Text } from "@mantine/core";
import { useApiQuery } from "../../../../helpers/apiquery";
import { useAuthUser } from "../../../../contexts/authcontext";
import { GenericApiResponse } from "../../../../store/services/apislice";
import { useEffect, useState } from "react";
import {
  ColumnVisibility,
  ServerSideTable,
  tableCols,
} from "../../../../components/tables/serverside";
import { format } from "date-fns";
import { useTableTheme } from "../../../../helpers/tabletheme";
import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  MRT_VisibilityState,
} from "material-react-table";
import { validateRequired } from "./modules";

export interface modulepermissions {
  id: number;
  linkId: number;
  accessName: string;
  acessRoute: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "OPTIONS";
  description: string;
  creationDate: string;
  isActive: number;
}

export interface modulepermissionsprops {
  close: () => void;
  visible: boolean;
  pmanual: boolean;
  setPManual: React.Dispatch<React.SetStateAction<boolean>>;
  linkId: number;
  title: string;
}

export function validateData(data: modulepermissions) {
  return {
    accessName: !validateRequired(data.accessName)
      ? "Permission name is required"
      : "",
    acessRoute: !validateRequired(data.acessRoute) ? "Route is required" : "",
    method: !validateRequired(data.method) ? "Method is required" : "",
    description: !validateRequired(data.description)
      ? "Description is required"
      : "",
  };
}

const ModulePermissions = ({
  close,
  visible,
  pmanual,
  setPManual,
  linkId,
  title,
}: modulepermissionsprops) => {
  const [columnVisibility, setColumnVisibility] = useState<MRT_VisibilityState>(
    {
      id: false,
      isActive: false,
    }
  );
  const [validationErrors, setValidationErrors] = useState<ColumnVisibility>(
    {}
  );
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const { token } = useAuthUser();
  const theme = useTableTheme();
  //   "#ffffff" : "#222738"
  const otherconfigs: tableCols<modulepermissions>[] = [
    {
      accessorKey: "id",
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
      accessorKey: "accessName",
      header: "Permission Name",
      muiEditTextFieldProps: () => ({
        required: true,
        error: !!validationErrors?.accessName,
        helperText: validationErrors?.accessName,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            accessName: undefined,
          }),
      }),
    },
    {
      accessorKey: "acessRoute",
      header: "Route",
      muiEditTextFieldProps: () => ({
        required: true,
        error: !!validationErrors?.acessRoute,
        helperText: validationErrors?.acessRoute,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            acessRoute: undefined,
          }),
      }),
    },
    {
      accessorKey: "method",
      header: "Method",
      editVariant: "select",
      editSelectOptions: [
        { label: "GET", value: "GET" },
        { label: "POST", value: "POST" },
        { label: "PUT", value: "PUT" },
        { label: "DELETE", value: "DELETE" },
        { label: "PATCH", value: "PATCH" },
        { label: "OPTIONS", value: "OPTIONS" },
      ],
      muiEditTextFieldProps: () => ({
        required: true,
        error: !!validationErrors?.method,
        helperText: validationErrors?.method,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            method: undefined,
          }),
      }),
    },
    {
      accessorKey: "description",
      header: "Description",
      muiEditTextFieldProps: () => ({
        required: true,
        multiline: true,
        error: !!validationErrors?.description,
        helperText: validationErrors?.description,
        onFocus: () =>
          setValidationErrors({
            ...validationErrors,
            description: undefined,
          }),
      }),
    },
    {
      accessorKey: "isActive",
      header: "Active",
      muiEditTextFieldProps: () => ({
        required: true,
        error: false,
        helperText: "",
        onFocus: () => {},
      }),
    },
  ];
  const { data, refetch, isLoading, isError, isFetching, error } = useApiQuery<
    GenericApiResponse<modulepermissions>
  >({
    url: `/modulepermission/permissions/${linkId}`,
    headers: { Authorization: `Bearer ${token}` },
    manual: pmanual,
    overidedefaults: { pagination, sorting, columnFilters, globalFilter },
  });
  useEffect(() => {
    if (data?.data?.docs) {
      setPManual(false);
    }
  }, [data, pmanual]);
  useEffect(() => {
    if (!pmanual) {
      setPManual(true);
    }
  }, [pagination, globalFilter, columnFilters]);
  return (
    <div>
      <Modal
        opened={visible}
        onClose={close}
        styles={{
          content: { backgroundColor: theme.palette.background.default },
          header: { backgroundColor: theme.palette.background.default },
          title: { fontSize: "1.3rem", fontWeight: "bold" },
        }}
        title={title}
        size="100%"
        radius={0}
        zIndex={1000}
        transitionProps={{ transition: "fade", duration: 200 }}
      >
        <Text size="lg" fw={500} ta="center" style={{ margin: "1rem 0" }}>
          Create module permissions for easy access restrictions and controls.
        </Text>
        <ServerSideTable<modulepermissions>
          refetch={refetch}
          title={"Permission"}
          data={data?.data?.docs ?? []}
          enableEditing={true}
          tablecolumns={[
            { name: "id", type: "text" },
            { name: "accessName", type: "text" },
            { name: "acessRoute", type: "text" },
            { name: "method", type: "text" },
            { name: "description", type: "text" },
            { name: "creationDate", type: "date" },
          ]}
          isError={isError}
          isLoading={isLoading}
          deleteUrl={"modulepermission"}
          totalDocs={data?.data?.totalDocs ?? 0}
          isFetching={isFetching}
          error={error}
          columnConfigs={otherconfigs}
          columnVisibility={columnVisibility}
          setColumnVisibility={setColumnVisibility}
          validationErrors={validationErrors}
          setValidationErrors={setValidationErrors}
          validateData={validateData}
          setManual={setPManual}
          setOverrideColumnFilters={setColumnFilters}
          setOverrideGlobalFilter={setGlobalFilter}
          setOverridePagination={setPagination}
          setOverrideSorting={setSorting}
          overridecolumnFilters={columnFilters}
          overrideglobalFilter={globalFilter}
          overridepagination={pagination}
          overridesorting={sorting}
          postDataProps={{
            addurl: "/modulepermission/permissions/" + linkId,
            dataFields: ["accessName", "acessRoute", "method", "description"],
            editurl: (row) => `/modulepermission/${row.id}`,
          }}
          deleteProps={{
            dialogProps: { zIndex: 1500 },
          }}
        />
      </Modal>
    </div>
  );
};

export default ModulePermissions;
