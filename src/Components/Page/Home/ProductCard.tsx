import React from "react";
import { ApiResponse, Product, User } from "../../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUpsertShoppingCartMutation } from "../../../APIs/shoppingCartApi";
import { MiniLoader } from "../Common";
import { toastNotify } from "../../../Helper";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/store";

interface Props {
  product: Product;
}

function ProductCard(props: Props) {
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false);
  const [updateShoppingCart] = useUpsertShoppingCartMutation();
  const userData: User = useSelector((state: RootState) => state.userAuthStore);

  const handleAddToCart = async (productId: number) => {
    if (!userData.id) {
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response: ApiResponse = await updateShoppingCart({
      productId: productId,
      updateQuantityBy: 1,
      userId: userData.id,
    });

    if (response.data && response.data.isSuccess) {
      toastNotify("Item added to cart successfully!");
    } else {
      toastNotify(
        "Error while adding this product to the shopping cart",
        "error"
      );
    }

    setIsAddingToCart(false);
  };

  return (
    <>
      <div
        className="card container m-2 row col-8 col-sm-7 col-md-5 col-lg-4 col-xl-3 col-xxl-3"
        style={{
          height: "29.5rem",
          borderColor: "#e6e6e6",
        }}
      >
        <div className="card-body row mx-auto">
          <div className="text-center pt-3" style={{ height: "16rem" }}>
            <Link to={`productDetails/${props.product.id}`}>
              <img
                src={props.product.imageUrl}
                alt={props.product.name}
                className="image-box"
                style={{ width: "87%" }}
              />
            </Link>
            <h5 className="card-title my-card-title-text pt-2">
              {props.product.name}
            </h5>
          </div>
          {props.product.specialTag.name.length > 1 &&
            props.product.specialTag && (
              <i
                className="btn btn-primary active"
                style={{
                  position: "absolute",
                  width: "34%",
                  borderRadius: "30px",
                  padding: "4px",
                  fontStyle: "normal",
                }}
              >
                {props.product.specialTag.name}
              </i>
            )}
          <p
            className="card-text my-card-text"
            style={{
              height: "10rem",
              marginBottom: "0.5rem",
              marginTop: "1rem",
            }}
          >
            {props.product.description}
          </p>
          <h4 className="card-text mb-0 text-center">${props.product.price}</h4>
          {isAddingToCart ? (
            <a className="btn btn-primary mt-auto" style={{ height: "2.4rem" }}>
              <MiniLoader type="light" size={70} />
            </a>
          ) : (
            <>
              {props.product.inStock ? (
                <a
                  onClick={() => handleAddToCart(props.product.id)}
                  className="btn btn-primary mt-auto"
                  style={{ height: "2.4rem" }}
                >
                  Add to Cart
                </a>
              ) : (
                <a
                  onClick={() =>
                    toastNotify("This product is out of stock", "default")
                  }
                  className="btn btn-outline-primary mt-auto"
                  style={{ height: "2.4rem" }}
                >
                  Out of Stock
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductCard;
