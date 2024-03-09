import React from "react";
import OrderListType from "./OrderListType";
import { MainLoader } from "../Common";
import { Order } from "../../../Interfaces";
import { useNavigate } from "react-router-dom";
import { getStatusColor } from "../../../Helper";

function OrderList({ isLoading, orderData }: OrderListType) {
  const navigate = useNavigate();
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table px-5">
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-1">Name</div>
              <div className="col-1">Phone</div>
              <div className="col-1">Total</div>
              <div className="col-1">Items</div>
              <div className="col-2">Order Date</div>
              <div className="col-1">Status</div>
              <div className="col-1">Payment</div>
              <div className="col-2">Last Update</div>
              <div className="col-1"></div>
            </div>
            {orderData.map((orderItem: Order) => {
              const badgeColor = getStatusColor(orderItem.status!);
              return (
                <div className="row border" key={orderItem.orderId}>
                  <div className="col-1">{orderItem.orderId}</div>
                  <div className="col-1">{orderItem.pickupName}</div>
                  <div className="col-1">{orderItem.pickupPhoneNumber}</div>
                  <div className="col-1">
                    ${orderItem.orderTotal!.toFixed(2)}
                  </div>
                  <div className="col-1">{orderItem.totalItems}</div>
                  <div className="col-2">
                    {new Date(orderItem.orderDate!).toLocaleString()}
                  </div>
                  <div className="col-1">
                    <span className={`badge bg-${badgeColor}`}>
                      {orderItem.status}
                    </span>
                  </div>
                  <div className="col-1">
                    {orderItem.paymentMethod?.description === "Cash" ? (
                      <>
                        <i className="bi bi-cash-stack"></i>
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card"></i>
                      </>
                    )}
                    &nbsp;
                    {orderItem.paid ? "Paid" : "Unpaid"}
                  </div>
                  <div className="col-2">
                    {new Date(orderItem.lastUpdate!).toLocaleString()}
                  </div>
                  <div className="col-1">
                    <button
                      className="btn btn-primary"
                      onClick={() =>
                        navigate("/order/orderDetails/" + orderItem.orderId)
                      }
                    >
                      Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default OrderList;
