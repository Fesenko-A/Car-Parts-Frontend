import React from "react";
import OnlinePaymentListType from "./OnlinePaymentListType";
import { OnlinePayment } from "../../../Interfaces";
import { MainLoader } from "../Common";

function OnlinePaymentList({ isLoading, paymentData }: OnlinePaymentListType) {
  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table px-5">
          <div className="p-2">
            <div className="row border">
              <div className="col-1">ID</div>
              <div className="col-1">Order Id</div>
              <div className="col-3">Payment Id</div>
              <div className="col-2">Payment Status</div>
              <div className="col-1">Amount</div>
              <div className="col-2">Payment Date</div>
              <div className="col-2">Last Update</div>
            </div>

            {paymentData.map((payment: OnlinePayment) => {
              return (
                <div className="row border" key={payment.id}>
                  <div className="col-1">{payment.id}</div>
                  <div className="col-1">{payment.orderId}</div>
                  <div className="col-3">{payment.paymentId}</div>
                  <div className="col-2">{payment.paymentStatus}</div>
                  <div className="col-1">${payment.paymentAmount}</div>
                  <div className="col-2">
                    {new Date(payment.paymentDate!).toLocaleString()}
                  </div>
                  <div className="col-2">
                    {new Date(payment.lastUpdate!).toLocaleString()}
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

export default OnlinePaymentList;
