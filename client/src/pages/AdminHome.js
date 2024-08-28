import React, { memo, useEffect } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../components";
import { useSelector } from "react-redux";
import path from "../ultils/path";
import { useNavigate } from "react-router-dom";
import TopHeader from "../components/TopHeader";
const AdminHome = () => {
  const navigate = useNavigate();
  const { isLoggedIn, current } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn && !current.role == 0) {
      navigate(`/${path.LOGIN}`);
    }
  }, []);

  return (
    <div className="h-full flex bg-white min-h-screen">
      <div className="w-[290px] flex-none fixed top-0 left-0 bottom-0">
        <Sidebar />
      </div>
      <div className="flex-auto ml-[290px]">
        <TopHeader />
        <Outlet />
      </div>
    </div>
  );
};

export default memo(AdminHome);
