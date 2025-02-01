import NavBar from "@/components/NavBar";
import React from "react";
import { Outlet } from "react-router-dom";
import LandingPage from "./LandingPage";

const LayoutPublic = () => {
    return (
        <div className=" w-full md:flex">

            <LandingPage />
        </div>
    )
};

export default LayoutPublic;
