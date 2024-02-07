import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "./baseUrl";

const brandApi = createApi({
  reducerPath: "brandApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Brand"],
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: () => ({
        url: "brand/getall",
      }),
      providesTags: ["Brand"],
    }),
    createBrand: builder.mutation({
      query: (data) => ({
        url: "brand/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Brand"],
    }),
  }),
});

export const { useGetAllBrandsQuery, useCreateBrandMutation } = brandApi;
export default brandApi;
