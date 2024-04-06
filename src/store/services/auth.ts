import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../contexts/authcontext";

export interface ModulesTypeLinks {
  name: string;
  expired: number;
  linkname: string;
  route: string;
  render: number;
}

export interface UserTokenObject {
  displayName: string;
  id: string;
  roles: number[];
  isLocked: number;
  verified: number;
  adminCreated: number;
  position: string;
}

export interface TypeToken {
  exp: number;
  iat: number;
  sub: string;
  user: UserTokenObject;
}

export interface ModulesType {
  [modulename: string]: ModulesTypeLinks[];
}

export interface AuthUserState {
  isLoggedIn: boolean;
  token: string;
  loading: boolean;
  modules: ModulesType;
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
    getModules: builder.query({
      query: () => ({
        url: "/modules/linkroles/user/view",
        method: "GET",
      }),
    }),
    resetPassword: builder.mutation({
      query: (payload) => ({
        url: "/resetpassword",
        method: "POST",
        body: payload,
        headers: {
          "Content-type": "application/json",
        },
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
  loading: false,
  modules: {},
};
const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loguserout: (state, _) => {
      state.isLoggedIn = false;
      state.token = "";
      state.modules = {};
    },
    setModules: (state, action: PayloadAction<ModulesType>) => {
      const { payload } = action;
      state.modules = payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    setLoggedIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggedIn = action.payload;
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
export const { loguserout, setLoading, setModules, setLoggedIn, setToken } =
  AuthSlice.actions;
export const {
  useLoginUserMutation,
  useGetUserQuery,
  useGetModulesQuery,
  useResetPasswordMutation,
} = AuthApi;
export const { useCheckServerStatusQuery } = ServerCheckApi;
