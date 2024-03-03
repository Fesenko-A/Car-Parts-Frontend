import React, { useEffect, useState } from "react";
import { inputHelper, toastNotify } from "../../Helper";
import {
  useCreateProductMutation,
  useGetProductByIdQuery,
  useUpdateProductMutation,
} from "../../APIs/productApi";
import { useNavigate, useParams } from "react-router-dom";
import { MainLoader } from "../../Components/Page/Common";
import { useGetAllBrandsQuery } from "../../APIs/brandApi";
import { Brand, Category, SpecialTag } from "../../Interfaces";
import { useGetAllCategoriesQuery } from "../../APIs/categoriesApi";
import { useGetAllSpecialTagsQuery } from "../../APIs/specialTagsApi";

const productData = {
  brandId: "1",
  name: "",
  description: "",
  inStock: "true",
  specialTagId: "1",
  categoryId: "1",
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

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specialTags, setSpecialTags] = useState<SpecialTag[]>([]);

  const { data: brandsData } = useGetAllBrandsQuery(null);
  const { data: categoriesData } = useGetAllCategoriesQuery(null);
  const { data: specialTagsData } = useGetAllSpecialTagsQuery(null);
  const { data: productsData } = useGetProductByIdQuery(id);

  useEffect(() => {
    if (productsData && productsData.result) {
      const tempData = {
        brandId: productsData.result.brandId,
        name: productsData.result.name,
        inStock: productsData.result.inStock,
        description: productsData.result.description,
        specialTagId: productsData.result.specialTagId,
        categoryId: productsData.result.categoryId,
        price: productsData.result.price,
        imageUrl: productsData.result.imageUrl,
      };
      setProductInputs(tempData);
    }
  }, [productsData]);

  useEffect(() => {
    setLoading(true);

    if (brandsData) {
      setBrands(brandsData.result);
    }
    if (categoriesData) {
      setCategories(categoriesData.result);
    }
    if (specialTagsData) {
      setSpecialTags(specialTagsData.result);
    }

    setLoading(false);
  }, [brandsData, categoriesData, specialTagsData]);

  const handleProductInput = (
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
    formData.append("InStock", JSON.parse(productInputs.inStock));
    formData.append("BrandId", productInputs.brandId);
    formData.append("SpecialTagId", productInputs.specialTagId);
    formData.append("CategoryId", productInputs.categoryId);
    formData.append("Price", productInputs.price.toString().replace(".", ","));
    formData.append("ImageUrl", productInputs.imageUrl);

    let response;
    if (id) {
      formData.append("Id", id);
      response = await updateProduct({ data: formData, id });
      console.log(response);
      toastNotify("Product updated successfully!", "success");
    } else {
      response = await createProduct(formData);
      toastNotify("Product created successfully!", "success");
    }

    if (response) {
      setLoading(false);
      navigate("/product/productList");
    }

    setLoading(false);
  };

  return (
    <>
      {loading && <MainLoader />}
      {!loading && (
        <>
          <div className="container border mt-5 p-5 bg-light">
            <h3 className="px-2 text-primary text-center">
              {id ? "Edit Product" : "Add Product"}
            </h3>
            <form
              method="post"
              encType="multipart/form-data"
              onSubmit={handleSubmit}
            >
              <div className="row mt-3" style={{ justifyContent: "center" }}>
                <div className="col-md-7">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter Name"
                    required
                    name="name"
                    value={productInputs.name}
                    onChange={handleProductInput}
                  />

                  <select
                    className="form-control mt-3 form-select"
                    required
                    name="brandId"
                    value={productInputs.brandId}
                    onChange={handleProductInput}
                  >
                    {brands.map((brand: Brand) => (
                      <option value={brand.id}>{brand.name}</option>
                    ))}
                  </select>

                  <textarea
                    className="form-control mt-3"
                    placeholder="Enter Description"
                    name="description"
                    rows={10}
                    value={productInputs.description}
                    onChange={handleProductInput}
                  />

                  <select
                    className="form-control mt-3 form-select"
                    name="inStock"
                    value={productInputs.inStock}
                    onChange={handleProductInput}
                  >
                    <option value={"true"}>In Stock</option>
                    <option value={"false"}>Out of Stock</option>
                  </select>

                  <select
                    className="form-control mt-3 form-select"
                    required
                    name="specialTagId"
                    value={productInputs.specialTagId}
                    onChange={handleProductInput}
                  >
                    {specialTags.map((specialTag: SpecialTag) => (
                      <option value={specialTag.id}>{specialTag.name}</option>
                    ))}
                  </select>

                  <select
                    className="form-control mt-3 form-select"
                    required
                    name="categoryId"
                    value={productInputs.categoryId}
                    onChange={handleProductInput}
                  >
                    {categories.map((category: Category) => (
                      <option value={category.id}>{category.name}</option>
                    ))}
                  </select>

                  <input
                    type="number"
                    className="form-control mt-3"
                    placeholder="Enter Price"
                    required
                    name="price"
                    value={productInputs.price}
                    onChange={handleProductInput}
                  />

                  <input
                    type="text"
                    className="form-control mt-3"
                    placeholder="Enter Picture Link"
                    required
                    name="imageUrl"
                    value={productInputs.imageUrl}
                    onChange={handleProductInput}
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
        </>
      )}
    </>
  );
}

export default ProductUpsert;
