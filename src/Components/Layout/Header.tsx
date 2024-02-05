import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { CartItem, User } from "../../Interfaces";
import { RootState } from "../../Storage/store";
import { emptyUserState, setLoggedInUser } from "../../Storage/userAuthSlice";
import { Roles } from "../../Static/Roles";

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shoppingCartFromStore: CartItem[] = useSelector(
    (state: RootState) => state.shoppingCartStore.cartItems ?? []
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setLoggedInUser({ ...emptyUserState }));
    navigate("/");
  };

  const userData: User = useSelector((state: RootState) => state.userAuthStore);

  return (
    <nav className="navbar navbar-dark navbar-expand-lg bg-dark">
      <div className="container-fluid">
        <NavLink className="navbar-brand" to="/">
          Car Parts Store
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 w-100">
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" aria-current="page" to="/2">
                Categories
              </NavLink>
            </li>
            {userData.role === Roles.ADMIN ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin Panel
                </a>
                <ul className="dropdown-menu">
                  <li
                    style={{ cursor: "pointer" }}
                    className="dropdown-item"
                    onClick={() => navigate("/product/productList")}
                  >
                    Products
                  </li>
                  <li
                    style={{ cursor: "pointer" }}
                    className="dropdown-item"
                    onClick={() => navigate("/order/myOrders")}
                  >
                    My Orders
                  </li>
                  <li
                    style={{ cursor: "pointer" }}
                    className="dropdown-item"
                    onClick={() => navigate("/order/allOrders")}
                  >
                    All Orders
                  </li>
                </ul>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  aria-current="page"
                  to="/order/myOrders"
                >
                  My orders
                </NavLink>
              </li>
            )}

            <li>
              <NavLink
                className="nav-link"
                aria-current="page"
                to="/shoppingCart"
              >
                <i className="bi bi-cart"></i>
                {userData.id &&
                  (shoppingCartFromStore.length > 0
                    ? ` (${shoppingCartFromStore.length})`
                    : "")}
              </NavLink>
            </li>
            <div className="d-flex" style={{ marginLeft: "auto" }}>
              {userData.id && (
                <>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      style={{
                        cursor: "pointer",
                        background: "transparent",
                        border: 0,
                      }}
                    >
                      Welcome {userData.fullName}!
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
                      style={{ border: "none", height: "40px", width: "100px" }}
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

              {!userData.id && (
                <>
                  <li className="nav-item text-white">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                  <li className="nav-item text-white">
                    <NavLink
                      className="btn btn-primary btn-outlined rounded-pill text-white mx-2"
                      style={{ border: "none", height: "40px", width: "100px" }}
                      to="/login"
                    >
                      Login
                    </NavLink>
                  </li>
                </>
              )}
            </div>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
