import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Auth";
import UserUpdate from "./UserUpdate";
import Product from "./Product";
import ProductBuy from "./ProductsBuy";
import NavBar from "./Navbar";
import UpdateDeposit from "./UpdateDeposit";

function App() {
  const userDataString = localStorage.getItem("userData");
  const userData = JSON.parse(userDataString);
  return (
    <>
      {userData && <NavBar />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/update-user" element={<UserUpdate />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product-buy" element={<ProductBuy />} />
          <Route path="/update-deposit" element={<UpdateDeposit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
