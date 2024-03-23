import {
  MRT_ColumnFiltersState,
  MRT_PaginationState,
  MRT_SortingState,
} from "material-react-table";
import React, { createContext, useContext, useEffect, useState } from "react";

interface TableContextState {
  manual: boolean;
  setManual: React.Dispatch<React.SetStateAction<boolean>>;
  columnFilters: MRT_ColumnFiltersState;
  setColumnFilters: React.Dispatch<
    React.SetStateAction<MRT_ColumnFiltersState>
  >;
  globalFilter: string;
  setGlobalFilter: React.Dispatch<React.SetStateAction<string>>;
  sorting: MRT_SortingState;
  setSorting: React.Dispatch<React.SetStateAction<MRT_SortingState>>;
  pagination: MRT_PaginationState;
  setPagination: React.Dispatch<React.SetStateAction<MRT_PaginationState>>;
}

const TableContext = createContext<TableContextState>({
  manual: true,
  setManual: () => {},
  columnFilters: [],
  setColumnFilters: () => {},
  globalFilter: "",
  setGlobalFilter: () => {},
  sorting: [],
  setSorting: () => {},
  pagination: { pageIndex: 0, pageSize: 5 },
  setPagination: () => {},
});

const TableContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [manual, setManual] = useState(true);
  const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [pagination, setPagination] = useState<MRT_PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  useEffect(() => {
    if (!manual) {
      setManual(true);
    }
  }, [pagination, globalFilter, columnFilters]);

  return (
    <TableContext.Provider
      value={{
        manual,
        setManual,
        columnFilters,
        setColumnFilters,
        globalFilter,
        setGlobalFilter,
        sorting,
        setSorting,
        pagination,
        setPagination,
      }}
    >
      {children}
    </TableContext.Provider>
  );
};

export const useTableContext = () => {
  const context = useContext(TableContext);
  if (context === undefined) {
    throw new Error(
      "useTableContext must be used within a TableContextProvider"
    );
  }
  return context;
};

export default TableContextProvider;
