import { createSlice } from "@reduxjs/toolkit";
import {
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export interface AuthUserState {
  isLoggedIn: boolean;
  token: string;
}

export interface LoginResponse {
  msg: string;
  accessToken: string;
}

export interface ErrorResponse {
  field: string;
  message: string;
}

export const AuthApi = createApi({
  reducerPath: "authapi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_NODE_BASE_URL }),
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (payload) => ({
        url: "/login",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json",
        },
      }),
      transformResponse: (response: LoginResponse) => {
        return response;
      },

      transformErrorResponse: (error: FetchBaseQueryError) => {
        if ("data" in error && Array.isArray(error.data)) {
          return error.data as ErrorResponse[];
        }
        return error.data;
      },
    }),
  }),
});

export const ServerCheckApi = createApi({
  reducerPath: "servercheckapi",
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_NODE_URL }),
  endpoints: (builder) => ({
    checkServerStatus: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});

const initialState: AuthUserState = {
  isLoggedIn: false,
  token: "",
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    try {
      builder.addMatcher(
        AuthApi.endpoints.loginUser.matchFulfilled,
        (state, action) => {
          state.token = action.payload.accessToken;
          state.isLoggedIn = true;
        }
      );
    } catch (error) {
      throw error;
    }
  },
});
export const authReducer = AuthSlice.reducer;
export const { useLoginUserMutation } = AuthApi;
export const { useCheckServerStatusQuery } = ServerCheckApi;
