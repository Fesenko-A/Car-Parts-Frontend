import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import url from "./baseUrl";

const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: url,
    prepareHeaders: (headers: Headers, api) => {
      const token = localStorage.getItem("token");
      token && headers.append("Authorization", "Bearer " + token);
    },
  }),
  tagTypes: ["Products"],
  endpoints: (builder) => ({
    getAllProducts: builder.query({
      query: ({
        brand,
        category,
        specialTag,
        searchString,
        pageNumber,
        pageSize,
        sortingOptions,
        outOfStock,
      }) => ({
        url: "products/getall",
        params: {
          ...(brand && { brand }),
          ...(category && { category }),
          ...(specialTag && { specialTag }),
          ...(searchString && { searchString }),
          ...(pageNumber && { pageNumber }),
          ...(pageSize && { pageSize }),
          ...(sortingOptions && { sortingOptions }),
          ...(outOfStock && { outOfStock }),
        },
      }),
      transformResponse(apiResponse: { result: any }, meta: any) {
        return {
          apiResponse,
          totalRecords: meta.response.headers.get("X-Pagination"),
        };
      },
      providesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `products/get/${id}`,
      }),
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (data) => ({
        url: "products/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    updateProduct: builder.mutation({
      query: ({ data, id }) => ({
        url: `products/update/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `products/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useDeleteProductMutation,
  useUpdateProductMutation,
} = productApi;
export default productApi;
