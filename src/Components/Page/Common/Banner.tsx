import React, { useState } from "react";
import "./Banner.css";
import { useDispatch } from "react-redux";
import { setSearchProduct } from "../../../Storage/productSlice";

function Banner() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchProduct(e.target.value));
    setValue(e.target.value);
  };

  return (
    <div className="custom-banner">
      <div
        className="m-auto d-flex align-items-center"
        style={{ width: "60vh", height: "35vh" }}
      >
        <div className="d-flex align-items-center" style={{ width: "100%" }}>
          <input
            type={"text"}
            className="form-control rounded-pill"
            style={{ width: "100%", padding: "20px 20px" }}
            placeholder="Search for Details!"
            value={value}
            onChange={handleChange}
          />
          <span style={{ position: "relative", left: "-43px" }}>
            <i className="bi bi-search" />
          </span>
        </div>
      </div>
    </div>
  );
}

export default Banner;
