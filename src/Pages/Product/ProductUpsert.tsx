import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../APIs/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";

const productData = {
  brandId: "",
  name: "",
  description: "",
  specialTagId: "",
  categoryId: "",
  price: "",
  imageUrl: "",
};

function ProductUpsert() {
  const { id } = useParams();
  const [productInputs, setProductInputs] = useState(productData);
  const [loading, setLoading] = useState(false);
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const navigate = useNavigate();

  const { data } = useGetProductByIdQuery(id);

  useEffect(() => {
    if (data && data.result) {
      const tempData = {
        brandId: data.result.brandId,
        name: data.result.name,
        description: data.result.description,
        specialTagId: data.result.specialTagId,
        categoryId: data.result.categoryId,
        price: data.result.price,
        imageUrl: data.result.imageUrl,
      };
      setProductInputs(tempData);
    }
  }, [data]);

  const handleMenuItemInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, productInputs);
    setProductInputs(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Name", productInputs.name);
    formData.append("Description", productInputs.description);
    formData.append("BrandId", productInputs.brandId);
    formData.append("SpecialTagId", productInputs.specialTagId);
    formData.append("CategoryId", productInputs.categoryId);
    formData.append("Price", productInputs.price);
    formData.append("ImageUrl", productInputs.imageUrl);

    let response;
    if (id) {
      formData.append("Id", id);
      response = await updateProduct({ data: formData, id });
      toastNotify("Menu Item updated successfully!", "success");
    } else {
      response = await createProduct(formData);
      toastNotify("Menu Item created successfully!", "success");
    }

    if (response) {
      setLoading(false);
      console.log(response);
      navigate("/product/productList");
    }

    setLoading(false);
  };

  return (
    <div className="container border mt-5 p-5 bg-light">
      {loading && <MainLoader />}
      <h3 className="px-2 text-primary text-center">
        {id ? "Edit Product" : "Add Product"}
      </h3>
      <form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
        <div className="row mt-3" style={{ justifyContent: "center" }}>
          <div className="col-md-7">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              name="name"
              value={productInputs.name}
              onChange={handleMenuItemInput}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Enter Brand"
              required
              name="brandId"
              value={productInputs.brandId}
              onChange={handleMenuItemInput}
            />
            <textarea
              className="form-control mt-3"
              placeholder="Enter Description"
              name="description"
              rows={10}
              value={productInputs.description}
              onChange={handleMenuItemInput}
            />
            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter Special Tag"
              required
              name="specialTagId"
              value={productInputs.specialTagId}
              onChange={handleMenuItemInput}
            />
            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter Category"
              required
              name="categoryId"
              value={productInputs.categoryId}
              onChange={handleMenuItemInput}
            />
            {/* <select
              className="form-control mt-3 form-select"
              //placeholder="Enter Category"
              required
              name="categoryId"
              value={productInputs.categoryId}
              onChange={handleMenuItemInput}
            >
              {/* {categories.map((category) => (
                <option value={category} key={category}>
                  {category}
                </option>
              ))} */}
            {/* </select>  */}

            <input
              type="number"
              className="form-control mt-3"
              placeholder="Enter Price"
              required
              name="price"
              value={productInputs.price}
              onChange={handleMenuItemInput}
            />
            <input
              type="text"
              className="form-control mt-3"
              placeholder="Enter Picture Link"
              required
              name="imageUrl"
              value={productInputs.imageUrl}
              onChange={handleMenuItemInput}
            />
            <div className="row">
              <div className="col-6">
                <button
                  type="submit"
                  className="btn btn-primary form-control mt-3"
                >
                  {id ? "Update" : "Create"}
                </button>
              </div>
              <div className="col-6">
                <a
                  onClick={() => navigate("/product/productList")}
                  className="btn btn-secondary form-control mt-3"
                >
                  Back to Menu Items
                </a>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ProductUpsert;
