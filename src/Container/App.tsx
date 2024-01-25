import React, { useEffect, useState } from "react";
import { Header } from "../Components/Layout";
import {
  Login,
  Register,
  NotFound,
  AccessDenied,
  Home,
  ProductList,
  ProductDetails,
  ShoppingCart,
} from "../Pages";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { User } from "../Interfaces";
import jwtDecode from "jwt-decode";
import { setLoggedInUser } from "../Storage/userAuthSlice";
import { RootState } from "../Storage/store";
import { useGetShoppingCartQuery } from "../APIs/shoppingCart";
import { setShoppingCart } from "../Storage/shoppingCartSlice";

function App() {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const userData: User = useSelector((state: RootState) => state.userAuthStore);
  const { data, isLoading } = useGetShoppingCartQuery(userData.id, {
    skip: skip,
  });

  useEffect(() => {
    const localToken = localStorage.getItem("token");
    if (localToken) {
      const { fullName, id, email, role }: User = jwtDecode(localToken);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
    }
  }, []);

  useEffect(() => {
    if (!isLoading && data) {
      dispatch(setShoppingCart(data.result?.cartItems));
    }
  }, [data]);

  useEffect(() => {
    if (userData.id) setSkip(false);
  }, [userData]);

  return (
    <div>
      <Header />
      <div className="pb-5">
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/accessDenied" element={<AccessDenied />} />
          <Route path="/shoppingCart" element={<ShoppingCart />} />
          <Route path="/product/productList" element={<ProductList />} />
          <Route
            path="/productDetails/:productId"
            element={<ProductDetails />}
          ></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
