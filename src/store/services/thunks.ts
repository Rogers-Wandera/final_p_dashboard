import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApi, setLoading, setModules } from "./auth";

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
