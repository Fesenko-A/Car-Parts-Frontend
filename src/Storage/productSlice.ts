import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  product: [],
  search: "",
};

export const productSlice = createSlice({
  name: "Product",
  initialState: initialState,
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    setSearchProduct: (state, action) => {
      state.search = action.payload;
    },
  },
});

export const { setProduct, setSearchProduct } = productSlice.actions;
export const productReducer = productSlice.reducer;
