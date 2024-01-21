import React, { useState } from "react";
import { inputHelper, toastNotify } from "../Helper";
import { useLoginUserMutation } from "../APIs/authApi";
import { ApiResponse, User } from "../Interfaces";
import jwtDecode from "jwt-decode";
import { useDispatch } from "react-redux";
import { setLoggedInUser } from "../Storage/userAuthSlice";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";

function Login() {
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: ApiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password,
    });

    if (response.data) {
      toastNotify("Login successful!");
      const { token } = response.data.result;
      const { fullName, id, email, role }: User = jwtDecode(token);
      localStorage.setItem("token", token);
      dispatch(setLoggedInUser({ fullName, id, email, role }));
      navigate("/");
    } else if (response.error) {
      toastNotify("Incorrect username or password", "error");
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Login</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              required
              name="userName"
              value={userInput.userName}
              onChange={handleUserInput}
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              name="password"
              value={userInput.password}
              onChange={handleUserInput}
            />
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "200px" }}
            >
              Login
            </button>
          </div>
        </div>
      </form>
      <br />
    </div>
  );
}

export default Login;
