import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { CartItem, User } from "../../../Interfaces";
import { RootState } from "../../../Storage/store";
import {
  removeFromCart,
  updateQuantity,
} from "../../../Storage/shoppingCartSlice";
import { useUpsertShoppingCartMutation } from "../../../APIs/shoppingCartApi";

function CartSummary() {
  const dispatch = useDispatch();
  const [updateShoppingCart] = useUpsertShoppingCartMutation();
  const userData: User = useSelector((state: RootState) => state.userAuthStore);
  const shoppingCartFromStore: CartItem[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );
  if (!shoppingCartFromStore) {
    return <div>Shopping Cart is empty</div>;
  }

  const handleQuantity = (updateQuantityBy: number, cartItem: CartItem) => {
    if (
      (updateQuantityBy == -1 && cartItem.quantity == 1) ||
      updateQuantityBy == 0
    ) {
      updateShoppingCart({
        productId: cartItem.product?.id,
        updateQuantityBy: 0,
        userId: userData.id,
      });
      dispatch(removeFromCart({ cartItem, quantity: 0 }));
    } else {
      updateShoppingCart({
        productId: cartItem.product?.id,
        updateQuantityBy: updateQuantityBy,
        userId: userData.id,
      });
      dispatch(
        updateQuantity({
          cartItem,
          quantity: cartItem.quantity! + updateQuantityBy,
        })
      );
    }
  };

  return (
    <div className="container p-4 m-2">
      <h4 className="text-center tet-success">Cart Summary</h4>
      {shoppingCartFromStore.map((cartItem: CartItem, index: number) => (
        <div
          key={index}
          className="d-flex flex-sm-row flex-column align-items-center custom-card-shadow rounded m-3"
          style={{ background: "ghostWhite" }}
        >
          <div className="p-3">
            <img
              src={cartItem.product?.imageUrl}
              alt=""
              width={"120 px"}
              style={{ borderRadius: "25px" }}
            />
          </div>

          <div className="p-2 mx-3" style={{ width: "100%" }}>
            <div className="d-flex justify-content-between align-items-center">
              <h4 style={{ fontWeight: 300 }}>{cartItem.product?.name}</h4>
              <h4>
                ${(cartItem.quantity! * cartItem.product!.price).toFixed(2)}
              </h4>
            </div>

            <div className="flex-fill">
              <h4 className="text-primary">${cartItem.product!.price}</h4>
            </div>

            <div
              className="d-flex justify-content-between p-2 mt-2 rounded-pill custom-card-shadow"
              style={{ width: "100px", height: "43px" }}
            >
              <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                <i
                  className="bi bi-dash-circle-fill"
                  onClick={() => handleQuantity(-1, cartItem)}
                ></i>
              </span>

              <span>
                <b>{cartItem.quantity}</b>
              </span>

              <span style={{ color: "rgba(22,22,22,.7)" }} role="button">
                <i
                  className="bi bi-plus-circle-fill"
                  onClick={() => handleQuantity(1, cartItem)}
                ></i>
              </span>
            </div>

            <button
              className="btn btn-danger mx-1"
              onClick={() => handleQuantity(0, cartItem)}
            >
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartSummary;
