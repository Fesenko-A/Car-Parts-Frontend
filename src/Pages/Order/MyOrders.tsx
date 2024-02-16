import React, { useEffect, useState } from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/store";
import { useGetAllOrdersQuery } from "../../APIs/orderApi";
import { OrderList } from "../../Components/Page/Order";
import { MainLoader } from "../../Components/Page/Common";
import { OrderStatuses } from "../../Static";
import { inputHelper } from "../../Helper";

const filterOptions = [
  "All",
  OrderStatuses.CONFIRMED,
  OrderStatuses.PROCESSING,
  OrderStatuses.READY,
  OrderStatuses.CANCELLED,
];

function MyOrders() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [filters, setFilters] = useState({ status: "" });
  const [orderData, setOrderData] = useState([]);

  const [apiFilters, setApiFilters] = useState({
    status: "",
    userId: userId,
  });

  const { data, isLoading } = useGetAllOrdersQuery({
    ...(apiFilters && {
      status: apiFilters.status,
      userId: apiFilters.userId,
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
      setOrderData(data?.apiResponse.result);
    }
  }, [data]);

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-primary">My Orders</h1>
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
          <OrderList isLoading={isLoading} orderData={orderData} />
        </>
      )}
    </>
  );
}

export default withAuth(MyOrders);
