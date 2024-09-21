import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import packageSlice from "./slices/packageSlice";
import viewmodelSlice from "./slices/viewmodelSlice";
import uiSlice from "./slices/uiSlice";

export const store = configureStore({
  reducer: {
    login: userSlice,
    package: packageSlice,
    model: viewmodelSlice,
    ui: uiSlice,
  },
});
