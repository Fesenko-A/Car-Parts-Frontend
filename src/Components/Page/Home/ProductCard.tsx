import React from "react";
import { ApiResponse, Product, User } from "../../../Interfaces";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useUpsertShoppingCartMutation } from "../../../APIs/shoppingCart";
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

  const handleAddToCart = async (menuItemId: number) => {
    if (!userData.id) {
      navigate("/login");
      return;
    }
    setIsAddingToCart(true);

    const response: ApiResponse = await updateShoppingCart({
      menuItemId: menuItemId,
      updateQuantityBy: 1,
      userId: userData.id,
    });

    if (response.data && response.data.isSuccess) {
      toastNotify("Item added to cart successfully!");
    }

    setIsAddingToCart(false);
  };

  return (
    <div className="col-md-4 col-12 p-4">
      <div
        className="card"
        style={{ boxShadow: "0 1px 7px 0 rgb(0 0 0 / 50%)" }}
      >
        <div className="card-body pt-2">
          <div className="row col-10 offset-1 p-4">
            <Link to={`productDetails/${props.product.id}`}>
              <img
                src={props.product.imageUrl}
                alt={props.product.name}
                className="w-100 mt-5 image-box"
              />
            </Link>
          </div>
          {props.product.specialTag.name.length > 1 &&
            props.product.specialTag && (
              <i
                className="bi bi-heart btn btn-success"
                style={{
                  position: "absolute",
                  top: "15px",
                  left: "15px",
                  padding: "5px 10px",
                  borderRadius: "3px",
                  outline: "none !important",
                  cursor: "pointer",
                  fontStyle: "normal",
                }}
              >
                &nbsp; {props.product.specialTag.name}
              </i>
            )}

          {isAddingToCart ? (
            <div
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              <MiniLoader />
            </div>
          ) : (
            <i
              onClick={() => handleAddToCart(props.product.id)}
              className="bi bi-cart-plus btn btn-outline-danger"
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                padding: "5px 10px",
                borderRadius: "3px",
                outline: "none !important",
                cursor: "pointer",
              }}
            ></i>
          )}

          <div className="text-center">
            <Link
              to={`productDetails/${props.product.id}`}
              className="card-title m-0 text-primary fs-3"
              style={{ textDecoration: "none", color: "green" }}
            >
              {props.product.name}
            </Link>
            <p style={{ fontSize: "14px" }}>{props.product.category.name}</p>
          </div>
          <p className="card-text" style={{ textAlign: "center" }}>
            {props.product.description}
          </p>
          <div className="row text-center">
            <h4>${props.product.price}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
