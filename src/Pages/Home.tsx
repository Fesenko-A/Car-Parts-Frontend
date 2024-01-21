import React from "react";
import ProductList from "./Product/ProductList";

function Home() {
  return (
    <div>
      <div className="container p-2">
        <ProductList />
      </div>
    </div>
  );
}

export default Home;
