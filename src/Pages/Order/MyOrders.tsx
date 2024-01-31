import React from "react";
import { withAuth } from "../../HOC";
import { useSelector } from "react-redux";
import { RootState } from "../../Storage/store";
import { useGetAllOrdersQuery } from "../../APIs/orderApi";
import { OrderList } from "../../Components/Page/Order";
import { MainLoader } from "../../Components/Page/Common";

function MyOrders() {
  const userId = useSelector((state: RootState) => state.userAuthStore.id);
  const { data, isLoading } = useGetAllOrdersQuery({ userId });

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <>
          <div className="d-flex align-items-center justify-content-between mx-5 mt-5">
            <h1 className="text-primary">My Orders</h1>
          </div>
          <OrderList
            isLoading={isLoading}
            orderData={data?.apiResponse.result}
          />
        </>
      )}
    </>
  );
}

export default withAuth(MyOrders);
