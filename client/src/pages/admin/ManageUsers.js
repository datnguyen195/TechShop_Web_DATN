import React, { useEffect } from "react";
import { apiGetUser } from "../../apis/user";

const ManageUsers = () => {
  const fetchUser = async (parmas) => {
    const reponse = await apiGetUser(parmas);
    console.log(reponse);
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="h-[75px] flex justify-between items-center text-3xl font-bold px-4 border-b">
      <h1>
        <span>ManageUsers</span>
      </h1>
    </div>
  );
};

export default ManageUsers;
