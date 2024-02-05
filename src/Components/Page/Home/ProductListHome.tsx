import React, { useEffect, useState } from "react";
import { Product } from "../../../Interfaces";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "../../../APIs/productApi";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/store";
import { useDispatch, useSelector } from "react-redux";
import { setProduct } from "../../../Storage/productSlice";
import { SortingTypes } from "../../../Static";

function ProductListHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data, isLoading } = useGetAllProductsQuery(null);
  const [categoryList, setCategoryList] = useState([""]);
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
      const tempCategoryList = ["All"];
      data.result.forEach((item: Product) => {
        if (tempCategoryList.indexOf(item.category.name) === -1) {
          tempCategoryList.push(item.category.name);
        }
      });

      setCategoryList(tempCategoryList);
    }
  }, [isLoading]);

  const handleCategoryClick = (i: number) => {
    const buttons = document.querySelectorAll(".custom-buttons");
    let localCategory;

    buttons.forEach((button, index) => {
      if (index === i) {
        button.classList.add("active");
        if (index === 0) {
          localCategory = "All";
        } else {
          localCategory = categoryList[index];
        }

        setSelectedCategory(localCategory);
        const tempArray = handleFilters(sortName, localCategory, searchValue);
        setProducts(tempArray);
      } else {
        button.classList.remove("active");
      }
    });
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
      category === "All"
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
          {categoryList.map((categoryName, index) => (
            <li className="nav-item" key={index}>
              <button
                className={`nav-link p-0 pb-2 custom-buttons fs-5 ${
                  index === 0 && "active"
                }`}
                onClick={() => handleCategoryClick(index)}
              >
                {categoryName}
              </button>
            </li>
          ))}
          <li className="nav-item dropdown" style={{ marginLeft: "auto" }}>
            <div
              className="nav-link dropdown-toggle text-dark fs-6 border rounded"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {sortName}
            </div>
            <ul className="dropdown-menu">
              {sortOptions.map((sortType, index) => (
                <li
                  key={index}
                  className="dropdown-item rounded"
                  onClick={() => handleSortClick(index)}
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
