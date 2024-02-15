import React, { useEffect, useState } from "react";
import { withAdminAuth } from "../../HOC";
import { useGetAllPaymentsQuery } from "../../APIs/onlinePaymentsApi";
import { OnlinePaymentList } from "../../Components/Page/OnlinePayments";
import { MainLoader } from "../../Components/Page/Common";

function AllOnlinePayments() {
  const [filters, setFilters] = useState({ status: "" });
  const [paymentsData, setPaymentsData] = useState([]);
  const [apiFilters, setApiFilters] = useState({
    status: "",
  });

  const { data, isLoading } = useGetAllPaymentsQuery({
    ...(apiFilters && {
      status: apiFilters.status,
    }),
  });

  useEffect(() => {
    if (data) {
      setPaymentsData(data.apiResponse.result);
    }
  }, [data]);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-primary">Online Payments</h1>
          </div>
          <OnlinePaymentList isLoading={isLoading} paymentData={paymentsData} />
        </>
      )}
    </>
  );
}

export default withAdminAuth(AllOnlinePayments);
