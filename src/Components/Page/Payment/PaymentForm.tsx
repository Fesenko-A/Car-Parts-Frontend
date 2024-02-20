import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toastNotify } from "../../../Helper";
import { ApiResponse, CartItem } from "../../../Interfaces";
import { useCreateOrderMutation } from "../../../APIs/orderApi";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderStatuses } from "../../../Static";

const PaymentForm = () => {
  const navigate = useNavigate();
  const {
    state: { data },
  } = useLocation();
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
      const response: ApiResponse = await createOrder(data);
      data.status = OrderStatuses.PENDING;

      if (response) {
        // navigate(`/order/orderConfirmed/${response.data!.result.orderId}`);
      } else {
        navigate("/failed");
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
