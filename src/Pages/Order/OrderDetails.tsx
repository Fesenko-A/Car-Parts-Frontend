import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../APIs/orderApi";
import { OrderSummary } from "../../Components/Page/Order";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  let userInput, orderDetails;

  if (!isLoading && data?.result) {
    userInput = {
      name: data.result.pickupName,
      email: data.result.pickupEmail,
      phoneNumber: data.result.pickupPhoneNumber,
    };
    orderDetails = {
      id: data.result.orderId,
      cartItems: data.result.orderDetails,
      cartTotal: data.result.orderTotal,
      status: data.result.status,
    };
  }

  return (
    <div
      className="container my-5 mx-auto p-5 w-100"
      style={{ maxWidth: "750px" }}
    >
      {!isLoading && orderDetails && userInput && (
        <OrderSummary data={orderDetails} userInput={userInput} />
      )}
    </div>
  );
}

export default OrderDetails;
