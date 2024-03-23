import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApi, setLoading, setModules } from "./auth";
import { DeletePayLoad, apiSlice } from "./apislice";

export const fetchUserData = createAsyncThunk(
  "authapi/getuser",
  async (_, { dispatch }) => {
    try {
      const userResponse = await dispatch(
        AuthApi.endpoints.getUser.initiate({})
      );
      return userResponse.data;
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  }
);

export const fetchUserLinks = createAsyncThunk(
  "authapi/getmodules",
  async (_, { dispatch }) => {
    try {
      const response = await dispatch(
        AuthApi.endpoints.getModules.initiate({})
      );
      dispatch(setModules(response.data));
      return response.data;
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  }
);

export const deleteDataApi = createAsyncThunk(
  "apislice/deletedata",
  async ({ url, data }: DeletePayLoad, { dispatch }) => {
    try {
      const userResponse = await dispatch(
        apiSlice.endpoints.deleteData.initiate({ url, data })
      );
      return userResponse;
    } catch (error) {
      dispatch(setLoading(false));
      throw error;
    }
  }
);
