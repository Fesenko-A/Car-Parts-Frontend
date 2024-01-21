import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "../APIs";
import { userAuthReducer } from "./userAuthSlice";

const store = configureStore({
  reducer: {
    userAuthStore: userAuthReducer,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      // .concat(menuItemApi.middleware)
      .concat(authApi.middleware),
  // .concat(orderApi.middleware)
  // .concat(paymentApi.middleware)
  // .concat(shoppingCartApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
