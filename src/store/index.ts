import { configureStore, combineReducers } from "@reduxjs/toolkit";
import settingReducer from "./setting/reducers";
import { setupListeners } from "@reduxjs/toolkit/query";
import { AuthApi, ServerCheckApi, authReducer } from "./services/auth";
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

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  authuser: authReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    appState: persistedReducer,
    setting: settingReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
    [ServerCheckApi.reducerPath]: ServerCheckApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    })
      .concat(thunk)
      .concat(AuthApi.middleware)
      .concat(ServerCheckApi.middleware);
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
