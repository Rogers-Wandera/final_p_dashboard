import {
  useQuery,
  QueryFunction,
  QueryKey,
  keepPreviousData,
} from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";
import { useTableContext } from "../contexts/tablecontext";
// import { MRT_ColumnFiltersState } from "material-react-table";

export type ApiResponse<T> = {
  data: T;
  status: number;
};

const baseqry: string = import.meta.env.VITE_NODE_BASE_URL;

export type payLoadData = {
  url: string;
  method?: apimethods;
  headers?: AxiosRequestConfig["headers"];
  data?: FormData | Record<string, any>;
  manual?: boolean;
  key?: string;
  base_url?: string;
  urlparams?: typeurlparams;
};

export interface typeurlparams {
  columnFilters?: Array<any>;
  globalFilter?: string | null;
  sorting?: Array<{ id: string; desc: boolean }>;
  start: number;
  size: number;
}

async function fetchApi<T>(
  url: string,
  method: AxiosRequestConfig["method"] = "GET",
  headers: AxiosRequestConfig["headers"] = {},
  data?: FormData | Record<string, any>,
  urlparams?: typeurlparams
): Promise<ApiResponse<T>> {
  if (!urlparams) {
    urlparams = { start: 1, size: 10 };
  }
  try {
    if (method === "POST" || method === "PATCH") {
      if (!data) {
        throw new Error(`${method.toLowerCase()} data is required`);
      }
    }
    const serverurl = new URL(url);
    if (method === "GET") {
      serverurl.searchParams.set("start", JSON.stringify(urlparams.start));
      serverurl.searchParams.set("size", JSON.stringify(urlparams.size));
      serverurl.searchParams.set(
        "filters",
        JSON.stringify(urlparams.columnFilters ?? [])
      );
      serverurl.searchParams.set("globalFilter", urlparams.globalFilter ?? "");
      serverurl.searchParams.set(
        "sorting",
        JSON.stringify(urlparams.sorting ?? [])
      );
    }
    const response = await axios(serverurl.href, {
      method: method,
      headers,
      data: data || undefined,
    });
    return {
      data: response.data,
      status: response.status,
    };
  } catch (error: any) {
    throw new Error(error.response?.data || "An error occured");
  }
}

type apimethods =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "PATCH"
  | "HEAD"
  | "OPTIONS";

export function useApiQuery<T, E = unknown>({
  url,
  key = "api",
  method = "GET",
  headers = {},
  data = {},
  manual = false,
  base_url = baseqry,
}: payLoadData) {
  const { pagination, columnFilters, globalFilter, sorting } =
    useTableContext();
  const urlparams = {
    columnFilters,
    globalFilter,
    sorting,
    start: pagination.pageIndex + 1,
    size: pagination.pageSize,
  } as typeurlparams;
  const queryFn: QueryFunction<ApiResponse<T>, QueryKey> = async ({
    queryKey,
  }) => {
    const [_key, _url, _method, _headers, _data] = queryKey as [
      string,
      string,
      AxiosRequestConfig["method"],
      Record<string, string>,
      FormData | Record<string, any> | undefined
    ];
    const response = await fetchApi<T>(
      `${base_url}${_url}`,
      _method,
      _headers,
      _data,
      urlparams
    );
    return response;
  };
  return useQuery<ApiResponse<T>, E>({
    queryKey: [key, url, method, headers, data, urlparams],
    queryFn: queryFn,
    enabled: manual,
    placeholderData: keepPreviousData,
  });
}
