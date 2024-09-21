import { createSlice } from "@reduxjs/toolkit";

const viewModelSlice = createSlice({
  name: "viewModel",
  initialState: {
    modelDetails: { packageDetails: {}, quantity: 1, total: 0 },
    open: false,
  },
  reducers: {
    setModelPackage(state, action) {
      state.modelDetails.packageDetails = action.payload;
      state.modelDetails.total = action.payload.price;
      state.open = true;
    },
    incrementPackage(state) {
      state.modelDetails.quantity++;
      state.modelDetails.total =
        state.modelDetails.packageDetails.price * state.modelDetails.quantity;
    },
    decrementPackage(state) {
      if (state.modelDetails.quantity > 1) state.modelDetails.quantity--;
      state.modelDetails.total =
        state.modelDetails.packageDetails.price * state.modelDetails.quantity;
    },
    resetModel(state) {
      state.modelDetails.packageDetails = {};
      state.modelDetails.quantity = 1;
      state.open = false;
      state.modelDetails.total = 0;
    },
  },
});

export const modelActions = viewModelSlice.actions;
export default viewModelSlice.reducer;
