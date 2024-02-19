import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Order } from "../Interfaces";
import { OrderStatuses, PaymentMethods } from "../Static";

function PaymentMethod() {
  const {
    state: { data },
  } = useLocation();

  const order: Order = {
    pickupName: data.pickupName,
    pickupPhoneNumber: data.pickupPhoneNumber,
    pickupEmail: data.pickupEmail,
    userId: data.userId,
    orderTotal: data.orderTotal,
    status: OrderStatuses.PENDING,
    totalItems: data.totalItems,
    paymentMethodId: 1,
    orderDetails: data.orderDetails,
  };

  const handleMethodId = async (e: any) => {
    order.paymentMethodId = e.target.value;
  };

  useEffect(() => {
    console.log(order.paymentMethodId);
  }, []);

  return (
    <div>
      <div className="text-primary">Payment Method</div>
      <select onChange={handleMethodId}>
        <option value={1}>{PaymentMethods.CASH}</option>
        <option value={2}>{PaymentMethods.ONLINE}</option>
      </select>
    </div>
  );
}

export default PaymentMethod;
