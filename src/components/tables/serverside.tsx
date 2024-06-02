import {
  MRT_ActionMenuItem,
  MRT_ColumnDef,
  MRT_ColumnFiltersState,
  MRT_EditActionButtons,
  MRT_PaginationState,
  MRT_Row,
  MRT_RowSelectionState,
  MRT_SortingState,
  MRT_TableInstance,
  MRT_VisibilityState,
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { ReactNode, useMemo } from "react";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useTableContext } from "../../contexts/tablecontext";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Edit, Delete } from "@mui/icons-material";
import { usePostDataMutation } from "../../store/services/apislice";
import { useAppDispatch } from "../../hooks/hook";
import { useSnackbar } from "notistack";
import { useAppState } from "../../contexts/sharedcontexts";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { handleError } from "../../helpers/utils";
import ArrowBack from "@mui/icons-material/ArrowBack";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { useTableTheme } from "../../helpers/tabletheme";
import { HandleDelete } from "../../store/services/deletehandler";

export interface ServerSideResponse<T> {
  docs: Array<T>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

export interface additionaltopbaractions<T extends {}> {
  label: string;
  icon: ReactNode;
  visible?: (row: MRT_Row<T>) => boolean;
  onClick: (
    table: MRT_TableInstance<T>,
    row: MRT_Row<T>,
    rows: MRT_Row<T>[]
  ) => void;
  show?: "text" | "icon";
  buttonconfigs?: {
    variant?: "outlined" | "contained";
    color?:
      | "inherit"
      | "primary"
      | "secondary"
      | "success"
      | "error"
      | "info"
      | "warning";
    size?: "small" | "medium" | "large";
    otherprops?: any;
    iconplacement?: "start" | "end";
  };
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
  tablecolumns?: TableColumns[];
  columnConfigs?: tableCols<T>[];
  data: Array<T>;
  isError?: boolean;
  isLoading?: boolean;
  totalDocs: number;
  refetch: any;
  isFetching?: boolean;
  error: any;
  deleteUrl?: string;
  deleteOverride?: (row: MRT_Row<T>) => string;
  idField?: string | number;
  enableRowSelection?: boolean | ((row: MRT_Row<T>) => boolean);
  rowSelection?: MRT_RowSelectionState;
  setRowSelection?: React.Dispatch<React.SetStateAction<MRT_RowSelectionState>>;
  setManual?: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  moreConfigs?: moreConfigsTypes;
  editcomponents?: ReactNode | null;
  addeditprops?: addeditprops;
  actionprop?: actionconfigs;
  moreMenuItems?: menuitemsProps<T>[];
  validationErrors?: Record<string, string | undefined>;
  setValidationErrors?: React.Dispatch<
    React.SetStateAction<Record<string, string | undefined>>
  >;
  validateData?: (data: any, table: any) => any;
  postDataProps?: {
    addurl: string;
    dataFields: string[];
    postType?: "Array" | "Object";
    editurl?: (row: any) => string;
  };
  columnVisibility?: MRT_VisibilityState;
  setColumnVisibility?: React.Dispatch<
    React.SetStateAction<MRT_VisibilityState>
  >;
  showback?: boolean;
  createCallback?: (values: any, table: any) => typeof values;
  editCallback?: (values: any, table: any) => void;
  editCreateCallBack?: (values: any, table: any) => typeof values;
  customCallback?: (table: MRT_TableInstance<T>) => void;
  additiontopactions?: additionaltopbaractions<T>[];
  enableSelectAll?: boolean;
  enableMultiRowSelection?: boolean;
  showadditionaltopactions?: boolean | ((row: MRT_Row<T>) => boolean);
  tabledrawcallback?: (table: MRT_TableInstance<T>) => void;
  deleteProps?: {
    onCancelCallback?: () => void;
    onConfirmCallback?: () => void;
    dialogProps?: {
      zIndex?: number;
    };
  };

  overridecolumnFilters?: MRT_ColumnFiltersState;
  setOverrideColumnFilters?: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  overrideglobalFilter?: string;
  setOverrideGlobalFilter?: React.Dispatch<React.SetStateAction<string>>;
  overridesorting?: MRT_SortingState;
  setOverrideSorting?: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  overridepagination?: MRT_PaginationState;
  setOverridePagination?: React.Dispatch<
    React.SetStateAction<MRT_PaginationState>
  >;
  showCreateBtn?: boolean;
}

export type tableCols<T extends {}> = Omit<MRT_ColumnDef<T>, "header"> & {
  accessorKey: string;
  header?: string;
};

export type TableColumns = {
  name: string;
  type:
    | "autocomplete"
    | "checkbox"
    | "date"
    | "date-range"
    | "datetime"
    | "datetime-range"
    | "multi-select"
    | "range"
    | "range-slider"
    | "select"
    | "text"
    | "time"
    | "time-range"
    | undefined;
};
export type ColumnVisibility<T = any> = { [key: string]: T };

export const ServerSideTable = <T extends { [key: string]: any }>({
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
  idField = "id" as string,
  deleteUrl = "",
  showCreateBtn = true,
  setManual = () => {},
  editcomponents = null,
  addeditprops = {},
  actionprop = { actiontype: "menu", deleterender: true, editrender: true },
  moreMenuItems = [],
  setValidationErrors = () => {},
  validationErrors = {},
  validateData = () => {},
  postDataProps = { addurl: "", dataFields: [] },
  setColumnVisibility = () => {},
  columnVisibility = {},
  showback = false,
  createCallback = undefined,
  customCallback = () => {},
  enableRowSelection = false,
  rowSelection = {},
  setRowSelection = () => {},
  additiontopactions = [],
  enableSelectAll = true,
  enableMultiRowSelection = false,
  editCreateCallBack,
  showadditionaltopactions = true,
  editCallback = () => {},
  deleteProps = {},
  setOverrideColumnFilters = undefined,
  setOverrideGlobalFilter = undefined,
  setOverridePagination = undefined,
  setOverrideSorting = undefined,
  overridecolumnFilters = undefined,
  overrideglobalFilter = undefined,
  overridepagination = undefined,
  overridesorting = undefined,
  deleteOverride = undefined,
}: // tabledrawcallback = () => {},
ServerSideProps<T>) => {
  const [postData] = usePostDataMutation<T>({});
  const dispatch = useAppDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const appstate = useAppState();
  const navigate = useNavigate();

  const theme = useTableTheme();
  const HandleDeleteData = async (row: any) => {
    HandleDelete({
      dispatch,
      enqueueSnackbar,
      appstate,
      url: deleteOverride
        ? deleteOverride(row)
        : `/${deleteUrl}/${row.original[idField]}`,
      setManual,
      ...deleteProps,
    });
  };
  const actionrendertypes = displayActionprop<T>(
    actionprop,
    HandleDeleteData,
    title,
    moreMenuItems,
    navigate
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
      tablecols = tablecolumns.map((dt) => dt.name);
      const columns: MRT_ColumnDef<T>[] = tablecols.map((key) => {
        let accessorKey = key;
        let header = FieldConfigs(key);
        let filterVariant;
        const filvariant = tablecolumns.find((item) => item.name === key);
        if (filvariant) {
          filterVariant = filvariant.type;
        }
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
          filterVariant,
        };
      });
      return columns;
    }
    return [];
  };

  const handleCreate = async ({ values, table }: any) => {
    try {
      const newValidationErrors = validateData(values, table);
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
        if (createCallback) {
          values = createCallback(dataToPost, table);
        }
      }
      const data = await postData({ url: postDataProps.addurl, data: values });
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

  const handleUpdate = async ({ values, table, row }: any) => {
    try {
      const newValidationErrors = validateData(values, table);
      if (Object.values(newValidationErrors).some((error) => error)) {
        console.log(newValidationErrors);
        setValidationErrors(newValidationErrors);
        return;
      }
      let dataToPost: any = {};
      const url = postDataProps.editurl ? postDataProps.editurl(row) : "";
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
        if (editCreateCallBack) {
          values = editCreateCallBack(dataToPost, table);
        }
      }
      const data = await postData({
        url: url,
        data: values,
        method: "PATCH",
      });
      if ("error" in data) {
        throw data.error;
      }
      table.setEditingRow(null);
      refetch();
      editCallback(values, table);
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
    onColumnFiltersChange: setOverrideColumnFilters || setColumnFilters,
    onGlobalFilterChange: setOverrideGlobalFilter || setGlobalFilter,
    onPaginationChange: setOverridePagination || setPagination,
    onSortingChange: setOverrideSorting || setSorting,
    enableMultiRowSelection: enableMultiRowSelection,
    ...moreConfigs,
    // enableEditing: enableEditing,
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    getRowId: (row) => row[idField],
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreate,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleUpdate,
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        fontWeight: row.getIsSelected() ? "bold" : "normal",
      },
    }),
    muiTableBodyProps: {
      sx: {
        "& tr:nth-of-type(odd) > td": {
          backgroundColor:
            theme.palette.mode === "light" ? "#f5f5f5" : "#222738",
        },
      },
    },
    renderTopToolbarCustomActions: ({ table }) => (
      <>
        <div>
          {showback && (
            <Tooltip arrow title="Go back">
              <IconButton
                onClick={() => {
                  navigate(-1);
                }}
                color="secondary"
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
          )}
          <Tooltip arrow title="Refresh Data">
            <IconButton
              onClick={() => {
                refetch();
                setColumnFilters([]);
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {showCreateBtn && (
            <Tooltip arrow title={"Add New " + title}>
              <IconButton
                onClick={() => {
                  table.setCreatingRow(true);
                  if (moreConfigs?.createDisplayMode === "custom") {
                    if (customCallback) {
                      customCallback(table);
                    }
                  }
                }}
              >
                <AddBoxIcon />
              </IconButton>
            </Tooltip>
          )}

          {showadditionaltopactions &&
            additiontopactions.length > 0 &&
            additiontopactions.map((action, index) => {
              let show = (
                <Tooltip arrow title={action.label} key={index}>
                  <IconButton
                    onClick={() => {
                      const rows = table.getSelectedRowModel().rows;
                      const row = rows[0];
                      action.onClick(table, row, rows);
                    }}
                  >
                    {action.icon}
                  </IconButton>
                </Tooltip>
              );
              if (action.show === "text") {
                const placement =
                  action.buttonconfigs?.iconplacement === "end"
                    ? { endIcon: action.icon }
                    : { startIcon: action.icon };
                show = (
                  <Tooltip arrow title={action.label} key={index}>
                    <Button
                      {...placement}
                      // startIcon={action.icon}
                      variant={action.buttonconfigs?.variant || "contained"}
                      size={action.buttonconfigs?.size || "small"}
                      color={action.buttonconfigs?.color || "primary"}
                      {...action.buttonconfigs?.otherprops}
                      onClick={() => {
                        const rows = table.getSelectedRowModel().rows;
                        const row = rows[0];
                        action.onClick(table, row, rows);
                      }}
                    >
                      {action.label}
                    </Button>
                  </Tooltip>
                );
              }
              return show;
            })}
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
    enableRowSelection: enableRowSelection,
    enableSelectAll: enableSelectAll,
    enableRowActions: enableEditing,
    ...actionrendertypes,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
      <>
        <DialogTitle
          variant={addeditprops.variant || "h5"}
          sx={{ textAlign: "center" }}
        >
          {addeditprops.addtitle || "Add New " + title}
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
          {addeditprops.edittitle || "Edit " + title}
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
    muiTableHeadCellProps: {
      //easier way to create media queries, no useMediaQuery hook needed.
      sx: {
        fontSize: {
          xs: "10px",
          sm: "11px",
          md: "12px",
          lg: "13px",
          xl: "14px",
        },
      },
    },
    state: {
      columnFilters: overridecolumnFilters || columnFilters,
      globalFilter: overrideglobalFilter || globalFilter,
      rowSelection,
      isLoading,
      pagination: overridepagination || pagination,
      showAlertBanner: isError,
      showProgressBars: isFetching,
      sorting: overridesorting || sorting,
      columnVisibility,
    },
  });

  // useEffect(() => {
  //   tabledrawcallback(table);
  // }, []);
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
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
    closeMenu?: () => void,
    navigate?: NavigateFunction
  ) => void;
  render?: boolean;
};

const displayActionprop = <T extends {}>(
  { actiontype, deleterender, editrender }: actionconfigs,
  HandleDeleteData: (row: any) => void,
  title: string,
  moreMenuItems: menuitemsProps<T>[] = [],
  navigate: NavigateFunction
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
                  item.onClick(row, table, closeMenu, navigate);
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
