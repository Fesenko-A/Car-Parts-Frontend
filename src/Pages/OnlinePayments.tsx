import React, { useEffect } from "react";
import { withAdminAuth } from "../HOC";
import { useGetAllPaymentsQuery } from "../APIs/onlinePaymentsApi";
import { MainLoader } from "../Components/Page/Common";
import { OnlinePayment } from "../Interfaces";

function OnlinePayments() {
  const { data, isLoading } = useGetAllPaymentsQuery(null);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-primary">List of Online Payments</h1>
          </div>
          <div className="p-2">
            <div className="row border">
              <div className="col-1">Id</div>
              <div className="col-1">Order Id</div>
              <div className="col-3">Payment Id</div>
              <div className="col-2">Payment Status</div>
              <div className="col-1">Amount</div>
              <div className="col-2">Payment Date</div>
              <div className="col-2">Last Update</div>
            </div>

            {data.result.map((payment: OnlinePayment) => {
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

export default withAdminAuth(OnlinePayments);
