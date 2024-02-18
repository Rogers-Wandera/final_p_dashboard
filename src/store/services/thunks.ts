import { createAsyncThunk } from "@reduxjs/toolkit";
import { AuthApi, setUser } from "./auth";

export const fetchUserData = createAsyncThunk(
  "authapi/getuser",
  async (_, { dispatch }) => {
    try {
      const userResponse = await dispatch(
        AuthApi.endpoints.getUser.initiate({})
      );
      dispatch(setUser(userResponse.data));
      return userResponse.data;
    } catch (error) {
      throw error;
    }
  }
);
