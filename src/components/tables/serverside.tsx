import { MRT_ColumnDef, useMaterialReactTable } from "material-react-table";
import { useMemo } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTableContext } from "../../contexts/tablecontext";
import { Box, IconButton, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { handleDelete } from "../../store/services/apislice";
import { useAppDispatch } from "../../hooks/hook";
import { useSnackbar } from "notistack";
import { useAppState } from "../../contexts/sharedcontexts";
import AddBoxIcon from "@mui/icons-material/AddBox";

export interface ServerSideResponse<T> {
  docs: Array<T>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

// export interface CustomColumnConfigs {
//   accessorKey: string;
//   [key: string]: any;
// }

export interface ServerSideProps<T extends {}> {
  enableEditing?: boolean;
  tablecolumns?: TableColumns;
  columnConfigs?: tableCols[];
  data: Array<T>;
  isError?: boolean;
  isLoading?: boolean;
  totalDocs: number;
  refetch: any;
  isFetching?: boolean;
  error: any;
  deleteUrl?: string;
  idField?: string | number;
  setManual?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
}

export interface tableCols {
  accessorKey: string;
  header?: string;
  enableEditing?: boolean;
  size?: number;
  [key: string]: any;
}

export type TableColumns = string[];

export const ServerSideTable = <T extends {}>({
  data,
  refetch,
  title,
  totalDocs = 0,
  isLoading = false,
  enableEditing = false,
  columnConfigs = [],
  tablecolumns = [],
  isError = false,
  isFetching = false,
  idField = "id",
  deleteUrl = "",
  setManual = () => {},
}: ServerSideProps<T>) => {
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const appstate = useAppState();

  const HandleDeleteData = async (row: any) => {
    handleDelete({
      dispatch,
      enqueueSnackbar,
      appstate,
      url: `/${deleteUrl}/${row.original[idField]}`,
      setManual,
    });
  };
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
          (item) => item.accessorKey === key
        );
        if (otherconfigs?.header) {
          header = otherconfigs.header;
        }
        return {
          ...(otherconfigs ?? {}),
          header: header,
          accessorKey: accessorKey,
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
        <div>
          <Tooltip arrow title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={"Add New " + title}>
            <IconButton>
              <AddBoxIcon />
            </IconButton>
          </Tooltip>
        </div>
      </>
    ),
    muiToolbarAlertBannerProps: isError
      ? {
          color: "error",
          children: "Error! Failed to fetch data",
        }
      : undefined,
    rowCount: totalDocs,
    renderRowActions: ({ row, table }) => (
      <Box sx={{ display: "flex", gap: "1rem" }}>
        <Tooltip title={"Edit " + title}>
          <IconButton onClick={() => table.setEditingRow(row)}>
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={"Delete " + title}>
          <IconButton color="error" onClick={() => HandleDeleteData(row)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    ),
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
