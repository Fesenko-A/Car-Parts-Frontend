import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "./baseUrl";

const shoppingCartApi = createApi({
  reducerPath: "shoppingCartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["ShoppingCart"],
  endpoints: (builder) => ({
    getShoppingCart: builder.query({
      query: (userId) => ({
        url: "shoppingCart/get",
        params: {
          userId: userId,
        },
      }),
      providesTags: ["ShoppingCart"],
    }),
    upsertShoppingCart: builder.mutation({
      query: ({ productId, updateQuantityBy, userId }) => ({
        url: "shoppingcart/upsert",
        method: "POST",
        params: {
          productId,
          updateQuantityBy,
          userId,
        },
      }),
      invalidatesTags: ["ShoppingCart"],
    }),
  }),
});

export const { useGetShoppingCartQuery, useUpsertShoppingCartMutation } =
  shoppingCartApi;
export default shoppingCartApi;
