import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "login",
  initialState: {
    loggedInUser: { resolved: false, user: null },
    paymentInfo: { resolved: false, payments: [] },
  },
  reducers: {
    setLoggedInUser(state, action) {
      state.loggedInUser.resolved = true;
      state.loggedInUser.user = action.payload;
    },
    setUserResolvedTrue(state) {
      state.loggedInUser.resolved = true;
      state.loggedInUser.user = null;
    },
    setUserResolvedFalse(state) {
      state.loggedInUser.resolved = false;
      state.loggedInUser.user = null;
    },
    setPaymentResolvedTrueNull(state) {
      state.paymentInfo.resolved = false;
      state.paymentInfo.payments = null;
    },
    setPayment(state, action) {
      state.paymentInfo.resolved = true;
      state.paymentInfo.payments = action.payload;
    },
  },
});

export const loginActions = userSlice.actions;
export default userSlice.reducer;
