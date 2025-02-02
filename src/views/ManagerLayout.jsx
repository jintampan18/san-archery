import ManagerTopBar from "@/components/manager/components/ManagerTopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const ManagerLayout = () => {
  return (
    <div>
      <ManagerTopBar />
      <div className=" min-h-screen bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default ManagerLayout;
