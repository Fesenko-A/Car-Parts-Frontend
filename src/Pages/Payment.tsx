import React from "react";
import { useLocation } from "react-router-dom";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentForm, PaymentSummary } from "../Components/Page/Payment";

function Payment() {
  const {
    state: { apiResult, userInput, clientSecret },
  } = useLocation();

  const stripePromise = loadStripe(
    "pk_test_51OVYpoCBJO48XwYLSsNgcWVvG6Ub2rNmAnODV9NPn6ehINDKpn9TwghaC8tRE8OqCOUWx9Il9alyK2PHKzhlfdrA00qfdMTCBV"
  );
  const options = { clientSecret: clientSecret };

  return (
    <Elements stripe={stripePromise} options={options}>
      <div className="container m-5 p-5">
        <div className="row">
          <div className="col-md-7">
            <PaymentSummary data={apiResult} userInput={userInput} />
          </div>
          <div className="col-md-4 offset-md-1">
            <h3 className="text-primary">Payment</h3>
            <div className="mt-5">
              <PaymentForm data={apiResult} userInput={userInput} />
            </div>
          </div>
        </div>
      </div>
    </Elements>
  );
}

export default Payment;
