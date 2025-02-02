import React from "react";
import { NavLink } from "react-router-dom";

const ManagerTopBar = () => {
  return (
    <div className="w-full h-32 bg-black flex justify-evenly items-center text-white font-bold text-2xl gap-10">
      <NavLink
        to="/manager/dashboard"
        className={({ isActive }) =>
          isActive
            ? " text-[#bf8347] cursor-pointer transition duration-300 ease-in-out transform scale-110"
            : "hover:text-[#bf8347] cursor-pointer transition duration-300 ease-in-out"
        }
      >
        Dashboard
      </NavLink>
      <NavLink
        to="/manager/product"
        className={({ isActive }) =>
          isActive
            ? "text-[#bf8347] cursor-pointer transition duration-300 ease-in-out transform scale-110"
            : "hover:text-[#bf8347] cursor-pointer transition duration-300 ease-in-out"
        }
      >
        Product
      </NavLink>
    </div>
  );
};

export default ManagerTopBar;
