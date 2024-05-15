import { createAction, createSlice } from "@reduxjs/toolkit";

export const revertAll = createAction("REVERT_ALL");
export interface DefaultState {
  headerText: string;
  manual: boolean;
  viewer: "Admin" | "User";
  online: boolean;
  session: boolean;
}

const defaultState: DefaultState = {
  headerText: "",
  manual: false,
  viewer: "User",
  online: false,
  session: false,
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
    setOnline: (state, action: { payload: boolean }) => {
      state.online = action.payload;
    },
    setSession: (state, action: { payload: boolean }) => {
      state.session = action.payload;
    },
  },
  extraReducers: (builder) => builder.addCase(revertAll, () => defaultState),
});

export const defaultReducer = defaultSlice.reducer;
export const { setHeaderText, setManual, setViewer, setOnline, setSession } =
  defaultSlice.actions;
