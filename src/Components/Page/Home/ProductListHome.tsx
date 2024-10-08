import React, { useEffect, useState } from "react";
import { Brand, Category, Product, SpecialTag } from "../../../Interfaces";
import { FiltersButton, ProductCard } from "./";
import { useGetAllProductsQuery } from "../../../APIs/productApi";
import { MainLoader } from "../Common";
import { SortingTypes } from "../../../Static";
import { useGetAllCategoriesQuery } from "../../../APIs/categoriesApi";
import { useGetAllBrandsQuery } from "../../../APIs/brandApi";
import { useGetAllSpecialTagsQuery } from "../../../APIs/specialTagsApi";
import { getPageDetails } from "../../../Helper";

function ProductListHome() {
  const [products, setProducts] = useState<Product[]>([]);

  const sortOptions: Array<SortingTypes> = [
    SortingTypes.PRICE_LOW_HIGH,
    SortingTypes.PRICE_HIGH_LOW,
  ];

  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 6,
  });
  const [showFilters, setShowFilters] = useState(false);
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

  const handleShowFilters = () => {
    showFilters === false ? setShowFilters(true) : setShowFilters(false);
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

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div>
      <div
        className="custom-banner row m-auto align-items-center"
        style={{ height: "30vh" }}
      >
        <div className="col-12 mt-4">
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
              className="btn btn-light"
              onClick={handleShowFilters}
              type="button"
            >
              <i className="bi bi-funnel"></i>
            </button>
            <button
              className="btn btn-light me-auto rounded-end-pill"
              type="button"
              onClick={handleFilters}
            >
              <i className="bi bi-search"></i>
            </button>
          </div>
        </div>
        <div className="position-absolute" style={{ marginTop: "8rem" }}>
          {showFilters === true && (
            <ul className="nav w-100 justify-content-center">
              <li className="nav-item dropdown">
                <FiltersButton buttonText={selectedCategory}></FiltersButton>
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
                <FiltersButton buttonText={selectedSpecialTag}></FiltersButton>
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
          )}
        </div>
      </div>
      <div className="container mt-4">
        <div className="row" style={{ justifyContent: "center" }}>
          {products.length > 0 &&
            products.map((product: Product, index: number) => (
              <ProductCard product={product} key={index} />
            ))}
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
      </div>
    </div>
  );
}

export default ProductListHome;
