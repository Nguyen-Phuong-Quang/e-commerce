import React from "react";
import { userStateContext } from "../contexts/StateProvider";
import { Navigate, Outlet, Link } from "react-router-dom";
import route from "../constants/route";
import { InputText } from "primereact/inputtext";
import { Avatar } from "primereact/avatar";

export default function DefaultLayout() {
    const { userToken } = userStateContext();
    // if (!userToken) return <Navigate to={route.SIGNIN} />;

    const start = (
        <Link className="mr-2 h-16" to={route.HOME}>
            <img
                alt="logo"
                src="https://primefaces.org/cdn/primereact/images/logo.png"
                className="mr-2 h-16 hover:cursor-pointer p-2"
            ></img>
        </Link>
    );
    const search = (
        <span className="p-input-icon-left p-input-icon-right w-1/3">
            <i className="pi pi-search" />
            <InputText
                placeholder="Search"
                type="text"
                className="my-2 w-full rounded-full"
            />
            <i className="pi pi-spin pi-spinner" />
        </span>
    );

    const end = () => {
        if (!userToken)
            return (
                <div className="flex h-full items-center">
                    <Link
                        to={route.SIGNIN}
                        className="font-bold hover:cursor-pointer hover:text-white hover:bg-blue-400 text-blue-400 h-2/3 flex justify-center px-4 items-center border-2 border-blue-400 rounded-lg mr-4"
                    >
                        Sign in
                    </Link>
                    <Link
                        to={route.SIGNUP}
                        className="font-bold hover:cursor-pointer hover:text-white hover:bg-red-400 text-red-400 h-2/3 flex justify-center px-4 items-center border-2 border-red-400 rounded-lg"
                    >
                        Sign up
                    </Link>
                </div>
            );

        if (userToken) {
            return (
                <div className="flex h-full items-center">
                    <div className="px-6 hover:cursor-pointer hover:text-blue-400">
                        <i className="pi pi-shopping-cart text-2xl"></i>
                    </div>
                    <div className="hover:cursor-pointer relative group px-4">
                        <Avatar icon="pi pi-user" shape="circle" />
                        <div className="absolute right-0 invisible group-hover:visible pt-2 shadow-md rounded-lg bg-transparent">
                            <div className="border-b-2 border-x py-2 hover:bg-gray-200 border-t-2 rounded-t-lg overflow-hidden">
                                <Link
                                    className="w-32 flex items-center"
                                    to={route.PROFILE}
                                >
                                    <span className="pi pi-user mx-2"></span>{" "}
                                    Profile
                                </Link>
                            </div>
                            <div className="border-b-2 border-x py-2 hover:bg-gray-200">
                                <Link className="w-32" to={route.PROFILE}>
                                    <span className="pi pi-user mx-2"></span>{" "}
                                    Profile
                                </Link>
                            </div>
                            <div className="border-b-2 border-x py-2 hover:bg-gray-200 rounded-b-lg overflow-hidden">
                                <Link className="w-32" to={route.PROFILE}>
                                    <span className="pi pi-user mx-2"></span>{" "}
                                    Profile
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="card relative">
            <div className="container fixed top-0 h-16 flex justify-between px-4">
                {start}
                {search}
                {end()}
            </div>
            <div className="container mx-auto px-auto flex mt-16 pt-2">
                <div className="w-1/5 h-screen bg-gray-600 text-white">
                    Side bar
                </div>
                <div className="w-4/5">
                <div className="border-b-2 border-x py-2 hover:bg-gray-200">
                                <Link className="w-32" to={route.PRODUCTSELLER}>
                                   <strong>Product seller page</strong>
                                </Link>
                </div>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
