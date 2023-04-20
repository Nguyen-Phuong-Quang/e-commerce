import React from "react";
import MenuBar from "./MenuBar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return (
        <div className="card relative">
            <MenuBar />
            <div className="container mx-auto px-auto flex mt-16 pt-2">
                <div className="w-1/5 h-screen bg-gray-600 text-white">
                    Side bar
                </div>
                <div className="w-4/5">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
