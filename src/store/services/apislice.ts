import {
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../contexts/authcontext";
import Swal from "sweetalert2";
import { deleteDataApi } from "./thunks";
import { handleError } from "../../helpers/utils";
import { SharedStateContextType } from "../../contexts/sharedcontexts";
import { EnqueueSnackbar } from "notistack";

export interface PostPatchPayLoad<T extends {}> {
  url: string;
  data: Array<T> | T;
  method?: "POST" | "PATCH";
  type?: "application/json" | "multipart/form-data";
}

export interface DeletePayLoad {
  url: string;
  data?: any;
}

export interface GenericApiResponse<T> {
  docs: Array<T>;
  totalDocs: number;
  totalPages: number;
  page: number;
}

export type deleteProps = {
  url: string;
  title?: string;
  text?: string;
  data?: any;
  dispatch: any;
  appstate: SharedStateContextType | null;
  enqueueSnackbar: EnqueueSnackbar;
  setManual?: React.Dispatch<React.SetStateAction<boolean>>;
  onCancelCallback?: () => void;
  onConfirmCallback?: () => void;
  dialogProps?: {
    zIndex?: number;
  };
};

export interface ErrorResponse {
  field: string;
  message: string;
}

export interface ApiResponse {
  msg: string;
  data?: any;
}

export interface ApiEndPointProp {
  url: string;
}

export const apiSlice = createApi({
  reducerPath: "apislice",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_NODE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).appState.authuser.token;
      if (token !== "") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    postData: builder.mutation<ApiResponse, PostPatchPayLoad<any>>({
      query: (payload) => ({
        url: payload.url,
        method: payload.method || "POST",
        body: payload.data,
        headers: {
          "Content-Type": payload.type || "application/json",
        },
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if ("data" in error && Array.isArray(error.data)) {
          return error.data as ErrorResponse[];
        }
        return error.data;
      },
    }),
    deleteData: builder.mutation<ApiResponse, DeletePayLoad>({
      query: (payload) => ({
        url: payload.url,
        method: "DELETE",
        body: payload.data,
      }),
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if ("data" in error && Array.isArray(error.data)) {
          return error.data as ErrorResponse[];
        }
        return error.data;
      },
    }),
  }),
});

export const { useDeleteDataMutation, usePostDataMutation } = apiSlice;
export const handleDelete = async ({
  url,
  dispatch,
  appstate,
  enqueueSnackbar,
  data = {},
  title = "Are you sure?",
  text = "You will not be able to reverse this.",
  setManual = () => {},
}: deleteProps) => {
  const results = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete!",
    cancelButtonText: "Cancel",
  });
  if (results.isConfirmed) {
    try {
      const response = await dispatch(deleteDataApi({ url, data }));
      if (response.payload?.error) {
        throw response.payload.error;
      }
      const message = response.payload?.data?.msg || "Deleted successfully";
      enqueueSnackbar(message, {
        variant: "success",
        anchorOrigin: { horizontal: "right", vertical: "top" },
      });
      setManual(true);
    } catch (error) {
      handleError(error, appstate, enqueueSnackbar);
      //   Swal.fire("Error!", error.);
    }
  }
};
