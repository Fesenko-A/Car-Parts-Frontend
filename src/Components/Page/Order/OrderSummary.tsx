import React, { useState } from "react";
import { OrderSummaryProps } from "./OrderSummaryProps";
import { CartItem } from "../../../Interfaces";
import { getStatusColor } from "../../../Helper";
import { useNavigate } from "react-router-dom";
import { Roles, Statuses } from "../../../Static";
import { useSelector } from "react-redux";
import { RootState } from "../../../Storage/store";
import { useUpdateOrderMutation } from "../../../APIs/orderApi";
import { MainLoader } from "../Common";

function OrderSummary({ data, userInput }: OrderSummaryProps) {
  const badgeTypeColor = getStatusColor(data.status!);
  const navigate = useNavigate();
  const [loading, setIsLoading] = useState(false);
  const [updateOrderHeader] = useUpdateOrderMutation();
  const userData = useSelector((state: RootState) => state.userAuthStore);
  const nextStatus: any =
    data.status! === Statuses.CONFIRMED
      ? { color: "info", value: Statuses.PROCESSING }
      : data.status! === Statuses.PROCESSING
      ? { color: "warning", value: Statuses.READY }
      : data.status! === Statuses.READY && {
          color: "success",
          value: Statuses.COMPLETED,
        };

  const handleNextStatus = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderId: data.id,
      status: nextStatus.value,
    });
    setIsLoading(false);
  };

  const handleCancel = async () => {
    setIsLoading(true);
    await updateOrderHeader({
      orderId: data.id,
      status: Statuses.CANCELLED,
    });
    setIsLoading(false);
  };

  return (
    <div>
      {loading && <MainLoader />}
      {!loading && (
        <>
          &nbsp;
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-primary">Order Summary</h3>
            <span className={`btn btn-outline-${badgeTypeColor} fs-6`}>
              {data.status}
            </span>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name: {userInput.name}</div>
            <div className="border py-3 px-2">Email: {userInput.email}</div>
            <div className="border py-3 px-2">
              Phone: {userInput.phoneNumber}
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
                {data.status !== Statuses.CANCELLED &&
                  data.status !== Statuses.COMPLETED && (
                    <button
                      className="btn btn-danger mx-2"
                      onClick={handleCancel}
                    >
                      Cancel
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
