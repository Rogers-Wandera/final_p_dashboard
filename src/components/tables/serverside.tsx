import {
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
  useMaterialReactTable,
} from "material-react-table";
import { useEffect, useMemo, useState } from "react";
import { useApiQuery } from "../../helpers/apiquery";
import { useAppDispatch } from "../../hooks/hook";
import RefreshIcon from "@mui/icons-material/Refresh";
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

export interface ServerSideProps {
  url: string;
  token?: null | string;
  enableEditing?: boolean;
  tablecolumns?: TableColumns;
  columnConfigs?: CustomColumnConfigs[];
}

export const ServerSideTable = <T extends {}, R extends ServerSideResponse<T>>({
  url,
  token,
  enableEditing = false,
  columnConfigs = [],
  tablecolumns = [],
}: ServerSideProps) => {
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });
  const tokenheader = token ? { Authorization: `Bearer ${token}` } : {};
  const { data, refetch, isLoading, isError } = useApiQuery<R>({
    url: url,
    urlparams: {
      globalFilter: globalFilter,
      sorting: sorting,
      start: pagination.pageIndex + 1,
      size: pagination.pageSize,
      filters: columnFilters,
    },
    headers: {
      ...tokenheader,
    },
    manual: true,
  });
  useEffect(() => {
    // refetch();
    console.log(pagination.pageIndex);
  }, [pagination.pageIndex]);
  const { docs = [] } = data?.data ?? {};
  const generateColumns = (): MRT_ColumnDef<T>[] => {
    let tablecols: string[] = [];
    if (tablecolumns.length > 0) {
      if (docs.length > 0) {
        tablecols = tablecolumns;
      } else {
        if (docs.length > 0) {
          tablecols = Object.keys(docs[0]);
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
  const columns = useMemo<MRT_ColumnDef<T>[]>(
    () => generateColumns(),
    [data, isLoading, tablecolumns, columnConfigs]
  );
  const table = useMaterialReactTable({
    data: docs,
    columns: columns,
    initialState: { showColumnFilters: true },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    createDisplayMode: "modal",
    editDisplayMode: "modal",
    enableEditing: enableEditing,
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
          children: "Error loading data",
        }
      : undefined,
    rowCount: data?.data.totalDocs ?? 0,
    state: {
      columnFilters,
      globalFilter,
      isLoading,
      pagination,
      showAlertBanner: isError,
      showProgressBars: isLoading,
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
