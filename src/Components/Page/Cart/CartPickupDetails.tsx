import React, { useEffect, useState } from "react";
import { ApiResponse, CartItem, Order, User } from "../../../Interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/store";
import { inputHelper } from "../../../Helper";
import { MiniLoader } from "../Common";
import { useNavigate } from "react-router-dom";
import { OrderStatuses, PaymentMethods } from "../../../Static";
import { useCreateOrderMutation } from "../../../APIs/orderApi";

function CartPickupDetails() {
  const navigate = useNavigate();
  const [createOrder] = useCreateOrderMutation();
  const [loading, setLoading] = useState(false);
  const userData: User = useSelector((state: RootState) => state.userAuthStore);
  const shoppingCartFromStore: CartItem[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );
  const initialData = {
    name: userData.fullName,
    email: userData.email,
    phoneNumber: "",
    paymentMethodId: 1,
  };
  const [userInput, setUserInput] = useState(initialData);

  let total = 0;
  let totalItems = 0;

  const handleUserInput = (e: any) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const orderDetailsDTO: any = [];
  shoppingCartFromStore.forEach((item: CartItem) => {
    const tempOrderDetail: any = {};
    tempOrderDetail["productId"] = item.product?.id;
    tempOrderDetail["quantity"] = item.quantity;
    tempOrderDetail["productName"] = item.product?.name;
    tempOrderDetail["price"] = item.product?.price;
    orderDetailsDTO.push(tempOrderDetail);
    total += item.quantity! * item.product?.price!;
    totalItems += item.quantity!;
  });

  const data: Order = {
    pickupName: userInput.name,
    pickupPhoneNumber: userInput.phoneNumber,
    pickupEmail: userInput.email,
    userId: userData.id,
    orderTotal: total,
    status: OrderStatuses.CONFIRMED,
    totalItems: totalItems,
    orderDetails: orderDetailsDTO,
    paymentMethodId: Number(userInput.paymentMethodId),
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (data.paymentMethodId === 1) {
      const response: ApiResponse = await createOrder(data);

      if (response) {
        navigate(`/order/orderConfirmed/${response.data!.result.orderId}`);
      } else {
        navigate("/failed");
      }
    } else {
      navigate("/payment", {
        state: { apiResult: data, userInput: userInput },
      });
    }
  };

  useEffect(() => {
    setUserInput({
      name: userData.fullName,
      email: userData.email,
      phoneNumber: "",
      paymentMethodId: userInput.paymentMethodId,
    });
  }, [userData]);

  return (
    <div className="border pb-5 pt-3 rounded">
      <h1 className="text-center text-primary">Pickup Details</h1>
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
          Payment Method
          <select
            className="form-control"
            name="paymentMethodId"
            value={userInput.paymentMethodId}
            onChange={handleUserInput}
          >
            <option value={1}>{PaymentMethods.CASH}</option>
            <option value={2}>{PaymentMethods.ONLINE}</option>
          </select>
        </div>

        <div className="form-group mt-3">
          <div className="card p-3" style={{ background: "ghostwhite" }}>
            <h5>Total: ${total}</h5>
            <h5>Number of Items: {totalItems}</h5>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-lg btn-primary form-control mt-3"
          disabled={loading}
        >
          {loading ? <MiniLoader /> : "Proceed to Payment"}
        </button>
      </form>
    </div>
  );
}

export default CartPickupDetails;
