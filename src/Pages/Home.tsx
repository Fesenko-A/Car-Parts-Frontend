import React from "react";
import { ProductListHome } from "../Components/Page/Home";
import { Banner } from "../Components/Page/Common";

function Home() {
  return (
    <div>
      <Banner />
      <div className="container p-2">
        <ProductListHome />
      </div>
    </div>
  );
}

export default Home;
