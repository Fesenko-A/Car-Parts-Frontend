import React from "react";

function FiltersButton({ buttonText }: any) {
  return (
    <div
      className="btn btn-light text-dark fs-6 rounded-pill me-1 ms-1 mb-2"
      role="button"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style={{ width: "fit-content" }}
    >
      <span>{buttonText}&nbsp;</span>
      <i className="bi bi-caret-down ms-auto" />
    </div>
  );
}

export default FiltersButton;
