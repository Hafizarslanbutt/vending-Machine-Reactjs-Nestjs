import React, { useState, useEffect } from "react";
import { notification } from "antd";
import axios from "axios";

const ProductList = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const [products, setProducts] = useState([]);
  const [amount, setAmount] = useState(0);
  const [userProduct, setUserProduct] = useState([]);
  const productData = userProduct.data;

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

  const openNotification = (message) => {
    notification.open({
      message: "Error!",
      description: message,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAmount(value);
  };

  const buyProduct = async (id) => {
    const payload = {
      productId: id,
      amount: parseFloat(amount) || 0,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/product/buy",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      response && setUserProduct(response);
      setAmount(0);
      fetchProducts();
    } catch (error) {
      openNotification(error.response.data.message);
      console.error("Error adding product:", error);
    }
  };

  return (
    <div>
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
              <div className="d-flex gap-4 align-items-center ">
                <div className="d-flex">
                  <label className="form-label">
                    Amount:
                    <input
                      type="number"
                      className="form-control"
                      name="amountAvailable"
                      onChange={handleInputChange}
                    />
                  </label>
                </div>
                <div className="pt-2">
                  <button
                    className="btn btn-primary"
                    onClick={() => buyProduct(product._id)}
                  >
                    Buy
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {productData && (
        <div className="container mt-5">
          <h1 className="mb-4">Product Purchase</h1>
          <ul className="list-group">
            <li className="list-group-item d-flex justify-content-between align-items-center">
              {productData.productName} - {""}(Remaining Balance -
              {productData.balance})
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductList;
