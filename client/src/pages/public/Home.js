import React from "react";
import { Outlet } from "react-router-dom";
import { Header, Navigation, Sidebar } from "../../components";
import { useSelector } from "react-redux";
const Home = () => {
  return (
    <div className="w-full flex flex-col items-center">
      <Header />
      <Navigation />
      <div className="w-[1220px]">
        <Outlet />
      </div>
    </div>
  );
};

export default Home;
