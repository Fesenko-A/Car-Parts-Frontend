import React, { useEffect, useState } from "react";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../APIs/productApi";
import { MainLoader } from "../../Components/Page/Common";
import { Brand, Category, Product, SpecialTag } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getPageDetails, toastNotify } from "../../Helper";
import { SortingTypes } from "../../Static";
import { useGetAllCategoriesQuery } from "../../APIs/categoriesApi";
import { useGetAllBrandsQuery } from "../../APIs/brandApi";
import { useGetAllSpecialTagsQuery } from "../../APIs/specialTagsApi";
import { FiltersButton } from "../../Components/Page/Home";

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const sortOptions: Array<SortingTypes> = [
    SortingTypes.PRICE_LOW_HIGH,
    SortingTypes.PRICE_HIGH_LOW,
  ];

  const [deleteProduct] = useDeleteProductMutation();
  const navigate = useNavigate();

  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 6,
  });
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedSpecialTag, setSelectedSpecialTag] =
    useState("All Special Tags");
  const [searchValue, setSearchValue] = useState("");
  const [sortType, setSortType] = useState(SortingTypes.PRICE_LOW_HIGH);
  const [outOfStockValue, setOutOfStock] = useState("true");
  const [onlyWithDiscountValue, setOnlyWithDiscount] = useState("false");

  const [apiFilters, setApiFilters] = useState({
    brand: selectedBrand,
    category: selectedCategory,
    specialTag: selectedSpecialTag,
    searchString: searchValue,
    sortingOptions: sortType,
    outOfStock: outOfStockValue,
    onlyWithDiscount: onlyWithDiscountValue,
  });

  const { data, isLoading } = useGetAllProductsQuery({
    brand: apiFilters.brand,
    category: apiFilters.category,
    specialTag: apiFilters.specialTag,
    searchString: apiFilters.searchString,
    pageNumber: pageOptions.pageNumber,
    pageSize: pageOptions.pageSize,
    sortingOptions: apiFilters.sortingOptions,
    outOfStock: apiFilters.outOfStock,
    onlyWithDiscount: apiFilters.onlyWithDiscount,
  });
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery(null);
  const { data: brandsData, isLoading: brandsLoading } =
    useGetAllBrandsQuery(null);
  const { data: specialTagsData, isLoading: specialTagsLoading } =
    useGetAllSpecialTagsQuery(null);

  const [categoryList, setCategoryList] = useState([""]);
  const [brandsList, setBrandsList] = useState([""]);
  const [specialTagsList, setSpecialTagsList] = useState([""]);

  useEffect(() => {
    if (!categoriesLoading) {
      const tempCategoryList = ["All Categories"];
      if (categoriesData) {
        categoriesData.result.map((category: Category) =>
          tempCategoryList.push(category.name)
        );
        setCategoryList(tempCategoryList);
      }
    }
  }, [categoriesData, categoriesLoading]);

  useEffect(() => {
    if (!brandsLoading) {
      const tempBrandList = ["All Brands"];
      if (brandsData) {
        brandsData.result.map((brand: Brand) => tempBrandList.push(brand.name));
        setBrandsList(tempBrandList);
      }
    }
  }, [brandsData, brandsLoading]);

  useEffect(() => {
    if (!specialTagsLoading) {
      const tempTagsList = ["All Special Tags"];
      if (specialTagsData) {
        specialTagsData.result.map((specialTag: SpecialTag) => {
          if (specialTag.name !== "") tempTagsList.push(specialTag.name);
        });
        setSpecialTagsList(tempTagsList);
      }
    }
  }, [specialTagsData, specialTagsLoading]);

  useEffect(() => {
    if (data) {
      setProducts(data?.apiResponse.result);
      const { TotalRecords } = JSON.parse(data.totalRecords);
      setTotalRecords(TotalRecords);
    }
  }, [data, isLoading]);

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
  };

  const handleBrandClick = (name: string) => {
    setSelectedBrand(name);
  };

  const handleSpecialTagsClick = (name: string) => {
    setSelectedSpecialTag(name);
  };

  const handleSortNameClick = (type: SortingTypes) => {
    setSortType(type);
  };

  const handleOutOfStockClick = (val: string) => {
    setOutOfStock(val);
  };

  const handleOnlyWithDiscountClick = (val: string) => {
    setOnlyWithDiscount(val);
  };

  const handleFilters = () => {
    setApiFilters({
      brand: selectedBrand,
      category: selectedCategory,
      specialTag: selectedSpecialTag,
      searchString: searchValue,
      sortingOptions: sortType,
      outOfStock: outOfStockValue,
      onlyWithDiscount: onlyWithDiscountValue,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handlePageOptionChange = (direction: string, pageSize?: number) => {
    if (direction === "prev") {
      setPageOptions({ pageSize: 6, pageNumber: pageOptions.pageNumber - 1 });
    } else if (direction === "next") {
      setPageOptions({ pageSize: 6, pageNumber: pageOptions.pageNumber + 1 });
    } else if (direction === "change") {
      setPageOptions({ pageSize: pageSize ? pageSize : 6, pageNumber: 1 });
    }
  };

  const handleProductDelete = async (id: number) => {
    const deleteConfirm = window.confirm(
      `Are you sure you want to delete product ${id}?`
    );

    if (deleteConfirm === true) {
      deleteProduct(id);
      toast.promise(
        deleteProduct(id),
        {
          pending: "Processing your request...",
          success: "Deleted Successfully",
          error: "Error",
        },
        {
          theme: "light",
        }
      );
    } else {
      toastNotify("Deletion cancelled", "default");
    }
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="table p-5">
            <h1 className="text-primary">List of Products</h1>
            <div className="d-flex align-items-center justify-content-between">
              <div className="mx-auto">
                <ul className="nav w-100 justify-content-center">
                  <li className="nav-item dropdown">
                    <FiltersButton
                      buttonText={selectedCategory}
                    ></FiltersButton>
                    <ul className="dropdown-menu">
                      {categoryList.map((categoryName, index) => (
                        <li
                          className="dropdown-item"
                          key={index}
                          onClick={() => handleCategoryClick(categoryName)}
                        >
                          {categoryName}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <FiltersButton buttonText={selectedBrand}></FiltersButton>
                    <ul className="dropdown-menu">
                      {brandsList.map((brandName, index) => (
                        <li
                          className="dropdown-item"
                          key={index}
                          onClick={() => handleBrandClick(brandName)}
                        >
                          {brandName}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <FiltersButton
                      buttonText={selectedSpecialTag}
                    ></FiltersButton>
                    <ul className="dropdown-menu">
                      {specialTagsList.map((tagName, index) => (
                        <li
                          className="dropdown-item"
                          key={index}
                          onClick={() => handleSpecialTagsClick(tagName)}
                        >
                          {tagName}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <FiltersButton buttonText={sortType}></FiltersButton>
                    <ul className="dropdown-menu">
                      {sortOptions.map((sortType, index) => (
                        <li
                          key={index}
                          className="dropdown-item"
                          onClick={() => handleSortNameClick(sortType)}
                        >
                          {sortType}
                        </li>
                      ))}
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <FiltersButton
                      buttonText={`Include Out of Stock: ${
                        outOfStockValue === "true" ? "Yes" : "No"
                      }`}
                    ></FiltersButton>
                    <ul className="dropdown-menu">
                      <li
                        className="dropdown-item"
                        onClick={() => handleOutOfStockClick("true")}
                      >
                        Include
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleOutOfStockClick("false")}
                      >
                        Not Include
                      </li>
                    </ul>
                  </li>
                  <li className="nav-item dropdown">
                    <FiltersButton
                      buttonText={`Show Only with Discount: ${
                        onlyWithDiscountValue === "true" ? "Yes" : "No"
                      }`}
                    ></FiltersButton>
                    <ul className="dropdown-menu">
                      <li
                        className="dropdown-item"
                        onClick={() => handleOnlyWithDiscountClick("true")}
                      >
                        Yes
                      </li>
                      <li
                        className="dropdown-item"
                        onClick={() => handleOnlyWithDiscountClick("false")}
                      >
                        No
                      </li>
                    </ul>
                  </li>
                </ul>
                <div className="input-group mb-5">
                  <input
                    type={"text"}
                    className="input-group-text ms-auto rounded-start-pill"
                    style={{
                      padding: "0.7rem 0.7rem",
                      width: "25rem",
                    }}
                    value={searchValue}
                    onChange={handleChange}
                    placeholder="Search for Details!"
                  />
                  <button
                    className="btn btn-light me-auto rounded-end-pill"
                    type="button"
                    onClick={handleFilters}
                  >
                    <i className="bi bi-search"></i>
                  </button>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => navigate("/product/productUpsert")}
              >
                Add New
              </button>
            </div>
            <div className="p-2">
              <div className="row border">
                <div style={{ width: "3rem" }}>Id</div>
                <div className="col-1">Image</div>
                <div className="col-2">Name</div>
                <div className="col-1">Category</div>
                <div className="col-2">Brand</div>
                <div className="col-1">Price</div>
                <div className="col-2">Special Tag</div>
                <div className="col-1">In Stock</div>
                <div className="col-1">Actions</div>
              </div>

              {products.map((product: Product) => {
                return (
                  <div className="row border" key={product.id}>
                    <div style={{ width: "3rem" }}>{product.id}</div>
                    <div className="col-1">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        style={{
                          width: "100%",
                          maxWidth: "120px",
                          borderRadius: "20px",
                        }}
                      />
                    </div>
                    <div className="col-2">{product.name}</div>
                    <div className="col-1">{product.category.name}</div>
                    <div className="col-2">{product.brand.name}</div>
                    <div className="col-1">
                      {product.finalPrice < product.price ? (
                        <span className="text-danger">
                          ${product.finalPrice.toFixed(2)}
                        </span>
                      ) : (
                        <span>${product.finalPrice.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="col-2">{product.specialTag.name}</div>
                    <div className="col-1">
                      {product.inStock ? "Yes" : "No"}
                    </div>
                    <div className="col-1">
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          navigate("/product/productUpsert/" + product.id)
                        }
                      >
                        <i className="bi bi-pencil-fill" />
                      </button>
                      <button
                        className="btn btn-danger mx-2"
                        onClick={() => handleProductDelete(product.id)}
                      >
                        <i className="bi bi-trash-fill" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="mt-3">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                <li className="page-item">
                  <a
                    className={`page-link ${
                      pageOptions.pageNumber === 1 ? "disabled" : ""
                    }`}
                    onClick={() => handlePageOptionChange("prev")}
                    href="#"
                  >
                    <i className="bi bi-chevron-left"></i>
                  </a>
                </li>
                <li className="page-item">
                  <a
                    className={`page-link ${
                      pageOptions.pageNumber * pageOptions.pageSize >=
                      totalRecords
                        ? "disabled"
                        : ""
                    }`}
                    onClick={() => handlePageOptionChange("next")}
                    href="#"
                  >
                    <i className="bi bi-chevron-right"></i>
                  </a>
                </li>
              </ul>
              <div className="mx-auto text-center">
                {getPageDetails(
                  pageOptions.pageNumber,
                  pageOptions.pageSize,
                  totalRecords
                )}
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  );
}

export default ProductList;
