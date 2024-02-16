import React, { ChangeEvent, useEffect, useState } from "react";
import { withAdminAuth } from "../../HOC";
import { useGetAllPaymentsQuery } from "../../APIs/onlinePaymentsApi";
import { OnlinePaymentList } from "../../Components/Page/OnlinePayments";
import { MainLoader } from "../../Components/Page/Common";
import { PaymentStatuses } from "../../Static";
import { inputHelper } from "../../Helper";

const filterOptions = ["All", PaymentStatuses.PAID, PaymentStatuses.RETURNED];

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempValue = inputHelper(e, filters);
    setFilters(tempValue);
  };

  const handleFilters = () => {
    setApiFilters({
      status: filters.status,
    });
  };

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
            <div className="d-flex" style={{ width: "15%" }}>
              <select
                className="form-select mx-2"
                onChange={handleChange}
                name="status"
              >
                {filterOptions.map((item, index) => (
                  <option key={index} value={item === "All" ? "" : item}>
                    {item}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-outline-primary"
                onClick={handleFilters}
              >
                Filter
              </button>
            </div>
          </div>
          <OnlinePaymentList isLoading={isLoading} paymentData={paymentsData} />
        </>
      )}
    </>
  );
}

export default withAdminAuth(AllOnlinePayments);
