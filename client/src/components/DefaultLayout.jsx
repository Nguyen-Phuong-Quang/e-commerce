import React from "react";
import MenuBar from "./MenuBar";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import { userStateContext } from "../contexts/StateProvider";

export default function DefaultLayout() {
    const { currentUser } = userStateContext();

    const main = () => {
        if (currentUser.role === "CUSTOMER" || !localStorage.getItem("TOKEN"))
            return (
                <div className="w-full shadow-xl bg-white rounded-xl">
                    <Outlet />
                </div>
            );

        return (
            <>
                <div className="w-1/6 h-screen">
                    <SideBar />
                </div>
                <div className="w-5/6 shadow-xl bg-white rounded-xl">
                    <Outlet />
                </div>
            </>
        );
    };

    return (
        <div className="card relative w-screen">
            <MenuBar />
            <div className="w-full flex justify-center mt-16 mb-4 pt-4 min-h-[100vh]">
                <div className="w-5/6 flex gap-4">{main()}</div>
            </div>
        </div>
    );
}
