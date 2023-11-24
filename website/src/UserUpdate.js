import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UserUpdate = () => {
  const navigate = useNavigate();
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);

  const [formData, setFormData] = useState({
    username: userData.user.username,
    password: "",
    role: userData.user.role,
    deposit: userData.user.deposit,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let payload = {
      username: formData.username,
      role: formData.role,
      deposit: parseFloat(formData.deposit) || 0,
    };

    if (formData.password) {
      payload = {
        ...payload,
        password: formData.password,
      };
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/users/update",
        payload,
        {
          headers: {
            Authorization: `Bearer ${userData.accesstoken}`,
          },
        }
      );
      if (response.data) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/Product");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSubmit}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Update User</h3>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="username"
              name="username"
              className="form-control mt-1"
              value={formData.username}
              placeholder="Email Address"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Password</label>
            <input
              type="password"
              name="password"
              className="form-control mt-1"
              placeholder="Password"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Role</label>
            <input
              type="role"
              name="role"
              value={formData.role}
              className="form-control mt-1"
              placeholder="Role"
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group mt-3">
            <label>Deposit</label>
            <input
              type="number"
              name="deposit"
              value={formData.deposit}
              className="form-control mt-1"
              placeholder="Deposit"
              onChange={handleInputChange}
            />
          </div>
          <div className="d-grid gap-2 mt-3">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default UserUpdate;
