import { MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTableContext } from "../../contexts/tablecontext";
import { IconButton, Tooltip } from "@mui/material";

export interface ServerSideResponse<T> {
  docs: Array<T>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

export interface CustomColumnConfigs {
  accessorKey: string;
  [key: string]: any;
}

export type TableColumns = string[];

export interface ServerSideProps<T extends {}> {
  enableEditing?: boolean;
  tablecolumns?: TableColumns;
  columnConfigs?: CustomColumnConfigs[];
  data: Array<T>;
  isError?: boolean;
  isLoading?: boolean;
  totalDocs: number;
  refetch: any;
  isFetching?: boolean;
  error: any;
}

export const ServerSideTable = <T extends {}>({
  data,
  refetch,
  totalDocs = 0,
  isLoading = false,
  enableEditing = false,
  columnConfigs = [],
  tablecolumns = [],
  isError = false,
  isFetching = false,
}: // error = "Failded to fetch data",
ServerSideProps<T>) => {
  // const { docs = [] } = data ?? {};
  const {
    setColumnFilters,
    setGlobalFilter,
    setSorting,
    setPagination,
    columnFilters,
    globalFilter,
    pagination,
    sorting,
  } = useTableContext();
  const generateColumns = (): MRT_ColumnDef<T>[] => {
    let tablecols: string[] = [];
    if (tablecolumns.length > 0) {
      if (data.length > 0) {
        tablecols = tablecolumns;
      } else {
        if (data.length > 0) {
          tablecols = Object.keys(data[0]);
        }
      }
      const columns: MRT_ColumnDef<T>[] = tablecols.map((key) => {
        let accessorKey = key;
        let header = FieldConfigs(key);
        const otherconfigs = columnConfigs.find(
          (item) => (item.accessorKey = key)
        );
        return {
          header: header,
          accessorKey: accessorKey,
          ...(otherconfigs?.configs ?? {}),
        };
      });
      return columns;
    }
    return [];
  };
  const columns = useMemo<MRT_ColumnDef<T>[]>(() => generateColumns(), [data]);
  const table = useMaterialReactTable({
    data: data,
    columns: columns,
    initialState: { showColumnFilters: true },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: enableEditing,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    renderTopToolbarCustomActions: () => (
      <>
        <Tooltip arrow title="Refresh Data">
          <IconButton onClick={() => refetch()}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
        {/* <Button
          variant="contained"
          onClick={() => {
            table.setCreatingRow(true);
          }}
        >
          Create New User
        </Button> */}
      </>
    ),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error! Failed to fetch data",
        }
      : undefined,
    rowCount: totalDocs,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting,
    },
  });
  return table;
};

const FieldConfigs = (key: string) => {
  let header = key;
  if (key == "id") {
    header = "Id";
  } else if (key == "createdAt" || key == "creationDate") {
    header = "Creation Date";
  } else if (key == "updatedAt" || key == "updateDate") {
    header = "Update Date";
  } else if (key == "isActive") {
    header = "Active";
  } else if (key == "deleted_at") {
    header = "Deleted Date";
  } else if (key == "name") {
    header = "Name";
  }
  return header;
};
