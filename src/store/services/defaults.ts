import { createSlice } from "@reduxjs/toolkit";

export interface DefaultState {
  headerText: string;
  manual: boolean;
}

const defaultState: DefaultState = {
  headerText: "",
  manual: false,
};

const defaultSlice = createSlice({
  name: "defaultslice",
  initialState: defaultState,
  reducers: {
    setHeaderText: (state, action: { payload: string }) => {
      state.headerText = action.payload;
    },
    setManual: (state, action: { payload: boolean }) => {
      state.manual = action.payload;
    },
  },
});

export const defaultReducer = defaultSlice.reducer;
export const { setHeaderText, setManual } = defaultSlice.actions;
