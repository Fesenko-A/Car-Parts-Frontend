import React, { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { toastNotify } from "../../../Helper";
import { ApiResponse } from "../../../Interfaces";
import {
  useCreateOrderMutation,
  useUpdateOrderMutation,
} from "../../../APIs/orderApi";
import { useNavigate } from "react-router-dom";
import { useCreatePaymentMutation } from "../../../APIs/onlinePaymentsApi";

const PaymentForm = ({ data, userInput }: any) => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [createOrder] = useCreateOrderMutation();
  const [createPayment] = useCreatePaymentMutation();
  const [updateOrder] = useUpdateOrderMutation();

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
    } else if (data.id !== null) {
      const orderId = data.id;
      const paymentId = result.paymentIntent.id;
      await updateOrder({
        orderId: orderId,
        paymentMethodId: 2,
        paid: true,
      });
      await createPayment({ orderId, paymentId });

      navigate(`/order/orderDetails/${orderId}`);
      toastNotify("Order paid online successfuly");
    } else {
      const paymentId = result.paymentIntent?.id;
      const dataToPost = {
        pickupName: userInput.name,
        pickupPhoneNumber: userInput.phoneNumber,
        pickupEmail: userInput.email,
        userId: data.userId,
        orderTotal: data.orderTotal,
        paymentMethodId: data.paymentMethodId,
        paymentId: data.paymentId,
        status: data.status,
        totalItems: data.totalItems,
        orderDetails: data.orderDetails,
      };
      const response: ApiResponse = await createOrder(dataToPost);

      if (response) {
        const orderId = response.data!.result.orderId;
        const payment = await createPayment({ orderId, paymentId });

        if (payment) {
          navigate(`/order/orderConfirmed/${orderId}`);
        }
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
