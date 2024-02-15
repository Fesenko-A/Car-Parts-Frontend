import { configureStore } from "@reduxjs/toolkit";
import {
  authApi,
  brandApi,
  categoriesApi,
  onlinePaymentsApi,
  orderApi,
  paymentApi,
  productApi,
  shoppingCartApi,
  specialTagsApi,
} from "../APIs";
import { userAuthReducer } from "./userAuthSlice";
import { productReducer } from "./productSlice";
import { shoppingCartReducer } from "./shoppingCartSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    productStore: productReducer,
    shoppingCartStore: shoppingCartReducer,
    [productApi.reducerPath]: productApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [shoppingCartApi.reducerPath]: shoppingCartApi.reducer,
    [paymentApi.reducerPath]: paymentApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [brandApi.reducerPath]: brandApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [specialTagsApi.reducerPath]: specialTagsApi.reducer,
    [onlinePaymentsApi.reducerPath]: onlinePaymentsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(productApi.middleware)
      .concat(authApi.middleware)
      .concat(orderApi.middleware)
      .concat(paymentApi.middleware)
      .concat(shoppingCartApi.middleware)
      .concat(brandApi.middleware)
      .concat(categoriesApi.middleware)
      .concat(specialTagsApi.middleware)
      .concat(onlinePaymentsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
