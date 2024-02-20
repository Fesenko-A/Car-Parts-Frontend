import React, { useState } from "react";
import { MainLoader } from "../Common";
import { PaymentMethods } from "../../../Static";

function PaymentSummary({ data, userInput }: any) {
  const [loading, setIsLoading] = useState(false);

  return (
    <div>
      {loading && <MainLoader />}
      {!loading && (
        <>
          <div className="d-flex justify-content-between align-items-center">
            <h3 className="text-primary">Payment Summary</h3>
          </div>
          <div className="mt-3">
            <div className="border py-3 px-2">Name: {userInput.name}</div>
            <div className="border py-3 px-2">Email: {userInput.email}</div>
            <div className="border py-3 px-2">
              Phone: {userInput.phoneNumber}
            </div>
            <div className="border py-3 px-2">
              Payment Method:{" "}
              {data.paymentMethodId == 2
                ? PaymentMethods.ONLINE
                : PaymentMethods.CASH}
            </div>
            <div className="border py-3 px-2">
              <h4 className="text-primary">Products</h4>
              {data.orderDetails?.map((cartItem: any, index: number) => {
                return (
                  <div className="d-flex" key={index}>
                    <div className="d-flex w-100 justify-content-between">
                      <p>{cartItem.productName}</p>
                      <p>
                        ${cartItem.price} x {cartItem.quantity}
                      </p>
                    </div>
                    <p
                      className="fw-bold"
                      style={{ width: "70px", textAlign: "right" }}
                    >
                      ${(cartItem.price ?? 0) * (cartItem.quantity ?? 0)}
                    </p>
                  </div>
                );
              })}
              <div className="p-3">
                <div>
                  <hr />
                  <h4 className="text-primary" style={{ textAlign: "right" }}>
                    ${data.orderTotal?.toFixed(2)}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default PaymentSummary;
