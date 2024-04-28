import { createAction, createSlice } from "@reduxjs/toolkit";

export const revertAll = createAction("REVERT_ALL");
export interface DefaultState {
  headerText: string;
  manual: boolean;
  viewer: "Admin" | "User";
}

const defaultState: DefaultState = {
  headerText: "",
  manual: false,
  viewer: "User",
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
    setViewer: (state, action: { payload: "Admin" | "User" }) => {
      state.viewer = action.payload;
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => defaultState),
});

export const defaultReducer = defaultSlice.reducer;
export const { setHeaderText, setManual, setViewer } = defaultSlice.actions;
