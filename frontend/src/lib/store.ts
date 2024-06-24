import { combineReducers, configureStore } from "@reduxjs/toolkit";
import boardSlice from "./reducers/boardSlice";
import userSlice from "./reducers/userSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"], // Only persist the user reducer
};

const rootReducer = combineReducers({
  user: userSlice,
  board: boardSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

/**
 * Creates and configures the Redux store.
 */
const makeStore = () =>
  configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST"],
          ignoredActionPaths: ["register", "rehydrate"],
        },
      }),
    devTools: process.env.NODE_ENV !== "production",
  });

export const store = makeStore();

export const persistor = persistStore(store);

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
