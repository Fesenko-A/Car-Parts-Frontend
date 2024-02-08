import React, { useEffect, useState } from "react";
import {
  useCreateBrandMutation,
  useGetAllBrandsQuery,
} from "../../APIs/brandApi";
import {
  useCreateCategoryMutation,
  useGetAllCategoriesQuery,
} from "../../APIs/categoriesApi";
import {
  useCreateSpecialTagMutation,
  useGetAllSpecialTagsQuery,
} from "../../APIs/specialTagsApi";
import { Brand, Category, SpecialTag } from "../../Interfaces";
import { inputHelper, toastNotify } from "../../Helper";

const brandInputsData = {
  name: "",
};
const categoryInputsData = {
  name: "",
};

const specialTagInputsData = {
  name: "",
};

function ProductInformation() {
  const [loading, setLoading] = useState(false);
  const [brandInputs, setBrandInputs] = useState(brandInputsData);
  const [categoryInputs, setCategoryInputs] = useState(categoryInputsData);
  const [specialTagInputs, setspecialTagInputs] =
    useState(specialTagInputsData);

  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [specialTags, setSpecialTags] = useState<SpecialTag[]>([]);

  const { data: brandsData } = useGetAllBrandsQuery(null);
  const { data: categoriesData } = useGetAllCategoriesQuery(null);
  const { data: specialTagsData } = useGetAllSpecialTagsQuery(null);

  const [createBrand] = useCreateBrandMutation();
  const [createCategory] = useCreateCategoryMutation();
  const [createSpecialTag] = useCreateSpecialTagMutation();

  const handleBrandInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, brandInputs);
    setBrandInputs(tempData);
  };

  const handleCategoryInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, categoryInputs);
    setCategoryInputs(tempData);
  };

  const handleSpecialTagInput = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const tempData = inputHelper(e, specialTagInputs);
    setspecialTagInputs(tempData);
  };

  const handleSumbitBrand = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Name", brandInputs.name);
    await createBrand(formData);
    toastNotify("Brand added successfully!", "success");

    setLoading(false);
  };

  const handleSumbitCategory = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Name", categoryInputs.name);
    await createCategory(formData);
    toastNotify("Category added successfully!", "success");

    setLoading(false);
  };

  const handleSumbitSpecialTag = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("Name", specialTagInputs.name);
    await createSpecialTag(formData);
    toastNotify("Special Tag added successfully!", "success");

    setLoading(false);
  };

  useEffect(() => {
    if (brandsData) {
      setBrands(brandsData.result);
    }
    if (categoriesData) {
      setCategories(categoriesData.result);
    }
    if (specialTagsData) {
      setSpecialTags(specialTagsData.result);
    }
  }, [brandsData, categoriesData, specialTagsData]);

  return (
    <div className="container mt-5 ">
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              Brands
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
          >
            <div className="accordion-body p-2 bg-light">
              <ul className="list-group" style={{ listStyleType: "none" }}>
                <li>
                  <form
                    encType="multipart/form-data"
                    method="post"
                    className="input-group mb-3"
                    onSubmit={handleSumbitBrand}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Brand name"
                      required
                      name="name"
                      value={brandInputs.name}
                      onChange={handleBrandInput}
                    />
                    <button
                      className="btn btn-primary input-group-text"
                      id="basic-addon2"
                      type="submit"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </form>
                </li>
                {brands.map((brand: Brand) => (
                  <li className="list-group-item list-group-item-action">
                    {brand.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              Categories
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body p-2 bg-light">
              <ul className="list-group" style={{ listStyleType: "none" }}>
                <li>
                  <form
                    encType="multipart/form-data"
                    method="post"
                    className="input-group mb-3"
                    onSubmit={handleSumbitCategory}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Category name"
                      required
                      name="name"
                      value={categoryInputs.name}
                      onChange={handleCategoryInput}
                    />
                    <button
                      className="btn btn-primary input-group-text"
                      id="basic-addon2"
                      type="submit"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </form>
                </li>
                {categories.map((category: Category) => (
                  <li className="list-group-item list-group-item-action">
                    {category.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              Special Tags
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body p-2 bg-light">
              <ul className="list-group" style={{ listStyleType: "none" }}>
                <li>
                  <form
                    encType="multipart/form-data"
                    method="post"
                    className="input-group mb-3"
                    onSubmit={handleSumbitSpecialTag}
                  >
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Special Tag name"
                      required
                      name="name"
                      value={specialTagInputs.name}
                      onChange={handleSpecialTagInput}
                    />
                    <button
                      className="btn btn-primary input-group-text"
                      id="basic-addon2"
                      type="submit"
                    >
                      <i className="bi bi-plus-lg"></i>
                    </button>
                  </form>
                </li>
                {specialTags.map((specialTag: SpecialTag) => (
                  <li className="list-group-item list-group-item-action">
                    {specialTag.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInformation;
