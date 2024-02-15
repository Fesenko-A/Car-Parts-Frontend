import React from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/store";
import { useGetAllPaymentsQuery } from "../../APIs/onlinePaymentsApi";
import { MainLoader } from "../../Components/Page/Common";
import { OnlinePaymentList } from "../../Components/Page/OnlinePayments";

function MyOnlinePayments() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllPaymentsQuery({ userId });

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-primary">My Online Payments</h1>
          </div>
          <OnlinePaymentList
            isLoading={isLoading}
            paymentData={data?.apiResponse.result}
          />
        </>
      )}
    </>
  );
}

export default withAuth(MyOnlinePayments);
