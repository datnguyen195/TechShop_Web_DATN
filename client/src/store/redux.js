import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userStore from "./user/userStore";

const commonConfig = {
  key: "shop/user",
  storage,
};

const userConfig = {
  ...commonConfig,
  whitelist: ["isLoggedIn", "token", "current"],
};

export const store = configureStore({
  reducer: {
    user: persistReducer(userConfig, userStore),
  },
});

export const persistor = persistStore(store);
