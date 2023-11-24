import React, { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";

const ProductList = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  console.log("userData", userData);
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [update, setUpdate] = useState(false);
  const [newProduct, setNewProduct] = useState({
    amountAvailable: "",
    cost: "",
    productName: "",
  });

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:3000/product");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openNotification = () => {
    notification.open({
      message: "Error!",
      description: "You have not permission.",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct({ ...newProduct, [name]: value });
  };

  const addProduct = async () => {
    const payload = {
      ...newProduct,
      amountAvailable: parseFloat(newProduct.amountAvailable) || 0,
      cost: parseFloat(newProduct.cost) || 0,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/product/add",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );

      setNewProduct({ amountAvailable: "", cost: "", productName: "" });
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/product/remove/${id}`,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      fetchProducts();
    } catch (error) {
      openNotification();
      console.error("Error deleting product:", error);
    }
  };
  const updateProduct = async ({ product }) => {
    setUpdate(true);
    setProductId(product._id);
    setNewProduct({
      amountAvailable: product.amountAvailable,
      cost: product.cost,
      productName: product.productName,
    });
  };

  const handleUpdate = async () => {
    setUpdate(true);
    const payload = {
      amountAvailable: parseFloat(newProduct.amountAvailable) || 0,
      cost: parseFloat(newProduct.cost) || 0,
      productName: newProduct.productName,
      productId: productId,
    };
    try {
      const response = await axios.put(
        "http://localhost:3000/product/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      setNewProduct({ amountAvailable: "", cost: "", productName: "" });
      setUpdate(false);
      fetchProducts();
    } catch (error) {
      openNotification();
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Product List</h1>
      <ul className="list-group">
        {products.map((product) => (
          <li
            key={product._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            {product.productName} - ${product.cost}(Amount -
            {product.amountAvailable})
            <div>
              <button
                className="btn btn-primary"
                onClick={() => updateProduct({ product })}
              >
                Update
              </button>
              <button
                className="btn btn-danger ms-3"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="mt-4">{update ? "Update Product" : "Add New Product"}</h2>
      <div className="mb-3">
        <label className="form-label">
          Product Name:
          <input
            type="text"
            className="form-control"
            name="productName"
            value={newProduct.productName}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Cost:
          <input
            type="number"
            className="form-control"
            name="cost"
            value={newProduct.cost}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Amount Available:
          <input
            type="number"
            className="form-control"
            name="amountAvailable"
            value={newProduct.amountAvailable}
            onChange={handleInputChange}
          />
        </label>
      </div>
      <button
        className="btn btn-primary"
        onClick={update ? handleUpdate : addProduct}
      >
        {update ? "Update" : "Add Product"}
      </button>
    </div>
  );
};

export default ProductList;
