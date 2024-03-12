import { useEffect } from "react";
import { useAuthUser } from "../../../../contexts/authcontext";
import {
  ServerSideTable,
  tableCols,
} from "../../../../components/tables/serverside";
import { useTableContext } from "../../../../contexts/tablecontext";
import { MaterialReactTable } from "material-react-table";
import { useApiQuery } from "../../../../helpers/apiquery";

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

// const url = import.meta.env.VITE_NODE_BASE_URL;

// const Modules = () => {
//   const [validationErrors, setValidationErrors] = useState<
//     Record<string, string | undefined>
//   >({});
//   const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
//     []
//   );
//   const [globalFilter, setGlobalFilter] = useState<string>("");
//   const [sorting, setSorting] = useState<MRT_SortingState>([]);
//   const [pagination, setPagination] = useState<MRT_PaginationState>({
//     pageIndex: 0,
//     pageSize: 5,
//   });
//   const { token } = useAuthUser();

//   const { data, isError, isRefetching, isLoading, refetch } =
//     useQuery<modulesApiResponse>({
//       queryKey: [
//         "modules",
//         columnFilters,
//         globalFilter,
//         sorting,
//         pagination.pageIndex,
//         pagination.pageSize,
//       ],
//       queryFn: async () => {
//         const fetchURL = new URL(
//           `${url}/modules`
//           //   process.env.NODE_ENV === "production"
//           //     ? "https://www.material-react-table.com"
//           //     : "http://localhost:3000"
//         );

//         //read our state and pass it to the API as query params
//         fetchURL.searchParams.set("start", `${pagination.pageIndex + 1}`);
//         fetchURL.searchParams.set("size", `${pagination.pageSize}`);
//         fetchURL.searchParams.set(
//           "filters",
//           JSON.stringify(columnFilters ?? [])
//         );
//         fetchURL.searchParams.set("globalFilter", globalFilter ?? "");
//         fetchURL.searchParams.set("sorting", JSON.stringify(sorting ?? []));

//         //use whatever fetch library you want, fetch, axios, etc
//         const response = await fetch(fetchURL.href, {
//           headers: {
//             Authorization: "Bearer " + token,
//           },
//         });
//         const json = (await response.json()) as modulesApiResponse;
//         return json;
//       },
//       placeholderData: keepPreviousData,
//     });
//   const { docs = [] } = data ?? {};

//   const columns = useMemo<MRT_ColumnDef<modulesType>[]>(
//     () => [
//       {
//         accessorKey: "id",
//         header: "Id",
//         enableEditing: false,
//         Edit: () => null,
//       },
//       {
//         accessorKey: "name",
//         header: "Name",
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.name,
//           helperText: validationErrors?.name,
//           onFocus: () => {
//             setValidationErrors({
//               ...validationErrors,
//               name: undefined,
//             });
//           },
//         },
//       },
//       {
//         accessorKey: "position",
//         header: "Position",
//         muiEditTextFieldProps: {
//           required: true,
//           error: !!validationErrors?.position,
//           helperText: validationErrors?.position,
//           onFocus: () => {
//             setValidationErrors({
//               ...validationErrors,
//               position: undefined,
//             });
//           },
//         },
//       },
//       {
//         accessorFn: (row) => new Date(row.creationDate),
//         id: "creationDate",
//         header: "Creation Date",
//         Cell: ({ cell }) => new Date(cell.getValue<Date>()).toLocaleString(),
//         filterFn: "notEquals",
//         filterVariant: "date",
//         enableGlobalFilter: false,
//         enableEditing: false,
//         Edit: () => null,
//       },
//       {
//         accessorKey: "isActive",
//         header: "Active",
//         enableEditing: false,
//         Edit: () => null,
//       },
//     ],
//     [validationErrors]
//   );
//   const openDeleteConfirmModal = (row: MRT_Row<modulesType>) => {
//     if (window.confirm("Are you sure you want to delete this user?")) {
//       // deleteUser(row.original.id);
//     }
//   };
//   const table = useMaterialReactTable({
//     columns,
//     data: docs,
//     initialState: { showColumnFilters: true },
//     manualFiltering: true,
//     manualPagination: true,
//     manualSorting: true,
//     createDisplayMode: "modal",
//     editDisplayMode: "modal",
// enableEditing: true,
//     // getRowId: (row) => row.id.toString(),
//     muiToolbarAlertBannerProps: isError
//       ? {
//           color: "error",
//           children: "Error loading data",
//         }
//       : undefined,
//     onColumnFiltersChange: setColumnFilters,
//     onGlobalFilterChange: setGlobalFilter,
//     onPaginationChange: setPagination,
//     onSortingChange: setSorting,
//     renderTopToolbarCustomActions: () => (
//       <>
//         <Tooltip arrow title="Refresh Data">
//           <IconButton onClick={() => refetch()}>
//             <RefreshIcon />
//           </IconButton>
//         </Tooltip>
//         <Button
//           variant="contained"
//           onClick={() => {
//             table.setCreatingRow(true);
//           }}
//         >
//           Create New User
//         </Button>
//       </>
//     ),
//     renderCreateRowDialogContent: ({ table, row, internalEditComponents }) => (
//       <>
//         <DialogTitle variant="h3">Create Module</DialogTitle>
//       </>
//     ),
// renderRowActions: ({ row, table }) => (
//   <Box sx={{ display: "flex", gap: "1rem" }}>
//     <Tooltip title="Edit">
//       <IconButton onClick={() => table.setEditingRow(row)}>
//         <EditIcon />
//       </IconButton>
//     </Tooltip>
//     <Tooltip title="Delete">
//       <IconButton color="error" onClick={() => openDeleteConfirmModal(row)}>
//         <DeleteIcon />
//       </IconButton>
//     </Tooltip>
//   </Box>
// ),
//     rowCount: data?.totalDocs ?? 0,
//     state: {
//       columnFilters,
//       globalFilter,
//       isLoading,
//       pagination,
//       showAlertBanner: isError,
//       showProgressBars: isRefetching,
//       sorting,
//     },
//   });

//   return <MaterialReactTable table={table} />;
// };
const otherconfigs: tableCols[] = [
  {
    accessorKey: "id",
    header: "Id",
    enableEditing: false,
  },
  {
    accessorKey: "creationDate",
    enableEditing: false,
  },
  {
    accessorKey: "position",
    header: "Position",
  },
];
const Modules = () => {
  const { manual, setManual } = useTableContext();
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
    title: "Modules",
    data: response ?? [],
    isError,
    isLoading,
    totalDocs: data?.data?.totalDocs ?? 0,
    tablecolumns: ["id", "name", "position", "creationDate"],
    columnConfigs: otherconfigs,
    isFetching,
    error,
    enableEditing: true,
    deleteUrl: "modules",
    setManual,
  });
  return (
    <div>
      <MaterialReactTable table={table} />
    </div>
  );
};
export default Modules;
