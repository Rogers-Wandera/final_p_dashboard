import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState, UserState } from "../../contexts/authcontext";

export interface AuthUserState {
  isLoggedIn: boolean;
  token: string;
  user: UserState;
  loading: boolean;
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
    getUser: builder.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
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
  user: {},
  loading: false,
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loguserout: (state, action: PayloadAction<AuthUserState>) => {
      const { payload } = action;
      state.isLoggedIn = payload.isLoggedIn;
      state.token = payload.token;
      state.user = payload.user;
    },
    setUser: (state, action: PayloadAction<UserState>) => {
      const { payload } = action;
      state.user = payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
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
export const { loguserout, setUser, setLoading } = AuthSlice.actions;
export const { useLoginUserMutation, useGetUserQuery } = AuthApi;
export const { useCheckServerStatusQuery } = ServerCheckApi;
