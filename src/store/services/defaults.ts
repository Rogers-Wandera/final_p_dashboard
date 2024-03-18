import { createSlice } from "@reduxjs/toolkit";

export interface DefaultState {
  headerText: string;
}

const defaultState: DefaultState = {
  headerText: "",
};

const defaultSlice = createSlice({
  name: "defaultslice",
  initialState: defaultState,
  reducers: {
    setHeaderText: (state, action: { payload: string }) => {
      state.headerText = action.payload;
    },
  },
});

export const defaultReducer = defaultSlice.reducer;
export const { setHeaderText } = defaultSlice.actions;
