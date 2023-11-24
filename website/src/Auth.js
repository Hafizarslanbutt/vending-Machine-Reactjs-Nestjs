import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { notification } from "antd";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  let [authMode, setAuthMode] = useState("signin");
  const changeAuthMode = () => {
    setAuthMode(authMode === "signin" ? "signup" : "signin");
  };
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "",
    deposit: 0,
  });

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleInputChangeSignin = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };
  const openNotification = () => {
    notification.open({
      message: "Error!",
      description: "Invalid Credentials",
    });
  };

  const handleSignin = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      deposit: parseFloat(formData.deposit) || 0,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/register",
        payload
      );

      console.log("Response:", response.data);
      if (response.data) {
        setForm({
          username: "",
          password: "",
        });
        setAuthMode("signin");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3000/auth/login",
        form
      );
      if (response.data) {
        localStorage.setItem("userData", JSON.stringify(response.data));
        navigate("/Product");
      }
    } catch (error) {
      openNotification();
      console.error("Error fetching products:", error);
    }
  };

  if (authMode === "signin") {
    return (
      <div className="Auth-form-container">
        <form className="Auth-form" onSubmit={handleSubmit}>
          <div className="Auth-form-content">
            <h3 className="Auth-form-title">Login</h3>
            <div className="text-center">
              Not registered yet?{" "}
              <span className="link-primary" onClick={changeAuthMode}>
                Sign Up
              </span>
            </div>
            <div className="form-group mt-3">
              <label>Username</label>
              <input
                type="username"
                name="username"
                className="form-control mt-1"
                placeholder="Email Address"
                onChange={handleInputChangeSignin}
              />
            </div>
            <div className="form-group mt-3">
              <label>Password</label>
              <input
                type="password"
                name="password"
                className="form-control mt-1"
                placeholder="Password"
                onChange={handleInputChangeSignin}
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
  }

  return (
    <div className="Auth-form-container">
      <form className="Auth-form" onSubmit={handleSignin}>
        <div className="Auth-form-content">
          <h3 className="Auth-form-title">Regiset</h3>
          <div className="text-center">
            Already registered?{" "}
            <span className="link-primary" onClick={changeAuthMode}>
              Sign In
            </span>
          </div>
          <div className="form-group mt-3">
            <label>Username</label>
            <input
              type="username"
              name="username"
              className="form-control mt-1"
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
export default Auth;
