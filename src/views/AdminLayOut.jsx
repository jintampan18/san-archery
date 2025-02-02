import DashBoard from "@/components/admin/DashBoard";
import OrderById from "@/components/admin/OrderById";
import TopBar from "@/components/admin/TopBar";
import React from "react";
import { Outlet } from "react-router-dom";

const AdminLayOut = () => {
  return (
    <div>
      <TopBar />
      <div className=" min-h-screen bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayOut;
