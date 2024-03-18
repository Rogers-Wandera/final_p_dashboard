import { configureStore, combineReducers } from "@reduxjs/toolkit";
import settingReducer from "./setting/reducers";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthApi, ServerCheckApi, authReducer } from "./services/auth";
import { apiSlice } from "./services/apislice";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { thunk } from "redux-thunk";
import { defaultReducer } from "./services/defaults";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  authuser: authReducer,
  defaultstate: defaultReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    appState: persistedReducer,
    setting: settingReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ServerCheckApi.reducerPath]: ServerCheckApi.reducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      immutableCheck: false,
    })
      .concat(thunk)
      .concat(AuthApi.middleware)
      .concat(ServerCheckApi.middleware)
      .concat(apiSlice.middleware);
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
