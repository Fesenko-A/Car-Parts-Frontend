import React from "react";
import { useNavigate, useParams } from "react-router-dom";

let confirmedImage = require("../../Assets/Images/confirmed.jpg");

function OrderConfirmed() {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div className="w-100 text-center d-flex justify-content-center align-items-center">
      <div>
        <i
          style={{ fontSize: "7rem" }}
          className="bi bi-check2-circle text-primary"
        />
        <div className="pb-5">
          <h2 className="text-primary">Order has been confirmed!</h2>
          <h5 className="mt-3">Your order ID: {id}</h5>
          <img
            src={confirmedImage}
            style={{
              width: "40%",
              borderRadius: "30px",
            }}
          />
          <br />
          <button
            className="btn btn-primary rounded-pill mt-2"
            onClick={() => navigate("/order/orderDetails/" + id)}
          >
            See details
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmed;
