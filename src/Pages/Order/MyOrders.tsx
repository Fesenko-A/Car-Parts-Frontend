import React, { useEffect, useState } from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/store";
import { useGetAllOrdersQuery } from "../../APIs/orderApi";
import { OrderList } from "../../Components/Page/Order";
import { MainLoader } from "../../Components/Page/Common";
import { getPageDetails, inputHelper } from "../../Helper";
import filterOptions from "./filterOptions";

function MyOrders() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const [filters, setFilters] = useState({ status: "" });
  const [orderData, setOrderData] = useState([]);

  const [totalRecords, setTotalRecords] = useState(0);
  const [pageOptions, setPageOptions] = useState({
    pageNumber: 1,
    pageSize: 5,
  });
  const [currentPageSize, setCurrentPageSize] = useState(pageOptions.pageSize);

  const [apiFilters, setApiFilters] = useState({
    status: "",
    userId: userId,
  });

  const { data, isLoading } = useGetAllOrdersQuery({
    ...(apiFilters && {
      status: apiFilters.status,
      userId: apiFilters.userId,
      pageNumber: pageOptions.pageNumber,
      pageSize: pageOptions.pageSize,
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
      const { TotalRecords } = JSON.parse(data.totalRecords);
      setTotalRecords(TotalRecords);
    }
  }, [data]);

  const handlePageOptionChange = (direction: string, pageSize?: number) => {
    if (direction === "prev") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber - 1 });
    } else if (direction === "next") {
      setPageOptions({ pageSize: 5, pageNumber: pageOptions.pageNumber + 1 });
    } else if (direction === "change") {
      setPageOptions({ pageSize: pageSize ? pageSize : 5, pageNumber: 1 });
    }
  };

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
          <div className="d-flex mx-5 justify-content-end align-items-center">
            <div>Rows per Page: </div>
            <div>
              <select
                className="form-select mx-2"
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  handlePageOptionChange("change", Number(e.target.value));
                  setCurrentPageSize(Number(e.target.value));
                }}
                style={{ width: "80px" }}
                value={currentPageSize}
              >
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
              </select>
            </div>
            <div className="mx-2">
              {getPageDetails(
                pageOptions.pageNumber,
                pageOptions.pageSize,
                totalRecords
              )}
            </div>
            <button
              onClick={() => handlePageOptionChange("prev")}
              disabled={pageOptions.pageNumber === 1}
              className="btn btn-outline-primary px-3 mx-2"
            >
              <i className="bi bi-chevron-left" />
            </button>
            <button
              onClick={() => handlePageOptionChange("next")}
              disabled={
                pageOptions.pageNumber * pageOptions.pageSize >= totalRecords
              }
              className="btn btn-outline-primary px-3 mx-2"
            >
              <i className="bi bi-chevron-right" />
            </button>
          </div>
        </>
      )}
    </>
  );
}

export default withAuth(MyOrders);
