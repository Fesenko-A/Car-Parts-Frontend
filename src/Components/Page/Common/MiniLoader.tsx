import React from "react";

function MiniLoader({ type = "success", size = 100 }) {
  return (
    <div
      className={`spinner-border text-${type}`}
      style={{ scale: `${size}%` }}
    ></div>
  );
}

export default MiniLoader;
