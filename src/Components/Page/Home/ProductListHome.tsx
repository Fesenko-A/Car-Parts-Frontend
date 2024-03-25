import React, { useEffect, useState } from "react";
import { Brand, Category, Product, SpecialTag } from "../../../Interfaces";
import { ProductCard } from "./";
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
    pageSize: 5,
  });
  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");
  const [selectedSpecialTag, setSelectedSpecialTag] =
    useState("All Special Tags");

  const [apiFilters, setApiFilters] = useState({
    brand: selectedBrand,
    category: selectedCategory,
    specialTag: selectedSpecialTag,
    searchString: "",
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

  const [sortName, setSortName] = useState(SortingTypes.NAME_A_Z);

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

  // const handleSort = (sortType: SortingTypes) => {
  //   if (sortType === SortingTypes.PRICE_LOW_HIGH) {
  //     products.sort((a: Product, b: Product) => a.price - b.price);
  //   }

  //   if (sortType === SortingTypes.PRICE_HIGH_LOW) {
  //     products.sort((a: Product, b: Product) => b.price - a.price);
  //   }

  //   if (sortType === SortingTypes.NAME_A_Z) {
  //     products.sort(
  //       (a: Product, b: Product) =>
  //         a.name.toUpperCase().charCodeAt(0) -
  //         b.name.toUpperCase().charCodeAt(0)
  //     );
  //   }

  //   if (sortType === SortingTypes.NAME_Z_A) {
  //     products.sort(
  //       (a: Product, b: Product) =>
  //         b.name.toUpperCase().charCodeAt(0) -
  //         a.name.toUpperCase().charCodeAt(0)
  //     );
  //   }
  // };

  const handleFilters = () => {
    setApiFilters({
      brand: selectedBrand,
      category: selectedCategory,
      specialTag: selectedSpecialTag,
      searchString: "",
    });
  };

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div className="row container">
      <div className="my-3">
        <ul className="nav w-100 d-flex justify-content-center">
          <li className="nav-item dropdown">
            <div
              className="d-flex nav-link text-dark fs-6 border rounded me-1"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "21vh" }}
            >
              <span>{selectedCategory}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {categoryList.map((categoryName, index) => (
                <li
                  className="dropdown-item"
                  key={index}
                  onClick={() => handleCategoryClick(categoryName)}
                  style={{ width: "21vh" }}
                >
                  {categoryName}
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item dropdown">
            <div
              className="d-flex nav-link text-dark fs-6 border rounded me-1"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "17vh" }}
            >
              <span>{selectedBrand}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {brandsList.map((brandName, index) => (
                <li
                  className="dropdown-item"
                  key={index}
                  onClick={() => handleBrandClick(brandName)}
                  style={{ width: "17vh" }}
                >
                  {brandName}
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item dropdown">
            <div
              className="d-flex nav-link text-dark fs-6 border rounded me-1"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "17vh" }}
            >
              <span>{selectedSpecialTag}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {specialTagsList.map((tagName, index) => (
                <li
                  className="dropdown-item"
                  key={index}
                  onClick={() => handleSpecialTagsClick(tagName)}
                  style={{ width: "17vh" }}
                >
                  {tagName}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <button className="btn btn-outline-primary" onClick={handleFilters}>
              Filter
            </button>
          </li>
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="d-flex nav-link text-dark fs-6 border rounded"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "20vh" }}
            >
              <span>{sortName}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  // onClick={() => handleSort(sortType)}
                  style={{ width: "20vh" }}
                >
                  {sortType}
                </li>
              ))}
            </ul>
          </li>
        </ul>
      </div>
      {products.length > 0 &&
        products.map((product: Product, index: number) => (
          <ProductCard product={product} key={index} />
        ))}
    </div>
  );
}

export default ProductListHome;
