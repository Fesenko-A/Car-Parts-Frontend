import React, { useEffect, useState } from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/store";
import { useGetAllPaymentsQuery } from "../../APIs/onlinePaymentsApi";
import { MainLoader } from "../../Components/Page/Common";
import { OnlinePaymentList } from "../../Components/Page/OnlinePayments";
import { PaymentStatuses } from "../../Static";
import { inputHelper } from "../../Helper";

const filterOptions = ["All", PaymentStatuses.PAID, PaymentStatuses.RETURNED];

function MyOnlinePayments() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [filters, setFilters] = useState({ status: "" });
  const [paymentsData, setPaymentsData] = useState([]);
  const [apiFilters, setApiFilters] = useState({
    status: "",
    userId: userId,
  });

  const { data, isLoading } = useGetAllPaymentsQuery({
    ...(apiFilters && {
      status: apiFilters.status,
      userId: userId,
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
      userId: userId,
    });
  };

  useEffect(() => {
    if (data) {
      setPaymentsData(data?.apiResponse.result);
    }
  }, [data]);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-primary">My Online Payments</h1>
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
