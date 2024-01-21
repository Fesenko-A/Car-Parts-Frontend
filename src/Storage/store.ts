import { configureStore } from "@reduxjs/toolkit";
import { authApi, productApi } from "../APIs";
import { userAuthReducer } from "./userAuthSlice";
import { productReducer } from "./productSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    productStore: productReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authApi.middleware),
  // .concat(orderApi.middleware)
  // .concat(paymentApi.middleware)
  // .concat(shoppingCartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
