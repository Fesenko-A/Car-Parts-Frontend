import React, { useState } from "react";
import { OrderSummaryProps } from "./OrderSummaryProps";
import { ApiResponse, CartItem } from "../../../Interfaces";
import { getPaidColor, getStatusColor, toastNotify } from "../../../Helper";
import { useNavigate } from "react-router-dom";
import { Roles, OrderStatuses, PaymentMethods } from "../../../Static";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/store";
import { useUpdateOrderMutation } from "../../../APIs/orderApi";
import { MainLoader } from "../Common";
import { useCancelPaymentMutation } from "../../../APIs/onlinePaymentsApi";

function OrderSummary({ data, userInput }: OrderSummaryProps) {
  const badgeTypeColor = getStatusColor(data.status!);
  const paymentColor = getPaidColor(data.paid!);
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const [updateOrder] = useUpdateOrderMutation();
  const [cancelPayment] = useCancelPaymentMutation();
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const nextStatus: any =
    data.status! === OrderStatuses.CONFIRMED
      ? { color: "info", value: OrderStatuses.PROCESSING }
      : data.status! === OrderStatuses.PROCESSING
      ? { color: "warning", value: OrderStatuses.READY }
      : data.status! === OrderStatuses.READY && {
          color: "success",
          value: OrderStatuses.COMPLETED,
        };

  const handleNextStatus = async () => {
    setIsLoading(true);

    if (data.status === OrderStatuses.READY && data.paid === false) {
      toastNotify("Cannot complete this order because it is unpaid", "error");
    } else {
      await updateOrder({
        orderId: data.id,
        status: nextStatus.value,
      });
    }

    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);

    if (data.paymentMethod === PaymentMethods.ONLINE) {
      const response: ApiResponse = await cancelPayment(data.id);
      if (response) {
        toastNotify("Refund created");
        toastNotify("Money will be returned within 5-10 days", "info");
      } else {
        toastNotify("Error while creating refund", "error");
      }
    }

    await updateOrder({
      orderId: data.id,
      status: OrderStatuses.CANCELLED,
    });

    setIsLoading(false);
  };

  const handlePaid = async () => {
    setIsLoading(true);

    await updateOrder({
      orderId: data.id,
      paid: true,
    });

    setIsLoading(false);
  };

  return (
    <div>
      {loading && <MainLoader />}
      {!loading && (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-primary">Order Summary</h3>
            <div>
              <span className={`btn btn-${paymentColor} fs-6 active me-1`}>
                {data.paid ? "Paid" : "Unpaid"}
              </span>
              <span className={`btn btn-${badgeTypeColor} fs-6 active`}>
                {data.status}
              </span>
            </div>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name: {userInput.name}</div>
            <div className="border py-3 px-2">Email: {userInput.email}</div>
            <div className="border py-3 px-2">
              Phone: {userInput.phoneNumber}
            </div>
            <div className="border py-3 px-2">
              Order Date: {new Date(data.orderDate!).toLocaleString()}
            </div>
            <div className="border py-3 px-2">
              Last Update: {new Date(data.lastUpdate!).toLocaleString()}
            </div>
            <div className="border py-3 px-2">
              Payment Method: {data.paymentMethod}
              {userData.role === Roles.ADMIN &&
              data.paymentMethod === PaymentMethods.CASH &&
              data.paid === false ? (
                <button
                  className="btn btn-success btn-sm ms-1"
                  onClick={handlePaid}
                >
                  Click if Paid
                </button>
              ) : (
                ""
              )}
            </div>
            <div className="border py-3 px-2">
              <h4 className="text-primary">Products</h4>
              {data.cartItems?.map((cartItem: CartItem, index: number) => {
                return (
                  <div className="d-flex" key={index}>
                    <div className="d-flex w-100 justify-content-between">
                      <p>{cartItem.product?.name}</p>
                      <p>
                        ${cartItem.product?.price} x {cartItem.quantity}
                      </p>
                    </div>
                    <p
                      className="fw-bold"
                      style={{ width: "70px", textAlign: "right" }}
                    >
                      $
                      {(cartItem.product?.price ?? 0) *
                        (cartItem.quantity ?? 0)}
                    </p>
                  </div>
                );
              })}
              <div className="p-3">
                <div>
                  <hr />
                  <h4 className="text-primary" style={{ textAlign: "right" }}>
                    ${data.cartTotal?.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
              Back to Orders
            </button>

            {userData.role === Roles.ADMIN && (
              <div className="d-flex">
                {data.status !== OrderStatuses.CANCELLED &&
                  data.status !== OrderStatuses.COMPLETED && (
                    <button
                      className="btn btn-danger me-1"
                      onClick={handleCancel}
                    >
                      {data.paymentMethod === PaymentMethods.ONLINE
                        ? "Cancel and Refund"
                        : "Cancel"}
                    </button>
                  )}
                <button
                  className={`btn btn-${nextStatus.color}`}
                  onClick={handleNextStatus}
                >
                  {nextStatus.value}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default OrderSummary;
