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
      query: ({ userId, status }) => ({
        url: "onlinePayment/getall",
        params: {
          ...(userId && { userId }),
          ...(status && { status }),
        },
      }),
      transformResponse(apiResponse: { result: any }, meta: any) {
        return {
          apiResponse,
        };
      },
      providesTags: ["OnlinePayment"],
    }),
    getPaymentByOrderId: builder.query({
      query: (id) => ({
        url: `onlinePayment/getbyorderid/${id}`,
      }),
      providesTags: ["OnlinePayment"],
    }),
    createIntent: builder.mutation({
      query: (userId) => ({
        url: `onlinePayment/createIntent/${userId}`,
        method: "POST",
      }),
      invalidatesTags: ["OnlinePayment"],
    }),
    createPayment: builder.mutation({
      query: ({ orderId, paymentId }) => ({
        url: `onlinePayment/create/${orderId}/${paymentId}`,
        method: "POST",
        params: {
          ...(orderId && { orderId }),
          ...(paymentId && { paymentId }),
        },
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
  useCreateIntentMutation,
  useCancelPaymentMutation,
} = onlinePaymentsApi;
export default onlinePaymentsApi;
