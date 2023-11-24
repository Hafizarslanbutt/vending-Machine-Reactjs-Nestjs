import React, { useState } from "react";
import { notification } from "antd";
import axios from "axios";

const UpdateDeposit = () => {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  const [desposit, setDeposit] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeposit(value);
  };
  const openNotification = (message) => {
    notification.open({
      message: "Error!",
      description: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      deposit: parseFloat(desposit) || 0,
    };
    try {
      const response = await axios.patch(
        "http://localhost:3000/users/update/deposit",
        data,

        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
    } catch (error) {
      openNotification(error.response.data.message);

      console.error("Error fetching products:", error);
    }
  };
  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(
        "http://localhost:3000/users/reset/deposit",
        {},
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      console.log("response", response);
    } catch (error) {
      console.error("Error handleReset :", error);
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Update Deposit</h3>
          <div className="form-group mt-3">
            <label>Deposit</label>
            <input
              type="number"
              name="deposit"
              value={desposit}
              className="form-control mt-1"
              placeholder="Deposit"
              onChange={handleInputChange}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Update
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleReset}
            >
              Reset Deposit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default UpdateDeposit;
