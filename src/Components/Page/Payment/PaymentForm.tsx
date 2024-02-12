import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toastNotify } from "../../../Helper";
import { OrderSummaryProps } from "../Order/OrderSummaryProps";
import { ApiResponse, CartItem } from "../../../Interfaces";
import { useCreateOrderMutation } from "../../../APIs/orderApi";
import { OrderStatuses } from "../../../Static";
import { useNavigate } from "react-router-dom";

const PaymentForm = ({ data, userInput }: OrderSummaryProps) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useCreateOrderMutation();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }
    setIsProcessing(true);

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "https://example.com/order/123/complete",
      },
      redirect: "if_required",
    });

    if (result.error) {
      toastNotify("An unexpected error occured", "error");
      setIsProcessing(false);
    } else {
      let total = 0;
      let totalItems = 0;

      const orderDetailsDTO: any = [];
      data.cartItems?.forEach((item: CartItem) => {
        const tempOrderDetail: any = {};
        tempOrderDetail["productId"] = item.product?.id;
        tempOrderDetail["quantity"] = item.quantity;
        tempOrderDetail["productName"] = item.product?.name;
        tempOrderDetail["price"] = item.product?.price;
        orderDetailsDTO.push(tempOrderDetail);
        total += item.quantity! * item.product?.price!;
        totalItems += item.quantity!;
      });

      const response: ApiResponse = await createOrder({
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        userId: data.userId,
        orderTotal: total,
        paymentId: data.paymentId,
        status:
          result.paymentIntent.status === "succeeded"
            ? OrderStatuses.CONFIRMED
            : OrderStatuses.PENDING,
        totalItems: totalItems,
        orderDetails: orderDetailsDTO,
      });

      if (response) {
        if (response.data?.result.status === OrderStatuses.CONFIRMED) {
          navigate(`/order/orderConfirmed/${response.data.result.orderId}`);
        } else {
          navigate("/failed");
        }
      }
    }
    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      <button
        className="btn btn-primary mt-5 w-100"
        disabled={!stripe || isProcessing}
      >
        <span id="button-text">
          {isProcessing ? "Processing..." : "Submit Order"}
        </span>
      </button>
    </form>
  );
};

export default PaymentForm;
