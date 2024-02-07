import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "./baseUrl";

const specialTagsApi = createApi({
  reducerPath: "specialTag",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["SpecialTag"],
  endpoints: (builder) => ({
    getAllSpecialTags: builder.query({
      query: () => ({
        url: "specialTag/getall",
      }),
      providesTags: ["SpecialTag"],
    }),
    createSpecialTag: builder.mutation({
      query: (data) => ({
        url: "specialTag/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["SpecialTag"],
    }),
  }),
});

export const { useGetAllSpecialTagsQuery, useCreateSpecialTagMutation } =
  specialTagsApi;
export default specialTagsApi;
