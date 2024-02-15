import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "./baseUrl";

const onlinePaymentsApi = createApi({
  reducerPath: "onlinePaymentsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["OnlinePayment"],
  endpoints: (builder) => ({
    getAllPayments: builder.query({
      query: () => ({
        url: "onlinePayment/getall",
      }),
      providesTags: ["OnlinePayment"],
    }),
    getPaymentByOrderId: builder.query({
      query: (id) => ({
        url: `onlinePayment/getbyorderid/${id}`,
      }),
      providesTags: ["OnlinePayment"],
    }),
    createPayment: builder.mutation({
      query: (id) => ({
        url: `onlinePayment/create/${id}`,
        method: "POST",
      }),
      invalidatesTags: ["OnlinePayment"],
    }),
    cancelPayment: builder.mutation({
      query: (id) => ({
        url: `onlinePayment/cancel/${id}`,
        method: "PUT",
      }),
      invalidatesTags: ["OnlinePayment"],
    }),
  }),
});

export const {
  useGetAllPaymentsQuery,
  useGetPaymentByOrderIdQuery,
  useCreatePaymentMutation,
  useCancelPaymentMutation,
} = onlinePaymentsApi;
export default onlinePaymentsApi;
