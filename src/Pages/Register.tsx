import React, { useState } from "react";
import { inputHelper, toastNotify } from "../Helper";
import { useRegisterUserMutation } from "../APIs/authApi";
import { ApiResponse } from "../Interfaces";
import { useNavigate } from "react-router-dom";
import { MainLoader } from "../Components/Page/Common";
import { Roles } from "../Static/Roles";

function Register() {
  const [registerUser] = useRegisterUserMutation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
    role: Roles.CUSTOMER,
    name: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const response: ApiResponse = await registerUser({
      userName: userInput.userName,
      password: userInput.password,
      role: Roles.CUSTOMER,
      name: userInput.name,
    });

    if (response.data) {
      toastNotify("Registration successful!");
      navigate("/login");
    } else if (response.error) {
      toastNotify(response.error.data.errorMessages[0], "error");
    }

    setLoading(false);
  };

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
      <form method="post" onSubmit={handleSubmit}>
        <h1 className="mt-5">Register</h1>
        <div className="mt-5">
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Username"
              required
              value={userInput.userName}
              onChange={handleUserInput}
              name="userName"
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Enter Name"
              required
              value={userInput.name}
              onChange={handleUserInput}
              name="name"
            />
          </div>
          <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Enter Password"
              required
              value={userInput.password}
              onChange={handleUserInput}
              name="password"
            />
          </div>
          <div className="mt-2">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ width: "200px" }}
            >
              Register
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Register;
