import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Header, Navigation } from "../../components";
import { useSelector } from "react-redux";
import path from "../../ultils/path";
const AdminHome = () => {
  const { isLoggedIn, curent } = useSelector((state) => state.user);
  // if (!isLoggedIn || !curent || +curent.role !== 0) {
  //   console.log(path.LOGIN);
  //   console.log(path.curent);

  //   // return <Navigate to={`/${path.LOGIN}`} />;
  // }
  console.log(path.LOGIN);
  console.log("curent", path.curent);
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <div>thanhhbcnis</div>
      <Navigation />
      <div className="w-[1220px]">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminHome;
