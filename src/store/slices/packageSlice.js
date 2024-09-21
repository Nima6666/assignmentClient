import { createSlice } from "@reduxjs/toolkit";

const packageSlice = createSlice({
  name: "package",
  initialState: { packageInfo: { resolved: false, packages: [] } },
  reducers: {
    setPackages(state, action) {
      state.packageInfo.resolved = true;
      state.packageInfo.packages = action.payload;
    },
  },
});

export const packageActions = packageSlice.actions;
export default packageSlice.reducer;
