import React from "react";
import { Route, Routes } from "react-router-dom";
import path from "./ultils/path";
import { Home, Public } from "./pages/public";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  AdminHome,
  CreateProducts,
  Dashboard,
  Login,
  ManageOrder,
  ManageProducts,
  ManageUsers,
} from "./pages/admin";

function App() {
  return (
    <div className="min-h-screen">
      <ToastContainer />
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.ADMIN} element={<AdminHome />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
          <Route path={path.CREATEP_RODUCTS} element={<CreateProducts />} />
        </Route>
        {/* <Route path={path.ADMIN} element={<AdminHome />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
