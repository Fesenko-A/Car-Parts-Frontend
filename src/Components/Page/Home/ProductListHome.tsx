import React, { useEffect, useState } from "react";
import { Product } from "../../../Interfaces";
import { ProductCard } from "./";
import { useGetAllProductsQuery } from "../../../APIs/productApi";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/store";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../../Storage/productSlice";
import { SortingTypes } from "../../../Static";
import { useGetAllCategoriesQuery } from "../../../APIs/categoriesApi";
import { useGetAllBrandsQuery } from "../../../APIs/brandApi";

function ProductListHome() {
  const [products, setProducts] = useState<Product[]>([]);

  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedBrand, setSelectedBrand] = useState("All Brands");

  const { data, isLoading } = useGetAllProductsQuery(null);
  const { data: categoriesData, isLoading: categoriesLoading } =
    useGetAllCategoriesQuery(null);
  const { data: brandsData, isLoading: brandsLoading } =
    useGetAllBrandsQuery(null);

  const [categoryList, setCategoryList] = useState([""]);
  const [brandList, setBrandList] = useState([""]);

  const dispatch = useDispatch();
  const [sortName, setSortName] = useState(SortingTypes.NAME_A_Z);

  const sortOptions: Array<SortingTypes> = [
    SortingTypes.PRICE_LOW_HIGH,
    SortingTypes.PRICE_HIGH_LOW,
    SortingTypes.NAME_A_Z,
    SortingTypes.NAME_Z_A,
  ];

  const searchValue = useSelector(
    (state: RootState) => state.productStore.search
  );

  useEffect(() => {
    if (data && data.result) {
      const tempMenuArray = handleFilters(
        sortName,
        selectedCategory,
        searchValue
      );
      setProducts(tempMenuArray);
    }
  }, [searchValue]);

  useEffect(() => {
    if (!isLoading) {
      dispatch(setProduct(data.result));
      setProducts(data.result);

      const tempCategoryList = ["All Categories"];
      categoriesData.result.map((category: any) =>
        tempCategoryList.push(category.name)
      );
      setCategoryList(tempCategoryList);

      const tempBrandList = ["All Brands"];
      brandsData.result.map((brand: any) => tempBrandList.push(brand.name));
      setBrandList(tempBrandList);
    }
  }, [isLoading, categoriesLoading, brandsLoading]);

  const handleCategoryClick = (name: string) => {
    setSelectedCategory(name);
    const tempArray = handleFilters(sortName, name, searchValue);
    setProducts(tempArray);
  };

  const handleBrandClick = (name: string) => {
    setSelectedBrand(name);
    const tempArray = handleFilters(sortName, selectedCategory, searchValue);
    setProducts(tempArray);
  };

  const handleSortClick = (i: number) => {
    setSortName(sortOptions[i]);
    const tempArray = handleFilters(
      sortOptions[i],
      selectedCategory,
      searchValue
    );
    setProducts(tempArray);
  };

  const handleFilters = (
    sortType: SortingTypes,
    category: string,
    search: string
  ) => {
    let tempArray =
      category === "All Categories"
        ? [...data.result]
        : data.result.filter(
            (item: Product) =>
              item.category.name.toUpperCase() === category.toUpperCase()
          );

    // Search functionality
    if (search) {
      const tempArray2 = [...tempArray];
      tempArray = tempArray2.filter((item: Product) =>
        item.name.toUpperCase().includes(search.toUpperCase())
      );
    }

    // Sort functionality
    if (sortType === SortingTypes.PRICE_LOW_HIGH) {
      tempArray.sort((a: Product, b: Product) => a.price - b.price);
    }

    if (sortType === SortingTypes.PRICE_HIGH_LOW) {
      tempArray.sort((a: Product, b: Product) => b.price - a.price);
    }

    if (sortType === SortingTypes.NAME_A_Z) {
      tempArray.sort(
        (a: Product, b: Product) =>
          a.name.toUpperCase().charCodeAt(0) -
          b.name.toUpperCase().charCodeAt(0)
      );
    }

    if (sortType === SortingTypes.NAME_Z_A) {
      tempArray.sort(
        (a: Product, b: Product) =>
          b.name.toUpperCase().charCodeAt(0) -
          a.name.toUpperCase().charCodeAt(0)
      );
    }

    return tempArray;
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
              className="d-flex nav-link text-dark fs-6 border rounded"
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
          <li className="nav-item dropdown ms-2">
            <div
              className="d-flex nav-link text-dark fs-6 border rounded"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "21vh" }}
            >
              <span>{selectedBrand}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {brandList.map((brandName, index) => (
                <li
                  className="dropdown-item"
                  key={index}
                  // onClick={() => handleBrandClick(brandName)}
                  style={{ width: "21vh" }}
                >
                  {brandName}
                </li>
              ))}
            </ul>
          </li>
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="d-flex nav-link text-dark fs-6 border rounded"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ width: "16vh" }}
            >
              <span>{sortName}</span>
              <i className="bi bi-caret-down ms-auto" />
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSortClick(index)}
                  style={{ width: "16vh" }}
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
