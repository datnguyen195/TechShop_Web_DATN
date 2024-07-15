import React from "react";
import { Sidebar } from "../../components";

const Home = () => {
  return (
    <div className="w-main flex">
      <div className="flex flex-col gap-5 w-[30%] flex-auto border">
        <Sidebar />
        <span>Deal daily</span>
      </div>
      <div className="flex flex-col gap-5 w-[70%] flex-auto border">
        <Sidebar />
        <span>Best seller</span>
      </div>
    </div>
  );
};

export default Home;
