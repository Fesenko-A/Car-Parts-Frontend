import React, { useEffect, useState } from "react";
import { Brand, Category, Product, SpecialTag } from "../../../Interfaces";
import { FiltersButton, ProductCard } from "./";
import { useGetAllProductsQuery } from "../../../APIs/productApi";
import { MainLoader } from "../Common";
import { SortingTypes } from "../../../Static";
import { useGetAllCategoriesQuery } from "../../../APIs/categoriesApi";
import { useGetAllBrandsQuery } from "../../../APIs/brandApi";
import { useGetAllSpecialTagsQuery } from "../../../APIs/specialTagsApi";

function ProductListHome() {
  const [products, setProducts] = useState<Product[]>([]);

  const sortOptions: Array<SortingTypes> = [
    SortingTypes.PRICE_LOW_HIGH,
    SortingTypes.PRICE_HIGH_LOW,
    SortingTypes.NAME_A_Z,
    SortingTypes.NAME_Z_A,
  ];

  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 6,
  });
  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedSpecialTag, setSelectedSpecialTag] =
    useState("All Special Tags");
  const [searchValue, setSearchValue] = useState("");
  const [sortType, setSortType] = useState(SortingTypes.NAME_A_Z);

  const [apiFilters, setApiFilters] = useState({
    brand: selectedBrand,
    category: selectedCategory,
    specialTag: selectedSpecialTag,
    searchString: searchValue,
  });

  const { data, isLoading } = useGetAllProductsQuery({
    brand: apiFilters.brand,
    category: apiFilters.category,
    specialTag: apiFilters.specialTag,
    searchString: apiFilters.searchString,
    pageNumber: pageOptions.pageNumber,
    pageSize: pageOptions.pageSize,
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

  const handleSortName = (type: SortingTypes) => {
    setSortType(type);
  };

  const handleSort = (sortType: SortingTypes) => {
    let arrayForSort = [...products];

    if (sortType === SortingTypes.PRICE_LOW_HIGH) {
      arrayForSort.sort((a: Product, b: Product) => a.price - b.price);
    }

    if (sortType === SortingTypes.PRICE_HIGH_LOW) {
      arrayForSort.sort((a: Product, b: Product) => b.price - a.price);
    }

    if (sortType === SortingTypes.NAME_A_Z) {
      arrayForSort.sort(
        (a: Product, b: Product) =>
          a.name.toUpperCase().charCodeAt(0) -
          b.name.toUpperCase().charCodeAt(0)
      );
    }

    if (sortType === SortingTypes.NAME_Z_A) {
      arrayForSort.sort(
        (a: Product, b: Product) =>
          b.name.toUpperCase().charCodeAt(0) -
          a.name.toUpperCase().charCodeAt(0)
      );
    }

    setProducts(arrayForSort);
  };

  const handleFilters = () => {
    setApiFilters({
      brand: selectedBrand,
      category: selectedCategory,
      specialTag: selectedSpecialTag,
      searchString: searchValue,
    });
    handleSort(sortType);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleShowFilters = () => {
    showFilters === false ? setShowFilters(true) : setShowFilters(false);
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
                      style={{ width: "fit-content" }}
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
                      style={{ width: "fit-content" }}
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
                      style={{ width: "fit-content" }}
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
                      onClick={() => handleSortName(sortType)}
                      style={{ width: "fit-content" }}
                    >
                      {sortType}
                    </li>
                  ))}
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
      </div>
    </div>
  );
}

export default ProductListHome;
