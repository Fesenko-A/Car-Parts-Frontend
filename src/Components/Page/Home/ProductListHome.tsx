import React, { useEffect, useState } from "react";
import { Product } from "../../../Interfaces";
import ProductCard from "./ProductCard";
import { useGetAllProductsQuery } from "../../../APIs/productApi";
import { MainLoader } from "../Common";
import { RootState } from "../../../Storage/store";
import { useDispatch } from "react-redux";
import { setProduct } from "../../../Storage/productSlice";

function ProductListHome() {
  const [products, setProducts] = useState<Product[]>([]);
  const { data, isLoading } = useGetAllProductsQuery(null);
  const [categoryList, setCategoryList] = useState([""]);
  const dispatch = useDispatch();

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

  if (isLoading) {
    return <MainLoader />;
  }

  return (
    <div className="row container">
      {products.length > 0 &&
        products.map((product: Product, index: number) => (
          <ProductCard product={product} key={index} />
        ))}
    </div>
  );
}

export default ProductListHome;
