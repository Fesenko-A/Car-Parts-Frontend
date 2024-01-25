import React, { useEffect, useState } from "react";
import { ApiResponse, CartItem, User } from "../../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/store";
import { inputHelper } from "../../../Helper";
import { MiniLoader } from "../Common";
import { useInitiatePaymentMutation } from "../../../APIs/paymentApi";
import { useNavigate } from "react-router-dom";

function CartPickupDetails() {
  const [loading, setLoading] = useState(false);
  const shoppingCartFromStore: CartItem[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const userData: User = useSelector((state: RootState) => state.userAuthStore);

  let total = 0;
  let totalItems = 0;

  const initialUserData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
  };

  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
    });
  }, [userData]);

  const navigate = useNavigate();
  const [initiatePayment] = useInitiatePaymentMutation();

  const [userInput, setUserInput] = useState(initialUserData);
  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  shoppingCartFromStore?.map((cartItem: CartItem) => {
    totalItems += cartItem.quantity ?? 0;
    total += (cartItem.product?.price ?? 0) * (cartItem.quantity ?? 0);
    return null;
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const { data }: ApiResponse = await initiatePayment(userData.id);
    navigate("/payment", {
      state: { apiResult: data?.result, userInput },
    });
  };

  return (
    <div className="border pb-5 pt-3">
      <h1 style={{ fontWeight: "300" }} className="text-center text-success">
        Pickup Details
      </h1>
      <hr />
      <form onSubmit={handleSubmit} className="col-10 mx-auto">
        <div className="form-group mt-3">
          Pickup Name
          <input
            type="text"
            value={userInput.name}
            className="form-control"
            placeholder="Name"
            name="name"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          Pickup Email
          <input
            type="email"
            value={userInput.email}
            className="form-control"
            placeholder="Email"
            name="email"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          Pickup Phone Number
          <input
            type="number"
            value={userInput.phoneNumber}
            className="form-control"
            placeholder="Phone Number"
            name="phoneNumber"
            onChange={handleUserInput}
            required
          />
        </div>

        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Total: ${total}</h5>
            <h5>Number of Items: {totalItems}</h5>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-lg btn-success form-control mt-3"
          disabled={loading}
        >
          {loading ? <MiniLoader /> : "Looks Good? Place Order!"}
        </button>
      </form>
    </div>
  );
}

export default CartPickupDetails;
