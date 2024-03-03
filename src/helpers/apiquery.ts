import { useQuery, QueryFunction, QueryKey } from "@tanstack/react-query";
import axios, { AxiosRequestConfig } from "axios";

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
};

async function fetchApi<T>(
  url: string,
  method: AxiosRequestConfig["method"] = "GET",
  headers: AxiosRequestConfig["headers"] = {},
  data?: FormData | Record<string, any>
): Promise<ApiResponse<T>> {
  try {
    const response = await axios(url, {
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
      _data
    );
    return response;
  };
  return useQuery<ApiResponse<T>, E>({
    queryKey: [key, url, method, headers, data],
    queryFn: queryFn,
    enabled: manual,
  });
}
