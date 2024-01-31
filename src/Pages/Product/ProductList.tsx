import React from "react";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "../../APIs/productApi";
import { MainLoader } from "../../Components/Page/Common";
import { Product } from "../../Interfaces";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ProductList() {
  const [deleteProduct] = useDeleteProductMutation();
  const { data, isLoading } = useGetAllProductsQuery(null);
  const navigate = useNavigate();

  const handleProductDelete = async (id: number) => {
    deleteProduct(id);
    toast.promise(
      deleteProduct(id),
      {
        pending: "Processing your request...",
        success: "Deleted Successfully",
        error: "Error",
      },
      {
        theme: "dark",
      }
    );
  };

  return (
    <>
      {isLoading && <MainLoader />}
      {!isLoading && (
        <div className="table p-5">
          <div className="d-flex align-items-center justify-content-between">
            <h1 className="text-primary">List of Products</h1>
            {/* <button
              className="btn btn-primary"
              onClick={() => navigate("/menuItem/menuItemUpsert")}
            >
              Add New
            </button> */}
          </div>
          <div className="p-2">
            <div className="row border">
              <div style={{ width: "50px" }}>Id</div>
              <div className="col-1">Image</div>
              <div className="col-2">Name</div>
              <div className="col-2">Category</div>
              <div className="col-2">Brand</div>
              <div className="col-1">Price</div>
              <div className="col-2">Special Tag</div>
              <div className="col-1">Actions</div>
            </div>

            {data.result.map((product: Product) => {
              return (
                <div className="row border" key={product.id}>
                  <div style={{ width: "50px" }}>{product.id}</div>
                  <div className="col-1">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      style={{
                        width: "100%",
                        maxWidth: "120px",
                        borderRadius: "20px",
                      }}
                    />
                  </div>
                  <div className="col-2">{product.name}</div>
                  <div className="col-2">{product.category.name}</div>
                  <div className="col-2">{product.brand.name}</div>
                  <div className="col-1">${product.price}</div>
                  <div className="col-2">{product.specialTag.name}</div>
                  <div className="col-1">
                    {/* <button
                      className="btn btn-success"
                      onClick={() =>
                        navigate("/menuItem/menuItemUpsert/" + product.id)
                      }
                    >
                      <i className="bi bi-pencil-fill" />
                    </button> */}
                    <button
                      className="btn btn-danger mx-2"
                      onClick={() => handleProductDelete(product.id)}
                    >
                      <i className="bi bi-trash-fill" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default ProductList;
