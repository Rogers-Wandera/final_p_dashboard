import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_EditActionButtons,
  MRT_Row,
  MRT_TableInstance,
  useMaterialReactTable,
} from "material-react-table";
import React, { useMemo } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTableContext } from "../../contexts/tablecontext";
import {
  Box,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Edit, Delete } from "@mui/icons-material";
import {
  handleDelete,
  usePostDataMutation,
} from "../../store/services/apislice";
import { useAppDispatch } from "../../hooks/hook";
import { useSnackbar } from "notistack";
import { useAppState } from "../../contexts/sharedcontexts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { handleError } from "../../helpers/utils";

export interface ServerSideResponse<T> {
  docs: Array<T>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

export interface addeditprops {
  edittitle?: string;
  addtitle?: string;
  variant?:
    | "h1"
    | "h2"
    | "h3"
    | "h4"
    | "h5"
    | "h6"
    | "subtitle1"
    | "subtitle2"
    | "body1"
    | "body2"
    | "button"
    | "caption"
    | "overline";
}

export interface moreConfigsTypes {
  enableRowPinning?: boolean;
  createDisplayMode?: "modal" | "row" | "custom";
  editDisplayMode?: "modal" | "row" | "custom" | "table" | "cell";
  positionCreatingRow?: "top" | "bottom";
}

export interface actionconfigs {
  actiontype: "menu" | "inline";
  deleterender: boolean;
  editrender: boolean;
}

export interface ServerSideProps<T extends {}> {
  enableEditing?: boolean;
  tablecolumns?: TableColumns;
  columnConfigs?: tableCols<T>[];
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
  moreConfigs?: moreConfigsTypes;
  editcomponents?: any;
  addeditprops?: addeditprops;
  actionprop?: actionconfigs;
  moreMenuItems?: menuitemsProps<T>[];
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors?: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
  validateData?: (data: any) => any;
  postDataProps?: {
    url: string;
    dataFields: string[];
    postType?: "Array" | "Object";
  };
}

export type tableCols<T extends {}> = Omit<MRT_ColumnDef<T>, "header"> & {
  accessorKey: string;
  header?: string;
};

export type TableColumns = string[];

export const ServerSideTable = <T extends {}>({
  data,
  refetch,
  title,
  moreConfigs = {},
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
  editcomponents = null,
  addeditprops = {},
  actionprop = { actiontype: "menu", deleterender: true, editrender: true },
  moreMenuItems = [],
  setValidationErrors = () => {},
  validationErrors = {},
  validateData = () => {},
  postDataProps = { url: "", dataFields: [] },
}: ServerSideProps<T>) => {
  const [postData] = usePostDataMutation<T>({});
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
  const actionrendertypes = displayActionprop<T>(
    actionprop,
    HandleDeleteData,
    title,
    moreMenuItems
  );
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

  const handleCreateUser = async ({ values, table }: any) => {
    try {
      const newValidationErrors = validateData(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      let dataToPost: any = {};
      if (Object.keys(values).length > 0) {
        dataToPost = postDataProps.dataFields.map((field: string) => {
          return {
            [field]: values[field],
          };
        });
        if (postDataProps.postType === "Object" || !postDataProps.postType) {
          const postdata = {};
          dataToPost.forEach((item: any) => {
            Object.assign(postdata, item);
          });
          dataToPost = postdata;
        }
        values = dataToPost;
      }
      const data = await postData({ url: postDataProps.url, data: values });
      if ("error" in data) {
        throw data.error;
      }
      table.setCreatingRow(null);
      refetch();
      enqueueSnackbar(data.data.msg, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
    } catch (error) {
      handleError(error, appstate, enqueueSnackbar);
    }
  };

  const columns = useMemo<MRT_ColumnDef<T>[]>(
    () => generateColumns(),
    [data, validationErrors]
  );
  const table = useMaterialReactTable({
    data: data,
    columns: columns,
    initialState: { showColumnFilters: true },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    ...moreConfigs,
    // enableEditing: enableEditing,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateUser,
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div>
          <Tooltip arrow title="Refresh Data">
            <IconButton onClick={() => refetch()}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip arrow title={"Add New " + title}>
            <IconButton
              onClick={() => {
                table.setCreatingRow(true);
              }}
            >
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
    enableRowActions: enableEditing,
    ...actionrendertypes,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant={addeditprops.variant || "h5"}
          sx={{ textAlign: "center" }}
        >
          {addeditprops.addtitle || "Add New" + { title }}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {editcomponents || internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
    ),
    renderEditRowDialogContent: ({ internalEditComponents, row, table }) => (
      <>
        <DialogTitle
          variant={addeditprops.variant || "h5"}
          sx={{ textAlign: "center" }}
        >
          {addeditprops.edittitle || "Edit" + { title }}
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          {editcomponents || internalEditComponents}
        </DialogContent>
        <DialogActions>
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </DialogActions>
      </>
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

export type actiontypeprops<T extends {}> = {
  row: MRT_Row<T>;
  table: MRT_TableInstance<T>;
  closeMenu?: () => void;
};

export type menuitemsProps<T extends {}> = {
  label: string;
  icon: React.ReactNode;
  onClick: (
    row: MRT_Row<T>,
    table: MRT_TableInstance<T>,
    closeMenu?: () => void
  ) => void;
  render?: boolean;
};

const displayActionprop = <T extends {}>(
  { actiontype, deleterender, editrender }: actionconfigs,
  HandleDeleteData: (row: any) => void,
  title: string,
  moreMenuItems: menuitemsProps<T>[] = []
) => {
  if (actiontype === "menu") {
    return {
      renderRowActionMenuItems: ({
        row,
        table,
        closeMenu = () => {},
      }: actiontypeprops<T>) => {
        const additionalcolumns = moreMenuItems.map((item, index) => {
          const render = item.render === undefined ? true : item.render;
          if (render) {
            return (
              <MRT_ActionMenuItem
                key={`${item.label}-${index}`}
                icon={item.icon}
                label={item.label}
                table={table}
                onClick={() => {
                  item.onClick(row, table, closeMenu);
                }}
              />
            );
          }
        });
        return [
          editrender && (
            <MRT_ActionMenuItem
              icon={<Edit sx={{ color: "green" }} />}
              key="edit"
              label="Edit"
              onClick={() => {
                closeMenu();
                table.setEditingRow(row);
              }}
              table={table}
            />
          ),
          deleterender && (
            <MRT_ActionMenuItem
              icon={<Delete sx={{ color: "red" }} />}
              key="delete"
              label="Delete"
              onClick={() => {
                closeMenu();
                HandleDeleteData(row);
              }}
              table={table}
            />
          ),
          ...additionalcolumns,
        ];
      },
    };
  } else {
    return {
      renderRowActions: ({ row, table }: actiontypeprops<T>) => {
        const additionalcolumns = moreMenuItems.map((item, index) => {
          const render = item.render === undefined ? true : item.render;
          if (render) {
            return (
              <Tooltip key={`${item.label}-${index}`} title={item.label}>
                <IconButton
                  color="primary"
                  onClick={() => {
                    item.onClick(row, table);
                  }}
                >
                  {item.icon}
                </IconButton>
              </Tooltip>
            );
          }
        });
        return (
          <Box sx={{ display: "flex", gap: "1rem" }}>
            {editrender && (
              <Tooltip title={"Edit " + title}>
                <IconButton onClick={() => table.setEditingRow(row)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
            )}
            {deleterender && (
              <Tooltip title={"Delete " + title}>
                <IconButton color="error" onClick={() => HandleDeleteData(row)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
            {additionalcolumns}
          </Box>
        );
      },
    };
  }
};
