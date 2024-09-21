import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "package",
  initialState: { loginForm: false, submitting: false, logoutModel: false },
  reducers: {
    openLoginForm(state) {
      state.loginForm = true;
    },
    closeLoginForm(state) {
      state.loginForm = false;
    },
    setSubmitting(state) {
      state.submitting = true;
    },
    setSubmittingResolved(state) {
      state.submitting = false;
    },
    setLogoutModelTrue(state) {
      state.logoutModel = true;
    },
    setLogoutModelFalse(state) {
      console.log("set false model");
      state.logoutModel = false;
    },
  },
});

export const uiActions = uiSlice.actions;
export default uiSlice.reducer;
