import React from "react";
import { Route, Routes } from "react-router-dom";
import path from "./ultils/path";
import {
  AdminHome,
  CreateProducts,
  Dashboard,
  Login,
  ManageOrder,
  ManageProducts,
  ManageUsers,
} from "./pages";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="min-h-screen">
      <Routes>
        <Route path={path.LOGIN} element={<Login />} />
        <Route path={path.ADMIN} element={<AdminHome />}>
          <Route path={path.DASHBOARD} element={<Dashboard />} />
          <Route path={path.MANAGE_ORDER} element={<ManageOrder />} />
          <Route path={path.MANAGE_PRODUCTS} element={<ManageProducts />} />
          <Route path={path.MANAGE_USERS} element={<ManageUsers />} />
          <Route path={path.CREATEP_RODUCTS} element={<CreateProducts />} />
          <Route path={path.PRO_FILE} element={<Profile />} />
        </Route>
        {/* <Route path={path.ADMIN} element={<AdminHome />}></Route> */}
      </Routes>
    </div>
  );
}

export default App;
