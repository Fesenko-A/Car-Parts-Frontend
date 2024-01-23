import React from "react";
import { useParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../APIs/productApi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { MainLoader, MiniLoader } from "../Components/Page/Common";
import { ApiResponse, User } from "../Interfaces";
import { toastNotify } from "../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../Storage/store";

function ProductDetails() {
  const { productId } = useParams();
  const { data, isLoading } = useGetProductByIdQuery(productId);
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const userData: User = useSelector((state: RootState) => state.userAuthStore);

  const handleQuantity = (counter: number) => {
    let newQuantity = quantity + counter;
    if (newQuantity <= 0) {
      newQuantity = 1;
    }
    setQuantity(newQuantity);
    return;
  };

  // const handleAddToCart = async (menuItemId: number) => {
  //   if (!userData.id) {
  //     navigate("/login");
  //     return;
  //   }

  //   setIsAddingToCart(true);

  //   const response: ApiResponse = await updateShoppingCart({
  //     menuItemId: menuItemId,
  //     updateQuantityBy: quantity,
  //     userId: userData.id,
  //   });

  //   if (response.data && response.data.isSuccess) {
  //     toastNotify("Item added to cart successfully!");
  //   }

  //   setIsAddingToCart(false);
  // };

  return (
    <div className="container pt-4 pt-md-5">
      {!isLoading ? (
        <div className="row">
          <div className="col-7">
            <h2 className="text-primary">
              <span>
                <span
                  className="badge text-bg-light pt-2"
                  style={{ height: "40px", fontSize: "20px" }}
                >
                  {data.result?.brand.name}
                </span>
              </span>
              <br />
              {data.result?.name}
            </h2>
            <span>
              <span
                className="badge text-bg-dark pt-2"
                style={{ height: "40px", fontSize: "20px" }}
              >
                {data.result?.category.name}
              </span>
            </span>
            <span>
              <span
                className="badge text-bg-light pt-2"
                style={{ height: "40px", fontSize: "20px" }}
              >
                {data.result?.specialTag.name}
              </span>
            </span>
            <p style={{ fontSize: "20px" }} className="pt-2">
              {data.result?.description}
            </p>
            <span className="h3">${data.result?.price}</span> &nbsp;&nbsp;&nbsp;
            <span
              className="pb-2 p-3"
              style={{ border: "1px solid #333", borderRadius: "30px" }}
            >
              <i
                onClick={() => {
                  handleQuantity(-1);
                }}
                className="bi bi-dash p-1"
                style={{ fontSize: "20px", cursor: "pointer" }}
              ></i>
              <span className="h3 mt-3 px-3">{quantity}</span>
              <i
                onClick={() => {
                  handleQuantity(1);
                }}
                className="bi bi-plus p-1"
                style={{ fontSize: "25px", cursor: "pointer" }}
              ></i>
            </span>
            <div className="row pt-4">
              <div className="col-5">
                {/* {isAddingToCart ? (
                  <button disabled className="btn btn-success form-control">
                    <MiniLoader size={30} />
                  </button>
                ) : (
                  <button
                    className="btn btn-success form-control"
                    onClick={() => handleAddToCart(data.result?.id)}
                  >
                    Add to Cart
                  </button>
                )} */}
              </div>

              <div className="col-5">
                <button
                  className="btn btn-secondary form-control"
                  onClick={() => navigate(-1)}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
          <div className="col-5">
            <img
              src={data.result?.imageUrl}
              width="100%"
              alt="No content"
            ></img>
          </div>
        </div>
      ) : (
        <div
          className="d-flex justify-content-center"
          style={{ width: "100%" }}
        >
          <MainLoader />
        </div>
      )}
    </div>
  );
}

export default ProductDetails;
