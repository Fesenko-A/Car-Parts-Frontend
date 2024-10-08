import React from "react";
import { useParams } from "react-router-dom";
import { useGetOrderDetailsQuery } from "../../APIs/orderApi";
import { OrderSummary } from "../../Components/Page/Order";

function OrderDetails() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderDetailsQuery(id);
  let userInput, details;

  if (!isLoading && data?.result) {
    userInput = {
      name: data.result.pickupName,
      email: data.result.pickupEmail,
      phoneNumber: data.result.pickupPhoneNumber,
    };
    details = {
      id: data.result.orderId,
      userId: data.result.userId,
      orderDetails: data.result.orderDetails,
      orderTotal: data.result.orderTotal,
      status: data.result.status,
      orderDate: data.result.orderDate,
      lastUpdate: data.result.lastUpdate,
      paymentMethod: data.result.paymentMethod.description,
      paid: data.result.paid,
    };
  }

  return (
    <div
      className="container my-5 mx-auto p-5 w-100"
      style={{ maxWidth: "750px" }}
    >
      {!isLoading && details && userInput && (
        <OrderSummary data={details} userInput={userInput} />
      )}
    </div>
  );
}

export default OrderDetails;
